'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { auth, googleProvider } from '@/lib/firebase';
import { User, onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';

export default function NavBar() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
    });
    return () => unsubscribe();
  }, []);

  const handleGoogleLogin = async () => {
    setLoading(true);

    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error('Google login failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoading(true);

    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <header className="w-full bg-white/60 dark:bg-zinc-900/60 backdrop-blur sticky top-0 z-40 border-b border-zinc-200 dark:border-zinc-800">
      <div className="mx-auto max-w-6xl px-6 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center text-white font-bold">
            P
          </div>
          <div>
            <p className="text-sm font-semibold text-zinc-900 dark:text-white">Park</p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">ระบบจัดการ</p>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link href="/" className="text-sm text-zinc-700 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white">หน้าหลัก</Link>
          <Link href="/two" className="text-sm text-zinc-700 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white">โปรโมชั่น</Link>
          <Link href="/admin" className="text-sm text-zinc-700 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white">แอดมิน</Link>
        </nav>

        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleLogout}
                disabled={loading}
                className="hidden sm:inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-700 shadow-sm hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 disabled:cursor-not-allowed disabled:opacity-60"
              >
                ออกจากระบบ
              </button>
              <div className="h-10 w-10 overflow-hidden rounded-full bg-slate-100 text-sm font-semibold text-slate-700 dark:bg-zinc-800 dark:text-slate-200 flex items-center justify-center">
                {user.photoURL ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={user.photoURL} alt={user.displayName ?? 'User'} className="h-full w-full object-cover" />
                ) : (
                  user.displayName?.[0] ?? 'U'
                )}
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={loading}
              className="hidden sm:inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-700 shadow-sm hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <svg className="h-5 w-5" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path fill="#EA4335" d="M24 9.5c3.8 0 6.3 1.6 7.8 2.9l5.7-5.6C34.4 3.5 29.7 1.5 24 1.5 14.7 1.5 6.9 7.5 3.2 15.6l6.7 5.2C11.9 15 17.4 9.5 24 9.5z" />
                <path fill="#34A853" d="M46.5 24c0-1.4-.1-2.6-.4-3.8H24v7.1h12.6c-.6 3.3-2.6 6.1-5.6 8l8.8 6.8C43.6 36.2 46.5 30.6 46.5 24z" />
                <path fill="#4A90E2" d="M10 28.7A14.8 14.8 0 0 1 9 24c0-1.3.2-2.6.5-3.8L3 14.9C1.1 17.9 0 21.8 0 24c0 3 1 5.8 2.8 8.1l7.2-3.4z" />
                <path fill="#FBBC05" d="M24 46.5c6.3 0 11.6-2.1 15.5-5.8l-7.4-5.6c-2 1.4-4.5 2.3-8.1 2.3-6.6 0-12.1-5.5-13.9-12.9L3.2 33.4C6.9 41.5 14.7 46.5 24 46.5z" />
              </svg>
              {loading ? 'กำลังล็อกอิน...' : 'ล็อกอินด้วย Google'}
            </button>
          )}

          <button
            onClick={() => setOpen(!open)}
            aria-label="menu"
            className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-lg border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 6H20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M4 12H20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M4 18H20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>

      {open ? (
        <div className="md:hidden border-t border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 backdrop-blur">
          <div className="mx-auto max-w-6xl px-6 py-4 flex flex-col gap-3">
            <Link href="/" className="text-sm">หน้าหลัก</Link>
            <Link href="/two" className="text-sm">โปรโมชั่น</Link>
            <Link href="/admin" className="text-sm">แอดมิน</Link>
            {user ? (
              <button
                type="button"
                onClick={handleLogout}
                disabled={loading}
                className="text-left text-sm font-medium text-zinc-700 dark:text-zinc-300"
              >
                ออกจากระบบ
              </button>
            ) : (
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={loading}
                className="text-left text-sm font-medium text-zinc-700 dark:text-zinc-300"
              >
                {loading ? 'กำลังล็อกอิน...' : 'ล็อกอินด้วย Google'}
              </button>
            )}
          </div>
        </div>
      ) : null}
    </header>
  );
}
