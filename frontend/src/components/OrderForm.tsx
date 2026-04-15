import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/hooks/useAuth';
import useOrders from '@/hooks/useOrders';
import { useMenuItems } from '@/hooks/useMenuItems';
import { useTables } from '@/hooks/useTable';
import { useMenuModifiers } from '@/hooks/useMenuModifiers';
import { MenuBrowser } from './MenuBrowser';
import { OrderLineItemSummary } from './OrderLineItemSummary';
import { DraftLineItemEditModal } from './DraftLineItemEditModal';
import type { BodyCreateOrderOrderPost, OrderLineItemBase, OrderCreate } from '@/api/stub';

/**
 * OrderForm - Full order builder component for single-step order creation
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

export function OrderForm() {
  const [, navigate] = useLocation();
  const { user } = useAuth();
  const ordersHook = useOrders();
  const { items: menuItems = [], isLoading: menuLoading } = useMenuItems();
  const { data: tables = [], isLoading: tablesLoading } = useTables();
  const { modifiers: availableModifiers } = useMenuModifiers();

  // Form state
  const [tableId, setTableId] = useState('');
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
      selectedModifierIds: [],
    };

    setLineItems([...lineItems, newItem]);

    // Reset form for this item
    setQuantityForItem({ ...quantityForItem, [menuItemId]: 1 });
  };

  const handleSaveLineItemUpdates = (tempId: string, newQuantity: number, selectedModifierIds: number[]) => {
    setLineItems(
      lineItems.map((item) =>
        item.tempId === tempId ? { ...item, quantity: newQuantity, selectedModifierIds } : item
      )
    );
    setEditingLineItemId(null);
  };

  function handleDeleteLineItem(tempId: string) {
    setLineItems(lineItems.filter((item) => item.tempId !== tempId));
  };

  function handleCreateOrder() {
    if (!tableId) {
      alert('Please select a table');
      return;
    }
    if (lineItems.length === 0) {
      alert('Please add at least one item to the order');
      return;
    }
    if (!user || !user.id) {
      alert('User session not available');
      return;
    }

    const orderCreatePayload: OrderCreate = {
      tableId: Number(tableId),
      userId: user.id,
      status: 'in_progress'
    }

    const orderLineItemsPayload: OrderLineItemBase[] = []

    for (const item of lineItems) {
      const singleOrderLineItem: OrderLineItemBase = {
        menuItemId: item.menuItemId,
        itemName: item.menuItem.name,
        unitPrice: item.menuItem.price,
        quantity: item.quantity,
        notes: "Placeholder Notes",
        modifierIds: item.selectedModifierIds,
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
    (sum, item) => {
      const modifierSum = item.selectedModifierIds.reduce((mSum, modId) => {
        const mod = availableModifiers.find((m) => m.id === modId);
        return mSum + (mod?.price || 0);
      }, 0);
      return sum + (item.menuItem.price + modifierSum) * item.quantity;
    },
    0
  );

  return (
    <div className="padding">
      <h5>Create Order</h5>

      {/* Table selector */}
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
        <OrderLineItemSummary
          lineItems={lineItems}
          orderTotal={orderTotal}
          editingLineItemId={editingLineItemId}
          isCreating={ordersHook.isCreating}
          onDeleteItem={handleDeleteLineItem}
          onSetEditingLineItemId={setEditingLineItemId}
        />
      </div>

      {editingLineItemId && (
        <DraftLineItemEditModal
          item={{
            tempId: editingLineItemId,
            itemName: lineItems.find(i => i.tempId === editingLineItemId)?.menuItem.name || '',
            quantity: lineItems.find(i => i.tempId === editingLineItemId)?.quantity || 1,
            selectedModifierIds: lineItems.find(i => i.tempId === editingLineItemId)?.selectedModifierIds || []
          }}
          onClose={() => setEditingLineItemId(null)}
          onSave={handleSaveLineItemUpdates}
        />
      )}

    </div>
  );
}