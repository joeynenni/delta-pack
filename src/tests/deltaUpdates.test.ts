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
}) 