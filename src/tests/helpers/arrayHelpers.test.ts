import { Writer as _Writer, Reader as _Reader } from 'bin-serde'
import { writeArray, readArray, writeInt, readInt, writeFloat, readFloat, IWriter, IReader } from '../.generated/schema'
import { DebugLogger } from '../../utils/debug'

const Writer = _Writer as unknown as IWriter
const Reader = _Reader as unknown as IReader

describe('Array Helpers', () => {
	let writer: IWriter
	let reader: IReader

	beforeEach(() => {
		writer = new Writer()
	})

	test('should write and read arrays of primitives', () => {
		DebugLogger.setCurrentTest('array-primitives')
		const numbers = [1, 2, 3, 4, 5]
		writeArray(writer, numbers, (n) => writeInt(writer, n))

		reader = new Reader(writer.toBuffer())
		const result = readArray(reader, () => readInt(reader))
		expect(result).toEqual(numbers)
	})

	test('should handle empty arrays', () => {
		DebugLogger.setCurrentTest('array-empty')
		const empty: number[] = []
		writeArray(writer, empty, (n) => writeInt(writer, n))

		reader = new Reader(writer.toBuffer())
		const result = readArray(reader, () => readInt(reader))
		expect(result).toEqual([])
	})

	test('should write and read arrays of objects', () => {
		DebugLogger.setCurrentTest('array-objects')
		const positions = [
			{ x: 1.5, y: 2.5 },
			{ x: 3.5, y: 4.5 }
		]

		writeArray(writer, positions, (pos) => {
			writeFloat(writer, pos.x)
			writeFloat(writer, pos.y)
		})

		reader = new Reader(writer.toBuffer())
		const result = readArray(reader, () => ({
			x: readFloat(reader),
			y: readFloat(reader)
		}))

		expect(result).toEqual(positions)
	})
})
