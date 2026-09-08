import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges CSS class names using clsx and tailwind-merge.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Formats a monetary amount to Indian Rupee (INR) representation: e.g. ₹500, ₹5,000, ₹10,000
 * Handles numbers, numeric strings, legacy '$' prefixes, and hourly rates (e.g. '₹500/hr').
 */
export function formatINR(
  amount: number | string | null | undefined,
  options?: { showDecimals?: boolean; fallback?: string }
): string {
  if (amount === null || amount === undefined || amount === "") {
    return options?.fallback ?? "₹0";
  }

  if (typeof amount === "string") {
    const isHourly = amount.includes("/hr") || amount.includes("/hour");
    // Strip existing currency symbols, commas, and trailing rate unit
    const cleanStr = amount.replace(/[₹$,]/g, "").replace(/\/(hr|hour)$/i, "").trim();
    const parsed = parseFloat(cleanStr);
    if (!isNaN(parsed)) {
      const formattedNum = options?.showDecimals
        ? parsed.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
        : parsed.toLocaleString("en-IN");
      return isHourly ? `₹${formattedNum}/hr` : `₹${formattedNum}`;
    }
    // If it starts with $, replace with ₹
    if (amount.startsWith("$")) {
      return `₹${amount.slice(1).trim()}`;
    }
    if (amount.startsWith("₹")) {
      return amount;
    }
    return `₹${amount}`;
  }

  const num = Number(amount);
  if (isNaN(num)) {
    return options?.fallback ?? "₹0";
  }

  const formattedNum = options?.showDecimals
    ? num.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    : num.toLocaleString("en-IN");

  return `₹${formattedNum}`;
}

export const formatCurrency = formatINR;

