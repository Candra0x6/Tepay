// ============ VAULT PAY UTILITIES ============

import { Principal } from "@dfinity/principal";

// Type definitions for better TypeScript support
export interface VaultPayConfig {
  development: {
    host: string;
    aliasRegistryId: string;
    vaultBackendId: string;
    vptTokenLedgerId: string;
    analyticsLoggerId: string;
    configControllerId: string;
  };
  production: {
    host: string;
    aliasRegistryId: string;
    vaultBackendId: string;
    vptTokenLedgerId: string;
    analyticsLoggerId: string;
    configControllerId: string;
  };
}

// Default configuration
export const VAULT_PAY_CONFIG: VaultPayConfig = {
  development: {
    host: 'http://localhost:8000',
    aliasRegistryId: 'rdmx6-jaaaa-aaaah-qcaiq-cai',
    vaultBackendId: 'rrkah-fqaaa-aaaah-qcaiq-cai',
    vptTokenLedgerId: 'rno2w-sqaaa-aaaah-qcaiq-cai',
    analyticsLoggerId: 'renrk-eyaaa-aaaah-qcaiq-cai',
    configControllerId: 'r7inp-6aaaa-aaaah-qcaiq-cai',
  },
  production: {
    host: 'https://ic0.app',
    aliasRegistryId: 'rdmx6-jaaaa-aaaah-qcaiq-cai', // Replace with actual production IDs
    vaultBackendId: 'rrkah-fqaaa-aaaah-qcaiq-cai',
    vptTokenLedgerId: 'rno2w-sqaaa-aaaah-qcaiq-cai',
    analyticsLoggerId: 'renrk-eyaaa-aaaah-qcaiq-cai',
    configControllerId: 'r7inp-6aaaa-aaaah-qcaiq-cai',
  },
};

// Get current environment configuration
export const getVaultPayConfig = () => {
  const isDevelopment = typeof window !== 'undefined' &&
    (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

  return isDevelopment ? VAULT_PAY_CONFIG.development : VAULT_PAY_CONFIG.production;
};

// ============ FORMATTING UTILITIES ============

// Format VPT amount from units to display
export const formatVPTAmount = (units: bigint | number, decimals: number = 8): string => {
  const amount = typeof units === 'bigint' ? Number(units) : units;
  return (amount / Math.pow(10, decimals)).toFixed(decimals);
};

// Parse VPT amount from display to units
export const parseVPTAmount = (amount: string, decimals: number = 8): bigint => {
  const numAmount = parseFloat(amount);
  if (isNaN(numAmount)) return 0n;
  return BigInt(Math.floor(numAmount * Math.pow(10, decimals)));
};

// Format principal for display
export const formatPrincipal = (principal: Principal): string => {
  const principalStr = principal.toString();
  if (principalStr.length <= 12) return principalStr;
  return `${principalStr.slice(0, 6)}...${principalStr.slice(-6)}`;
};

// Format timestamp
export const formatTimestamp = (timestamp: bigint | number): string => {
  const tsNumber = typeof timestamp === 'bigint' ? Number(timestamp) : timestamp;
  // Convert nanoseconds to milliseconds if needed
  const ms = tsNumber > 1000000000000 ? tsNumber / 1000000 : tsNumber * 1000;
  return new Date(ms).toLocaleString();
};

// ============ VALIDATION UTILITIES ============

// Validate alias format
export const validateAlias = (alias: string): { isValid: boolean; message: string } => {
  if (!alias) {
    return { isValid: false, message: 'Alias cannot be empty' };
  }

  if (alias.length < 3) {
    return { isValid: false, message: 'Alias must be at least 3 characters long' };
  }

  if (alias.length > 32) {
    return { isValid: false, message: 'Alias cannot exceed 32 characters' };
  }

  if (!/^[a-zA-Z0-9_-]+$/.test(alias)) {
    return { isValid: false, message: 'Alias can only contain letters, numbers, underscores, and hyphens' };
  }

  if (alias.startsWith('_') || alias.startsWith('-')) {
    return { isValid: false, message: 'Alias cannot start with underscore or hyphen' };
  }

  // Check for reserved words
  const reservedWords = ['admin', 'system', 'vault', 'api', 'null', 'undefined'];
  if (reservedWords.includes(alias.toLowerCase())) {
    return { isValid: false, message: 'This alias is reserved' };
  }

  return { isValid: true, message: 'Valid alias format' };
};

// Validate VPT amount
export const validateVPTAmount = (amount: string, maxAmount?: number): { isValid: boolean; message: string } => {
  if (!amount) {
    return { isValid: false, message: 'Amount cannot be empty' };
  }

  const numAmount = parseFloat(amount);

  if (isNaN(numAmount)) {
    return { isValid: false, message: 'Invalid amount format' };
  }

  if (numAmount <= 0) {
    return { isValid: false, message: 'Amount must be greater than 0' };
  }

  if (numAmount < 0.00000001) {
    return { isValid: false, message: 'Amount too small (minimum 0.00000001 VPT)' };
  }

  if (maxAmount && numAmount > maxAmount) {
    return { isValid: false, message: `Amount exceeds maximum of ${maxAmount} VPT` };
  }

  return { isValid: true, message: 'Valid amount' };
};

// Validate principal format
export const validatePrincipal = (principal: string): { isValid: boolean; message: string } => {
  if (!principal) {
    return { isValid: false, message: 'Principal cannot be empty' };
  }

  try {
    // This would use the actual Principal validation in real implementation
    if (!/^[a-z0-9-]+$/.test(principal)) {
      return { isValid: false, message: 'Invalid principal format' };
    }

    if (principal.length < 27) {
      return { isValid: false, message: 'Principal too short' };
    }

    return { isValid: true, message: 'Valid principal' };
  } catch (error) {
    return { isValid: false, message: 'Invalid principal format' };
  }
};

// ============ ERROR HANDLING UTILITIES ============

// Standard error messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection and try again.',
  AUTHENTICATION_REQUIRED: 'Authentication required. Please log in first.',
  INSUFFICIENT_FUNDS: 'Insufficient funds for this transaction.',
  INVALID_RECIPIENT: 'Invalid recipient. Please check the alias or principal ID.',
  TRANSACTION_FAILED: 'Transaction failed. Please try again.',
  ALIAS_TAKEN: 'This alias is already taken. Please choose a different one.',
  VAULT_PAUSED: 'Vault operations are currently paused for maintenance.',
  AMOUNT_TOO_SMALL: 'Amount is too small. Minimum transaction is 0.00000001 VPT.',
  AMOUNT_TOO_LARGE: 'Amount exceeds maximum allowed transaction size.',
  CANISTER_ERROR: 'Service temporarily unavailable. Please try again later.',
};

// Error handler with user-friendly messages
export const handleVaultPayError = (error: any, operation: string): string => {
  console.error(`VaultPay Error in ${operation}:`, error);

  if (!error) return ERROR_MESSAGES.TRANSACTION_FAILED;

  const errorMessage = error.message || error.toString() || '';

  // Network errors
  if (errorMessage.includes('network') || errorMessage.includes('fetch')) {
    return ERROR_MESSAGES.NETWORK_ERROR;
  }

  // Authentication errors
  if (errorMessage.includes('authentication') || errorMessage.includes('unauthorized')) {
    return ERROR_MESSAGES.AUTHENTICATION_REQUIRED;
  }

  // Insufficient funds
  if (errorMessage.includes('insufficient') || errorMessage.includes('balance')) {
    return ERROR_MESSAGES.INSUFFICIENT_FUNDS;
  }

  // Alias errors
  if (errorMessage.includes('alias') && errorMessage.includes('taken')) {
    return ERROR_MESSAGES.ALIAS_TAKEN;
  }

  // Vault paused
  if (errorMessage.includes('paused')) {
    return ERROR_MESSAGES.VAULT_PAUSED;
  }

  // Default error
  return `${operation} failed: ${errorMessage}`;
};

// ============ LOCAL STORAGE UTILITIES ============

const STORAGE_KEYS = {
  VAULT_PAY_SETTINGS: 'vaultpay_settings',
  RECENT_RECIPIENTS: 'vaultpay_recent_recipients',
  USER_PREFERENCES: 'vaultpay_user_preferences',
};

// Save user settings
export const saveUserSettings = (settings: any): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.VAULT_PAY_SETTINGS, JSON.stringify(settings));
  } catch (error) {
    console.error('Failed to save user settings:', error);
  }
};

// Load user settings
export const loadUserSettings = (): any => {
  try {
    const settings = localStorage.getItem(STORAGE_KEYS.VAULT_PAY_SETTINGS);
    return settings ? JSON.parse(settings) : {};
  } catch (error) {
    console.error('Failed to load user settings:', error);
    return {};
  }
};

// Save recent recipients
export const saveRecentRecipient = (recipient: { alias?: string; principal: string; timestamp: number }): void => {
  try {
    const existing = loadRecentRecipients();
    const updated = [recipient, ...existing.filter((r: any) => r.principal !== recipient.principal)].slice(0, 10);
    localStorage.setItem(STORAGE_KEYS.RECENT_RECIPIENTS, JSON.stringify(updated));
  } catch (error) {
    console.error('Failed to save recent recipient:', error);
  }
};

// Load recent recipients
export const loadRecentRecipients = (): any[] => {
  try {
    const recipients = localStorage.getItem(STORAGE_KEYS.RECENT_RECIPIENTS);
    return recipients ? JSON.parse(recipients) : [];
  } catch (error) {
    console.error('Failed to load recent recipients:', error);
    return [];
  }
};

// ============ QR CODE UTILITIES ============

// Generate QR code data for payment
export const generatePaymentQRData = (params: {
  recipient: string;
  amount?: number;
  memo?: string;
  alias?: string;
}): string => {
  const qrData = {
    type: 'vault_pay_transfer',
    version: '1.0',
    recipient: params.recipient,
    amount: params.amount?.toString() || '',
    memo: params.memo || '',
    alias: params.alias || '',
    timestamp: Date.now(),
  };

  return JSON.stringify(qrData);
};

// Parse QR code data
export const parsePaymentQRData = (qrString: string): any => {
  try {
    const data = JSON.parse(qrString);

    if (data.type === 'vault_pay_transfer' && data.version === '1.0') {
      return {
        isValid: true,
        recipient: data.recipient,
        amount: data.amount ? parseFloat(data.amount) : undefined,
        memo: data.memo,
        alias: data.alias,
        timestamp: data.timestamp,
      };
    } else {
      return { isValid: false, error: 'Invalid QR code format' };
    }
  } catch (error) {
    return { isValid: false, error: 'Failed to parse QR code' };
  }
};

// ============ INTEREST CALCULATION UTILITIES ============

// Calculate interest for a given principal, rate, and time
export const calculateInterest = (
  principal: number,
  annualRate: number,
  timeInSeconds: number
): number => {
  const timeInYears = timeInSeconds / (365.25 * 24 * 3600);
  return principal * annualRate * timeInYears;
};

// Calculate projected interest for different time periods
export const calculateProjectedInterest = (
  principal: number,
  annualRate: number = 0.05
): {
  daily: number;
  weekly: number;
  monthly: number;
  yearly: number;
} => {
  return {
    daily: calculateInterest(principal, annualRate, 24 * 3600),
    weekly: calculateInterest(principal, annualRate, 7 * 24 * 3600),
    monthly: calculateInterest(principal, annualRate, 30 * 24 * 3600),
    yearly: calculateInterest(principal, annualRate, 365.25 * 24 * 3600),
  };
};

// ============ NOTIFICATION UTILITIES ============

// Notification types
export enum NotificationType {
  SUCCESS = 'success',
  ERROR = 'error',
  WARNING = 'warning',
  INFO = 'info',
}

// Format notification messages
export const formatNotification = (
  type: NotificationType,
  title: string,
  message: string,
  duration: number = 5000
) => {
  return {
    type,
    title,
    message,
    duration,
    timestamp: Date.now(),
  };
};

// ============ ANALYTICS UTILITIES ============

// Track user events for analytics
export const trackVaultPayEvent = (
  eventType: string,
  data: any = {},
  identity?: any
): void => {
  try {
    // This would integrate with the analytics canister in a real implementation
    const event = {
      type: eventType,
      data,
      timestamp: Date.now(),
      userPrincipal: identity?.getPrincipal()?.toString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
    };

    // Store locally for potential batch upload
    const events = JSON.parse(localStorage.getItem('vaultpay_events') || '[]');
    events.push(event);

    // Keep only last 100 events
    const recentEvents = events.slice(-100);
    localStorage.setItem('vaultpay_events', JSON.stringify(recentEvents));
  } catch (error) {
    console.error('Failed to track event:', error);
  }
};

// Common event types
export const VAULT_PAY_EVENTS = {
  ALIAS_REGISTERED: 'alias_registered',
  ALIAS_RESOLVED: 'alias_resolved',
  PAYMENT_SENT: 'payment_sent',
  PAYMENT_RECEIVED: 'payment_received',
  VAULT_DEPOSIT: 'vault_deposit',
  VAULT_WITHDRAWAL: 'vault_withdrawal',
  QR_CODE_GENERATED: 'qr_code_generated',
  QR_CODE_SCANNED: 'qr_code_scanned',
  DASHBOARD_VIEWED: 'dashboard_viewed',
  SETTINGS_UPDATED: 'settings_updated',
};

export default {
  getVaultPayConfig,
  formatVPTAmount,
  parseVPTAmount,
  formatPrincipal,
  formatTimestamp,
  validateAlias,
  validateVPTAmount,
  validatePrincipal,
  handleVaultPayError,
  saveUserSettings,
  loadUserSettings,
  saveRecentRecipient,
  loadRecentRecipients,
  generatePaymentQRData,
  parsePaymentQRData,
  calculateInterest,
  calculateProjectedInterest,
  trackVaultPayEvent,
  VAULT_PAY_EVENTS,
  ERROR_MESSAGES,
};
