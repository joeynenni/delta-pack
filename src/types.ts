export interface Type {
	type: string
	modifier?: Modifier
}

export enum Modifier {
	OPTIONAL = 'optional',
	ARRAY = 'array'
}

export interface ReferenceType extends Type {
	type: 'reference'
	reference: string
}

export interface ObjectType extends Type {
	type: 'object'
	properties: Record<string, Type>
}

export interface UnionType extends Type {
	type: 'union'
	options: ReferenceType[]
}

export interface EnumType extends Type {
	type: 'enum'
	options: string[]
}

export interface StringType extends Type {
	type: 'string'
}

export interface IntType extends Type {
	type: 'int'
}

export interface FloatType extends Type {
	type: 'float'
}

export interface BooleanType extends Type {
	type: 'boolean'
}

// Type constructors
export function ReferenceType(reference: string): ReferenceType {
	return { type: 'reference', reference }
}

export function ObjectType(properties: Record<string, Type>): ObjectType {
	return { type: 'object', properties }
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
