import { Writer, Reader } from 'bin-serde'
import { HEADERS, NO_DIFF } from '../constants'
import { Schema } from '../types'

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
		const reader = new Reader(binary instanceof ArrayBuffer ? new Uint8Array(binary) : binary)

		if (!binary || (binary instanceof Uint8Array && !binary.length)) {
			return prevState || {}
		}

		const header = reader.readUInt8()

		if (header === HEADERS.DELETION_OBJECT) {
			return undefined
		}

		if (header === HEADERS.NO_CHANGE_OBJECT) {
			return prevState || {}
		}

		const result = prevState ? { ...prevState } : {}

		if (header === HEADERS.DELTA_OBJECT) {
			const numChanges = reader.readUVarint()

			for (let i = 0; i < numChanges; i++) {
				// Read field index instead of string
				const fieldIndex = reader.readUInt8()
				const key = Object.keys(schemas)[fieldIndex]

				const length = reader.readUVarint()
				const fieldBinary = reader.readBuffer(length)
				result[key] = schemas[key].decode(fieldBinary, prevState?.[key])
			}
		} else if (header === HEADERS.FULL_OBJECT) {
			for (const [key, schema] of Object.entries(schemas)) {
				const length = reader.readUVarint()
				const fieldBinary = reader.readBuffer(length)
				result[key] = schema.decode(fieldBinary)
			}
		} else {
			throw new Error(`Invalid header: ${header}`)
		}

		return result
	}

	function encodeDiff(prev: any, next: any): Uint8Array {
		const writer = new Writer()

		if (prev === next || next === NO_DIFF) {
			writer.writeUInt8(HEADERS.NO_CHANGE_OBJECT)
			return writer.toBuffer()
		}

		if (!next) {
			writer.writeUInt8(HEADERS.DELETION_OBJECT)
			return writer.toBuffer()
		}

		if (!prev) {
			return encodeObject(next)
		}

		// Quick shallow comparison first
		let hasChanges = false
		const schemaKeys = Object.keys(schemas)
		for (const key of schemaKeys) {
			if (prev[key] !== next[key]) {
				hasChanges = true
				break
			}
		}

		if (!hasChanges) {
			writer.writeUInt8(HEADERS.NO_CHANGE_OBJECT)
			return writer.toBuffer()
		}

		writer.writeUInt8(HEADERS.DELTA_OBJECT)

		// Collect and encode only the changed fields
		const changedFields: Array<{ key: string; binary: Uint8Array }> = []

		for (const key of schemaKeys) {
			const schema = schemas[key]
			const prevValue = prev[key]
			const nextValue = next[key]

			// Skip encoding if values are identical
			if (prevValue === nextValue) continue

			const delta = schema.encodeDiff(prevValue, nextValue)
			// Only include if there's an actual change
			if (delta.length > 1 || delta[0] !== HEADERS.NO_CHANGE_VALUE) {
				changedFields.push({ key, binary: delta })
			}
		}

		// If no actual changes after detailed check, return no-change
		if (changedFields.length === 0) {
			writer.writeUInt8(HEADERS.NO_CHANGE_OBJECT)
			return writer.toBuffer()
		}

		// Write number of changed fields
		writer.writeUVarint(changedFields.length)

		// Write changed fields
		for (const { key, binary } of changedFields) {
			// Write field index instead of string
			writer.writeUInt8(fieldIndices[key])
			writer.writeUVarint(binary.length)
			writer.writeBuffer(binary)
		}

		return writer.toBuffer()
	}
}
