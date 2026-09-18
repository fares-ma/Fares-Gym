import { quotes, QuoteContext } from "@/i18n/quotes";

export function useRandomQuote(context: QuoteContext): string {
  const list = quotes[context] || quotes.home;

  // Deterministic hourly rotation so SSR matches Client and eliminates layout shift
  const now = new Date();
  const dayOfYear = Math.floor(
    (now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / 86400000
  );
  const index = Math.abs(dayOfYear + now.getHours()) % list.length;
  return list[index] || list[0];
}
