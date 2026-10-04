'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Mail, Send } from 'lucide-react';
import api from '@/lib/api';
import toast from 'react-hot-toast';

interface InviteUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventId: string;
  onSuccess: () => void;
}

export const InviteUserModal: React.FC<InviteUserModalProps> = ({
  isOpen,
  onClose,
  eventId,
  onSuccess,
}) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    try {
      await api.post(`/events/${eventId}/invitations`, { email: email.trim().toLowerCase() });
      toast.success(`Invitation sent to ${email}!`);
      setEmail('');
      onSuccess();
      onClose();
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to send invitation';
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Invite Attendee by Email"
      description="Send a direct invitation to an attendee. They will see it in their Invitations dashboard."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Invitee's Registered Email"
          type="email"
          placeholder="colleague@example.com"
          leftIcon={<Mail className="w-4 h-4" />}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
          <Button variant="outline" type="button" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isLoading} rightIcon={<Send className="w-4 h-4" />}>
            Send Invite
          </Button>
        </div>
      </form>
    </Modal>
  );
};
