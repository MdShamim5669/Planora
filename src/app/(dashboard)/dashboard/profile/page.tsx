'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import api from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import toast from 'react-hot-toast';
import { User, Phone, Bell, Shield, Calendar } from 'lucide-react';
import { formatDate } from '@/lib/utils';

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function ProfileSettingsPage() {
  const { user, refreshUser } = useAuth();
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isUpdatingNotifications, setIsUpdatingNotifications] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(user?.notificationsEnabled ?? true);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: '',
      phone: '',
    },
  });

  useEffect(() => {
    if (user) {
      reset({
        name: user.name,
        phone: user.phone || '',
      });
      setNotificationsEnabled(user.notificationsEnabled);
    }
  }, [user, reset]);

  const onProfileSubmit = async (values: ProfileFormValues) => {
    setIsUpdatingProfile(true);
    try {
      await api.patch('/users/me', {
        name: values.name,
        phone: values.phone?.trim() || null,
      });
      toast.success('Profile updated successfully');
      await refreshUser();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const toggleNotifications = async () => {
    const nextState = !notificationsEnabled;
    setIsUpdatingNotifications(true);
    try {
      await api.patch('/users/me/notifications', { notificationsEnabled: nextState });
      setNotificationsEnabled(nextState);
      toast.success(nextState ? 'Email notifications enabled' : 'Notifications disabled');
      await refreshUser();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update notification settings');
    } finally {
      setIsUpdatingNotifications(false);
    }
  };

  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-foreground tracking-tight">Account & Profile Settings</h1>
        <p className="text-sm text-muted">Manage your personal details and communication preferences.</p>
      </div>

      {/* Profile Info Form */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-border shadow-xs">
        <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
          <User className="w-5 h-5 text-primary" /> Personal Information
        </h2>

        <form onSubmit={handleSubmit(onProfileSubmit)} className="space-y-4">
          <Input
            label="Full Name"
            placeholder="Your name"
            error={errors.name?.message}
            {...register('name')}
          />

          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              Email Address (Cannot be changed)
            </label>
            <input
              type="email"
              disabled
              value={user?.email || ''}
              className="w-full px-3.5 py-2 text-sm bg-slate-100 border border-border rounded-lg text-muted cursor-not-allowed"
            />
          </div>

          <Input
            label="Phone Number"
            type="tel"
            placeholder="017XXXXXXXX"
            leftIcon={<Phone className="w-4 h-4" />}
            error={errors.phone?.message}
            {...register('phone')}
          />

          <div className="pt-2">
            <Button type="submit" isLoading={isUpdatingProfile}>
              Save Profile Changes
            </Button>
          </div>
        </form>
      </div>

      {/* Notifications Preference */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-border shadow-xs">
        <h2 className="text-lg font-bold text-foreground mb-1 flex items-center gap-2">
          <Bell className="w-5 h-5 text-primary" /> Notification Preferences
        </h2>
        <p className="text-sm text-muted mb-6">
          Receive email updates when your registration is approved, rejected, or when someone invites you.
        </p>

        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-border">
          <div>
            <p className="text-sm font-semibold text-foreground">Event Notifications</p>
            <p className="text-xs text-muted">Send me emails regarding participant status and invitations.</p>
          </div>

          <button
            type="button"
            onClick={toggleNotifications}
            disabled={isUpdatingNotifications}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
              notificationsEnabled ? 'bg-primary' : 'bg-slate-300'
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                notificationsEnabled ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Account Info Meta */}
      <div className="bg-white p-6 rounded-2xl border border-border shadow-xs text-xs text-muted flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-1.5">
          <Shield className="w-4 h-4 text-purple-600" />
          <span>Role: <strong className="text-foreground">{user?.role}</strong></span>
        </div>
        <div className="flex items-center gap-1.5">
          <Calendar className="w-4 h-4 text-slate-400" />
          <span>Member since: {formatDate(user?.createdAt, 'MMMM yyyy')}</span>
        </div>
      </div>
    </div>
  );
}
