import { Boolean } from '../../../schemas/primitive'

describe('Boolean Schema', () => {
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

		it('should use minimal encoding', () => {
			expect(Boolean.encode(true).length).toBe(1)
			expect(Boolean.encode(false).length).toBe(1)
		})
	})

	describe('Delta Updates', () => {
		it('should encode value changes', () => {
			const testCases = [
				[true, false],
				[false, true]
			]

			for (const [prev, next] of testCases) {
				const delta = Boolean.encodeDiff(prev, next)
				expect(Boolean.decode(delta, prev)).toBe(next)
			}
		})

		it('should optimize no-change cases', () => {
			const testCases = [true, false]
			for (const value of testCases) {
				const delta = Boolean.encodeDiff(value, value)
				expect(delta.length).toBe(1)
				expect(Boolean.decode(delta, value)).toBe(value)
			}
		})
	})
})
