import { createArray } from '../../schemas/array'
import { createObject } from '../../schemas/object'
import { Int, String, Float } from '../../schemas/primitive'

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
