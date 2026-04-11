import { userApiClient } from "api/client";
import { useQuery } from '@tanstack/react-query'

export function Users() {

  const { data: users, isPending, error } = useQuery(
    {
      queryKey: ['users'],
      queryFn: () => userApiClient.listUsersUserGet()
    }
  )

  if (error) {
    return (
      <p style={{ color: 'red' }}>Error: {error.message}</p>
    )
  }

  if (isPending) {
    return (
      <p style={{ color: 'yellow' }}>Loading...</p>
    )
  }

  if (users?.length === 0) {
    return (
      <p>No users found</p>
    )
  }
  return (
    <div>
      {users.map(user => <p key={user.id}>{user.name}</p>)}
    </div>
  )

}