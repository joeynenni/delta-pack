import { Writer, Reader } from 'bin-serde'
import { HEADERS, NO_DIFF } from '../constants'
import { Schema } from '../types'

type SchemaRecord = Record<string, Schema<any>>

export function createObject<T extends SchemaRecord>(
	schemas: T
): Schema<{ [K in keyof T]: ReturnType<T[K]['decode']> }> {
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
			const value = obj[key]
			const errors = schema.validate(value)
			return errors.map((error) => `${key}: ${error}`)
		})
	}

	function encodeObject(obj: any): Uint8Array {
		const writer = new Writer()
		writer.writeUInt8(HEADERS.FULL_OBJECT)

		for (const [key, schema] of Object.entries(schemas)) {
			const value = obj?.[key]
			const binary = schema.encode(value)
			writer.writeUVarint(binary.length)
			writer.writeBuffer(binary)
		}

		return writer.toBuffer()
	}

	function decodeObject(binary: Uint8Array | ArrayBuffer, prevState?: any): any {
		const reader = new Reader(binary instanceof ArrayBuffer ? new Uint8Array(binary) : binary)
		const header = reader.readUInt8()

		return handleObjectDecodeByHeader(header, reader, prevState)
	}

	function handleObjectDecodeByHeader(header: number, reader: Reader, prevState?: any): any {
		switch (header) {
			case HEADERS.FULL_OBJECT:
				return decodeFullObject(reader)
			case HEADERS.NO_CHANGE_OBJECT:
				return prevState || {}
			case HEADERS.DELETION_OBJECT:
				return undefined
			case HEADERS.DELTA_OBJECT:
				return decodeDeltaUpdates(reader, prevState)
			default:
				return prevState || {}
		}
	}

	function decodeFullObject(reader: Reader): any {
		const result: any = {}
		const schemaEntries = Object.entries(schemas)

		for (const [key, schema] of schemaEntries) {
			const length = reader.readUVarint()
			const binary = reader.readBuffer(length)
			result[key] = schema.decode(binary)
		}

		return result
	}

	function decodeDeltaUpdates(reader: Reader, prevState: any = {}): any {
		const result = { ...prevState }
		const changeCount = reader.readUVarint()

		for (let i = 0; i < changeCount; i++) {
			const keyIndex = reader.readUVarint()
			const key = Object.keys(schemas)[keyIndex]
			const schema = schemas[key]

			const length = reader.readUVarint()
			const binary = reader.readBuffer(length)
			result[key] = schema.decode(binary, prevState?.[key])
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

		const changes: Array<{ index: number; key: string; binary: Uint8Array }> = []
		const schemaEntries = Object.entries(schemas)

		for (let i = 0; i < schemaEntries.length; i++) {
			const [key, schema] = schemaEntries[i]
			const prevValue = prev[key]
			const nextValue = next[key]

			const delta = schema.encodeDiff(prevValue, nextValue)
			if (delta.length > 1 || delta[0] !== HEADERS.NO_CHANGE_VALUE) {
				changes.push({ index: i, key, binary: delta })
			}
		}

		if (changes.length === 0) {
			writer.writeUInt8(HEADERS.NO_CHANGE_OBJECT)
			return writer.toBuffer()
		}

		writer.writeUInt8(HEADERS.DELTA_OBJECT)
		writer.writeUVarint(changes.length)

		for (const { index, binary } of changes) {
			writer.writeUVarint(index)
			writer.writeUVarint(binary.length)
			writer.writeBuffer(binary)
		}

		return writer.toBuffer()
	}
}
