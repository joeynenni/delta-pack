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

		// First pass: identify which entities actually changed
		const entityChanges = new Array(next.length).fill(false)

		for (let i = 0; i < next.length; i++) {
			if (!prev[i] || hasEntityChanged(prev[i], next[i])) {
				entityChanges[i] = true
			}
		}

		// Write entity change mask
		writeChangeFlags(writer, entityChanges)

		// Only for changed entities, write their changes
		for (let i = 0; i < next.length; i++) {
			if (entityChanges[i]) {
				const itemDelta = itemSchema.encodeDiff(prev[i], next[i])
				writer.writeUVarint(itemDelta.length)
				writer.writeBuffer(itemDelta)
			}
		}

		return writer.toBuffer()
	}

	function hasEntityChanged(prev: T, next: T): boolean {
		// Fast equality check for primitives
		if (typeof prev !== typeof next) return true

		const type = typeof prev
		if (type === 'number' || type === 'string' || type === 'boolean') {
			return prev !== next
		}

		if (prev === null || next === null) {
			return prev !== next
		}

		if (Array.isArray(prev)) {
			if (!Array.isArray(next) || prev.length !== next.length) return true
			return prev.some((val, i) => val !== next[i])
		}

		// Type guard to ensure we're working with objects
		if (typeof prev !== 'object' || typeof next !== 'object') {
			return true
		}

		// At this point, we know both prev and next are objects
		const prevObj = prev as Record<string, unknown>
		const nextObj = next as Record<string, unknown>

		const prevKeys = Object.keys(prevObj)
		const nextKeys = Object.keys(nextObj)

		if (prevKeys.length !== nextKeys.length) return true

		// Use Set for faster key lookup
		const keySet = new Set(prevKeys)
		if (!nextKeys.every((key) => keySet.has(key))) return true

		return prevKeys.some((key) => prevObj[key] !== nextObj[key])
	}
}

function writeChangeFlags(writer: Writer, flags: boolean[]): void {
	const numBytes = Math.ceil(flags.length / 8)

	for (let byteIndex = 0; byteIndex < numBytes; byteIndex++) {
		let byte = 0
		for (let bitIndex = 0; bitIndex < 8; bitIndex++) {
			const flagIndex = byteIndex * 8 + bitIndex
			if (flagIndex < flags.length && flags[flagIndex]) {
				byte |= 1 << bitIndex
			}
		}
		writer.writeUInt8(byte)
	}
}

function readChangeFlags(reader: Reader, length: number): boolean[] {
	const flags: boolean[] = new Array(length)
	const numBytes = Math.ceil(length / 8)

	for (let byteIndex = 0; byteIndex < numBytes; byteIndex++) {
		const byte = reader.readUInt8()
		for (let bitIndex = 0; bitIndex < 8; bitIndex++) {
			const flagIndex = byteIndex * 8 + bitIndex
			if (flagIndex < length) {
				flags[flagIndex] = (byte & (1 << bitIndex)) !== 0
			}
		}
	}

	return flags
}
