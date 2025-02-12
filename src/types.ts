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
