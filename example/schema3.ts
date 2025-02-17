import {
  ArrayType,
  EnumType,
  FloatType,
  IntType,
  ObjectType,
  StringType,
  UnionType,
  codegenTypescript,
} from "../generator";

const ChatMessage = ObjectType({
  author: StringType(),
  content: StringType(),
});

const ChatList = ObjectType({
  messages: ArrayType("ChatMessage"),
});

const Color = StringType();

const Position = ObjectType({
  x: FloatType(),
  y: FloatType(),
  z: FloatType(),
});

const Rotation = ObjectType({
  x: FloatType(),
  y: FloatType(),
  z: FloatType(),
  w: FloatType(),
});

const Size3D = ObjectType({
  width: FloatType(),
  height: FloatType(),
  depth: FloatType(),
});

const Size1D = FloatType();

const EntityEvent = EnumType(["DESTROYED"]);

const EntityState = EnumType(["IDLE", "WALK", "RUN", "JUMP", "ATTACK", "FALL", "DEATH"]);

const Component = UnionType([
  "Color",
  "Position",
  "Rotation",
  "Size3D",
  "Size1D",
  "EntityEvent",
  "EntityState",
  "ChatList",
]);

const Entity = ObjectType({
  entityId: IntType(),
  components: ArrayType("Component"),
});

const Snapshot = ObjectType({
  entities: ArrayType("Entity"),
});

console.log(
  codegenTypescript({
    ChatMessage,
    ChatList,
    Color,
    Position,
    Rotation,
    Size3D,
    Size1D,
    EntityEvent,
    EntityState,
    Component,
    Entity,
    Snapshot,
  }),
);
