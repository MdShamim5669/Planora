'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import toast from 'react-hot-toast';
import { Mail, Lock, ArrowRight, ShieldCheck } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

function LoginForm() {
  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/dashboard';
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    try {
      await login(data.email, data.password);
      toast.success('Welcome back to Planora!');
      router.push(redirect);
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Invalid email or password';
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const fillDemo = (email: string, pass: string) => {
    setValue('email', email, { shouldValidate: true });
    setValue('password', pass, { shouldValidate: true });
  };

  return (
    <div>
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-foreground tracking-tight">Sign in to your account</h2>
        <p className="mt-1 text-sm text-muted">Manage your events, passes, and registrations</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
          label="Password"
          type="password"
          placeholder="••••••••"
          autoComplete="current-password"
          leftIcon={<Lock className="w-4 h-4" />}
          error={errors.password?.message}
          {...register('password')}
        />

        <Button type="submit" className="w-full mt-2" isLoading={isLoading} rightIcon={<ArrowRight className="w-4 h-4" />}>
          Sign In
        </Button>
      </form>

      {/* Quick Demo Credentials for Evaluation */}
      <div className="mt-6 pt-5 border-t border-border">
        <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-primary" />
          Quick Test Credentials
        </p>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => fillDemo('Tamjisulislamsamim@gmail.com', 'Samim5669')}
            className="text-left p-2 rounded-lg bg-slate-50 hover:bg-slate-100 border border-border text-xs transition-colors"
          >
            <p className="font-semibold text-purple-700">👑 Admin</p>
            <p className="text-muted truncate">tamjisul...samim@gmail.com</p>
          </button>
          <button
            type="button"
            onClick={() => fillDemo('tanvir.dev@gmail.com', 'User1234!')}
            className="text-left p-2 rounded-lg bg-slate-50 hover:bg-slate-100 border border-border text-xs transition-colors"
          >
            <p className="font-semibold text-primary">👤 Host (Tanvir)</p>
            <p className="text-muted truncate">tanvir.dev@gmail.com</p>
          </button>
        </div>
      </div>

      <div className="mt-6 text-center text-sm text-muted">
        Don&apos;t have an account?{' '}
        <Link href="/register" className="font-semibold text-primary hover:text-primary-hover">
          Sign up now
        </Link>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-sm text-muted">Loading login...</div>}>
      <LoginForm />
    </Suspense>
  );
}
