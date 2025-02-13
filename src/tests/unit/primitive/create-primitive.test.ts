import { createPrimitive } from '../../../schemas/primitive'

describe('Create Primitive', () => {
	const CustomNumber = createPrimitive<number>({
		name: 'CustomNumber',
		validate: (value): value is number => typeof value === 'number',
		encode: (writer, value) => writer.writeUInt8(value),
		decode: (reader) => reader.readUInt8()
	})

	describe('Schema Creation', () => {
		it('should create valid schema', () => {
			expect(CustomNumber.validate(42)).toHaveLength(0)
			expect(CustomNumber.validate('42' as any)).toHaveLength(1)
		})

		it('should handle encoding/decoding', () => {
			const value = 42
			const binary = CustomNumber.encode(value)
			expect(CustomNumber.decode(binary)).toBe(value)
		})

		it('should handle delta updates', () => {
			const prev = 42
			const next = 43
			const delta = CustomNumber.encodeDiff(prev, next)
			expect(CustomNumber.decode(delta, prev)).toBe(next)
		})
	})

	describe('Error Cases', () => {
		it('should handle invalid inputs', () => {
			expect(() => CustomNumber.encode('invalid' as any)).toThrow()
			expect(() => CustomNumber.decode(new Uint8Array())).toThrow()
		})

		it('should validate encoder output', () => {
			const InvalidSchema = createPrimitive<number>({
				name: 'InvalidSchema',
				validate: (value): value is number => false,
				encode: () => new Uint8Array(),
				decode: () => 0
			})

			expect(() => InvalidSchema.encode(42)).toThrow()
		})
	})
})
