// ============ VAULT PAY UTILITIES ============

import { Principal } from "@dfinity/principal";



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



export default {
  formatVPTAmount,
  parseVPTAmount,
  formatPrincipal,
  formatTimestamp,
  validateAlias,
  validateVPTAmount,
  
};
