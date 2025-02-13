import { createArray } from '../../../schemas/array'
import { Int, Float } from '../../../schemas/primitive'

describe('Array Schema Decoding', () => {
	const IntArray = createArray(Int)
	const NestedArray = createArray(createArray(Float))

	it('should decode full state', () => {
		const data = [1, 2, 3]
		const binary = IntArray.encode(data)
		expect(IntArray.decode(binary)).toEqual(data)
	})

	it('should decode with previous state', () => {
		const prev = [1, 2, 3]
		const next = [1, 4, 3]
		const delta = IntArray.encodeDiff(prev, next)
		expect(IntArray.decode(delta, prev)).toEqual(next)
	})

	it('should decode nested arrays', () => {
		const data = [
			[1.125, 1.25],
			[2.125, 2.25]
		]
		const binary = NestedArray.encode(data)
		const decoded = NestedArray.decode(binary)

		expect(decoded?.[0]?.[0]).toBeCloseTo(data[0][0], 5)
		expect(decoded?.[0]?.[1]).toBeCloseTo(data[0][1], 5)
		expect(decoded?.[1]?.[0]).toBeCloseTo(data[1][0], 5)
		expect(decoded?.[1]?.[1]).toBeCloseTo(data[1][1], 5)
	})

	it('should handle undefined values', () => {
		const data = [1, 2, 3]
		const binary = IntArray.encodeDiff(data, undefined)
		expect(IntArray.decode(binary, data)).toBeUndefined()
	})
})
