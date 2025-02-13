import { Writer, Reader } from 'bin-serde'
import { HEADERS, NO_DIFF } from '../constants'
import { Schema } from '../types'
import { BitTracker } from '../utils/tracker'

type SchemaRecord = Record<string, Schema<any>>

export function createObject<T extends SchemaRecord>(
	schemas: T
): Schema<{ [K in keyof T]: ReturnType<T[K]['decode']> }> {
	// Create a map of field names to indices at schema creation time
	const fieldIndices = Object.keys(schemas).reduce(
		(acc, key, index) => {
			acc[key] = index
			return acc
		},
		{} as Record<string, number>
	)

	return {
		validate: validateObject,
		encode: encodeObject,
		decode: decodeObject,
		encodeDiff: encodeDiff
	}

	function validateObject(obj: any): string[] {
		if (!obj || typeof obj !== 'object') {
			return [`Invalid object: ${String(obj)}`]
		}
		return Object.entries(schemas).flatMap(([key, schema]) => {
			const errors = schema.validate(obj[key])
			return errors.map((error) => `${key}: ${error}`)
		})
	}

	function encodeObject(obj: any): Uint8Array {
		const writer = new Writer()
		writer.writeUInt8(HEADERS.FULL_OBJECT)

		for (const [key, schema] of Object.entries(schemas)) {
			const binary = schema.encode(obj[key])
			writer.writeUVarint(binary.length)
			writer.writeBuffer(binary)
		}

		return writer.toBuffer()
	}

	function decodeObject(binary: Uint8Array | ArrayBuffer, prevState?: any): any {
		if (!binary || (binary instanceof Uint8Array && !binary.length)) {
			if (prevState === undefined) {
				throw new Error('Invalid binary data: empty buffer and no previous state')
			}
			return prevState
		}

		const reader = new Reader(binary instanceof ArrayBuffer ? new Uint8Array(binary) : binary)
		const header = reader.readUInt8()

		switch (header) {
			case HEADERS.FULL_OBJECT:
				return decodeFullObject(reader)
			case HEADERS.DELTA_OBJECT:
				return decodeDeltaObject(reader, prevState || {})
			case HEADERS.NO_CHANGE_OBJECT:
				if (prevState === undefined) {
					throw new Error('No previous state available')
				}
				return prevState
			case HEADERS.DELETION_OBJECT:
				return undefined
			case HEADERS.FULL_VALUE:
			case HEADERS.NO_CHANGE_VALUE:
			case HEADERS.DELETION_VALUE:
				// Create a new reader with the remaining buffer
				const remainingBuffer = reader.readBuffer(reader.remaining())
				const schema = Object.values(schemas)[0]
				return schema.decode(remainingBuffer, prevState)
			default:
				throw new Error(`Invalid header: ${header}`)
		}
	}

	function decodeFullObject(reader: Reader): any {
		const result: any = {}
		const schemaKeys = Object.keys(schemas)

		for (const key of schemaKeys) {
			const schema = schemas[key]
			const length = reader.readUVarint()
			const fieldBinary = reader.readBuffer(length)
			result[key] = schema.decode(fieldBinary)
		}

		return result
	}

	function decodeDeltaObject(reader: Reader, prevState: any): any {
		const result = { ...prevState }
		const numChanges = reader.readUVarint()
		const bitMask = reader.readBuffer(Math.ceil(numChanges / 8))
		const tracker = BitTracker.fromBinary(bitMask, numChanges)

		const schemaKeys = Object.keys(schemas)
		for (let i = 0; i < schemaKeys.length; i++) {
			if (tracker.next()) {
				const key = schemaKeys[reader.readUInt8()]
				const length = reader.readUVarint()
				const fieldBinary = reader.readBuffer(length)
				result[key] = schemas[key].decode(fieldBinary, prevState[key])
			}
		}

		return result
	}

	function encodeDiff(prev: any, next: any): Uint8Array {
		if (prev === next || next === NO_DIFF) {
			const writer = new Writer()
			writer.writeUInt8(HEADERS.NO_CHANGE_OBJECT)
			return writer.toBuffer()
		}

		if (next === undefined) {
			const writer = new Writer()
			writer.writeUInt8(HEADERS.DELETION_OBJECT)
			return writer.toBuffer()
		}

		const tracker = new BitTracker()
		const writer = new Writer()

		writer.writeUInt8(HEADERS.DELTA_OBJECT)
		encodeWithTracker(prev || {}, next, tracker, writer)

		const bitMask = tracker.toBinary()
		const finalWriter = new Writer()
		finalWriter.writeUVarint(tracker.length)
		finalWriter.writeBuffer(bitMask)
		finalWriter.writeBuffer(writer.toBuffer())

		return finalWriter.toBuffer()
	}

	function encodeWithTracker(prev: any, next: any, tracker: BitTracker, writer: Writer) {
		const schemaKeys = Object.keys(schemas)
		for (const key of schemaKeys) {
			const schema = schemas[key]
			const prevValue = prev[key]
			const nextValue = next[key]

			// Skip encoding if values are identical
			if (prevValue === nextValue) continue

			const delta = schema.encodeDiff(prevValue, nextValue)
			// Only include if there's an actual change
			if (delta.length > 1 || delta[0] !== HEADERS.NO_CHANGE_VALUE) {
				tracker.push(true)
				writer.writeUInt8(fieldIndices[key])
				writer.writeUVarint(delta.length)
				writer.writeBuffer(delta)
			} else {
				tracker.push(false)
			}
		}
	}
}
