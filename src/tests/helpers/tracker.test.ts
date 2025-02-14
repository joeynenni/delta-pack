import { Writer as _Writer, Reader as _Reader } from 'bin-serde'
import { IReader, IWriter, Tracker } from '../.generated/schema'
import { DebugLogger } from '../../utils/debug'

const Writer = _Writer as unknown as IWriter
const Reader = _Reader as unknown as IReader

describe('Tracker', () => {
	test('should track boolean values correctly', () => {
		DebugLogger.setCurrentTest('tracker-boolean')
		const tracker = new Tracker()
		tracker.push(true)
		tracker.push(false)
		tracker.push(true)

		expect(tracker.next()).toBe(true)
		expect(tracker.next()).toBe(false)
		expect(tracker.next()).toBe(true)
	})

	test('should serialize and deserialize correctly', () => {
		DebugLogger.setCurrentTest('tracker-serialize')
		const tracker = new Tracker()
		const values = [true, false, true, true, false]
		values.forEach((v) => tracker.push(v))

		const writer = new Writer()
		tracker.serialize(writer)
		const reader = new Reader(writer.toBuffer())

		const deserializedTracker = Tracker.deserialize(reader)
		expect(deserializedTracker.getBits()).toEqual(values)
	})

	test('should maintain correct index during iteration', () => {
		DebugLogger.setCurrentTest('tracker-index')
		const tracker = new Tracker()
		tracker.push(true)
		tracker.push(false)

		tracker.next()
		expect(tracker.getIndex()).toBe(1)
		tracker.next()
		expect(tracker.getIndex()).toBe(2)
	})
})
