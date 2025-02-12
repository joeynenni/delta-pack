import { Writer, Reader } from 'bin-serde'
import { Schema } from './types'
import { validateObjectProperties } from './utils'

function isEqual(a: any, b: any): boolean {
	if (a === b) return true
	if (a === undefined || b === undefined) return false
	if (a === null || b === null) return false
	if (typeof a !== 'object') return a === b

	const aKeys = Object.keys(a)
	const bKeys = Object.keys(b)

	if (aKeys.length !== bKeys.length) return false
	return aKeys.every((key) => isEqual(a[key], b[key]))
}

export function createArray<T>(itemSchema: Schema<T>): Schema<T[]> {
	const schema: Schema<T[]> = {
		validate: (arr: unknown): string[] => {
			if (!Array.isArray(arr)) {
				return [`Invalid array: ${String(arr)}`]
			}
			return arr.flatMap((item, index) => {
				const errors = itemSchema.validate(item)
				return errors.map((error) => `[${index}] ${error}`)
			})
		},
		encode: (arr: T[]): Uint8Array => {
			const writer = new Writer()
			writer.writeUInt8(0x00)

			if (!arr) {
				writer.writeUVarint(0)
				return writer.toBuffer()
			}

			writer.writeUVarint(arr.length)

			for (const item of arr) {
				const itemBinary = itemSchema.encode(item)
				writer.writeUVarint(itemBinary.length)
				writer.writeBuffer(itemBinary)
			}
			return writer.toBuffer()
		},
		decode: (binary: Uint8Array | ArrayBuffer, prevState?: T[]): T[] => {
			const data = binary instanceof ArrayBuffer ? new Uint8Array(binary) : binary
			const reader = new Reader(data)
			const header = reader.readUInt8()

			if (header === 0x00) {
				const length = reader.readUVarint()
				const result: T[] = []
				for (let i = 0; i < length; i++) {
					const len = reader.readUVarint()
					const itemBinary = reader.readBuffer(len)
					const decodedItem = itemSchema.decode(itemBinary)
					if (decodedItem !== undefined) {
						result.push(decodedItem)
					}
				}
				return result
			}

			if (header === 0x03) {
				if (!prevState) return []

				const finalLength = reader.readUVarint()
				const changesCount = reader.readUVarint()
				const result = [...prevState]

				// Truncate or extend array as needed
				result.length = finalLength

				// Apply changes
				for (let i = 0; i < changesCount; i++) {
					const index = reader.readUVarint()
					const len = reader.readUVarint()
					const itemBinary = reader.readBuffer(len)
					const decodedItem = itemSchema.decode(itemBinary, prevState[index])

					if (decodedItem !== undefined) {
						result[index] = decodedItem
					} else {
						delete result[index]
					}
				}

				// Filter out undefined values while preserving length
				return result.filter((item) => item !== undefined) as T[]
			}

			if (header === 0x02 && reader.remaining() === 0) {
				return undefined as any
			}

			return prevState || []
		},
		encodeDiff: (prev: T[] | undefined, next: T[] | undefined): Uint8Array => {
			const writer = new Writer()

			if (!next) {
				writer.writeUInt8(0x02)
				return writer.toBuffer()
			}

			if (!prev) {
				return schema.encode(next)
			}

			if (prev === next || JSON.stringify(prev) === JSON.stringify(next)) {
				writer.writeUInt8(0x01)
				return writer.toBuffer()
			}

			const isValidItem = (item: any): boolean => {
				if (item === undefined) return false
				if (Array.isArray(item)) return true
				if (typeof item !== 'object') return true
				if (item === null) return false
				return Object.keys(item).length > 0
			}

			const filteredPrev = prev.filter(isValidItem)
			const filteredNext = next.filter(isValidItem)

			writer.writeUInt8(0x03)
			writer.writeUVarint(filteredNext.length)

			const changes: Array<{ index: number; value: T }> = []

			for (let i = 0; i < Math.max(filteredPrev.length, filteredNext.length); i++) {
				const prevItem = filteredPrev[i]
				const nextItem = filteredNext[i]

				if (JSON.stringify(prevItem) !== JSON.stringify(nextItem)) {
					changes.push({ index: i, value: nextItem })
				}
			}

			writer.writeUVarint(changes.length)

			for (const change of changes) {
				writer.writeUVarint(change.index)
				const itemDiff = itemSchema.encodeDiff(filteredPrev[change.index], change.value)
				writer.writeUVarint(itemDiff.length)
				writer.writeBuffer(itemDiff)
			}

			return writer.toBuffer()
		}
	}

	return schema
}

export function createObject<T extends object>(properties: {
	[K in keyof T]: Schema<T[K]>
}): Schema<T> {
	const schema: Schema<T> = {
		validate: (obj: unknown): string[] => {
			if (typeof obj !== 'object' || obj === null) {
				return [`Invalid object: ${String(obj)}`]
			}
			return validateObjectProperties(obj as T, properties)
		},
		encode: (obj): Uint8Array => {
			if (obj === undefined) {
				throw new Error('Cannot encode an undefined object')
			}
			const writer = new Writer()
			writer.writeUInt8(0x00)
			for (const key in properties) {
				const fieldBinary = properties[key].encode(obj[key])
				writer.writeUVarint(fieldBinary.length)
				writer.writeBuffer(fieldBinary)
			}
			return writer.toBuffer()
		},
		decode: (binary, prevState?): T => {
			const data = binary instanceof ArrayBuffer ? new Uint8Array(binary) : binary
			const reader = new Reader(data)
			const header = reader.readUInt8()

			if (header === 0x00) {
				// Full object encode
				const result = {} as T
				for (const key in properties) {
					const len = reader.readUVarint()
					const fieldBinary = reader.readBuffer(len)
					const value = properties[key].decode(fieldBinary)
					if (value !== undefined) {
						result[key] = value
					}
				}
				return result
			} else if (header === 0x02) {
				if (reader.remaining() === 0) {
					return undefined as any
				}

				// Start with previous state or empty object
				const result = prevState ? { ...prevState } : ({} as T)

				// Read number of changed fields
				const changedFieldsCount = reader.readUVarint()

				// Apply changes
				for (let i = 0; i < changedFieldsCount; i++) {
					const fieldIndex = reader.readUVarint()
					const key = Object.keys(properties)[fieldIndex] as keyof T
					const len = reader.readUVarint()
					const fieldBinary = reader.readBuffer(len)
					const value = properties[key].decode(fieldBinary, prevState?.[key])

					if (value !== undefined) {
						result[key] = value
					} else {
						delete result[key]
					}
				}

				return result
			} else if (header === 0x01) {
				return prevState || ({} as T)
			}

			throw new Error('Invalid header')
		},
		encodeDiff: (prev, next): Uint8Array => {
			const writer = new Writer()

			if (prev === next) {
				writer.writeUInt8(0x01)
				return writer.toBuffer()
			}

			if (next === undefined) {
				writer.writeUInt8(0x02)
				return writer.toBuffer()
			}

			if (prev === undefined) {
				return schema.encode(next)
			}

			writer.writeUInt8(0x02)

			// Create bitmap of changed fields
			const changedFields = new Set<keyof T>()
			for (const key in properties) {
				const typedKey = key as keyof T
				const nextValue = next[typedKey]
				const prevValue = prev[typedKey]

				if (!isEqual(prevValue, nextValue)) {
					changedFields.add(typedKey)
				}
			}

			// Write number of changed fields
			writer.writeUVarint(changedFields.size)

			// Write changes
			for (const key of changedFields) {
				// Write field index instead of field presence
				writer.writeUVarint(Object.keys(properties).indexOf(key as string))
				const fieldDiff = properties[key].encodeDiff(prev[key], next[key])
				writer.writeUVarint(fieldDiff.length)
				writer.writeBuffer(fieldDiff)
			}

			return writer.toBuffer()
		}
	}
	return schema
}
