import { createArray } from '../../../schemas/array'
import { Int, String, Float } from '../../../schemas/primitive'

describe('Array Schema Encoding', () => {
	const IntArray = createArray(Int)
	const StringArray = createArray(String)
	const NestedArray = createArray(createArray(Float))

	it('should encode simple arrays', () => {
		const data = [1, 2, 3]
		const binary = IntArray.encode(data)
		expect(binary).toBeInstanceOf(Uint8Array)
		expect(binary.length).toBeGreaterThan(0)
	})

	it('should encode empty arrays', () => {
		const binary = IntArray.encode([])
		expect(binary).toBeInstanceOf(Uint8Array)
	})

	it('should encode string arrays', () => {
		const data = ['hello', 'world']
		const binary = StringArray.encode(data)
		expect(binary).toBeInstanceOf(Uint8Array)
	})

	it('should encode nested arrays', () => {
		const data = [
			[1.1, 1.2],
			[2.1, 2.2]
		]
		const binary = NestedArray.encode(data)
		expect(binary).toBeInstanceOf(Uint8Array)
	})
})
