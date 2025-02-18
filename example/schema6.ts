import {
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

const Point = ObjectType({
  x: IntType(),
  y: IntType(),
});

const CreatureState = ObjectType({
  team: StringType(),
  hero: BooleanType(),
  creatureType: StringType(),
  equippedItemType: OptionalType(StringType()),
  health: UIntType(),
  maxHealth: UIntType(),
  visible: BooleanType(),
  facing: StringType(),
  moving: BooleanType(),
  moveType: StringType(),
  moveTargetX: OptionalType(IntType()),
  moveTargetY: OptionalType(IntType()),
  enemyTargetX: OptionalType(IntType()),
  enemyTargetY: OptionalType(IntType()),
  using: OptionalType(StringType()),
  useDirection: OptionalType(StringType()),
  takingDamage: BooleanType(),
  frozen: BooleanType(),
  statusEffect: OptionalType(StringType()),
  x: IntType(),
  y: IntType(),
});

const ItemState = ObjectType({
  itemType: StringType(),
  potionType: OptionalType(StringType()),
  weaponType: OptionalType(StringType()),
  x: IntType(),
  y: IntType(),
});

const EffectState = ObjectType({
  creatureId: OptionalType(UIntType()),
  effectType: StringType(),
  triggerType: OptionalType(StringType()),
  ellipseEffectType: OptionalType(StringType()),
  weaponEffectType: OptionalType(StringType()),
  projectileType: OptionalType(StringType()),
  visualEffectType: OptionalType(StringType()),
  swingType: OptionalType(StringType()),
  thrustType: OptionalType(StringType()),
  weaponType: OptionalType(StringType()),
  direction: OptionalType(StringType()),
  angle: OptionalType(IntType()),
  radius: OptionalType(UIntType()),
  x: IntType(),
  y: IntType(),
  z: OptionalType(IntType()),
});

const ObjectState = ObjectType({
  team: OptionalType(StringType()),
  objectType: StringType(),
  destructibleObjectType: OptionalType(StringType()),
  environmentObjectType: OptionalType(StringType()),
  interactiveObjectType: OptionalType(StringType()),
  active: OptionalType(BooleanType()),
  towerName: OptionalType(StringType()),
  width: OptionalType(UIntType()),
  height: OptionalType(UIntType()),
  angle: OptionalType(IntType()),
  durability: OptionalType(UIntType()),
  maxDurability: OptionalType(UIntType()),
  x: IntType(),
  y: IntType(),
});

const DebugBodyState = ObjectType({
  x: IntType(),
  y: IntType(),
  points: ArrayType("Point"),
});

const PlayerState = ObjectType({
  name: StringType(),
  team: OptionalType(StringType()),
  hero: OptionalType(UIntType()),
  cents: OptionalType(UIntType()),
  deck: OptionalType("DeckState"),
  randomSlots: OptionalType(ArrayType(StringType())),
  hand: OptionalType("HandState"),
  skills: OptionalType("SkillsState"),
  restrictionZones: StringType(),
});

const SpectatorState = ObjectType({
  name: StringType(),
});

const DeckState = ObjectType({
  card1: OptionalType(StringType()),
  card2: OptionalType(StringType()),
  card3: OptionalType(StringType()),
  card4: OptionalType(StringType()),
  card5: OptionalType(StringType()),
  card6: OptionalType(StringType()),
  card7: OptionalType(StringType()),
  card8: OptionalType(StringType()),
});

const HandState = ObjectType({
  slot1: OptionalType(StringType()),
  slot2: OptionalType(StringType()),
  slot3: OptionalType(StringType()),
  slot4: OptionalType(StringType()),
});

const SkillsState = ObjectType({
  slot1: OptionalType("SkillState"),
  slot2: OptionalType("SkillState"),
  slot3: OptionalType("SkillState"),
  slot4: OptionalType("SkillState"),
});

const SkillState = ObjectType({
  type: StringType(),
  inUse: BooleanType(),
  cooldown: UIntType(),
  cooldownTotal: UIntType(),
});

const GameInfo = ObjectType({
  mode: OptionalType(StringType()),
  timeLimit: OptionalType(UIntType()),
  timeElapsed: OptionalType(IntType()),
  suddenDeath: OptionalType(BooleanType()),
  winner: OptionalType(StringType()),
});

const DraftState = ObjectType({
  timeRemaining: UIntType(),
  decks: ArrayType("DraftDeckState"),
  pairs: ArrayType("CardPairState"),
});

const DraftDeckState = ObjectType({
  playerId: StringType(),
  card1: OptionalType(StringType()),
  card2: OptionalType(StringType()),
  card3: OptionalType(StringType()),
  card4: OptionalType(StringType()),
  card5: OptionalType(StringType()),
  card6: OptionalType(StringType()),
  card7: OptionalType(StringType()),
  card8: OptionalType(StringType()),
});

const CardPairState = ObjectType({
  playerId: StringType(),
  slot1: StringType(),
  slot2: StringType(),
});

const GameState = ObjectType({
  creatures: RecordType(UIntType(), "CreatureState"),
  items: RecordType(UIntType(), "ItemState"),
  effects: RecordType(UIntType(), "EffectState"),
  objects: RecordType(UIntType(), "ObjectState"),
  players: RecordType(StringType(), "PlayerState"),
  spectators: RecordType(StringType(), "SpectatorState"),
  info: "GameInfo",
  draft: OptionalType("DraftState"),
  debugBodies: OptionalType(ArrayType("DebugBodyState")),
});

const JoinGameRequest = ObjectType({
  action: StringType(),
  payload: "JoinGameRequestPayload",
});

const JoinGameRequestPayload = ObjectType({
  username: OptionalType(StringType()),
  guest: OptionalType(BooleanType()),
  deck: OptionalType("DeckState"),
  spectator: OptionalType(BooleanType()),
});

const LeaveGameRequest = ObjectType({
  action: StringType(),
  payload: "LeaveGameRequestPayload",
});

const LeaveGameRequestPayload = ObjectType({
  reason: OptionalType(StringType()),
});

const DraftCardRequest = ObjectType({
  action: StringType(),
  payload: "DraftCardRequestPayload",
});

const DraftCardRequestPayload = ObjectType({
  slot: UIntType(),
});

const PlayCardRequest = ObjectType({
  action: StringType(),
  payload: "PlayCardRequestPayload",
});

const PlayCardRequestPayload = ObjectType({
  slot: UIntType(),
  variant: OptionalType(UIntType()),
  position: "Point",
});

const UseSkillRequest = ObjectType({
  action: StringType(),
  payload: "UseSkillRequestPayload",
});

const UseSkillRequestPayload = ObjectType({
  slot: UIntType(),
  position: OptionalType("Point"),
});

const HeartbeatRequest = ObjectType({
  action: StringType(),
});

const RequestMessage = UnionType([
  "JoinGameRequest",
  "LeaveGameRequest",
  "DraftCardRequest",
  "PlayCardRequest",
  "UseSkillRequest",
  "HeartbeatRequest",
]);

export default {
  Point,
  CreatureState,
  ItemState,
  EffectState,
  ObjectState,
  PlayerState,
  SpectatorState,
  DeckState,
  HandState,
  SkillsState,
  SkillState,
  GameInfo,
  DraftState,
  DraftDeckState,
  CardPairState,
  DebugBodyState,
  GameState,
  JoinGameRequest,
  JoinGameRequestPayload,
  LeaveGameRequest,
  LeaveGameRequestPayload,
  DraftCardRequest,
  DraftCardRequestPayload,
  PlayCardRequest,
  PlayCardRequestPayload,
  UseSkillRequest,
  UseSkillRequestPayload,
  HeartbeatRequest,
  RequestMessage,
};
