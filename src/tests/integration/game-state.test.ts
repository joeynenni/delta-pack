import { createArray } from '../../schemas/array'
import { createObject } from '../../schemas/object'
import { Int, String, Float } from '../../schemas/primitive'

describe('Game State Integration', () => {
	const PlayerSchema = createObject({
		id: Int,
		name: String,
		position: createObject({
			x: Float,
			y: Float
		}),
		inventory: createArray(String)
	})

	const GameStateSchema = createObject({
		tick: Int,
		players: createArray(PlayerSchema),
		worldSeed: Int
	})

	it('should handle full state encoding/decoding', () => {
		const gameState = {
			tick: 42,
			players: [
				{
					id: 1,
					name: 'Player1',
					position: { x: 10.5, y: 20.5 },
					inventory: ['sword', 'shield']
				}
			],
			worldSeed: 12345
		}

		const binary = GameStateSchema.encode(gameState)
		expect(GameStateSchema.decode(binary)).toEqual(gameState)
	})

	it('should handle delta updates', () => {
		const state1 = {
			tick: 1,
			players: [
				{
					id: 1,
					name: 'Player1',
					position: { x: 10, y: 20 },
					inventory: ['sword']
				}
			],
			worldSeed: 12345
		}

		const state2 = {
			tick: 2,
			players: [
				{
					id: 1,
					name: 'Player1',
					position: { x: 11, y: 20 },
					inventory: ['sword']
				}
			],
			worldSeed: 12345
		}

		const delta = GameStateSchema.encodeDiff(state1, state2)
		expect(GameStateSchema.decode(delta, state1)).toEqual(state2)
	})
})
