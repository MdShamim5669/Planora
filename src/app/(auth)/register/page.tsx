'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import toast from 'react-hot-toast';
import { Mail, Lock, User, Phone, ArrowRight } from 'lucide-react';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(80, 'Name must not exceed 80 characters'),
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  phone: z.string().optional(),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[A-Za-z])(?=.*\d)/, 'Password must contain at least one letter and one number'),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const { register: registerAuth } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      password: '',
    },
  });

  const onSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true);
    try {
      await registerAuth(data);
      toast.success('Account created successfully! Welcome to Planora.');
      router.push('/dashboard');
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to create account. Please try again.';
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-foreground tracking-tight">Create your account</h2>
        <p className="mt-1 text-sm text-muted">Join events or host your own community gatherings</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Full name"
          type="text"
          placeholder="e.g. Tanvir Ahmed"
          leftIcon={<User className="w-4 h-4" />}
          error={errors.name?.message}
          {...register('name')}
        />

        <Input
          label="Email address"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          leftIcon={<Mail className="w-4 h-4" />}
          error={errors.email?.message}
          {...register('email')}
        />

        <Input
          label="Phone number (optional)"
          type="tel"
          placeholder="017XXXXXXXX"
          leftIcon={<Phone className="w-4 h-4" />}
          error={errors.phone?.message}
          {...register('phone')}
        />

        <Input
          label="Password"
          type="password"
          placeholder="At least 8 characters with letter & number"
          autoComplete="new-password"
          leftIcon={<Lock className="w-4 h-4" />}
          error={errors.password?.message}
          helperText="Must be 8+ characters, including letters and numbers"
          {...register('password')}
        />

        <Button type="submit" className="w-full mt-2" isLoading={isLoading} rightIcon={<ArrowRight className="w-4 h-4" />}>
          Create Account
        </Button>
      </form>

      <div className="mt-6 text-center text-sm text-muted">
        Already have an account?{' '}
        <Link href="/login" className="font-semibold text-primary hover:text-primary-hover">
          Sign in
        </Link>
      </div>
    </div>
  );
}
