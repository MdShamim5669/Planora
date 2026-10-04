'use client';

import React, { useState } from 'react';
import { Review } from '@/types';
import { StarRating } from '@/components/ui/StarRating';
import { Button } from '@/components/ui/Button';
import { formatDate } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import { ReviewModal } from './ReviewModal';
import { Edit2, Trash2 } from 'lucide-react';
import api from '@/lib/api';
import toast from 'react-hot-toast';

interface ReviewListProps {
  eventId: string;
  reviews?: Review[] | { reviews?: Review[]; [key: string]: any };
  avgRating?: number;
  totalReviews?: number;
  onRefresh: () => void;
  canWriteReview?: boolean;
}

export const ReviewList: React.FC<ReviewListProps> = ({
  eventId,
  reviews = [],
  avgRating = 0,
  totalReviews = 0,
  onRefresh,
  canWriteReview = false,
}) => {
  const { user } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingReview, setEditingReview] = useState<Review | null>(null);

  const reviewList: Review[] = Array.isArray(reviews)
    ? reviews
    : Array.isArray((reviews as any)?.reviews)
    ? (reviews as any).reviews
    : [];

  const handleDelete = async (reviewId: string) => {
    if (!confirm('Are you sure you want to delete this review?')) return;
    try {
      await api.delete(`/reviews/${reviewId}`);
      toast.success('Review deleted');
      onRefresh();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to delete review');
    }
  };

  const isEligibleForEdit = (createdAt: string) => {
    const diffDays = (Date.now() - new Date(createdAt).getTime()) / (1000 * 60 * 60 * 24);
    return diffDays <= 7;
  };

  return (
    <div className="bg-white rounded-2xl border border-border p-6 md:p-8 mt-10 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border">
        <div>
          <h3 className="text-xl font-bold text-foreground">Attendee Reviews</h3>
          <div className="flex items-center gap-3 mt-1.5">
            <StarRating rating={Math.round(avgRating)} size="md" />
            <span className="text-sm font-semibold text-slate-700">
              {avgRating > 0 ? avgRating.toFixed(1) : 'No reviews yet'}
            </span>
            {totalReviews > 0 && (
              <span className="text-xs text-muted">({totalReviews} total)</span>
            )}
          </div>
        </div>

        {canWriteReview && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setEditingReview(null);
              setModalOpen(true);
            }}
          >
            Write a Review
          </Button>
        )}
      </div>

      {reviewList.length === 0 ? (
        <div className="py-12 text-center">
          <p className="text-sm text-muted">No reviews yet.</p>
          <p className="text-xs text-muted/70 mt-1">
            Reviews can be written after the event has started, and edited within 7 days of posting.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-border">
          {reviewList.map((rev) => {
            const isAuthor = user && user.id === rev.userId;
            const canEdit = isAuthor && isEligibleForEdit(rev.createdAt);

            return (
              <div key={rev.id} className="py-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-xs text-slate-700">
                      {rev.user?.name ? rev.user.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-foreground">
                        {rev.user?.name || 'Verified Attendee'}
                      </h4>
                      <p className="text-xs text-muted">{formatDate(rev.createdAt, 'MMM d, yyyy')}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <StarRating rating={rev.rating} size="sm" />
                    {canEdit && (
                      <div className="flex items-center gap-1 ml-2">
                        <button
                          onClick={() => {
                            setEditingReview(rev);
                            setModalOpen(true);
                          }}
                          className="p-1 text-muted hover:text-primary rounded hover:bg-slate-100"
                          title="Edit Review"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(rev.id)}
                          className="p-1 text-muted hover:text-destructive rounded hover:bg-red-50"
                          title="Delete Review"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {rev.comment && (
                  <p className="mt-3 text-sm text-slate-600 leading-relaxed pl-11">
                    {rev.comment}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}

      {modalOpen && (
        <ReviewModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          eventId={eventId}
          onSuccess={onRefresh}
          reviewId={editingReview?.id}
          initialRating={editingReview?.rating || 5}
          initialComment={editingReview?.comment || ''}
        />
      )}
    </div>
  );
};
