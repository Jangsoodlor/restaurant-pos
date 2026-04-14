## Context

Currently, the `OrderFormCard` manages draft `LocalLineItem` state, but users cannot attach `menuModifiers` to these items. `OrderSummary` allows basic inline editing of item quantity.
We must enable modifying the `selectedModifierIds` within `LocalLineItem`, but doing this inline is too complex to fit in the list view. Thus, we need a modal for editing draft line items (handling both quantity editing and modifier toggle switches).
The logic from `useMenuModifiers` will be applied for displaying the menu modifiers.

## Goals / Non-Goals

**Goals:**
- Allow users to edit draft item quantities inside a modal.
- Allow users to select menu modifiers for draft items inside the same modal.
- Submit these modifiers successfully upon order creation.

**Non-Goals:**
- Altering the backend API structure (which already accepts `modifier_ids`).

## Decisions

1. **LocalLineItem Interface Change**: Uncomment the `selectedModifierIds: number[]` property. Initialize this properly when a line item is created.
2. **Edit Modal**: We will create a `DraftLineItemEditModal.tsx` component. This component will display the item name, an input for `quantity`, and a list of modifiers fetched using `useMenuModifiers()`. It will maintain a local state for toggled modifier IDs and the updated quantity, saving them to `OrderFormCard`'s state via a callback upon confirming.
3. **Payload Construction**: Inside `handleCreateOrder` of `OrderFormCard`, we will populate the `modifier_ids` for `OrderLineItemBase` payload entries with the values from `selectedModifierIds`.

## Risks / Trade-offs

- *Risk*: Modifiers apply globally (any modifier to any item).
  *Mitigation*: This aligns with current architectural patterns until category-specific modifier restrictions are implemented.
