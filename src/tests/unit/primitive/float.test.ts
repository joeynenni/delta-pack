import { Float } from '../../../schemas/primitive'

describe('Float Schema', () => {
	describe('Validation', () => {
		it('should validate numbers within Float32 range', () => {
			expect(Float.validate(0)).toHaveLength(0)
			expect(Float.validate(3.14)).toHaveLength(0)
			expect(Float.validate(-0.001)).toHaveLength(0)
		})

		it('should reject numbers outside Float32 range', () => {
			expect(Float.validate(1e39)).toHaveLength(1)
			expect(Float.validate(-1e39)).toHaveLength(1)
		})

		it('should reject invalid numbers', () => {
			expect(Float.validate(NaN)).toHaveLength(1)
			expect(Float.validate(Infinity)).toHaveLength(1)
			expect(Float.validate(-Infinity)).toHaveLength(1)
		})

		it('should reject non-number types', () => {
			expect(Float.validate('3.14' as any)).toHaveLength(1)
			expect(Float.validate(true as any)).toHaveLength(1)
			expect(Float.validate(null as any)).toHaveLength(1)
		})
	})

	describe('Encoding/Decoding', () => {
		it('should encode and decode floats', () => {
			const testCases = [0, 3.14, -0.001, 1e-10]
			for (const value of testCases) {
				const binary = Float.encode(value)
				expect(Float.decode(binary)).toBeCloseTo(value, 5)
			}
		})

		it('should handle Float32 precision', () => {
			const value = 1.23456789
			const binary = Float.encode(value)
			// Float32 has ~7 decimal digits of precision
			expect(Float.decode(binary)).toBeCloseTo(value, 5)
		})
	})

	describe('Delta Updates', () => {
		it('should encode value changes', () => {
			const testCases = [
				[1.0, 2.0],
				[0.0, -3.14],
				[-1.5, 1.5]
			]

			for (const [prev, next] of testCases) {
				const delta = Float.encodeDiff(prev, next)
				expect(Float.decode(delta, prev)).toBeCloseTo(next, 5)
			}
		})

		it('should optimize small changes', () => {
			const prev = 1.0
			const next = 2.0
			const delta = Float.encodeDiff(prev, next)
			expect(delta.length).toBe(Float.encode(next).length)
		})
	})
})
