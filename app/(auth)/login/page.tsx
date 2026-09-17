"use client";

import { useState } from "react";
import { loginAction } from "@/server/auth";
import { ar } from "@/i18n/ar";
import { Lock, User, Loader2 } from "lucide-react";
import { MiniFares, CharacterPose, CharacterFace } from "@/ui/MiniFares";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);

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
        setLoginSuccess(true);
        setTimeout(() => {
          window.location.href = "/";
        }, 500);
      }
    } catch {
      setError(ar.errors.generic);
      setLoading(false);
    }
  };

  // Determine character state
  let currentPose: CharacterPose | undefined = "waving";
  let currentFace: CharacterFace | undefined = undefined;

  if (loginSuccess) {
    currentPose = "thumbs-up";
  } else if (error) {
    currentPose = undefined;
    currentFace = "angry";
  } else if (isPasswordFocused) {
    currentPose = "shushing";
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-[#0F0D11] text-[#F2EADF] selection:bg-[#7C1D38] selection:text-[#F2EADF]">
      <div className="w-full max-w-md comic-card p-6 sm:p-8 relative border border-[#2B252E] shadow-2xl">
        {/* Hub Badge */}
        <div className="flex items-center justify-between mb-4 border-b border-[#2B252E] pb-3">
          <div>
            <h2 className="text-sm font-black tracking-widest text-[#D6AA63] uppercase font-mono">
              FARES HUB
            </h2>
            <p className="text-[11px] text-[#9D969D] font-mono">
              Discipline Builds Freedom
            </p>
          </div>
          <div className="comic-badge text-[10px]">SECURE ENTRY</div>
        </div>

        {/* Character Reaction Container */}
        <div className="flex flex-col items-center text-center my-3">
          <div className="w-28 h-28 flex items-center justify-center mb-1">
            <MiniFares
              pose={currentPose}
              face={currentFace}
              size="lg"
              animate={loginSuccess ? "bounce" : "breathe"}
              priority
              alt="Mini Fares Login"
            />
          </div>
          <h1 className="text-2xl font-black tracking-tight text-[#F2EADF]">
            {ar.auth.loginTitle}
          </h1>
          <p className="text-xs font-semibold text-[#9D969D] mt-1">
            Same Guy... Higher Standards
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-950/40 border border-red-800/60 text-red-300 text-xs font-bold flex items-center gap-2">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#F2EADF] mb-1.5">
              {ar.auth.usernameLabel}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none text-[#9D969D]">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder={ar.auth.usernamePlaceholder}
                required
                className="w-full bg-[#211C23] border border-[#362E3B] rounded-xl py-2.5 ps-10 pe-4 text-sm text-[#F2EADF] placeholder-[#9D969D]/60 focus:outline-none focus:border-[#7C1D38] focus:ring-1 focus:ring-[#7C1D38] transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#F2EADF] mb-1.5">
              {ar.auth.passwordLabel}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none text-[#9D969D]">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setIsPasswordFocused(true)}
                onBlur={() => setIsPasswordFocused(false)}
                placeholder={ar.auth.passwordPlaceholder}
                required
                className="w-full bg-[#211C23] border border-[#362E3B] rounded-xl py-2.5 ps-10 pe-4 text-sm text-[#F2EADF] placeholder-[#9D969D]/60 focus:outline-none focus:border-[#7C1D38] focus:ring-1 focus:ring-[#7C1D38] transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-3 comic-btn-primary py-3 px-4 rounded-xl flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-[#F2EADF]" />
                <span className="font-bold text-sm">{ar.auth.loggingIn}</span>
              </>
            ) : (
              <span className="font-black text-sm tracking-wide">ENTER HUB ➔</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
