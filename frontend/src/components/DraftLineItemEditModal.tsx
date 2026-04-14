import React, { useState } from 'react';
import { useMenuModifiers } from '@/hooks/useMenuModifiers';

interface DraftLineItemEditModalProps {
  item: {
    tempId: string;
    itemName: string;
    quantity: number;
    selectedModifierIds: number[];
  };
  onClose: () => void;
  onSave: (tempId: string, newQuantity: number, newModifiers: number[]) => void;
}

export function DraftLineItemEditModal({ item, onClose, onSave }: DraftLineItemEditModalProps) {
  const [quantity, setQuantity] = useState(item.quantity);
  const [modifiers, setModifiers] = useState<number[]>(item.selectedModifierIds);
  const { modifiers: menuModifiers, isLoading } = useMenuModifiers();

  const handleToggleModifier = (modId: number) => {
    if (modifiers.includes(modId)) {
      setModifiers(modifiers.filter(id => id !== modId));
    } else {
      setModifiers([...modifiers, modId]);
    }
  };

  const handleSave = () => {
    if (quantity < 1) return;
    onSave(item.tempId, quantity, modifiers);
  };

  return (
    <dialog className="active">
      <h5>Edit {item.itemName}</h5>

      <div className="field border" style={{ marginBottom: '1rem' }}>
        <label>Quantity</label>
        <input
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value) || 1)}
          min="1"
        />
      </div>

      <h6>Modifiers</h6>
      {isLoading ? (
        <p>Loading modifiers...</p>
      ) : (
        <div style={{ maxHeight: '200px', overflowY: 'auto', marginBottom: '1rem' }}>
          {menuModifiers.map(mod => (
            <label key={mod.id} className="row">
              <input
                type="checkbox"
                checked={modifiers.includes(mod.id!)}
                onChange={() => handleToggleModifier(mod.id!)}
              />
              <span>{mod.name} (+${mod.price})</span>
            </label>
          ))}
        </div>
      )}

      <nav className="right-align">
        <button className="transparent" onClick={onClose}>Cancel</button>
        <button className="primary" onClick={handleSave}>Save</button>
      </nav>
    </dialog>
  );
}
