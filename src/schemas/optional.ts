import { Schema } from '../types'
import { NO_DIFF } from '../constants'
import { Writer, Reader } from 'bin-serde'

export function optional<T>(schema: Schema<T>): Schema<T | undefined> & { __optional: true } {
	return {
		validate: (value: T | undefined): string[] => {
			if (value === undefined) return []
			return schema.validate(value)
		},
		encode: (value: T | undefined): Uint8Array => {
			const writer = new Writer()
			writer.writeUInt8(value === undefined ? 0x01 : 0x00)
			if (value !== undefined) {
				const binary = schema.encode(value)
				writer.writeBuffer(binary)
			}
			return writer.toBuffer()
		},
		decode: (binary: Uint8Array | ArrayBuffer, prevState?: T): T | undefined => {
			const data = binary instanceof ArrayBuffer ? new Uint8Array(binary) : binary
			const reader = new Reader(data)
			const header = reader.readUInt8()

			if (header === 0x01) {
				return undefined
			}

			const remainingLength = data.length - 1
			if (remainingLength <= 0) return undefined

			const fieldBinary = reader.readBuffer(remainingLength)
			return schema.decode(fieldBinary, prevState)
		},
		encodeDiff: (prev: T | undefined, next: T | typeof NO_DIFF | undefined): Uint8Array => {
			const writer = new Writer()

			if (prev === next || next === NO_DIFF) {
				writer.writeUInt8(0x01)
				return writer.toBuffer()
			}

			if (next === undefined) {
				writer.writeUInt8(0x02)
				return writer.toBuffer()
			}

			writer.writeUInt8(0x00)
			const binary = prev !== undefined ? schema.encodeDiff(prev, next) : schema.encode(next)
			writer.writeBuffer(binary)
			return writer.toBuffer()
		},
		__optional: true
	}
}
