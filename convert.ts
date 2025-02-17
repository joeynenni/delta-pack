import { ArrayType, BooleanType, IntType, ObjectType, OptionalType, RecordType, StringType, UIntType } from "./generator";
import type { Type, ContainerType, PrimitiveType, ReferenceType } from "./generator";

export function convertYamlToSchema(yamlSchema: { types: Record<string, Record<string, string>> }): Record<string, Type> {
	const schema: Record<string, Type> = {};
	
	// First pass: Create all types as references
	for (const typeName of Object.keys(yamlSchema.types)) {
		schema[typeName] = { type: "object", properties: {} };
	}
	
	// Second pass: Fill in the properties
	for (const [typeName, fields] of Object.entries(yamlSchema.types)) {
		console.log('Processing type:', {
			typeName,
			fieldCount: Object.keys(fields).length,
			fields: Object.keys(fields)
		});
		
		if (!(typeName in schema)) {
			throw new Error(`Type ${typeName} referenced but not defined`);
		}
		
		const properties: Record<string, ReferenceType | ContainerType | PrimitiveType> = {};
		
		for (const [fieldName, fieldType] of Object.entries(fields)) {
			if (fieldType.endsWith('[]')) {
				const baseType = fieldType.slice(0, -2);
				properties[fieldName] = ArrayType(convertContainerType(baseType));
			} else if (fieldType.endsWith('?')) {
				const baseType = fieldType.slice(0, -1);
				properties[fieldName] = OptionalType(convertContainerType(baseType));
			} else if (fieldType.startsWith('Record<')) {
				const [keyType, valueType] = fieldType.slice(7, -1).split(', ');
				properties[fieldName] = RecordType(convertKeyType(keyType), convertContainerType(valueType));
			} else {
				properties[fieldName] = convertFieldType(fieldType);
			}
		}
		
		(schema[typeName] as ObjectType).properties = properties;
	}
	
	// Validate all references exist
	for (const [typeName, type] of Object.entries(schema)) {
		validateReferences(type, Object.keys(schema));
	}
	
	console.log('Final schema:', JSON.stringify(schema, null, 2));
	return schema;
}

function validateReferences(type: Type, validTypes: string[]): void {
	if (type.type === "reference") {
		const baseType = type.reference.replace(/\[\]$/, '');
		if (!validTypes.includes(baseType) && !['String', 'Boolean', 'Int', 'UInt'].includes(baseType)) {
			console.log('Invalid reference:', {
				reference: type.reference,
				baseType,
				validTypes
			});
			throw new Error(`Invalid reference: ${type.reference}`);
		}
	} else if (type.type === "array") {
		validateReferences(type.value, validTypes);
	} else if (type.type === "optional" || type.type === "record") {
		validateReferences(type.value, validTypes);
	} else if (type.type === "object") {
		Object.values(type.properties).forEach(prop => {
			validateReferences(prop, validTypes);
		});
	}
}

function convertFieldType(type: string): ReferenceType | ContainerType | PrimitiveType {
	switch (type) {
		case 'String': return StringType();
		case 'Boolean': return BooleanType();
		case 'Int': return IntType();
		case 'UInt': return UIntType();
		default: return { type: 'reference' as const, reference: type };
	}
}

function convertContainerType(type: string): string | PrimitiveType | ContainerType {
	console.log('Converting container type:', {
		input: type,
		isArray: type.endsWith('[]'),
		baseType: type.replace(/\[\]$/, '')
	});
	
	if (type.endsWith('[]')) {
		const baseType = type.replace(/\[\]$/, '');
		return ArrayType(baseType);
	}
	
	switch (type) {
		case 'String': return StringType();
		case 'Boolean': return BooleanType();
		case 'Int': return IntType();
		case 'UInt': return UIntType();
		default: return type;
	}
}

function convertKeyType(type: string): StringType | IntType | UIntType {
	switch (type) {
		case 'String': return StringType();
		case 'Int': return IntType();
		case 'UInt': return UIntType();
		default: throw new Error(`Invalid key type: ${type}`);
	}
}

function convertProperties(props: Record<string, Type>): Record<string, ReferenceType | ContainerType | PrimitiveType> {
	const converted: Record<string, ReferenceType | ContainerType | PrimitiveType> = {};
	for (const [key, value] of Object.entries(props)) {
		converted[key] = value as ReferenceType | ContainerType | PrimitiveType;
	}
	return converted;
}