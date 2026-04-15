
# OrderLineItemRead

DTO for reading a line item, explicitly including its modifiers.

## Properties

Name | Type
------------ | -------------
`id` | number
`orderId` | number
`menuItemId` | number
`itemName` | string
`unitPrice` | number
`quantity` | number
`modifiers` | [Array&lt;MenuItem&gt;](MenuItem.md)

## Example

```typescript
import type { OrderLineItemRead } from ''

// TODO: Update the object below with actual values
const example = {
  "id": null,
  "orderId": null,
  "menuItemId": null,
  "itemName": null,
  "unitPrice": null,
  "quantity": null,
  "modifiers": null,
} satisfies OrderLineItemRead

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as OrderLineItemRead
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


