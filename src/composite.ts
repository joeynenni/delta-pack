import { Writer, Reader } from 'bin-serde'
import { Schema } from './types'

function validateArrayItems<T>(arr: T[], itemSchema: Schema<T>): string[] {
	for (let i = 0; i < arr.length; i++) {
		const errors = itemSchema.validate(arr[i])
		if (errors.length > 0) {
			return errors
		}
	}
	return []
}

function validateObjectProperties<T extends object>(obj: T, properties: { [K in keyof T]: Schema<T[K]> }): string[] {
	for (const [key, schema] of Object.entries(properties) as [keyof T, Schema<T[keyof T]>][]) {
		const errors = schema.validate(obj[key])
		if (errors.length > 0) {
			return errors
		}
	}
	return []
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
			const reader = new Reader(binary)
			const header = reader.readUInt8()
			if (header === 0x00) {
				const length = reader.readUVarint()
				return Array.from({ length }, () => {
					const itemLength = reader.readUVarint()
					const itemBinary = reader.readBuffer(itemLength)
					return itemSchema.decode(itemBinary)
				})
			} else if (header === 0x01) {
				if (prevState === undefined) {
					throw new Error('No previous state provided for delta update')
				}
				return prevState
			} else if (header === 0x02) {
				if (prevState === undefined) {
					throw new Error('No previous state provided for delta update')
				}
				const length = reader.readUVarint()
				return Array.from({ length }, (_, i) => {
					const changed = reader.readUInt8() === 1
					if (changed) {
						const itemLength = reader.readUVarint()
						const itemBinary = reader.readBuffer(itemLength)
						return itemSchema.decode(itemBinary, prevState[i])
					}
					return prevState[i]
				})
			} else {
				throw new Error('Invalid header')
			}
		},
		encodeDiff: (prev, next): Uint8Array => {
			const writer = new Writer()
			if (prev === next) {
				writer.writeUInt8(0x01)
				return writer.toBuffer()
			}
			writer.writeUInt8(0x02)
			writer.writeUVarint(next.length)
			next.forEach((item, i) => {
				const itemDiff = itemSchema.encodeDiff(prev[i], item)
				const diffReader = new Reader(itemDiff)
				const diffHeader = diffReader.readUInt8()
				writer.writeUInt8(diffHeader === 0x02 ? 1 : 0)
				if (diffHeader === 0x02) {
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
			const reader = new Reader(binary)
			const header = reader.readUInt8()
			if (header === 0x00) {
				const result = {} as T
				for (const key in properties) {
					const len = reader.readUVarint()
					const fieldBinary = reader.readBuffer(len)
					result[key] = properties[key].decode(fieldBinary)
				}
				return result
			} else if (header === 0x01) {
				if (prevState === undefined) {
					throw new Error('No previous state provided for delta update')
				}
				return prevState
			} else if (header === 0x02) {
				if (prevState === undefined) {
					throw new Error('No previous state provided for delta update')
				}
				const result = { ...prevState }
				for (const key in properties) {
					const changed = reader.readUInt8() === 1
					if (changed) {
						const len = reader.readUVarint()
						const fieldBinary = reader.readBuffer(len)
						result[key] = properties[key].decode(fieldBinary, prevState[key])
					}
				}
				return result
			} else {
				throw new Error('Invalid header')
			}
		},
		encodeDiff: (prev, next): Uint8Array => {
			const writer = new Writer()
			let hasChanges = false
			const fieldDiffs: { key: keyof T; binary: Uint8Array }[] = []

			for (const key in properties) {
				const fieldDiff = properties[key].encodeDiff(prev[key], next[key])
				const diffReader = new Reader(fieldDiff)
				if (diffReader.readUInt8() === 0x02) {
					hasChanges = true
				}
				fieldDiffs.push({ key, binary: fieldDiff })
			}

			if (!hasChanges) {
				writer.writeUInt8(0x01)
			} else {
				writer.writeUInt8(0x02)
				for (const { binary } of fieldDiffs) {
					const diffReader = new Reader(binary)
					const header = diffReader.readUInt8()
					writer.writeUInt8(header === 0x02 ? 1 : 0)
					if (header === 0x02) {
						writer.writeUVarint(binary.length)
						writer.writeBuffer(binary)
					}
				}
			}
			return writer.toBuffer()
		}
	}
}
