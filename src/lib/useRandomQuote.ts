import { quotes, QuoteContext } from "@/i18n/quotes";

export function useRandomQuote(context: QuoteContext): string {
  const list = quotes[context] || quotes.home;

  // Deterministic daily rotation using UTC to prevent SSR/Client hydration mismatch.
  // Vercel serverless runs in UTC; using getUTCHours() ensures the same index
  // is computed on both server and client regardless of local timezone.
  const now = new Date();
  const dayOfYear = Math.floor(
    (Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()) -
      Date.UTC(now.getUTCFullYear(), 0, 0)) /
      86400000
  );
  const index = Math.abs(dayOfYear + now.getUTCHours()) % list.length;
  return list[index] || list[0];
}
