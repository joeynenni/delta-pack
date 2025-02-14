import { Writer, Reader } from 'bin-serde'
import { GameState, NO_DIFF, DeepPartial, Tracker, IWriter, IReader } from './.generated/schema'
import { DebugLogger } from '../utils/debug'
import { replaceDiffSymbols } from './utils/helpers'

describe('decodeDiff', () => {
	const sampleState = {
		timeRemaining: 120,
		players: [
			{
				id: 1,
				position: { x: 94.5, y: 102.3 },
				health: 100,
				weapon: { name: 'Sword', damage: 25 },
				stealth: false
			}
		]
	}

	test('should decode primitive diffs correctly', () => {
		DebugLogger.setCurrentTest('decode-diff-primitive')
		const newState = { ...sampleState, timeRemaining: 100 }
		const binary = GameState.encode(newState, sampleState)
		const updatedState = GameState.decode(binary, sampleState)
		expect(updatedState.timeRemaining).toBe(newState.timeRemaining)
		expect(updatedState.players).toEqual(sampleState.players)
	})

	test('should decode nested object diffs', () => {
		DebugLogger.setCurrentTest('decode-diff-nested')
		const newState = {
			...sampleState,
			players: [
				{
					...sampleState.players[0],
					position: { x: 95.5, y: 103.3 }
				}
			]
		}
		const binary = GameState.encode(newState, sampleState)
		const updatedState = GameState.decode(binary, sampleState)
		expect(updatedState.players[0].position).toEqual(newState.players[0].position)
		expect(updatedState.players[0].health).toBe(sampleState.players[0].health)
	})

	test('should handle NO_DIFF values correctly', () => {
		DebugLogger.setCurrentTest('decode-diff-no-diff')
		const diff: DeepPartial<GameState> = {
			timeRemaining: NO_DIFF,
			players: [
				{
					id: NO_DIFF,
					position: NO_DIFF,
					health: 85,
					weapon: NO_DIFF,
					stealth: NO_DIFF
				}
			]
		}
		const writer = new Writer() as unknown as IWriter
		const tracker = new Tracker()
		GameState.encodeDiff(diff, tracker, writer)
		tracker.serialize(writer)

		const reader = new Reader(writer.toBuffer()) as unknown as IReader
		const decodedTracker = Tracker.deserialize(reader)
		const decodedDiff = GameState.decodeDiff(reader, decodedTracker)
		const players = decodedDiff.players as any[]

		expect(replaceDiffSymbols(decodedDiff)).toEqual(replaceDiffSymbols(diff))
		expect(decodedDiff.timeRemaining).toBe(NO_DIFF)
		expect(players[0].health).toBe(85)
		expect(players[0].weapon).toBe(NO_DIFF)
		expect(players[0].id).toBe(NO_DIFF)
		expect(players[0].position).toBe(NO_DIFF)
		expect(players[0].stealth).toBe(NO_DIFF)
	})
})
