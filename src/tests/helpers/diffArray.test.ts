import { diffArray, NO_DIFF } from '../.generated/schema'
import { replaceDiffSymbols } from '../utils/helpers'
import { DebugLogger } from '../../utils/debug'

describe('diffArray', () => {
	test('should return NO_DIFF for identical arrays', () => {
		DebugLogger.setCurrentTest('diff-array-identical')
		const arr1 = [1, 2, 3]
		const arr2 = [1, 2, 3]
		const result = diffArray(arr1, arr2, (a, b) => (a === b ? NO_DIFF : b))
		expect(replaceDiffSymbols(result)).toBe('NO_DIFF')
	})

	test('should detect changes in array elements', () => {
		DebugLogger.setCurrentTest('diff-array-changes')
		const arr1 = [1, 2, 3]
		const arr2 = [1, 3, 3]
		const result = diffArray(arr1, arr2, (a, b) => (a === b ? NO_DIFF : b))
		const processed = replaceDiffSymbols(result)
		expect(processed).toEqual(['NO_DIFF', 3, 'NO_DIFF'])
	})

	test('should handle arrays of different lengths', () => {
		DebugLogger.setCurrentTest('diff-array-length-mismatch')
		const arr1 = [{ x: 1 }, { x: 2 }]
		const arr2 = [{ x: 1 }, { x: 2 }, { x: 3 }]
		const result = diffArray(arr1, arr2, (a, b) => (a.x === b.x ? NO_DIFF : b))
		const processed = replaceDiffSymbols(result)
		expect(processed).toEqual(['NO_DIFF', 'NO_DIFF', { x: 3 }])
	})

	test('should handle complex objects in arrays', () => {
		DebugLogger.setCurrentTest('diff-array-objects')
		const arr1 = [{ x: 1 }, { x: 2 }]
		const arr2 = [{ x: 1 }, { x: 3 }]
		const result = diffArray(arr1, arr2, (a, b) => (a.x === b.x ? NO_DIFF : b))
		const processed = replaceDiffSymbols(result)
		expect(processed).toEqual(['NO_DIFF', { x: 3 }])
	})

	test('should identify differences in array elements', () => {
		DebugLogger.setCurrentTest('diff-array-elements')
		const arr1 = [{ x: 1 }, { x: 2 }, { x: 3 }]
		const arr2 = [{ x: 1 }, { x: 2 }, { x: 4 }]
		const result = diffArray(arr2, arr1, (current, prev) => (current.x === prev.x ? NO_DIFF : current))
		const processed = replaceDiffSymbols(result)
		expect(processed).toEqual(['NO_DIFF', 'NO_DIFF', { x: 4 }])
	})
})
