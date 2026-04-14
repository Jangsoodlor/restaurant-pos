import React from 'react';
import type { OrderWithLineItems } from '@/api/stub';
import { useMenuItems } from '@/hooks/useMenuItems';

interface OrderDetailModalProps {
  orderWithLineItems: OrderWithLineItems | null;
  onClose: () => void;
}

export function OrderDetail({
  orderWithLineItems,
  onClose,
}: OrderDetailModalProps) {
  const { items: availableMenuItems } = useMenuItems();

  if (!orderWithLineItems) return null;

  const { order, orderLineItems } = orderWithLineItems;

  const formatDate = (date: Date | string | undefined) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleString();
  };

  const orderTotal = orderLineItems.reduce(
    (sum, item) => sum + ((item.unitPrice || 0) * (item.quantity || 0)),
    0
  );

  return (
    <dialog className="round border active" open style={{ maxWidth: '600px', margin: '0 auto', zIndex: 1000, position: 'fixed', top: '10%', left: '50%', transform: 'translateX(-50%)', backgroundColor: 'var(--surface, #fff)' }}>
      {/* Header */}
      <div className="padding row top-align space-between">
        <div>
          <h5 className="no-margin">Order #{order.id}</h5>
          <p className="no-margin" style={{ fontSize: '0.85rem', color: '#888' }}>
            {formatDate(order.createdAt)}
          </p>
        </div>
        <button
          className="button transparent circle"
          onClick={onClose}
          aria-label="Close modal"
        >
          <i>close</i>
        </button>
      </div>

      {/* Order Details Section */}
      <div className="padding" style={{ borderTop: '1px solid #ddd' }}>
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
      </div>

      {/* Line Items Section */}
      <div className="padding" style={{ borderTop: '1px solid #ddd', maxHeight: '300px', overflowY: 'auto' }}>
        <h6 className="no-margin" style={{ marginBottom: '0.5rem' }}>
          Items
        </h6>

        {orderLineItems.length === 0 ? (
          <p style={{ fontSize: '0.9rem', color: '#888' }}>No items</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {orderLineItems.map((item) => {
              const fullMenuItem = availableMenuItems.find((m) => m.id === item.menuItemId);
              return (
                <div
                  key={item.id}
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
                      {fullMenuItem ? fullMenuItem.name : `Menu Item #${item.menuItemId}`}
                    </p>
                    {item.modifiers && item.modifiers.length > 0 && (
                      <p
                        className="no-margin"
                        style={{ fontSize: '12px', color: 'var(--on-surface-variant)' }}
                      >
                        Modifiers:{' '}
                        {item.modifiers
                          .map((mod) => mod.name)
                          .join(', ')}
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
                      <span
                        style={{ fontSize: '13px', color: 'var(--on-surface-variant)' }}
                      >
                        {item.quantity || 0} × ${(item.unitPrice || 0).toFixed(2)} ={' '}
                        <strong style={{ color: 'var(--on-surface)' }}>
                          ${((item.quantity || 0) * (item.unitPrice || 0)).toFixed(2)}
                        </strong>
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="padding row right-align" style={{ borderTop: '1px solid #ddd' }}>
        <button
          className="button"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </dialog>
  );
}
