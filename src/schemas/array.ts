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

		if (header === HEADERS.NO_CHANGE_ARRAY) {
			return prevState || []
		}

		if (header === HEADERS.EMPTY_ARRAY) {
			return []
		}

		if (header === HEADERS.DELTA_ARRAY) {
			const length = reader.readUVarint()
			const result = new Array(length)
			const changeFlags = readChangeFlags(reader, length)

			for (let i = 0; i < length; i++) {
				if (changeFlags[i]) {
					const itemLength = reader.readUVarint()
					const itemBinary = reader.readBuffer(itemLength)
					result[i] = itemSchema.decode(itemBinary, prevState?.[i])
				} else {
					result[i] = prevState?.[i]
				}
			}
			return result
		}

		return decodeFullArray(reader)
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

		// Calculate and write change flags
		const changes = new Array(next.length).fill(false)
		for (let i = 0; i < next.length; i++) {
			changes[i] = !prev[i] || JSON.stringify(prev[i]) !== JSON.stringify(next[i])
		}
		writeChangeFlags(writer, changes)

		// Write changed items
		for (let i = 0; i < next.length; i++) {
			if (changes[i]) {
				const itemDelta = itemSchema.encodeDiff(prev[i], next[i])
				writer.writeUVarint(itemDelta.length)
				writer.writeBuffer(itemDelta)
			}
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

function writeChangeFlags(writer: Writer, flags: boolean[]): void {
	const numBytes = Math.ceil(flags.length / 8)

	for (let i = 0; i < numBytes; i++) {
		let byte = 0
		for (let j = 0; j < 8; j++) {
			const idx = i * 8 + j
			if (idx < flags.length && flags[idx]) {
				byte |= 1 << j
			}
		}
		writer.writeUInt8(byte)
	}
}
