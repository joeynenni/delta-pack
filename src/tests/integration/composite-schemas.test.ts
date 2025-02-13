import { createArray } from '../../schemas/array'
import { createObject } from '../../schemas/object'
import { Int, String } from '../../schemas/primitive'

describe('Basic Composite Schemas', () => {
	describe('Array Schema', () => {
		const IntArray = createArray(Int)

		it('should validate arrays', () => {
			expect(IntArray.validate([1, 2, 3])).toHaveLength(0)
			expect(IntArray.validate([1, '2' as any, 3])).toHaveLength(1)
		})

		it('should encode and decode arrays', () => {
			const arr = [1, 2, 3]
			const binary = IntArray.encode(arr)
			expect(IntArray.decode(binary)).toEqual(arr)
		})

		it('should handle delta updates', () => {
			const arr1 = [1, 2, 3]
			const arr2 = [1, 4, 3]
			const delta = IntArray.encodeDiff(arr1, arr2)
			expect(IntArray.decode(delta, arr1)).toEqual(arr2)
		})
	})

	describe('Object Schema', () => {
		const PersonSchema = createObject({
			id: Int,
			name: String
		})

		it('should validate objects', () => {
			expect(PersonSchema.validate({ id: 1, name: 'Test' })).toHaveLength(0)
			expect(PersonSchema.validate({ id: '1' as any, name: 'Test' })).toHaveLength(1)
		})

		it('should encode and decode objects', () => {
			const person = { id: 1, name: 'Test' }
			const binary = PersonSchema.encode(person)
			expect(PersonSchema.decode(binary)).toEqual(person)
		})

		it('should handle delta updates', () => {
			const person1 = { id: 1, name: 'Alice' }
			const person2 = { id: 1, name: 'Bob' }
			const delta = PersonSchema.encodeDiff(person1, person2)
			expect(PersonSchema.decode(delta, person1)).toEqual(person2)
		})
	})
})
