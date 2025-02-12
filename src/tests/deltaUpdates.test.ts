import { Reader } from 'bin-serde'
import { createObject, createArray } from '../composite'
import { Int, String } from '../primitives'
import { optional } from '../types'

describe('Delta Updates', () => {
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

	describe('Complex Nested Delta Updates', () => {
		const GameStateSchema = createObject({
			inventory: optional(InventorySchema),
			equipment: createObject({
				weapon: optional(ItemSchema),
				armor: optional(ItemSchema)
			})
		})

		it('should handle complex state transitions with undefined values', () => {
			const state1 = {
				inventory: {
					items: [{ id: 1, name: 'Sword', quantity: 1 }],
					maxSlots: 10
				},
				equipment: {
					weapon: { id: 1, name: 'Sword', quantity: 1 },
					armor: undefined
				}
			}

			const state2 = {
				inventory: undefined,
				equipment: {
					weapon: undefined,
					armor: { id: 2, name: 'Leather Armor', quantity: 1 }
				}
			}

			const delta = GameStateSchema.encodeDiff(state1, state2)
			expect(GameStateSchema.decode(delta, state1)).toEqual(state2)
		})

		it('should handle partial updates in nested structures', () => {
			const state1 = {
				inventory: {
					items: [
						{ id: 1, name: 'Sword', quantity: 1 },
						{ id: 2, name: 'Shield', quantity: 1 }
					],
					maxSlots: 10
				},
				equipment: {
					weapon: { id: 1, name: 'Sword', quantity: 1 },
					armor: undefined
				}
			}

			const state2 = {
				inventory: {
					items: [
						{ id: 1, name: 'Sword', quantity: 2 }, // Only quantity changed
						{ id: 2, name: 'Shield', quantity: 1 }
					],
					maxSlots: 10
				},
				equipment: {
					weapon: { id: 1, name: 'Sword', quantity: 1 },
					armor: undefined
				}
			}

			const delta = GameStateSchema.encodeDiff(state1, state2)
			expect(GameStateSchema.decode(delta, state1)).toEqual(state2)
		})
	})

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

	describe('Array Entity Validation', () => {
		const EntitySchema = createObject({
			id: String,
			name: String
		})

		const GameStateSchema = createObject({
			players: createArray(EntitySchema),
			creatures: createArray(EntitySchema)
		})

		it('should not allow empty objects in arrays', () => {
			const state1 = {
				players: [{ id: 'player1', name: 'Alice' }],
				creatures: []
			}

			const state2 = {
				players: [
					{ id: 'player1', name: 'Alice' },
					{} // This should be handled
				],
				creatures: []
			}

			const delta = GameStateSchema.encodeDiff(state1, state2 as any)
			const decoded = GameStateSchema.decode(delta, state1)

			// Should filter out empty objects
			expect(decoded?.players).toHaveLength(1)
			expect(decoded?.players[0]).toEqual({ id: 'player1', name: 'Alice' })
		})

		it('should handle undefined array items correctly', () => {
			const state1 = {
				players: [
					{ id: 'player1', name: 'Alice' },
					{ id: 'player2', name: 'Bob' }
				],
				creatures: []
			}

			const state2 = {
				players: [undefined, { id: 'player2', name: 'Bob' }],
				creatures: []
			}

			const delta = GameStateSchema.encodeDiff(state1, state2 as any)
			const decoded = GameStateSchema.decode(delta, state1)

			// Should filter out undefined and empty objects
			expect(decoded?.players).toHaveLength(1)
			expect(decoded?.players[0]).toEqual({ id: 'player2', name: 'Bob' })
		})
	})

	describe('Delta Updates - Empty State Filtering', () => {
		const GameSchema = createObject({
			players: createArray(
				createObject({
					id: String,
					deck: createObject({
						cards: createArray(String)
					}),
					hand: createObject({
						cards: createArray(String)
					})
				})
			),
			spectators: createArray(String),
			info: createObject({
				status: optional(String)
			})
		})

		it('should preserve empty arrays and objects when they represent changes', () => {
			const state1 = {
				players: [
					{
						id: 'player1',
						deck: { cards: ['card1'] },
						hand: { cards: [] }
					}
				],
				spectators: ['spec1'],
				info: { status: 'active' }
			}

			const state2 = {
				players: [
					{
						id: 'player1',
						deck: { cards: [] },
						hand: { cards: [] }
					}
				],
				spectators: [],
				info: { status: undefined }
			}

			const delta = GameSchema.encodeDiff(state1, state2)
			const decoded = GameSchema.decode(delta, state1)

			// Should preserve empty arrays/objects when they represent actual changes
			expect(decoded).toEqual(state2)
		})

		it('should filter out unchanged empty arrays and objects from delta', () => {
			const state1 = {
				players: [
					{
						id: 'player1',
						deck: { cards: [] },
						hand: { cards: [] }
					}
				],
				spectators: [],
				info: { status: undefined }
			}

			const state2 = {
				players: [
					{
						id: 'player1',
						deck: { cards: [] },
						hand: { cards: ['newcard'] }
					}
				],
				spectators: [],
				info: { status: undefined }
			}

			const delta = GameSchema.encodeDiff(state1, state2)
			const decoded = GameSchema.decode(delta, state1)

			// Should only include changed properties in delta
			expect(decoded).toEqual(state2)

			// Verify delta doesn't include unchanged empty arrays/objects
			const reader = new Reader(delta)
			const deltaContent = new TextDecoder().decode(reader.readBuffer(delta.length))
			expect(deltaContent.includes('deck')).toBeFalsy()
			expect(deltaContent.includes('spectators')).toBeFalsy()
		})
	})

	describe('Delta Updates - Array Modifications', () => {
		const GameSchema = createObject({
			players: createArray(
				createObject({
					id: String,
					inventory: createArray(
						createObject({
							id: String,
							count: Int
						})
					)
				})
			)
		})

		it('should handle removing items from arrays', () => {
			const state1 = {
				players: [
					{
						id: 'player1',
						inventory: [
							{ id: 'item1', count: 1 },
							{ id: 'item2', count: 2 }
						]
					}
				]
			}

			const state2 = {
				players: [
					{
						id: 'player1',
						inventory: [{ id: 'item2', count: 2 }]
					}
				]
			}

			const delta = GameSchema.encodeDiff(state1, state2)
			const decoded = GameSchema.decode(delta, state1)
			expect(decoded).toEqual(state2)
		})

		it('should handle completely empty updates while preserving removals', () => {
			const state1 = {
				players: [
					{
						id: 'player1',
						inventory: [{ id: 'item1', count: 1 }]
					},
					{
						id: 'player2',
						inventory: [{ id: 'item2', count: 2 }]
					}
				]
			}

			const state2 = {
				players: [
					{
						id: 'player1',
						inventory: []
					}
				]
			}

			const delta = GameSchema.encodeDiff(state1, state2)
			const decoded = GameSchema.decode(delta, state1)
			expect(decoded).toEqual(state2)
		})
	})

	describe('Delta Updates - Array Item Removal', () => {
		const GameSchema = createObject({
			players: createArray(
				createObject({
					id: String,
					deck: createObject({
						cards: createArray(String)
					}),
					hand: createObject({
						cards: createArray(String)
					})
				})
			),
			spectators: createArray(String),
			info: createObject({
				status: optional(String)
			})
		})

		it('should handle removing items from start of array', () => {
			const state1 = {
				players: [
					{ id: 'p1', deck: { cards: ['c1'] }, hand: { cards: [] } },
					{ id: 'p2', deck: { cards: ['c2'] }, hand: { cards: [] } }
				],
				spectators: ['spec1'],
				info: { status: 'active' }
			}

			const state2 = {
				players: [{ id: 'p2', deck: { cards: ['c2'] }, hand: { cards: [] } }],
				spectators: ['spec1'],
				info: { status: 'active' }
			}

			const delta = GameSchema.encodeDiff(state1, state2)
			const decoded = GameSchema.decode(delta, state1)
			expect(decoded).toEqual(state2)
		})

		it('should handle removing items from end of array', () => {
			const state1 = {
				players: [
					{ id: 'p1', deck: { cards: ['c1'] }, hand: { cards: [] } },
					{ id: 'p2', deck: { cards: ['c2'] }, hand: { cards: [] } }
				],
				spectators: ['spec1'],
				info: { status: 'active' }
			}

			const state2 = {
				players: [{ id: 'p1', deck: { cards: ['c1'] }, hand: { cards: [] } }],
				spectators: ['spec1'],
				info: { status: 'active' }
			}

			const delta = GameSchema.encodeDiff(state1, state2)
			const decoded = GameSchema.decode(delta, state1)
			expect(decoded).toEqual(state2)
		})

		it('should handle removing items from middle of array', () => {
			const state1 = {
				players: [
					{ id: 'p1', deck: { cards: ['c1'] }, hand: { cards: [] } },
					{ id: 'p2', deck: { cards: ['c2'] }, hand: { cards: [] } },
					{ id: 'p3', deck: { cards: ['c3'] }, hand: { cards: [] } }
				],
				spectators: ['spec1'],
				info: { status: 'active' }
			}

			const state2 = {
				players: [
					{ id: 'p1', deck: { cards: ['c1'] }, hand: { cards: [] } },
					{ id: 'p3', deck: { cards: ['c3'] }, hand: { cards: [] } }
				],
				spectators: ['spec1'],
				info: { status: 'active' }
			}

			const delta = GameSchema.encodeDiff(state1, state2)
			const decoded = GameSchema.decode(delta, state1)
			expect(decoded).toEqual(state2)
		})

		it('should handle removing all items from array', () => {
			const state1 = {
				players: [
					{ id: 'p1', deck: { cards: ['c1'] }, hand: { cards: [] } },
					{ id: 'p2', deck: { cards: ['c2'] }, hand: { cards: [] } }
				],
				spectators: ['spec1'],
				info: { status: 'active' }
			}

			const state2 = {
				players: [],
				spectators: ['spec1'],
				info: { status: 'active' }
			}

			const delta = GameSchema.encodeDiff(state1, state2)
			const decoded = GameSchema.decode(delta, state1)
			expect(decoded).toEqual(state2)
		})

		it('should preserve empty arrays and objects when they represent removals', () => {
			const state1 = {
				players: [
					{
						id: 'player1',
						deck: { cards: ['card1'] },
						hand: { cards: [] }
					}
				],
				spectators: ['spec1'],
				info: { status: 'active' }
			}

			const state2 = {
				players: [
					{
						id: 'player1',
						deck: { cards: [] },
						hand: { cards: [] }
					}
				],
				spectators: [],
				info: { status: undefined }
			}

			const delta = GameSchema.encodeDiff(state1, state2)
			const decoded = GameSchema.decode(delta, state1)
			expect(decoded).toEqual(state2)
		})
	})

	describe('Delta Updates - Nested Array Removal', () => {
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
								id: 'p1',
								inventory: [
									{ itemId: 'item1', count: 1, tags: ['weapon', 'sword'] },
									{ itemId: 'item2', count: 2, tags: ['armor'] }
								],
								status: 'active'
							}
						],
						state: {
							activeItems: ['item1', 'item2'],
							settings: {
								flags: ['pvp', 'trading']
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
								id: 'p1',
								inventory: [{ itemId: 'item2', count: 2, tags: ['armor'] }],
								status: 'active'
							}
						],
						state: {
							activeItems: ['item2'],
							settings: {
								flags: ['pvp']
							}
						}
					}
				]
			}

			const delta = NestedSchema.encodeDiff(state1, state2)
			const decoded = NestedSchema.decode(delta, state1)
			expect(decoded).toEqual(state2)
		})

		it('should handle removing items at different levels simultaneously', () => {
			const state1 = {
				rooms: [
					{
						id: 'room1',
						players: [
							{
								id: 'p1',
								inventory: [
									{ itemId: 'item1', count: 1, tags: ['weapon'] },
									{ itemId: 'item2', count: 2, tags: ['armor', 'heavy'] }
								],
								status: 'active'
							},
							{
								id: 'p2',
								inventory: [{ itemId: 'item3', count: 3, tags: ['potion'] }],
								status: 'active'
							}
						],
						state: {
							activeItems: ['item1', 'item2', 'item3'],
							settings: {
								flags: ['pvp', 'trading', 'events']
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
								id: 'p1',
								inventory: [{ itemId: 'item2', count: 2, tags: ['armor'] }],
								status: 'active'
							}
						],
						state: {
							activeItems: ['item2'],
							settings: {
								flags: ['pvp']
							}
						}
					}
				]
			}

			const delta = NestedSchema.encodeDiff(state1, state2)

			// Debug assertions
			expect(state2.rooms[0].players).toBeDefined()
			expect(state2.rooms[0].players[0].inventory).toBeDefined()
			expect(state2.rooms[0].players[0].inventory[0].tags).toBeDefined()
			expect(state2.rooms[0].state.activeItems).toBeDefined()
			expect(state2.rooms[0].state.settings.flags).toBeDefined()

			const decoded = NestedSchema.decode(delta, state1)
			expect(decoded).toEqual(state2)
		})
	})

	describe('Delta Updates - String Array Edge Cases', () => {
		const StringArraySchema = createObject({
			nested: createObject({
				tags: createArray(String)
			})
		})

		it('should handle undefined string values in arrays', () => {
			const state1 = {
				nested: {
					tags: ['tag1', 'tag2']
				}
			}

			const state2 = {
				nested: {
					tags: ['tag2']
				}
			}

			const delta = StringArraySchema.encodeDiff(state1, state2)
			const decoded = StringArraySchema.decode(delta, state1)
			expect(decoded).toEqual(state2)
		})
	})

	describe('Delta Updates - State Preservation', () => {
		const CreatureSchema = createObject({
			id: Int,
			x: Int,
			y: Int,
			health: Int,
			type: String,
			state: String
		})

		const GameStateSchema = createObject({
			creatures: createArray(CreatureSchema),
			items: createArray(String),
			effects: createArray(String),
			objects: createArray(String),
			players: createArray(
				createObject({
					id: String,
					name: String
				})
			),
			spectators: createArray(String),
			info: createObject({
				timeElapsed: Int
			})
		})

		it('should preserve all creature properties when only y position changes', () => {
			const state1 = {
				creatures: [
					{ id: 1, x: 100, y: 200, health: 100, type: 'warrior', state: 'idle' },
					{ id: 2, x: 150, y: 180, health: 100, type: 'minion', state: 'idle' }
				],
				items: [],
				effects: [],
				objects: [],
				players: [],
				spectators: [],
				info: { timeElapsed: 1 }
			}

			const state2 = {
				...state1,
				creatures: [
					{ ...state1.creatures[0], y: 205 },
					{ ...state1.creatures[1], y: 188 }
				],
				info: { timeElapsed: 2 }
			}

			const delta = GameStateSchema.encodeDiff(state1, state2)
			const decoded = GameStateSchema.decode(delta, state1)

			// Verify all properties are preserved
			expect(decoded?.creatures[0]).toEqual({
				id: 1,
				x: 100,
				y: 205,
				health: 100,
				type: 'warrior',
				state: 'idle'
			})
			expect(decoded?.creatures[1]).toEqual({
				id: 2,
				x: 150,
				y: 188,
				health: 100,
				type: 'minion',
				state: 'idle'
			})
		})

		it('should handle partial array updates without losing data', () => {
			const state1 = {
				creatures: [
					{ id: 1, x: 100, y: 200, health: 100, type: 'monster', state: 'idle' },
					{ id: 2, x: 150, y: 180, health: 100, type: 'monster', state: 'idle' }
				],
				players: [],
				items: ['item1', 'item2'],
				effects: ['effect1'],
				objects: [],
				spectators: [],
				info: { timeElapsed: 0 }
			}

			// Update only one creature's position
			const partialUpdate = {
				creatures: [{ ...state1.creatures[0], y: 205 }, state1.creatures[1]],
				items: ['item1'],
				effects: ['effect1'],
				objects: [],
				spectators: [],
				info: { timeElapsed: 1 }
			}

			const delta = GameStateSchema.encodeDiff(state1, partialUpdate as any)
			const decoded = GameStateSchema.decode(delta, state1)

			expect(decoded?.creatures[0].health).toBe(100)
			expect(decoded?.creatures[0].type).toBe('monster')
			expect(decoded?.creatures[0].state).toBe('idle')
			expect(decoded).toEqual(partialUpdate)
		})
	})
})
