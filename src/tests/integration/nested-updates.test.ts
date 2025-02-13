import { createArray } from '../../schemas/array'
import { createObject } from '../../schemas/object'
import { optional } from '../../schemas/optional'
import { Int, String } from '../../schemas/primitive'

describe('Nested Structure Updates', () => {
	const GameState = createObject({
		players: createArray(
			createObject({
				id: String,
				inventory: createObject({
					items: createArray(
						createObject({
							id: String,
							count: Int
						})
					),
					gold: Int
				}),
				status: optional(String)
			})
		),
		world: createObject({
			time: Int,
			weather: String
		})
	})

	it('should handle deep nested updates', () => {
		const state1 = {
			players: [
				{
					id: 'player1',
					inventory: {
						items: [{ id: 'sword', count: 1 }],
						gold: 100
					}
				}
			],
			world: { time: 0, weather: 'sunny' }
		}

		const state2 = {
			players: [
				{
					id: 'player1',
					inventory: {
						items: [{ id: 'sword', count: 2 }],
						gold: 90
					},
					status: 'active'
				}
			],
			world: { time: 1, weather: 'sunny' }
		}

		const delta = GameState.encodeDiff(state1 as any, state2 as any)
		expect(GameState.decode(delta, state1 as any)).toEqual(state2)
	})
})
