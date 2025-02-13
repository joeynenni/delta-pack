import { Writer, Reader } from 'bin-serde'
import { HEADERS, NO_DIFF } from '../constants'
import { Schema } from '../types'
import { BitTracker } from '../utils/tracker'

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

		const tracker = new BitTracker()
		const deltaWriter = new Writer()

		// Track changes and write deltas
		for (let i = 0; i < next.length; i++) {
			const itemDelta = itemSchema.encodeDiff(prev[i], next[i])
			if (itemDelta.length > 1 || itemDelta[0] !== HEADERS.NO_CHANGE_VALUE) {
				tracker.push(true)
				deltaWriter.writeUVarint(itemDelta.length)
				deltaWriter.writeBuffer(itemDelta)
			} else {
				tracker.push(false)
			}
		}

		// Write bit mask and deltas
		const bitMask = tracker.toBinary()
		writer.writeUVarint(bitMask.length)
		writer.writeBuffer(bitMask)
		writer.writeBuffer(deltaWriter.toBuffer())

		return writer.toBuffer()
	}

	function decodeArray(binary: Uint8Array | ArrayBuffer, prevState?: T[]): T[] | undefined {
		if (!binary || (binary instanceof Uint8Array && !binary.length)) {
			if (prevState === undefined) {
				throw new Error('Invalid binary data: empty buffer and no previous state')
			}
			return prevState
		}

		const reader = new Reader(binary instanceof ArrayBuffer ? new Uint8Array(binary) : binary)
		const header = reader.readUInt8()

		switch (header) {
			case HEADERS.DELETION_ARRAY:
				return undefined
			case HEADERS.NO_CHANGE_ARRAY:
				return prevState || []
			case HEADERS.EMPTY_ARRAY:
				return []
			case HEADERS.DELTA_ARRAY:
				return decodeDeltaArray(reader, prevState)
			case HEADERS.FULL_ARRAY:
				return decodeFullArray(reader)
			case HEADERS.FULL_VALUE:
			case HEADERS.NO_CHANGE_VALUE:
			case HEADERS.DELETION_VALUE: {
				// Pass the first element of the previous state (if any) to the item decoder
				const decodedItem = itemSchema.decode(binary, prevState ? prevState[0] : undefined)
				return [decodedItem]
			}
			default:
				throw new Error(`Invalid header: ${header}`)
		}
	}

	function decodeDeltaArray(reader: Reader, prevState?: T[]): T[] {
		const length = reader.readUVarint()
		const result = new Array(length)

		// Use a fallback for prevState
		const baseArray = prevState || []

		// Read bit mask
		const bitsLength = reader.readUVarint()
		const bitMask = reader.readBuffer(Math.ceil(bitsLength / 8))
		const tracker = BitTracker.fromBinary(bitMask, bitsLength)

		// Apply changes
		for (let i = 0; i < length; i++) {
			if (tracker.next()) {
				const itemLength = reader.readUVarint()
				const itemBinary = reader.readBuffer(itemLength)
				const prevItem = i < baseArray.length ? baseArray[i] : undefined
				result[i] = itemSchema.decode(itemBinary, prevItem)
			}
		}

		return result
	}

	function decodeFullArray(reader: Reader): T[] {
		const length = reader.readUVarint()
		const result = new Array(length)

		for (let i = 0; i < length; i++) {
			const itemLength = reader.readUVarint()
			const itemBinary = reader.readBuffer(itemLength)
			result[i] = itemSchema.decode(itemBinary)
		}

		return result
	}
}
