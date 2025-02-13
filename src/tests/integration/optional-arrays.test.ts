import { createArray } from '../../schemas/array'
import { createObject } from '../../schemas/object'
import { optional } from '../../schemas/optional'
import { Int, String } from '../../schemas/primitive'

describe('Arrays with Optional Properties', () => {
	interface Creature {
		id: number
		name: string
		equippedItemType: string | undefined
	}

	const CreatureSchema = createObject({
		id: Int,
		name: String,
		equippedItemType: optional(String)
	})

	const GameStateSchema = createObject({
		creatures: createArray(CreatureSchema)
	})

	it('should handle arrays containing objects with optional properties', () => {
		const state: { creatures: Creature[] } = {
			creatures: [
				{ id: 1, name: 'Goblin', equippedItemType: undefined },
				{ id: 2, name: 'Warrior', equippedItemType: 'sword' },
				{ id: 3, name: 'Mage', equippedItemType: undefined }
			]
		}

		const binary = GameStateSchema.encode(state)
		expect(GameStateSchema.decode(binary)).toEqual(state)

		const updatedState: { creatures: Creature[] } = {
			creatures: [
				{ id: 1, name: 'Goblin', equippedItemType: 'dagger' },
				{ id: 2, name: 'Warrior', equippedItemType: undefined },
				{ id: 3, name: 'Mage', equippedItemType: undefined }
			]
		}

		const delta = GameStateSchema.encodeDiff(state, updatedState)
		expect(GameStateSchema.decode(delta, state)).toEqual(updatedState)
	})

	it('should handle ArrayBuffer input in decode', () => {
		const state = {
			creatures: [
				{ id: 1, name: 'Goblin', equippedItemType: undefined },
				{ id: 2, name: 'Warrior', equippedItemType: 'sword' }
			]
		}

		const binary = GameStateSchema.encode(state)
		const arrayBuffer = binary.buffer
		expect(GameStateSchema.decode(arrayBuffer)).toEqual(state)

		const updatedState = {
			creatures: [
				{ id: 1, name: 'Goblin', equippedItemType: 'dagger' },
				{ id: 2, name: 'Warrior', equippedItemType: undefined }
			]
		}

		const delta = GameStateSchema.encodeDiff(state, updatedState)
		const deltaArrayBuffer = delta.buffer
		expect(GameStateSchema.decode(deltaArrayBuffer, state)).toEqual(updatedState)
	})
})
