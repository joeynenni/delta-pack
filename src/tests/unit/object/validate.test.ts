import { createObject } from '../../../schemas/object'
import { createArray } from '../../../schemas/array'
import { Int, String, Float } from '../../../schemas/primitive'

describe('Object Schema Validation', () => {
	const AddressSchema = createObject({
		street: String,
		number: Int
	})

	const PersonSchema = createObject({
		id: Int,
		name: String,
		address: AddressSchema,
		scores: createArray(Float)
	})

	it('should validate simple objects', () => {
		expect(
			PersonSchema.validate({
				id: 1,
				name: 'Test',
				address: { street: 'Main St', number: 123 },
				scores: [98.5, 92.0]
			})
		).toHaveLength(0)
	})

	it('should reject invalid primitive types', () => {
		expect(
			PersonSchema.validate({
				id: '1' as any,
				name: 'Test',
				address: { street: 'Main St', number: 123 },
				scores: [98.5, 92.0]
			})
		).toHaveLength(1)
	})

	it('should reject invalid nested object types', () => {
		expect(
			PersonSchema.validate({
				id: 1,
				name: 'Test',
				address: { street: 'Main St', number: '123' as any },
				scores: [98.5, 92.0]
			})
		).toHaveLength(1)
	})

	it('should reject invalid array element types', () => {
		expect(
			PersonSchema.validate({
				id: 1,
				name: 'Test',
				address: { street: 'Main St', number: 123 },
				scores: [98.5, '92.0' as any]
			})
		).toHaveLength(1)
	})

	it('should reject missing required properties', () => {
		expect(
			PersonSchema.validate({
				id: 1,
				name: 'Test',
				scores: [98.5, 92.0]
			} as any)
		).toHaveLength(1)
	})
})
