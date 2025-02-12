import { createObject, createArray } from '../composite'
import { Int, String, Float, Boolean } from '../primitives'
import { optional } from '../types'

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

describe('Optional Properties', () => {
	const UserSchema = createObject({
		id: Int,
		name: String,
		email: optional(String),
		metadata: optional(createObject({
			lastLogin: Int,
			preferences: createObject({
				theme: String,
				notifications: Boolean
			})
		}))
	})

	it('should handle optional properties', () => {
		const user1 = {
			id: 1,
			name: 'Alice',
			// email omitted
			metadata: {
				lastLogin: 123456789,
				preferences: {
					theme: 'dark',
					notifications: true
				}
			}
		}

		const user2 = {
			id: 2,
			name: 'Bob',
			email: 'bob@example.com',
			// metadata omitted
		}

		// Test encoding/decoding
		const binary1 = UserSchema.encode(user1 as any)
		const binary2 = UserSchema.encode(user2 as any)
		
		expect(UserSchema.decode(binary1)).toEqual(user1)
		expect(UserSchema.decode(binary2)).toEqual(user2)

		// Test validation
		expect(UserSchema.validate(user1)).toHaveLength(0)
		expect(UserSchema.validate(user2)).toHaveLength(0)

		// Test delta updates
		const updatedUser1 = {
			...user1,
			email: 'alice@example.com'
		}
		const delta = UserSchema.encodeDiff(user1 as any, updatedUser1 as any)
		expect(UserSchema.decode(delta, user1 as any)).toEqual(updatedUser1)
	})

	it('should reject invalid optional values', () => {
		const invalidUser = {
			id: 1,
			name: 'Alice',
			email: 123, // Wrong type for optional field
			metadata: {
				lastLogin: '123456789', // Wrong type in nested optional object
				preferences: {
					theme: 'dark',
					notifications: true
				}
			}
		}

		expect(UserSchema.validate(invalidUser)).toHaveLength(2)
	})
})

describe('Optional Properties Validation', () => {
	// Test simple optional primitive
	it('should validate simple optional primitive', () => {
		const SimpleSchema = createObject({
			required: Int,
			optional: optional(String)
		})
		
		// Valid cases
		expect(SimpleSchema.validate({ required: 1 })).toHaveLength(0)
		expect(SimpleSchema.validate({ required: 1, optional: 'test' })).toHaveLength(0)
		
		// Invalid cases
		const errors1 = SimpleSchema.validate({ required: 1, optional: 123 })
		expect(errors1).toHaveLength(1)
		expect(errors1[0]).toBe('Invalid string: 123')
	})

	// Test nested optional object
	it('should validate nested optional object', () => {
		const NestedSchema = createObject({
			required: Int,
			metadata: optional(createObject({
				count: Int,
				name: String
			}))
		})
		
		// Valid cases
		expect(NestedSchema.validate({ required: 1 })).toHaveLength(0)
		expect(NestedSchema.validate({ 
			required: 1, 
			metadata: { count: 1, name: 'test' } 
		})).toHaveLength(0)
		
		// Invalid cases
		const errors1 = NestedSchema.validate({ 
			required: 1, 
			metadata: { count: 'invalid', name: 'test' } 
		})
		expect(errors1).toHaveLength(1)
		expect(errors1[0]).toBe('Invalid int: invalid')

		const errors2 = NestedSchema.validate({ 
			required: 1, 
			metadata: { count: 1, name: 123 } 
		})
		expect(errors2).toHaveLength(1)
		expect(errors2[0]).toBe('Invalid string: 123')
	})

	// Test multiple validation errors
	it('should collect all validation errors', () => {
		const ComplexSchema = createObject({
			id: Int,
			metadata: optional(createObject({
				count: Int,
				name: String
			}))
		})
		
		const errors = ComplexSchema.validate({ 
			id: 'invalid',
			metadata: { 
				count: 'invalid',
				name: 123 
			} 
		})
		
		expect(errors).toHaveLength(3)
		expect(errors).toContain('Invalid int: invalid')
		expect(errors).toContain('Invalid int: invalid')
		expect(errors).toContain('Invalid string: 123')
	})
})
