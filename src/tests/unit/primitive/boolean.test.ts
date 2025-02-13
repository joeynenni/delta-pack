import { Boolean } from '../../../schemas/primitive'
import { createObject } from '../../../schemas/object'

describe('Boolean Schema', () => {
	const TestSchema = createObject({
		active: Boolean,
		enabled: Boolean,
		visible: Boolean
	})

	describe('Validation', () => {
		it('should validate booleans', () => {
			expect(Boolean.validate(true)).toHaveLength(0)
			expect(Boolean.validate(false)).toHaveLength(0)
		})

		it('should reject non-boolean types', () => {
			expect(Boolean.validate(1 as any)).toHaveLength(1)
			expect(Boolean.validate('true' as any)).toHaveLength(1)
			expect(Boolean.validate(null as any)).toHaveLength(1)
			expect(Boolean.validate(undefined as any)).toHaveLength(1)
		})
	})

	describe('Encoding/Decoding', () => {
		it('should encode and decode booleans', () => {
			const testCases = [true, false]
			for (const value of testCases) {
				const binary = Boolean.encode(value)
				expect(Boolean.decode(binary)).toBe(value)
			}
		})
	})

	describe('Delta Updates', () => {
		it('should handle single boolean change', () => {
			const state1 = {
				active: true,
				enabled: false,
				visible: true
			}

			const state2 = {
				active: false, // Changed
				enabled: false, // Same
				visible: true // Same
			}

			const delta = TestSchema.encodeDiff(state1, state2)
			const decoded = TestSchema.decode(delta, state1)
			expect(decoded).toEqual(state2)
		})

		it('should handle multiple boolean changes', () => {
			const state1 = {
				active: true,
				enabled: false,
				visible: true
			}

			const state2 = {
				active: false, // Changed
				enabled: true, // Changed
				visible: false // Changed
			}

			const delta = TestSchema.encodeDiff(state1, state2)
			const decoded = TestSchema.decode(delta, state1)
			expect(decoded).toEqual(state2)
		})

		it('should handle no changes', () => {
			const state = {
				active: true,
				enabled: false,
				visible: true
			}

			const delta = TestSchema.encodeDiff(state, state)
			const decoded = TestSchema.decode(delta, state)
			expect(decoded).toEqual(state)
		})
	})
})
