'use client';

import React, { useState, useEffect } from 'react';
import { createSupabaseBrowserClient } from '../../../lib/supabase/browser';

interface AdminUserProfile {
  id: string;
  email: string;
  display_name: string;
  is_active: boolean;
  role: string;
  created_at: string;
}

export default function UsersAdminPage() {
  const [users, setUsers] = useState<AdminUserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const supabase = createSupabaseBrowserClient();
        const { data, error: err } = await supabase
          .from('profiles')
          .select(`
            id,
            display_name,
            avatar_url,
            is_active,
            created_at,
            admin_roles (role)
          `);

        if (err) throw err;

        const formatted = (data || []).map((u: any) => ({
          id: u.id,
          email: u.display_name,
          display_name: u.display_name,
          is_active: u.is_active,
          role: u.admin_roles?.[0]?.role || 'viewer',
          created_at: u.created_at,
        }));
        setUsers(formatted);
      } catch (err: any) {
        setError(err.message || 'Failed to load admin users');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="space-y-6">
      <div className="bg-white p-4 sm:p-5 border border-gray-200 shadow-2xs rounded-xs">
        <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight font-serif">
          Admin Team &amp; Role Management
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
          Role-Based Access Control (RBAC): superadmin, admin, editor, and viewer permissions.
        </p>
      </div>

      {loading ? (
        <div className="p-12 text-center text-gray-500 font-semibold bg-white border border-gray-200">
          Loading users...
        </div>
      ) : error ? (
        <div className="p-4 bg-red-50 text-red-600 border border-red-200">{error}</div>
      ) : (
        <div className="bg-white border border-gray-200 shadow-2xs rounded-xs overflow-hidden">
          <table className="w-full text-xs sm:text-sm text-left border-collapse">
            <thead>
              <tr className="bg-gray-100 text-gray-800 border-b border-gray-200">
                <th className="p-3 font-bold uppercase">Admin User</th>
                <th className="p-3 font-bold uppercase">Role</th>
                <th className="p-3 font-bold uppercase">Status</th>
                <th className="p-3 font-bold uppercase">Joined Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-3 font-bold text-gray-900">
                    <div>{user.display_name}</div>
                    <div className="text-xs text-gray-400 font-mono">{user.id}</div>
                  </td>
                  <td className="p-3">
                    <span className={`px-2.5 py-0.5 text-[11px] font-black uppercase rounded-xs ${
                      user.role === 'superadmin'
                        ? 'bg-purple-100 text-purple-800 border border-purple-300'
                        : user.role === 'admin'
                        ? 'bg-blue-100 text-blue-800 border border-blue-300'
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 text-xs font-bold rounded-xs ${
                      user.is_active ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {user.is_active ? 'Active' : 'Disabled'}
                    </span>
                  </td>
                  <td className="p-3 text-gray-500 text-xs">
                    {new Date(user.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}

              {users.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-gray-500">
                    No admin users registered in database.
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
