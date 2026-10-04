'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { User, ApiResponse } from '@/types';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { formatDate } from '@/lib/utils';
import { Search, Shield, UserCheck, ChevronLeft, ChevronRight } from 'lucide-react';

export default function AdminUsersPage() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, isLoading } = useQuery({
    queryKey: ['admin-users', search, page],
    queryFn: async () => {
      const res = await api.get<ApiResponse<User[]>>('/admin/users', {
        params: { search: search || undefined, page, limit },
      });
      return res.data;
    },
  });

  const users = data?.data || [];
  const meta = data?.meta;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground tracking-tight">User Directory</h1>
        <p className="text-sm text-muted">View all platform members, active hosts, and administrators.</p>
      </div>

      {/* Search Input */}
      <div className="bg-white p-4 rounded-2xl border border-border">
        <Input
          placeholder="Search members by name or email..."
          leftIcon={<Search className="w-4 h-4" />}
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl border border-border shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="p-8 space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-16 bg-slate-100 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : users.length === 0 ? (
          <div className="p-8 text-center text-sm text-muted">No users found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-xs text-muted uppercase bg-slate-50 border-b border-border">
                <tr>
                  <th className="px-6 py-3.5">User</th>
                  <th className="px-6 py-3.5">Role</th>
                  <th className="px-6 py-3.5">Phone</th>
                  <th className="px-6 py-3.5">Registered</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-foreground">{u.name}</div>
                      <div className="text-xs text-muted">{u.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      {u.role === 'ADMIN' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase bg-purple-100 text-purple-800">
                          <Shield className="w-3 h-3" /> Admin
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase bg-slate-100 text-slate-700">
                          <UserCheck className="w-3 h-3 text-muted" /> Member
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-xs text-muted">
                      {u.phone || 'Not provided'}
                    </td>
                    <td className="px-6 py-4 text-xs text-muted">
                      {formatDate(u.createdAt, 'MMM d, yyyy')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {meta && meta.totalPages > 1 && (
          <div className="px-6 py-4 border-t border-border flex items-center justify-between text-xs text-muted">
            <span>
              Page {page} of {meta.totalPages} ({meta.total} registered users)
            </span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
                leftIcon={<ChevronLeft className="w-3.5 h-3.5" />}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= meta.totalPages}
                onClick={() => setPage((p) => p + 1)}
                rightIcon={<ChevronRight className="w-3.5 h-3.5" />}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
