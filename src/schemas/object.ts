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
		const header = reader.readUInt8()

		if (header === HEADERS.DELETION_OBJECT) {
			return undefined
		}

		if (header === HEADERS.NO_CHANGE_OBJECT) {
			return prevState || {}
		}

		const result = prevState ? { ...prevState } : {}

		if (header === HEADERS.DELTA_OBJECT) {
			const schemaEntries = Object.entries(schemas)
			const changes = readChangeFlags(reader, schemaEntries.length)

			for (let i = 0; i < schemaEntries.length; i++) {
				if (changes[i]) {
					const [key, schema] = schemaEntries[i]
					const length = reader.readUVarint()
					const fieldBinary = reader.readBuffer(length)
					result[key] = schema.decode(fieldBinary, prevState?.[key])
				}
			}
		} else {
			for (const [key, schema] of Object.entries(schemas)) {
				const length = reader.readUVarint()
				const fieldBinary = reader.readBuffer(length)
				result[key] = schema.decode(fieldBinary)
			}
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

		const schemaEntries = Object.entries(schemas)
		const changes = new Array(schemaEntries.length).fill(false)
		const changedValues: Uint8Array[] = []

		// First pass: collect changes
		for (let i = 0; i < schemaEntries.length; i++) {
			const [key, schema] = schemaEntries[i]
			const prevValue = prev[key]
			const nextValue = next[key]

			const delta = schema.encodeDiff(prevValue, nextValue)
			if (delta.length > 1 || delta[0] !== HEADERS.NO_CHANGE_VALUE) {
				changes[i] = true
				changedValues.push(delta)
			}
		}

		if (changedValues.length === 0) {
			writer.writeUInt8(HEADERS.NO_CHANGE_OBJECT)
			return writer.toBuffer()
		}

		writer.writeUInt8(HEADERS.DELTA_OBJECT)

		// Write change flags as bits
		const numBytes = Math.ceil(changes.length / 8)
		for (let i = 0; i < numBytes; i++) {
			let byte = 0
			for (let j = 0; j < 8; j++) {
				const idx = i * 8 + j
				if (idx < changes.length && changes[idx]) {
					byte |= 1 << j
				}
			}
			writer.writeUInt8(byte)
		}

		// Write changed values
		for (const binary of changedValues) {
			writer.writeUVarint(binary.length)
			writer.writeBuffer(binary)
		}

		return writer.toBuffer()
	}
}

function readChangeFlags(reader: Reader, length: number): boolean[] {
	const flags: boolean[] = []
	const numBytes = Math.ceil(length / 8)

	for (let i = 0; i < numBytes; i++) {
		const byte = reader.readUInt8()
		for (let j = 0; j < 8 && flags.length < length; j++) {
			flags.push((byte & (1 << j)) !== 0)
		}
	}

	return flags
}
