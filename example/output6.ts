import * as _ from "../helpers.ts";

export type CreatureState = {
  team: string;
  hero: boolean;
  creatureType: string;
  equippedItemType?: string;
  health: number;
  maxHealth: number;
  visible: boolean;
  facing: string;
  moving: boolean;
  moveType: string;
  moveTargetX?: number;
  moveTargetY?: number;
  enemyTargetX?: number;
  enemyTargetY?: number;
  using?: string;
  useDirection?: string;
  takingDamage: boolean;
  frozen: boolean;
  statusEffect?: string;
  x: number;
  y: number;
};
export type ItemState = {
  itemType: string;
  potionType?: string;
  weaponType?: string;
  x: number;
  y: number;
};
export type EffectState = {
  creatureId?: number;
  effectType: string;
  triggerType?: string;
  ellipseEffectType?: string;
  weaponEffectType?: string;
  projectileType?: string;
  visualEffectType?: string;
  swingType?: string;
  thrustType?: string;
  weaponType?: string;
  direction?: string;
  angle?: number;
  radius?: number;
  x: number;
  y: number;
  z?: number;
};
export type ObjectState = {
  team?: string;
  objectType: string;
  destructibleObjectType?: string;
  environmentObjectType?: string;
  interactiveObjectType?: string;
  active?: boolean;
  towerName?: string;
  width?: number;
  height?: number;
  angle?: number;
  durability?: number;
  maxDurability?: number;
  x: number;
  y: number;
};
export type PlayerState = {
  name: string;
  team?: string;
  hero?: number;
  cents?: number;
  deck?: DeckState;
  randomSlots: string[];
  hand?: HandState;
  skills?: SkillsState;
  restrictionZones: string;
};
export type SpectatorState = {
  name: string;
};
export type DeckState = {
  card1?: string;
  card2?: string;
  card3?: string;
  card4?: string;
  card5?: string;
  card6?: string;
  card7?: string;
  card8?: string;
};
export type HandState = {
  slot1?: string;
  slot2?: string;
  slot3?: string;
  slot4?: string;
};
export type SkillsState = {
  slot1?: SkillState;
  slot2?: SkillState;
  slot3?: SkillState;
  slot4?: SkillState;
};
export type SkillState = {
  type: string;
  inUse: boolean;
  cooldown: number;
  cooldownTotal: number;
};
export type GameInfo = {
  mode?: string;
  timeLimit?: number;
  timeElapsed?: number;
  suddenDeath?: boolean;
  winner?: string;
};
export type DraftState = {
  timeRemaining: number;
  decks: DraftDeckState[];
  pairs: CardPairState[];
};
export type DraftDeckState = {
  playerId: string;
  card1?: string;
  card2?: string;
  card3?: string;
  card4?: string;
  card5?: string;
  card6?: string;
  card7?: string;
  card8?: string;
};
export type CardPairState = {
  playerId: string;
  slot1: string;
  slot2: string;
};
export type DebugBodyState = {
  x: number;
  y: number;
  points: Point[];
};
export type Point = {
  x: number;
  y: number;
};
export type GameState = {
  creatures: Map<number, CreatureState>;
  items: Map<number, ItemState>;
  effects: Map<number, EffectState>;
  objects: Map<number, ObjectState>;
  players: Map<string, PlayerState>;
  spectators: Map<string, SpectatorState>;
  info: GameInfo;
  draft?: DraftState;
  debugBodies?: DebugBodyState[];
};


export const CreatureState = {
  default(): CreatureState {
    return {
      team: "",
      hero: false,
      creatureType: "",
      equippedItemType: undefined,
      health: 0,
      maxHealth: 0,
      visible: false,
      facing: "",
      moving: false,
      moveType: "",
      moveTargetX: undefined,
      moveTargetY: undefined,
      enemyTargetX: undefined,
      enemyTargetY: undefined,
      using: undefined,
      useDirection: undefined,
      takingDamage: false,
      frozen: false,
      statusEffect: undefined,
      x: 0,
      y: 0,
    };
  },
  validate(obj: CreatureState) {
    if (typeof obj !== "object") {
      return [`Invalid CreatureState object: ${obj}`];
    }
    let validationErrors: string[] = [];

    validationErrors = _.validatePrimitive(typeof obj.team === "string", `Invalid string: ${obj.team}`);
    if (validationErrors.length > 0) {
      return validationErrors.concat("Invalid key: CreatureState.team");
    }
    validationErrors = _.validatePrimitive(typeof obj.hero === "boolean", `Invalid boolean: ${obj.hero}`);
    if (validationErrors.length > 0) {
      return validationErrors.concat("Invalid key: CreatureState.hero");
    }
    validationErrors = _.validatePrimitive(typeof obj.creatureType === "string", `Invalid string: ${obj.creatureType}`);
    if (validationErrors.length > 0) {
      return validationErrors.concat("Invalid key: CreatureState.creatureType");
    }
    validationErrors = _.validateOptional(obj.equippedItemType, (x) => _.validatePrimitive(typeof x === "string", `Invalid string: ${x}`));
    if (validationErrors.length > 0) {
      return validationErrors.concat("Invalid key: CreatureState.equippedItemType");
    }
    validationErrors = _.validatePrimitive(Number.isInteger(obj.health) && obj.health >= 0, `Invalid uint: ${obj.health}`);
    if (validationErrors.length > 0) {
      return validationErrors.concat("Invalid key: CreatureState.health");
    }
    validationErrors = _.validatePrimitive(Number.isInteger(obj.maxHealth) && obj.maxHealth >= 0, `Invalid uint: ${obj.maxHealth}`);
    if (validationErrors.length > 0) {
      return validationErrors.concat("Invalid key: CreatureState.maxHealth");
    }
    validationErrors = _.validatePrimitive(typeof obj.visible === "boolean", `Invalid boolean: ${obj.visible}`);
    if (validationErrors.length > 0) {
      return validationErrors.concat("Invalid key: CreatureState.visible");
    }
    validationErrors = _.validatePrimitive(typeof obj.facing === "string", `Invalid string: ${obj.facing}`);
    if (validationErrors.length > 0) {
      return validationErrors.concat("Invalid key: CreatureState.facing");
    }
    validationErrors = _.validatePrimitive(typeof obj.moving === "boolean", `Invalid boolean: ${obj.moving}`);
    if (validationErrors.length > 0) {
      return validationErrors.concat("Invalid key: CreatureState.moving");
    }
    validationErrors = _.validatePrimitive(typeof obj.moveType === "string", `Invalid string: ${obj.moveType}`);
    if (validationErrors.length > 0) {
      return validationErrors.concat("Invalid key: CreatureState.moveType");
    }
    validationErrors = _.validateOptional(obj.moveTargetX, (x) => _.validatePrimitive(Number.isInteger(x), `Invalid int: ${x}`));
    if (validationErrors.length > 0) {
      return validationErrors.concat("Invalid key: CreatureState.moveTargetX");
    }
    validationErrors = _.validateOptional(obj.moveTargetY, (x) => _.validatePrimitive(Number.isInteger(x), `Invalid int: ${x}`));
    if (validationErrors.length > 0) {
      return validationErrors.concat("Invalid key: CreatureState.moveTargetY");
    }
    validationErrors = _.validateOptional(obj.enemyTargetX, (x) => _.validatePrimitive(Number.isInteger(x), `Invalid int: ${x}`));
    if (validationErrors.length > 0) {
      return validationErrors.concat("Invalid key: CreatureState.enemyTargetX");
    }
    validationErrors = _.validateOptional(obj.enemyTargetY, (x) => _.validatePrimitive(Number.isInteger(x), `Invalid int: ${x}`));
    if (validationErrors.length > 0) {
      return validationErrors.concat("Invalid key: CreatureState.enemyTargetY");
    }
    validationErrors = _.validateOptional(obj.using, (x) => _.validatePrimitive(typeof x === "string", `Invalid string: ${x}`));
    if (validationErrors.length > 0) {
      return validationErrors.concat("Invalid key: CreatureState.using");
    }
    validationErrors = _.validateOptional(obj.useDirection, (x) => _.validatePrimitive(typeof x === "string", `Invalid string: ${x}`));
    if (validationErrors.length > 0) {
      return validationErrors.concat("Invalid key: CreatureState.useDirection");
    }
    validationErrors = _.validatePrimitive(typeof obj.takingDamage === "boolean", `Invalid boolean: ${obj.takingDamage}`);
    if (validationErrors.length > 0) {
      return validationErrors.concat("Invalid key: CreatureState.takingDamage");
    }
    validationErrors = _.validatePrimitive(typeof obj.frozen === "boolean", `Invalid boolean: ${obj.frozen}`);
    if (validationErrors.length > 0) {
      return validationErrors.concat("Invalid key: CreatureState.frozen");
    }
    validationErrors = _.validateOptional(obj.statusEffect, (x) => _.validatePrimitive(typeof x === "string", `Invalid string: ${x}`));
    if (validationErrors.length > 0) {
      return validationErrors.concat("Invalid key: CreatureState.statusEffect");
    }
    validationErrors = _.validatePrimitive(Number.isInteger(obj.x), `Invalid int: ${obj.x}`);
    if (validationErrors.length > 0) {
      return validationErrors.concat("Invalid key: CreatureState.x");
    }
    validationErrors = _.validatePrimitive(Number.isInteger(obj.y), `Invalid int: ${obj.y}`);
    if (validationErrors.length > 0) {
      return validationErrors.concat("Invalid key: CreatureState.y");
    }

    return validationErrors;
  },
  encode(obj: CreatureState, buf: _.Writer = new _.Writer()) {
    _.writeString(buf, obj.team);
    _.writeBoolean(buf, obj.hero);
    _.writeString(buf, obj.creatureType);
    _.writeOptional(buf, obj.equippedItemType, (x) => _.writeString(buf, x));
    _.writeUInt(buf, obj.health);
    _.writeUInt(buf, obj.maxHealth);
    _.writeBoolean(buf, obj.visible);
    _.writeString(buf, obj.facing);
    _.writeBoolean(buf, obj.moving);
    _.writeString(buf, obj.moveType);
    _.writeOptional(buf, obj.moveTargetX, (x) => _.writeInt(buf, x));
    _.writeOptional(buf, obj.moveTargetY, (x) => _.writeInt(buf, x));
    _.writeOptional(buf, obj.enemyTargetX, (x) => _.writeInt(buf, x));
    _.writeOptional(buf, obj.enemyTargetY, (x) => _.writeInt(buf, x));
    _.writeOptional(buf, obj.using, (x) => _.writeString(buf, x));
    _.writeOptional(buf, obj.useDirection, (x) => _.writeString(buf, x));
    _.writeBoolean(buf, obj.takingDamage);
    _.writeBoolean(buf, obj.frozen);
    _.writeOptional(buf, obj.statusEffect, (x) => _.writeString(buf, x));
    _.writeInt(buf, obj.x);
    _.writeInt(buf, obj.y);
    return buf;
  },
  encodeDiff(obj: _.DeepPartial<CreatureState>, tracker: _.Tracker, buf: _.Writer = new _.Writer()) {
    tracker.push(obj.team !== _.NO_DIFF);
    if (obj.team !== _.NO_DIFF) {
      _.writeString(buf, obj.team);
    }
    tracker.push(obj.hero !== _.NO_DIFF);
    if (obj.hero !== _.NO_DIFF) {
      _.writeBoolean(buf, obj.hero);
    }
    tracker.push(obj.creatureType !== _.NO_DIFF);
    if (obj.creatureType !== _.NO_DIFF) {
      _.writeString(buf, obj.creatureType);
    }
    tracker.push(obj.equippedItemType !== _.NO_DIFF);
    if (obj.equippedItemType !== _.NO_DIFF) {
      _.writeOptionalDiff(tracker, obj.equippedItemType, (x) => _.writeString(buf, x));
    }
    tracker.push(obj.health !== _.NO_DIFF);
    if (obj.health !== _.NO_DIFF) {
      _.writeUInt(buf, obj.health);
    }
    tracker.push(obj.maxHealth !== _.NO_DIFF);
    if (obj.maxHealth !== _.NO_DIFF) {
      _.writeUInt(buf, obj.maxHealth);
    }
    tracker.push(obj.visible !== _.NO_DIFF);
    if (obj.visible !== _.NO_DIFF) {
      _.writeBoolean(buf, obj.visible);
    }
    tracker.push(obj.facing !== _.NO_DIFF);
    if (obj.facing !== _.NO_DIFF) {
      _.writeString(buf, obj.facing);
    }
    tracker.push(obj.moving !== _.NO_DIFF);
    if (obj.moving !== _.NO_DIFF) {
      _.writeBoolean(buf, obj.moving);
    }
    tracker.push(obj.moveType !== _.NO_DIFF);
    if (obj.moveType !== _.NO_DIFF) {
      _.writeString(buf, obj.moveType);
    }
    tracker.push(obj.moveTargetX !== _.NO_DIFF);
    if (obj.moveTargetX !== _.NO_DIFF) {
      _.writeOptionalDiff(tracker, obj.moveTargetX, (x) => _.writeInt(buf, x));
    }
    tracker.push(obj.moveTargetY !== _.NO_DIFF);
    if (obj.moveTargetY !== _.NO_DIFF) {
      _.writeOptionalDiff(tracker, obj.moveTargetY, (x) => _.writeInt(buf, x));
    }
    tracker.push(obj.enemyTargetX !== _.NO_DIFF);
    if (obj.enemyTargetX !== _.NO_DIFF) {
      _.writeOptionalDiff(tracker, obj.enemyTargetX, (x) => _.writeInt(buf, x));
    }
    tracker.push(obj.enemyTargetY !== _.NO_DIFF);
    if (obj.enemyTargetY !== _.NO_DIFF) {
      _.writeOptionalDiff(tracker, obj.enemyTargetY, (x) => _.writeInt(buf, x));
    }
    tracker.push(obj.using !== _.NO_DIFF);
    if (obj.using !== _.NO_DIFF) {
      _.writeOptionalDiff(tracker, obj.using, (x) => _.writeString(buf, x));
    }
    tracker.push(obj.useDirection !== _.NO_DIFF);
    if (obj.useDirection !== _.NO_DIFF) {
      _.writeOptionalDiff(tracker, obj.useDirection, (x) => _.writeString(buf, x));
    }
    tracker.push(obj.takingDamage !== _.NO_DIFF);
    if (obj.takingDamage !== _.NO_DIFF) {
      _.writeBoolean(buf, obj.takingDamage);
    }
    tracker.push(obj.frozen !== _.NO_DIFF);
    if (obj.frozen !== _.NO_DIFF) {
      _.writeBoolean(buf, obj.frozen);
    }
    tracker.push(obj.statusEffect !== _.NO_DIFF);
    if (obj.statusEffect !== _.NO_DIFF) {
      _.writeOptionalDiff(tracker, obj.statusEffect, (x) => _.writeString(buf, x));
    }
    tracker.push(obj.x !== _.NO_DIFF);
    if (obj.x !== _.NO_DIFF) {
      _.writeInt(buf, obj.x);
    }
    tracker.push(obj.y !== _.NO_DIFF);
    if (obj.y !== _.NO_DIFF) {
      _.writeInt(buf, obj.y);
    }
    return buf;
  },
  decode(buf: _.Reader): CreatureState {
    const sb = buf;
    return {
      team: _.parseString(sb),
      hero: _.parseBoolean(sb),
      creatureType: _.parseString(sb),
      equippedItemType: _.parseOptional(sb, () => _.parseString(sb)),
      health: _.parseUInt(sb),
      maxHealth: _.parseUInt(sb),
      visible: _.parseBoolean(sb),
      facing: _.parseString(sb),
      moving: _.parseBoolean(sb),
      moveType: _.parseString(sb),
      moveTargetX: _.parseOptional(sb, () => _.parseInt(sb)),
      moveTargetY: _.parseOptional(sb, () => _.parseInt(sb)),
      enemyTargetX: _.parseOptional(sb, () => _.parseInt(sb)),
      enemyTargetY: _.parseOptional(sb, () => _.parseInt(sb)),
      using: _.parseOptional(sb, () => _.parseString(sb)),
      useDirection: _.parseOptional(sb, () => _.parseString(sb)),
      takingDamage: _.parseBoolean(sb),
      frozen: _.parseBoolean(sb),
      statusEffect: _.parseOptional(sb, () => _.parseString(sb)),
      x: _.parseInt(sb),
      y: _.parseInt(sb),
    };
  },
  decodeDiff(buf: _.Reader, tracker: _.Tracker): _.DeepPartial<CreatureState> {
    const sb = buf;
    return {
      team: tracker.next() ? _.parseString(sb) : _.NO_DIFF,
      hero: tracker.next() ? _.parseBoolean(sb) : _.NO_DIFF,
      creatureType: tracker.next() ? _.parseString(sb) : _.NO_DIFF,
      equippedItemType: tracker.next() ? _.parseOptionalDiff(tracker, () => _.parseString(sb)) : _.NO_DIFF,
      health: tracker.next() ? _.parseUInt(sb) : _.NO_DIFF,
      maxHealth: tracker.next() ? _.parseUInt(sb) : _.NO_DIFF,
      visible: tracker.next() ? _.parseBoolean(sb) : _.NO_DIFF,
      facing: tracker.next() ? _.parseString(sb) : _.NO_DIFF,
      moving: tracker.next() ? _.parseBoolean(sb) : _.NO_DIFF,
      moveType: tracker.next() ? _.parseString(sb) : _.NO_DIFF,
      moveTargetX: tracker.next() ? _.parseOptionalDiff(tracker, () => _.parseInt(sb)) : _.NO_DIFF,
      moveTargetY: tracker.next() ? _.parseOptionalDiff(tracker, () => _.parseInt(sb)) : _.NO_DIFF,
      enemyTargetX: tracker.next() ? _.parseOptionalDiff(tracker, () => _.parseInt(sb)) : _.NO_DIFF,
      enemyTargetY: tracker.next() ? _.parseOptionalDiff(tracker, () => _.parseInt(sb)) : _.NO_DIFF,
      using: tracker.next() ? _.parseOptionalDiff(tracker, () => _.parseString(sb)) : _.NO_DIFF,
      useDirection: tracker.next() ? _.parseOptionalDiff(tracker, () => _.parseString(sb)) : _.NO_DIFF,
      takingDamage: tracker.next() ? _.parseBoolean(sb) : _.NO_DIFF,
      frozen: tracker.next() ? _.parseBoolean(sb) : _.NO_DIFF,
      statusEffect: tracker.next() ? _.parseOptionalDiff(tracker, () => _.parseString(sb)) : _.NO_DIFF,
      x: tracker.next() ? _.parseInt(sb) : _.NO_DIFF,
      y: tracker.next() ? _.parseInt(sb) : _.NO_DIFF,
    };
  },
  computeDiff(a: CreatureState, b: CreatureState): _.DeepPartial<CreatureState> | typeof _.NO_DIFF {
    const diff: _.DeepPartial<CreatureState> =  {
      team: _.diffPrimitive(a.team, b.team),
      hero: _.diffPrimitive(a.hero, b.hero),
      creatureType: _.diffPrimitive(a.creatureType, b.creatureType),
      equippedItemType: _.diffOptional(a.equippedItemType, b.equippedItemType, (x, y) => _.diffPrimitive(x, y)),
      health: _.diffPrimitive(a.health, b.health),
      maxHealth: _.diffPrimitive(a.maxHealth, b.maxHealth),
      visible: _.diffPrimitive(a.visible, b.visible),
      facing: _.diffPrimitive(a.facing, b.facing),
      moving: _.diffPrimitive(a.moving, b.moving),
      moveType: _.diffPrimitive(a.moveType, b.moveType),
      moveTargetX: _.diffOptional(a.moveTargetX, b.moveTargetX, (x, y) => _.diffPrimitive(x, y)),
      moveTargetY: _.diffOptional(a.moveTargetY, b.moveTargetY, (x, y) => _.diffPrimitive(x, y)),
      enemyTargetX: _.diffOptional(a.enemyTargetX, b.enemyTargetX, (x, y) => _.diffPrimitive(x, y)),
      enemyTargetY: _.diffOptional(a.enemyTargetY, b.enemyTargetY, (x, y) => _.diffPrimitive(x, y)),
      using: _.diffOptional(a.using, b.using, (x, y) => _.diffPrimitive(x, y)),
      useDirection: _.diffOptional(a.useDirection, b.useDirection, (x, y) => _.diffPrimitive(x, y)),
      takingDamage: _.diffPrimitive(a.takingDamage, b.takingDamage),
      frozen: _.diffPrimitive(a.frozen, b.frozen),
      statusEffect: _.diffOptional(a.statusEffect, b.statusEffect, (x, y) => _.diffPrimitive(x, y)),
      x: _.diffPrimitive(a.x, b.x),
      y: _.diffPrimitive(a.y, b.y),
    };
    return diff.team === _.NO_DIFF && diff.hero === _.NO_DIFF && diff.creatureType === _.NO_DIFF && diff.equippedItemType === _.NO_DIFF && diff.health === _.NO_DIFF && diff.maxHealth === _.NO_DIFF && diff.visible === _.NO_DIFF && diff.facing === _.NO_DIFF && diff.moving === _.NO_DIFF && diff.moveType === _.NO_DIFF && diff.moveTargetX === _.NO_DIFF && diff.moveTargetY === _.NO_DIFF && diff.enemyTargetX === _.NO_DIFF && diff.enemyTargetY === _.NO_DIFF && diff.using === _.NO_DIFF && diff.useDirection === _.NO_DIFF && diff.takingDamage === _.NO_DIFF && diff.frozen === _.NO_DIFF && diff.statusEffect === _.NO_DIFF && diff.x === _.NO_DIFF && diff.y === _.NO_DIFF ? _.NO_DIFF : diff;
  },
  applyDiff(obj: CreatureState, diff: _.DeepPartial<CreatureState> | typeof _.NO_DIFF): CreatureState {
    if (diff === _.NO_DIFF) {
      return obj;
    }
    obj.team = diff.team === _.NO_DIFF ? obj.team : diff.team;
    obj.hero = diff.hero === _.NO_DIFF ? obj.hero : diff.hero;
    obj.creatureType = diff.creatureType === _.NO_DIFF ? obj.creatureType : diff.creatureType;
    obj.equippedItemType = diff.equippedItemType === _.NO_DIFF ? obj.equippedItemType : _.patchOptional(obj.equippedItemType, diff.equippedItemType, (a, b) => b);
    obj.health = diff.health === _.NO_DIFF ? obj.health : diff.health;
    obj.maxHealth = diff.maxHealth === _.NO_DIFF ? obj.maxHealth : diff.maxHealth;
    obj.visible = diff.visible === _.NO_DIFF ? obj.visible : diff.visible;
    obj.facing = diff.facing === _.NO_DIFF ? obj.facing : diff.facing;
    obj.moving = diff.moving === _.NO_DIFF ? obj.moving : diff.moving;
    obj.moveType = diff.moveType === _.NO_DIFF ? obj.moveType : diff.moveType;
    obj.moveTargetX = diff.moveTargetX === _.NO_DIFF ? obj.moveTargetX : _.patchOptional(obj.moveTargetX, diff.moveTargetX, (a, b) => b);
    obj.moveTargetY = diff.moveTargetY === _.NO_DIFF ? obj.moveTargetY : _.patchOptional(obj.moveTargetY, diff.moveTargetY, (a, b) => b);
    obj.enemyTargetX = diff.enemyTargetX === _.NO_DIFF ? obj.enemyTargetX : _.patchOptional(obj.enemyTargetX, diff.enemyTargetX, (a, b) => b);
    obj.enemyTargetY = diff.enemyTargetY === _.NO_DIFF ? obj.enemyTargetY : _.patchOptional(obj.enemyTargetY, diff.enemyTargetY, (a, b) => b);
    obj.using = diff.using === _.NO_DIFF ? obj.using : _.patchOptional(obj.using, diff.using, (a, b) => b);
    obj.useDirection = diff.useDirection === _.NO_DIFF ? obj.useDirection : _.patchOptional(obj.useDirection, diff.useDirection, (a, b) => b);
    obj.takingDamage = diff.takingDamage === _.NO_DIFF ? obj.takingDamage : diff.takingDamage;
    obj.frozen = diff.frozen === _.NO_DIFF ? obj.frozen : diff.frozen;
    obj.statusEffect = diff.statusEffect === _.NO_DIFF ? obj.statusEffect : _.patchOptional(obj.statusEffect, diff.statusEffect, (a, b) => b);
    obj.x = diff.x === _.NO_DIFF ? obj.x : diff.x;
    obj.y = diff.y === _.NO_DIFF ? obj.y : diff.y;
    return obj;
  },
};

export const ItemState = {
  default(): ItemState {
    return {
      itemType: "",
      potionType: undefined,
      weaponType: undefined,
      x: 0,
      y: 0,
    };
  },
  validate(obj: ItemState) {
    if (typeof obj !== "object") {
      return [`Invalid ItemState object: ${obj}`];
    }
    let validationErrors: string[] = [];

    validationErrors = _.validatePrimitive(typeof obj.itemType === "string", `Invalid string: ${obj.itemType}`);
    if (validationErrors.length > 0) {
      return validationErrors.concat("Invalid key: ItemState.itemType");
    }
    validationErrors = _.validateOptional(obj.potionType, (x) => _.validatePrimitive(typeof x === "string", `Invalid string: ${x}`));
    if (validationErrors.length > 0) {
      return validationErrors.concat("Invalid key: ItemState.potionType");
    }
    validationErrors = _.validateOptional(obj.weaponType, (x) => _.validatePrimitive(typeof x === "string", `Invalid string: ${x}`));
    if (validationErrors.length > 0) {
      return validationErrors.concat("Invalid key: ItemState.weaponType");
    }
    validationErrors = _.validatePrimitive(Number.isInteger(obj.x), `Invalid int: ${obj.x}`);
    if (validationErrors.length > 0) {
      return validationErrors.concat("Invalid key: ItemState.x");
    }
    validationErrors = _.validatePrimitive(Number.isInteger(obj.y), `Invalid int: ${obj.y}`);
    if (validationErrors.length > 0) {
      return validationErrors.concat("Invalid key: ItemState.y");
    }

    return validationErrors;
  },
  encode(obj: ItemState, buf: _.Writer = new _.Writer()) {
    _.writeString(buf, obj.itemType);
    _.writeOptional(buf, obj.potionType, (x) => _.writeString(buf, x));
    _.writeOptional(buf, obj.weaponType, (x) => _.writeString(buf, x));
    _.writeInt(buf, obj.x);
    _.writeInt(buf, obj.y);
    return buf;
  },
  encodeDiff(obj: _.DeepPartial<ItemState>, tracker: _.Tracker, buf: _.Writer = new _.Writer()) {
    tracker.push(obj.itemType !== _.NO_DIFF);
    if (obj.itemType !== _.NO_DIFF) {
      _.writeString(buf, obj.itemType);
    }
    tracker.push(obj.potionType !== _.NO_DIFF);
    if (obj.potionType !== _.NO_DIFF) {
      _.writeOptionalDiff(tracker, obj.potionType, (x) => _.writeString(buf, x));
    }
    tracker.push(obj.weaponType !== _.NO_DIFF);
    if (obj.weaponType !== _.NO_DIFF) {
      _.writeOptionalDiff(tracker, obj.weaponType, (x) => _.writeString(buf, x));
    }
    tracker.push(obj.x !== _.NO_DIFF);
    if (obj.x !== _.NO_DIFF) {
      _.writeInt(buf, obj.x);
    }
    tracker.push(obj.y !== _.NO_DIFF);
    if (obj.y !== _.NO_DIFF) {
      _.writeInt(buf, obj.y);
    }
    return buf;
  },
  decode(buf: _.Reader): ItemState {
    const sb = buf;
    return {
      itemType: _.parseString(sb),
      potionType: _.parseOptional(sb, () => _.parseString(sb)),
      weaponType: _.parseOptional(sb, () => _.parseString(sb)),
      x: _.parseInt(sb),
      y: _.parseInt(sb),
    };
  },
  decodeDiff(buf: _.Reader, tracker: _.Tracker): _.DeepPartial<ItemState> {
    const sb = buf;
    return {
      itemType: tracker.next() ? _.parseString(sb) : _.NO_DIFF,
      potionType: tracker.next() ? _.parseOptionalDiff(tracker, () => _.parseString(sb)) : _.NO_DIFF,
      weaponType: tracker.next() ? _.parseOptionalDiff(tracker, () => _.parseString(sb)) : _.NO_DIFF,
      x: tracker.next() ? _.parseInt(sb) : _.NO_DIFF,
      y: tracker.next() ? _.parseInt(sb) : _.NO_DIFF,
    };
  },
  computeDiff(a: ItemState, b: ItemState): _.DeepPartial<ItemState> | typeof _.NO_DIFF {
    const diff: _.DeepPartial<ItemState> =  {
      itemType: _.diffPrimitive(a.itemType, b.itemType),
      potionType: _.diffOptional(a.potionType, b.potionType, (x, y) => _.diffPrimitive(x, y)),
      weaponType: _.diffOptional(a.weaponType, b.weaponType, (x, y) => _.diffPrimitive(x, y)),
      x: _.diffPrimitive(a.x, b.x),
      y: _.diffPrimitive(a.y, b.y),
    };
    return diff.itemType === _.NO_DIFF && diff.potionType === _.NO_DIFF && diff.weaponType === _.NO_DIFF && diff.x === _.NO_DIFF && diff.y === _.NO_DIFF ? _.NO_DIFF : diff;
  },
  applyDiff(obj: ItemState, diff: _.DeepPartial<ItemState> | typeof _.NO_DIFF): ItemState {
    if (diff === _.NO_DIFF) {
      return obj;
    }
    obj.itemType = diff.itemType === _.NO_DIFF ? obj.itemType : diff.itemType;
    obj.potionType = diff.potionType === _.NO_DIFF ? obj.potionType : _.patchOptional(obj.potionType, diff.potionType, (a, b) => b);
    obj.weaponType = diff.weaponType === _.NO_DIFF ? obj.weaponType : _.patchOptional(obj.weaponType, diff.weaponType, (a, b) => b);
    obj.x = diff.x === _.NO_DIFF ? obj.x : diff.x;
    obj.y = diff.y === _.NO_DIFF ? obj.y : diff.y;
    return obj;
  },
};

export const EffectState = {
  default(): EffectState {
    return {
      creatureId: undefined,
      effectType: "",
      triggerType: undefined,
      ellipseEffectType: undefined,
      weaponEffectType: undefined,
      projectileType: undefined,
      visualEffectType: undefined,
      swingType: undefined,
      thrustType: undefined,
      weaponType: undefined,
      direction: undefined,
      angle: undefined,
      radius: undefined,
      x: 0,
      y: 0,
      z: undefined,
    };
  },
  validate(obj: EffectState) {
    if (typeof obj !== "object") {
      return [`Invalid EffectState object: ${obj}`];
    }
    let validationErrors: string[] = [];

    validationErrors = _.validateOptional(obj.creatureId, (x) => _.validatePrimitive(Number.isInteger(x), `Invalid int: ${x}`));
    if (validationErrors.length > 0) {
      return validationErrors.concat("Invalid key: EffectState.creatureId");
    }
    validationErrors = _.validatePrimitive(typeof obj.effectType === "string", `Invalid string: ${obj.effectType}`);
    if (validationErrors.length > 0) {
      return validationErrors.concat("Invalid key: EffectState.effectType");
    }
    validationErrors = _.validateOptional(obj.triggerType, (x) => _.validatePrimitive(typeof x === "string", `Invalid string: ${x}`));
    if (validationErrors.length > 0) {
      return validationErrors.concat("Invalid key: EffectState.triggerType");
    }
    validationErrors = _.validateOptional(obj.ellipseEffectType, (x) => _.validatePrimitive(typeof x === "string", `Invalid string: ${x}`));
    if (validationErrors.length > 0) {
      return validationErrors.concat("Invalid key: EffectState.ellipseEffectType");
    }
    validationErrors = _.validateOptional(obj.weaponEffectType, (x) => _.validatePrimitive(typeof x === "string", `Invalid string: ${x}`));
    if (validationErrors.length > 0) {
      return validationErrors.concat("Invalid key: EffectState.weaponEffectType");
    }
    validationErrors = _.validateOptional(obj.projectileType, (x) => _.validatePrimitive(typeof x === "string", `Invalid string: ${x}`));
    if (validationErrors.length > 0) {
      return validationErrors.concat("Invalid key: EffectState.projectileType");
    }
    validationErrors = _.validateOptional(obj.visualEffectType, (x) => _.validatePrimitive(typeof x === "string", `Invalid string: ${x}`));
    if (validationErrors.length > 0) {
      return validationErrors.concat("Invalid key: EffectState.visualEffectType");
    }
    validationErrors = _.validateOptional(obj.swingType, (x) => _.validatePrimitive(typeof x === "string", `Invalid string: ${x}`));
    if (validationErrors.length > 0) {
      return validationErrors.concat("Invalid key: EffectState.swingType");
    }
    validationErrors = _.validateOptional(obj.thrustType, (x) => _.validatePrimitive(typeof x === "string", `Invalid string: ${x}`));
    if (validationErrors.length > 0) {
      return validationErrors.concat("Invalid key: EffectState.thrustType");
    }
    validationErrors = _.validateOptional(obj.weaponType, (x) => _.validatePrimitive(typeof x === "string", `Invalid string: ${x}`));
    if (validationErrors.length > 0) {
      return validationErrors.concat("Invalid key: EffectState.weaponType");
    }
    validationErrors = _.validateOptional(obj.direction, (x) => _.validatePrimitive(typeof x === "string", `Invalid string: ${x}`));
    if (validationErrors.length > 0) {
      return validationErrors.concat("Invalid key: EffectState.direction");
    }
    validationErrors = _.validateOptional(obj.angle, (x) => _.validatePrimitive(Number.isInteger(x), `Invalid int: ${x}`));
    if (validationErrors.length > 0) {
      return validationErrors.concat("Invalid key: EffectState.angle");
    }
    validationErrors = _.validateOptional(obj.radius, (x) => _.validatePrimitive(Number.isInteger(x) && x >= 0, `Invalid uint: ${x}`));
    if (validationErrors.length > 0) {
      return validationErrors.concat("Invalid key: EffectState.radius");
    }
    validationErrors = _.validatePrimitive(Number.isInteger(obj.x), `Invalid int: ${obj.x}`);
    if (validationErrors.length > 0) {
      return validationErrors.concat("Invalid key: EffectState.x");
    }
    validationErrors = _.validatePrimitive(Number.isInteger(obj.y), `Invalid int: ${obj.y}`);
    if (validationErrors.length > 0) {
      return validationErrors.concat("Invalid key: EffectState.y");
    }
    validationErrors = _.validateOptional(obj.z, (x) => _.validatePrimitive(Number.isInteger(x), `Invalid int: ${x}`));
    if (validationErrors.length > 0) {
      return validationErrors.concat("Invalid key: EffectState.z");
    }

    return validationErrors;
  },
  encode(obj: EffectState, buf: _.Writer = new _.Writer()) {
    _.writeOptional(buf, obj.creatureId, (x) => _.writeInt(buf, x));
    _.writeString(buf, obj.effectType);
    _.writeOptional(buf, obj.triggerType, (x) => _.writeString(buf, x));
    _.writeOptional(buf, obj.ellipseEffectType, (x) => _.writeString(buf, x));
    _.writeOptional(buf, obj.weaponEffectType, (x) => _.writeString(buf, x));
    _.writeOptional(buf, obj.projectileType, (x) => _.writeString(buf, x));
    _.writeOptional(buf, obj.visualEffectType, (x) => _.writeString(buf, x));
    _.writeOptional(buf, obj.swingType, (x) => _.writeString(buf, x));
    _.writeOptional(buf, obj.thrustType, (x) => _.writeString(buf, x));
    _.writeOptional(buf, obj.weaponType, (x) => _.writeString(buf, x));
    _.writeOptional(buf, obj.direction, (x) => _.writeString(buf, x));
    _.writeOptional(buf, obj.angle, (x) => _.writeInt(buf, x));
    _.writeOptional(buf, obj.radius, (x) => _.writeUInt(buf, x));
    _.writeInt(buf, obj.x);
    _.writeInt(buf, obj.y);
    _.writeOptional(buf, obj.z, (x) => _.writeInt(buf, x));
    return buf;
  },
  encodeDiff(obj: _.DeepPartial<EffectState>, tracker: _.Tracker, buf: _.Writer = new _.Writer()) {
    tracker.push(obj.creatureId !== _.NO_DIFF);
    if (obj.creatureId !== _.NO_DIFF) {
      _.writeOptionalDiff(tracker, obj.creatureId, (x) => _.writeInt(buf, x));
    }
    tracker.push(obj.effectType !== _.NO_DIFF);
    if (obj.effectType !== _.NO_DIFF) {
      _.writeString(buf, obj.effectType);
    }
    tracker.push(obj.triggerType !== _.NO_DIFF);
    if (obj.triggerType !== _.NO_DIFF) {
      _.writeOptionalDiff(tracker, obj.triggerType, (x) => _.writeString(buf, x));
    }
    tracker.push(obj.ellipseEffectType !== _.NO_DIFF);
    if (obj.ellipseEffectType !== _.NO_DIFF) {
      _.writeOptionalDiff(tracker, obj.ellipseEffectType, (x) => _.writeString(buf, x));
    }
    tracker.push(obj.weaponEffectType !== _.NO_DIFF);
    if (obj.weaponEffectType !== _.NO_DIFF) {
      _.writeOptionalDiff(tracker, obj.weaponEffectType, (x) => _.writeString(buf, x));
    }
    tracker.push(obj.projectileType !== _.NO_DIFF);
    if (obj.projectileType !== _.NO_DIFF) {
      _.writeOptionalDiff(tracker, obj.projectileType, (x) => _.writeString(buf, x));
    }
    tracker.push(obj.visualEffectType !== _.NO_DIFF);
    if (obj.visualEffectType !== _.NO_DIFF) {
      _.writeOptionalDiff(tracker, obj.visualEffectType, (x) => _.writeString(buf, x));
    }
    tracker.push(obj.swingType !== _.NO_DIFF);
    if (obj.swingType !== _.NO_DIFF) {
      _.writeOptionalDiff(tracker, obj.swingType, (x) => _.writeString(buf, x));
    }
    tracker.push(obj.thrustType !== _.NO_DIFF);
    if (obj.thrustType !== _.NO_DIFF) {
      _.writeOptionalDiff(tracker, obj.thrustType, (x) => _.writeString(buf, x));
    }
    tracker.push(obj.weaponType !== _.NO_DIFF);
    if (obj.weaponType !== _.NO_DIFF) {
      _.writeOptionalDiff(tracker, obj.weaponType, (x) => _.writeString(buf, x));
    }
    tracker.push(obj.direction !== _.NO_DIFF);
    if (obj.direction !== _.NO_DIFF) {
      _.writeOptionalDiff(tracker, obj.direction, (x) => _.writeString(buf, x));
    }
    tracker.push(obj.angle !== _.NO_DIFF);
    if (obj.angle !== _.NO_DIFF) {
      _.writeOptionalDiff(tracker, obj.angle, (x) => _.writeInt(buf, x));
    }
    tracker.push(obj.radius !== _.NO_DIFF);
    if (obj.radius !== _.NO_DIFF) {
      _.writeOptionalDiff(tracker, obj.radius, (x) => _.writeUInt(buf, x));
    }
    tracker.push(obj.x !== _.NO_DIFF);
    if (obj.x !== _.NO_DIFF) {
      _.writeInt(buf, obj.x);
    }
    tracker.push(obj.y !== _.NO_DIFF);
    if (obj.y !== _.NO_DIFF) {
      _.writeInt(buf, obj.y);
    }
    tracker.push(obj.z !== _.NO_DIFF);
    if (obj.z !== _.NO_DIFF) {
      _.writeOptionalDiff(tracker, obj.z, (x) => _.writeInt(buf, x));
    }
    return buf;
  },
  decode(buf: _.Reader): EffectState {
    const sb = buf;
    return {
      creatureId: _.parseOptional(sb, () => _.parseInt(sb)),
      effectType: _.parseString(sb),
      triggerType: _.parseOptional(sb, () => _.parseString(sb)),
      ellipseEffectType: _.parseOptional(sb, () => _.parseString(sb)),
      weaponEffectType: _.parseOptional(sb, () => _.parseString(sb)),
      projectileType: _.parseOptional(sb, () => _.parseString(sb)),
      visualEffectType: _.parseOptional(sb, () => _.parseString(sb)),
      swingType: _.parseOptional(sb, () => _.parseString(sb)),
      thrustType: _.parseOptional(sb, () => _.parseString(sb)),
      weaponType: _.parseOptional(sb, () => _.parseString(sb)),
      direction: _.parseOptional(sb, () => _.parseString(sb)),
      angle: _.parseOptional(sb, () => _.parseInt(sb)),
      radius: _.parseOptional(sb, () => _.parseUInt(sb)),
      x: _.parseInt(sb),
      y: _.parseInt(sb),
      z: _.parseOptional(sb, () => _.parseInt(sb)),
    };
  },
  decodeDiff(buf: _.Reader, tracker: _.Tracker): _.DeepPartial<EffectState> {
    const sb = buf;
    return {
      creatureId: tracker.next() ? _.parseOptionalDiff(tracker, () => _.parseInt(sb)) : _.NO_DIFF,
      effectType: tracker.next() ? _.parseString(sb) : _.NO_DIFF,
      triggerType: tracker.next() ? _.parseOptionalDiff(tracker, () => _.parseString(sb)) : _.NO_DIFF,
      ellipseEffectType: tracker.next() ? _.parseOptionalDiff(tracker, () => _.parseString(sb)) : _.NO_DIFF,
      weaponEffectType: tracker.next() ? _.parseOptionalDiff(tracker, () => _.parseString(sb)) : _.NO_DIFF,
      projectileType: tracker.next() ? _.parseOptionalDiff(tracker, () => _.parseString(sb)) : _.NO_DIFF,
      visualEffectType: tracker.next() ? _.parseOptionalDiff(tracker, () => _.parseString(sb)) : _.NO_DIFF,
      swingType: tracker.next() ? _.parseOptionalDiff(tracker, () => _.parseString(sb)) : _.NO_DIFF,
      thrustType: tracker.next() ? _.parseOptionalDiff(tracker, () => _.parseString(sb)) : _.NO_DIFF,
      weaponType: tracker.next() ? _.parseOptionalDiff(tracker, () => _.parseString(sb)) : _.NO_DIFF,
      direction: tracker.next() ? _.parseOptionalDiff(tracker, () => _.parseString(sb)) : _.NO_DIFF,
      angle: tracker.next() ? _.parseOptionalDiff(tracker, () => _.parseInt(sb)) : _.NO_DIFF,
      radius: tracker.next() ? _.parseOptionalDiff(tracker, () => _.parseUInt(sb)) : _.NO_DIFF,
      x: tracker.next() ? _.parseInt(sb) : _.NO_DIFF,
      y: tracker.next() ? _.parseInt(sb) : _.NO_DIFF,
      z: tracker.next() ? _.parseOptionalDiff(tracker, () => _.parseInt(sb)) : _.NO_DIFF,
    };
  },
  computeDiff(a: EffectState, b: EffectState): _.DeepPartial<EffectState> | typeof _.NO_DIFF {
    const diff: _.DeepPartial<EffectState> =  {
      creatureId: _.diffOptional(a.creatureId, b.creatureId, (x, y) => _.diffPrimitive(x, y)),
      effectType: _.diffPrimitive(a.effectType, b.effectType),
      triggerType: _.diffOptional(a.triggerType, b.triggerType, (x, y) => _.diffPrimitive(x, y)),
      ellipseEffectType: _.diffOptional(a.ellipseEffectType, b.ellipseEffectType, (x, y) => _.diffPrimitive(x, y)),
      weaponEffectType: _.diffOptional(a.weaponEffectType, b.weaponEffectType, (x, y) => _.diffPrimitive(x, y)),
      projectileType: _.diffOptional(a.projectileType, b.projectileType, (x, y) => _.diffPrimitive(x, y)),
      visualEffectType: _.diffOptional(a.visualEffectType, b.visualEffectType, (x, y) => _.diffPrimitive(x, y)),
      swingType: _.diffOptional(a.swingType, b.swingType, (x, y) => _.diffPrimitive(x, y)),
      thrustType: _.diffOptional(a.thrustType, b.thrustType, (x, y) => _.diffPrimitive(x, y)),
      weaponType: _.diffOptional(a.weaponType, b.weaponType, (x, y) => _.diffPrimitive(x, y)),
      direction: _.diffOptional(a.direction, b.direction, (x, y) => _.diffPrimitive(x, y)),
      angle: _.diffOptional(a.angle, b.angle, (x, y) => _.diffPrimitive(x, y)),
      radius: _.diffOptional(a.radius, b.radius, (x, y) => _.diffPrimitive(x, y)),
      x: _.diffPrimitive(a.x, b.x),
      y: _.diffPrimitive(a.y, b.y),
      z: _.diffOptional(a.z, b.z, (x, y) => _.diffPrimitive(x, y)),
    };
    return diff.creatureId === _.NO_DIFF && diff.effectType === _.NO_DIFF && diff.triggerType === _.NO_DIFF && diff.ellipseEffectType === _.NO_DIFF && diff.weaponEffectType === _.NO_DIFF && diff.projectileType === _.NO_DIFF && diff.visualEffectType === _.NO_DIFF && diff.swingType === _.NO_DIFF && diff.thrustType === _.NO_DIFF && diff.weaponType === _.NO_DIFF && diff.direction === _.NO_DIFF && diff.angle === _.NO_DIFF && diff.radius === _.NO_DIFF && diff.x === _.NO_DIFF && diff.y === _.NO_DIFF && diff.z === _.NO_DIFF ? _.NO_DIFF : diff;
  },
  applyDiff(obj: EffectState, diff: _.DeepPartial<EffectState> | typeof _.NO_DIFF): EffectState {
    if (diff === _.NO_DIFF) {
      return obj;
    }
    obj.creatureId = diff.creatureId === _.NO_DIFF ? obj.creatureId : _.patchOptional(obj.creatureId, diff.creatureId, (a, b) => b);
    obj.effectType = diff.effectType === _.NO_DIFF ? obj.effectType : diff.effectType;
    obj.triggerType = diff.triggerType === _.NO_DIFF ? obj.triggerType : _.patchOptional(obj.triggerType, diff.triggerType, (a, b) => b);
    obj.ellipseEffectType = diff.ellipseEffectType === _.NO_DIFF ? obj.ellipseEffectType : _.patchOptional(obj.ellipseEffectType, diff.ellipseEffectType, (a, b) => b);
    obj.weaponEffectType = diff.weaponEffectType === _.NO_DIFF ? obj.weaponEffectType : _.patchOptional(obj.weaponEffectType, diff.weaponEffectType, (a, b) => b);
    obj.projectileType = diff.projectileType === _.NO_DIFF ? obj.projectileType : _.patchOptional(obj.projectileType, diff.projectileType, (a, b) => b);
    obj.visualEffectType = diff.visualEffectType === _.NO_DIFF ? obj.visualEffectType : _.patchOptional(obj.visualEffectType, diff.visualEffectType, (a, b) => b);
    obj.swingType = diff.swingType === _.NO_DIFF ? obj.swingType : _.patchOptional(obj.swingType, diff.swingType, (a, b) => b);
    obj.thrustType = diff.thrustType === _.NO_DIFF ? obj.thrustType : _.patchOptional(obj.thrustType, diff.thrustType, (a, b) => b);
    obj.weaponType = diff.weaponType === _.NO_DIFF ? obj.weaponType : _.patchOptional(obj.weaponType, diff.weaponType, (a, b) => b);
    obj.direction = diff.direction === _.NO_DIFF ? obj.direction : _.patchOptional(obj.direction, diff.direction, (a, b) => b);
    obj.angle = diff.angle === _.NO_DIFF ? obj.angle : _.patchOptional(obj.angle, diff.angle, (a, b) => b);
    obj.radius = diff.radius === _.NO_DIFF ? obj.radius : _.patchOptional(obj.radius, diff.radius, (a, b) => b);
    obj.x = diff.x === _.NO_DIFF ? obj.x : diff.x;
    obj.y = diff.y === _.NO_DIFF ? obj.y : diff.y;
    obj.z = diff.z === _.NO_DIFF ? obj.z : _.patchOptional(obj.z, diff.z, (a, b) => b);
    return obj;
  },
};

export const ObjectState = {
  default(): ObjectState {
    return {
      team: undefined,
      objectType: "",
      destructibleObjectType: undefined,
      environmentObjectType: undefined,
      interactiveObjectType: undefined,
      active: undefined,
      towerName: undefined,
      width: undefined,
      height: undefined,
      angle: undefined,
      durability: undefined,
      maxDurability: undefined,
      x: 0,
      y: 0,
    };
  },
  validate(obj: ObjectState) {
    if (typeof obj !== "object") {
      return [`Invalid ObjectState object: ${obj}`];
    }
    let validationErrors: string[] = [];

    validationErrors = _.validateOptional(obj.team, (x) => _.validatePrimitive(typeof x === "string", `Invalid string: ${x}`));
    if (validationErrors.length > 0) {
      return validationErrors.concat("Invalid key: ObjectState.team");
    }
    validationErrors = _.validatePrimitive(typeof obj.objectType === "string", `Invalid string: ${obj.objectType}`);
    if (validationErrors.length > 0) {
      return validationErrors.concat("Invalid key: ObjectState.objectType");
    }
    validationErrors = _.validateOptional(obj.destructibleObjectType, (x) => _.validatePrimitive(typeof x === "string", `Invalid string: ${x}`));
    if (validationErrors.length > 0) {
      return validationErrors.concat("Invalid key: ObjectState.destructibleObjectType");
    }
    validationErrors = _.validateOptional(obj.environmentObjectType, (x) => _.validatePrimitive(typeof x === "string", `Invalid string: ${x}`));
    if (validationErrors.length > 0) {
      return validationErrors.concat("Invalid key: ObjectState.environmentObjectType");
    }
    validationErrors = _.validateOptional(obj.interactiveObjectType, (x) => _.validatePrimitive(typeof x === "string", `Invalid string: ${x}`));
    if (validationErrors.length > 0) {
      return validationErrors.concat("Invalid key: ObjectState.interactiveObjectType");
    }
    validationErrors = _.validateOptional(obj.active, (x) => _.validatePrimitive(typeof x === "boolean", `Invalid boolean: ${x}`));
    if (validationErrors.length > 0) {
      return validationErrors.concat("Invalid key: ObjectState.active");
    }
    validationErrors = _.validateOptional(obj.towerName, (x) => _.validatePrimitive(typeof x === "string", `Invalid string: ${x}`));
    if (validationErrors.length > 0) {
      return validationErrors.concat("Invalid key: ObjectState.towerName");
    }
    validationErrors = _.validateOptional(obj.width, (x) => _.validatePrimitive(Number.isInteger(x) && x >= 0, `Invalid uint: ${x}`));
    if (validationErrors.length > 0) {
      return validationErrors.concat("Invalid key: ObjectState.width");
    }
    validationErrors = _.validateOptional(obj.height, (x) => _.validatePrimitive(Number.isInteger(x) && x >= 0, `Invalid uint: ${x}`));
    if (validationErrors.length > 0) {
      return validationErrors.concat("Invalid key: ObjectState.height");
    }
    validationErrors = _.validateOptional(obj.angle, (x) => _.validatePrimitive(Number.isInteger(x), `Invalid int: ${x}`));
    if (validationErrors.length > 0) {
      return validationErrors.concat("Invalid key: ObjectState.angle");
    }
    validationErrors = _.validateOptional(obj.durability, (x) => _.validatePrimitive(Number.isInteger(x) && x >= 0, `Invalid uint: ${x}`));
    if (validationErrors.length > 0) {
      return validationErrors.concat("Invalid key: ObjectState.durability");
    }
    validationErrors = _.validateOptional(obj.maxDurability, (x) => _.validatePrimitive(Number.isInteger(x) && x >= 0, `Invalid uint: ${x}`));
    if (validationErrors.length > 0) {
      return validationErrors.concat("Invalid key: ObjectState.maxDurability");
    }
    validationErrors = _.validatePrimitive(Number.isInteger(obj.x), `Invalid int: ${obj.x}`);
    if (validationErrors.length > 0) {
      return validationErrors.concat("Invalid key: ObjectState.x");
    }
    validationErrors = _.validatePrimitive(Number.isInteger(obj.y), `Invalid int: ${obj.y}`);
    if (validationErrors.length > 0) {
      return validationErrors.concat("Invalid key: ObjectState.y");
    }

    return validationErrors;
  },
  encode(obj: ObjectState, buf: _.Writer = new _.Writer()) {
    _.writeOptional(buf, obj.team, (x) => _.writeString(buf, x));
    _.writeString(buf, obj.objectType);
    _.writeOptional(buf, obj.destructibleObjectType, (x) => _.writeString(buf, x));
    _.writeOptional(buf, obj.environmentObjectType, (x) => _.writeString(buf, x));
    _.writeOptional(buf, obj.interactiveObjectType, (x) => _.writeString(buf, x));
    _.writeOptional(buf, obj.active, (x) => _.writeBoolean(buf, x));
    _.writeOptional(buf, obj.towerName, (x) => _.writeString(buf, x));
    _.writeOptional(buf, obj.width, (x) => _.writeUInt(buf, x));
    _.writeOptional(buf, obj.height, (x) => _.writeUInt(buf, x));
    _.writeOptional(buf, obj.angle, (x) => _.writeInt(buf, x));
    _.writeOptional(buf, obj.durability, (x) => _.writeUInt(buf, x));
    _.writeOptional(buf, obj.maxDurability, (x) => _.writeUInt(buf, x));
    _.writeInt(buf, obj.x);
    _.writeInt(buf, obj.y);
    return buf;
  },
  encodeDiff(obj: _.DeepPartial<ObjectState>, tracker: _.Tracker, buf: _.Writer = new _.Writer()) {
    tracker.push(obj.team !== _.NO_DIFF);
    if (obj.team !== _.NO_DIFF) {
      _.writeOptionalDiff(tracker, obj.team, (x) => _.writeString(buf, x));
    }
    tracker.push(obj.objectType !== _.NO_DIFF);
    if (obj.objectType !== _.NO_DIFF) {
      _.writeString(buf, obj.objectType);
    }
    tracker.push(obj.destructibleObjectType !== _.NO_DIFF);
    if (obj.destructibleObjectType !== _.NO_DIFF) {
      _.writeOptionalDiff(tracker, obj.destructibleObjectType, (x) => _.writeString(buf, x));
    }
    tracker.push(obj.environmentObjectType !== _.NO_DIFF);
    if (obj.environmentObjectType !== _.NO_DIFF) {
      _.writeOptionalDiff(tracker, obj.environmentObjectType, (x) => _.writeString(buf, x));
    }
    tracker.push(obj.interactiveObjectType !== _.NO_DIFF);
    if (obj.interactiveObjectType !== _.NO_DIFF) {
      _.writeOptionalDiff(tracker, obj.interactiveObjectType, (x) => _.writeString(buf, x));
    }
    tracker.push(obj.active !== _.NO_DIFF);
    if (obj.active !== _.NO_DIFF) {
      _.writeOptionalDiff(tracker, obj.active, (x) => _.writeBoolean(buf, x));
    }
    tracker.push(obj.towerName !== _.NO_DIFF);
    if (obj.towerName !== _.NO_DIFF) {
      _.writeOptionalDiff(tracker, obj.towerName, (x) => _.writeString(buf, x));
    }
    tracker.push(obj.width !== _.NO_DIFF);
    if (obj.width !== _.NO_DIFF) {
      _.writeOptionalDiff(tracker, obj.width, (x) => _.writeUInt(buf, x));
    }
    tracker.push(obj.height !== _.NO_DIFF);
    if (obj.height !== _.NO_DIFF) {
      _.writeOptionalDiff(tracker, obj.height, (x) => _.writeUInt(buf, x));
    }
    tracker.push(obj.angle !== _.NO_DIFF);
    if (obj.angle !== _.NO_DIFF) {
      _.writeOptionalDiff(tracker, obj.angle, (x) => _.writeInt(buf, x));
    }
    tracker.push(obj.durability !== _.NO_DIFF);
    if (obj.durability !== _.NO_DIFF) {
      _.writeOptionalDiff(tracker, obj.durability, (x) => _.writeUInt(buf, x));
    }
    tracker.push(obj.maxDurability !== _.NO_DIFF);
    if (obj.maxDurability !== _.NO_DIFF) {
      _.writeOptionalDiff(tracker, obj.maxDurability, (x) => _.writeUInt(buf, x));
    }
    tracker.push(obj.x !== _.NO_DIFF);
    if (obj.x !== _.NO_DIFF) {
      _.writeInt(buf, obj.x);
    }
    tracker.push(obj.y !== _.NO_DIFF);
    if (obj.y !== _.NO_DIFF) {
      _.writeInt(buf, obj.y);
    }
    return buf;
  },
  decode(buf: _.Reader): ObjectState {
    const sb = buf;
    return {
      team: _.parseOptional(sb, () => _.parseString(sb)),
      objectType: _.parseString(sb),
      destructibleObjectType: _.parseOptional(sb, () => _.parseString(sb)),
      environmentObjectType: _.parseOptional(sb, () => _.parseString(sb)),
      interactiveObjectType: _.parseOptional(sb, () => _.parseString(sb)),
      active: _.parseOptional(sb, () => _.parseBoolean(sb)),
      towerName: _.parseOptional(sb, () => _.parseString(sb)),
      width: _.parseOptional(sb, () => _.parseUInt(sb)),
      height: _.parseOptional(sb, () => _.parseUInt(sb)),
      angle: _.parseOptional(sb, () => _.parseInt(sb)),
      durability: _.parseOptional(sb, () => _.parseUInt(sb)),
      maxDurability: _.parseOptional(sb, () => _.parseUInt(sb)),
      x: _.parseInt(sb),
      y: _.parseInt(sb),
    };
  },
  decodeDiff(buf: _.Reader, tracker: _.Tracker): _.DeepPartial<ObjectState> {
    const sb = buf;
    return {
      team: tracker.next() ? _.parseOptionalDiff(tracker, () => _.parseString(sb)) : _.NO_DIFF,
      objectType: tracker.next() ? _.parseString(sb) : _.NO_DIFF,
      destructibleObjectType: tracker.next() ? _.parseOptionalDiff(tracker, () => _.parseString(sb)) : _.NO_DIFF,
      environmentObjectType: tracker.next() ? _.parseOptionalDiff(tracker, () => _.parseString(sb)) : _.NO_DIFF,
      interactiveObjectType: tracker.next() ? _.parseOptionalDiff(tracker, () => _.parseString(sb)) : _.NO_DIFF,
      active: tracker.next() ? _.parseOptionalDiff(tracker, () => _.parseBoolean(sb)) : _.NO_DIFF,
      towerName: tracker.next() ? _.parseOptionalDiff(tracker, () => _.parseString(sb)) : _.NO_DIFF,
      width: tracker.next() ? _.parseOptionalDiff(tracker, () => _.parseUInt(sb)) : _.NO_DIFF,
      height: tracker.next() ? _.parseOptionalDiff(tracker, () => _.parseUInt(sb)) : _.NO_DIFF,
      angle: tracker.next() ? _.parseOptionalDiff(tracker, () => _.parseInt(sb)) : _.NO_DIFF,
      durability: tracker.next() ? _.parseOptionalDiff(tracker, () => _.parseUInt(sb)) : _.NO_DIFF,
      maxDurability: tracker.next() ? _.parseOptionalDiff(tracker, () => _.parseUInt(sb)) : _.NO_DIFF,
      x: tracker.next() ? _.parseInt(sb) : _.NO_DIFF,
      y: tracker.next() ? _.parseInt(sb) : _.NO_DIFF,
    };
  },
  computeDiff(a: ObjectState, b: ObjectState): _.DeepPartial<ObjectState> | typeof _.NO_DIFF {
    const diff: _.DeepPartial<ObjectState> =  {
      team: _.diffOptional(a.team, b.team, (x, y) => _.diffPrimitive(x, y)),
      objectType: _.diffPrimitive(a.objectType, b.objectType),
      destructibleObjectType: _.diffOptional(a.destructibleObjectType, b.destructibleObjectType, (x, y) => _.diffPrimitive(x, y)),
      environmentObjectType: _.diffOptional(a.environmentObjectType, b.environmentObjectType, (x, y) => _.diffPrimitive(x, y)),
      interactiveObjectType: _.diffOptional(a.interactiveObjectType, b.interactiveObjectType, (x, y) => _.diffPrimitive(x, y)),
      active: _.diffOptional(a.active, b.active, (x, y) => _.diffPrimitive(x, y)),
      towerName: _.diffOptional(a.towerName, b.towerName, (x, y) => _.diffPrimitive(x, y)),
      width: _.diffOptional(a.width, b.width, (x, y) => _.diffPrimitive(x, y)),
      height: _.diffOptional(a.height, b.height, (x, y) => _.diffPrimitive(x, y)),
      angle: _.diffOptional(a.angle, b.angle, (x, y) => _.diffPrimitive(x, y)),
      durability: _.diffOptional(a.durability, b.durability, (x, y) => _.diffPrimitive(x, y)),
      maxDurability: _.diffOptional(a.maxDurability, b.maxDurability, (x, y) => _.diffPrimitive(x, y)),
      x: _.diffPrimitive(a.x, b.x),
      y: _.diffPrimitive(a.y, b.y),
    };
    return diff.team === _.NO_DIFF && diff.objectType === _.NO_DIFF && diff.destructibleObjectType === _.NO_DIFF && diff.environmentObjectType === _.NO_DIFF && diff.interactiveObjectType === _.NO_DIFF && diff.active === _.NO_DIFF && diff.towerName === _.NO_DIFF && diff.width === _.NO_DIFF && diff.height === _.NO_DIFF && diff.angle === _.NO_DIFF && diff.durability === _.NO_DIFF && diff.maxDurability === _.NO_DIFF && diff.x === _.NO_DIFF && diff.y === _.NO_DIFF ? _.NO_DIFF : diff;
  },
  applyDiff(obj: ObjectState, diff: _.DeepPartial<ObjectState> | typeof _.NO_DIFF): ObjectState {
    if (diff === _.NO_DIFF) {
      return obj;
    }
    obj.team = diff.team === _.NO_DIFF ? obj.team : _.patchOptional(obj.team, diff.team, (a, b) => b);
    obj.objectType = diff.objectType === _.NO_DIFF ? obj.objectType : diff.objectType;
    obj.destructibleObjectType = diff.destructibleObjectType === _.NO_DIFF ? obj.destructibleObjectType : _.patchOptional(obj.destructibleObjectType, diff.destructibleObjectType, (a, b) => b);
    obj.environmentObjectType = diff.environmentObjectType === _.NO_DIFF ? obj.environmentObjectType : _.patchOptional(obj.environmentObjectType, diff.environmentObjectType, (a, b) => b);
    obj.interactiveObjectType = diff.interactiveObjectType === _.NO_DIFF ? obj.interactiveObjectType : _.patchOptional(obj.interactiveObjectType, diff.interactiveObjectType, (a, b) => b);
    obj.active = diff.active === _.NO_DIFF ? obj.active : _.patchOptional(obj.active, diff.active, (a, b) => b);
    obj.towerName = diff.towerName === _.NO_DIFF ? obj.towerName : _.patchOptional(obj.towerName, diff.towerName, (a, b) => b);
    obj.width = diff.width === _.NO_DIFF ? obj.width : _.patchOptional(obj.width, diff.width, (a, b) => b);
    obj.height = diff.height === _.NO_DIFF ? obj.height : _.patchOptional(obj.height, diff.height, (a, b) => b);
    obj.angle = diff.angle === _.NO_DIFF ? obj.angle : _.patchOptional(obj.angle, diff.angle, (a, b) => b);
    obj.durability = diff.durability === _.NO_DIFF ? obj.durability : _.patchOptional(obj.durability, diff.durability, (a, b) => b);
    obj.maxDurability = diff.maxDurability === _.NO_DIFF ? obj.maxDurability : _.patchOptional(obj.maxDurability, diff.maxDurability, (a, b) => b);
    obj.x = diff.x === _.NO_DIFF ? obj.x : diff.x;
    obj.y = diff.y === _.NO_DIFF ? obj.y : diff.y;
    return obj;
  },
};

export const PlayerState = {
  default(): PlayerState {
    return {
      name: "",
      team: undefined,
      hero: undefined,
      cents: undefined,
      deck: undefined,
      randomSlots: [],
      hand: undefined,
      skills: undefined,
      restrictionZones: "",
    };
  },
  validate(obj: PlayerState) {
    if (typeof obj !== "object") {
      return [`Invalid PlayerState object: ${obj}`];
    }
    let validationErrors: string[] = [];

    validationErrors = _.validatePrimitive(typeof obj.name === "string", `Invalid string: ${obj.name}`);
    if (validationErrors.length > 0) {
      return validationErrors.concat("Invalid key: PlayerState.name");
    }
    validationErrors = _.validateOptional(obj.team, (x) => _.validatePrimitive(typeof x === "string", `Invalid string: ${x}`));
    if (validationErrors.length > 0) {
      return validationErrors.concat("Invalid key: PlayerState.team");
    }
    validationErrors = _.validateOptional(obj.hero, (x) => _.validatePrimitive(Number.isInteger(x) && x >= 0, `Invalid uint: ${x}`));
    if (validationErrors.length > 0) {
      return validationErrors.concat("Invalid key: PlayerState.hero");
    }
    validationErrors = _.validateOptional(obj.cents, (x) => _.validatePrimitive(Number.isInteger(x) && x >= 0, `Invalid uint: ${x}`));
    if (validationErrors.length > 0) {
      return validationErrors.concat("Invalid key: PlayerState.cents");
    }
    validationErrors = _.validateOptional(obj.deck, (x) => DeckState.validate(x));
    if (validationErrors.length > 0) {
      return validationErrors.concat("Invalid key: PlayerState.deck");
    }
    validationErrors = _.validateArray(obj.randomSlots, (x) => _.validatePrimitive(typeof x === "string", `Invalid string: ${x}`));
    if (validationErrors.length > 0) {
      return validationErrors.concat("Invalid key: PlayerState.randomSlots");
    }
    validationErrors = _.validateOptional(obj.hand, (x) => HandState.validate(x));
    if (validationErrors.length > 0) {
      return validationErrors.concat("Invalid key: PlayerState.hand");
    }
    validationErrors = _.validateOptional(obj.skills, (x) => SkillsState.validate(x));
    if (validationErrors.length > 0) {
      return validationErrors.concat("Invalid key: PlayerState.skills");
    }
    validationErrors = _.validatePrimitive(typeof obj.restrictionZones === "string", `Invalid string: ${obj.restrictionZones}`);
    if (validationErrors.length > 0) {
      return validationErrors.concat("Invalid key: PlayerState.restrictionZones");
    }

    return validationErrors;
  },
  encode(obj: PlayerState, buf: _.Writer = new _.Writer()) {
    _.writeString(buf, obj.name);
    _.writeOptional(buf, obj.team, (x) => _.writeString(buf, x));
    _.writeOptional(buf, obj.hero, (x) => _.writeUInt(buf, x));
    _.writeOptional(buf, obj.cents, (x) => _.writeUInt(buf, x));
    _.writeOptional(buf, obj.deck, (x) => DeckState.encode(x, buf));
    _.writeArray(buf, obj.randomSlots, (x) => _.writeString(buf, x));
    _.writeOptional(buf, obj.hand, (x) => HandState.encode(x, buf));
    _.writeOptional(buf, obj.skills, (x) => SkillsState.encode(x, buf));
    _.writeString(buf, obj.restrictionZones);
    return buf;
  },
  encodeDiff(obj: _.DeepPartial<PlayerState>, tracker: _.Tracker, buf: _.Writer = new _.Writer()) {
    tracker.push(obj.name !== _.NO_DIFF);
    if (obj.name !== _.NO_DIFF) {
      _.writeString(buf, obj.name);
    }
    tracker.push(obj.team !== _.NO_DIFF);
    if (obj.team !== _.NO_DIFF) {
      _.writeOptionalDiff(tracker, obj.team, (x) => _.writeString(buf, x));
    }
    tracker.push(obj.hero !== _.NO_DIFF);
    if (obj.hero !== _.NO_DIFF) {
      _.writeOptionalDiff(tracker, obj.hero, (x) => _.writeUInt(buf, x));
    }
    tracker.push(obj.cents !== _.NO_DIFF);
    if (obj.cents !== _.NO_DIFF) {
      _.writeOptionalDiff(tracker, obj.cents, (x) => _.writeUInt(buf, x));
    }
    tracker.push(obj.deck !== _.NO_DIFF);
    if (obj.deck !== _.NO_DIFF) {
      _.writeOptionalDiff(tracker, obj.deck, (x) => DeckState.encodeDiff(x, tracker, buf));
    }
    tracker.push(obj.randomSlots !== _.NO_DIFF);
    if (obj.randomSlots !== _.NO_DIFF) {
      _.writeArrayDiff(buf, tracker, obj.randomSlots, (x) => _.writeString(buf, x));
    }
    tracker.push(obj.hand !== _.NO_DIFF);
    if (obj.hand !== _.NO_DIFF) {
      _.writeOptionalDiff(tracker, obj.hand, (x) => HandState.encodeDiff(x, tracker, buf));
    }
    tracker.push(obj.skills !== _.NO_DIFF);
    if (obj.skills !== _.NO_DIFF) {
      _.writeOptionalDiff(tracker, obj.skills, (x) => SkillsState.encodeDiff(x, tracker, buf));
    }
    tracker.push(obj.restrictionZones !== _.NO_DIFF);
    if (obj.restrictionZones !== _.NO_DIFF) {
      _.writeString(buf, obj.restrictionZones);
    }
    return buf;
  },
  decode(buf: _.Reader): PlayerState {
    const sb = buf;
    return {
      name: _.parseString(sb),
      team: _.parseOptional(sb, () => _.parseString(sb)),
      hero: _.parseOptional(sb, () => _.parseUInt(sb)),
      cents: _.parseOptional(sb, () => _.parseUInt(sb)),
      deck: _.parseOptional(sb, () => DeckState.decode(sb)),
      randomSlots: _.parseArray(sb, () => _.parseString(sb)),
      hand: _.parseOptional(sb, () => HandState.decode(sb)),
      skills: _.parseOptional(sb, () => SkillsState.decode(sb)),
      restrictionZones: _.parseString(sb),
    };
  },
  decodeDiff(buf: _.Reader, tracker: _.Tracker): _.DeepPartial<PlayerState> {
    const sb = buf;
    return {
      name: tracker.next() ? _.parseString(sb) : _.NO_DIFF,
      team: tracker.next() ? _.parseOptionalDiff(tracker, () => _.parseString(sb)) : _.NO_DIFF,
      hero: tracker.next() ? _.parseOptionalDiff(tracker, () => _.parseUInt(sb)) : _.NO_DIFF,
      cents: tracker.next() ? _.parseOptionalDiff(tracker, () => _.parseUInt(sb)) : _.NO_DIFF,
      deck: tracker.next() ? _.parseOptionalDiff(tracker, () => DeckState.decodeDiff(sb, tracker)) : _.NO_DIFF,
      randomSlots: tracker.next() ? _.parseArrayDiff(sb, tracker, () => _.parseString(sb)) : _.NO_DIFF,
      hand: tracker.next() ? _.parseOptionalDiff(tracker, () => HandState.decodeDiff(sb, tracker)) : _.NO_DIFF,
      skills: tracker.next() ? _.parseOptionalDiff(tracker, () => SkillsState.decodeDiff(sb, tracker)) : _.NO_DIFF,
      restrictionZones: tracker.next() ? _.parseString(sb) : _.NO_DIFF,
    };
  },
  computeDiff(a: PlayerState, b: PlayerState): _.DeepPartial<PlayerState> | typeof _.NO_DIFF {
    const diff: _.DeepPartial<PlayerState> =  {
      name: _.diffPrimitive(a.name, b.name),
      team: _.diffOptional(a.team, b.team, (x, y) => _.diffPrimitive(x, y)),
      hero: _.diffOptional(a.hero, b.hero, (x, y) => _.diffPrimitive(x, y)),
      cents: _.diffOptional(a.cents, b.cents, (x, y) => _.diffPrimitive(x, y)),
      deck: _.diffOptional(a.deck, b.deck, (x, y) => DeckState.computeDiff(x, y)),
      randomSlots: _.diffArray(a.randomSlots, b.randomSlots, (x, y) => _.diffPrimitive(x, y)),
      hand: _.diffOptional(a.hand, b.hand, (x, y) => HandState.computeDiff(x, y)),
      skills: _.diffOptional(a.skills, b.skills, (x, y) => SkillsState.computeDiff(x, y)),
      restrictionZones: _.diffPrimitive(a.restrictionZones, b.restrictionZones),
    };
    return diff.name === _.NO_DIFF && diff.team === _.NO_DIFF && diff.hero === _.NO_DIFF && diff.cents === _.NO_DIFF && diff.deck === _.NO_DIFF && diff.randomSlots === _.NO_DIFF && diff.hand === _.NO_DIFF && diff.skills === _.NO_DIFF && diff.restrictionZones === _.NO_DIFF ? _.NO_DIFF : diff;
  },
  applyDiff(obj: PlayerState, diff: _.DeepPartial<PlayerState> | typeof _.NO_DIFF): PlayerState {
    if (diff === _.NO_DIFF) {
      return obj;
    }
    obj.name = diff.name === _.NO_DIFF ? obj.name : diff.name;
    obj.team = diff.team === _.NO_DIFF ? obj.team : _.patchOptional(obj.team, diff.team, (a, b) => b);
    obj.hero = diff.hero === _.NO_DIFF ? obj.hero : _.patchOptional(obj.hero, diff.hero, (a, b) => b);
    obj.cents = diff.cents === _.NO_DIFF ? obj.cents : _.patchOptional(obj.cents, diff.cents, (a, b) => b);
    obj.deck = diff.deck === _.NO_DIFF ? obj.deck : _.patchOptional(obj.deck, diff.deck, (a, b) => DeckState.applyDiff(a, b));
    obj.randomSlots = diff.randomSlots === _.NO_DIFF ? obj.randomSlots : _.patchArray(obj.randomSlots, diff.randomSlots, (a, b) => b);
    obj.hand = diff.hand === _.NO_DIFF ? obj.hand : _.patchOptional(obj.hand, diff.hand, (a, b) => HandState.applyDiff(a, b));
    obj.skills = diff.skills === _.NO_DIFF ? obj.skills : _.patchOptional(obj.skills, diff.skills, (a, b) => SkillsState.applyDiff(a, b));
    obj.restrictionZones = diff.restrictionZones === _.NO_DIFF ? obj.restrictionZones : diff.restrictionZones;
    return obj;
  },
};

export const SpectatorState = {
  default(): SpectatorState {
    return {
      name: "",
    };
  },
  validate(obj: SpectatorState) {
    if (typeof obj !== "object") {
      return [`Invalid SpectatorState object: ${obj}`];
    }
    let validationErrors: string[] = [];

    validationErrors = _.validatePrimitive(typeof obj.name === "string", `Invalid string: ${obj.name}`);
    if (validationErrors.length > 0) {
      return validationErrors.concat("Invalid key: SpectatorState.name");
    }

    return validationErrors;
  },
  encode(obj: SpectatorState, buf: _.Writer = new _.Writer()) {
    _.writeString(buf, obj.name);
    return buf;
  },
  encodeDiff(obj: _.DeepPartial<SpectatorState>, tracker: _.Tracker, buf: _.Writer = new _.Writer()) {
    tracker.push(obj.name !== _.NO_DIFF);
    if (obj.name !== _.NO_DIFF) {
      _.writeString(buf, obj.name);
    }
    return buf;
  },
  decode(buf: _.Reader): SpectatorState {
    const sb = buf;
    return {
      name: _.parseString(sb),
    };
  },
  decodeDiff(buf: _.Reader, tracker: _.Tracker): _.DeepPartial<SpectatorState> {
    const sb = buf;
    return {
      name: tracker.next() ? _.parseString(sb) : _.NO_DIFF,
    };
  },
  computeDiff(a: SpectatorState, b: SpectatorState): _.DeepPartial<SpectatorState> | typeof _.NO_DIFF {
    const diff: _.DeepPartial<SpectatorState> =  {
      name: _.diffPrimitive(a.name, b.name),
    };
    return diff.name === _.NO_DIFF ? _.NO_DIFF : diff;
  },
  applyDiff(obj: SpectatorState, diff: _.DeepPartial<SpectatorState> | typeof _.NO_DIFF): SpectatorState {
    if (diff === _.NO_DIFF) {
      return obj;
    }
    obj.name = diff.name === _.NO_DIFF ? obj.name : diff.name;
    return obj;
  },
};

export const DeckState = {
  default(): DeckState {
    return {
      card1: undefined,
      card2: undefined,
      card3: undefined,
      card4: undefined,
      card5: undefined,
      card6: undefined,
      card7: undefined,
      card8: undefined,
    };
  },
  validate(obj: DeckState) {
    if (typeof obj !== "object") {
      return [`Invalid DeckState object: ${obj}`];
    }
    let validationErrors: string[] = [];

    validationErrors = _.validateOptional(obj.card1, (x) => _.validatePrimitive(typeof x === "string", `Invalid string: ${x}`));
    if (validationErrors.length > 0) {
      return validationErrors.concat("Invalid key: DeckState.card1");
    }
    validationErrors = _.validateOptional(obj.card2, (x) => _.validatePrimitive(typeof x === "string", `Invalid string: ${x}`));
    if (validationErrors.length > 0) {
      return validationErrors.concat("Invalid key: DeckState.card2");
    }
    validationErrors = _.validateOptional(obj.card3, (x) => _.validatePrimitive(typeof x === "string", `Invalid string: ${x}`));
    if (validationErrors.length > 0) {
      return validationErrors.concat("Invalid key: DeckState.card3");
    }
    validationErrors = _.validateOptional(obj.card4, (x) => _.validatePrimitive(typeof x === "string", `Invalid string: ${x}`));
    if (validationErrors.length > 0) {
      return validationErrors.concat("Invalid key: DeckState.card4");
    }
    validationErrors = _.validateOptional(obj.card5, (x) => _.validatePrimitive(typeof x === "string", `Invalid string: ${x}`));
    if (validationErrors.length > 0) {
      return validationErrors.concat("Invalid key: DeckState.card5");
    }
    validationErrors = _.validateOptional(obj.card6, (x) => _.validatePrimitive(typeof x === "string", `Invalid string: ${x}`));
    if (validationErrors.length > 0) {
      return validationErrors.concat("Invalid key: DeckState.card6");
    }
    validationErrors = _.validateOptional(obj.card7, (x) => _.validatePrimitive(typeof x === "string", `Invalid string: ${x}`));
    if (validationErrors.length > 0) {
      return validationErrors.concat("Invalid key: DeckState.card7");
    }
    validationErrors = _.validateOptional(obj.card8, (x) => _.validatePrimitive(typeof x === "string", `Invalid string: ${x}`));
    if (validationErrors.length > 0) {
      return validationErrors.concat("Invalid key: DeckState.card8");
    }

    return validationErrors;
  },
  encode(obj: DeckState, buf: _.Writer = new _.Writer()) {
    _.writeOptional(buf, obj.card1, (x) => _.writeString(buf, x));
    _.writeOptional(buf, obj.card2, (x) => _.writeString(buf, x));
    _.writeOptional(buf, obj.card3, (x) => _.writeString(buf, x));
    _.writeOptional(buf, obj.card4, (x) => _.writeString(buf, x));
    _.writeOptional(buf, obj.card5, (x) => _.writeString(buf, x));
    _.writeOptional(buf, obj.card6, (x) => _.writeString(buf, x));
    _.writeOptional(buf, obj.card7, (x) => _.writeString(buf, x));
    _.writeOptional(buf, obj.card8, (x) => _.writeString(buf, x));
    return buf;
  },
  encodeDiff(obj: _.DeepPartial<DeckState>, tracker: _.Tracker, buf: _.Writer = new _.Writer()) {
    tracker.push(obj.card1 !== _.NO_DIFF);
    if (obj.card1 !== _.NO_DIFF) {
      _.writeOptionalDiff(tracker, obj.card1, (x) => _.writeString(buf, x));
    }
    tracker.push(obj.card2 !== _.NO_DIFF);
    if (obj.card2 !== _.NO_DIFF) {
      _.writeOptionalDiff(tracker, obj.card2, (x) => _.writeString(buf, x));
    }
    tracker.push(obj.card3 !== _.NO_DIFF);
    if (obj.card3 !== _.NO_DIFF) {
      _.writeOptionalDiff(tracker, obj.card3, (x) => _.writeString(buf, x));
    }
    tracker.push(obj.card4 !== _.NO_DIFF);
    if (obj.card4 !== _.NO_DIFF) {
      _.writeOptionalDiff(tracker, obj.card4, (x) => _.writeString(buf, x));
    }
    tracker.push(obj.card5 !== _.NO_DIFF);
    if (obj.card5 !== _.NO_DIFF) {
      _.writeOptionalDiff(tracker, obj.card5, (x) => _.writeString(buf, x));
    }
    tracker.push(obj.card6 !== _.NO_DIFF);
    if (obj.card6 !== _.NO_DIFF) {
      _.writeOptionalDiff(tracker, obj.card6, (x) => _.writeString(buf, x));
    }
    tracker.push(obj.card7 !== _.NO_DIFF);
    if (obj.card7 !== _.NO_DIFF) {
      _.writeOptionalDiff(tracker, obj.card7, (x) => _.writeString(buf, x));
    }
    tracker.push(obj.card8 !== _.NO_DIFF);
    if (obj.card8 !== _.NO_DIFF) {
      _.writeOptionalDiff(tracker, obj.card8, (x) => _.writeString(buf, x));
    }
    return buf;
  },
  decode(buf: _.Reader): DeckState {
    const sb = buf;
    return {
      card1: _.parseOptional(sb, () => _.parseString(sb)),
      card2: _.parseOptional(sb, () => _.parseString(sb)),
      card3: _.parseOptional(sb, () => _.parseString(sb)),
      card4: _.parseOptional(sb, () => _.parseString(sb)),
      card5: _.parseOptional(sb, () => _.parseString(sb)),
      card6: _.parseOptional(sb, () => _.parseString(sb)),
      card7: _.parseOptional(sb, () => _.parseString(sb)),
      card8: _.parseOptional(sb, () => _.parseString(sb)),
    };
  },
  decodeDiff(buf: _.Reader, tracker: _.Tracker): _.DeepPartial<DeckState> {
    const sb = buf;
    return {
      card1: tracker.next() ? _.parseOptionalDiff(tracker, () => _.parseString(sb)) : _.NO_DIFF,
      card2: tracker.next() ? _.parseOptionalDiff(tracker, () => _.parseString(sb)) : _.NO_DIFF,
      card3: tracker.next() ? _.parseOptionalDiff(tracker, () => _.parseString(sb)) : _.NO_DIFF,
      card4: tracker.next() ? _.parseOptionalDiff(tracker, () => _.parseString(sb)) : _.NO_DIFF,
      card5: tracker.next() ? _.parseOptionalDiff(tracker, () => _.parseString(sb)) : _.NO_DIFF,
      card6: tracker.next() ? _.parseOptionalDiff(tracker, () => _.parseString(sb)) : _.NO_DIFF,
      card7: tracker.next() ? _.parseOptionalDiff(tracker, () => _.parseString(sb)) : _.NO_DIFF,
      card8: tracker.next() ? _.parseOptionalDiff(tracker, () => _.parseString(sb)) : _.NO_DIFF,
    };
  },
  computeDiff(a: DeckState, b: DeckState): _.DeepPartial<DeckState> | typeof _.NO_DIFF {
    const diff: _.DeepPartial<DeckState> =  {
      card1: _.diffOptional(a.card1, b.card1, (x, y) => _.diffPrimitive(x, y)),
      card2: _.diffOptional(a.card2, b.card2, (x, y) => _.diffPrimitive(x, y)),
      card3: _.diffOptional(a.card3, b.card3, (x, y) => _.diffPrimitive(x, y)),
      card4: _.diffOptional(a.card4, b.card4, (x, y) => _.diffPrimitive(x, y)),
      card5: _.diffOptional(a.card5, b.card5, (x, y) => _.diffPrimitive(x, y)),
      card6: _.diffOptional(a.card6, b.card6, (x, y) => _.diffPrimitive(x, y)),
      card7: _.diffOptional(a.card7, b.card7, (x, y) => _.diffPrimitive(x, y)),
      card8: _.diffOptional(a.card8, b.card8, (x, y) => _.diffPrimitive(x, y)),
    };
    return diff.card1 === _.NO_DIFF && diff.card2 === _.NO_DIFF && diff.card3 === _.NO_DIFF && diff.card4 === _.NO_DIFF && diff.card5 === _.NO_DIFF && diff.card6 === _.NO_DIFF && diff.card7 === _.NO_DIFF && diff.card8 === _.NO_DIFF ? _.NO_DIFF : diff;
  },
  applyDiff(obj: DeckState, diff: _.DeepPartial<DeckState> | typeof _.NO_DIFF): DeckState {
    if (diff === _.NO_DIFF) {
      return obj;
    }
    obj.card1 = diff.card1 === _.NO_DIFF ? obj.card1 : _.patchOptional(obj.card1, diff.card1, (a, b) => b);
    obj.card2 = diff.card2 === _.NO_DIFF ? obj.card2 : _.patchOptional(obj.card2, diff.card2, (a, b) => b);
    obj.card3 = diff.card3 === _.NO_DIFF ? obj.card3 : _.patchOptional(obj.card3, diff.card3, (a, b) => b);
    obj.card4 = diff.card4 === _.NO_DIFF ? obj.card4 : _.patchOptional(obj.card4, diff.card4, (a, b) => b);
    obj.card5 = diff.card5 === _.NO_DIFF ? obj.card5 : _.patchOptional(obj.card5, diff.card5, (a, b) => b);
    obj.card6 = diff.card6 === _.NO_DIFF ? obj.card6 : _.patchOptional(obj.card6, diff.card6, (a, b) => b);
    obj.card7 = diff.card7 === _.NO_DIFF ? obj.card7 : _.patchOptional(obj.card7, diff.card7, (a, b) => b);
    obj.card8 = diff.card8 === _.NO_DIFF ? obj.card8 : _.patchOptional(obj.card8, diff.card8, (a, b) => b);
    return obj;
  },
};

export const HandState = {
  default(): HandState {
    return {
      slot1: undefined,
      slot2: undefined,
      slot3: undefined,
      slot4: undefined,
    };
  },
  validate(obj: HandState) {
    if (typeof obj !== "object") {
      return [`Invalid HandState object: ${obj}`];
    }
    let validationErrors: string[] = [];

    validationErrors = _.validateOptional(obj.slot1, (x) => _.validatePrimitive(typeof x === "string", `Invalid string: ${x}`));
    if (validationErrors.length > 0) {
      return validationErrors.concat("Invalid key: HandState.slot1");
    }
    validationErrors = _.validateOptional(obj.slot2, (x) => _.validatePrimitive(typeof x === "string", `Invalid string: ${x}`));
    if (validationErrors.length > 0) {
      return validationErrors.concat("Invalid key: HandState.slot2");
    }
    validationErrors = _.validateOptional(obj.slot3, (x) => _.validatePrimitive(typeof x === "string", `Invalid string: ${x}`));
    if (validationErrors.length > 0) {
      return validationErrors.concat("Invalid key: HandState.slot3");
    }
    validationErrors = _.validateOptional(obj.slot4, (x) => _.validatePrimitive(typeof x === "string", `Invalid string: ${x}`));
    if (validationErrors.length > 0) {
      return validationErrors.concat("Invalid key: HandState.slot4");
    }

    return validationErrors;
  },
  encode(obj: HandState, buf: _.Writer = new _.Writer()) {
    _.writeOptional(buf, obj.slot1, (x) => _.writeString(buf, x));
    _.writeOptional(buf, obj.slot2, (x) => _.writeString(buf, x));
    _.writeOptional(buf, obj.slot3, (x) => _.writeString(buf, x));
    _.writeOptional(buf, obj.slot4, (x) => _.writeString(buf, x));
    return buf;
  },
  encodeDiff(obj: _.DeepPartial<HandState>, tracker: _.Tracker, buf: _.Writer = new _.Writer()) {
    tracker.push(obj.slot1 !== _.NO_DIFF);
    if (obj.slot1 !== _.NO_DIFF) {
      _.writeOptionalDiff(tracker, obj.slot1, (x) => _.writeString(buf, x));
    }
    tracker.push(obj.slot2 !== _.NO_DIFF);
    if (obj.slot2 !== _.NO_DIFF) {
      _.writeOptionalDiff(tracker, obj.slot2, (x) => _.writeString(buf, x));
    }
    tracker.push(obj.slot3 !== _.NO_DIFF);
    if (obj.slot3 !== _.NO_DIFF) {
      _.writeOptionalDiff(tracker, obj.slot3, (x) => _.writeString(buf, x));
    }
    tracker.push(obj.slot4 !== _.NO_DIFF);
    if (obj.slot4 !== _.NO_DIFF) {
      _.writeOptionalDiff(tracker, obj.slot4, (x) => _.writeString(buf, x));
    }
    return buf;
  },
  decode(buf: _.Reader): HandState {
    const sb = buf;
    return {
      slot1: _.parseOptional(sb, () => _.parseString(sb)),
      slot2: _.parseOptional(sb, () => _.parseString(sb)),
      slot3: _.parseOptional(sb, () => _.parseString(sb)),
      slot4: _.parseOptional(sb, () => _.parseString(sb)),
    };
  },
  decodeDiff(buf: _.Reader, tracker: _.Tracker): _.DeepPartial<HandState> {
    const sb = buf;
    return {
      slot1: tracker.next() ? _.parseOptionalDiff(tracker, () => _.parseString(sb)) : _.NO_DIFF,
      slot2: tracker.next() ? _.parseOptionalDiff(tracker, () => _.parseString(sb)) : _.NO_DIFF,
      slot3: tracker.next() ? _.parseOptionalDiff(tracker, () => _.parseString(sb)) : _.NO_DIFF,
      slot4: tracker.next() ? _.parseOptionalDiff(tracker, () => _.parseString(sb)) : _.NO_DIFF,
    };
  },
  computeDiff(a: HandState, b: HandState): _.DeepPartial<HandState> | typeof _.NO_DIFF {
    const diff: _.DeepPartial<HandState> =  {
      slot1: _.diffOptional(a.slot1, b.slot1, (x, y) => _.diffPrimitive(x, y)),
      slot2: _.diffOptional(a.slot2, b.slot2, (x, y) => _.diffPrimitive(x, y)),
      slot3: _.diffOptional(a.slot3, b.slot3, (x, y) => _.diffPrimitive(x, y)),
      slot4: _.diffOptional(a.slot4, b.slot4, (x, y) => _.diffPrimitive(x, y)),
    };
    return diff.slot1 === _.NO_DIFF && diff.slot2 === _.NO_DIFF && diff.slot3 === _.NO_DIFF && diff.slot4 === _.NO_DIFF ? _.NO_DIFF : diff;
  },
  applyDiff(obj: HandState, diff: _.DeepPartial<HandState> | typeof _.NO_DIFF): HandState {
    if (diff === _.NO_DIFF) {
      return obj;
    }
    obj.slot1 = diff.slot1 === _.NO_DIFF ? obj.slot1 : _.patchOptional(obj.slot1, diff.slot1, (a, b) => b);
    obj.slot2 = diff.slot2 === _.NO_DIFF ? obj.slot2 : _.patchOptional(obj.slot2, diff.slot2, (a, b) => b);
    obj.slot3 = diff.slot3 === _.NO_DIFF ? obj.slot3 : _.patchOptional(obj.slot3, diff.slot3, (a, b) => b);
    obj.slot4 = diff.slot4 === _.NO_DIFF ? obj.slot4 : _.patchOptional(obj.slot4, diff.slot4, (a, b) => b);
    return obj;
  },
};

export const SkillsState = {
  default(): SkillsState {
    return {
      slot1: undefined,
      slot2: undefined,
      slot3: undefined,
      slot4: undefined,
    };
  },
  validate(obj: SkillsState) {
    if (typeof obj !== "object") {
      return [`Invalid SkillsState object: ${obj}`];
    }
    let validationErrors: string[] = [];

    validationErrors = _.validateOptional(obj.slot1, (x) => SkillState.validate(x));
    if (validationErrors.length > 0) {
      return validationErrors.concat("Invalid key: SkillsState.slot1");
    }
    validationErrors = _.validateOptional(obj.slot2, (x) => SkillState.validate(x));
    if (validationErrors.length > 0) {
      return validationErrors.concat("Invalid key: SkillsState.slot2");
    }
    validationErrors = _.validateOptional(obj.slot3, (x) => SkillState.validate(x));
    if (validationErrors.length > 0) {
      return validationErrors.concat("Invalid key: SkillsState.slot3");
    }
    validationErrors = _.validateOptional(obj.slot4, (x) => SkillState.validate(x));
    if (validationErrors.length > 0) {
      return validationErrors.concat("Invalid key: SkillsState.slot4");
    }

    return validationErrors;
  },
  encode(obj: SkillsState, buf: _.Writer = new _.Writer()) {
    _.writeOptional(buf, obj.slot1, (x) => SkillState.encode(x, buf));
    _.writeOptional(buf, obj.slot2, (x) => SkillState.encode(x, buf));
    _.writeOptional(buf, obj.slot3, (x) => SkillState.encode(x, buf));
    _.writeOptional(buf, obj.slot4, (x) => SkillState.encode(x, buf));
    return buf;
  },
  encodeDiff(obj: _.DeepPartial<SkillsState>, tracker: _.Tracker, buf: _.Writer = new _.Writer()) {
    tracker.push(obj.slot1 !== _.NO_DIFF);
    if (obj.slot1 !== _.NO_DIFF) {
      _.writeOptionalDiff(tracker, obj.slot1, (x) => SkillState.encodeDiff(x, tracker, buf));
    }
    tracker.push(obj.slot2 !== _.NO_DIFF);
    if (obj.slot2 !== _.NO_DIFF) {
      _.writeOptionalDiff(tracker, obj.slot2, (x) => SkillState.encodeDiff(x, tracker, buf));
    }
    tracker.push(obj.slot3 !== _.NO_DIFF);
    if (obj.slot3 !== _.NO_DIFF) {
      _.writeOptionalDiff(tracker, obj.slot3, (x) => SkillState.encodeDiff(x, tracker, buf));
    }
    tracker.push(obj.slot4 !== _.NO_DIFF);
    if (obj.slot4 !== _.NO_DIFF) {
      _.writeOptionalDiff(tracker, obj.slot4, (x) => SkillState.encodeDiff(x, tracker, buf));
    }
    return buf;
  },
  decode(buf: _.Reader): SkillsState {
    const sb = buf;
    return {
      slot1: _.parseOptional(sb, () => SkillState.decode(sb)),
      slot2: _.parseOptional(sb, () => SkillState.decode(sb)),
      slot3: _.parseOptional(sb, () => SkillState.decode(sb)),
      slot4: _.parseOptional(sb, () => SkillState.decode(sb)),
    };
  },
  decodeDiff(buf: _.Reader, tracker: _.Tracker): _.DeepPartial<SkillsState> {
    const sb = buf;
    return {
      slot1: tracker.next() ? _.parseOptionalDiff(tracker, () => SkillState.decodeDiff(sb, tracker)) : _.NO_DIFF,
      slot2: tracker.next() ? _.parseOptionalDiff(tracker, () => SkillState.decodeDiff(sb, tracker)) : _.NO_DIFF,
      slot3: tracker.next() ? _.parseOptionalDiff(tracker, () => SkillState.decodeDiff(sb, tracker)) : _.NO_DIFF,
      slot4: tracker.next() ? _.parseOptionalDiff(tracker, () => SkillState.decodeDiff(sb, tracker)) : _.NO_DIFF,
    };
  },
  computeDiff(a: SkillsState, b: SkillsState): _.DeepPartial<SkillsState> | typeof _.NO_DIFF {
    const diff: _.DeepPartial<SkillsState> =  {
      slot1: _.diffOptional(a.slot1, b.slot1, (x, y) => SkillState.computeDiff(x, y)),
      slot2: _.diffOptional(a.slot2, b.slot2, (x, y) => SkillState.computeDiff(x, y)),
      slot3: _.diffOptional(a.slot3, b.slot3, (x, y) => SkillState.computeDiff(x, y)),
      slot4: _.diffOptional(a.slot4, b.slot4, (x, y) => SkillState.computeDiff(x, y)),
    };
    return diff.slot1 === _.NO_DIFF && diff.slot2 === _.NO_DIFF && diff.slot3 === _.NO_DIFF && diff.slot4 === _.NO_DIFF ? _.NO_DIFF : diff;
  },
  applyDiff(obj: SkillsState, diff: _.DeepPartial<SkillsState> | typeof _.NO_DIFF): SkillsState {
    if (diff === _.NO_DIFF) {
      return obj;
    }
    obj.slot1 = diff.slot1 === _.NO_DIFF ? obj.slot1 : _.patchOptional(obj.slot1, diff.slot1, (a, b) => SkillState.applyDiff(a, b));
    obj.slot2 = diff.slot2 === _.NO_DIFF ? obj.slot2 : _.patchOptional(obj.slot2, diff.slot2, (a, b) => SkillState.applyDiff(a, b));
    obj.slot3 = diff.slot3 === _.NO_DIFF ? obj.slot3 : _.patchOptional(obj.slot3, diff.slot3, (a, b) => SkillState.applyDiff(a, b));
    obj.slot4 = diff.slot4 === _.NO_DIFF ? obj.slot4 : _.patchOptional(obj.slot4, diff.slot4, (a, b) => SkillState.applyDiff(a, b));
    return obj;
  },
};

export const SkillState = {
  default(): SkillState {
    return {
      type: "",
      inUse: false,
      cooldown: 0,
      cooldownTotal: 0,
    };
  },
  validate(obj: SkillState) {
    if (typeof obj !== "object") {
      return [`Invalid SkillState object: ${obj}`];
    }
    let validationErrors: string[] = [];

    validationErrors = _.validatePrimitive(typeof obj.type === "string", `Invalid string: ${obj.type}`);
    if (validationErrors.length > 0) {
      return validationErrors.concat("Invalid key: SkillState.type");
    }
    validationErrors = _.validatePrimitive(typeof obj.inUse === "boolean", `Invalid boolean: ${obj.inUse}`);
    if (validationErrors.length > 0) {
      return validationErrors.concat("Invalid key: SkillState.inUse");
    }
    validationErrors = _.validatePrimitive(Number.isInteger(obj.cooldown) && obj.cooldown >= 0, `Invalid uint: ${obj.cooldown}`);
    if (validationErrors.length > 0) {
      return validationErrors.concat("Invalid key: SkillState.cooldown");
    }
    validationErrors = _.validatePrimitive(Number.isInteger(obj.cooldownTotal) && obj.cooldownTotal >= 0, `Invalid uint: ${obj.cooldownTotal}`);
    if (validationErrors.length > 0) {
      return validationErrors.concat("Invalid key: SkillState.cooldownTotal");
    }

    return validationErrors;
  },
  encode(obj: SkillState, buf: _.Writer = new _.Writer()) {
    _.writeString(buf, obj.type);
    _.writeBoolean(buf, obj.inUse);
    _.writeUInt(buf, obj.cooldown);
    _.writeUInt(buf, obj.cooldownTotal);
    return buf;
  },
  encodeDiff(obj: _.DeepPartial<SkillState>, tracker: _.Tracker, buf: _.Writer = new _.Writer()) {
    tracker.push(obj.type !== _.NO_DIFF);
    if (obj.type !== _.NO_DIFF) {
      _.writeString(buf, obj.type);
    }
    tracker.push(obj.inUse !== _.NO_DIFF);
    if (obj.inUse !== _.NO_DIFF) {
      _.writeBoolean(buf, obj.inUse);
    }
    tracker.push(obj.cooldown !== _.NO_DIFF);
    if (obj.cooldown !== _.NO_DIFF) {
      _.writeUInt(buf, obj.cooldown);
    }
    tracker.push(obj.cooldownTotal !== _.NO_DIFF);
    if (obj.cooldownTotal !== _.NO_DIFF) {
      _.writeUInt(buf, obj.cooldownTotal);
    }
    return buf;
  },
  decode(buf: _.Reader): SkillState {
    const sb = buf;
    return {
      type: _.parseString(sb),
      inUse: _.parseBoolean(sb),
      cooldown: _.parseUInt(sb),
      cooldownTotal: _.parseUInt(sb),
    };
  },
  decodeDiff(buf: _.Reader, tracker: _.Tracker): _.DeepPartial<SkillState> {
    const sb = buf;
    return {
      type: tracker.next() ? _.parseString(sb) : _.NO_DIFF,
      inUse: tracker.next() ? _.parseBoolean(sb) : _.NO_DIFF,
      cooldown: tracker.next() ? _.parseUInt(sb) : _.NO_DIFF,
      cooldownTotal: tracker.next() ? _.parseUInt(sb) : _.NO_DIFF,
    };
  },
  computeDiff(a: SkillState, b: SkillState): _.DeepPartial<SkillState> | typeof _.NO_DIFF {
    const diff: _.DeepPartial<SkillState> =  {
      type: _.diffPrimitive(a.type, b.type),
      inUse: _.diffPrimitive(a.inUse, b.inUse),
      cooldown: _.diffPrimitive(a.cooldown, b.cooldown),
      cooldownTotal: _.diffPrimitive(a.cooldownTotal, b.cooldownTotal),
    };
    return diff.type === _.NO_DIFF && diff.inUse === _.NO_DIFF && diff.cooldown === _.NO_DIFF && diff.cooldownTotal === _.NO_DIFF ? _.NO_DIFF : diff;
  },
  applyDiff(obj: SkillState, diff: _.DeepPartial<SkillState> | typeof _.NO_DIFF): SkillState {
    if (diff === _.NO_DIFF) {
      return obj;
    }
    obj.type = diff.type === _.NO_DIFF ? obj.type : diff.type;
    obj.inUse = diff.inUse === _.NO_DIFF ? obj.inUse : diff.inUse;
    obj.cooldown = diff.cooldown === _.NO_DIFF ? obj.cooldown : diff.cooldown;
    obj.cooldownTotal = diff.cooldownTotal === _.NO_DIFF ? obj.cooldownTotal : diff.cooldownTotal;
    return obj;
  },
};

export const GameInfo = {
  default(): GameInfo {
    return {
      mode: undefined,
      timeLimit: undefined,
      timeElapsed: undefined,
      suddenDeath: undefined,
      winner: undefined,
    };
  },
  validate(obj: GameInfo) {
    if (typeof obj !== "object") {
      return [`Invalid GameInfo object: ${obj}`];
    }
    let validationErrors: string[] = [];

    validationErrors = _.validateOptional(obj.mode, (x) => _.validatePrimitive(typeof x === "string", `Invalid string: ${x}`));
    if (validationErrors.length > 0) {
      return validationErrors.concat("Invalid key: GameInfo.mode");
    }
    validationErrors = _.validateOptional(obj.timeLimit, (x) => _.validatePrimitive(Number.isInteger(x) && x >= 0, `Invalid uint: ${x}`));
    if (validationErrors.length > 0) {
      return validationErrors.concat("Invalid key: GameInfo.timeLimit");
    }
    validationErrors = _.validateOptional(obj.timeElapsed, (x) => _.validatePrimitive(Number.isInteger(x), `Invalid int: ${x}`));
    if (validationErrors.length > 0) {
      return validationErrors.concat("Invalid key: GameInfo.timeElapsed");
    }
    validationErrors = _.validateOptional(obj.suddenDeath, (x) => _.validatePrimitive(typeof x === "boolean", `Invalid boolean: ${x}`));
    if (validationErrors.length > 0) {
      return validationErrors.concat("Invalid key: GameInfo.suddenDeath");
    }
    validationErrors = _.validateOptional(obj.winner, (x) => _.validatePrimitive(typeof x === "string", `Invalid string: ${x}`));
    if (validationErrors.length > 0) {
      return validationErrors.concat("Invalid key: GameInfo.winner");
    }

    return validationErrors;
  },
  encode(obj: GameInfo, buf: _.Writer = new _.Writer()) {
    _.writeOptional(buf, obj.mode, (x) => _.writeString(buf, x));
    _.writeOptional(buf, obj.timeLimit, (x) => _.writeUInt(buf, x));
    _.writeOptional(buf, obj.timeElapsed, (x) => _.writeInt(buf, x));
    _.writeOptional(buf, obj.suddenDeath, (x) => _.writeBoolean(buf, x));
    _.writeOptional(buf, obj.winner, (x) => _.writeString(buf, x));
    return buf;
  },
  encodeDiff(obj: _.DeepPartial<GameInfo>, tracker: _.Tracker, buf: _.Writer = new _.Writer()) {
    tracker.push(obj.mode !== _.NO_DIFF);
    if (obj.mode !== _.NO_DIFF) {
      _.writeOptionalDiff(tracker, obj.mode, (x) => _.writeString(buf, x));
    }
    tracker.push(obj.timeLimit !== _.NO_DIFF);
    if (obj.timeLimit !== _.NO_DIFF) {
      _.writeOptionalDiff(tracker, obj.timeLimit, (x) => _.writeUInt(buf, x));
    }
    tracker.push(obj.timeElapsed !== _.NO_DIFF);
    if (obj.timeElapsed !== _.NO_DIFF) {
      _.writeOptionalDiff(tracker, obj.timeElapsed, (x) => _.writeInt(buf, x));
    }
    tracker.push(obj.suddenDeath !== _.NO_DIFF);
    if (obj.suddenDeath !== _.NO_DIFF) {
      _.writeOptionalDiff(tracker, obj.suddenDeath, (x) => _.writeBoolean(buf, x));
    }
    tracker.push(obj.winner !== _.NO_DIFF);
    if (obj.winner !== _.NO_DIFF) {
      _.writeOptionalDiff(tracker, obj.winner, (x) => _.writeString(buf, x));
    }
    return buf;
  },
  decode(buf: _.Reader): GameInfo {
    const sb = buf;
    return {
      mode: _.parseOptional(sb, () => _.parseString(sb)),
      timeLimit: _.parseOptional(sb, () => _.parseUInt(sb)),
      timeElapsed: _.parseOptional(sb, () => _.parseInt(sb)),
      suddenDeath: _.parseOptional(sb, () => _.parseBoolean(sb)),
      winner: _.parseOptional(sb, () => _.parseString(sb)),
    };
  },
  decodeDiff(buf: _.Reader, tracker: _.Tracker): _.DeepPartial<GameInfo> {
    const sb = buf;
    return {
      mode: tracker.next() ? _.parseOptionalDiff(tracker, () => _.parseString(sb)) : _.NO_DIFF,
      timeLimit: tracker.next() ? _.parseOptionalDiff(tracker, () => _.parseUInt(sb)) : _.NO_DIFF,
      timeElapsed: tracker.next() ? _.parseOptionalDiff(tracker, () => _.parseInt(sb)) : _.NO_DIFF,
      suddenDeath: tracker.next() ? _.parseOptionalDiff(tracker, () => _.parseBoolean(sb)) : _.NO_DIFF,
      winner: tracker.next() ? _.parseOptionalDiff(tracker, () => _.parseString(sb)) : _.NO_DIFF,
    };
  },
  computeDiff(a: GameInfo, b: GameInfo): _.DeepPartial<GameInfo> | typeof _.NO_DIFF {
    const diff: _.DeepPartial<GameInfo> =  {
      mode: _.diffOptional(a.mode, b.mode, (x, y) => _.diffPrimitive(x, y)),
      timeLimit: _.diffOptional(a.timeLimit, b.timeLimit, (x, y) => _.diffPrimitive(x, y)),
      timeElapsed: _.diffOptional(a.timeElapsed, b.timeElapsed, (x, y) => _.diffPrimitive(x, y)),
      suddenDeath: _.diffOptional(a.suddenDeath, b.suddenDeath, (x, y) => _.diffPrimitive(x, y)),
      winner: _.diffOptional(a.winner, b.winner, (x, y) => _.diffPrimitive(x, y)),
    };
    return diff.mode === _.NO_DIFF && diff.timeLimit === _.NO_DIFF && diff.timeElapsed === _.NO_DIFF && diff.suddenDeath === _.NO_DIFF && diff.winner === _.NO_DIFF ? _.NO_DIFF : diff;
  },
  applyDiff(obj: GameInfo, diff: _.DeepPartial<GameInfo> | typeof _.NO_DIFF): GameInfo {
    if (diff === _.NO_DIFF) {
      return obj;
    }
    obj.mode = diff.mode === _.NO_DIFF ? obj.mode : _.patchOptional(obj.mode, diff.mode, (a, b) => b);
    obj.timeLimit = diff.timeLimit === _.NO_DIFF ? obj.timeLimit : _.patchOptional(obj.timeLimit, diff.timeLimit, (a, b) => b);
    obj.timeElapsed = diff.timeElapsed === _.NO_DIFF ? obj.timeElapsed : _.patchOptional(obj.timeElapsed, diff.timeElapsed, (a, b) => b);
    obj.suddenDeath = diff.suddenDeath === _.NO_DIFF ? obj.suddenDeath : _.patchOptional(obj.suddenDeath, diff.suddenDeath, (a, b) => b);
    obj.winner = diff.winner === _.NO_DIFF ? obj.winner : _.patchOptional(obj.winner, diff.winner, (a, b) => b);
    return obj;
  },
};

export const DraftState = {
  default(): DraftState {
    return {
      timeRemaining: 0,
      decks: [],
      pairs: [],
    };
  },
  validate(obj: DraftState) {
    if (typeof obj !== "object") {
      return [`Invalid DraftState object: ${obj}`];
    }
    let validationErrors: string[] = [];

    validationErrors = _.validatePrimitive(Number.isInteger(obj.timeRemaining) && obj.timeRemaining >= 0, `Invalid uint: ${obj.timeRemaining}`);
    if (validationErrors.length > 0) {
      return validationErrors.concat("Invalid key: DraftState.timeRemaining");
    }
    validationErrors = _.validateArray(obj.decks, (x) => DraftDeckState.validate(x));
    if (validationErrors.length > 0) {
      return validationErrors.concat("Invalid key: DraftState.decks");
    }
    validationErrors = _.validateArray(obj.pairs, (x) => CardPairState.validate(x));
    if (validationErrors.length > 0) {
      return validationErrors.concat("Invalid key: DraftState.pairs");
    }

    return validationErrors;
  },
  encode(obj: DraftState, buf: _.Writer = new _.Writer()) {
    _.writeUInt(buf, obj.timeRemaining);
    _.writeArray(buf, obj.decks, (x) => DraftDeckState.encode(x, buf));
    _.writeArray(buf, obj.pairs, (x) => CardPairState.encode(x, buf));
    return buf;
  },
  encodeDiff(obj: _.DeepPartial<DraftState>, tracker: _.Tracker, buf: _.Writer = new _.Writer()) {
    tracker.push(obj.timeRemaining !== _.NO_DIFF);
    if (obj.timeRemaining !== _.NO_DIFF) {
      _.writeUInt(buf, obj.timeRemaining);
    }
    tracker.push(obj.decks !== _.NO_DIFF);
    if (obj.decks !== _.NO_DIFF) {
      _.writeArrayDiff(buf, tracker, obj.decks, (x) => DraftDeckState.encodeDiff(x, tracker, buf));
    }
    tracker.push(obj.pairs !== _.NO_DIFF);
    if (obj.pairs !== _.NO_DIFF) {
      _.writeArrayDiff(buf, tracker, obj.pairs, (x) => CardPairState.encodeDiff(x, tracker, buf));
    }
    return buf;
  },
  decode(buf: _.Reader): DraftState {
    const sb = buf;
    return {
      timeRemaining: _.parseUInt(sb),
      decks: _.parseArray(sb, () => DraftDeckState.decode(sb)),
      pairs: _.parseArray(sb, () => CardPairState.decode(sb)),
    };
  },
  decodeDiff(buf: _.Reader, tracker: _.Tracker): _.DeepPartial<DraftState> {
    const sb = buf;
    return {
      timeRemaining: tracker.next() ? _.parseUInt(sb) : _.NO_DIFF,
      decks: tracker.next() ? _.parseArrayDiff(sb, tracker, () => DraftDeckState.decodeDiff(sb, tracker)) : _.NO_DIFF,
      pairs: tracker.next() ? _.parseArrayDiff(sb, tracker, () => CardPairState.decodeDiff(sb, tracker)) : _.NO_DIFF,
    };
  },
  computeDiff(a: DraftState, b: DraftState): _.DeepPartial<DraftState> | typeof _.NO_DIFF {
    const diff: _.DeepPartial<DraftState> =  {
      timeRemaining: _.diffPrimitive(a.timeRemaining, b.timeRemaining),
      decks: _.diffArray(a.decks, b.decks, (x, y) => DraftDeckState.computeDiff(x, y)),
      pairs: _.diffArray(a.pairs, b.pairs, (x, y) => CardPairState.computeDiff(x, y)),
    };
    return diff.timeRemaining === _.NO_DIFF && diff.decks === _.NO_DIFF && diff.pairs === _.NO_DIFF ? _.NO_DIFF : diff;
  },
  applyDiff(obj: DraftState, diff: _.DeepPartial<DraftState> | typeof _.NO_DIFF): DraftState {
    if (diff === _.NO_DIFF) {
      return obj;
    }
    obj.timeRemaining = diff.timeRemaining === _.NO_DIFF ? obj.timeRemaining : diff.timeRemaining;
    obj.decks = diff.decks === _.NO_DIFF ? obj.decks : _.patchArray(obj.decks, diff.decks, (a, b) => DraftDeckState.applyDiff(a, b));
    obj.pairs = diff.pairs === _.NO_DIFF ? obj.pairs : _.patchArray(obj.pairs, diff.pairs, (a, b) => CardPairState.applyDiff(a, b));
    return obj;
  },
};

export const DraftDeckState = {
  default(): DraftDeckState {
    return {
      playerId: "",
      card1: undefined,
      card2: undefined,
      card3: undefined,
      card4: undefined,
      card5: undefined,
      card6: undefined,
      card7: undefined,
      card8: undefined,
    };
  },
  validate(obj: DraftDeckState) {
    if (typeof obj !== "object") {
      return [`Invalid DraftDeckState object: ${obj}`];
    }
    let validationErrors: string[] = [];

    validationErrors = _.validatePrimitive(typeof obj.playerId === "string", `Invalid string: ${obj.playerId}`);
    if (validationErrors.length > 0) {
      return validationErrors.concat("Invalid key: DraftDeckState.playerId");
    }
    validationErrors = _.validateOptional(obj.card1, (x) => _.validatePrimitive(typeof x === "string", `Invalid string: ${x}`));
    if (validationErrors.length > 0) {
      return validationErrors.concat("Invalid key: DraftDeckState.card1");
    }
    validationErrors = _.validateOptional(obj.card2, (x) => _.validatePrimitive(typeof x === "string", `Invalid string: ${x}`));
    if (validationErrors.length > 0) {
      return validationErrors.concat("Invalid key: DraftDeckState.card2");
    }
    validationErrors = _.validateOptional(obj.card3, (x) => _.validatePrimitive(typeof x === "string", `Invalid string: ${x}`));
    if (validationErrors.length > 0) {
      return validationErrors.concat("Invalid key: DraftDeckState.card3");
    }
    validationErrors = _.validateOptional(obj.card4, (x) => _.validatePrimitive(typeof x === "string", `Invalid string: ${x}`));
    if (validationErrors.length > 0) {
      return validationErrors.concat("Invalid key: DraftDeckState.card4");
    }
    validationErrors = _.validateOptional(obj.card5, (x) => _.validatePrimitive(typeof x === "string", `Invalid string: ${x}`));
    if (validationErrors.length > 0) {
      return validationErrors.concat("Invalid key: DraftDeckState.card5");
    }
    validationErrors = _.validateOptional(obj.card6, (x) => _.validatePrimitive(typeof x === "string", `Invalid string: ${x}`));
    if (validationErrors.length > 0) {
      return validationErrors.concat("Invalid key: DraftDeckState.card6");
    }
    validationErrors = _.validateOptional(obj.card7, (x) => _.validatePrimitive(typeof x === "string", `Invalid string: ${x}`));
    if (validationErrors.length > 0) {
      return validationErrors.concat("Invalid key: DraftDeckState.card7");
    }
    validationErrors = _.validateOptional(obj.card8, (x) => _.validatePrimitive(typeof x === "string", `Invalid string: ${x}`));
    if (validationErrors.length > 0) {
      return validationErrors.concat("Invalid key: DraftDeckState.card8");
    }

    return validationErrors;
  },
  encode(obj: DraftDeckState, buf: _.Writer = new _.Writer()) {
    _.writeString(buf, obj.playerId);
    _.writeOptional(buf, obj.card1, (x) => _.writeString(buf, x));
    _.writeOptional(buf, obj.card2, (x) => _.writeString(buf, x));
    _.writeOptional(buf, obj.card3, (x) => _.writeString(buf, x));
    _.writeOptional(buf, obj.card4, (x) => _.writeString(buf, x));
    _.writeOptional(buf, obj.card5, (x) => _.writeString(buf, x));
    _.writeOptional(buf, obj.card6, (x) => _.writeString(buf, x));
    _.writeOptional(buf, obj.card7, (x) => _.writeString(buf, x));
    _.writeOptional(buf, obj.card8, (x) => _.writeString(buf, x));
    return buf;
  },
  encodeDiff(obj: _.DeepPartial<DraftDeckState>, tracker: _.Tracker, buf: _.Writer = new _.Writer()) {
    tracker.push(obj.playerId !== _.NO_DIFF);
    if (obj.playerId !== _.NO_DIFF) {
      _.writeString(buf, obj.playerId);
    }
    tracker.push(obj.card1 !== _.NO_DIFF);
    if (obj.card1 !== _.NO_DIFF) {
      _.writeOptionalDiff(tracker, obj.card1, (x) => _.writeString(buf, x));
    }
    tracker.push(obj.card2 !== _.NO_DIFF);
    if (obj.card2 !== _.NO_DIFF) {
      _.writeOptionalDiff(tracker, obj.card2, (x) => _.writeString(buf, x));
    }
    tracker.push(obj.card3 !== _.NO_DIFF);
    if (obj.card3 !== _.NO_DIFF) {
      _.writeOptionalDiff(tracker, obj.card3, (x) => _.writeString(buf, x));
    }
    tracker.push(obj.card4 !== _.NO_DIFF);
    if (obj.card4 !== _.NO_DIFF) {
      _.writeOptionalDiff(tracker, obj.card4, (x) => _.writeString(buf, x));
    }
    tracker.push(obj.card5 !== _.NO_DIFF);
    if (obj.card5 !== _.NO_DIFF) {
      _.writeOptionalDiff(tracker, obj.card5, (x) => _.writeString(buf, x));
    }
    tracker.push(obj.card6 !== _.NO_DIFF);
    if (obj.card6 !== _.NO_DIFF) {
      _.writeOptionalDiff(tracker, obj.card6, (x) => _.writeString(buf, x));
    }
    tracker.push(obj.card7 !== _.NO_DIFF);
    if (obj.card7 !== _.NO_DIFF) {
      _.writeOptionalDiff(tracker, obj.card7, (x) => _.writeString(buf, x));
    }
    tracker.push(obj.card8 !== _.NO_DIFF);
    if (obj.card8 !== _.NO_DIFF) {
      _.writeOptionalDiff(tracker, obj.card8, (x) => _.writeString(buf, x));
    }
    return buf;
  },
  decode(buf: _.Reader): DraftDeckState {
    const sb = buf;
    return {
      playerId: _.parseString(sb),
      card1: _.parseOptional(sb, () => _.parseString(sb)),
      card2: _.parseOptional(sb, () => _.parseString(sb)),
      card3: _.parseOptional(sb, () => _.parseString(sb)),
      card4: _.parseOptional(sb, () => _.parseString(sb)),
      card5: _.parseOptional(sb, () => _.parseString(sb)),
      card6: _.parseOptional(sb, () => _.parseString(sb)),
      card7: _.parseOptional(sb, () => _.parseString(sb)),
      card8: _.parseOptional(sb, () => _.parseString(sb)),
    };
  },
  decodeDiff(buf: _.Reader, tracker: _.Tracker): _.DeepPartial<DraftDeckState> {
    const sb = buf;
    return {
      playerId: tracker.next() ? _.parseString(sb) : _.NO_DIFF,
      card1: tracker.next() ? _.parseOptionalDiff(tracker, () => _.parseString(sb)) : _.NO_DIFF,
      card2: tracker.next() ? _.parseOptionalDiff(tracker, () => _.parseString(sb)) : _.NO_DIFF,
      card3: tracker.next() ? _.parseOptionalDiff(tracker, () => _.parseString(sb)) : _.NO_DIFF,
      card4: tracker.next() ? _.parseOptionalDiff(tracker, () => _.parseString(sb)) : _.NO_DIFF,
      card5: tracker.next() ? _.parseOptionalDiff(tracker, () => _.parseString(sb)) : _.NO_DIFF,
      card6: tracker.next() ? _.parseOptionalDiff(tracker, () => _.parseString(sb)) : _.NO_DIFF,
      card7: tracker.next() ? _.parseOptionalDiff(tracker, () => _.parseString(sb)) : _.NO_DIFF,
      card8: tracker.next() ? _.parseOptionalDiff(tracker, () => _.parseString(sb)) : _.NO_DIFF,
    };
  },
  computeDiff(a: DraftDeckState, b: DraftDeckState): _.DeepPartial<DraftDeckState> | typeof _.NO_DIFF {
    const diff: _.DeepPartial<DraftDeckState> =  {
      playerId: _.diffPrimitive(a.playerId, b.playerId),
      card1: _.diffOptional(a.card1, b.card1, (x, y) => _.diffPrimitive(x, y)),
      card2: _.diffOptional(a.card2, b.card2, (x, y) => _.diffPrimitive(x, y)),
      card3: _.diffOptional(a.card3, b.card3, (x, y) => _.diffPrimitive(x, y)),
      card4: _.diffOptional(a.card4, b.card4, (x, y) => _.diffPrimitive(x, y)),
      card5: _.diffOptional(a.card5, b.card5, (x, y) => _.diffPrimitive(x, y)),
      card6: _.diffOptional(a.card6, b.card6, (x, y) => _.diffPrimitive(x, y)),
      card7: _.diffOptional(a.card7, b.card7, (x, y) => _.diffPrimitive(x, y)),
      card8: _.diffOptional(a.card8, b.card8, (x, y) => _.diffPrimitive(x, y)),
    };
    return diff.playerId === _.NO_DIFF && diff.card1 === _.NO_DIFF && diff.card2 === _.NO_DIFF && diff.card3 === _.NO_DIFF && diff.card4 === _.NO_DIFF && diff.card5 === _.NO_DIFF && diff.card6 === _.NO_DIFF && diff.card7 === _.NO_DIFF && diff.card8 === _.NO_DIFF ? _.NO_DIFF : diff;
  },
  applyDiff(obj: DraftDeckState, diff: _.DeepPartial<DraftDeckState> | typeof _.NO_DIFF): DraftDeckState {
    if (diff === _.NO_DIFF) {
      return obj;
    }
    obj.playerId = diff.playerId === _.NO_DIFF ? obj.playerId : diff.playerId;
    obj.card1 = diff.card1 === _.NO_DIFF ? obj.card1 : _.patchOptional(obj.card1, diff.card1, (a, b) => b);
    obj.card2 = diff.card2 === _.NO_DIFF ? obj.card2 : _.patchOptional(obj.card2, diff.card2, (a, b) => b);
    obj.card3 = diff.card3 === _.NO_DIFF ? obj.card3 : _.patchOptional(obj.card3, diff.card3, (a, b) => b);
    obj.card4 = diff.card4 === _.NO_DIFF ? obj.card4 : _.patchOptional(obj.card4, diff.card4, (a, b) => b);
    obj.card5 = diff.card5 === _.NO_DIFF ? obj.card5 : _.patchOptional(obj.card5, diff.card5, (a, b) => b);
    obj.card6 = diff.card6 === _.NO_DIFF ? obj.card6 : _.patchOptional(obj.card6, diff.card6, (a, b) => b);
    obj.card7 = diff.card7 === _.NO_DIFF ? obj.card7 : _.patchOptional(obj.card7, diff.card7, (a, b) => b);
    obj.card8 = diff.card8 === _.NO_DIFF ? obj.card8 : _.patchOptional(obj.card8, diff.card8, (a, b) => b);
    return obj;
  },
};

export const CardPairState = {
  default(): CardPairState {
    return {
      playerId: "",
      slot1: "",
      slot2: "",
    };
  },
  validate(obj: CardPairState) {
    if (typeof obj !== "object") {
      return [`Invalid CardPairState object: ${obj}`];
    }
    let validationErrors: string[] = [];

    validationErrors = _.validatePrimitive(typeof obj.playerId === "string", `Invalid string: ${obj.playerId}`);
    if (validationErrors.length > 0) {
      return validationErrors.concat("Invalid key: CardPairState.playerId");
    }
    validationErrors = _.validatePrimitive(typeof obj.slot1 === "string", `Invalid string: ${obj.slot1}`);
    if (validationErrors.length > 0) {
      return validationErrors.concat("Invalid key: CardPairState.slot1");
    }
    validationErrors = _.validatePrimitive(typeof obj.slot2 === "string", `Invalid string: ${obj.slot2}`);
    if (validationErrors.length > 0) {
      return validationErrors.concat("Invalid key: CardPairState.slot2");
    }

    return validationErrors;
  },
  encode(obj: CardPairState, buf: _.Writer = new _.Writer()) {
    _.writeString(buf, obj.playerId);
    _.writeString(buf, obj.slot1);
    _.writeString(buf, obj.slot2);
    return buf;
  },
  encodeDiff(obj: _.DeepPartial<CardPairState>, tracker: _.Tracker, buf: _.Writer = new _.Writer()) {
    tracker.push(obj.playerId !== _.NO_DIFF);
    if (obj.playerId !== _.NO_DIFF) {
      _.writeString(buf, obj.playerId);
    }
    tracker.push(obj.slot1 !== _.NO_DIFF);
    if (obj.slot1 !== _.NO_DIFF) {
      _.writeString(buf, obj.slot1);
    }
    tracker.push(obj.slot2 !== _.NO_DIFF);
    if (obj.slot2 !== _.NO_DIFF) {
      _.writeString(buf, obj.slot2);
    }
    return buf;
  },
  decode(buf: _.Reader): CardPairState {
    const sb = buf;
    return {
      playerId: _.parseString(sb),
      slot1: _.parseString(sb),
      slot2: _.parseString(sb),
    };
  },
  decodeDiff(buf: _.Reader, tracker: _.Tracker): _.DeepPartial<CardPairState> {
    const sb = buf;
    return {
      playerId: tracker.next() ? _.parseString(sb) : _.NO_DIFF,
      slot1: tracker.next() ? _.parseString(sb) : _.NO_DIFF,
      slot2: tracker.next() ? _.parseString(sb) : _.NO_DIFF,
    };
  },
  computeDiff(a: CardPairState, b: CardPairState): _.DeepPartial<CardPairState> | typeof _.NO_DIFF {
    const diff: _.DeepPartial<CardPairState> =  {
      playerId: _.diffPrimitive(a.playerId, b.playerId),
      slot1: _.diffPrimitive(a.slot1, b.slot1),
      slot2: _.diffPrimitive(a.slot2, b.slot2),
    };
    return diff.playerId === _.NO_DIFF && diff.slot1 === _.NO_DIFF && diff.slot2 === _.NO_DIFF ? _.NO_DIFF : diff;
  },
  applyDiff(obj: CardPairState, diff: _.DeepPartial<CardPairState> | typeof _.NO_DIFF): CardPairState {
    if (diff === _.NO_DIFF) {
      return obj;
    }
    obj.playerId = diff.playerId === _.NO_DIFF ? obj.playerId : diff.playerId;
    obj.slot1 = diff.slot1 === _.NO_DIFF ? obj.slot1 : diff.slot1;
    obj.slot2 = diff.slot2 === _.NO_DIFF ? obj.slot2 : diff.slot2;
    return obj;
  },
};

export const DebugBodyState = {
  default(): DebugBodyState {
    return {
      x: 0,
      y: 0,
      points: [],
    };
  },
  validate(obj: DebugBodyState) {
    if (typeof obj !== "object") {
      return [`Invalid DebugBodyState object: ${obj}`];
    }
    let validationErrors: string[] = [];

    validationErrors = _.validatePrimitive(Number.isInteger(obj.x), `Invalid int: ${obj.x}`);
    if (validationErrors.length > 0) {
      return validationErrors.concat("Invalid key: DebugBodyState.x");
    }
    validationErrors = _.validatePrimitive(Number.isInteger(obj.y), `Invalid int: ${obj.y}`);
    if (validationErrors.length > 0) {
      return validationErrors.concat("Invalid key: DebugBodyState.y");
    }
    validationErrors = _.validateArray(obj.points, (x) => Point.validate(x));
    if (validationErrors.length > 0) {
      return validationErrors.concat("Invalid key: DebugBodyState.points");
    }

    return validationErrors;
  },
  encode(obj: DebugBodyState, buf: _.Writer = new _.Writer()) {
    _.writeInt(buf, obj.x);
    _.writeInt(buf, obj.y);
    _.writeArray(buf, obj.points, (x) => Point.encode(x, buf));
    return buf;
  },
  encodeDiff(obj: _.DeepPartial<DebugBodyState>, tracker: _.Tracker, buf: _.Writer = new _.Writer()) {
    tracker.push(obj.x !== _.NO_DIFF);
    if (obj.x !== _.NO_DIFF) {
      _.writeInt(buf, obj.x);
    }
    tracker.push(obj.y !== _.NO_DIFF);
    if (obj.y !== _.NO_DIFF) {
      _.writeInt(buf, obj.y);
    }
    tracker.push(obj.points !== _.NO_DIFF);
    if (obj.points !== _.NO_DIFF) {
      _.writeArrayDiff(buf, tracker, obj.points, (x) => Point.encodeDiff(x, tracker, buf));
    }
    return buf;
  },
  decode(buf: _.Reader): DebugBodyState {
    const sb = buf;
    return {
      x: _.parseInt(sb),
      y: _.parseInt(sb),
      points: _.parseArray(sb, () => Point.decode(sb)),
    };
  },
  decodeDiff(buf: _.Reader, tracker: _.Tracker): _.DeepPartial<DebugBodyState> {
    const sb = buf;
    return {
      x: tracker.next() ? _.parseInt(sb) : _.NO_DIFF,
      y: tracker.next() ? _.parseInt(sb) : _.NO_DIFF,
      points: tracker.next() ? _.parseArrayDiff(sb, tracker, () => Point.decodeDiff(sb, tracker)) : _.NO_DIFF,
    };
  },
  computeDiff(a: DebugBodyState, b: DebugBodyState): _.DeepPartial<DebugBodyState> | typeof _.NO_DIFF {
    const diff: _.DeepPartial<DebugBodyState> =  {
      x: _.diffPrimitive(a.x, b.x),
      y: _.diffPrimitive(a.y, b.y),
      points: _.diffArray(a.points, b.points, (x, y) => Point.computeDiff(x, y)),
    };
    return diff.x === _.NO_DIFF && diff.y === _.NO_DIFF && diff.points === _.NO_DIFF ? _.NO_DIFF : diff;
  },
  applyDiff(obj: DebugBodyState, diff: _.DeepPartial<DebugBodyState> | typeof _.NO_DIFF): DebugBodyState {
    if (diff === _.NO_DIFF) {
      return obj;
    }
    obj.x = diff.x === _.NO_DIFF ? obj.x : diff.x;
    obj.y = diff.y === _.NO_DIFF ? obj.y : diff.y;
    obj.points = diff.points === _.NO_DIFF ? obj.points : _.patchArray(obj.points, diff.points, (a, b) => Point.applyDiff(a, b));
    return obj;
  },
};

export const Point = {
  default(): Point {
    return {
      x: 0,
      y: 0,
    };
  },
  validate(obj: Point) {
    if (typeof obj !== "object") {
      return [`Invalid Point object: ${obj}`];
    }
    let validationErrors: string[] = [];

    validationErrors = _.validatePrimitive(Number.isInteger(obj.x), `Invalid int: ${obj.x}`);
    if (validationErrors.length > 0) {
      return validationErrors.concat("Invalid key: Point.x");
    }
    validationErrors = _.validatePrimitive(Number.isInteger(obj.y), `Invalid int: ${obj.y}`);
    if (validationErrors.length > 0) {
      return validationErrors.concat("Invalid key: Point.y");
    }

    return validationErrors;
  },
  encode(obj: Point, buf: _.Writer = new _.Writer()) {
    _.writeInt(buf, obj.x);
    _.writeInt(buf, obj.y);
    return buf;
  },
  encodeDiff(obj: _.DeepPartial<Point>, tracker: _.Tracker, buf: _.Writer = new _.Writer()) {
    tracker.push(obj.x !== _.NO_DIFF);
    if (obj.x !== _.NO_DIFF) {
      _.writeInt(buf, obj.x);
    }
    tracker.push(obj.y !== _.NO_DIFF);
    if (obj.y !== _.NO_DIFF) {
      _.writeInt(buf, obj.y);
    }
    return buf;
  },
  decode(buf: _.Reader): Point {
    const sb = buf;
    return {
      x: _.parseInt(sb),
      y: _.parseInt(sb),
    };
  },
  decodeDiff(buf: _.Reader, tracker: _.Tracker): _.DeepPartial<Point> {
    const sb = buf;
    return {
      x: tracker.next() ? _.parseInt(sb) : _.NO_DIFF,
      y: tracker.next() ? _.parseInt(sb) : _.NO_DIFF,
    };
  },
  computeDiff(a: Point, b: Point): _.DeepPartial<Point> | typeof _.NO_DIFF {
    const diff: _.DeepPartial<Point> =  {
      x: _.diffPrimitive(a.x, b.x),
      y: _.diffPrimitive(a.y, b.y),
    };
    return diff.x === _.NO_DIFF && diff.y === _.NO_DIFF ? _.NO_DIFF : diff;
  },
  applyDiff(obj: Point, diff: _.DeepPartial<Point> | typeof _.NO_DIFF): Point {
    if (diff === _.NO_DIFF) {
      return obj;
    }
    obj.x = diff.x === _.NO_DIFF ? obj.x : diff.x;
    obj.y = diff.y === _.NO_DIFF ? obj.y : diff.y;
    return obj;
  },
};

export const GameState = {
  default(): GameState {
    return {
      creatures: new Map(),
      items: new Map(),
      effects: new Map(),
      objects: new Map(),
      players: new Map(),
      spectators: new Map(),
      info: GameInfo.default(),
      draft: undefined,
      debugBodies: undefined,
    };
  },
  validate(obj: GameState) {
    if (typeof obj !== "object") {
      return [`Invalid GameState object: ${obj}`];
    }
    let validationErrors: string[] = [];

    validationErrors = _.validateRecord(obj.creatures, (x) => _.validatePrimitive(Number.isInteger(x) && x >= 0, `Invalid uint: ${x}`), (x) => CreatureState.validate(x));
    if (validationErrors.length > 0) {
      return validationErrors.concat("Invalid key: GameState.creatures");
    }
    validationErrors = _.validateRecord(obj.items, (x) => _.validatePrimitive(Number.isInteger(x) && x >= 0, `Invalid uint: ${x}`), (x) => ItemState.validate(x));
    if (validationErrors.length > 0) {
      return validationErrors.concat("Invalid key: GameState.items");
    }
    validationErrors = _.validateRecord(obj.effects, (x) => _.validatePrimitive(Number.isInteger(x) && x >= 0, `Invalid uint: ${x}`), (x) => EffectState.validate(x));
    if (validationErrors.length > 0) {
      return validationErrors.concat("Invalid key: GameState.effects");
    }
    validationErrors = _.validateRecord(obj.objects, (x) => _.validatePrimitive(Number.isInteger(x) && x >= 0, `Invalid uint: ${x}`), (x) => ObjectState.validate(x));
    if (validationErrors.length > 0) {
      return validationErrors.concat("Invalid key: GameState.objects");
    }
    validationErrors = _.validateRecord(obj.players, (x) => _.validatePrimitive(typeof x === "string", `Invalid string: ${x}`), (x) => PlayerState.validate(x));
    if (validationErrors.length > 0) {
      return validationErrors.concat("Invalid key: GameState.players");
    }
    validationErrors = _.validateRecord(obj.spectators, (x) => _.validatePrimitive(typeof x === "string", `Invalid string: ${x}`), (x) => SpectatorState.validate(x));
    if (validationErrors.length > 0) {
      return validationErrors.concat("Invalid key: GameState.spectators");
    }
    validationErrors = GameInfo.validate(obj.info);
    if (validationErrors.length > 0) {
      return validationErrors.concat("Invalid key: GameState.info");
    }
    validationErrors = _.validateOptional(obj.draft, (x) => DraftState.validate(x));
    if (validationErrors.length > 0) {
      return validationErrors.concat("Invalid key: GameState.draft");
    }
    validationErrors = _.validateOptional(obj.debugBodies, (x) => _.validateArray(x, (x) => DebugBodyState.validate(x)));
    if (validationErrors.length > 0) {
      return validationErrors.concat("Invalid key: GameState.debugBodies");
    }

    return validationErrors;
  },
  encode(obj: GameState, buf: _.Writer = new _.Writer()) {
    _.writeRecord(buf, obj.creatures, (x) => _.writeUInt(buf, x), (x) => CreatureState.encode(x, buf));
    _.writeRecord(buf, obj.items, (x) => _.writeUInt(buf, x), (x) => ItemState.encode(x, buf));
    _.writeRecord(buf, obj.effects, (x) => _.writeUInt(buf, x), (x) => EffectState.encode(x, buf));
    _.writeRecord(buf, obj.objects, (x) => _.writeUInt(buf, x), (x) => ObjectState.encode(x, buf));
    _.writeRecord(buf, obj.players, (x) => _.writeString(buf, x), (x) => PlayerState.encode(x, buf));
    _.writeRecord(buf, obj.spectators, (x) => _.writeString(buf, x), (x) => SpectatorState.encode(x, buf));
    GameInfo.encode(obj.info, buf);
    _.writeOptional(buf, obj.draft, (x) => DraftState.encode(x, buf));
    _.writeOptional(buf, obj.debugBodies, (x) => _.writeArray(buf, x, (x) => DebugBodyState.encode(x, buf)));
    return buf;
  },
  encodeDiff(obj: _.DeepPartial<GameState>, tracker: _.Tracker, buf: _.Writer = new _.Writer()) {
    tracker.push(obj.creatures !== _.NO_DIFF);
    if (obj.creatures !== _.NO_DIFF) {
      _.writeRecordDiff(buf, obj.creatures, (x) => _.writeUInt(buf, x), (x) => CreatureState.encodeDiff(x, tracker, buf));
    }
    tracker.push(obj.items !== _.NO_DIFF);
    if (obj.items !== _.NO_DIFF) {
      _.writeRecordDiff(buf, obj.items, (x) => _.writeUInt(buf, x), (x) => ItemState.encodeDiff(x, tracker, buf));
    }
    tracker.push(obj.effects !== _.NO_DIFF);
    if (obj.effects !== _.NO_DIFF) {
      _.writeRecordDiff(buf, obj.effects, (x) => _.writeUInt(buf, x), (x) => EffectState.encodeDiff(x, tracker, buf));
    }
    tracker.push(obj.objects !== _.NO_DIFF);
    if (obj.objects !== _.NO_DIFF) {
      _.writeRecordDiff(buf, obj.objects, (x) => _.writeUInt(buf, x), (x) => ObjectState.encodeDiff(x, tracker, buf));
    }
    tracker.push(obj.players !== _.NO_DIFF);
    if (obj.players !== _.NO_DIFF) {
      _.writeRecordDiff(buf, obj.players, (x) => _.writeString(buf, x), (x) => PlayerState.encodeDiff(x, tracker, buf));
    }
    tracker.push(obj.spectators !== _.NO_DIFF);
    if (obj.spectators !== _.NO_DIFF) {
      _.writeRecordDiff(buf, obj.spectators, (x) => _.writeString(buf, x), (x) => SpectatorState.encodeDiff(x, tracker, buf));
    }
    tracker.push(obj.info !== _.NO_DIFF);
    if (obj.info !== _.NO_DIFF) {
      GameInfo.encodeDiff(obj.info, tracker, buf);
    }
    tracker.push(obj.draft !== _.NO_DIFF);
    if (obj.draft !== _.NO_DIFF) {
      _.writeOptionalDiff(tracker, obj.draft, (x) => DraftState.encodeDiff(x, tracker, buf));
    }
    tracker.push(obj.debugBodies !== _.NO_DIFF);
    if (obj.debugBodies !== _.NO_DIFF) {
      _.writeOptionalDiff(tracker, obj.debugBodies, (x) => _.writeArrayDiff(buf, tracker, x, (x) => DebugBodyState.encodeDiff(x, tracker, buf)));
    }
    return buf;
  },
  decode(buf: _.Reader): GameState {
    const sb = buf;
    return {
      creatures: _.parseRecord(sb, () => _.parseUInt(sb), () => CreatureState.decode(sb)),
      items: _.parseRecord(sb, () => _.parseUInt(sb), () => ItemState.decode(sb)),
      effects: _.parseRecord(sb, () => _.parseUInt(sb), () => EffectState.decode(sb)),
      objects: _.parseRecord(sb, () => _.parseUInt(sb), () => ObjectState.decode(sb)),
      players: _.parseRecord(sb, () => _.parseString(sb), () => PlayerState.decode(sb)),
      spectators: _.parseRecord(sb, () => _.parseString(sb), () => SpectatorState.decode(sb)),
      info: GameInfo.decode(sb),
      draft: _.parseOptional(sb, () => DraftState.decode(sb)),
      debugBodies: _.parseOptional(sb, () => _.parseArray(sb, () => DebugBodyState.decode(sb))),
    };
  },
  decodeDiff(buf: _.Reader, tracker: _.Tracker): _.DeepPartial<GameState> {
    const sb = buf;
    return {
      creatures: tracker.next() ? _.parseRecordDiff(sb, () => _.parseUInt(sb), () => CreatureState.decodeDiff(sb, tracker)) : _.NO_DIFF,
      items: tracker.next() ? _.parseRecordDiff(sb, () => _.parseUInt(sb), () => ItemState.decodeDiff(sb, tracker)) : _.NO_DIFF,
      effects: tracker.next() ? _.parseRecordDiff(sb, () => _.parseUInt(sb), () => EffectState.decodeDiff(sb, tracker)) : _.NO_DIFF,
      objects: tracker.next() ? _.parseRecordDiff(sb, () => _.parseUInt(sb), () => ObjectState.decodeDiff(sb, tracker)) : _.NO_DIFF,
      players: tracker.next() ? _.parseRecordDiff(sb, () => _.parseString(sb), () => PlayerState.decodeDiff(sb, tracker)) : _.NO_DIFF,
      spectators: tracker.next() ? _.parseRecordDiff(sb, () => _.parseString(sb), () => SpectatorState.decodeDiff(sb, tracker)) : _.NO_DIFF,
      info: tracker.next() ? GameInfo.decodeDiff(sb, tracker) : _.NO_DIFF,
      draft: tracker.next() ? _.parseOptionalDiff(tracker, () => DraftState.decodeDiff(sb, tracker)) : _.NO_DIFF,
      debugBodies: tracker.next() ? _.parseOptionalDiff(tracker, () => _.parseArrayDiff(sb, tracker, () => DebugBodyState.decodeDiff(sb, tracker))) : _.NO_DIFF,
    };
  },
  computeDiff(a: GameState, b: GameState): _.DeepPartial<GameState> | typeof _.NO_DIFF {
    const diff: _.DeepPartial<GameState> =  {
      creatures: _.diffRecord(a.creatures, b.creatures, (x, y) => CreatureState.computeDiff(x, y)),
      items: _.diffRecord(a.items, b.items, (x, y) => ItemState.computeDiff(x, y)),
      effects: _.diffRecord(a.effects, b.effects, (x, y) => EffectState.computeDiff(x, y)),
      objects: _.diffRecord(a.objects, b.objects, (x, y) => ObjectState.computeDiff(x, y)),
      players: _.diffRecord(a.players, b.players, (x, y) => PlayerState.computeDiff(x, y)),
      spectators: _.diffRecord(a.spectators, b.spectators, (x, y) => SpectatorState.computeDiff(x, y)),
      info: GameInfo.computeDiff(a.info, b.info),
      draft: _.diffOptional(a.draft, b.draft, (x, y) => DraftState.computeDiff(x, y)),
      debugBodies: _.diffOptional(a.debugBodies, b.debugBodies, (x, y) => _.diffArray(x, y, (x, y) => DebugBodyState.computeDiff(x, y))),
    };
    return diff.creatures === _.NO_DIFF && diff.items === _.NO_DIFF && diff.effects === _.NO_DIFF && diff.objects === _.NO_DIFF && diff.players === _.NO_DIFF && diff.spectators === _.NO_DIFF && diff.info === _.NO_DIFF && diff.draft === _.NO_DIFF && diff.debugBodies === _.NO_DIFF ? _.NO_DIFF : diff;
  },
  applyDiff(obj: GameState, diff: _.DeepPartial<GameState> | typeof _.NO_DIFF): GameState {
    if (diff === _.NO_DIFF) {
      return obj;
    }
    obj.creatures = diff.creatures === _.NO_DIFF ? obj.creatures : _.patchRecord(obj.creatures, diff.creatures, (a, b) => CreatureState.applyDiff(a, b));
    obj.items = diff.items === _.NO_DIFF ? obj.items : _.patchRecord(obj.items, diff.items, (a, b) => ItemState.applyDiff(a, b));
    obj.effects = diff.effects === _.NO_DIFF ? obj.effects : _.patchRecord(obj.effects, diff.effects, (a, b) => EffectState.applyDiff(a, b));
    obj.objects = diff.objects === _.NO_DIFF ? obj.objects : _.patchRecord(obj.objects, diff.objects, (a, b) => ObjectState.applyDiff(a, b));
    obj.players = diff.players === _.NO_DIFF ? obj.players : _.patchRecord(obj.players, diff.players, (a, b) => PlayerState.applyDiff(a, b));
    obj.spectators = diff.spectators === _.NO_DIFF ? obj.spectators : _.patchRecord(obj.spectators, diff.spectators, (a, b) => SpectatorState.applyDiff(a, b));
    obj.info = diff.info === _.NO_DIFF ? obj.info : GameInfo.applyDiff(obj.info, diff.info);
    obj.draft = diff.draft === _.NO_DIFF ? obj.draft : _.patchOptional(obj.draft, diff.draft, (a, b) => DraftState.applyDiff(a, b));
    obj.debugBodies = diff.debugBodies === _.NO_DIFF ? obj.debugBodies : _.patchOptional(obj.debugBodies, diff.debugBodies, (a, b) => _.patchArray(a, b, (a, b) => DebugBodyState.applyDiff(a, b)));
    return obj;
  },
};
