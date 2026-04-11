import { useState } from 'react';
import { useTables, useCreateTable, useUpdateTable, useDeleteTable } from '@/hooks/useTable';
import type { Table, TableBase, TableUpdate, TableStatus as TableStatusEnum } from '@/api/stub/models';
import { TableCard } from '@/components/TableCard';
import { TableForm, type TableFormData } from '@/components/TableForm';
import { TableDeleteDialog } from '@/components/TableDeleteDialog';

type InteractionMode = 'idle' | 'creating' | 'editing';

export function TableStatus() {
  const { data: tables, isPending, error } = useTables();
  const createMutation = useCreateTable();
  const updateMutation = useUpdateTable();
  const deleteMutation = useDeleteTable();

  const [mode, setMode] = useState<InteractionMode>('idle');
  const [selectedTableId, setSelectedTableId] = useState<number | null>(null);
  const [formData, setFormData] = useState<TableFormData>({
    tableName: '',
    capacity: 1,
    status: 'available' as TableStatusEnum,
  });
  const [formError, setFormError] = useState<string | null>(null);
  const [deleteConfirmTableId, setDeleteConfirmTableId] = useState<number | null>(null);

  const handleCreateClick = () => {
    setSelectedTableId(null);
    setFormData({ tableName: '', capacity: 1, status: 'available' as TableStatusEnum });
    setFormError(null);
    setMode('creating');
  };

  const handleEditClick = (table: Table) => {
    setSelectedTableId(table.id!);
    setFormData({
      tableName: table.tableName,
      capacity: table.capacity,
      status: table.status,
    });
    setFormError(null);
    setMode('editing');
  };

  const validateForm = (): boolean => {
    if (!formData.tableName.trim()) {
      setFormError('Table name is required');
      return false;
    }
    if (formData.capacity < 1) {
      setFormError('Capacity must be at least 1');
      return false;
    }
    setFormError(null);
    return true;
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      if (mode === 'creating') {
        const tableBase: TableBase = {
          tableName: formData.tableName,
          capacity: formData.capacity,
          status: formData.status,
        };
        await createMutation.mutateAsync(tableBase);
        setMode('idle');
      } else if (mode === 'editing' && selectedTableId) {
        const tableUpdate: TableUpdate = {
          tableName: formData.tableName,
          capacity: formData.capacity,
          status: formData.status,
        };
        await updateMutation.mutateAsync({ tableId: selectedTableId, tableUpdate });
        setMode('idle');
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Operation failed';
      setFormError(errorMsg);
    }
  };

  const handleCancel = () => {
    setMode('idle');
    setSelectedTableId(null);
    setFormData({ tableName: '', capacity: 1, status: 'available' as TableStatusEnum });
    setFormError(null);
    setDeleteConfirmTableId(null);
  };

  const handleDeleteClick = (tableId: number) => {
    setDeleteConfirmTableId(tableId);
  };

  const handleConfirmDelete = async () => {
    if (!deleteConfirmTableId) return;
    try {
      await deleteMutation.mutateAsync(deleteConfirmTableId);
      setDeleteConfirmTableId(null);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Delete failed';
      setFormError(errorMsg);
    }
  };

  const isLoading =
    isPending ||
    createMutation.isPending ||
    updateMutation.isPending ||
    deleteMutation.isPending;

  if (isPending) return <progress className="circle medium"></progress>;
  if (error) return <article className="round border red-text">Error loading tables: {error.message}</article>;

  const formErrorMessage = formError || createMutation.error?.message || updateMutation.error?.message;

  return (
    <section>
      <h4>Restaurant Table Status</h4>

      {/* Create/Edit Mode Form */}
      {(mode === 'creating' || mode === 'editing') && (
        <TableForm
          mode={mode}
          formData={formData}
          isLoading={isLoading}
          errorMessage={formErrorMessage}
          onChange={setFormData}
          onSubmit={handleFormSubmit}
          onCancel={handleCancel}
        />
      )}

      {/* Delete Confirmation Dialog */}
      {deleteConfirmTableId && (
        <TableDeleteDialog
          tableName={tables?.find(t => t.id === deleteConfirmTableId)?.tableName}
          isPending={deleteMutation.isPending}
          errorMessage={deleteMutation.error?.message}
          onConfirm={handleConfirmDelete}
          onCancel={() => setDeleteConfirmTableId(null)}
        />
      )}

      {/* Create Button */}
      {mode === 'idle' && (
        <div style={{ marginBottom: '1rem' }}>
          <button onClick={handleCreateClick} disabled={isLoading}>
            + Create Table
          </button>
        </div>
      )}

      {/* Tables Grid */}
      <div className="grid">
        {tables?.map(table => (
          <TableCard
            key={table.id}
            table={table}
            onEdit={handleEditClick}
            onDelete={handleDeleteClick}
            disabled={isLoading || deleteConfirmTableId !== null}
          />
        ))}
      </div>
    </section>
  );
}
