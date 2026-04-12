import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import useOrders from '@/hooks/useOrders';
import useOrderLineItems from '@/hooks/useOrderLineItems';
import { EntityForm } from '@/components/EntityForm';
import { DeleteDialog } from '@/components/DeleteDialog';
import type { FormField } from '@/components/EntityForm';
import type { OrderCreate } from '@/api/stub';
import { tableApiClient, userApiClient, menuApiClient } from '@/api/client';

export default function CreateOrder() {
  const [, setLocation] = useLocation();
  const [orderId, setOrderId] = useState<number | null>(null);
  const [orderFormOpen, setOrderFormOpen] = useState(!orderId);
  const [lineItemFormOpen, setLineItemFormOpen] = useState(false);
  const [editingLineItem, setEditingLineItem] = useState<any | null>(null);
  const [deleteLineItemTarget, setDeleteLineItemTarget] = useState<any | null>(null);

  const [orderFormValues, setOrderFormValues] = useState<Record<string, string>>({
    table_id: '',
    user_id: '',
  });
  const [lineItemValues, setLineItemValues] = useState<Record<string, string>>({
    menu_item_id: '',
    quantity: '1',
  });

  const ordersHook = useOrders();
  const lineItemsHook = useOrderLineItems(orderId);

  // Fetch tables, users, menu items
  const { data: tables = [] } = useQuery({
    queryKey: ['tables'],
    queryFn: () => tableApiClient.listTablesTableGet({}),
  });

  const { data: users = [] } = useQuery({
    queryKey: ['users'],
    queryFn: () => userApiClient.listUsersUserGet({}),
  });

  const { data: menuItems = [] } = useQuery({
    queryKey: ['menuItems'],
    queryFn: () => menuApiClient.listTablesMenuItemGet(),
  });

  // Form field definitions
  const orderFields: FormField[] = [
    {
      name: 'table_id',
      label: 'Table',
      type: 'select',
      required: true,
      options: tables.map((t: any) => ({ value: String(t.id), label: t.tableName })),
    },
    {
      name: 'user_id',
      label: 'Waiter',
      type: 'select',
      required: true,
      options: users.map((u: any) => ({ value: String(u.id), label: u.name })),
    },
  ];

  const lineItemFields: FormField[] = [
    {
      name: 'menu_item_id',
      label: 'Menu Item',
      type: 'select',
      required: true,
      options: menuItems.map((m: any) => ({ value: String(m.id), label: `${m.name} - $${m.price}` })),
    },
    {
      name: 'quantity',
      label: 'Quantity',
      type: 'number',
      required: true,
    },
  ];

  // Handle create order
  const handleCreateOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const orderCreate: OrderCreate = {
      tableId: Number(orderFormValues.table_id),
      userId: Number(orderFormValues.user_id),
      status: 'draft',
    };
    ordersHook.createOrder(
      {
        order: orderCreate,
        lineItems: [],
      },
      {
        onSuccess: (newOrder: any) => {
          setOrderId(newOrder.id);
          setOrderFormOpen(false);
        },
      }
    );
  };

  // Handle add line item
  const handleAddLineItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId) return;

    const menuItem = menuItems.find((m: any) => m.id === Number(lineItemValues.menu_item_id));
    if (!menuItem) return;

    const payload = {
      orderId,
      menuItemId: Number(lineItemValues.menu_item_id),
      itemName: menuItem.name,
      unitPrice: menuItem.price,
      quantity: Number(lineItemValues.quantity),
    };

    if (editingLineItem) {
      lineItemsHook.updateLineItem(
        {
          lineItemId: editingLineItem.id,
          lineItemUpdate: { quantity: payload.quantity },
        },
        {
          onSuccess: () => {
            setLineItemFormOpen(false);
            setEditingLineItem(null);
            setLineItemValues({ menu_item_id: '', quantity: '1' });
          },
        }
      );
    } else {
      lineItemsHook.createLineItem(payload, {
        onSuccess: () => {
          setLineItemFormOpen(false);
          setLineItemValues({ menu_item_id: '', quantity: '1' });
        },
      });
    }
  };

  const canFinishOrder = orderId && lineItemsHook.lineItems.length > 0;

  return (
    <section>
      <header className="space">
        <h4>Create Order</h4>
      </header>

      {/* Order details */}
      {orderId && (
        <article className="round border padding">
          <p className="no-margin" style={{ marginBottom: '0.5rem' }}>
            <span className="bold">Order ID:</span> {orderId}
          </p>
          <p className="no-margin" style={{ marginBottom: '0.5rem' }}>
            <span className="bold">Table:</span>{' '}
            {tables.find((t: any) => t.id === Number(orderFormValues.table_id))?.tableName}
          </p>
          <p className="no-margin">
            <span className="bold">Waiter:</span>{' '}
            {users.find((u: any) => u.id === Number(orderFormValues.user_id))?.name}
          </p>
        </article>
      )}

      {/* Line items list */}
      {orderId && (
        <>
          <h5 style={{ marginTop: '1rem' }}>Order Items</h5>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
            {lineItemsHook.isLoading ? (
              <div>Loading items...</div>
            ) : lineItemsHook.lineItems.length === 0 ? (
              <div className="padding">No items added yet</div>
            ) : (
              lineItemsHook.lineItems.map((item: any) => (
                <article key={item.id} className="round border padding row top-align" style={{ fontSize: '0.9rem' }}>
                  <div className="max">
                    <p className="no-margin">
                      <span className="bold">{item.itemName}</span> x {item.quantity}
                    </p>
                    <p className="no-margin" style={{ marginTop: '0.25rem' }}>
                      ${(item.unitPrice * item.quantity).toFixed(2)}
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      className="button transparent"
                      onClick={() => {
                        setEditingLineItem(item);
                        setLineItemValues({
                          menu_item_id: String(item.menuItemId),
                          quantity: String(item.quantity),
                        });
                        setLineItemFormOpen(true);
                      }}
                    >
                      <i>edit</i>
                    </button>
                    <button
                      className="button transparent error-text"
                      onClick={() => setDeleteLineItemTarget(item)}
                    >
                      <i>delete</i>
                    </button>
                  </div>
                </article>
              ))
            )}
          </div>

          <nav className="space">
            <button className="button" onClick={() => setLineItemFormOpen(true)}>
              Add Item
            </button>
            <button className="button" onClick={() => setLocation('/orders')} disabled={!canFinishOrder}>
              Finish Order
            </button>
          </nav>
        </>
      )}

      {/* Order form */}
      <EntityForm
        mode="creating"
        title="Order Details"
        fields={orderFields}
        values={orderFormValues}
        isLoading={ordersHook.isCreating}
        isOpen={orderFormOpen && !orderId}
        onChange={(v) => setOrderFormValues(v)}
        onSubmit={handleCreateOrder}
        onCancel={() => setLocation('/orders')}
      />

      {/* Line item form */}
      <EntityForm
        mode={editingLineItem ? 'editing' : 'creating'}
        title={editingLineItem ? 'Edit Item' : 'Add Item'}
        fields={lineItemFields}
        values={lineItemValues}
        isLoading={lineItemsHook.isCreating || lineItemsHook.isUpdating}
        isOpen={lineItemFormOpen && !!orderId}
        onChange={(v) => setLineItemValues(v)}
        onSubmit={handleAddLineItem}
        onCancel={() => {
          setLineItemFormOpen(false);
          setEditingLineItem(null);
          setLineItemValues({ menu_item_id: '', quantity: '1' });
        }}
      />

      {/* Delete line item dialog */}
      <DeleteDialog
        itemName={deleteLineItemTarget?.itemName}
        isPending={lineItemsHook.isDeleting}
        isOpen={!!deleteLineItemTarget}
        onConfirm={() => {
          lineItemsHook.deleteLineItem(deleteLineItemTarget!.id);
          setDeleteLineItemTarget(null);
        }}
        onCancel={() => setDeleteLineItemTarget(null)}
      />
    </section>
  );
}
