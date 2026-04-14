import React from 'react';
import type { MenuItem } from '@/api/stub/models/MenuItem';

/**
 * MenuBrowser Component
 * Displays available menu items in a grid layout with quantity selection.
 * Allows users to browse and add items to an order.
 */

interface MenuBrowserProps {
  menuItems: MenuItem[];
  menuLoading: boolean;
  quantityForItem: Record<number, number>;
  isCreating?: boolean;
  onAddItem: (menuItemId: number) => void;
  onQuantityChange: (menuItemId: number, quantity: number) => void;
}

export function MenuBrowser({
  menuItems,
  menuLoading,
  quantityForItem,
  isCreating = false,
  onAddItem,
  onQuantityChange,
}: MenuBrowserProps) {
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
          {menuItems.map((menuItem: MenuItem) => (
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
                {/* {menuItem.description && (
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
                )} */}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div className="field border no-margin" style={{ flex: '0 0 auto' }}>
                  <input
                    type="number"
                    min="1"
                    value={quantityForItem[menuItem.id] || 1}
                    onChange={(e) =>
                      onQuantityChange(menuItem.id, Number(e.target.value))
                    }
                    disabled={isCreating}
                    style={{ width: '60px', textAlign: 'center' }}
                  />
                </div>
                <button
                  className="border small"
                  onClick={() => onAddItem(menuItem.id)}
                  disabled={isCreating}
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
  );
}
