
# Order

Order database table

## Properties

Name | Type
------------ | -------------
`id` | number
`tableId` | number
`userId` | number
`status` | [OrderStatus](OrderStatus.md)
`createdAt` | Date
`closedAt` | Date
`notes` | string

## Example

```typescript
import type { Order } from ''

// TODO: Update the object below with actual values
const example = {
  "id": null,
  "tableId": null,
  "userId": null,
  "status": null,
  "createdAt": null,
  "closedAt": null,
  "notes": null,
} satisfies Order

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as Order
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


