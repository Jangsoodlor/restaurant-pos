import React, { useState } from 'react';
import { useLocation } from 'wouter';
import useOrders from '@/hooks/useOrders';
import { useMenuItems } from '@/hooks/useMenuItems';
import { useTables } from '@/hooks/useTable';
import { useUser } from '@/hooks/useUser';

/**
 * OrderFormCard - Full order builder component for single-step order creation
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

  function handleAddLineItem(menuItemId: number) {
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

  function handleDeleteLineItem(tempId: string) {
    setLineItems(lineItems.filter((item) => item.tempId !== tempId));
  };

  function handleCreateOrder() {
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
    <div className="padding">
      <h5>Create Order</h5>

      {/* Table + Waiter selectors */}
      <div className="grid" style={{ marginBottom: '1.25rem' }}>
        <div className="s6 field border">
          <label>Table</label>
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
        </div>

        <div className="s6 field border">
          <label>Waiter</label>
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
        </div>
      </div>

      {/* Two-column layout: Menu Browser (left) | Order Summary (right) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '3fr 7fr',
          gap: '1.5rem',
          alignItems: 'start',
        }}
      >
        {/* LEFT: Menu Browser */}
        <div>
          <p
            className="no-margin"
            style={{
              fontSize: '11px',
              fontWeight: 500,
              letterSpacing: '0.07em',
              textTransform: 'uppercase',
              color: 'var(--on-surface-variant)',
              marginBottom: '10px',
            }}
          >
            Menu
          </p>

          {menuLoading ? (
            <div className="center-align padding">
              <progress className="circle" />
            </div>
          ) : menuItems.length === 0 ? (
            <p className="center-align" style={{ color: 'var(--on-surface-variant)' }}>
              No menu items available
            </p>
          ) : (
            <div className="grid">
              {menuItems.map((menuItem: any) => (
                <article
                  key={menuItem.id}
                  className="s12 round border"
                  style={{
                    padding: '12px 14px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '10px',
                  }}
                >
                  <div>
                    <p className="no-margin" style={{ fontWeight: 500, fontSize: '14px' }}>
                      {menuItem.name}
                    </p>
                    <p
                      className="no-margin"
                      style={{ fontSize: '13px', color: 'var(--on-surface-variant)' }}
                    >
                      ${menuItem.price.toFixed(2)}
                    </p>
                    {menuItem.description && (
                      <p
                        className="no-margin"
                        style={{
                          fontSize: '12px',
                          color: 'var(--on-surface-variant)',
                          marginTop: '4px',
                        }}
                      >
                        {menuItem.description}
                      </p>
                    )}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div className="field border no-margin" style={{ flex: '0 0 auto' }}>
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
                        style={{ width: '60px', textAlign: 'center' }}
                      />
                    </div>
                    <button
                      className="border small"
                      onClick={() => handleAddLineItem(menuItem.id)}
                      disabled={ordersHook.isCreating}
                      style={{ flex: 1, fontSize: '13px' }}
                    >
                      Add
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT: Order Summary */}
        <div>
          <p
            className="no-margin"
            style={{
              fontSize: '11px',
              fontWeight: 500,
              letterSpacing: '0.07em',
              textTransform: 'uppercase',
              color: 'var(--on-surface-variant)',
              marginBottom: '10px',
            }}
          >
            Order items {lineItems.length > 0 && `(${lineItems.length})`}
          </p>

          {lineItems.length === 0 ? (
            <div
              style={{
                border: '1.5px dashed var(--outline-variant)',
                borderRadius: '10px',
                padding: '2rem 1rem',
                textAlign: 'center',
                color: 'var(--on-surface-variant)',
                fontSize: '14px',
              }}
            >
              No items added yet
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {lineItems.map((item) => (
                <div
                  key={item.tempId}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px 12px',
                    borderRadius: '10px',
                    border: '1px solid var(--outline-variant)',
                    background: 'var(--surface-variant)',
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <p className="no-margin" style={{ fontWeight: 500, fontSize: '14px' }}>
                      {item.menuItem.name}
                    </p>
                    {item.selectedModifierIds.length > 0 && (
                      <p
                        className="no-margin"
                        style={{ fontSize: '12px', color: 'var(--on-surface-variant)' }}
                      >
                        Modifiers: {item.selectedModifierIds.join(', ')}
                      </p>
                    )}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        marginTop: '6px',
                      }}
                    >
                      {editingLineItemId === item.tempId ? (
                        <>
                          <div className="field border no-margin">
                            <input
                              type="number"
                              min="1"
                              value={item.quantity}
                              onChange={(e) =>
                                handleEditLineItemQuantity(item.tempId, Number(e.target.value))
                              }
                              style={{ width: '60px', textAlign: 'center' }}
                            />
                          </div>
                          <span
                            style={{ fontSize: '13px', color: 'var(--on-surface-variant)' }}
                          >
                            × ${item.menuItem.price.toFixed(2)}
                          </span>
                          <span style={{ fontSize: '13px', fontWeight: 500 }}>
                            = ${(item.quantity * item.menuItem.price).toFixed(2)}
                          </span>
                          <button
                            className="transparent small"
                            onClick={() => setEditingLineItemId(null)}
                            style={{ fontSize: '12px' }}
                          >
                            Done
                          </button>
                        </>
                      ) : (
                        <span
                          style={{ fontSize: '13px', color: 'var(--on-surface-variant)' }}
                        >
                          {item.quantity} × ${item.menuItem.price.toFixed(2)} ={' '}
                          <strong style={{ color: 'var(--on-surface)' }}>
                            ${(item.quantity * item.menuItem.price).toFixed(2)}
                          </strong>
                        </span>
                      )}
                    </div>
                  </div>

                  {editingLineItemId !== item.tempId && (
                    <div style={{ display: 'flex', gap: '4px' }}>
                      <button
                        className="transparent circle small"
                        onClick={() => setEditingLineItemId(item.tempId)}
                        title="Edit quantity"
                        style={{ minWidth: '32px', minHeight: '32px' }}
                      >
                        <i>edit</i>
                      </button>
                      <button
                        className="transparent circle small"
                        onClick={() => handleDeleteLineItem(item.tempId)}
                        title="Remove item"
                        style={{ minWidth: '32px', minHeight: '32px' }}
                      >
                        <i>close</i>
                      </button>
                    </div>
                  )}
                </div>
              ))}

              {/* Order total */}
              <div
                style={{
                  borderTop: '1px solid var(--outline-variant)',
                  marginTop: '4px',
                  paddingTop: '12px',
                  textAlign: 'right',
                }}
              >
                <span style={{ fontSize: '14px', color: 'var(--on-surface-variant)' }}>
                  Total:{' '}
                </span>
                <strong style={{ fontSize: '18px' }}>${orderTotal.toFixed(2)}</strong>
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div
            style={{
              display: 'flex',
              gap: '8px',
              justifyContent: 'flex-end',
              marginTop: '1.25rem',
            }}
          >
            <button
              className="border"
              onClick={handleCancel}
              disabled={ordersHook.isCreating}
            >
              Cancel
            </button>
            <button
              className="border"
              onClick={handleCreateOrder}
              disabled={
                ordersHook.isCreating ||
                !tableId ||
                !userId ||
                lineItems.length === 0
              }
            >
              {ordersHook.isCreating ? (
                <>
                  <progress className="circle small" />
                  Creating...
                </>
              ) : (
                'Create order'
              )}
            </button>
          </div>
        </div>
      </div>
    </div >
  );
}