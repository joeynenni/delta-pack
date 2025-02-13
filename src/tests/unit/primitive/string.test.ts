import { String } from '../../../schemas/primitive'

describe('String Schema', () => {
	describe('Validation', () => {
		it('should validate strings', () => {
			expect(String.validate('')).toHaveLength(0)
			expect(String.validate('hello')).toHaveLength(0)
			expect(String.validate('🌟')).toHaveLength(0)
		})

		it('should reject non-string types', () => {
			expect(String.validate(123 as any)).toHaveLength(1)
			expect(String.validate(true as any)).toHaveLength(1)
			expect(String.validate(null as any)).toHaveLength(1)
			expect(String.validate(undefined as any)).toHaveLength(1)
		})
	})

	describe('Encoding/Decoding', () => {
		it('should encode and decode strings', () => {
			const testCases = ['', 'hello', '🌟', 'multi\nline\nstring', '{"json":"string"}']

			for (const value of testCases) {
				const binary = String.encode(value)
				expect(String.decode(binary)).toBe(value)
			}
		})

		it('should handle long strings', () => {
			const value = 'a'.repeat(1000)
			const binary = String.encode(value)
			expect(String.decode(binary)).toBe(value)
		})
	})

	describe('Delta Updates', () => {
		it('should encode value changes', () => {
			const testCases = [
				['', 'hello'],
				['hello', 'world'],
				['🌟', '⭐']
			]

			for (const [prev, next] of testCases) {
				const delta = String.encodeDiff(prev, next)
				expect(String.decode(delta, prev)).toBe(next)
			}
		})

		it('should optimize similar strings', () => {
			const prev = 'hello world'
			const next = 'hello there'
			const delta = String.encodeDiff(prev, next)
			expect(String.decode(delta, prev)).toBe(next)
		})
	})
})
