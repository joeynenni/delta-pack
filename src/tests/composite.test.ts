import { createArray, createObject } from '../composite'
import { Int, String, Float } from '../primitives'

describe('Composite Schemas', () => {
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

	describe('Complex Composite Schemas', () => {
		const NestedArraySchema = createArray(createArray(Int))
		const ComplexObjectSchema = createObject({
			metadata: createObject({
				version: Int,
				tags: createArray(String)
			}),
			data: createArray(
				createObject({
					id: Int,
					matrix: createArray(createArray(Float))
				})
			)
		})

		describe('Nested Array Schema', () => {
			it('should handle nested arrays', () => {
				const data = [
					[1, 2],
					[3, 4],
					[5, 6]
				]
				expect(NestedArraySchema.validate(data)).toHaveLength(0)
				const binary = NestedArraySchema.encode(data)
				expect(NestedArraySchema.decode(binary)).toEqual(data)
			})

			it('should validate nested array items', () => {
				const invalidData = [
					[1, '2' as any],
					[3, 4]
				]
				expect(NestedArraySchema.validate(invalidData)).toHaveLength(1)
			})
		})

		describe('Complex Object Schema', () => {
			const complexData = {
				metadata: {
					version: 1,
					tags: ['test', 'complex']
				},
				data: [
					{
						id: 1,
						matrix: [
							[1.1, 1.2],
							[2.1, 2.2]
						]
					},
					{
						id: 2,
						matrix: [
							[3.1, 3.2],
							[4.1, 4.2]
						]
					}
				]
			}

			it('should handle complex nested structures', () => {
				expect(ComplexObjectSchema.validate(complexData)).toHaveLength(0)
				const binary = ComplexObjectSchema.encode(complexData)
				expect(ComplexObjectSchema.decode(binary)).toEqual(complexData)
			})

			it('should handle delta updates in complex structures', () => {
				const updatedData = {
					...complexData,
					data: [
						{
							...complexData.data[0],
							matrix: [
								[1.1, 1.3],
								[2.1, 2.2]
							]
						},
						complexData.data[1]
					]
				}

				const delta = ComplexObjectSchema.encodeDiff(complexData, updatedData)
				expect(ComplexObjectSchema.decode(delta, complexData)).toEqual(updatedData)
			})
		})
	})
})
