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
	return {
		validate: (arr: unknown): string[] => {
			if (!Array.isArray(arr)) {
				return [`Invalid array: ${String(arr)}`]
			}
			return validateArrayItems(arr, itemSchema)
		},
		encode: (arr): Uint8Array => {
			if (arr === undefined) {
				throw new Error("Cannot encode an undefined array")
			}
			const writer = new Writer()
			writer.writeUInt8(0x00)
			writer.writeUVarint(arr.length)
			arr.forEach((item) => {
				const itemBinary = itemSchema.encode(item)
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
				return Array.from({ length }, () => {
					const itemLength = reader.readUVarint()
					const itemBinary = reader.readBuffer(itemLength)
					return itemSchema.decode(itemBinary)!
				})
			} else if (header === 0x01) {
				if (prevState === undefined) {
					throw new Error('No previous state provided for delta update')
				}
				return prevState
			} else if (header === 0x02) {
				if (prevState === undefined) {
					return []
				}
				
				const length = reader.readUVarint()
				const result = new Array(length)
				for (let i = 0; i < length; i++) {
					const changed = reader.readUInt8() === 1
					if (changed) {
						const itemLength = reader.readUVarint()
						const itemBinary = reader.readBuffer(itemLength)
						result[i] = itemSchema.decode(itemBinary, i < prevState.length ? prevState[i] : undefined)
					} else {
						result[i] = i < prevState.length ? prevState[i] : undefined!
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
				writer.writeUVarint(0)
				return writer.toBuffer()
			}
			
			if (prev === undefined) {
				writer.writeUInt8(0x00)
				writer.writeUVarint(next.length)
				next.forEach(item => {
					const itemBinary = itemSchema.encode(item)
					writer.writeUVarint(itemBinary.length)
					writer.writeBuffer(itemBinary)
				})
				return writer.toBuffer()
			}
			
			writer.writeUInt8(0x02)
			writer.writeUVarint(next.length)
			next.forEach((item, i) => {
				const prevItem = i < prev.length ? prev[i] : undefined
				if (prevItem === item) {
					writer.writeUInt8(0)
				} else {
					writer.writeUInt8(1)
					const itemDiff = itemSchema.encodeDiff(prevItem, item)
					writer.writeUVarint(itemDiff.length)
					writer.writeBuffer(itemDiff)
				}
			})
			return writer.toBuffer()
		}
	}
}

export function createObject<T extends object>(properties: {
	[K in keyof T]: Schema<T[K]>
}): Schema<T> {
	return {
		validate: (obj: unknown): string[] => {
			if (typeof obj !== 'object' || obj === null) {
				return [`Invalid object: ${String(obj)}`]
			}
			return validateObjectProperties(obj as T, properties)
		},
		encode: (obj): Uint8Array => {
			if (obj === undefined) {
				throw new Error("Cannot encode an undefined object")
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
				
				if (prevState === undefined) {
					return {} as T
				}
				
				const result = { ...prevState }
				for (const key in properties) {
					const changed = reader.readUInt8() === 1
					if (changed) {
						const len = reader.readUVarint()
						const fieldBinary = reader.readBuffer(len)
						result[key] = properties[key].decode(fieldBinary, prevState[key])!
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
				writer.writeUInt8(0x00)
				for (const key in properties) {
					const fieldBinary = properties[key].encode(next[key])
					writer.writeUVarint(fieldBinary.length)
					writer.writeBuffer(fieldBinary)
				}
				return writer.toBuffer()
			}
			
			writer.writeUInt8(0x02)
			for (const key in properties) {
				const prevValue = prev[key]
				const nextValue = next[key]
				if (prevValue === nextValue) {
					writer.writeUInt8(0)
				} else {
					writer.writeUInt8(1)
					const fieldDiff = properties[key].encodeDiff(prevValue, nextValue)
					writer.writeUVarint(fieldDiff.length)
					writer.writeBuffer(fieldDiff)
				}
			}
			return writer.toBuffer()
		}
	}
}
