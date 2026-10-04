'use client';

import React from 'react';
import { Modal } from './Modal';
import { Button } from './Button';
import { AlertTriangle } from 'lucide-react';

export interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDestructive?: boolean;
  isLoading?: boolean;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  isDestructive = false,
  isLoading = false,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-md">
      <div className="flex items-start gap-4">
        {isDestructive && (
          <div className="w-10 h-10 rounded-full bg-red-100 text-destructive flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
        )}
        <div className="flex-1">
          <h3 className="text-lg font-bold text-foreground">{title}</h3>
          <p className="mt-2 text-sm text-muted">{message}</p>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-end gap-3">
        <Button variant="outline" onClick={onClose} disabled={isLoading}>
          {cancelLabel}
        </Button>
        <Button
          variant={isDestructive ? 'danger' : 'primary'}
          onClick={onConfirm}
          isLoading={isLoading}
        >
          {confirmLabel}
        </Button>
      </div>
    </Modal>
  );
};
