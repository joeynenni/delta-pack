import { createArray } from '../../schemas/array'
import { createObject } from '../../schemas/object'
import { optional } from '../../schemas/optional'
import { Int, String } from '../../schemas/primitive'

describe('Basic Delta Updates', () => {
	const ItemSchema = createObject({
		id: Int,
		name: String,
		quantity: Int
	})

	const InventorySchema = createObject({
		items: createArray(ItemSchema),
		maxSlots: Int
	})

	describe('Object Delta Updates', () => {
		it('should handle undefined previous state', () => {
			const state = {
				items: [{ id: 1, name: 'Sword', quantity: 1 }],
				maxSlots: 10
			}

			const delta = InventorySchema.encodeDiff(undefined, state)
			expect(InventorySchema.decode(delta)).toEqual(state)
		})

		it('should handle undefined next state', () => {
			const state = {
				items: [{ id: 1, name: 'Sword', quantity: 1 }],
				maxSlots: 10
			}

			const delta = InventorySchema.encodeDiff(state, undefined)
			expect(() => InventorySchema.decode(delta, state)).not.toThrow()
		})
	})

	describe('Array Delta Updates', () => {
		const ItemArraySchema = createArray(ItemSchema)

		it('should handle undefined previous state in arrays', () => {
			const items = [
				{ id: 1, name: 'Sword', quantity: 1 },
				{ id: 2, name: 'Shield', quantity: 1 }
			]

			const delta = ItemArraySchema.encodeDiff(undefined, items)
			expect(ItemArraySchema.decode(delta)).toEqual(items)
		})

		it('should handle undefined next state in arrays', () => {
			const items = [
				{ id: 1, name: 'Sword', quantity: 1 },
				{ id: 2, name: 'Shield', quantity: 1 }
			]

			const delta = ItemArraySchema.encodeDiff(items, undefined)
			expect(() => ItemArraySchema.decode(delta, items)).not.toThrow()
		})
	})
})

describe('Delta Updates Edge Cases', () => {
	const ComplexSchema = createObject({
		id: Int,
		data: optional(
			createObject({
				items: createArray(
					createObject({
						key: String,
						value: optional(Int)
					})
				),
				metadata: optional(String)
			})
		)
	})

	it('should handle deeply nested optional fields', () => {
		const state1 = {
			id: 1,
			data: {
				items: [
					{ key: 'a', value: 1 },
					{ key: 'b', value: undefined }
				],
				metadata: 'test'
			}
		}

		const state2 = {
			id: 1,
			data: {
				items: [
					{ key: 'a', value: undefined },
					{ key: 'b', value: 2 }
				],
				metadata: undefined
			}
		}

		const delta = ComplexSchema.encodeDiff(state1, state2)
		expect(ComplexSchema.decode(delta, state1)).toEqual(state2)
	})

	it('should handle array reordering with optional fields', () => {
		const state1 = {
			id: 1,
			data: {
				items: [
					{ key: 'a', value: 1 },
					{ key: 'b', value: 2 }
				]
			}
		}

		const state2 = {
			id: 1,
			data: {
				items: [
					{ key: 'b', value: 2 },
					{ key: 'a', value: 1 }
				]
			}
		}

		const delta = ComplexSchema.encodeDiff(state1 as any, state2 as any)
		expect(ComplexSchema.decode(delta, state1 as any)).toEqual(state2)
	})
})
