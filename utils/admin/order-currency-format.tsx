"use client";

import * as React from "react";

interface FormattedAmountProps {
  amount: number;
  currency?: string;
  locale?: string;
}

export function OrderCurrencyFormatter({
  amount,
  currency = "ZAR",
  locale = "en-ZA",
}: FormattedAmountProps) {
  const formattedValue = React.useMemo(() => {
    try {
      return new Intl.NumberFormat(locale, {
        style: "currency",
        currency: currency,
      }).format(amount);
    } catch (e) {
      console.error("Error formatting amount:", e);
      return amount.toFixed(2);
    }
  }, [amount, currency, locale]);

  return <span>{formattedValue}</span>;
}
