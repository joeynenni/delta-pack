import { createObject } from '../../../schemas/object'
import { createArray } from '../../../schemas/array'
import { Int, String, Float } from '../../../schemas/primitive'

describe('Object Schema Decoding', () => {
	const NestedSchema = createObject({
		config: createObject({
			version: Int,
			features: createArray(String)
		}),
		items: createArray(
			createObject({
				id: Int,
				coords: createArray(Float)
			})
		)
	})

	const testData = {
		config: {
			version: 1,
			features: ['f1', 'f2']
		},
		items: [
			{ id: 1, coords: [1.0, 2.0] },
			{ id: 2, coords: [3.0, 4.0] }
		]
	}

	it('should decode full state', () => {
		const binary = NestedSchema.encode(testData)
		expect(NestedSchema.decode(binary)).toEqual(testData)
	})

	it('should decode with previous state', () => {
		const binary = NestedSchema.encode(testData)
		const prevState = {
			config: {
				version: 0,
				features: ['f0']
			},
			items: []
		}
		expect(NestedSchema.decode(binary, prevState)).toEqual(testData)
	})

	it('should handle partial updates', () => {
		const updatedData = {
			...testData,
			items: [
				{ id: 1, coords: [1.5, 2.0] },
				{ id: 2, coords: [3.0, 4.0] }
			]
		}
		const delta = NestedSchema.encodeDiff(testData, updatedData)
		expect(NestedSchema.decode(delta, testData)).toEqual(updatedData)
	})

	it('should handle undefined values', () => {
		const binary = NestedSchema.encodeDiff(testData, undefined)
		expect(NestedSchema.decode(binary, testData)).toBeUndefined()
	})
})
