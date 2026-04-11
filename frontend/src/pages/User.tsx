import React from 'react';
import { useUser } from '../hooks/useUser';
import { ListControls } from '../components/ListControls';
import { ActionMenu } from '../components/ActionMenu';
import { Role } from '../api/stub/models';

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
  } = useUser();

  const handleEdit = (userId: number) => {
    console.log('Edit user ID:', userId);
    alert('Edit User ID: ' + userId);
  };

  const handleDelete = (userId: number) => {
    if (confirm('Are you sure you want to delete this user?')) {
      deleteUser(userId);
    }
  };

  if (isLoading) return <div>Loading users...</div>;
  if (isError) return <div>Error loading users.</div>;

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
            { label: 'Admin/Manager', value: Role.Manager },
            { label: 'Staff/Waiter', value: Role.Waiter },
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

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {users.map((user) => (
          < article
            key={user.id}
            className="round border padding row top-align"
          >
            < div className="max" >
              <h6 className="no-margin">{user.name}</h6>
              <p className="no-margin" style={{ marginTop: '0.25rem' }}>
                <span className="bold">Role:</span> {user.role}
              </p>
            </div>

            < ActionMenu
              onEdit={() => handleEdit(user.id!)}
              onDelete={() => handleDelete(user.id!)}
              ariaLabel={`User actions for ${user.name}`}
            />
          </article>
        ))
        }
        {
          users.length === 0 && (
            <div className="padding">
              No users found matching current criteria.
            </div>
          )
        }
      </div >
    </div >
  );
}

export default UserManagementPage;