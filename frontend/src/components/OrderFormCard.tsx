import React, { useState } from 'react';
import { useLocation } from 'wouter';
import useOrders from '@/hooks/useOrders';
import { useMenuItems } from '@/hooks/useMenuItems';
import { useTables } from '@/hooks/useTable';
import { useUser } from '@/hooks/useUser';

/**
 * OrderFormCard - Full order builder component for single-step order creation
 *
 * Pattern: Full-Order Builder (not multi-step)
 * 1. User selects table and waiter from dropdowns
 * 2. User browses menu items (card layout with quantity input)
 * 3. User clicks "Add to Order" for each item they want → added to local lineItems array
 * 4. Order items list displays all selected items with ability to edit qty or remove
 * 5. User clicks "Create Order" → single POST to backend with full payload:
 *    { table_id, user_id, lineItems: [{ menuItemId, quantity, modifiers }, ...] }
 * 6. On success → redirected to /orders (list view)
 * 7. On cancel → discards all unsaved line items and redirects back
 *
 * All API interactions use hooks (useOrders, useMenuItems, useTables, useUser) - no direct API imports.
 * Local state tracks form selections and line items until single submit.
 */
interface LocalLineItem {
  tempId: string;
  menuItemId: number;
  menuItem: any;
  quantity: number;
  selectedModifierIds: number[];
}

export function OrderFormCard() {
  const [, navigate] = useLocation();
  const ordersHook = useOrders();
  const { items: menuItems = [], isLoading: menuLoading } = useMenuItems();
  const { data: tables = [], isLoading: tablesLoading } = useTables();
  const { users = [], isLoading: usersLoading } = useUser();

  // Form state
  const [tableId, setTableId] = useState('');
  const [userId, setUserId] = useState('');
  const [lineItems, setLineItems] = useState<LocalLineItem[]>([]);

  // Menu browser state (per item)
  const [quantityForItem, setQuantityForItem] = useState<Record<number, number>>({});
  const [modifiersForItem, setModifiersForItem] = useState<Record<number, Set<number>>>({});
  const [editingLineItemId, setEditingLineItemId] = useState<string | null>(null);

  const handleAddLineItem = (menuItemId: number) => {
    const menuItem = menuItems.find((m) => m.id === menuItemId);
    if (!menuItem) return;

    const quantity = quantityForItem[menuItemId] || 1;
    const modifiers = modifiersForItem[menuItemId] || new Set();

    if (quantity < 1) {
      alert('Quantity must be at least 1');
      return;
    }

    const newItem: LocalLineItem = {
      tempId: `temp-${Date.now()}-${Math.random()}`,
      menuItemId,
      menuItem,
      quantity,
      selectedModifierIds: Array.from(modifiers),
    };

    setLineItems([...lineItems, newItem]);

    // Reset form for this item
    setQuantityForItem({ ...quantityForItem, [menuItemId]: 1 });
    setModifiersForItem({ ...modifiersForItem, [menuItemId]: new Set() });
  };

  const handleEditLineItemQuantity = (tempId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    setLineItems(
      lineItems.map((item) =>
        item.tempId === tempId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const handleDeleteLineItem = (tempId: string) => {
    setLineItems(lineItems.filter((item) => item.tempId !== tempId));
  };

  const handleCreateOrder = () => {
    // Validation
    if (!tableId) {
      alert('Please select a table');
      return;
    }
    if (!userId) {
      alert('Please select a waiter');
      return;
    }
    if (lineItems.length === 0) {
      alert('Please add at least one item to the order');
      return;
    }

    // Convert local line items to API payload format with enriched data
    const payload = {
      table_id: Number(tableId),
      user_id: Number(userId),
      lineItems: lineItems.map((item) => ({
        menuItemId: item.menuItemId,
        quantity: item.quantity,
        modifiers: item.selectedModifierIds,
        itemName: item.menuItem.name,
        unitPrice: item.menuItem.price,
      })),
    };

    ordersHook.createOrder(payload, {
      onSuccess: () => {
        navigate('/orders');
      },
      onError: (error) => {
        alert(`Failed to create order: ${error?.message || 'Unknown error'}`);
      },
    });
  };

  const handleCancel = () => {
    if (lineItems.length > 0) {
      if (confirm('Discard draft order?')) {
        navigate('/orders');
      }
    } else {
      navigate('/orders');
    }
  };

  const orderTotal = lineItems.reduce(
    (sum, item) => sum + item.menuItem.price * item.quantity,
    0
  );

  return (
    <section className="padding">
      <h3>Create Order</h3>

      {/* Selectors */}
      <div className="row space" style={{ gap: '1rem', marginBottom: '1.5rem' }}>
        <label style={{ flex: 1 }}>
          Table:
          <select
            value={tableId}
            onChange={(e) => setTableId(e.target.value)}
            disabled={tablesLoading || ordersHook.isCreating}
          >
            <option value="">Select a table</option>
            {tables.map((table: any) => (
              <option key={table.id} value={String(table.id)}>
                {table.tableName}
              </option>
            ))}
          </select>
        </label>

        <label style={{ flex: 1 }}>
          Waiter:
          <select
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            disabled={usersLoading || ordersHook.isCreating}
          >
            <option value="">Select a waiter</option>
            {users.map((user: any) => (
              <option key={user.id} value={String(user.id)}>
                {user.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '1rem',
          marginBottom: '1.5rem',
        }}
      >
        {/* Menu Browser */}
        {menuLoading ? (
          <div>Loading menu items...</div>
        ) : menuItems.length === 0 ? (
          <div>No menu items available</div>
        ) : (
          menuItems.map((menuItem: any) => (
            <article
              key={menuItem.id}
              className="round border padding"
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <h5 className="no-margin">{menuItem.name}</h5>
                <p className="no-margin" style={{ fontSize: '0.9rem', color: '#666' }}>
                  ${menuItem.price.toFixed(2)}
                </p>
                {menuItem.description && (
                  <p className="no-margin" style={{ fontSize: '0.85rem', marginTop: '0.5rem' }}>
                    {menuItem.description}
                  </p>
                )}
              </div>

              {/* Quantity & Modifiers */}
              <div style={{ marginTop: '0.75rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                  Quantity:
                  <input
                    type="number"
                    min="1"
                    value={quantityForItem[menuItem.id] || 1}
                    onChange={(e) =>
                      setQuantityForItem({
                        ...quantityForItem,
                        [menuItem.id]: Number(e.target.value),
                      })
                    }
                    disabled={ordersHook.isCreating}
                    style={{ marginLeft: '0.5rem', width: '60px' }}
                  />
                </label>

                {/* Modifiers - TODO: Fetch actual modifiers and display checkboxes */}
                {/* Placeholder for modifiers functionality */}
              </div>

              <button
                className="button"
                onClick={() => handleAddLineItem(menuItem.id)}
                disabled={ordersHook.isCreating}
                style={{ marginTop: '0.75rem' }}
              >
                Add to Order
              </button>
            </article>
          ))
        )}
      </div>

      {/* Order Items List */}
      {lineItems.length > 0 && (
        <div
          className="round border padding"
          style={{
            backgroundColor: '#f9f9f9',
            marginBottom: '1.5rem',
          }}
        >
          <h5 className="no-margin" style={{ marginBottom: '1rem' }}>
            Order Items ({lineItems.length})
          </h5>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {lineItems.map((item) => (
              <div
                key={item.tempId}
                className="row space-between"
                style={{
                  padding: '0.75rem',
                  backgroundColor: '#fff',
                  borderRadius: '0.25rem',
                  border: '1px solid #ddd',
                }}
              >
                <div style={{ flex: 1 }}>
                  <p className="no-margin">
                    <strong>{item.menuItem.name}</strong>
                  </p>
                  {item.selectedModifierIds.length > 0 && (
                    <p className="no-margin" style={{ fontSize: '0.85rem', color: '#666' }}>
                      Modifiers: {item.selectedModifierIds.join(', ')}
                    </p>
                  )}
                  <p className="no-margin" style={{ fontSize: '0.9rem', marginTop: '0.25rem' }}>
                    {editingLineItemId === item.tempId ? (
                      <div className="row" style={{ gap: '0.5rem', alignItems: 'center' }}>
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) =>
                            handleEditLineItemQuantity(item.tempId, Number(e.target.value))
                          }
                          style={{ width: '70px' }}
                        />
                        <span>×</span>
                        <span>${item.menuItem.price.toFixed(2)}</span>
                        <span>=</span>
                        <strong>${(item.quantity * item.menuItem.price).toFixed(2)}</strong>
                        <button
                          className="button small"
                          onClick={() => setEditingLineItemId(null)}
                        >
                          Done
                        </button>
                      </div>
                    ) : (
                      <>
                        {item.quantity} × ${item.menuItem.price.toFixed(2)} ={' '}
                        <strong>${(item.quantity * item.menuItem.price).toFixed(2)}</strong>
                      </>
                    )}
                  </p>
                </div>

                <div className="row" style={{ gap: '0.5rem' }}>
                  {editingLineItemId !== item.tempId && (
                    <>
                      <button
                        className="button small transparent"
                        onClick={() => setEditingLineItemId(item.tempId)}
                      >
                        Edit
                      </button>
                      <button
                        className="button small transparent"
                        onClick={() => handleDeleteLineItem(item.tempId)}
                      >
                        Remove
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Order Total */}
          <div
            style={{
              marginTop: '1rem',
              paddingTop: '1rem',
              borderTop: '1px solid #ddd',
              textAlign: 'right',
            }}
          >
            <p style={{ fontSize: '1.1rem' }}>
              <strong>Total: ${orderTotal.toFixed(2)}</strong>
            </p>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="row" style={{ gap: '0.5rem', justifyContent: 'flex-end' }}>
        <button
          className="button transparent"
          onClick={handleCancel}
          disabled={ordersHook.isCreating}
        >
          Cancel
        </button>
        <button
          className="button"
          onClick={handleCreateOrder}
          disabled={
            ordersHook.isCreating ||
            !tableId ||
            !userId ||
            lineItems.length === 0
          }
        >
          {ordersHook.isCreating ? 'Creating...' : 'Create Order'}
        </button>
      </div>
    </section>
  );
}
