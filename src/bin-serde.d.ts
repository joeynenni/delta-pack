declare module 'bin-serde' {
	export class Writer {
		constructor()
		writeUInt8(val: number): this
		writeUInt32(val: number): this
		writeUInt64(val: bigint): this
		writeUVarint(val: number): this
		writeVarint(val: number): this
		writeFloat(val: number): this
		writeBits(bits: boolean[]): this
		writeString(val: string): this
		writeBuffer(buf: Uint8Array): this
		toBuffer(): Uint8Array
	}

	export class Reader {
		constructor(buf: ArrayBufferView)
		readUInt8(): number
		readUInt32(): number
		readUInt64(): bigint
		readUVarint(): number
		readVarint(): number
		readFloat(): number
		readBits(numBits: number): boolean[]
		readString(): string
		readBuffer(numBytes: number): Uint8Array
		remaining(): number
	}
}
