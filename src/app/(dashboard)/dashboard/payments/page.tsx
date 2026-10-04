'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { Payment, ApiResponse } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { formatDate, formatCurrency } from '@/lib/utils';
import { CreditCard, CheckCircle2, ShieldCheck } from 'lucide-react';

export default function MyPaymentsPage() {
  const { data: payments, isLoading } = useQuery({
    queryKey: ['my-payments'],
    queryFn: async () => {
      const res = await api.get<ApiResponse<Payment[]>>('/payments/mine');
      return res.data.data || [];
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground tracking-tight">Payment Records</h1>
        <p className="text-sm text-muted">Review your SSLCommerz payment transactions and registration receipts.</p>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 bg-white rounded-2xl border border-border animate-pulse" />
          ))}
        </div>
      ) : payments?.length === 0 ? (
        <EmptyState
          icon={<CreditCard className="w-7 h-7" />}
          title="No payment records found"
          description="When you register for paid events, transaction details and receipts will be stored here."
        />
      ) : (
        <div className="bg-white rounded-2xl border border-border shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-xs text-muted uppercase bg-slate-50 border-b border-border">
                <tr>
                  <th className="px-6 py-3.5">Transaction ID</th>
                  <th className="px-6 py-3.5">Event</th>
                  <th className="px-6 py-3.5">Amount</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5">Gateway</th>
                  <th className="px-6 py-3.5">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {payments?.map((pay) => (
                  <tr key={pay.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-mono text-xs font-semibold text-foreground">
                      {pay.tranId}
                    </td>
                    <td className="px-6 py-4 font-medium text-foreground max-w-xs truncate">
                      {pay.eventTitle}
                    </td>
                    <td className="px-6 py-4 font-bold text-foreground">
                      {formatCurrency(pay.amount)}
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant="status" status={pay.status} />
                    </td>
                    <td className="px-6 py-4 text-xs font-medium text-slate-500">
                      <span className="inline-flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5 text-primary" />
                        {pay.gateway}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-muted">
                      {formatDate(pay.paidAt || pay.createdAt, 'MMM d, yyyy h:mm a')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
