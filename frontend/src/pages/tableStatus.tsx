import { useState } from 'react';
import { useTables, useCreateTable, useUpdateTable, useDeleteTable } from '@/hooks/useTable';
import { useAuth } from '@/hooks/useAuth';
import type { Table, TableBase, TableUpdate, TableStatus as TableStatusEnum } from '@/api/stub/models';
import { TableCard } from '@/components/TableCard';
import { EntityForm, type FormField, type InteractionMode as FormMode } from '@/components/EntityForm';
import { DeleteDialog } from '@/components/DeleteDialog';
import { canCreate, canDelete, canEdit, canEditField } from '@/utils/permissions';

type InteractionMode = 'idle' | FormMode;

// Field descriptors for table entity
const TABLE_FIELDS: FormField[] = [
  {
    name: 'tableName',
    label: 'Table Name',
    type: 'text',
    required: true,
  },
  {
    name: 'capacity',
    label: 'Capacity',
    type: 'number',
    required: true,
  },
  {
    name: 'status',
    label: 'Status',
    type: 'select',
    required: true,
    options: [
      { label: 'Available', value: 'available' },
      { label: 'Occupied', value: 'occupied' },
      { label: 'Reserved', value: 'reserved' },
    ],
  },
];

export function TableStatus() {
  const { data: tables, isPending, error } = useTables();
  const { user } = useAuth();
  const createMutation = useCreateTable();
  const updateMutation = useUpdateTable();
  const deleteMutation = useDeleteTable();

  const [mode, setMode] = useState<InteractionMode>('idle');
  const [selectedTableId, setSelectedTableId] = useState<number | null>(null);
  const [formValues, setFormValues] = useState<Record<string, any>>({
    tableName: '',
    capacity: 1,
    status: 'available' as TableStatusEnum,
  });
  const [formError, setFormError] = useState<string | null>(null);
  const [deleteConfirmTableId, setDeleteConfirmTableId] = useState<number | null>(null);

  const userRole = user?.role ?? null;
  const canCreateTable = canCreate('tableStatus', userRole);
  const canEditTable = canEdit('tableStatus', userRole);
  const canDeleteTable = canDelete('tableStatus', userRole);

  const handleCreateClick = () => {
    setSelectedTableId(null);
    setFormValues({ tableName: '', capacity: 1, status: 'available' as TableStatusEnum });
    setFormError(null);
    setMode('creating');
  };

  const handleEditClick = (table: Table) => {
    setSelectedTableId(table.id!);
    setFormValues({
      tableName: table.tableName,
      capacity: table.capacity,
      status: table.status,
    });
    setFormError(null);
    setMode('editing');
  };

  const validateForm = (): boolean => {
    if (canEditField('tableStatus', 'tableName', userRole) && !formValues.tableName?.toString().trim()) {
      setFormError('Table name is required');
      return false;
    }
    if (canEditField('tableStatus', 'capacity', userRole) && formValues.capacity < 1) {
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
          tableName: formValues.tableName,
          capacity: formValues.capacity,
          status: formValues.status,
        };
        await createMutation.mutateAsync(tableBase);
        setMode('idle');
      } else if (mode === 'editing' && selectedTableId) {
        // Waiters can edit status only; managers can edit all fields.
        const tableUpdate: TableUpdate = canEditField('tableStatus', 'tableName', userRole)
          ? {
            tableName: formValues.tableName,
            capacity: formValues.capacity,
            status: formValues.status,
          }
          : {
            status: formValues.status,
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
    setFormValues({ tableName: '', capacity: 1, status: 'available' as TableStatusEnum });
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

  // Build field disabilities based on role
  const getFieldDisabled = (fieldName: string): boolean => {
    return !canEditField('tableStatus', fieldName, userRole);
  };

  const disabledFields = TABLE_FIELDS.map(field => ({
    ...field,
    disabled: mode === 'editing' ? getFieldDisabled(field.name) : false,
  }));

  if (isPending) return <progress className="circle medium"></progress>;
  if (error) return <article className="round border red-text">Error loading tables: {error.message}</article>;

  const formErrorMessage = formError || createMutation.error?.message || updateMutation.error?.message;

  return (
    <section>
      <h4>Restaurant Table Status</h4>

      {/* Create/Edit Mode Form */}
      <EntityForm
        mode={mode as FormMode}
        title={mode === 'creating' ? 'Create New Table' : 'Edit Table'}
        fields={disabledFields}
        values={formValues}
        isLoading={isLoading}
        isOpen={mode === 'creating' || mode === 'editing'}
        errorMessage={formErrorMessage}
        onChange={setFormValues}
        onSubmit={handleFormSubmit}
        onCancel={handleCancel}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteDialog
        itemName={tables?.find(t => t.id === deleteConfirmTableId)?.tableName}
        isPending={deleteMutation.isPending}
        isOpen={!!deleteConfirmTableId}
        errorMessage={deleteMutation.error?.message}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteConfirmTableId(null)}
      />

      {/* Create Button - only visible to managers */}
      {mode === 'idle' && canCreateTable && (
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
            onEdit={canEditTable ? handleEditClick : undefined}
            onDelete={canDeleteTable ? handleDeleteClick : undefined}
            disabled={isLoading || deleteConfirmTableId !== null}
          />
        ))}
      </div>
    </section>
  );
}
