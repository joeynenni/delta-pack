import { createArray } from '../../schemas/array'
import { createObject } from '../../schemas/object'
import { optional } from '../../schemas/optional'
import { Int, String } from '../../schemas/primitive'

describe('Nested Array Removal', () => {
	const NestedSchema = createObject({
		rooms: createArray(
			createObject({
				id: String,
				players: createArray(
					createObject({
						id: String,
						inventory: createArray(
							createObject({
								itemId: String,
								count: Int,
								tags: createArray(String)
							})
						),
						status: optional(String)
					})
				),
				state: createObject({
					activeItems: createArray(String),
					settings: createObject({
						flags: createArray(String)
					})
				})
			})
		)
	})

	it('should handle removing items from deeply nested arrays', () => {
		const state1 = {
			rooms: [
				{
					id: 'room1',
					players: [
						{
							id: 'player1',
							inventory: [
								{
									itemId: 'sword',
									count: 1,
									tags: ['weapon', 'metal']
								}
							],
							status: 'active'
						}
					],
					state: {
						activeItems: ['sword'],
						settings: {
							flags: ['pvp']
						}
					}
				}
			]
		}

		const state2 = {
			rooms: [
				{
					id: 'room1',
					players: [
						{
							id: 'player1',
							inventory: [],
							status: 'inactive'
						}
					],
					state: {
						activeItems: [],
						settings: {
							flags: []
						}
					}
				}
			]
		}

		const delta = NestedSchema.encodeDiff(state1, state2)
		expect(NestedSchema.decode(delta, state1)).toEqual(state2)
	})

	it('should handle removing nested arrays entirely', () => {
		const state1 = {
			rooms: [
				{
					id: 'room1',
					players: [
						{
							id: 'player1',
							inventory: [
								{
									itemId: 'sword',
									count: 1,
									tags: ['weapon']
								}
							],
							status: 'active'
						}
					],
					state: {
						activeItems: ['sword'],
						settings: {
							flags: ['pvp']
						}
					}
				}
			]
		}

		const state2 = {
			rooms: []
		}

		const delta = NestedSchema.encodeDiff(state1, state2)
		expect(NestedSchema.decode(delta, state1)).toEqual(state2)
	})
})
