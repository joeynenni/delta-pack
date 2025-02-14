import { writeFileSync, mkdirSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import {
	ChildType,
	FloatType,
	IntType,
	Modifier,
	ObjectType,
	ReferenceType,
	StringType,
	BooleanType,
	generateCode
} from '../../generator'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Create test schema using the generator types as described in the README:
//   - Position: { x: number, y: number }
//   - Weapon: { name: string, damage: number }
//   - Player: { id: number, position: Position, health: number, weapon?: Weapon }
//   - GameState: { timeRemaining: number, players: Player[] }
function createTestSchema(): Record<string, any> {
	const Position = ObjectType({
		x: FloatType(),
		y: FloatType()
	})

	const Weapon = ObjectType({
		name: StringType(),
		damage: IntType()
	})

	const Player = ObjectType({
		id: IntType(),
		position: ReferenceType('Position'),
		health: IntType(),
		weapon: ChildType(ReferenceType('Weapon'), Modifier.OPTIONAL),
		stealth: BooleanType()
	})

	const GameState = ObjectType({
		timeRemaining: IntType(),
		players: ChildType(ReferenceType('Player'), Modifier.ARRAY)
	})

	return {
		Position,
		Weapon,
		Player,
		GameState
	}
}

// Ensure .generated directory exists
const generatedDir = join(__dirname, '.generated')
mkdirSync(generatedDir, { recursive: true })

// Generate and write the code
const schema = createTestSchema()
const generatedCode = await generateCode(schema)
const outputPath = join(generatedDir, 'schema.ts')
writeFileSync(outputPath, generatedCode)
