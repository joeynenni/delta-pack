import { Schema } from '../types'
import { NO_DIFF } from '../constants'
import { Writer, Reader } from 'bin-serde'
import { HEADERS } from '../constants'

export function optional<T>(schema: Schema<T>): Schema<T | undefined> & { __optional: true } {
	return {
		validate: (value: T | undefined): string[] => {
			if (value === undefined) return []
			return schema.validate(value)
		},
		encode: (value: T | undefined): Uint8Array => {
			const writer = new Writer()
			writer.writeUInt8(value === undefined ? HEADERS.DELETION_VALUE : HEADERS.FULL_VALUE)
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

			switch (header) {
				case HEADERS.DELETION_VALUE:
					return undefined
				case HEADERS.FULL_VALUE:
					const fieldBinary = reader.readBuffer(data.length - 1)
					return schema.decode(fieldBinary, prevState)
				case HEADERS.NO_CHANGE_VALUE:
					return prevState
				default:
					throw new Error(`Invalid header: ${header}`)
			}
		},
		encodeDiff: (prev: T | undefined, next: T | typeof NO_DIFF | undefined): Uint8Array => {
			const writer = new Writer()

			if (prev === next || next === NO_DIFF) {
				writer.writeUInt8(HEADERS.NO_CHANGE_VALUE)
				return writer.toBuffer()
			}

			if (next === undefined) {
				writer.writeUInt8(HEADERS.DELETION_VALUE)
				return writer.toBuffer()
			}

			writer.writeUInt8(HEADERS.FULL_VALUE)
			const binary = prev !== undefined ? schema.encodeDiff(prev, next) : schema.encode(next)
			writer.writeBuffer(binary)
			return writer.toBuffer()
		},
		__optional: true
	}
}
