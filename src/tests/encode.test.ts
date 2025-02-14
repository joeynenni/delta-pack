import { GameState } from './.generated/schema'
import { DebugLogger } from '../utils/debug'
import { replaceDiffSymbols } from './utils/helpers'

describe('encode', () => {
	const sampleState = {
		timeRemaining: 120,
		players: [
			{
				id: 1,
				position: { x: 94.5, y: 102.3 },
				health: 100,
				weapon: { name: 'Sword', damage: 25 },
				stealth: false
			},
			{
				id: 2,
				position: { x: 216.6, y: 198.1 },
				health: 100,
				weapon: { name: 'Bow', damage: 15 },
				stealth: true
			}
		]
	}

	test('should encode a full state into a Uint8Array', () => {
		DebugLogger.setCurrentTest('encode-full-state')
		const binary = GameState.encode(sampleState)
		expect(binary).toBeInstanceOf(Uint8Array)
		const decoded = GameState.decode(binary)
		expect(decoded).toEqual(sampleState)
	})

	test('should encode a diff when state changes', () => {
		DebugLogger.setCurrentTest('encode-diff-state')
		const prevState = sampleState
		// Change one property in one player.
		const newState = {
			timeRemaining: 120,
			players: [
				{
					id: 1,
					position: { x: 94.5, y: 102.3 },
					health: 85, // changed
					weapon: { name: 'Sword', damage: 25 },
					stealth: false
				},
				{
					id: 2,
					position: { x: 216.6, y: 198.1 },
					health: 100,
					weapon: { name: 'Bow', damage: 15 },
					stealth: true
				}
			]
		}

		const diffBinary = GameState.encode(newState, prevState)
		expect(diffBinary).toBeInstanceOf(Uint8Array)

		// Check that the diff binary is not exactly the same as a full encode.
		const fullBinary = GameState.encode(newState)
		expect(diffBinary).not.toEqual(fullBinary)
	})

	test('should compute diff with only changed fields', () => {
		DebugLogger.setCurrentTest('compute-diff-changed-fields')
		const prevState = sampleState
		const newState = {
			timeRemaining: 100, // changed
			players: [
				{
					id: 1,
					position: { x: 94.5, y: 97.4 }, // changed
					health: 85, // changed
					weapon: { name: 'Sword', damage: 25 },
					stealth: false
				},
				{
					id: 2,
					position: { x: 216.6, y: 198.1 },
					health: 100,
					weapon: { name: 'Bow', damage: 15 },
					stealth: true
				}
			]
		}

		const diff = GameState.computeDiff(newState, prevState)
		const processedDiff = replaceDiffSymbols(diff)

		expect(processedDiff).toEqual({
			timeRemaining: 100,
			players: [
				{
					id: 'NO_DIFF',
					position: {
						x: 'NO_DIFF',
						y: 97.4
					},
					health: 85,
					weapon: 'NO_DIFF',
					stealth: 'NO_DIFF'
				},
				'NO_DIFF' // second player unchanged
			]
		})
	})
})
