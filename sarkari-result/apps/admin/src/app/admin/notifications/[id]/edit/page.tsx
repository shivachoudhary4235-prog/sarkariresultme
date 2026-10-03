'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { adminApi } from '../../../../../lib/api/adminApi';
import { NotificationEditor } from '../../../../../components/NotificationEditor';
import type { NotificationItem } from '@sarkari/shared-types';

export default function EditNotificationPage() {
  const params = useParams();
  const id = params?.id as string;

  const [notification, setNotification] = useState<NotificationItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    const fetchItem = async () => {
      try {
        setLoading(true);
        const data = await adminApi.notifications.getById(id);
        setNotification(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load notification');
      } finally {
        setLoading(false);
      }
    };
    fetchItem();
  }, [id]);

  if (loading) {
    return (
      <div className="p-12 text-center text-gray-500 font-semibold bg-white border border-gray-200">
        Loading notification data...
      </div>
    );
  }

  if (error || !notification) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 text-red-700 text-sm font-semibold">
        {error || 'Notification not found'}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white p-4 sm:p-5 border border-gray-200 shadow-2xs rounded-xs">
        <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight font-serif">
          Edit Notification
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
          Editing: {notification.title}
        </p>
      </div>

      <NotificationEditor initialData={notification} isEdit={true} />
    </div>
  );
}
