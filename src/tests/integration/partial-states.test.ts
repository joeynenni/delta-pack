import { createArray } from '../../schemas/array'
import { createObject } from '../../schemas/object'
import { optional } from '../../schemas/optional'
import { Int, String } from '../../schemas/primitive'

describe('Edge Cases with Partial States', () => {
	const GameSchema = createObject({
		mode: String,
		players: createArray(
			createObject({
				id: Int,
				name: String,
				status: optional(String)
			})
		)
	})

	it('should handle decoding with undefined previous state', () => {
		const state = {
			mode: 'lobby',
			players: []
		}
		const binary = GameSchema.encode(state)
		expect(() => GameSchema.decode(binary, undefined)).not.toThrow()
		expect(GameSchema.decode(binary, undefined)).toEqual(state)
	})

	it('should handle decoding partial updates with empty previous state', () => {
		const prevState = {} as any
		const newState = {
			mode: 'game',
			players: [{ id: 1, name: 'Player1' }]
		}
		const delta = GameSchema.encodeDiff(prevState, newState as any)
		expect(() => GameSchema.decode(delta, prevState)).not.toThrow()
		expect(GameSchema.decode(delta, prevState)).toEqual(newState)
	})

	it('should handle decoding with missing properties', () => {
		const prevState = {
			mode: 'lobby'
		} as any
		const newState = {
			mode: 'game',
			players: [{ id: 1, name: 'Player1' }]
		}
		const delta = GameSchema.encodeDiff(prevState, newState as any)
		expect(() => GameSchema.decode(delta, prevState)).not.toThrow()
		expect(GameSchema.decode(delta, prevState)).toEqual(newState)
	})
})
