import { createArray } from '../../../schemas/array'
import { Int, Float } from '../../../schemas/primitive'

describe('Array Schema Diff Encoding', () => {
	const IntArray = createArray(Int)
	const NestedArray = createArray(createArray(Float))

	it('should encode element changes', () => {
		const prev = [1, 2, 3]
		const next = [1, 4, 3]
		const diff = IntArray.encodeDiff(prev, next)
		expect(diff.length).toBeLessThan(IntArray.encode(next).length)
	})

	it('should encode length changes', () => {
		const prev = [1, 2]
		const next = [1, 2, 3]
		const diff = IntArray.encodeDiff(prev, next)
		expect(diff.length).toBeLessThan(IntArray.encode(next).length)
	})

	it('should handle no changes efficiently', () => {
		const data = [1, 2, 3]
		const diff = IntArray.encodeDiff(data, data)
		expect(diff.length).toBeLessThan(10)
	})

	it('should encode nested array changes', () => {
		const prev = [
			[1.1, 1.2],
			[2.1, 2.2]
		]
		const next = [
			[1.1, 1.3],
			[2.1, 2.2]
		]
		const diff = NestedArray.encodeDiff(prev, next)
		expect(diff.length).toBeLessThan(NestedArray.encode(next).length)
	})
})
