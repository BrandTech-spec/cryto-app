import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

import React from "react";
import { Transaction } from "./appwrite/appWriteConfig";
import { toast } from "sonner";

/**
 * Calculates the countdown for a transaction based on creation time and duration
 * @param transaction - The transaction object
 * @returns Object containing countdown time or null if expired
 */
export const calculateTransactionCountdown = (transaction: Transaction | null) => {
  if (!transaction || !transaction.$createdAt || !transaction.time) {
    return null;
  }

  const createdAt = new Date(transaction.$createdAt);
  const durationInSeconds = parseInt(transaction.time);
  const expirationTime = new Date(createdAt.getTime() + (durationInSeconds * 1000));
  const currentTime = new Date();

  // Check if the transaction has expired
  if (currentTime >= expirationTime) {
    return null;
  }

  // Calculate remaining time in milliseconds
  const remainingMs = expirationTime.getTime() - currentTime.getTime();
  
  // Convert to hours, minutes, seconds
  const hours = Math.floor(remainingMs / (1000 * 60 * 60));
  const minutes = Math.floor((remainingMs % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((remainingMs % (1000 * 60)) / 1000);

  return {
    hours,
    minutes,
    seconds,
    totalSeconds: Math.floor(remainingMs / 1000),
    formatted: `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`,
    isExpired: false,
  };
};

/**
 * Hook to get real-time countdown for a transaction
 * @param transaction - The transaction object
 * @returns Countdown object with real-time updates
 */
export const useTransactionCountdown = (transaction: Transaction | null) => {
  const [countdown, setCountdown] = React.useState(() => calculateTransactionCountdown(transaction));

  React.useEffect(() => {
    if (!transaction || !transaction.$createdAt || !transaction.time) {
      setCountdown(null);
      return;
    }

    // Update countdown immediately
    setCountdown(calculateTransactionCountdown(transaction));

    // Set up interval to update every second
    const interval = setInterval(() => {
      const newCountdown = calculateTransactionCountdown(transaction);
      setCountdown(newCountdown);
      
      // Clear interval if transaction has expired
      if (!newCountdown) {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [transaction?.$id, transaction?.$createdAt, transaction?.time]);

  return countdown;
};

/**
 * Validates transaction form data
 * @param data - Transaction form data
 * @returns Validation result with errors if any
 */
export const validateTransactionForm = (data: {
  amount: number;
  currency: string;
  time: string;
  type: 'manual' | 'auto';
  current_state: 'buy' | 'sell';
}) => {
  const errors: { [key: string]: string } = {};

  if (!data.amount || data.amount <= 0) {
    errors.amount = 'Amount must be greater than 0';
  }

  if (!data.currency || data.currency.trim() === '') {
    errors.currency = 'Currency is required';
  }

  if (!data.time || parseInt(data.time) <= 0) {
    errors.time = 'Time must be greater than 0 seconds';
  }

  if (!data.type || !['manual', 'auto'].includes(data.type)) {
    errors.type = 'Type must be either manual or auto';
  }

  if (!data.current_state || !['buy', 'sell'].includes(data.current_state)) {
    errors.current_state = 'Current state must be either buy or sell';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Formats currency amount with proper decimals
 * @param amount - The amount to format
 * @param currency - The currency code
 * @returns Formatted currency string
 */
export const formatCurrency = (amount: number, currency: string = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency.toUpperCase(),
    minimumFractionDigits: 2,
    maximumFractionDigits: 8, // For crypto currencies with many decimals
  }).format(amount);
};

/**
 * Formats time duration in seconds to human readable format
 * @param seconds - Duration in seconds
 * @returns Human readable duration string
 */
export const formatDuration = (seconds: number) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  if (hours > 0) {
    return `${hours}h ${minutes}m ${remainingSeconds}s`;
  } else if (minutes > 0) {
    return `${minutes}m ${remainingSeconds}s`;
  } else {
    return `${remainingSeconds}s`;
  }
};

export function validateSignUpData(data: any): boolean {
  for (const [key, value] of Object.entries(data)) {
    if (value === null || value === undefined || String(value).trim() === "") {
      // Capitalize field name for display
      const fieldName = key.charAt(0).toUpperCase() + key.slice(1);
      toast.error(`${fieldName} is required`);
      return false;
    }
  }
  return true;
}