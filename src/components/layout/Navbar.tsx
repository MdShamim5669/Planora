'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import {
  Calendar,
  Compass,
  PlusCircle,
  User as UserIcon,
  LogOut,
  LayoutDashboard,
  ShieldAlert,
  ChevronDown,
  Menu,
  X,
  Ticket,
  Mail,
  CreditCard,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-md border-b border-border transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-accent flex items-center justify-center text-white shadow-md shadow-primary/20 group-hover:scale-105 transition-transform">
            <Calendar className="w-5 h-5" />
          </div>
          <span className="text-xl font-extrabold tracking-tight text-foreground">
            Plan<span className="text-primary">ora</span>
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-7">
          <Link
            href="/events"
            className="flex items-center gap-1.5 text-sm font-medium text-muted hover:text-primary transition-colors"
          >
            <Compass className="w-4 h-4" />
            Explore Events
          </Link>
          <Link
            href={isAuthenticated ? '/dashboard/events' : '/login'}
            className="flex items-center gap-1.5 text-sm font-medium text-muted hover:text-primary transition-colors"
          >
            <PlusCircle className="w-4 h-4" />
            Host an Event
          </Link>
        </nav>

        {/* Right Section / Auth */}
        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated && user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2.5 px-3 py-1.5 rounded-full hover:bg-slate-100 transition-colors border border-border"
              >
                <div className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs uppercase">
                  {user.name.charAt(0)}
                </div>
                <span className="text-sm font-medium text-foreground max-w-[120px] truncate">
                  {user.name}
                </span>
                <ChevronDown className="w-4 h-4 text-muted" />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-border py-1.5 z-50 animate-in fade-in zoom-in-95">
                  <div className="px-4 py-2.5 border-b border-border">
                    <p className="text-sm font-semibold text-foreground truncate">{user.name}</p>
                    <p className="text-xs text-muted truncate">{user.email}</p>
                    {user.role === 'ADMIN' && (
                      <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-700">
                        ADMINISTRATOR
                      </span>
                    )}
                  </div>

                  <div className="py-1">
                    <Link
                      href="/dashboard"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-slate-50 transition-colors"
                    >
                      <LayoutDashboard className="w-4 h-4 text-muted" />
                      Dashboard
                    </Link>
                    <Link
                      href="/dashboard/events"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-slate-50 transition-colors"
                    >
                      <PlusCircle className="w-4 h-4 text-muted" />
                      My Created Events
                    </Link>
                    <Link
                      href="/dashboard/participations"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-slate-50 transition-colors"
                    >
                      <Ticket className="w-4 h-4 text-muted" />
                      My Registrations
                    </Link>
                    <Link
                      href="/dashboard/invitations"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-slate-50 transition-colors"
                    >
                      <Mail className="w-4 h-4 text-muted" />
                      Invitations
                    </Link>
                    <Link
                      href="/dashboard/payments"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-slate-50 transition-colors"
                    >
                      <CreditCard className="w-4 h-4 text-muted" />
                      Payment Records
                    </Link>
                    <Link
                      href="/dashboard/profile"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-slate-50 transition-colors"
                    >
                      <UserIcon className="w-4 h-4 text-muted" />
                      Profile Settings
                    </Link>

                    {user.role === 'ADMIN' && (
                      <Link
                        href="/admin"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-purple-700 bg-purple-50/50 hover:bg-purple-50 transition-colors font-medium"
                      >
                        <ShieldAlert className="w-4 h-4 text-purple-600" />
                        Admin Control Panel
                      </Link>
                    )}
                  </div>

                  <div className="border-t border-border pt-1">
                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        logout();
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-destructive hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Log In
                </Button>
              </Link>
              <Link href="/register">
                <Button variant="primary" size="sm">
                  Sign Up
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile menu trigger */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-muted hover:text-foreground hover:bg-slate-100"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-border bg-white px-4 pt-2 pb-5 space-y-3">
          <Link
            href="/events"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-base font-medium text-foreground hover:bg-slate-50"
          >
            <Compass className="w-5 h-5 text-muted" />
            Explore Events
          </Link>
          <Link
            href={isAuthenticated ? '/dashboard/events' : '/login'}
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-base font-medium text-foreground hover:bg-slate-50"
          >
            <PlusCircle className="w-5 h-5 text-muted" />
            Host an Event
          </Link>

          {isAuthenticated ? (
            <div className="pt-3 border-t border-border space-y-2">
              <Link
                href="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-base font-medium text-foreground hover:bg-slate-50"
              >
                <LayoutDashboard className="w-5 h-5 text-muted" />
                Dashboard
              </Link>
              {user?.role === 'ADMIN' && (
                <Link
                  href="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-base font-medium text-purple-700 bg-purple-50"
                >
                  <ShieldAlert className="w-5 h-5" />
                  Admin Panel
                </Link>
              )}
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  logout();
                }}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-base font-medium text-destructive hover:bg-red-50 text-left"
              >
                <LogOut className="w-5 h-5" />
                Sign Out
              </button>
            </div>
          ) : (
            <div className="pt-4 border-t border-border flex flex-col gap-2">
              <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="outline" className="w-full">
                  Log In
                </Button>
              </Link>
              <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="primary" className="w-full">
                  Sign Up
                </Button>
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
