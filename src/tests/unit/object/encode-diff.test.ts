import { createObject } from '../../../schemas/object'
import { createArray } from '../../../schemas/array'
import { Int, String, Float } from '../../../schemas/primitive'

describe('Object Schema Diff Encoding', () => {
	const GameObjectSchema = createObject({
		id: Int,
		position: createObject({
			x: Float,
			y: Float
		}),
		attributes: createArray(
			createObject({
				name: String,
				value: Float
			})
		)
	})

	const baseState = {
		id: 1,
		position: { x: 10.0, y: 20.0 },
		attributes: [
			{ name: 'health', value: 100.0 },
			{ name: 'speed', value: 1.5 }
		]
	}

	it('should encode position changes', () => {
		const newState = {
			...baseState,
			position: { x: 11.0, y: 20.0 }
		}
		const diff = GameObjectSchema.encodeDiff(baseState, newState)
		expect(diff.length).toBeLessThan(GameObjectSchema.encode(newState).length)
	})

	it('should encode attribute changes', () => {
		const newState = {
			...baseState,
			attributes: [
				{ name: 'health', value: 90.0 },
				{ name: 'speed', value: 1.5 }
			]
		}
		const diff = GameObjectSchema.encodeDiff(baseState, newState)
		expect(diff.length).toBeLessThan(GameObjectSchema.encode(newState).length)
	})

	it('should handle no changes efficiently', () => {
		const diff = GameObjectSchema.encodeDiff(baseState, baseState)
		expect(diff.length).toBeLessThan(10) // Should be very small for no changes
	})

	it('should handle undefined states', () => {
		const diff = GameObjectSchema.encodeDiff(baseState, undefined)
		expect(diff).toBeInstanceOf(Uint8Array)
	})
})
