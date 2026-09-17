"use client";

import { useState, useEffect } from "react";
import { quotes, QuoteContext } from "@/i18n/quotes";

export function useRandomQuote(context: QuoteContext): string {
  const list = quotes[context] || quotes.home;
  const [quote, setQuote] = useState<string>(list[0]);

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * list.length);
    setQuote(list[randomIndex]);
  }, [context, list]);

  return quote;
}
