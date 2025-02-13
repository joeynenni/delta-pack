import { Writer, Reader } from 'bin-serde'
import { Schema } from '../types'
import { HEADERS, NO_DIFF } from '../constants'

type PrimitiveOptions<T> = {
	name: string
	validate: (value: T) => boolean
	encode: (writer: Writer, value: T) => void
	decode: (reader: Reader) => T
}

export function createPrimitive<T>(options: PrimitiveOptions<T>): Schema<T> {
	return {
		validate: (value: T | undefined): string[] => {
			if (value === undefined) return [`${options.name} is required`]
			return options.validate(value) ? [] : [`Invalid ${options.name}: ${value}`]
		},
		encode: (value: T): Uint8Array => {
			if (!options.validate(value)) {
				throw new Error(`Invalid ${options.name}: ${value}`)
			}
			const writer = new Writer()
			writer.writeUInt8(HEADERS.FULL_VALUE)
			options.encode(writer, value)
			return writer.toBuffer()
		},
		decode: (binary: Uint8Array | ArrayBuffer, prevState?: T): T => {
			if (!binary || (binary instanceof Uint8Array && !binary.length)) {
				if (prevState === undefined) {
					throw new Error('Invalid binary data: empty buffer and no previous state')
				}
				return prevState
			}
			const reader = new Reader(binary instanceof ArrayBuffer ? new Uint8Array(binary) : binary)
			const header = reader.readUInt8()

			switch (header) {
				case HEADERS.FULL_VALUE:
					return options.decode(reader)
				case HEADERS.NO_CHANGE_VALUE:
					if (prevState === undefined) {
						throw new Error('No previous state available')
					}
					return prevState
				case HEADERS.DELETION_VALUE:
					return undefined as T
				case HEADERS.FULL_OBJECT:
				case HEADERS.DELTA_OBJECT:
				case HEADERS.NO_CHANGE_OBJECT:
				case HEADERS.DELETION_OBJECT:
				case HEADERS.FULL_ARRAY:
				case HEADERS.DELTA_ARRAY:
				case HEADERS.NO_CHANGE_ARRAY:
				case HEADERS.DELETION_ARRAY:
				case HEADERS.EMPTY_ARRAY:
					// Handle nested structure headers by treating the entire buffer as the value
					const remainingBuffer = reader.readBuffer(reader.remaining())
					return options.decode(reader)
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
			if (!options.validate(next)) {
				throw new Error(`Invalid ${options.name}: ${next}`)
			}
			writer.writeUInt8(HEADERS.FULL_VALUE)
			options.encode(writer, next)
			return writer.toBuffer()
		}
	}
}

// Optimized primitive types with their encoders directly integrated
export const Int = createPrimitive({
	name: 'int',
	validate: (value: number) => Number.isInteger(value),
	encode: (writer: Writer, value: number) => {
		writer.writeVarint(value)
	},
	decode: (reader: Reader): number => {
		return reader.readVarint()
	}
})

export const Float = createPrimitive({
	name: 'float',
	validate: (value: number) => {
		if (typeof value !== 'number' || isNaN(value)) return false
		if (!isFinite(value)) return false
		if (Math.abs(value) > 3.4e38) return false
		return true
	},
	encode: (writer: Writer, value: number) => {
		writer.writeFloat(value)
	},
	decode: (reader: Reader): number => {
		return reader.readFloat()
	}
})

export const String = createPrimitive({
	name: 'string',
	validate: (value: string) => typeof value === 'string',
	encode: (writer: Writer, value: string) => {
		writer.writeString(value)
	},
	decode: (reader: Reader): string => {
		return reader.readString()
	}
})

export const Boolean = createPrimitive({
	name: 'boolean',
	validate: (value: boolean) => typeof value === 'boolean',
	encode: (writer: Writer, value: boolean) => {
		writer.writeUInt8(value ? 1 : 0)
	},
	decode: (reader: Reader): boolean => {
		return reader.readUInt8() === 1
	}
})
