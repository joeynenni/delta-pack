import { Writer as _Writer, Reader as _Reader } from 'bin-serde'
import {
	writeInt,
	readInt,
	writeFloat,
	readFloat,
	writeString,
	readString,
	writeBoolean,
	readBoolean,
	IReader,
	IWriter
} from '../.generated/schema'
import { DebugLogger } from '../../utils/debug'

const Writer = _Writer as unknown as IWriter
const Reader = _Reader as unknown as IReader

describe('Primitive Helpers', () => {
	let writer: IWriter
	let reader: IReader

	beforeEach(() => {
		writer = new Writer()
	})

	test('should write and read integers', () => {
		DebugLogger.setCurrentTest('primitive-int')
		const value = 42
		writeInt(writer, value)
		reader = new Reader(writer.toBuffer())
		expect(readInt(reader)).toBe(value)
	})

	test('should write and read floats', () => {
		DebugLogger.setCurrentTest('primitive-float')
		const value = 3.14159
		writeFloat(writer, value)
		reader = new Reader(writer.toBuffer())
		expect(readFloat(reader)).toBeCloseTo(value, 5)
	})

	test('should write and read strings', () => {
		DebugLogger.setCurrentTest('primitive-string')
		const value = 'test string'
		writeString(writer, value)
		reader = new Reader(writer.toBuffer())
		expect(readString(reader)).toBe(value)
	})

	test('should write and read booleans', () => {
		DebugLogger.setCurrentTest('primitive-boolean')
		writeBoolean(writer, true)
		writeBoolean(writer, false)
		reader = new Reader(writer.toBuffer())
		expect(readBoolean(reader)).toBe(true)
		expect(readBoolean(reader)).toBe(false)
	})
})
