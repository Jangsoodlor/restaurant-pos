import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { orderApiClient } from '@/api/client';
import type { Order, OrderUpdate, OrderStatus } from '@/api/stub';
import { useMemo, useState } from 'react';

const ORDERS_QUERY_KEY = ['orders'];

export default function useOrders() {
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState<OrderStatus | null>(null);
  const [tableIdFilter, setTableIdFilter] = useState<number | null>(null);

  // Fetch orders
  const { data: orders = [], isLoading, isError, error } = useQuery<Order[]>({
    queryKey: ORDERS_QUERY_KEY,
    queryFn: () =>
      orderApiClient.listOrdersOrderGet({
        status: statusFilter || undefined,
        tableId: tableIdFilter || undefined,
      }),
  });

  // Create order - accepts full payload with enriched lineItems containing all required fields
  // lineItems should be: {menuItemId, quantity, modifiers?, itemName, unitPrice}
  const createMutation = useMutation({
    mutationFn: async (payload: {
      table_id: number;
      user_id: number;
      lineItems: Array<{
        menuItemId: number;
        quantity: number;
        modifiers?: number[];
        itemName: string;
        unitPrice: number;
      }>;
    }) => {
      // Transform to API format: backend creates order then we add line items
      const lineItemsForApi = payload.lineItems.map(item => ({
        orderId: 0, // will be set by backend
        menuItemId: item.menuItemId,
        itemName: item.itemName,
        unitPrice: item.unitPrice,
        quantity: item.quantity,
        modifierIds: item.modifiers,
      }));

      return orderApiClient.createOrderOrderPost({
        bodyCreateOrderOrderPost: {
          order: {
            tableId: payload.table_id,
            userId: payload.user_id,
          },
          orderLineItems: lineItemsForApi,
        },
      });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ORDERS_QUERY_KEY }),
  });

  // Update order
  const updateMutation = useMutation({
    mutationFn: ({ orderId, orderUpdate }: { orderId: number; orderUpdate: OrderUpdate }) =>
      orderApiClient.partialUpdateOrderOrderOrderIdPatch({ orderId, orderUpdate }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ORDERS_QUERY_KEY }),
  });

  // Delete order
  const deleteMutation = useMutation({
    mutationFn: (orderId: number) =>
      orderApiClient.deleteOrderOrderOrderIdDelete({ orderId }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ORDERS_QUERY_KEY }),
  });

  // Group by status for tabs
  const groupedOrders = useMemo(() => {
    const ongoing = orders.filter((o) => o.status === 'draft' || o.status === 'in_progress');
    const completed = orders.filter((o) => o.status === 'completed' || o.status === 'cancelled');
    return { ongoing, completed };
  }, [orders]);

  return {
    orders,
    groupedOrders,
    isLoading,
    isError,
    error,
    statusFilter,
    setStatusFilter,
    tableIdFilter,
    setTableIdFilter,
    createOrder: createMutation.mutate,
    isCreating: createMutation.isPending,
    updateOrder: updateMutation.mutate,
    isUpdating: updateMutation.isPending,
    deleteOrder: deleteMutation.mutate,
    isDeleting: deleteMutation.isPending,
  };
}
