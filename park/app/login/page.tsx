'use client';

import Link from "next/link";
import { useEffect, useState } from "react";
import { signInWithPopup, signOut, onAuthStateChanged, User } from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";
import NavBar from "../components/Navbar";

export default function LoginPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
    });
    return () => unsubscribe();
  }, []);

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError("");

    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      console.error("Google login failed:", err);
      setError("เกิดข้อผิดพลาดขณะล็อกอิน กรุณาลองใหม่อีกครั้ง");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    setError("");

    try {
      await signOut(auth);
    } catch (err) {
      console.error("Logout failed:", err);
      setError("เกิดข้อผิดพลาดขณะออกจากระบบ กรุณาลองใหม่อีกครั้ง");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-white via-zinc-50 to-zinc-50 dark:from-zinc-900 dark:via-zinc-950 dark:to-zinc-950 text-zinc-900 dark:text-white">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="mx-auto max-w-3xl">
          <div className="rounded-2xl bg-white dark:bg-zinc-900 shadow-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800">
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="p-10 flex flex-col gap-6">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center text-white font-bold">P</div>
                  <div>
                    <h2 className="text-2xl font-semibold">Park — เข้าสู่ระบบ</h2>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">จัดการข้อมูลและการจองของคุณอย่างมืออาชีพ</p>
                  </div>
                </div>

                {error ? (
                  <div className="rounded-lg bg-red-50 p-3 text-red-700 dark:bg-red-950/50 dark:text-red-300">
                    {error}
                  </div>
                ) : null}

                {user ? (
                  <div className="space-y-4 mt-2">
                    <div className="flex items-center gap-4">
                      {user.photoURL ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={user.photoURL} alt={user.displayName ?? "User"} className="h-16 w-16 rounded-full object-cover" />
                      ) : (
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 text-white">
                          {user.displayName?.[0] ?? "U"}
                        </div>
                      )}
                      <div>
                        <p className="text-sm uppercase text-zinc-500 dark:text-zinc-400">ล็อกอินแล้ว</p>
                        <p className="text-lg font-semibold">{user.displayName ?? user.email}</p>
                        <p className="text-sm text-zinc-600 dark:text-zinc-400">{user.email}</p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleLogout}
                      disabled={loading}
                      className="w-full rounded-full bg-red-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {loading ? "กำลังออกจากระบบ..." : "ออกจากระบบ"}
                    </button>
                  </div>
                ) : (
                  <div className="mt-2">
                    <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">ล็อกอินด้วยบัญชี Google เพื่อดำเนินการต่อ</p>

                    <button
                      type="button"
                      onClick={handleGoogleLogin}
                      disabled={loading}
                      className="w-full inline-flex items-center justify-center gap-3 rounded-full bg-gradient-to-r from-blue-600 to-sky-500 px-5 py-3 text-sm font-semibold text-white shadow-md hover:scale-[1.01] transition disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <svg className="h-5 w-5" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                        <path fill="#EA4335" d="M24 9.5c3.8 0 6.3 1.6 7.8 2.9l5.7-5.6C34.4 3.5 29.7 1.5 24 1.5 14.7 1.5 6.9 7.5 3.2 15.6l6.7 5.2C11.9 15 17.4 9.5 24 9.5z"/>
                        <path fill="#34A853" d="M46.5 24c0-1.4-.1-2.6-.4-3.8H24v7.1h12.6c-.6 3.3-2.6 6.1-5.6 8l8.8 6.8C43.6 36.2 46.5 30.6 46.5 24z"/>
                        <path fill="#4A90E2" d="M10 28.7A14.8 14.8 0 0 1 9 24c0-1.3.2-2.6.5-3.8L3 14.9C1.1 17.9 0 21.8 0 24c0 3 1 5.8 2.8 8.1l7.2-3.4z"/>
                        <path fill="#FBBC05" d="M24 46.5c6.3 0 11.6-2.1 15.5-5.8l-7.4-5.6c-2 1.4-4.5 2.3-8.1 2.3-6.6 0-12.1-5.5-13.9-12.9L3.2 33.4C6.9 41.5 14.7 46.5 24 46.5z"/>
                      </svg>

                      {loading ? 'กำลังล็อกอิน...' : 'ล็อกอินด้วย Google'}
                    </button>
                  </div>
                )}

                <div className="mt-4 text-xs text-zinc-500">
                  โดยการล็อกอิน คุณยอมรับข้อกำหนดและนโยบายความเป็นส่วนตัวของเรา
                </div>
              </div>

              <div className="hidden md:block bg-gradient-to-br from-sky-50 to-white dark:from-zinc-800 dark:to-zinc-900 p-6">
                <div className="h-full flex items-center justify-center">
                  <img src="/login-illustration.png" alt="illustration" className="max-h-64 opacity-90" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
