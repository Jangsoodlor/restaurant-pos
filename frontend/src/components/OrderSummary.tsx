import React from 'react';
import type { MenuItem } from '@/api/stub/models/MenuItem';

/**
 * OrderSummary Component
 * Displays order line items with quantities, pricing, and total.
 * Allows users to edit quantities and delete items.
 */

interface LineItem {
  tempId: string;
  menuItemId: number;
  menuItem: MenuItem;
  quantity: number;
  // selectedModifierIds: number[];
}

interface OrderSummaryProps {
  lineItems: LineItem[];
  orderTotal: number;
  editingLineItemId: string | null;
  isCreating?: boolean;
  onEditQuantity: (tempId: string, newQuantity: number) => void;
  onDeleteItem: (tempId: string) => void;
  onSetEditingLineItemId: (tempId: string | null) => void;
}

export function OrderSummary({
  lineItems,
  orderTotal,
  editingLineItemId,
  isCreating = false,
  onEditQuantity,
  onDeleteItem,
  onSetEditingLineItemId,
}: OrderSummaryProps) {
  return (
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
                {/* TODO: re-enabled once Item Modifiers is implemented. */}
                {/* {item.selectedModifierIds.length > 0 && (
                  <p
                    className="no-margin"
                    style={{ fontSize: '12px', color: 'var(--on-surface-variant)' }}
                  >
                    Modifiers: {item.selectedModifierIds.join(', ')}
                  </p>
                )} */}
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
                            onEditQuantity(item.tempId, Number(e.target.value))
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
                        onClick={() => onSetEditingLineItemId(null)}
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
                    onClick={() => onSetEditingLineItemId(item.tempId)}
                    title="Edit quantity"
                    style={{ minWidth: '32px', minHeight: '32px' }}
                  >
                    <i>edit</i>
                  </button>
                  <button
                    className="transparent circle small"
                    onClick={() => onDeleteItem(item.tempId)}
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
    </div>
  );
}
