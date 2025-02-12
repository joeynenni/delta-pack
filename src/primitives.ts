import { Writer, Reader } from 'bin-serde'
import { Schema } from './types'
import { validatePrimitive } from './utils'

export const createPrimitive = <T>(
	name: string,
	validate: (value: T) => boolean,
	encodeFn: (writer: Writer, value: T) => void,
	decodeFn: (reader: Reader) => T
): Schema<T> => ({
	validate: (value: T): string[] => validatePrimitive(validate(value), `Invalid ${name}: ${value}`),
	encode: (value): Uint8Array => {
		const writer = new Writer()
		writer.writeUInt8(0x00)
		encodeFn(writer, value as T)
		return writer.toBuffer()
	},
	decode: (binary, prevState?): T => {
		const reader = new Reader(binary)
		const header = reader.readUInt8()
		if (header === 0x00) {
			return decodeFn(reader)
		} else if (header === 0x01) {
			if (prevState === undefined) {
				throw new Error('No previous state provided for delta update')
			}
			return prevState
		} else if (header === 0x02) {
			return decodeFn(reader)
		} else {
			throw new Error('Invalid header')
		}
	},
	encodeDiff: (prev, next): Uint8Array => {
		const writer = new Writer()
		if (prev === next) {
			writer.writeUInt8(0x01)
		} else {
			writer.writeUInt8(0x02)
			encodeFn(writer, next as T)
		}
		return writer.toBuffer()
	}
})

export const Int = createPrimitive<number>(
	'int',
	(value) => Number.isInteger(value) && value >= -2147483648 && value <= 2147483647,
	(buf, value) => buf.writeVarint(value),
	(buf) => buf.readVarint()
)

export const Float = createPrimitive<number>(
	'float',
	(value) => typeof value === 'number' && isFinite(value),
	(buf, value) => buf.writeFloat(value),
	(buf) => {
		const val = buf.readFloat()
		return Number(val.toFixed(4)) // round to 4 decimals for consistency
	}
)

export const String = createPrimitive<string>(
	'string',
	(value) => typeof value === 'string',
	(writer, value) => writer.writeString(value),
	(reader) => reader.readString()
)

export const Boolean = createPrimitive<boolean>(
	'boolean',
	(value) => typeof value === 'boolean',
	(buf, value) => buf.writeUInt8(value ? 1 : 0),
	(buf) => buf.readUInt8() === 1
)
