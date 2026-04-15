
# OrderCreate

Schema for creating a new order

## Properties

Name | Type
------------ | -------------
`tableId` | number
`userId` | number
`status` | [OrderStatus](OrderStatus.md)

## Example

```typescript
import type { OrderCreate } from ''

// TODO: Update the object below with actual values
const example = {
  "tableId": null,
  "userId": null,
  "status": null,
} satisfies OrderCreate

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as OrderCreate
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


