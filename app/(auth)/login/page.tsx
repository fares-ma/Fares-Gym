"use client";

import { useState } from "react";
import { loginAction } from "@/src/server/auth";
import { ar } from "@/src/i18n/ar";
import { Lock, User, Loader2 } from "lucide-react";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await loginAction({ username, password });
      if (!res.success) {
        setError(res.error || ar.auth.invalidCredentials);
        setLoading(false);
      } else {
        // Successful login
        window.location.href = "/";
      }
    } catch {
      setError(ar.errors.generic);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-950 text-slate-100">
      <div className="w-full max-w-md bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
        {/* Header with Avatar */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-amber-500/50 shadow-lg mb-4 bg-slate-800">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/fares.jpeg"
              alt="Fares"
              className="w-full h-full object-cover"
            />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-100">
            {ar.auth.loginTitle}
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            {ar.auth.loginSubtitle}
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm font-medium flex items-center gap-2">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              {ar.auth.usernameLabel}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none text-slate-500">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder={ar.auth.usernamePlaceholder}
                required
                className="w-full bg-slate-800/60 border border-slate-700/60 rounded-xl py-2.5 ps-10 pe-4 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              {ar.auth.passwordLabel}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none text-slate-500">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={ar.auth.passwordPlaceholder}
                required
                className="w-full bg-slate-800/60 border border-slate-700/60 rounded-xl py-2.5 ps-10 pe-4 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold py-2.5 px-4 rounded-xl shadow-lg transition-all duration-150 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>{ar.auth.loggingIn}</span>
              </>
            ) : (
              <span>{ar.auth.loginButton}</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
