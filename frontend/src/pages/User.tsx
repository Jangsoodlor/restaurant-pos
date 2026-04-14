import React, { useState } from 'react';
import { useUser } from '../hooks/useUser';
import { ListControls } from '../components/ListControls';
import { ActionMenu } from '../components/ActionMenu';
import { EntityForm, type FormField, type InteractionMode as FormMode } from '../components/EntityForm';
import { DeleteDialog } from '../components/DeleteDialog';
import { Role, type UserUpdate } from '../api/stub/models';

type InteractionMode = 'idle' | 'editing';

// Field descriptors for user entity
const USER_FIELDS: FormField[] = [
  {
    name: 'name',
    label: 'Full Name',
    type: 'text',
    required: true,
  },
  {
    name: 'role',
    label: 'Role',
    type: 'select',
    required: true,
    options: [
      { label: 'Manager', value: Role.Manager },
      { label: 'Waiter', value: Role.Waiter },
      { label: 'Cook', value: Role.Cook },
    ],
  },
];

export function UserManagementPage() {
  const {
    users,
    isLoading,
    isError,
    filterRole,
    setFilterRole,
    sortOrder,
    setSortOrder,
    deleteUser,
    isDeleting,
    deleteError,
    updateUser,
    isUpdating,
    updateError,
  } = useUser();

  const [mode, setMode] = useState<InteractionMode>('idle');
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [formValues, setFormValues] = useState<Record<string, any>>({
    name: '',
    role: Role.Waiter,
  });
  const [formError, setFormError] = useState<string | null>(null);
  const [deleteConfirmUserId, setDeleteConfirmUserId] = useState<number | null>(null);

  const handleEdit = (userId: number) => {
    const user = users.find(u => u.id === userId);
    if (user) {
      setSelectedUserId(userId);
      setFormValues({ name: user.name, role: user.role });
      setFormError(null);
      setMode('editing');
    }
  };

  const validateForm = (): boolean => {
    if (!formValues.name?.toString().trim()) {
      setFormError('Name is required');
      return false;
    }
    if (!formValues.role) {
      setFormError('Role is required');
      return false;
    }
    setFormError(null);
    return true;
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      if (mode === 'editing' && selectedUserId) {
        const userUpdate: UserUpdate = {
          name: formValues.name,
          role: formValues.role,
        };
        await new Promise((resolve, reject) => {
          updateUser(
            { userId: selectedUserId, userUpdate },
            {
              onSuccess: resolve,
              onError: reject,
            }
          );
        });
        setMode('idle');
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Operation failed';
      setFormError(errorMsg);
    }
  };

  const handleCancel = () => {
    setMode('idle');
    setSelectedUserId(null);
    setFormValues({ name: '', role: Role.Waiter });
    setFormError(null);
    setDeleteConfirmUserId(null);
  };

  const handleDeleteClick = (userId: number) => {
    setDeleteConfirmUserId(userId);
  };

  const handleConfirmDelete = async () => {
    if (!deleteConfirmUserId) return;
    try {
      await new Promise((resolve, reject) => {
        deleteUser(deleteConfirmUserId, {
          onSuccess: resolve,
          onError: reject,
        });
      });
      setDeleteConfirmUserId(null);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Delete failed';
      setFormError(errorMsg);
    }
  };

  const isFormLoading = isUpdating || isLoading;
  const formErrorMessage =
    formError || updateError?.message;

  if (isLoading) return <div>Loading users...</div>;
  if (isError) return <div>Error loading users.</div>;

  const deleteUserName = users.find(u => u.id === deleteConfirmUserId)?.name;

  return (
    <div className="container padding">
      <h2>Manage Users</h2>

      <div style={{ marginBottom: '2rem' }}>
        <ListControls
          filterLabel="Role Filter"
          sortLabel="Sort By Name"
          filterValue={filterRole}
          onFilterChange={(val) => setFilterRole(val as any)}
          filterOptions={[
            { label: 'All Roles', value: 'all' },
            { label: 'Manager', value: Role.Manager },
            { label: 'Waiter', value: Role.Waiter },
            { label: 'Cook', value: Role.Cook },
          ]}
          sortValue={sortOrder}
          onSortChange={(val) => setSortOrder(val as any)}
          sortOptions={[
            { label: 'Name (A to Z)', value: 'asc' },
            { label: 'Name (Z to A)', value: 'desc' },
          ]}
        />
      </div>

      {/* Create/Edit Mode Form */}
      <EntityForm
        mode={mode as FormMode}
        title="Edit User"
        fields={USER_FIELDS}
        values={formValues}
        isLoading={isFormLoading}
        isOpen={mode === 'editing'}
        errorMessage={formErrorMessage}
        onChange={setFormValues}
        onSubmit={handleFormSubmit}
        onCancel={handleCancel}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteDialog
        itemName={deleteUserName}
        isPending={isDeleting}
        isOpen={!!deleteConfirmUserId}
        errorMessage={deleteError?.message}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteConfirmUserId(null)}
      />

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {users.map((user) => (
          <article
            key={user.id}
            className="round border padding row top-align"
          >
            <div className="max">
              <h6 className="no-margin">{user.name}</h6>
              <p className="no-margin" style={{ marginTop: '0.25rem' }}>
                <span className="bold">Role:</span> {user.role}
              </p>
            </div>

            <ActionMenu
              onEdit={() => handleEdit(user.id!)}
              onDelete={() => handleDeleteClick(user.id!)}
              ariaLabel={`User actions for ${user.name}`}
            />
          </article>
        ))}
        {users.length === 0 && (
          <div className="padding">
            No users found matching current criteria.
          </div>
        )}
      </div>
    </div>
  );
}

export default UserManagementPage;