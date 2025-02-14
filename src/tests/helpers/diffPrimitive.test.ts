import { diffPrimitive } from '../.generated/schema'
import { replaceDiffSymbols } from '../utils/helpers'
import { DebugLogger } from '../../utils/debug'

describe('diffPrimitive', () => {
	test('should return NO_DIFF for identical values', () => {
		DebugLogger.setCurrentTest('diff-primitive-identical')
		const result = diffPrimitive(42, 42)
		expect(replaceDiffSymbols(result)).toBe('NO_DIFF')
	})

	test('should return new value when values differ', () => {
		DebugLogger.setCurrentTest('diff-primitive-different');
		const result = diffPrimitive(43, 42);
		expect(result).toBe(43);
	 });
	 
	 test('should handle string values', () => {
		DebugLogger.setCurrentTest('diff-primitive-string');
		const result = diffPrimitive('world', 'hello');
		expect(result).toBe('world');
	 });
	 
	 test('should handle boolean values', () => {
		DebugLogger.setCurrentTest('diff-primitive-boolean');
		const result = diffPrimitive(false, true);
		expect(result).toBe(false);
	 });
})
