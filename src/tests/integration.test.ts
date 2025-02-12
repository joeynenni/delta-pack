import { createObject, createArray } from '../composite'
import { Int, String, Float, Boolean } from '../primitives'

describe('Integration Tests', () => {
	// Define a complex game state schema
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
		const decoded = GameStateSchema.decode(binary)
		expect(decoded).toEqual(gameState)
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

		const deltaBinary = GameStateSchema.encodeDiff(state1, state2)
		const decoded = GameStateSchema.decode(deltaBinary, state1)
		expect(decoded).toEqual(state2)
	})
})

describe('Advanced Integration Tests', () => {
	it('should handle empty arrays and nested empty objects', () => {
		const EmptyStateSchema = createObject({
			arrays: createObject({
				empty: createArray(Int),
				nested: createArray(createArray(String))
			}),
			objects: createArray(
				createObject({
					id: Int,
					data: createObject({})
				})
			)
		})

		const emptyState = {
			arrays: {
				empty: [],
				nested: [[]]
			},
			objects: [{ id: 1, data: {} }]
		}

		const binary = EmptyStateSchema.encode(emptyState)
		expect(EmptyStateSchema.decode(binary)).toEqual(emptyState)
	})

	it('should handle large nested structures with mixed types', () => {
		const LargeStateSchema = createObject({
			timestamp: Int,
			config: createObject({
				enabled: Boolean,
				parameters: createArray(Float),
				metadata: createObject({
					name: String,
					tags: createArray(String)
				})
			}),
			entities: createArray(
				createObject({
					id: Int,
					position: createObject({
						x: Float,
						y: Float,
						z: Float
					}),
					attributes: createArray(
						createObject({
							name: String,
							value: Float,
							active: Boolean
						})
					)
				})
			)
		})

		const largeState = {
			timestamp: 123456789,
			config: {
				enabled: true,
				parameters: [1.1, 2.2, 3.3],
				metadata: {
					name: 'test',
					tags: ['tag1', 'tag2']
				}
			},
			entities: [
				{
					id: 1,
					position: { x: 1.0, y: 2.0, z: 3.0 },
					attributes: [
						{ name: 'health', value: 100.0, active: true },
						{ name: 'shield', value: 50.0, active: false }
					]
				}
			]
		}

		const binary = LargeStateSchema.encode(largeState)
		expect(LargeStateSchema.decode(binary)).toEqual(largeState)

		// Test delta updates
		const updatedState = {
			...largeState,
			entities: [
				{
					...largeState.entities[0],
					position: { x: 1.5, y: 2.0, z: 3.0 },
					attributes: [
						{ name: 'health', value: 90.0, active: true },
						{ name: 'shield', value: 50.0, active: false }
					]
				}
			]
		}

		const delta = LargeStateSchema.encodeDiff(largeState, updatedState)
		expect(LargeStateSchema.decode(delta, largeState)).toEqual(updatedState)
	})
})
