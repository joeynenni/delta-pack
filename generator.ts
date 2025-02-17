import { renderDoc } from "./codegen";

export type PrimitiveType = EnumType | StringType | IntType | UIntType | FloatType | BooleanType;
export type ContainerType = ArrayType | OptionalType | RecordType;
export type Type = ReferenceType | ObjectType | UnionType | ContainerType | PrimitiveType;
export type ReferenceType = {
  type: "reference";
  reference: string;
};
export interface ObjectType {
  type: "object";
  properties: Record<string, PrimitiveType | ContainerType | ReferenceType>;
}
export interface UnionType {
  type: "union";
  options: ReferenceType[];
}
export interface ArrayType {
  type: "array";
  value: PrimitiveType | ContainerType | ReferenceType;
}
export interface OptionalType {
  type: "optional";
  value: PrimitiveType | ContainerType | ReferenceType;
}
export interface RecordType {
  type: "record";
  key: StringType | IntType | UIntType;
  value: PrimitiveType | ContainerType | ReferenceType;
}
export interface EnumType {
  type: "enum";
  options: string[];
}
export interface StringType {
  type: "string";
}
export interface IntType {
  type: "int";
}
export interface UIntType {
  type: "uint";
}
export interface FloatType {
  type: "float";
}
export interface BooleanType {
  type: "boolean";
}

export function ObjectType(properties: Record<string, PrimitiveType | ContainerType | string>): ObjectType {
  return {
    type: "object",
    properties: Object.fromEntries(
      Object.entries(properties).map(([key, value]) => {
        return [key, handleReference(value)];
      }),
    ),
  };
}

export function UnionType(options: string[]): UnionType {
  return { type: "union", options: options.map((option) => ({ type: "reference", reference: option })) };
}

export function ArrayType(value: PrimitiveType | ContainerType | string): ArrayType {
  return { type: "array", value: handleReference(value) };
}

export function OptionalType(value: PrimitiveType | ContainerType | string): OptionalType {
  return { type: "optional", value: handleReference(value) };
}

export function RecordType(
  key: StringType | IntType | UIntType,
  value: PrimitiveType | ContainerType | string,
): RecordType {
  return { type: "record", key, value: handleReference(value) };
}

export function EnumType(options: string[]): EnumType {
  return { type: "enum", options };
}

export function StringType(): StringType {
  return { type: "string" };
}

export function IntType(): IntType {
  return { type: "int" };
}

export function UIntType(): UIntType {
  return { type: "uint" };
}

export function FloatType(): FloatType {
  return { type: "float" };
}

export function BooleanType(): BooleanType {
  return { type: "boolean" };
}

export function codegenTypescript(doc: Record<string, Type>) {
  return renderDoc(doc);
}

function handleReference<T>(value: T | string) {
  return typeof value === "string" ? { type: "reference" as const, reference: value } : value;
}
