import { readFileSync } from 'node:fs'
import Handlebars from 'handlebars'
import prettier from 'prettier'

export type Type = ObjectType | UnionType | EnumType | StringType | IntType | FloatType | BooleanType
export enum Modifier {
	OPTIONAL = 'optional',
	ARRAY = 'array'
}

type ChildType = (StringType | IntType | FloatType | BooleanType | ReferenceType) & {
	modifier?: Modifier
}

interface ReferenceType {
	type: 'reference'
	reference: string
}

interface ObjectType {
	type: 'object'
	properties: Record<string, ChildType>
}

interface UnionType {
	type: 'union'
	options: ReferenceType[]
}

interface EnumType {
	type: 'enum'
	options: string[]
}

interface StringType {
	type: 'string'
}

interface IntType {
	type: 'int'
}

interface FloatType {
	type: 'float'
}

interface BooleanType {
	type: 'boolean'
}

export function ReferenceType(reference: string): ReferenceType {
	return { type: 'reference', reference }
}

export function ObjectType(properties: Record<string, ChildType>): ObjectType {
	return { type: 'object', properties }
}

export function ChildType(
	type: StringType | IntType | FloatType | BooleanType | ReferenceType,
	modifier?: Modifier
): ChildType {
	return { ...type, modifier }
}

export function UnionType(options: ReferenceType[]): UnionType {
	return { type: 'union', options }
}

export function EnumType(options: string[]): EnumType {
	return { type: 'enum', options }
}

export function StringType(): StringType {
	return { type: 'string' }
}

export function IntType(): IntType {
	return { type: 'int' }
}

export function FloatType(): FloatType {
	return { type: 'float' }
}

export function BooleanType(): BooleanType {
	return { type: 'boolean' }
}

Handlebars.registerHelper('eq', (a, b) => a === b)
Handlebars.registerHelper('concat', (a, b) => a + b)

export async function generateCode(types: Record<string, Type>): Promise<string> {
	const templateFile = readFileSync(new URL('template.hbs', import.meta.url), 'utf8')
	Handlebars.registerHelper('log', console.log)
	const template = Handlebars.compile(templateFile)
	const generated = template(types)

	// Format with prettier
	return prettier.format(generated, {
		parser: 'typescript',
		semi: true,
		singleQuote: true,
		printWidth: 100,
		tabWidth: 2,
		trailingComma: 'es5'
	})
}
