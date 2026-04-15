
# MenuItem


## Properties

Name | Type
------------ | -------------
`name` | string
`price` | number
`id` | number
`type` | [MenuItemType](MenuItemType.md)

## Example

```typescript
import type { MenuItem } from ''

// TODO: Update the object below with actual values
const example = {
  "name": null,
  "price": null,
  "id": null,
  "type": null,
} satisfies MenuItem

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as MenuItem
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


