import { createObject, createArray } from '../composite'
import { Int, String } from '../primitives'
import { optional } from '../types'

describe('encodeDiff Edge Cases', () => {
	interface TestState {
		id: number
		name: string
		items?: string[]
	}

	const TestSchema = createObject<TestState>({
		id: Int,
		name: String,
		items: optional(createArray(String))
	})

	it('should handle undefined states', () => {
		const state1 = undefined
		const state2 = { id: 1, name: 'test' }

		// Should not throw when encoding diff between undefined and defined state
		expect(() => TestSchema.encodeDiff(state1, state2)).not.toThrow()
		expect(() => TestSchema.encodeDiff(state2, state1)).not.toThrow()
		expect(() => TestSchema.encodeDiff(state1, state1)).not.toThrow()
	})

	it('should handle empty arrays', () => {
		const state1 = { id: 1, name: 'test', items: [] }
		const state2 = { id: 1, name: 'test', items: ['item1'] }

		expect(() => TestSchema.encodeDiff(state1, state2)).not.toThrow()
		expect(() => TestSchema.encodeDiff(state2, state1)).not.toThrow()
	})

	it('should handle missing optional properties', () => {
		const state1 = { id: 1, name: 'test' }
		const state2 = { id: 1, name: 'test', items: ['item1'] }

		expect(() => TestSchema.encodeDiff(state1, state2)).not.toThrow()
		expect(() => TestSchema.encodeDiff(state2, state1)).not.toThrow()
	})

	it('should handle complex nested state changes', () => {
		interface ComplexState {
			entities: {
				id: number
				data?: {
					value?: string
				}
			}[]
		}

		const ComplexSchema = createObject<ComplexState>({
			entities: createArray(
				createObject({
					id: Int,
					data: optional(
						createObject({
							value: optional(String)
						})
					)
				})
			)
		})

		const state1 = {
			entities: [{ id: 1 }, { id: 2, data: { value: 'test' } }]
		}

		const state2 = {
			entities: [{ id: 1, data: { value: 'new' } }, { id: 2 }]
		}

		const delta = ComplexSchema.encodeDiff(state1, state2)
		expect(ComplexSchema.decode(delta, state1)).toEqual(state2)
	})
})
