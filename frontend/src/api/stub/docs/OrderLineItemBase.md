
# OrderLineItemBase

Schema for creating a new line item

## Properties

Name | Type
------------ | -------------
`menuItemId` | number
`itemName` | string
`unitPrice` | number
`quantity` | number
`modifierIds` | Array&lt;number&gt;
`notes` | string

## Example

```typescript
import type { OrderLineItemBase } from ''

// TODO: Update the object below with actual values
const example = {
  "menuItemId": null,
  "itemName": null,
  "unitPrice": null,
  "quantity": null,
  "modifierIds": null,
  "notes": null,
} satisfies OrderLineItemBase

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as OrderLineItemBase
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


