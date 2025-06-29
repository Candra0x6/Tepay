import { useEffect, useState } from "react";
import { useAuth } from "./use-auth-client";
import useCanisterCalls from "./use-canister-calls";
import { Principal } from "@dfinity/principal";

// Hook for comprehensive token operations
export default function useTokenOperations() {
  const { identity, principal } = useAuth();
  const { token, analytics, loading, error } = useCanisterCalls({ identity });
  const [tokenData, setTokenData] = useState<any>(null);

  // Get user's token balance
  const getUserBalance = async () => {
    if (!principal) return null;

    const account = { owner: principal, subaccount: [] as [] };
    return await token.getBalance(account);
  };

  // Perform token transfer with analytics logging
  const performTransfer = async (
    recipientPrincipal: Principal,
    amount: bigint,
    memo?: string
  ) => {
    if (!principal) return null;
    const recipientAccount = {
      owner: recipientPrincipal,
      subaccount: [] as [],
    };
    const memoBytes = memo ? new TextEncoder().encode(memo) : undefined;

    const transferResult = await token.transfer({
      to: recipientAccount,
      amount: amount,
      memo: memoBytes,
    });

    if (transferResult && "Ok" in transferResult) {
      // Log the transfer event
      await analytics.logEvent(
        { Transfer: null },
        principal,
        amount,
        undefined,
        [
          ["recipient", recipientPrincipal.toString()],
          ["transaction_id", transferResult.Ok.toString()],
          ...(memo ? [["memo", memo] as [string, string]] : []),
        ]
      );
    }

    return transferResult;
  };

  // Approve token spending with analytics logging
  const performApproval = async (
    spender: Principal,
    amount: bigint,
    expiresAt?: bigint
  ) => {
    if (!principal) return null;

    const approvalResult = await token.approve({
      spender,
      amount,
      expires_at: expiresAt,
    });

    if (approvalResult && "Ok" in approvalResult) {
      // Log the approval event
      await analytics.logEvent(
        { Transfer: null },
        principal,
        amount,
        undefined,
        [
          ["spender", spender.toString()],
          ["approval_id", approvalResult.Ok.toString()],
          ...(expiresAt
            ? [["expires_at", expiresAt.toString()] as [string, string]]
            : []),
        ]
      );
    }

    return approvalResult;
  };

  // Transfer tokens from another account (requires approval)
  const performTransferFrom = async (
    fromPrincipal: Principal,
    toPrincipal: Principal,
    amount: bigint,
    memo?: string
  ) => {
    if (!principal) return null;

    const fromAccount = { owner: fromPrincipal, subaccount: [] as [] };
    const toAccount = { owner: toPrincipal, subaccount: [] as [] };
    const memoBytes = memo ? new TextEncoder().encode(memo) : undefined;

    const transferFromResult = await token.transferFrom({
      from: fromAccount,
      to: toAccount,
      amount,
      memo: memoBytes,
    });

    if (transferFromResult && "Ok" in transferFromResult) {
      // Log the transfer from event
      await analytics.logEvent(
        { Transfer: null },
        principal,
        amount,
        undefined,
        [
          ["from", fromPrincipal.toString()],
          ["to", toPrincipal.toString()],
          ["transaction_id", transferFromResult.Ok.toString()],
          ...(memo ? [["memo", memo] as [string, string]] : []),
        ]
      );
    }

    return transferFromResult;
  };

  // Get allowance for a spender
  const getAllowanceForSpender = async (spender: Principal) => {
    if (!principal) return null;

    const account = { owner: principal, subaccount: [] as [] };
    return await token.getAllowance(account, spender);
  };

  // Get user's transaction history
  const getUserTransactionHistory = async () => {
    if (!principal) return null;

    const account = { owner: principal, subaccount: [] as [] };
    return await token.getTransactionHistory(account);
  };

  // Get comprehensive token information
  const getTokenInfo = async () => {
    return await token.getTokenInfo();
  };

  // Initialize token with provided parameters
  const initializeToken = async (
    tokenName: string,
    tokenSymbol: string,
    initialSupply: bigint,
    tokenLogo: string
  ) => {
    if (!principal) return null;

    const initResult = await token.initializeToken({
      tokenName,
      tokenSymbol,
      initialSupply,
      tokenLogo,
      principal,
    });

    if (initResult && "Ok" in initResult) {
      // Log the token initialization event
      await analytics.logEvent(
        { Transfer: null },
        principal,
        initialSupply,
        undefined,
        [
          ["token_name", tokenName],
          ["token_symbol", tokenSymbol],
          ["initial_supply", initialSupply.toString()],
          ["action", "token_initialization"],
        ]
      );

      // Refresh token data after initialization
      await refreshTokenData();
    }

    return initResult;
  };

  // Batch operation: Get all user token data
  const getAllUserTokenData = async () => {
    if (!principal) return null;

    const [balance, transactionHistory, tokenInfo] = await Promise.all([
      getUserBalance(),
      getUserTransactionHistory(),
      getTokenInfo(),
    ]);

    return {
      balance,
      transactionHistory,
      tokenInfo,
    };
  };

  // Load initial token data
  useEffect(() => {
    const loadTokenData = async () => {
      if (!principal) return;

      const data = await getAllUserTokenData();
      setTokenData(data);
    };

    loadTokenData();
  }, [principal]);

  // Refresh token data
  const refreshTokenData = async () => {
    if (!principal) return;
    const data = await getAllUserTokenData();
    setTokenData(data);
    return data;
  };

  return {
    // Data
    tokenData,
    loading,
    error,

    // Operations
    performTransfer,
    performApproval,
    performTransferFrom,
    getUserBalance,
    getAllowanceForSpender,
    getUserTransactionHistory,
    getTokenInfo,
    getAllUserTokenData,
    refreshTokenData,
    initializeToken,

    // Direct access to token canister calls
    token,
    analytics,
  };
}
