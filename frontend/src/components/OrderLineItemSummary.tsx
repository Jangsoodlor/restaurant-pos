import type { MenuItem } from '@/api/stub/models/MenuItem';
import { useMenuModifiers } from '@/hooks/useMenuModifiers';

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
  selectedModifierIds: number[];
}

interface OrderSummaryProps {
  lineItems: LineItem[];
  orderTotal: number;
  editingLineItemId: string | null;
  isCreating?: boolean;
  onDeleteItem: (tempId: string) => void;
  onSetEditingLineItemId: (tempId: string | null) => void;
}

export function OrderLineItemSummary({
  lineItems,
  orderTotal,
  editingLineItemId,
  isCreating = false,
  onDeleteItem,
  onSetEditingLineItemId,
}: OrderSummaryProps) {
  const { modifiers: availableModifiers } = useMenuModifiers();

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
                {item.selectedModifierIds.length > 0 && (
                  <p
                    className="no-margin"
                    style={{ fontSize: '12px', color: 'var(--on-surface-variant)' }}
                  >
                    Modifiers: {item.selectedModifierIds.map(id => availableModifiers.find(m => m.id === id)?.name || id).join(', ')}
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
                  {(() => {
                    const modifierSum = item.selectedModifierIds.reduce((sum, modId) => {
                      const mod = availableModifiers.find((m) => m.id === modId);
                      return sum + (mod?.price || 0);
                    }, 0);
                    const unitPrice = item.menuItem.price + modifierSum;
                    return (
                      <span
                        style={{ fontSize: '13px', color: 'var(--on-surface-variant)' }}
                      >
                        {item.quantity} × ${unitPrice.toFixed(2)} ={' '}
                        <strong style={{ color: 'var(--on-surface)' }}>
                          ${(item.quantity * unitPrice).toFixed(2)}
                        </strong>
                      </span>
                    );
                  })()}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '4px' }}>
                <button
                  className="transparent circle small"
                  onClick={() => onSetEditingLineItemId(item.tempId)}
                  title="Edit item"
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
