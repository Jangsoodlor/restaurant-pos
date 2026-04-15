
# BodyCreateOrderOrderPost


## Properties

Name | Type
------------ | -------------
`order` | [OrderCreate](OrderCreate.md)
`orderLineItems` | [Array&lt;OrderLineItemBase&gt;](OrderLineItemBase.md)

## Example

```typescript
import type { BodyCreateOrderOrderPost } from ''

// TODO: Update the object below with actual values
const example = {
  "order": null,
  "orderLineItems": null,
} satisfies BodyCreateOrderOrderPost

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as BodyCreateOrderOrderPost
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


