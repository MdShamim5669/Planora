'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import Button from '@/components/ui/Button';

function CancelContent() {
  const searchParams = useSearchParams();
  const tranId = searchParams.get('tran_id') || 'N/A';

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-slate-100 p-8 text-center animate-fade-in">
        <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertCircle className="w-10 h-10" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Payment Cancelled</h1>
        <p className="text-slate-600 mb-6 text-sm">
          You cancelled the checkout session. No funds were debited from your account.
        </p>

        {tranId !== 'N/A' && (
          <div className="bg-slate-50 rounded-xl p-4 mb-6 text-left border border-slate-100">
            <div className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-1">
              Reference ID
            </div>
            <div className="font-mono text-sm font-semibold text-slate-800 break-all">
              {tranId}
            </div>
          </div>
        )}

        <div className="flex flex-col gap-3">
          <Link href="/events">
            <Button className="w-full flex items-center justify-center gap-2">
              <ArrowLeft className="w-4 h-4" /> Back to Events
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button variant="outline" className="w-full">
              Go to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function PaymentCancelPage() {
  return (
    <Suspense fallback={<div className="min-h-[70vh] flex items-center justify-center">Loading status...</div>}>
      <CancelContent />
    </Suspense>
  );
}
