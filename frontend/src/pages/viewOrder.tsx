import React, { useState } from 'react';
import { Link } from 'wouter';
import useOrders from '@/hooks/useOrders';
import { ActionMenu } from '@/components/ActionMenu';
import { DeleteDialog } from '@/components/DeleteDialog';

function formatTimeSince(dateString: string): string {
  const now = new Date();
  const then = new Date(dateString);
  const diffMs = now.getTime() - then.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return '< 1 min ago';
  if (diffMins < 60) return `${diffMins} min ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${diffDays}d ago`;
}

export default function ViewOrder() {
  const [activeTab, setActiveTab] = useState<'ongoing' | 'completed'>('ongoing');
  const [deleteTarget, setDeleteTarget] = useState<any | null>(null);
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
          displayOrders.map((order: any) => (
            <article key={order.id} className="round border padding row top-align">
              <div className="max">
                <h6 className="no-margin">Order #{order.id}</h6>
                <p className="no-margin" style={{ marginTop: '0.25rem', fontSize: '0.9rem' }}>
                  <span className="bold">Table:</span> {order.table?.tableName || 'N/A'}
                </p>
                <p className="no-margin" style={{ fontSize: '0.9rem' }}>
                  <span className="bold">Created by:</span> {order.user?.name || 'N/A'}
                </p>
                <p className="no-margin" style={{ fontSize: '0.9rem' }}>
                  <span className="bold">Created:</span> {formatTimeSince(order.created_at)}
                </p>
                <p className="no-margin" style={{ fontSize: '0.9rem' }}>
                  <span className="bold">Total:</span> ${order.total?.toFixed(2) || '0.00'}
                </p>
              </div>

              <ActionMenu
                onEdit={() => {
                  window.location.href = `/orders/${order.id}`;
                }}
                onDelete={() => setDeleteTarget(order)}
                ariaLabel={`Actions for Order #${order.id}`}
              />
            </article>
          ))
        )}
      </div>

      <DeleteDialog
        itemName={`Order #${deleteTarget?.id}`}
        isPending={hook.isDeleting}
        isOpen={!!deleteTarget}
        onConfirm={() => {
          hook.deleteOrder(deleteTarget!.id);
          setDeleteTarget(null);
        }}
        onCancel={() => setDeleteTarget(null)}
      />
    </section>
  );
}
