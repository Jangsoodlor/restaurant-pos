## 1. Type Definitions & Initialization

- [x] 1.1 In `OrderFormCard.tsx` and `OrderSummary.tsx`, uncomment the `selectedModifierIds: number[]` property in the `LocalLineItem` interface.
- [x] 1.2 Update the `handleAddLineItem` function in `OrderFormCard.tsx` to initialize `selectedModifierIds: []` for new draft items.

## 2. Edit Modal Component

- [x] 2.1 Create a new modal component (e.g. `DraftLineItemEditModal.tsx` near `OrderFormCard`) or add a modal inside `OrderFormCard` to handle item edits.
- [x] 2.2 Wire up quantity editing (>= 1) within this modal.
- [x] 2.3 Use the `useMenuModifiers` hook to fetch and render menu modifiers inside the modal (similar to `Menu.tsx`).
- [x] 2.4 Add toggles for adding/removing modifiers from the item's local edit state.
- [x] 2.5 Ensure the modal has a "Save" button that triggers a callback with updated quantity and modifier list, and a "Cancel" button.

## 3. Integrating the Edit Flow

- [x] 3.1 Modify `OrderSummary.tsx` to remove inline editing. Its "edit" button should now just trigger a callback (`onEditItem(tempId)`).
- [x] 3.2 Update `OrderFormCard.tsx` to manage the currently editing item ID and render the edit modal when an item is selected for editing.
- [x] 3.3 Create a `handleSaveLineItemUpdates(tempId, quantity, selectedModifierIds)` function in `OrderFormCard.tsx` to update the draft order state upon modal save.

## 4. Payload Integration

- [x] 4.1 In `handleCreateOrder` inside `OrderFormCard.tsx`, uncomment the `modifierIds` field for `OrderLineItemBase`.
- [x] 4.2 Map `item.selectedModifierIds` to the `modifierIds` property when pushing to the `orderLineItemsPayload` array.
