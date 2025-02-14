import { diffObj, NO_DIFF } from '../.generated/schema'
import { replaceDiffSymbols } from '../utils/helpers'
import { DebugLogger } from '../../utils/debug'

describe('diffObj', () => {
	test('should return NO_DIFF when objects are identical', () => {
		DebugLogger.setCurrentTest('diff-obj-identical')
		const result = diffObj({
			a: NO_DIFF,
			b: NO_DIFF
		})
		expect(replaceDiffSymbols(result)).toBe('NO_DIFF')
	})

	test('should detect changed primitive values', () => {
		DebugLogger.setCurrentTest('diff-obj-primitive')
		const result = diffObj({
			x: NO_DIFF,
			y: 3
		})
		const processed = replaceDiffSymbols(result)
		expect(processed.y).toBe(3)
		expect(processed.x).toBe('NO_DIFF')
	})

	test('should handle nested objects', () => {
		DebugLogger.setCurrentTest('diff-obj-nested')
		const result = diffObj({
			pos: {
				x: NO_DIFF,
				y: 3
			},
			other: NO_DIFF
		})
		const processed = replaceDiffSymbols(result)
		expect(processed.pos.y).toBe(3)
		expect(processed.pos.x).toBe('NO_DIFF')
		expect(processed.other).toBe('NO_DIFF')
	})

	test('should handle deeply nested changes', () => {
		DebugLogger.setCurrentTest('diff-obj-deep-nested')
		const result = diffObj({
			level1: {
				level2: {
					unchanged: NO_DIFF,
					changed: 42
				},
				other: NO_DIFF
			}
		})
		const processed = replaceDiffSymbols(result)
		expect(processed.level1.level2.changed).toBe(42)
		expect(processed.level1.level2.unchanged).toBe('NO_DIFF')
		expect(processed.level1.other).toBe('NO_DIFF')
	})
})
