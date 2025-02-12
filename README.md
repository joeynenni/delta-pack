# Delta Pack

A TypeScript library for efficient binary serialization with delta compression support. Define schemas, encode/decode data, and efficiently transmit only changed values.

## Features

- **Strong TypeScript type safety:** Define well-typed schemas
- **Efficient binary encoding/decoding:** Convert data to a compact binary format (Uint8Array)
- **Delta compression:** Transmit only the differences between states
- **Schema validation:** Built-in methods to validate data
- **Composable schemas:** Combine primitives, objects, and arrays seamlessly

## Installation

Install the library via npm:

```bash
npm install delta-pack
```

## Quick Start

### Full State Encoding/Decoding

Define a schema and encode a state to binary then decode it back.

```typescript
import { Int, String, createObject } from 'delta-pack'

// Define a simple schema for a player
const playerSchema = createObject({
  id: String,
  score: Int
})

// Create a player object
const player = { id: "player-123", score: 100 }

// Encode the player to binary (returns a Uint8Array)
const binaryData = playerSchema.encode(player)

// Decode the binary data back to a JavaScript object
const decodedPlayer = playerSchema.decode(binaryData)

console.log(decodedPlayer)
```

## Composite Schemas

You can create more complex, nested schemas using `createObject` and `createArray`.

### Example: Defining a Game State

```typescript
import { Boolean, Float, Int, String } from 'delta-pack'
import { createArray, createObject } from 'delta-pack'

// Define a nested player schema
const playerSchema = createObject({
  id: Int,
  name: String,
  position: createObject({
    x: Float,
    y: Float
  }),
  inventory: createArray(String),
  dead: Boolean
})

// Define a game state schema that includes an array of players
const gameStateSchema = createObject({
  tick: Int,
  players: createArray(playerSchema),
  worldSeed: Int
})

// Example game state object
const gameState = {
  tick: 42,
  players: [
    {
      id: 1,
      name: "Player1",
      position: { x: 10.5, y: 20.5 },
      inventory: ["sword", "shield"],
      dead: false
    }
  ],
  worldSeed: 12345
}

// Encode and decode the game state
const fullBinary = gameStateSchema.encode(gameState)
const decodedGameState = gameStateSchema.decode(fullBinary)

console.log(decodedGameState)
```

## Delta Compression

When only parts of your state change, you can generate a delta update that transmits only the differences between states. The API now uses a single `encodeDiff(previousState, nextState)` method to produce a binary delta. At decoding time, pass the previous state to `decode()` so the library can merge the delta with the previous state.

```typescript
import { Int, String, createObject, createArray } from 'delta-pack'

// Define a game state schema
const gameStateSchema = createObject({
  tick: Int,
  players: createArray(
    createObject({
      id: Int,
      score: Int
    })
  )
});

// Initial state
const state1 = {
  tick: 1,
  players: [
    { id: 1, score: 100 },
    { id: 2, score: 200 }
  ]
};

// Updated state (only the first player's score and the tick change)
const state2 = {
  tick: 2,
  players: [
    { id: 1, score: 150 }, // Changed value.
    { id: 2, score: 200 } // Unchanged.
  ]
};

// Generate a delta binary that encodes only the differences
const deltaBinary = gameStateSchema.encodeDiff(state1, state2);
console.log("Delta binary size:", deltaBinary.length, "bytes");

// Decode the delta update by providing the previous state
// The decode() method will merge the delta with state1 to produce state2
const updatedState = gameStateSchema.decode(deltaBinary, state1);
console.log("Updated state:", updatedState);
```

In this example:

- `encodeDiff(state1, state2)` compares the previous state (`state1`) with the new state (`state2`) and generates a compact binary delta that contains only the modified fields.
- `decode(deltaBinary, state1)` is then used to merge the delta with the previous state, producing the updated state (`state2`).

This approach ensures that only necessary changes are transmitted, improving efficiency for real-time applications.

## Validation

Each schema comes with a `validate` method to verify that data conforms to the expected schema. It returns an array of error messages if there are mismatches.

```typescript
const errors = playerSchema.validate({
  id: 123,        // Wrong type: should be a string
  score: "100"    // Wrong type: should be a number
})

console.log(errors) // e.g., ["Invalid string: 123", "Invalid int: 100"]
```

## API Reference

### Schema Interface
The `Schema<T>` interface represents a schema for a given data type `T` and provides methods for encoding, decoding, and validating data.

- **validate(value: unknown): string[]**  
  Validates the provided value against the schema. Returns an array of error messages if validation fails (or an empty array if valid).

- **encode(value: T): Uint8Array**  
  Encodes the entire state of a value into a binary `Uint8Array`.

- **decode(binary: Uint8Array, prevState?: T): T**  
  Decodes a binary `Uint8Array` into a value of type `T`. If the binary data represents a delta update, the previous state must be supplied so the changes can be merged.

- **encodeDiff(prev: T, next: T): Uint8Array**  
  Encodes only the differences between a previous state and a new state into a binary delta. This operation transmits only the modified fields.

### createPrimitive
Creates a primitive schema for basic types (such as numbers, strings, booleans). This function abstracts the low-level binary encoding/decoding details and provides built-in validation.

**Signature:**
```typescript
createPrimitive<T>(
  name: string,
  validate: (value: T) => boolean,
  encodeFn: (writer: Writer, value: T) => void,
  decodeFn: (reader: Reader) => T
): Schema<T>;
```

- **name**: The name of the primitive type (used for constructing error messages).
- **validate**: A function that validates whether a given value is valid for this primitive type.
- **encodeFn**: A function to encode a value into binary using a `Writer`.
- **decodeFn**: A function to decode a value from binary using a `Reader`.

Returns a `Schema<T>` that can be used to encode, decode, and validate data of type `T`.

### createObject
Creates a composite object schema from a set of property schemas. Each property in the object is individually validated and processed using its corresponding schema.

**Signature:**
```typescript
createObject<T extends object>(
  properties: { [K in keyof T]: Schema<T[K]> }
): Schema<T>;
```

- **properties**: An object mapping keys to their respective schemas.

Returns a `Schema<T>` for objects, where each property is encoded, decoded, and validated according to its schema.

### createArray
Creates an array schema from an item schema. This function enables you to encode, decode, and validate arrays whose items conform to a specified schema.

**Signature:**
```typescript
createArray<T>(itemSchema: Schema<T>): Schema<T[]>;
```

- **itemSchema**: The schema used for encoding and decoding each array element.

Returns a `Schema<T[]>` that operates on arrays of items of type `T`.

### Predefined Primitive Schemas
The library provides several preconfigured schemas for common primitive data types:

- **Int**:  
  A `Schema<number>` for integer values.

- **Float**:  
  A `Schema<number>` for floating-point values.

- **String**:  
  A `Schema<string>` for string values.

- **Boolean**:  
  A `Schema<boolean>` for boolean values.

Example usage:
```typescript
import { Int, Float, String, Boolean } from 'delta-pack';
```

## Best Practices

- **Reuse Schemas:** Create and reuse sub-schemas across your application.
- **Validate Input:** Always validate data prior to encoding.
- **Leverage Delta Compression:** Use `encodeDiff` to minimize transmitted data for frequent updates.
- **Optimize Performance:** Reuse schema instances in performance-critical code.

## Conclusion

Delta Pack provides a type-safe and efficient approach to binary serialization and delta compression. Its high-level API abstracts away complex low-level details, making it ideal for real-time applications such as games and data synchronization.

For more detailed examples, refer to the test files in the `src/tests` directory.

Happy coding! 🚀
