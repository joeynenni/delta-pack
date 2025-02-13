import { HEADERS, NO_DIFF } from './constants'

/**
 * Core Schema interface that defines how a type should be validated,
 * encoded, and decoded
 * @template T The type of value this schema handles
 */
export interface Schema<T> {
	/**
	 * Validates a value against the schema
	 * @param value The value to validate
	 * @returns Array of error messages, empty if valid
	 */
	validate: (value: T | undefined) => string[]

	/**
	 * Encodes a value into a binary format
	 * @param value The value to encode
	 * @returns Binary representation as Uint8Array
	 */
	encode: (value: T) => Uint8Array

	/**
	 * Decodes a binary format back into a value
	 * @param binary The binary data to decode
	 * @param prevState Optional previous state for delta decoding
	 * @returns The decoded value
	 */
	decode: (binary: Uint8Array | ArrayBuffer, prevState?: T) => T

	/**
	 * Encodes the differences between two values
	 * @param prev Previous value
	 * @param next New value
	 * @returns Binary representation of the differences
	 */
	encodeDiff: (prev: T | undefined, next: T | typeof NO_DIFF | undefined) => Uint8Array
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

export type HeaderType = (typeof HEADERS)[keyof typeof HEADERS]
