'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Textarea';
import { StarRating } from '@/components/ui/StarRating';
import api from '@/lib/api';
import toast from 'react-hot-toast';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventId: string;
  onSuccess: () => void;
  initialRating?: number;
  initialComment?: string;
  reviewId?: string;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({
  isOpen,
  onClose,
  eventId,
  onSuccess,
  initialRating = 5,
  initialComment = '',
  reviewId,
}) => {
  const [rating, setRating] = useState<number>(initialRating);
  const [comment, setComment] = useState<string>(initialComment);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating < 1 || rating > 5) {
      toast.error('Please select a rating between 1 and 5 stars');
      return;
    }

    setIsLoading(true);
    try {
      if (reviewId) {
        // Edit existing review
        await api.patch(`/reviews/${reviewId}`, { rating, comment });
        toast.success('Review updated successfully!');
      } else {
        // Create new review
        await api.post(`/events/${eventId}/reviews`, { rating, comment });
        toast.success('Thank you! Your review has been published.');
      }
      onSuccess();
      onClose();
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to submit review';
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={reviewId ? 'Edit Your Event Review' : 'Write an Event Review'}
      description="Share your feedback to help others learn about this event."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Overall Rating
          </label>
          <StarRating rating={rating} interactive size="lg" onChange={setRating} />
        </div>

        <Textarea
          label="Your Review & Experience"
          placeholder="What did you like about the venue, speakers, organization, or sessions?"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={4}
        />

        <p className="text-xs text-muted">
          Notice: Reviews can be written after the event has started, and edited within 7 days of posting.
        </p>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
          <Button variant="outline" type="button" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isLoading}>
            {reviewId ? 'Update Review' : 'Submit Review'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
