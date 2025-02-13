import { createArray } from '../../schemas/array'
import { createObject } from '../../schemas/object'
import { optional } from '../../schemas/optional'
import { Int, String } from '../../schemas/primitive'

describe('State Preservation', () => {
	const EntitySchema = createObject({
		id: Int,
		name: String,
		metadata: optional(
			createObject({
				tags: createArray(String),
				version: Int
			})
		)
	})

	it('should preserve unchanged nested structures', () => {
		const state1 = {
			id: 1,
			name: 'Entity',
			metadata: {
				tags: ['a', 'b'],
				version: 1
			}
		}

		const state2 = {
			...state1,
			name: 'Updated Entity'
		}

		const delta = EntitySchema.encodeDiff(state1, state2)
		const decoded = EntitySchema.decode(delta, state1)

		expect(decoded).toEqual(state2)
		expect(decoded.metadata).toBe(state1.metadata) // Same reference
		expect(decoded.metadata?.tags).toBe(state1.metadata?.tags) // Same reference
	})

	it('should preserve array references when possible', () => {
		const state1 = {
			id: 1,
			name: 'Entity',
			metadata: {
				tags: ['a', 'b'],
				version: 1
			}
		}

		const state2 = {
			...state1,
			metadata: {
				...state1.metadata,
				version: 2
			}
		}

		const delta = EntitySchema.encodeDiff(state1, state2)
		const decoded = EntitySchema.decode(delta, state1)

		expect(decoded).toEqual(state2)
		expect(decoded.metadata?.tags).toBe(state1.metadata?.tags) // Same reference
	})
})
