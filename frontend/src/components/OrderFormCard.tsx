import React, { useState } from 'react';
import { useLocation } from 'wouter';
import useOrders from '@/hooks/useOrders';
import { useMenuItems } from '@/hooks/useMenuItems';
import { useTables } from '@/hooks/useTable';
import { useUser } from '@/hooks/useUser';
import { MenuBrowser } from './MenuBrowser';
import { OrderSummary } from './OrderSummary';
import type { BodyCreateOrderOrderPost, OrderLineItemBase, OrderCreate } from '@/api/stub';

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
  // selectedModifierIds: number[];
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
  const [editingLineItemId, setEditingLineItemId] = useState<string | null>(null);

  function handleAddLineItem(menuItemId: number) {
    const menuItem = menuItems.find((m) => m.id === menuItemId);
    if (!menuItem) return;

    const quantity = quantityForItem[menuItemId] || 1;

    if (quantity < 1) {
      alert('Quantity must be at least 1');
      return;
    }

    const newItem: LocalLineItem = {
      tempId: `temp-${Date.now()}-${Math.random()}`,
      menuItemId,
      menuItem,
      quantity,
      // selectedModifierIds: Array.from(modifiers),
    };

    setLineItems([...lineItems, newItem]);

    // Reset form for this item
    setQuantityForItem({ ...quantityForItem, [menuItemId]: 1 });
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

    // const payload = {
    //   table_id: Number(tableId),
    //   user_id: Number(userId),
    //   lineItems: lineItems.map((item) => ({
    //     menuItemId: item.menuItemId,
    //     quantity: item.quantity,
    //     // modifiers: item.selectedModifierIds,
    //     itemName: item.menuItem.name,
    //     unitPrice: item.menuItem.price,
    //   })),
    // };

    const orderCreatePayload: OrderCreate = {
      tableId: Number(tableId),
      userId: Number(userId)
    }

    const orderLineItemsPayload: OrderLineItemBase[] = []

    for (const item of lineItems) {
      const singleOrderLineItem: OrderLineItemBase = {
        menuItemId: item.menuItemId,
        itemName: item.menuItem.name,
        unitPrice: item.menuItem.price,
        quantity: item.quantity,
        notes: "Placeholder Notes",
        // modifierIds: [],
      }
      orderLineItemsPayload.push(singleOrderLineItem)
    }

    const payload: BodyCreateOrderOrderPost = {
      order: orderCreatePayload,
      orderLineItems: orderLineItemsPayload
    }

    console.log(payload)
    // TODO: Implement hook after everything is done. (DO NOT uncomment this line.)
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
        <MenuBrowser
          menuItems={menuItems}
          menuLoading={menuLoading}
          quantityForItem={quantityForItem}
          isCreating={ordersHook.isCreating}
          onAddItem={handleAddLineItem}
          onQuantityChange={(menuItemId, quantity) =>
            setQuantityForItem({
              ...quantityForItem,
              [menuItemId]: quantity,
            })
          }
        />

        {/* RIGHT: Order Summary */}
        <OrderSummary
          lineItems={lineItems}
          orderTotal={orderTotal}
          editingLineItemId={editingLineItemId}
          isCreating={ordersHook.isCreating}
          onEditQuantity={handleEditLineItemQuantity}
          onDeleteItem={handleDeleteLineItem}
          onSetEditingLineItemId={setEditingLineItemId}
        />
      </div>

    </div>
  );
}