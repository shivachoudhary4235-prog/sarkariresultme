'use client';

import React, { useState, useEffect } from 'react';
import { adminApi } from '../../../lib/api/adminApi';
import type { AuditLog } from '@sarkari/shared-types';

export default function AuditLogsAdminPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        setLoading(true);
        const data = await adminApi.auditLogs.list();
        setLogs(data || []);
      } catch (err: any) {
        setError(err.message || 'Failed to load audit logs');
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  return (
    <div className="space-y-6">
      <div className="bg-white p-4 sm:p-5 border border-gray-200 shadow-2xs rounded-xs">
        <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight font-serif">
          Security &amp; Mutation Audit Trail
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
          Immutable audit record of every administrative action, publishing event, and deletion.
        </p>
      </div>

      {loading ? (
        <div className="p-12 text-center text-gray-500 font-semibold bg-white border border-gray-200">
          Loading audit trail...
        </div>
      ) : error ? (
        <div className="p-4 bg-red-50 text-red-600 border border-red-200">{error}</div>
      ) : (
        <div className="bg-white border border-gray-200 shadow-2xs rounded-xs overflow-hidden">
          <table className="w-full text-xs sm:text-sm text-left border-collapse">
            <thead>
              <tr className="bg-gray-100 text-gray-800 border-b border-gray-200">
                <th className="p-3 font-bold uppercase">Timestamp</th>
                <th className="p-3 font-bold uppercase">Admin User</th>
                <th className="p-3 font-bold uppercase">Action</th>
                <th className="p-3 font-bold uppercase">Entity</th>
                <th className="p-3 font-bold uppercase">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 font-mono text-xs">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-3 text-gray-500 whitespace-nowrap">
                    {new Date(log.createdAt).toLocaleString()}
                  </td>
                  <td className="p-3 text-gray-900 font-sans font-bold">
                    {log.actorEmail || log.actorUserId}
                  </td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded-xs font-bold uppercase ${
                      log.action.includes('DELETE') || log.action.includes('TRASH')
                        ? 'bg-red-100 text-red-800'
                        : log.action.includes('CREATE') || log.action.includes('PUBLISH')
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {log.action}
                    </span>
                  </td>
                  <td className="p-3 text-gray-700 font-sans">
                    {log.resourceType} ({((log.resourceId as string) || '').slice(0, 8)}...)
                  </td>
                  <td className="p-3 text-gray-600 max-w-xs truncate">
                    {JSON.stringify(log.afterData || log.beforeData || {})}
                  </td>
                </tr>
              ))}

              {logs.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-500 font-sans">
                    No administrative audit logs recorded yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
