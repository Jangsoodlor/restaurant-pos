import React, { useState } from 'react';
import { Link } from 'wouter';
import useOrders from '@/hooks/useOrders';
import useOrderLineItems from '@/hooks/useOrderLineItems';
import { OrderDetailModal } from '@/components/OrderDetailModal';
import { DeleteDialog } from '@/components/DeleteDialog';
import type { Order } from '@/api/stub';

function formatTimeSince(date: Date | string | undefined): string {
  if (!date) return 'N/A';

  let then: Date;

  if (typeof date === 'string') {
    // If it comes in as a string, fix the label
    const forcedUtcString = date.replace(/ GMT.*/, ' UTC');
    then = new Date(forcedUtcString);
  } else {
    then = new Date(Date.UTC(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      date.getHours(),
      date.getMinutes(),
      date.getSeconds()
    ));
  }

  const now = new Date();
  const diffMs = now.getTime() - then.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  return `${Math.max(0, diffMins)} min ago`;
}

export default function ViewOrder() {
  const [activeTab, setActiveTab] = useState<'ongoing' | 'completed'>('ongoing');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Order | null>(null);
  const hook = useOrders();

  const displayOrders = activeTab === 'ongoing' ? hook.groupedOrders.ongoing : hook.groupedOrders.completed;

  return (
    <section>
      <header className="space">
        <nav>
          <button
            className={`button transparent ${activeTab === 'ongoing' ? 'active' : ''}`}
            onClick={() => setActiveTab('ongoing')}
          >
            Ongoing
          </button>
          <button
            className={`button transparent ${activeTab === 'completed' ? 'active' : ''}`}
            onClick={() => setActiveTab('completed')}
          >
            Completed
          </button>
        </nav>
      </header>

      <nav className="space">
        <Link href="/orders/create">
          <button className="button">Create Order</button>
        </Link>
      </nav>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {hook.isLoading ? (
          <div>Loading...</div>
        ) : displayOrders.length === 0 ? (
          <div className="padding">No orders</div>
        ) : (
          displayOrders.map((order: Order) => (
            <article
              key={order.id}
              className="round border padding row top-align"
              onClick={() => setSelectedOrder(order)}
              style={{ cursor: 'pointer' }}
            >
              <div className="max">
                <h6 className="no-margin">Order #{order.id}</h6>
                <p className="no-margin" style={{ marginTop: '0.25rem', fontSize: '0.9rem' }}>
                  <span className="bold">Table ID:</span> {order.tableId}
                </p>
                <p className="no-margin" style={{ fontSize: '0.9rem' }}>
                  <span className="bold">Waiter ID:</span> {order.userId}
                </p>
                <p className="no-margin" style={{ fontSize: '0.9rem' }}>
                  <span className="bold">Created:</span> {formatTimeSince(order.createdAt)}
                </p>
                <p className="no-margin" style={{ fontSize: '0.9rem' }}>
                  <span className="bold">Status:</span> {order.status || 'draft'}
                </p>
              </div>

              <div
                className="row"
                style={{ gap: '0.5rem' }}
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  className="button small transparent"
                  onClick={() => setDeleteTarget(order)}
                >
                  Delete
                </button>
              </div>
            </article>
          ))
        )}
      </div>

      <DeleteDialog
        itemName={`Order #${deleteTarget?.id}`}
        isPending={hook.isDeleting}
        isOpen={!!deleteTarget}
        onConfirm={() => {
          if (deleteTarget && deleteTarget.id) {
            hook.deleteOrder(deleteTarget.id);
            setDeleteTarget(null);
          }
        }}
        onCancel={() => setDeleteTarget(null)}
      />

      {/* Order Detail Modal */}
      {selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onOrderUpdate={() => {
            // Modal will refresh via useOrderLineItems query invalidation
            setSelectedOrder(null);
          }}
          onOrderDelete={(orderId) => {
            hook.deleteOrder(orderId);
            setSelectedOrder(null);
          }}
        />
      )}
    </section>
  );
}
