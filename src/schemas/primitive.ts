import { Writer, Reader } from 'bin-serde'
import { Schema } from '../types'
import { HEADERS, NO_DIFF } from '../constants'

interface PrimitiveOptions<T> {
	name: string
	validate: (value: T) => boolean
	encode: (writer: Writer, value: T) => void
	decode: (reader: Reader) => T
}

export function createPrimitive<T>({
	name,
	validate,
	encode: encodeFn,
	decode: decodeFn
}: PrimitiveOptions<T>): Schema<T> {
	return {
		validate: validatePrimitive,
		encode: encodePrimitive,
		decode: decodePrimitive,
		encodeDiff: encodePrimitiveDiff
	}

	function validatePrimitive(value: T | undefined): string[] {
		if (value === undefined) return [`${name} is required`]
		return validate(value) ? [] : [`Invalid ${name}: ${value}`]
	}

	function encodePrimitive(value: T): Uint8Array {
		const errors = validatePrimitive(value)
		if (errors.length > 0) {
			throw new Error(errors[0])
		}
		const writer = new Writer()
		writer.writeUInt8(HEADERS.FULL_VALUE)
		encodeFn(writer, value)
		return writer.toBuffer()
	}

	function decodePrimitive(binary: Uint8Array | ArrayBuffer, prevState?: T): T {
		const data = binary instanceof ArrayBuffer ? new Uint8Array(binary) : binary
		if (!data?.length) {
			if (prevState === undefined) {
				throw new Error('Invalid binary data: empty buffer and no previous state')
			}
			return prevState
		}
		const reader = new Reader(data)
		const header = reader.readUInt8()
		return handlePrimitiveDecodeByHeader(header, reader, prevState)
	}

	function handlePrimitiveDecodeByHeader(header: number, reader: Reader, prevState?: T): T {
		switch (header) {
			case HEADERS.FULL_VALUE:
				return decodeFn(reader)
			case HEADERS.NO_CHANGE_VALUE:
				if (!prevState) throw new Error('No previous state available')
				return prevState
			case HEADERS.DELETION_VALUE:
				return undefined as T
			default:
				throw new Error(`Invalid header: ${header}`)
		}
	}

	function encodePrimitiveDiff(prev: T | undefined, next: T | typeof NO_DIFF | undefined): Uint8Array {
		const writer = new Writer()

		if (prev === next || next === NO_DIFF) {
			writer.writeUInt8(HEADERS.NO_CHANGE_VALUE)
			return writer.toBuffer()
		}

		if (next === undefined) {
			writer.writeUInt8(HEADERS.DELETION_VALUE)
			return writer.toBuffer()
		}

		if (prev === next) {
			writer.writeUInt8(HEADERS.NO_CHANGE_VALUE)
			return writer.toBuffer()
		}

		writer.writeUInt8(HEADERS.FULL_VALUE)
		encodeFn(writer, next)
		return writer.toBuffer()
	}
}

export const Int = createPrimitive({
	name: 'Int',
	validate: (value): value is number => typeof value === 'number' && Number.isInteger(value),
	encode: (writer, value) => writer.writeVarint(value as number),
	decode: (reader) => reader.readVarint()
})

export const Float = createPrimitive({
	name: 'Float',
	validate: (value): value is number =>
		typeof value === 'number' && Number.isFinite(value) && value >= -3.4e38 && value <= 3.4e38,
	encode: (writer, value) => writer.writeFloat(value as number),
	decode: (reader) => reader.readFloat()
})

export const String = createPrimitive({
	name: 'String',
	validate: (value): value is string => typeof value === 'string',
	encode: (writer, value) => {
		const bytes = new TextEncoder().encode(value as string)
		writer.writeUVarint(bytes.length)
		writer.writeBuffer(bytes)
	},
	decode: (reader) => {
		const length = reader.readUVarint()
		const bytes = reader.readBuffer(length)
		return new TextDecoder().decode(bytes)
	}
})

export const Boolean = createPrimitive({
	name: 'Boolean',
	validate: (value): value is boolean => typeof value === 'boolean',
	encode: (writer, value) => writer.writeUInt8(value ? 1 : 0),
	decode: (reader) => reader.readUInt8() === 1
})
