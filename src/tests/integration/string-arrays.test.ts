import { createArray } from '../../schemas/array'
import { createObject } from '../../schemas/object'
import { Int, String } from '../../schemas/primitive'

describe('String Array Edge Cases', () => {
	const StringArraySchema = createArray(String)
	const ContainerSchema = createObject({
		id: Int,
		tags: createArray(String)
	})

	it('should handle empty string arrays', () => {
		const state1 = { id: 1, tags: [] }
		const state2 = { id: 1, tags: ['tag1'] }

		const delta = ContainerSchema.encodeDiff(state1, state2)
		expect(ContainerSchema.decode(delta, state1)).toEqual(state2)
	})

	it('should handle string array reordering', () => {
		const arr1 = ['a', 'b', 'c']
		const arr2 = ['c', 'a', 'b']

		const delta = StringArraySchema.encodeDiff(arr1, arr2)
		expect(StringArraySchema.decode(delta, arr1)).toEqual(arr2)
	})

	it('should handle string array with duplicates', () => {
		const arr1 = ['a', 'a', 'b']
		const arr2 = ['b', 'a', 'a']

		const delta = StringArraySchema.encodeDiff(arr1, arr2)
		expect(StringArraySchema.decode(delta, arr1)).toEqual(arr2)
	})
})
