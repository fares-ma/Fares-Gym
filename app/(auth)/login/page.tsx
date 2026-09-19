"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginAction } from "@/server/auth";
import { ar } from "@/i18n/ar";
import { Lock, User, Loader2, ShieldCheck } from "lucide-react";
import { MiniFares, CharacterPose, CharacterFace } from "@/ui/MiniFares";

export default function LoginPage() {
  const router = useRouter();
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
        router.push("/");
        router.refresh();
      }
    } catch {
      setError(ar.errors.generic);
      setLoading(false);
    }
  };

  // Determine character state
  let currentPose: CharacterPose | undefined = "hero-standing";
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
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-[#0D0C0F] text-[#F1E9DD] selection:bg-[#7A1735] selection:text-[#F1E9DD] relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-0 inset-x-0 h-96 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(122,23,53,0.35),transparent_70%)] pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Main Card */}
        <div className="hub-card-elevated p-6 sm:p-8 rounded-2xl border border-[#2A242E] shadow-2xl relative backdrop-blur-xs">
          {/* Top Brand Banner */}
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#2A242E]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#4A1024] border border-[#7A1735] flex items-center justify-center text-xs font-black text-[#F1E9DD]">
                FH
              </div>
              <div>
                <h2 className="text-sm font-black tracking-wider text-[#F1E9DD] uppercase font-latin leading-tight">
                  {ar.home.hubTitle}
                </h2>
                <p className="text-[10px] font-semibold text-[#C9A15A] font-latin">
                  {ar.home.disciplineSlogan}
                </p>
              </div>
            </div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#1D1920] border border-[#2A242E] text-[10px] font-bold text-[#C9A15A]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#C9A15A]" />
              <span>{ar.auth.secureBadge}</span>
            </div>
          </div>

          {/* Character Container */}
          <div className="flex flex-col items-center text-center my-4">
            <div className="w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center mb-2 drop-shadow-xl">
              <MiniFares
                pose={currentPose}
                face={currentFace}
                size="lg"
                animate={loginSuccess ? "bounce" : "breathe"}
                priority
                alt="Mini Fares Login"
              />
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-[#F1E9DD]">
              {ar.auth.loginTitle}
            </h1>
            <p className="text-xs font-medium text-[#A7A0A6] mt-1">
              {ar.auth.loginSlogan}
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-[#4A1024]/60 border border-[#E05252]/50 text-red-200 text-xs font-bold flex items-center gap-2.5 shadow-sm">
              <span className="text-sm">⚠️</span>
              <span className="flex-1">{error}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#F1E9DD] mb-1.5">
                {ar.auth.usernameLabel}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none text-[#A7A0A6]">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder={ar.auth.usernamePlaceholder}
                  required
                  autoComplete="username"
                  className="w-full h-12 bg-[#1D1920] border border-[#2A242E] rounded-xl ps-10 pe-4 text-sm text-[#F1E9DD] placeholder-[#6B646B] focus:outline-none focus:border-[#A83252] focus:ring-1 focus:ring-[#A83252] transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#F1E9DD] mb-1.5">
                {ar.auth.passwordLabel}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none text-[#A7A0A6]">
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
                  autoComplete="current-password"
                  className="w-full h-12 bg-[#1D1920] border border-[#2A242E] rounded-xl ps-10 pe-4 text-sm text-[#F1E9DD] placeholder-[#6B646B] focus:outline-none focus:border-[#A83252] focus:ring-1 focus:ring-[#A83252] transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 h-12 hub-btn-primary rounded-xl flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-[#F1E9DD]" />
                  <span className="font-bold text-sm">{ar.auth.loggingIn}</span>
                </>
              ) : (
                <span className="font-black text-sm tracking-wide">{ar.auth.loginButton}</span>
              )}
            </button>
          </form>
        </div>

        {/* Footer info */}
        <p className="text-center text-[11px] text-[#6B646B] mt-5 font-latin">
          Fares Hub • Single User Personal Command Center
        </p>
      </div>
    </div>
  );
}
