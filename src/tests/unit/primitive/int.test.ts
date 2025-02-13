import { Int } from '../../../schemas/primitive'

describe('Int Schema', () => {
	describe('Validation', () => {
		it('should validate integers', () => {
			expect(Int.validate(42)).toHaveLength(0)
			expect(Int.validate(0)).toHaveLength(0)
			expect(Int.validate(-1)).toHaveLength(0)
		})

		it('should handle 32-bit integer limits', () => {
			const minValue = -2147483648 // -2^31
			const maxValue = 2147483647 // 2^31 - 1
			expect(Int.validate(minValue)).toHaveLength(0)
			expect(Int.validate(maxValue)).toHaveLength(0)
		})

		it('should reject non-integer numbers', () => {
			expect(Int.validate(3.14)).toHaveLength(1)
			expect(Int.validate(NaN)).toHaveLength(1)
			expect(Int.validate(Infinity)).toHaveLength(1)
			expect(Int.validate(-Infinity)).toHaveLength(1)
		})

		it('should reject non-number types', () => {
			expect(Int.validate('123' as any)).toHaveLength(1)
			expect(Int.validate(true as any)).toHaveLength(1)
			expect(Int.validate(null as any)).toHaveLength(1)
			expect(Int.validate(undefined as any)).toHaveLength(1)
		})
	})

	describe('Encoding/Decoding', () => {
		it('should encode and decode integers', () => {
			const testCases = [0, 1, -1, 42, -42, 2147483647, -2147483648]
			for (const value of testCases) {
				const binary = Int.encode(value)
				expect(Int.decode(binary)).toBe(value)
			}
		})

		it('should handle undefined values', () => {
			const binary = Int.encodeDiff(42, undefined)
			expect(Int.decode(binary)).toBeUndefined()
		})
	})

	describe('Delta Updates', () => {
		it('should encode value changes', () => {
			const testCases = [
				[0, 1],
				[42, -42],
				[-2147483648, 2147483647]
			]

			for (const [prev, next] of testCases) {
				const delta = Int.encodeDiff(prev, next)
				expect(Int.decode(delta, prev)).toBe(next)
			}
		})

		it('should optimize no-change cases', () => {
			const value = 42
			const delta = Int.encodeDiff(value, value)
			expect(delta.length).toBeLessThan(Int.encode(value).length)
			expect(Int.decode(delta, value)).toBe(value)
		})
	})
})
