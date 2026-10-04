'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { Event } from '@/types';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { UploadCloud, Image as ImageIcon, X, Sparkles } from 'lucide-react';

const eventSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(100, 'Title cannot exceed 100 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  eventDate: z.string().min(1, 'Event date and time is required'),
  venue: z.string().optional(),
  eventLink: z.string().optional(),
  visibility: z.enum(['PUBLIC', 'PRIVATE']),
  fee: z.coerce.number().min(0, 'Fee cannot be negative'),
});

type EventFormValues = z.infer<typeof eventSchema>;

interface CreateEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  eventToEdit?: Event | null;
}

export const CreateEventModal: React.FC<CreateEventModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  eventToEdit,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EventFormValues>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: '',
      description: '',
      eventDate: '',
      venue: '',
      eventLink: '',
      visibility: 'PUBLIC',
      fee: 0,
    },
  });

  useEffect(() => {
    if (eventToEdit) {
      // Format ISO date to YYYY-MM-DDTHH:MM for datetime-local input
      const d = new Date(eventToEdit.eventDate);
      const pad = (n: number) => n.toString().padStart(2, '0');
      const formattedDate = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;

      reset({
        title: eventToEdit.title,
        description: eventToEdit.description,
        eventDate: formattedDate,
        venue: eventToEdit.venue || '',
        eventLink: eventToEdit.eventLink || '',
        visibility: eventToEdit.visibility,
        fee: eventToEdit.fee,
      });

      setBannerPreview(eventToEdit.bannerImage || eventToEdit.imageUrl || eventToEdit.coverImage || null);
      setBannerFile(null);
    } else {
      reset({
        title: '',
        description: '',
        eventDate: '',
        venue: '',
        eventLink: '',
        visibility: 'PUBLIC',
        fee: 0,
      });
      setBannerPreview(null);
      setBannerFile(null);
    }
  }, [eventToEdit, reset, isOpen]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size exceeds 5MB limit');
        return;
      }
      setBannerFile(file);
      const localUrl = URL.createObjectURL(file);
      setBannerPreview(localUrl);
    }
  };

  const handleRemoveBanner = () => {
    setBannerFile(null);
    setBannerPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const onSubmit = async (values: EventFormValues) => {
    setIsLoading(true);
    try {
      let uploadedImageUrl: string | null = bannerPreview;

      // Cloudinary Upload Rule: ONLY upload to Cloudinary upon final form submission
      if (bannerFile) {
        toast.loading('Uploading banner to Cloudinary...', { id: 'banner-upload' });
        const formData = new FormData();
        formData.append('banner', bannerFile);

        const uploadRes = await api.post('/events/upload-banner', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        uploadedImageUrl = uploadRes.data?.data?.secure_url || uploadRes.data?.data?.url;
        toast.success('Banner uploaded to Cloudinary!', { id: 'banner-upload' });
      }

      const payload: Record<string, any> = {
        ...values,
        eventDate: new Date(values.eventDate).toISOString(),
        venue: values.venue?.trim() || null,
        eventLink: values.eventLink?.trim() || null,
        imageUrl: uploadedImageUrl,
        bannerImage: uploadedImageUrl,
      };

      if (eventToEdit) {
        await api.patch(`/events/${eventToEdit.id}`, payload);
        toast.success('Event updated successfully!');
      } else {
        await api.post('/events', payload);
        toast.success('Event created successfully!');
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to save event';
      toast.error(msg, { id: 'banner-upload' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={eventToEdit ? 'Edit Event' : 'Create a New Event'}
      description="Fill in the event details, upload ticket banner, venue, visibility, and fee structure."
      className="max-w-xl"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Banner / Ticket Image Upload Section */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
            Event Banner / Ticket Cover (Cloudinary)
          </label>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/png, image/jpeg, image/webp, image/gif"
            onChange={handleFileChange}
            className="hidden"
          />

          {bannerPreview ? (
            <div className="relative w-full h-44 rounded-2xl overflow-hidden border border-slate-200 shadow-md group">
              <img
                src={bannerPreview}
                alt="Banner preview"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-80" />

              {/* Status Chip */}
              <div className="absolute bottom-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md text-white text-[11px] font-medium border border-white/20">
                <Sparkles className="w-3 h-3 text-indigo-400" />
                <span>{bannerFile ? 'Local Preview (Uploads on Submit)' : 'Active Cloudinary Banner'}</span>
              </div>

              {/* Action Buttons */}
              <div className="absolute top-3 right-3 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-2.5 py-1 rounded-lg bg-black/70 hover:bg-black/90 text-white text-xs font-medium backdrop-blur-md border border-white/20 transition-all cursor-pointer"
                >
                  Change
                </button>
                <button
                  type="button"
                  onClick={handleRemoveBanner}
                  className="p-1 rounded-lg bg-rose-600/90 hover:bg-rose-700 text-white transition-all cursor-pointer shadow-md"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="w-full h-36 rounded-2xl border-2 border-dashed border-slate-300 hover:border-indigo-500 bg-slate-50/80 hover:bg-indigo-50/20 transition-all flex flex-col items-center justify-center gap-2 cursor-pointer p-4 group select-none"
            >
              <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-500 group-hover:text-indigo-600 group-hover:border-indigo-300 shadow-xs transition-colors">
                <UploadCloud className="w-5 h-5" />
              </div>
              <div className="text-center">
                <p className="text-xs font-bold text-slate-700 group-hover:text-indigo-600">
                  Click to choose event banner
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  PNG, JPG, WEBP up to 5MB · Saved to Cloudinary folder (planora/events)
                </p>
              </div>
            </div>
          )}
        </div>

        <Input
          label="Event Title"
          placeholder="e.g. Dhaka Tech Summit 2026"
          error={errors.title?.message}
          {...register('title')}
        />

        <Textarea
          label="Description"
          placeholder="Describe the agenda, speakers, who should attend, and highlights..."
          error={errors.description?.message}
          rows={3}
          {...register('description')}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Date & Time"
            type="datetime-local"
            error={errors.eventDate?.message}
            {...register('eventDate')}
          />

          <Input
            label="Fee in BDT (0 for Free)"
            type="number"
            min="0"
            step="1"
            placeholder="0"
            error={errors.fee?.message}
            {...register('fee')}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Visibility"
            options={[
              { value: 'PUBLIC', label: 'Public (Visible in catalog)' },
              { value: 'PRIVATE', label: 'Private (Masked details & Invite only)' },
            ]}
            error={errors.visibility?.message}
            {...register('visibility')}
          />

          <Input
            label="Online Session Link (Optional)"
            placeholder="https://meet.google.com/..."
            error={errors.eventLink?.message}
            {...register('eventLink')}
          />
        </div>

        <Input
          label="Physical Venue (Optional if Online)"
          placeholder="e.g. Bangabandhu International Conference Center, Dhaka"
          error={errors.venue?.message}
          {...register('venue')}
        />

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
          <Button variant="outline" type="button" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isLoading}>
            {eventToEdit ? 'Save Changes' : 'Create Event'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
