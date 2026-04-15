
# Table


## Properties

Name | Type
------------ | -------------
`tableName` | string
`capacity` | number
`status` | [TableStatus](TableStatus.md)
`id` | number

## Example

```typescript
import type { Table } from ''

// TODO: Update the object below with actual values
const example = {
  "tableName": null,
  "capacity": null,
  "status": null,
  "id": null,
} satisfies Table

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as Table
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


