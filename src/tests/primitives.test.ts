import { Int, Float, String, Boolean } from '../primitives'

describe('Primitive Schemas', () => {
	describe('Int Schema', () => {
		it('should validate integers', () => {
			expect(Int.validate(42)).toHaveLength(0)
			expect(Int.validate(3.14)).toHaveLength(1)
			expect(Int.validate('123' as any)).toHaveLength(1)
		})

		it('should encode and decode', () => {
			const value = 42
			const binary = Int.encode(value)
			expect(Int.decode(binary)).toBe(value)
		})

		it('should handle delta updates', () => {
			const value1 = 42
			const value2 = 43
			const delta = Int.encodeDiff(value1, value2)
			expect(Int.decode(delta, value1)).toBe(value2)
		})

		it('should handle 32-bit integer limits', () => {
			const minValue = -2147483648 // -2^31
			const maxValue = 2147483647 // 2^31 - 1

			expect(Int.validate(minValue)).toHaveLength(0)
			expect(Int.validate(maxValue)).toHaveLength(0)

			const minBinary = Int.encode(minValue)
			const maxBinary = Int.encode(maxValue)

			expect(Int.decode(minBinary)).toBe(minValue)
			expect(Int.decode(maxBinary)).toBe(maxValue)
		})

		it('should reject non-integer numbers', () => {
			expect(Int.validate(3.14)).toHaveLength(1)
			expect(Int.validate(NaN)).toHaveLength(1)
			expect(Int.validate(Infinity)).toHaveLength(1)
		})
	})

	describe('Float Schema', () => {
		it('should validate floating-point numbers', () => {
			expect(Float.validate(3.14)).toHaveLength(0)
			expect(Float.validate('3.14' as any)).toHaveLength(1)
		})

		it('should encode and decode with reasonable precision', () => {
			const value = 3.14159
			const binary = Float.encode(value)
			expect(Float.decode(binary)).toBeCloseTo(value, 4)
		})

		it('should handle delta updates', () => {
			const value1 = 3.14
			const value2 = 3.15
			const delta = Float.encodeDiff(value1, value2)
			expect(Float.decode(delta, value1)).toBeCloseTo(value2, 4)
		})

		it('should handle moderate-sized floating point numbers', () => {
			const tiny = 0.0001
			const huge = 10000.0

			expect(Float.validate(tiny)).toHaveLength(0)
			expect(Float.validate(huge)).toHaveLength(0)

			const tinyBinary = Float.encode(tiny)
			const hugeBinary = Float.encode(huge)

			expect(Float.decode(tinyBinary)).toBeCloseTo(tiny, 4)
			expect(Float.decode(hugeBinary)).toBeCloseTo(huge, 4)
		})

		it('should reject invalid numbers', () => {
			expect(Float.validate(NaN)).toHaveLength(1)
			expect(Float.validate(Infinity)).toHaveLength(1)
			expect(Float.validate(-Infinity)).toHaveLength(1)
		})
	})

	describe('String Schema', () => {
		it('should validate strings', () => {
			expect(String.validate('test')).toHaveLength(0)
			expect(String.validate(42 as any)).toHaveLength(1)
		})

		it('should encode and decode', () => {
			const value = 'test'
			const binary = String.encode(value)
			expect(String.decode(binary)).toBe(value)
		})

		it('should handle delta updates', () => {
			const value1 = 'hello'
			const value2 = 'world'
			const delta = String.encodeDiff(value1, value2)
			expect(String.decode(delta, value1)).toBe(value2)
		})

		it('should handle empty strings', () => {
			const empty = ''
			expect(String.validate(empty)).toHaveLength(0)
			const binary = String.encode(empty)
			expect(String.decode(binary)).toBe(empty)
		})

		it('should handle unicode characters', () => {
			const unicode = '🚀 Hello 世界'
			expect(String.validate(unicode)).toHaveLength(0)
			const binary = String.encode(unicode)
			expect(String.decode(binary)).toBe(unicode)
		})
	})

	describe('Boolean Schema', () => {
		it('should validate booleans', () => {
			expect(Boolean.validate(true)).toHaveLength(0)
			expect(Boolean.validate('true' as any)).toHaveLength(1)
		})

		it('should encode and decode', () => {
			const value = true
			const binary = Boolean.encode(value)
			expect(Boolean.decode(binary)).toBe(value)
		})

		it('should handle delta updates', () => {
			const value1 = false
			const value2 = true
			const delta = Boolean.encodeDiff(value1, value2)
			expect(Boolean.decode(delta, value1)).toBe(value2)
		})

		it('should reject non-boolean primitives', () => {
			expect(Boolean.validate(1 as any)).toHaveLength(1)
			expect(Boolean.validate('true' as any)).toHaveLength(1)
			expect(Boolean.validate(null as any)).toHaveLength(1)
		})
	})
})
