type YamlSchema = Record<string, Record<string, string> | string[]>;

export function convertYamlToTypeScript(yamlSchema: YamlSchema): string {
	return `import {
	ArrayType,
	BooleanType,
	IntType,
	ObjectType,
	OptionalType,
	RecordType,
	StringType,
	UIntType,
	UnionType,
} from "../generator";

${Object.entries(yamlSchema)
	.map(([typeName, fields]) => {		
		if (Array.isArray(fields)) {
			return `const ${typeName} = UnionType([
	${fields.map(field => `"${field}",`).join('\n  ')}
]);`;
		}

		return `const ${typeName} = ObjectType({
	${Object.entries(fields)
		.map(([fieldName, fieldType]) => `${fieldName}: ${convertFieldToTypeExpr(fieldType)},`)
		.join('\n  ')}
});`;
	})
	.join('\n\n')}

export default {
${Object.keys(yamlSchema)
	.map(name => `  ${name},`)
	.join('\n')}
};
`;
}

function convertFieldToTypeExpr(fieldType: string): string {
	if (!fieldType) return 'ObjectType({})';
	
	// Handle Record types
	if (fieldType.startsWith('Record<')) {
		const [keyType, valueType] = fieldType.slice(7, -1).split(', ');
		if (keyType === 'UInt') return `RecordType(UIntType(), "${valueType}")`;
		if (keyType === 'String') return `RecordType(StringType(), "${valueType}")`;
		if (keyType === 'Int') return `RecordType(IntType(), "${valueType}")`;
		return `RecordType("${keyType}", "${valueType}")`;
	}
	
	// Handle array types
	if (fieldType.endsWith('[]')) {
		const baseType = fieldType.slice(0, -2);
		if (baseType === 'String') return 'ArrayType(StringType())';
		if (baseType === 'Boolean') return 'ArrayType(BooleanType())';
		if (baseType === 'Int') return 'ArrayType(IntType())';
		if (baseType === 'UInt') return 'ArrayType(UIntType())';
		return `ArrayType("${baseType}")`;
	}
	
	if (fieldType.endsWith('?')) {
		const baseType = fieldType.slice(0, -1);
		if (baseType === 'String') return 'OptionalType(StringType())';
		if (baseType === 'Boolean') return 'OptionalType(BooleanType())';
		if (baseType === 'Int') return 'OptionalType(IntType())';
		if (baseType === 'UInt') return 'OptionalType(UIntType())';
		if (baseType.endsWith('[]')) {
			return `OptionalType(${convertFieldToTypeExpr(baseType)})`;
		}
		return `OptionalType("${baseType}")`;
	}
	
	switch (fieldType) {
		case 'String': return 'StringType()';
		case 'Boolean': return 'BooleanType()';
		case 'Int': return 'IntType()';
		case 'UInt': return 'UIntType()';
		default: return `"${fieldType}"`;
	}
}
