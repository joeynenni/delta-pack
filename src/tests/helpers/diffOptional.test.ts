import { diffOptional } from '../.generated/schema'
import { replaceDiffSymbols } from '../utils/helpers'
import { DebugLogger } from '../../utils/debug'

describe('diffOptional', () => {
	test('should return NO_DIFF when both values are undefined', () => {
		DebugLogger.setCurrentTest('diff-optional-both-undefined')
		const result = diffOptional(undefined, undefined, (a, b) => b)
		expect(replaceDiffSymbols(result)).toBe('NO_DIFF')
	})

	test('should return first value when only one value exists', () => {
		DebugLogger.setCurrentTest('diff-optional-one-undefined')
		const value = { x: 1, y: 2 }
		const result = diffOptional(value, undefined, (a, b) => b)
		expect(result).toBe(value)
	})

	test('should use inner diff when both values exist', () => {
		DebugLogger.setCurrentTest('diff-optional-both-exist')
		const a = { x: 1, y: 2 }
		const b = { x: 1, y: 3 }
		const result = diffOptional(a, b, (x, y) => y)
		expect(result).toEqual(b)
	})
})
