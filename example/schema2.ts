import {
  ArrayType,
  BooleanType,
  IntType,
  ObjectType,
  ReferenceType,
  StringType,
  codegenTypescript,
} from "../generator";

const Position = ObjectType({
  x: IntType(),
  y: IntType(),
});

const Velocity = ObjectType({
  x: IntType(),
  y: IntType(),
});

const Player = ObjectType({
  id: IntType(),
  name: StringType(),
  type: StringType(),
  position: ReferenceType("Position"),
  velocity: ReferenceType("Velocity"),
  width: IntType(),
  height: IntType(),
  rotation: IntType(),
  mass: IntType(),
  health: IntType(),
  depth: IntType(),
  lifetime: IntType(),
  radius: IntType(),
  isSensor: BooleanType(),
  isStatic: BooleanType(),
  destroyed: BooleanType(),
  owner: IntType(),
  maxSpeed: IntType(),
});

const State = ObjectType({
  id: IntType(),
  state: ArrayType(ReferenceType("Player")),
});

console.log(
  codegenTypescript({
    Position,
    Velocity,
    Player,
    State,
  }),
);
