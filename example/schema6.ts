import {
  BooleanType,
  ChildType,
  IntType,
  Modifier,
  ObjectType,
  RecordType,
  ReferenceType,
  StringType,
  codegenTypescript,
} from "../generator";

const Point = ObjectType({
  x: IntType(),
  y: IntType(),
});

const CreatureState = ObjectType({
  id: IntType(),
  team: StringType(),
  hero: BooleanType(),
  creatureType: StringType(),
  equippedItemType: ChildType(StringType(), Modifier.OPTIONAL),
  health: IntType(),
  maxHealth: IntType(),
  visible: BooleanType(),
  facing: StringType(),
  moving: BooleanType(),
  moveType: StringType(),
  moveTargetX: ChildType(IntType(), Modifier.OPTIONAL),
  moveTargetY: ChildType(IntType(), Modifier.OPTIONAL),
  enemyTargetX: ChildType(IntType(), Modifier.OPTIONAL),
  enemyTargetY: ChildType(IntType(), Modifier.OPTIONAL),
  using: ChildType(StringType(), Modifier.OPTIONAL),
  useDirection: ChildType(StringType(), Modifier.OPTIONAL),
  takingDamage: BooleanType(),
  frozen: BooleanType(),
  statusEffect: ChildType(StringType(), Modifier.OPTIONAL),
  x: IntType(),
  y: IntType(),
  dead: BooleanType(),
});

const ItemState = ObjectType({
  id: IntType(),
  itemType: StringType(),
  potionType: ChildType(StringType(), Modifier.OPTIONAL),
  weaponType: ChildType(StringType(), Modifier.OPTIONAL),
  x: IntType(),
  y: IntType(),
});

const EffectState = ObjectType({
  id: IntType(),
  creatureId: ChildType(IntType(), Modifier.OPTIONAL),
  effectType: StringType(),
  triggerType: ChildType(StringType(), Modifier.OPTIONAL),
  ellipseEffectType: ChildType(StringType(), Modifier.OPTIONAL),
  weaponEffectType: ChildType(StringType(), Modifier.OPTIONAL),
  projectileType: ChildType(StringType(), Modifier.OPTIONAL),
  visualEffectType: ChildType(StringType(), Modifier.OPTIONAL),
  swingType: ChildType(StringType(), Modifier.OPTIONAL),
  thrustType: ChildType(StringType(), Modifier.OPTIONAL),
  weaponType: ChildType(StringType(), Modifier.OPTIONAL),
  direction: ChildType(StringType(), Modifier.OPTIONAL),
  angle: ChildType(IntType(), Modifier.OPTIONAL),
  radius: ChildType(IntType(), Modifier.OPTIONAL),
  x: IntType(),
  y: IntType(),
  z: ChildType(IntType(), Modifier.OPTIONAL),
});

const ObjectState = ObjectType({
  id: IntType(),
  team: ChildType(StringType(), Modifier.OPTIONAL),
  objectType: StringType(),
  destructibleObjectType: ChildType(StringType(), Modifier.OPTIONAL),
  environmentObjectType: ChildType(StringType(), Modifier.OPTIONAL),
  interactiveObjectType: ChildType(StringType(), Modifier.OPTIONAL),
  active: ChildType(BooleanType(), Modifier.OPTIONAL),
  towerName: ChildType(StringType(), Modifier.OPTIONAL),
  width: ChildType(IntType(), Modifier.OPTIONAL),
  height: ChildType(IntType(), Modifier.OPTIONAL),
  angle: ChildType(IntType(), Modifier.OPTIONAL),
  durability: ChildType(IntType(), Modifier.OPTIONAL),
  maxDurability: ChildType(IntType(), Modifier.OPTIONAL),
  x: IntType(),
  y: IntType(),
});

const DebugBodyState = ObjectType({
  x: IntType(),
  y: IntType(),
  points: ChildType(ReferenceType("Point"), Modifier.ARRAY),
});

const PlayerState = ObjectType({
  id: StringType(),
  name: StringType(),
  team: ChildType(StringType(), Modifier.OPTIONAL),
  hero: ChildType(IntType(), Modifier.OPTIONAL),
  cents: ChildType(IntType(), Modifier.OPTIONAL),
  deck: ChildType(ReferenceType("DeckState"), Modifier.OPTIONAL),
  randomSlots: ChildType(StringType(), Modifier.ARRAY),
  hand: ChildType(ReferenceType("HandState"), Modifier.OPTIONAL),
  skills: ChildType(ReferenceType("SkillsState"), Modifier.OPTIONAL),
  restrictionZones: StringType(),
});

const SpectatorState = ObjectType({
  id: StringType(),
  name: StringType(),
});

const DeckState = ObjectType({
  card1: ChildType(StringType(), Modifier.OPTIONAL),
  card2: ChildType(StringType(), Modifier.OPTIONAL),
  card3: ChildType(StringType(), Modifier.OPTIONAL),
  card4: ChildType(StringType(), Modifier.OPTIONAL),
  card5: ChildType(StringType(), Modifier.OPTIONAL),
  card6: ChildType(StringType(), Modifier.OPTIONAL),
  card7: ChildType(StringType(), Modifier.OPTIONAL),
  card8: ChildType(StringType(), Modifier.OPTIONAL),
});

const HandState = ObjectType({
  slot1: ChildType(StringType(), Modifier.OPTIONAL),
  slot2: ChildType(StringType(), Modifier.OPTIONAL),
  slot3: ChildType(StringType(), Modifier.OPTIONAL),
  slot4: ChildType(StringType(), Modifier.OPTIONAL),
});

const SkillsState = ObjectType({
  slot1: ChildType(ReferenceType("SkillState"), Modifier.OPTIONAL),
  slot2: ChildType(ReferenceType("SkillState"), Modifier.OPTIONAL),
  slot3: ChildType(ReferenceType("SkillState"), Modifier.OPTIONAL),
  slot4: ChildType(ReferenceType("SkillState"), Modifier.OPTIONAL),
});

const SkillState = ObjectType({
  type: StringType(),
  inUse: BooleanType(),
  cooldown: IntType(),
  cooldownTotal: IntType(),
});

const GameInfo = ObjectType({
  mode: ChildType(StringType(), Modifier.OPTIONAL),
  timeLimit: ChildType(IntType(), Modifier.OPTIONAL),
  timeElapsed: ChildType(IntType(), Modifier.OPTIONAL),
  suddenDeath: ChildType(BooleanType(), Modifier.OPTIONAL),
  winner: ChildType(StringType(), Modifier.OPTIONAL),
});

const DraftState = ObjectType({
  timeRemaining: IntType(),
  decks: ChildType(ReferenceType("DraftDeckState"), Modifier.ARRAY),
  pairs: ChildType(ReferenceType("CardPairState"), Modifier.ARRAY),
});

const DraftDeckState = ObjectType({
  playerId: StringType(),
  card1: ChildType(StringType(), Modifier.OPTIONAL),
  card2: ChildType(StringType(), Modifier.OPTIONAL),
  card3: ChildType(StringType(), Modifier.OPTIONAL),
  card4: ChildType(StringType(), Modifier.OPTIONAL),
  card5: ChildType(StringType(), Modifier.OPTIONAL),
  card6: ChildType(StringType(), Modifier.OPTIONAL),
  card7: ChildType(StringType(), Modifier.OPTIONAL),
  card8: ChildType(StringType(), Modifier.OPTIONAL),
});

const CardPairState = ObjectType({
  playerId: StringType(),
  slot1: StringType(),
  slot2: StringType(),
});

const GameState = ObjectType({
  creatures: RecordType(IntType(), ReferenceType("CreatureState")),
  items: ChildType(ReferenceType("ItemState"), Modifier.ARRAY),
  effects: ChildType(ReferenceType("EffectState"), Modifier.ARRAY),
  objects: ChildType(ReferenceType("ObjectState"), Modifier.ARRAY),
  players: ChildType(ReferenceType("PlayerState"), Modifier.ARRAY),
  spectators: ChildType(ReferenceType("SpectatorState"), Modifier.ARRAY),
  info: ReferenceType("GameInfo"),
  draft: ChildType(ReferenceType("DraftState"), Modifier.OPTIONAL),
  // TODO: make optional array? (empty array is easier to handle)
  debugBodies: ChildType(ReferenceType("DebugBodyState"), Modifier.ARRAY),
});

console.log(
  codegenTypescript({
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
    Point,
    GameState,
  }),
);
