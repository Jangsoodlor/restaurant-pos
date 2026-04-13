import React, { useState } from 'react';
import useOrderLineItems from '@/hooks/useOrderLineItems';
import { useTables } from '@/hooks/useTable';
import { useUser } from '@/hooks/useUser';
import type { Order } from '@/api/stub';
import { DeleteDialog } from './DeleteDialog';

/**
 * OrderDetailModal - Modal component for viewing and editing existing orders
 *
 * Workflow:
 * 1. Display read-only view: order details, table, waiter, status, and line items list
 * 2. Click "Edit Order" to toggle into edit mode
 * 3. In edit mode: can modify table/waiter/status dropdowns and manage line items (add/edit/delete)
 * 4. Click "Save Changes" to persist updates via hook.updateOrder() and hook.updateLineItem()
 * 5. Click "Delete" to remove order entirely (with confirmation)
 * 6. Click "Close" to dismiss modal without saving (read mode) or cancel edits (edit mode)
 *
 * All API interactions use hooks (useOrders, useOrderLineItems) - no direct API imports.
 * Modal state is scoped locally (isEditMode, editing line item, deletions).
 */
interface OrderDetailModalProps {
  order: Order | null;
  onClose: () => void;
  onOrderUpdate?: (orderId: number) => void;
  onOrderDelete?: (orderId: number) => void;
}

interface LineItemEditState {
  id: number;
  quantity: number;
}

export function OrderDetailModal({
  order,
  onClose,
  onOrderUpdate,
  onOrderDelete,
}: OrderDetailModalProps) {
  const [isEditMode, setIsEditMode] = useState(false);
  const [editTableId, setEditTableId] = useState<string>('');
  const [editUserId, setEditUserId] = useState<string>('');
  const [editStatus, setEditStatus] = useState<string>('');
  const [editingLineItem, setEditingLineItem] = useState<LineItemEditState | null>(null);
  const [deleteLineItemTarget, setDeleteLineItemTarget] = useState<number | null>(null);
  const [deleteOrderConfirm, setDeleteOrderConfirm] = useState(false);

  const lineItemsHook = useOrderLineItems(order?.id ?? null);
  const { data: tables = [], isLoading: tablesLoading } = useTables();
  const { users = [], isLoading: usersLoading } = useUser();

  if (!order) return null;

  const formatDate = (date: Date | string | undefined) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleString();
  };

  const handleEditModeToggle = () => {
    if (!isEditMode) {
      setEditTableId(String(order.table_id));
      setEditUserId(String(order.user_id));
      setEditStatus(order.status);
    }
    setIsEditMode(!isEditMode);
  };

  const handleSaveOrderChanges = () => {
    // TODO: Implement order update via hook
    setIsEditMode(false);
    if (onOrderUpdate) {
      onOrderUpdate(order.id);
    }
  };

  const handleDeleteLineItem = (lineItemId: number) => {
    lineItemsHook.deleteLineItem(lineItemId, {
      onSuccess: () => {
        setDeleteLineItemTarget(null);
      },
    });
  };

  const handleDeleteOrder = () => {
    if (onOrderDelete) {
      onOrderDelete(order.id);
    }
  };

  const orderTotal = lineItemsHook.lineItems.reduce(
    (sum, item) => sum + (item.unitPrice * (item.quantity || 0)),
    0
  );

  return (
    <dialog className="round border" style={{ maxWidth: '600px', margin: '0 auto' }}>
      {/* Header */}
      <div className="padding row top-align space-between">
        <div>
          <h5 className="no-margin">Order #{order.id}</h5>
          <p className="no-margin" style={{ fontSize: '0.85rem', color: '#888' }}>
            {formatDate(order.createdAt)}
          </p>
        </div>
        <button
          className="button transparent"
          onClick={onClose}
          aria-label="Close modal"
        >
          ✕
        </button>
      </div>

      {/* Order Details Section */}
      <div className="padding" style={{ borderTop: '1px solid #ddd' }}>
        {!isEditMode ? (
          <div>
            <p className="no-margin">
              <strong>Table ID:</strong> {order.tableId}
            </p>
            <p className="no-margin">
              <strong>Waiter ID:</strong> {order.userId}
            </p>
            <p className="no-margin">
              <strong>Status:</strong> <span className="badge">{order.status}</span>
            </p>
            <p className="no-margin">
              <strong>Total:</strong> ${orderTotal.toFixed(2)}
            </p>
          </div>
        ) : (
          <div className="space">
            <label>
              Table:
              <select
                value={editTableId}
                onChange={(e) => setEditTableId(e.target.value)}
                disabled={tablesLoading}
              >
                <option value="">Select table</option>
                {tables.map((table) => (
                  <option key={table.id} value={String(table.id)}>
                    {table.tableName}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Waiter:
              <select
                value={editUserId}
                onChange={(e) => setEditUserId(e.target.value)}
                disabled={usersLoading}
              >
                <option value="">Select waiter</option>
                {users.map((user) => (
                  <option key={user.id} value={String(user.id)}>
                    {user.name}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Status:
              <select
                value={editStatus}
                onChange={(e) => setEditStatus(e.target.value)}
              >
                <option value="draft">Draft</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </label>
          </div>
        )}
      </div>

      {/* Line Items Section */}
      <div className="padding" style={{ borderTop: '1px solid #ddd', maxHeight: '300px', overflowY: 'auto' }}>
        <h6 className="no-margin" style={{ marginBottom: '0.5rem' }}>
          Items
        </h6>

        {lineItemsHook.isLoading ? (
          <p>Loading items...</p>
        ) : lineItemsHook.lineItems.length === 0 ? (
          <p style={{ fontSize: '0.9rem', color: '#888' }}>No items</p>
        ) : (
          <div>
            {lineItemsHook.lineItems.map((item) => (
              <div
                key={item.id}
                className="row top-align space-between"
                style={{
                  padding: '0.5rem 0',
                  borderBottom: '1px solid #eee',
                }}
              >
                <div style={{ flex: 1 }}>
                  <p className="no-margin" style={{ fontSize: '0.9rem' }}>
                    <strong>{item.itemName}</strong>
                  </p>
                  {item.modifierIds && item.modifierIds.length > 0 && (
                    <p className="no-margin" style={{ fontSize: '0.85rem', color: '#666' }}>
                      Modifiers: {item.modifierIds.join(', ')}
                    </p>
                  )}
                  {editingLineItem?.id === item.id ? (
                    <div className="row" style={{ marginTop: '0.25rem', gap: '0.25rem' }}>
                      <input
                        type="number"
                        min="1"
                        value={editingLineItem.quantity}
                        onChange={(e) =>
                          setEditingLineItem({
                            ...editingLineItem,
                            quantity: Number(e.target.value),
                          })
                        }
                        style={{ width: '60px' }}
                      />
                      <button
                        className="button small"
                        onClick={() => {
                          lineItemsHook.updateLineItem(
                            {
                              lineItemId: item.id,
                              lineItemUpdate: { quantity: editingLineItem.quantity },
                            },
                            {
                              onSuccess: () => setEditingLineItem(null),
                            }
                          );
                        }}
                      >
                        Save
                      </button>
                      <button
                        className="button small transparent"
                        onClick={() => setEditingLineItem(null)}
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <p className="no-margin" style={{ fontSize: '0.85rem', marginTop: '0.25rem' }}>
                      {item.quantity} × ${item.unitPrice.toFixed(2)} = ${(item.quantity * item.unitPrice).toFixed(2)}
                    </p>
                  )}
                </div>

                <div className="row" style={{ gap: '0.25rem' }}>
                  {editingLineItem?.id !== item.id && (
                    <>
                      <button
                        className="button small transparent"
                        onClick={() =>
                          setEditingLineItem({
                            id: item.id,
                            quantity: item.quantity,
                          })
                        }
                      >
                        Edit
                      </button>
                      <button
                        className="button small transparent"
                        onClick={() => setDeleteLineItemTarget(item.id)}
                      >
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="padding row" style={{ borderTop: '1px solid #ddd', gap: '0.5rem' }}>
        {!isEditMode ? (
          <>
            <button
              className="button"
              onClick={handleEditModeToggle}
              style={{ flex: 1 }}
            >
              Edit Order
            </button>
            <button
              className="button secondary"
              onClick={() => setDeleteOrderConfirm(true)}
            >
              Delete
            </button>
          </>
        ) : (
          <>
            <button
              className="button"
              onClick={handleSaveOrderChanges}
              disabled={lineItemsHook.isUpdating}
              style={{ flex: 1 }}
            >
              {lineItemsHook.isUpdating ? 'Saving...' : 'Save Changes'}
            </button>
            <button
              className="button transparent"
              onClick={handleEditModeToggle}
            >
              Cancel
            </button>
          </>
        )}
        <button
          className="button transparent"
          onClick={onClose}
        >
          Close
        </button>
      </div>

      {/* Delete Line Item Dialog */}
      <DeleteDialog
        itemName={`Line Item`}
        isPending={lineItemsHook.isDeleting}
        isOpen={!!deleteLineItemTarget}
        onConfirm={() => {
          if (deleteLineItemTarget) {
            handleDeleteLineItem(deleteLineItemTarget);
          }
        }}
        onCancel={() => setDeleteLineItemTarget(null)}
      />

      {/* Delete Order Dialog */}
      <DeleteDialog
        itemName={`Order #${order.id}`}
        isPending={false}
        isOpen={deleteOrderConfirm}
        onConfirm={handleDeleteOrder}
        onCancel={() => setDeleteOrderConfirm(false)}
      />
    </dialog>
  );
}
