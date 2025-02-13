import { createObject } from '../../../schemas/object'
import { createArray } from '../../../schemas/array'
import { Int, String, Float } from '../../../schemas/primitive'

describe('Object Schema Encoding', () => {
	const ComplexSchema = createObject({
		metadata: createObject({
			version: Int,
			tags: createArray(String)
		}),
		data: createArray(
			createObject({
				id: Int,
				values: createArray(Float)
			})
		)
	})

	it('should encode nested objects', () => {
		const data = {
			metadata: {
				version: 1,
				tags: ['test', 'v1']
			},
			data: [
				{ id: 1, values: [1.1, 1.2] },
				{ id: 2, values: [2.1, 2.2] }
			]
		}

		const binary = ComplexSchema.encode(data)
		expect(binary).toBeInstanceOf(Uint8Array)
		expect(binary.length).toBeGreaterThan(0)
	})

	it('should encode empty arrays', () => {
		const data = {
			metadata: {
				version: 1,
				tags: []
			},
			data: []
		}

		const binary = ComplexSchema.encode(data)
		expect(binary).toBeInstanceOf(Uint8Array)
	})

	it('should encode objects with undefined optional fields', () => {
		const OptionalSchema = createObject({
			id: Int,
			data: createArray(String)
		})

		const data = {
			id: 1,
			data: undefined
		}

		const binary = OptionalSchema.encode(data as any)
		expect(binary).toBeInstanceOf(Uint8Array)
	})
})
