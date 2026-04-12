import React, { useState } from 'react';
import { NameSearchFilter } from '@/components/NameSearchFilter';
import { PriceRangeFilter } from '@/components/PriceRangeFilter';
import { SortDropdown } from '@/components/SortDropdown';
import useMenuItems from '@/hooks/useMenuItems';
import useMenuModifiers from '@/hooks/useMenuModifiers';
import { ActionMenu } from '@/components/ActionMenu';
import { EntityForm } from '@/components/EntityForm';
import type { FormField } from '@/components/EntityForm';
import { DeleteDialog } from '@/components/DeleteDialog';

export default function Menu() {
  const [activeTab, setActiveTab] = useState<'items' | 'modifiers'>('items');

  // Items hook
  const itemsHook = useMenuItems();
  const modifiersHook = useMenuModifiers();

  const hook = activeTab === 'items' ? itemsHook : modifiersHook;

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<any | null>(null);
  const [formValues, setFormValues] = useState<Record<string, any>>({ name: '', price: '' });

  const fields: FormField[] = [
    { name: 'name', label: 'Name', type: 'text', required: true },
    { name: 'price', label: 'Price', type: 'number', required: true },
  ];

  return (
    <section>
      <header className="space">
        <nav>
          <button className={`button transparent ${activeTab === 'items' ? 'active' : ''}`} onClick={() => setActiveTab('items')}>Items</button>
          <button className={`button transparent ${activeTab === 'modifiers' ? 'active' : ''}`} onClick={() => setActiveTab('modifiers')}>Modifiers</button>
        </nav>
      </header>

      <div className="grid">
        <NameSearchFilter value={hook.nameFilter} onChange={hook.setNameFilter} />
        <PriceRangeFilter min={hook.minPrice} max={hook.maxPrice} onChange={({ min, max }) => { if (min !== undefined) hook.setMinPrice(min); if (max !== undefined) hook.setMaxPrice(max); }} />
        <SortDropdown value={hook.sortOrder} onChange={hook.setSortOrder} />
      </div>

      <nav className="space">
        <button className="button" onClick={() => { setEditing(null); setFormOpen(true); }}>Create {activeTab === 'items' ? 'Item' : 'Modifier'}</button>
      </nav>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {(
          (activeTab === 'items' ? itemsHook.isLoading : modifiersHook.isLoading) ? (
            <div>Loading...</div>
          ) : ((activeTab === 'items' ? itemsHook.items : modifiersHook.modifiers) || []).length === 0 ? (
            <div className="padding">No results</div>
          ) : (
            ((activeTab === 'items' ? itemsHook.items : modifiersHook.modifiers) || []).map((it: any) => (
              <article key={it.id} className="round border padding row top-align">
                <div className="max">
                  <h6 className="no-margin">{it.name}</h6>
                  <p className="no-margin" style={{ marginTop: '0.25rem' }}>
                    <span className="bold">Price:</span> ${it.price}
                  </p>
                </div>

                <ActionMenu
                  onEdit={() => { setEditing(it); setFormValues({ name: it.name, price: it.price }); setFormOpen(true); }}
                  onDelete={() => setDeleteTarget(it)}
                  ariaLabel={`Actions for ${it.name}`}
                />
              </article>
            ))
          )
        )}
      </div>

      <EntityForm
        mode={editing ? 'editing' : 'creating'}
        title={editing ? 'Edit' : 'Create'}
        fields={fields}
        values={formValues}
        isLoading={(activeTab === 'items' ? itemsHook.isCreating || itemsHook.isUpdating : modifiersHook.isCreating || modifiersHook.isUpdating)}
        isOpen={formOpen}
        onChange={(v) => setFormValues(v)}
        onSubmit={(e) => {
          e.preventDefault();
          const payload = { name: formValues.name, price: Number(formValues.price) };
          if (editing) {
            if (activeTab === 'items') itemsHook.updateItem({ menuItemId: editing.id, menuUpdate: payload });
            else modifiersHook.updateModifier({ modifierId: editing.id, menuUpdate: payload });
          } else {
            if (activeTab === 'items') itemsHook.createItem(payload);
            else modifiersHook.createModifier(payload);
          }

          setFormOpen(false);
          setEditing(null);
          setFormValues({ name: '', price: '' });
        }}
        onCancel={() => { setFormOpen(false); setEditing(null); setFormValues({ name: '', price: '' }); }}
      />

      <DeleteDialog
        itemName={deleteTarget?.name}
        isPending={activeTab === 'items' ? itemsHook.isDeleting : modifiersHook.isDeleting}
        isOpen={!!deleteTarget}
        onConfirm={() => {
          if (activeTab === 'items') itemsHook.deleteItem(deleteTarget!.id);
          else modifiersHook.deleteModifier(deleteTarget!.id);
          setDeleteTarget(null);
        }}
        onCancel={() => setDeleteTarget(null)}
      />
    </section>
  );
}
