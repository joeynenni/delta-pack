import * as _ from "../helpers";

export type Position = {
  x: number;
  y: number;
};
export type Weapon = {
  name: string;
  damage: number;
};
export type Player = {
  id: number;
  position: Position;
  health: number;
  weapon?: Weapon;
  stealth: boolean;
};
export type GameState = {
  timeRemaining: number;
  players: Player[];
};


export const Position = {
  default(): Position {
    return {
      x: 0.0,
      y: 0.0,
    };
  },
  validate(obj: Position) {
    if (typeof obj !== "object") {
      return [`Invalid Position object: ${obj}`];
    }
    let validationErrors: string[] = [];

    validationErrors = _.validatePrimitive(typeof obj.x === "number", `Invalid float: ${obj.x}`);
    if (validationErrors.length > 0) {
      return validationErrors.concat("Invalid key: Position.x");
    }
    validationErrors = _.validatePrimitive(typeof obj.y === "number", `Invalid float: ${obj.y}`);
    if (validationErrors.length > 0) {
      return validationErrors.concat("Invalid key: Position.y");
    }

    return validationErrors;
  },
  encode(obj: Position, buf: _.Writer = new _.Writer()) {
    _.writeFloat(buf, obj.x);
    _.writeFloat(buf, obj.y);
    return buf;
  },
  encodeDiff(obj: _.DeepPartial<Position>, tracker: _.Tracker, buf: _.Writer = new _.Writer()) {
    tracker.push(obj.x !== _.NO_DIFF);
    if (obj.x !== _.NO_DIFF) {
      _.writeFloat(buf, obj.x);
    }
    tracker.push(obj.y !== _.NO_DIFF);
    if (obj.y !== _.NO_DIFF) {
      _.writeFloat(buf, obj.y);
    }
    return buf;
  },
  decode(buf: _.Reader): Position {
    const sb = buf;
    return {
      x: _.parseFloat(sb),
      y: _.parseFloat(sb),
    };
  },
  decodeDiff(buf: _.Reader, tracker: _.Tracker): _.DeepPartial<Position> {
    const sb = buf;
    return {
      x: tracker.next() ? _.parseFloat(sb) : _.NO_DIFF,
      y: tracker.next() ? _.parseFloat(sb) : _.NO_DIFF,
    };
  },
  computeDiff(a: Position, b: Position): _.DeepPartial<Position> | typeof _.NO_DIFF {
    const diff: _.DeepPartial<Position> =  {
      x: _.diffPrimitive(a.x, b.x),
      y: _.diffPrimitive(a.y, b.y),
    };
    return diff.x === _.NO_DIFF && diff.y === _.NO_DIFF ? _.NO_DIFF : diff;
  },
  applyDiff(obj: Position, diff: _.DeepPartial<Position> | typeof _.NO_DIFF): Position {
    if (diff === _.NO_DIFF) {
      return obj;
    }
    return {
      x: diff.x === _.NO_DIFF ? obj.x : diff.x,
      y: diff.y === _.NO_DIFF ? obj.y : diff.y,
    };
  },
};

export const Weapon = {
  default(): Weapon {
    return {
      name: "",
      damage: 0,
    };
  },
  validate(obj: Weapon) {
    if (typeof obj !== "object") {
      return [`Invalid Weapon object: ${obj}`];
    }
    let validationErrors: string[] = [];

    validationErrors = _.validatePrimitive(typeof obj.name === "string", `Invalid string: ${obj.name}`);
    if (validationErrors.length > 0) {
      return validationErrors.concat("Invalid key: Weapon.name");
    }
    validationErrors = _.validatePrimitive(Number.isInteger(obj.damage), `Invalid int: ${obj.damage}`);
    if (validationErrors.length > 0) {
      return validationErrors.concat("Invalid key: Weapon.damage");
    }

    return validationErrors;
  },
  encode(obj: Weapon, buf: _.Writer = new _.Writer()) {
    _.writeString(buf, obj.name);
    _.writeInt(buf, obj.damage);
    return buf;
  },
  encodeDiff(obj: _.DeepPartial<Weapon>, tracker: _.Tracker, buf: _.Writer = new _.Writer()) {
    tracker.push(obj.name !== _.NO_DIFF);
    if (obj.name !== _.NO_DIFF) {
      _.writeString(buf, obj.name);
    }
    tracker.push(obj.damage !== _.NO_DIFF);
    if (obj.damage !== _.NO_DIFF) {
      _.writeInt(buf, obj.damage);
    }
    return buf;
  },
  decode(buf: _.Reader): Weapon {
    const sb = buf;
    return {
      name: _.parseString(sb),
      damage: _.parseInt(sb),
    };
  },
  decodeDiff(buf: _.Reader, tracker: _.Tracker): _.DeepPartial<Weapon> {
    const sb = buf;
    return {
      name: tracker.next() ? _.parseString(sb) : _.NO_DIFF,
      damage: tracker.next() ? _.parseInt(sb) : _.NO_DIFF,
    };
  },
  computeDiff(a: Weapon, b: Weapon): _.DeepPartial<Weapon> | typeof _.NO_DIFF {
    const diff: _.DeepPartial<Weapon> =  {
      name: _.diffPrimitive(a.name, b.name),
      damage: _.diffPrimitive(a.damage, b.damage),
    };
    return diff.name === _.NO_DIFF && diff.damage === _.NO_DIFF ? _.NO_DIFF : diff;
  },
  applyDiff(obj: Weapon, diff: _.DeepPartial<Weapon> | typeof _.NO_DIFF): Weapon {
    if (diff === _.NO_DIFF) {
      return obj;
    }
    return {
      name: diff.name === _.NO_DIFF ? obj.name : diff.name,
      damage: diff.damage === _.NO_DIFF ? obj.damage : diff.damage,
    };
  },
};

export const Player = {
  default(): Player {
    return {
      id: 0,
      position: Position.default(),
      health: 0,
      weapon: undefined,
      stealth: false,
    };
  },
  validate(obj: Player) {
    if (typeof obj !== "object") {
      return [`Invalid Player object: ${obj}`];
    }
    let validationErrors: string[] = [];

    validationErrors = _.validatePrimitive(Number.isInteger(obj.id), `Invalid int: ${obj.id}`);
    if (validationErrors.length > 0) {
      return validationErrors.concat("Invalid key: Player.id");
    }
    validationErrors = Position.validate(obj.position);
    if (validationErrors.length > 0) {
      return validationErrors.concat("Invalid key: Player.position");
    }
    validationErrors = _.validatePrimitive(Number.isInteger(obj.health), `Invalid int: ${obj.health}`);
    if (validationErrors.length > 0) {
      return validationErrors.concat("Invalid key: Player.health");
    }
    validationErrors = _.validateOptional(obj.weapon, (x) => Weapon.validate(x));
    if (validationErrors.length > 0) {
      return validationErrors.concat("Invalid key: Player.weapon");
    }
    validationErrors = _.validatePrimitive(typeof obj.stealth === "boolean", `Invalid boolean: ${obj.stealth}`);
    if (validationErrors.length > 0) {
      return validationErrors.concat("Invalid key: Player.stealth");
    }

    return validationErrors;
  },
  encode(obj: Player, buf: _.Writer = new _.Writer()) {
    _.writeInt(buf, obj.id);
    Position.encode(obj.position, buf);
    _.writeInt(buf, obj.health);
    _.writeOptional(buf, obj.weapon, (x) => Weapon.encode(x, buf));
    _.writeBoolean(buf, obj.stealth);
    return buf;
  },
  encodeDiff(obj: _.DeepPartial<Player>, tracker: _.Tracker, buf: _.Writer = new _.Writer()) {
    tracker.push(obj.id !== _.NO_DIFF);
    if (obj.id !== _.NO_DIFF) {
      _.writeInt(buf, obj.id);
    }
    tracker.push(obj.position !== _.NO_DIFF);
    if (obj.position !== _.NO_DIFF) {
      Position.encodeDiff(obj.position, tracker, buf);
    }
    tracker.push(obj.health !== _.NO_DIFF);
    if (obj.health !== _.NO_DIFF) {
      _.writeInt(buf, obj.health);
    }
    tracker.push(obj.weapon !== _.NO_DIFF);
    if (obj.weapon !== _.NO_DIFF) {
      _.writeOptional(buf, obj.weapon, (x) => Weapon.encodeDiff(x, tracker, buf));
    }
    tracker.push(obj.stealth !== _.NO_DIFF);
    if (obj.stealth !== _.NO_DIFF) {
      _.writeBoolean(buf, obj.stealth);
    }
    return buf;
  },
  decode(buf: _.Reader): Player {
    const sb = buf;
    return {
      id: _.parseInt(sb),
      position: Position.decode(sb),
      health: _.parseInt(sb),
      weapon: _.parseOptional(sb, () => Weapon.decode(sb)),
      stealth: _.parseBoolean(sb),
    };
  },
  decodeDiff(buf: _.Reader, tracker: _.Tracker): _.DeepPartial<Player> {
    const sb = buf;
    return {
      id: tracker.next() ? _.parseInt(sb) : _.NO_DIFF,
      position: tracker.next() ? Position.decodeDiff(sb, tracker) : _.NO_DIFF,
      health: tracker.next() ? _.parseInt(sb) : _.NO_DIFF,
      weapon: tracker.next() ? _.parseOptional(sb, () => Weapon.decodeDiff(sb, tracker)) : _.NO_DIFF,
      stealth: tracker.next() ? _.parseBoolean(sb) : _.NO_DIFF,
    };
  },
  computeDiff(a: Player, b: Player): _.DeepPartial<Player> | typeof _.NO_DIFF {
    const diff: _.DeepPartial<Player> =  {
      id: _.diffPrimitive(a.id, b.id),
      position: Position.computeDiff(a.position, b.position),
      health: _.diffPrimitive(a.health, b.health),
      weapon: _.diffOptional(a.weapon, b.weapon, (x, y) => Weapon.computeDiff(x, y)),
      stealth: _.diffPrimitive(a.stealth, b.stealth),
    };
    return diff.id === _.NO_DIFF && diff.position === _.NO_DIFF && diff.health === _.NO_DIFF && diff.weapon === _.NO_DIFF && diff.stealth === _.NO_DIFF ? _.NO_DIFF : diff;
  },
  applyDiff(obj: Player, diff: _.DeepPartial<Player> | typeof _.NO_DIFF): Player {
    if (diff === _.NO_DIFF) {
      return obj;
    }
    return {
      id: diff.id === _.NO_DIFF ? obj.id : diff.id,
      position: diff.position === _.NO_DIFF ? obj.position : Position.applyDiff(obj.position, diff.position),
      health: diff.health === _.NO_DIFF ? obj.health : diff.health,
      weapon: diff.weapon === _.NO_DIFF ? obj.weapon : _.patchOptional(obj.weapon, diff.weapon, (a, b) => Weapon.applyDiff(a, b)),
      stealth: diff.stealth === _.NO_DIFF ? obj.stealth : diff.stealth,
    };
  },
};

export const GameState = {
  default(): GameState {
    return {
      timeRemaining: 0,
      players: [],
    };
  },
  validate(obj: GameState) {
    if (typeof obj !== "object") {
      return [`Invalid GameState object: ${obj}`];
    }
    let validationErrors: string[] = [];

    validationErrors = _.validatePrimitive(Number.isInteger(obj.timeRemaining), `Invalid int: ${obj.timeRemaining}`);
    if (validationErrors.length > 0) {
      return validationErrors.concat("Invalid key: GameState.timeRemaining");
    }
    validationErrors = _.validateArray(obj.players, (x) => Player.validate(x));
    if (validationErrors.length > 0) {
      return validationErrors.concat("Invalid key: GameState.players");
    }

    return validationErrors;
  },
  encode(obj: GameState, buf: _.Writer = new _.Writer()) {
    _.writeInt(buf, obj.timeRemaining);
    _.writeArray(buf, obj.players, (x) => Player.encode(x, buf));
    return buf;
  },
  encodeDiff(obj: _.DeepPartial<GameState>, tracker: _.Tracker, buf: _.Writer = new _.Writer()) {
    tracker.push(obj.timeRemaining !== _.NO_DIFF);
    if (obj.timeRemaining !== _.NO_DIFF) {
      _.writeInt(buf, obj.timeRemaining);
    }
    tracker.push(obj.players !== _.NO_DIFF);
    if (obj.players !== _.NO_DIFF) {
      _.writeArrayDiff(buf, tracker, obj.players, (x) => Player.encodeDiff(x, tracker, buf));
    }
    return buf;
  },
  decode(buf: _.Reader): GameState {
    const sb = buf;
    return {
      timeRemaining: _.parseInt(sb),
      players: _.parseArray(sb, () => Player.decode(sb)),
    };
  },
  decodeDiff(buf: _.Reader, tracker: _.Tracker): _.DeepPartial<GameState> {
    const sb = buf;
    return {
      timeRemaining: tracker.next() ? _.parseInt(sb) : _.NO_DIFF,
      players: tracker.next() ? _.parseArrayDiff(sb, tracker, () => Player.decodeDiff(sb, tracker)) : _.NO_DIFF,
    };
  },
  computeDiff(a: GameState, b: GameState): _.DeepPartial<GameState> | typeof _.NO_DIFF {
    const diff: _.DeepPartial<GameState> =  {
      timeRemaining: _.diffPrimitive(a.timeRemaining, b.timeRemaining),
      players: _.diffArray(a.players, b.players, (x, y) => Player.computeDiff(x, y)),
    };
    return diff.timeRemaining === _.NO_DIFF && diff.players === _.NO_DIFF ? _.NO_DIFF : diff;
  },
  applyDiff(obj: GameState, diff: _.DeepPartial<GameState> | typeof _.NO_DIFF): GameState {
    if (diff === _.NO_DIFF) {
      return obj;
    }
    return {
      timeRemaining: diff.timeRemaining === _.NO_DIFF ? obj.timeRemaining : diff.timeRemaining,
      players: diff.players === _.NO_DIFF ? obj.players : _.patchArray(obj.players, diff.players, (a, b) => Player.applyDiff(a, b)),
    };
  },
};

