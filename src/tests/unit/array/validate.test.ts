import { createArray } from '../../../schemas/array'
import { Int } from '../../../schemas/primitive'

describe('Array Schema Validation', () => {
	const IntArray = createArray(Int)
	const NestedArray = createArray(createArray(Int))

	it('should validate simple arrays', () => {
		expect(IntArray.validate([1, 2, 3])).toHaveLength(0)
		expect(IntArray.validate([1, '2' as any, 3])).toHaveLength(1)
	})

	it('should validate empty arrays', () => {
		expect(IntArray.validate([])).toHaveLength(0)
	})

	it('should reject non-array values', () => {
		expect(IntArray.validate(123 as any)).toHaveLength(1)
		expect(IntArray.validate({} as any)).toHaveLength(1)
		expect(IntArray.validate(null as any)).toHaveLength(1)
	})

	it('should validate nested arrays', () => {
		const validData = [
			[1, 2],
			[3, 4]
		]
		const invalidData = [
			[1, '2' as any],
			[3, 4]
		]

		expect(NestedArray.validate(validData)).toHaveLength(0)
		expect(NestedArray.validate(invalidData)).toHaveLength(1)
	})

	it('should validate nested array dimensions', () => {
		const invalidDimensions = [[1], [2, 3], [4, 5, 6]]
		expect(NestedArray.validate(invalidDimensions)).toHaveLength(0)
	})
})
