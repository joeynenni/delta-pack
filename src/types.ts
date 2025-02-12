import { Writer as BinSerdeWriter, Reader as BinSerdeReader } from 'bin-serde'

export const NO_DIFF = Symbol('NODIFF')

export type DeepPartial<T> = T extends object
	? { [P in keyof T]: DeepPartial<T[P]> | typeof NO_DIFF }
	: T | typeof NO_DIFF

export class Tracker {
	private bits: boolean[] = []
	private idx: number = 0

	push(val: boolean): void {
		this.bits.push(val)
	}
	next(): boolean {
		return this.bits[this.idx++]
	}
}

export interface Schema<T> {
	validate(value: unknown): string[]
	encode(value: T): Uint8Array
	decode(binary: Uint8Array, prevState?: T): T
	encodeDiff(prev: T, next: T): Uint8Array
}

export interface Writer {
	writeUInt8(value: number): void
	writeVarint(value: number): void
	writeUVarint(value: number): void
	writeFloat64(value: number): void
	writeBytes(bytes: Uint8Array): void
	toUint8Array(): Uint8Array
}

export interface Reader {
	readUInt8(): number
	readVarint(): number
	readUVarint(): number
	readFloat64(): number
	readBytes(length: number): Uint8Array
}

export function optional<T>(schema: Schema<T>): Schema<T | undefined> {
	return {
		validate: (value: unknown): string[] => {
			if (value === undefined) return []
			return schema.validate(value)
		},
		encode: (value: T | undefined): Uint8Array => {
			const writer = new BinSerdeWriter()
			if (value === undefined) {
				writer.writeUInt8(0x01)
			} else {
				writer.writeUInt8(0x00)
				const binary = schema.encode(value)
				writer.writeBuffer(binary)
			}
			return writer.toBuffer()
		},
		decode: (binary: Uint8Array, prevState?: T): T | undefined => {
			const reader = new BinSerdeReader(binary)
			const header = reader.readUInt8()
			if (header === 0x01) return undefined
			if (header === 0x00 || header === 0x02) {
				const fieldBinary = reader.readBuffer(binary.length - 1)
				return schema.decode(fieldBinary, prevState)
			}
			throw new Error('Invalid header in optional field')
		},
		encodeDiff: (prev: T | undefined, next: T | undefined): Uint8Array => {
			if (prev === next) {
				const writer = new BinSerdeWriter()
				writer.writeUInt8(0x01)
				return writer.toBuffer()
			}

			const writer = new BinSerdeWriter()
			writer.writeUInt8(0x02)

			if (next === undefined) {
				writer.writeUInt8(0x01)
			} else if (prev === undefined) {
				const binary = schema.encode(next)
				writer.writeBuffer(binary)
			} else {
				const diffBinary = schema.encodeDiff(prev, next)
				writer.writeBuffer(diffBinary)
			}

			return writer.toBuffer()
		}
	}
}
