# IDX schemas

## Installation

```sh
npm install @ceramicstudio/idx-schemas
```

## Interfaces and types

### CeramicApi

Ceramic API interface exported by the [`@ceramicnetwork/ceramic-common` library](https://github.com/ceramicnetwork/js-ceramic/tree/develop/packages/ceramic-common)

### SchemaItem

```ts
interface SchemaItem {
  docId?: string
  name: string
  schema: Record<string, unknown>
}
```

### PublishConfig

```ts
interface PublishConfig {
  ceramic: CeramicApi
  schemas: Array<SchemaItem>
}
```

## Constants

### schemas

A record of all the JSON schemas defined and used by IDX, with the following keys:

- `BasicProfile`: see [Basic Profile CIP](https://github.com/ceramicnetwork/CIP/issues/32)
- `Definition` (CIP to be defined)
- `DocIdDocIdMap`: see [DocId to DocId Map CIP](https://github.com/ceramicnetwork/CIP/issues/54)
- `DocIdMap`: see [DocId Map CIP](https://github.com/ceramicnetwork/CIP/issues/51)
- `IdentityIndex` see [Identity Index CIP](https://github.com/ceramicnetwork/CIP/issues/3)
- `StringMap`: see [String Map CIP](https://github.com/ceramicnetwork/CIP/issues/50)

### schemasList

An array of `SchemaItem` of the exported `schemas`

## API

### isSchemaSecure

**Arguments**

1. `schema: Record<string, unknown>`: the JSON schema definition

**Returns** `boolean`

### publishSchema

Creates or updates (if a `docId` is provided) a schema on the Ceramic network

**Arguments**

1. `ceramic: CeramicApi`
1. `item: SchemaItem`

**Returns** `Promise<string>` the docId of the published schema

### publishSchemas

Creates or updates schemas on the Ceramic network

**Arguments**

1. `config: PublishConfig`

**Returns** `Promise<Record<string, string>>` the name to docId record of the published schemas

## License

Apache-2.0 OR MIT
