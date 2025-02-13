import { Writer, Reader } from 'bin-serde'
import { HEADERS, NO_DIFF } from '../constants'
import { Schema } from '../types'

export function createArray<T>(itemSchema: Schema<T>): Schema<T[] | undefined> {
	return {
		validate: validateArray,
		encode: encodeArray,
		decode: decodeArray,
		encodeDiff: encodeDiff
	}

	function validateArray(arr: T[] | undefined): string[] {
		if (arr === undefined) return []
		if (!Array.isArray(arr)) {
			return [`Invalid array: ${String(arr)}`]
		}
		return arr.flatMap((item, index) => {
			const errors = itemSchema.validate(item)
			return errors.map((error) => `[${index}] ${error}`)
		})
	}

	function encodeArray(arr: T[] | undefined): Uint8Array {
		if (!arr) {
			const writer = new Writer()
			writer.writeUInt8(HEADERS.DELETION_ARRAY)
			return writer.toBuffer()
		}

		const writer = new Writer()
		writer.writeUInt8(HEADERS.FULL_ARRAY)
		writer.writeUVarint(arr.length)

		for (const item of arr) {
			const itemBinary = itemSchema.encode(item)
			writer.writeUVarint(itemBinary.length)
			writer.writeBuffer(itemBinary)
		}
		return writer.toBuffer()
	}

	function decodeArray(binary: Uint8Array | ArrayBuffer, prevState?: T[]): T[] | undefined {
		const reader = new Reader(binary instanceof ArrayBuffer ? new Uint8Array(binary) : binary)
		const header = reader.readUInt8()

		if (header === HEADERS.DELETION_ARRAY) {
			return undefined
		}

		return handleArrayDecodeByHeader(header, reader, prevState)
	}

	function handleArrayDecodeByHeader(header: number, reader: Reader, prevState?: T[]): T[] {
		switch (header) {
			case HEADERS.FULL_ARRAY:
				return decodeFullArray(reader)
			case HEADERS.NO_CHANGE_ARRAY:
				return prevState || []
			case HEADERS.EMPTY_ARRAY:
				return []
			case HEADERS.DELTA_ARRAY:
				return decodeDeltaUpdates(reader, prevState)
			default:
				return prevState || []
		}
	}

	function decodeFullArray(reader: Reader): T[] {
		const length = reader.readUVarint()
		const result: T[] = new Array(length)

		for (let i = 0; i < length; i++) {
			const itemLength = reader.readUVarint()
			const itemBinary = reader.readBuffer(itemLength)
			result[i] = itemSchema.decode(itemBinary)
		}

		return result
	}

	function decodeDeltaUpdates(reader: Reader, prevState: T[] = []): T[] {
		const length = reader.readUVarint()
		const result: T[] = new Array(length)

		for (let i = 0; i < length; i++) {
			const itemLength = reader.readUVarint()
			const itemBinary = reader.readBuffer(itemLength)
			result[i] = itemSchema.decode(itemBinary, prevState[i])
		}

		return result
	}

	function encodeDiff(prev: T[] | undefined, next: T[] | typeof NO_DIFF | undefined): Uint8Array {
		const writer = new Writer()

		if (prev === next || next === NO_DIFF) {
			writer.writeUInt8(HEADERS.NO_CHANGE_ARRAY)
			return writer.toBuffer()
		}

		if (!next) {
			writer.writeUInt8(HEADERS.DELETION_ARRAY)
			return writer.toBuffer()
		}

		if (next.length === 0) {
			writer.writeUInt8(HEADERS.EMPTY_ARRAY)
			return writer.toBuffer()
		}

		if (!prev || prev.length === 0) {
			return encodeArray(next)
		}

		writer.writeUInt8(HEADERS.DELTA_ARRAY)
		writer.writeUVarint(next.length)

		for (let i = 0; i < next.length; i++) {
			const prevItem = prev[i]
			const nextItem = next[i]
			const itemDelta = itemSchema.encodeDiff(prevItem, nextItem)
			writer.writeUVarint(itemDelta.length)
			writer.writeBuffer(itemDelta)
		}

		return writer.toBuffer()
	}
}
