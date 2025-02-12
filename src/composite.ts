import { Writer, Reader } from 'bin-serde'
import { Schema } from './types'
import { validateObjectProperties } from './utils'

function validateArrayItems<T>(arr: T[], itemSchema: Schema<T>): string[] {
	const errors: string[] = []
	for (let i = 0; i < arr.length; i++) {
		const itemErrors = itemSchema.validate(arr[i])
		if (itemErrors.length > 0) {
			itemErrors.forEach((err) => {
				errors.push(`Item at index ${i}: ${err}`)
			})
		}
	}
	return errors
}

export function createArray<T>(itemSchema: Schema<T>): Schema<T[]> {
	const schema: Schema<T[]> = {
		validate: (arr: unknown): string[] => {
			if (!Array.isArray(arr)) {
				return [`Invalid array: ${String(arr)}`]
			}
			return validateArrayItems(arr, itemSchema)
		},
		encode: (arr): Uint8Array => {
			if (arr === undefined) {
				throw new Error('Cannot encode an undefined array')
			}
			const writer = new Writer()
			writer.writeUInt8(0x00)
			writer.writeUVarint(arr.length)
			arr.forEach((item) => {
				const itemBinary = itemSchema.encode(item ?? undefined)
				writer.writeUVarint(itemBinary.length)
				writer.writeBuffer(itemBinary)
			})
			return writer.toBuffer()
		},
		decode: (binary, prevState?): T[] => {
			const reader = new Reader(binary as ArrayBufferView)
			const header = reader.readUInt8()

			if (header === 0x00) {
				const length = reader.readUVarint()
				const result: T[] = []
				for (let i = 0; i < length; i++) {
					const itemLength = reader.readUVarint()
					const itemBinary = reader.readBuffer(itemLength)
					const decoded = itemSchema.decode(itemBinary)
					if (decoded !== undefined) {
						result.push(decoded)
					}
				}
				return result
			} else if (header === 0x01) {
				return prevState || []
			} else if (header === 0x02) {
				if (reader.remaining() === 0) {
					return []
				}

				const length = reader.readUVarint()
				const result: T[] = []

				for (let i = 0; i < length; i++) {
					const changed = reader.readUInt8() === 1
					if (changed) {
						const itemLength = reader.readUVarint()
						const itemBinary = reader.readBuffer(itemLength)
						const decoded = itemSchema.decode(itemBinary, prevState?.[i])
						if (decoded !== undefined) {
							result.push(decoded)
						}
					} else if (i < (prevState?.length ?? 0)) {
						const prevItem = prevState?.[i]
						if (prevItem !== undefined) {
							result.push(prevItem)
						}
					}
				}
				return result.filter((item) => item !== undefined && (!isObject(item) || Object.keys(item).length > 0))
			}
			throw new Error('Invalid header')
		},
		encodeDiff: (prev: T[] | undefined, next: T[] | undefined): Uint8Array => {
			const writer = new Writer()

			if (prev === next) {
				writer.writeUInt8(0x01)
				return writer.toBuffer()
			}

			if (next === undefined) {
				writer.writeUInt8(0x02)
				writer.writeUVarint(0)
				return writer.toBuffer()
			}

			if (prev === undefined) {
				return schema.encode(next)
			}

			if (next.length === 0) {
				writer.writeUInt8(0x02)
				writer.writeUVarint(0)
				return writer.toBuffer()
			}

			const filteredNext = next.filter(
				(item) => item !== undefined && (!isObject(item) || Object.keys(item).length > 0)
			)

			writer.writeUInt8(0x02)
			writer.writeUVarint(Math.max(prev.length, filteredNext.length))

			for (let i = 0; i < Math.max(prev.length, filteredNext.length); i++) {
				const prevItem = i < prev.length ? prev[i] : undefined
				const nextItem = i < filteredNext.length ? filteredNext[i] : undefined

				if (prevItem === nextItem) {
					writer.writeUInt8(0)
				} else {
					writer.writeUInt8(1)
					const itemDiff = itemSchema.encodeDiff(prevItem, nextItem ?? undefined)
					writer.writeUVarint(itemDiff.length)
					writer.writeBuffer(itemDiff)
				}
			}
			return writer.toBuffer()
		}
	}
	return schema
}

function isObject(value: unknown): value is object {
	return typeof value === 'object' && value !== null
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
				const result = {} as T
				for (const key in properties) {
					const len = reader.readUVarint()
					const fieldBinary = reader.readBuffer(len)
					result[key] = properties[key].decode(fieldBinary)!
				}
				return result
			} else if (header === 0x01) {
				if (prevState === undefined) {
					throw new Error('No previous state provided for delta update')
				}
				return prevState
			} else if (header === 0x02) {
				if (reader.remaining() === 0) {
					return undefined as any
				}

				const result = prevState ? { ...prevState } : ({} as T)
				for (const key in properties) {
					const changed = reader.readUInt8() === 1
					if (changed) {
						const len = reader.readUVarint()
						const fieldBinary = reader.readBuffer(len)
						result[key] = properties[key].decode(fieldBinary, prevState?.[key] as T[typeof key])!
					}
				}
				return result
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
			for (const key in properties) {
				const prevValue = prev[key]
				const nextValue = next[key]

				if (prevValue === nextValue) {
					writer.writeUInt8(0)
				} else {
					writer.writeUInt8(1)
					if (nextValue === undefined) {
						const fieldBinary = properties[key].encode(undefined as any)
						writer.writeUVarint(fieldBinary.length)
						writer.writeBuffer(fieldBinary)
					} else {
						const fieldDiff = properties[key].encodeDiff(prevValue, nextValue)
						writer.writeUVarint(fieldDiff.length)
						writer.writeBuffer(fieldDiff)
					}
				}
			}
			return writer.toBuffer()
		}
	}
	return schema
}
