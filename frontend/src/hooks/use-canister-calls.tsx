import { useState, useCallback } from "react";
import { ActorSubclass, Identity } from "@dfinity/agent";
import { Principal } from "@dfinity/principal";
import toast from "react-hot-toast";

// Import all canister declarations
import {
  createActor as createAuthActor,
  canisterId as authCanisterId,
} from "@declarations/auth";
import {
  createActor as createTokenActor,
  canisterId as tokenCanisterId,
} from "@declarations/token";
import {
  createActor as createAliasActor,
  canisterId as aliasCanisterId,
} from "@declarations/alias_registry";
import {
  createActor as createAnalyticsActor,
  canisterId as analyticsCanisterId,
} from "@declarations/analytics_logger";

// Import service types
import { _SERVICE as AuthService } from "@declarations/auth/auth.did";
import { _SERVICE as TokenService } from "@declarations/token/token.did";
import { _SERVICE as AliasService } from "@declarations/alias_registry/alias_registry.did";
import { _SERVICE as AnalyticsService } from "@declarations/analytics_logger/analytics_logger.did";

// Import types
import type {
  UserProfile,
  AuthError,
  Result as AuthResult,
} from "@declarations/auth/auth.did";
import type {
  Account,
  Tokens,
  Transaction,
  ApproveResult,
  TransferFromResult,
  Result_1 as TransferResult,
  Allowance,
} from "@declarations/token/token.did";
import type {
  AliasEntry,
  AliasRegistrationResult,
  AliasError,
} from "@declarations/alias_registry/alias_registry.did";
import type {
  AnalyticsEvent,
  EventType,
} from "@declarations/analytics_logger/analytics_logger.did";

interface UseCanisterCallsProps {
  identity?: Identity | null;
}

interface CallState {
  loading: boolean;
  error: string | null;
}

export const useCanisterCalls = ({ identity }: UseCanisterCallsProps = {}) => {
  const [callState, setCallState] = useState<CallState>({
    loading: false,
    error: null,
  });

  // Helper function to create actors with identity
  const createActorWithIdentity = useCallback(
    (createActorFn: any, canisterId: string) => {
      return createActorFn(canisterId, {
        agentOptions: {
          identity,
        },
      });
    },
    [identity]
  );

  // Generic call wrapper
  const callCanister = useCallback(async function <T>(
    actorCall: () => Promise<T>,
    successMessage?: string,
    errorMessage?: string
  ): Promise<T | null> {
    setCallState({ loading: true, error: null });

    try {
      const result = await actorCall();

      // @ts-ignore
      if (successMessage) {
        toast.success(successMessage);
      }

      setCallState({ loading: false, error: null });
      return result;
    } catch (error) {
      const errorMsg =
        error instanceof Error ? error.message : "Unknown error occurred";
      setCallState({ loading: false, error: errorMsg });

      if (errorMessage) {
        toast.error(`${errorMessage}: ${errorMsg}`);
      } else {
        toast.error(errorMsg);
      }

      return null;
    }
  },
  []);

  // ============= AUTH CANISTER HOOKS =============
  const authCalls = {
    registerUser: useCallback(async (): Promise<AuthResult | null> => {
      const actor = createActorWithIdentity(
        createAuthActor,
        authCanisterId
      ) as ActorSubclass<AuthService>;
      return callCanister(
        () => actor.registerUser(),
        "User registered successfully",
        "Failed to register user"
      );
    }, [createActorWithIdentity, callCanister]),

    getUserByPrincipal: useCallback(
      async (principal: Principal): Promise<UserProfile | null> => {
        const actor = createActorWithIdentity(
          createAuthActor,
          authCanisterId
        ) as ActorSubclass<AuthService>;
        const result = await callCanister(
          () => actor.getUserByPrincipal(principal),
          undefined,
          "Failed to get user profile"
        );
        return result?.[0] || null;
      },
      [createActorWithIdentity, callCanister]
    ),

    whoami: useCallback(async (): Promise<Principal | null> => {
      const actor = createActorWithIdentity(
        createAuthActor,
        authCanisterId
      ) as ActorSubclass<AuthService>;
      return callCanister(
        () => actor.whoami(),
        undefined,
        "Failed to get principal"
      );
    }, [createActorWithIdentity, callCanister]),

    greet: useCallback(
      async (name: string): Promise<string | null> => {
        const actor = createActorWithIdentity(
          createAuthActor,
          authCanisterId
        ) as ActorSubclass<AuthService>;
        return callCanister(
          () => actor.greet(name),
          undefined,
          "Failed to greet"
        );
      },
      [createActorWithIdentity, callCanister]
    ),
  };

  // ============= TOKEN CANISTER HOOKS =============
  const tokenCalls = {
    getBalance: useCallback(
      async (account: Account): Promise<Tokens | null> => {
        const actor = createActorWithIdentity(
          createTokenActor,
          tokenCanisterId
        ) as ActorSubclass<TokenService>;
        return callCanister(
          () => actor.icrc1_balance_of(account),
          undefined,
          "Failed to get balance"
        );
      },
      [createActorWithIdentity, callCanister]
    ),

    transfer: useCallback(
      async (transferArgs: {
        to: Account;
        amount: Tokens;
        fee?: Tokens;
        memo?: Uint8Array;
        from_subaccount?: Uint8Array;
        created_at_time?: bigint;
      }): Promise<TransferResult | null> => {
        const actor = createActorWithIdentity(
          createTokenActor,
          tokenCanisterId
        ) as ActorSubclass<TokenService>;
        return callCanister(
          () =>
            actor.icrc1_transfer({
              to: transferArgs.to,
              amount: transferArgs.amount,
              fee: transferArgs.fee ? [transferArgs.fee] : [],
              memo: transferArgs.memo ? [transferArgs.memo] : [],
              from_subaccount: transferArgs.from_subaccount
                ? [transferArgs.from_subaccount]
                : [],
              created_at_time: transferArgs.created_at_time
                ? [transferArgs.created_at_time]
                : [],
            }),
          "Transfer successful",
          "Failed to transfer tokens"
        );
      },
      [createActorWithIdentity, callCanister]
    ),

    approve: useCallback(
      async (approveArgs: {
        spender: Principal;
        amount: Tokens;
        fee?: bigint;
        memo?: Uint8Array;
        from_subaccount?: Uint8Array;
        created_at_time?: bigint;
        expires_at?: bigint;
      }): Promise<ApproveResult | null> => {
        const actor = createActorWithIdentity(
          createTokenActor,
          tokenCanisterId
        ) as ActorSubclass<TokenService>;
        return callCanister(
          () =>
            actor.icrc2_approve({
              spender: approveArgs.spender,
              amount: approveArgs.amount,
              fee: approveArgs.fee ? [approveArgs.fee] : [],
              memo: approveArgs.memo ? [approveArgs.memo] : [],
              from_subaccount: approveArgs.from_subaccount
                ? [approveArgs.from_subaccount]
                : [],
              created_at_time: approveArgs.created_at_time
                ? [approveArgs.created_at_time]
                : [],
              expires_at: approveArgs.expires_at
                ? [approveArgs.expires_at]
                : [],
            }),
          "Approval successful",
          "Failed to approve tokens"
        );
      },
      [createActorWithIdentity, callCanister]
    ),

    transferFrom: useCallback(
      async (transferFromArgs: {
        from: Account;
        to: Account;
        amount: bigint;
        fee?: bigint;
        memo?: Uint8Array;
        spender_subaccount?: Uint8Array;
        created_at_time?: bigint;
      }): Promise<TransferFromResult | null> => {
        const actor = createActorWithIdentity(
          createTokenActor,
          tokenCanisterId
        ) as ActorSubclass<TokenService>;
        return callCanister(
          () =>
            actor.icrc2_transfer_from({
              from: transferFromArgs.from,
              to: transferFromArgs.to,
              amount: transferFromArgs.amount,
              fee: transferFromArgs.fee ? [transferFromArgs.fee] : [],
              memo: transferFromArgs.memo ? [transferFromArgs.memo] : [],
              spender_subaccount: transferFromArgs.spender_subaccount
                ? [transferFromArgs.spender_subaccount]
                : [],
              created_at_time: transferFromArgs.created_at_time
                ? [transferFromArgs.created_at_time]
                : [],
            }),
          "Transfer from successful",
          "Failed to transfer from account"
        );
      },
      [createActorWithIdentity, callCanister]
    ),

    getAllowance: useCallback(
      async (
        account: Account,
        spender: Principal
      ): Promise<Allowance | null> => {
        const actor = createActorWithIdentity(
          createTokenActor,
          tokenCanisterId
        ) as ActorSubclass<TokenService>;
        return callCanister(
          () => actor.icrc2_allowance({ account, spender }),
          undefined,
          "Failed to get allowance"
        );
      },
      [createActorWithIdentity, callCanister]
    ),

    getTokenInfo: useCallback(async () => {
      const actor = createActorWithIdentity(
        createTokenActor,
        tokenCanisterId
      ) as ActorSubclass<TokenService>;
      const [name, symbol, decimals, totalSupply, fee] = await Promise.all([
        callCanister(() => actor.icrc1_name()),
        callCanister(() => actor.icrc1_symbol()),
        callCanister(() => actor.icrc1_decimals()),
        callCanister(() => actor.icrc1_total_supply()),
        callCanister(() => actor.icrc1_fee()),
      ]);

      return { name, symbol, decimals, totalSupply, fee };
    }, [createActorWithIdentity, callCanister]),

    getTransactionHistory: useCallback(
      async (account: Account): Promise<Transaction[] | null> => {
        const actor = createActorWithIdentity(
          createTokenActor,
          tokenCanisterId
        ) as ActorSubclass<TokenService>;
        return callCanister(
          () => actor.transactionHistoryOf(account),
          undefined,
          "Failed to get transaction history"
        );
      },
      [createActorWithIdentity, callCanister]
    ),

    initializeToken: useCallback(
      async (initArgs: {
        tokenName: string;
        tokenSymbol: string;
        initialSupply: bigint;
        tokenLogo: string;
        principal: Principal;
      }): Promise<{ Ok: string } | { Err: string } | null> => {
        const actor = createActorWithIdentity(
          createTokenActor,
          tokenCanisterId
        ) as ActorSubclass<TokenService>;
        return callCanister(
          () => actor.initializeToken(initArgs),
          "Token initialized successfully",
          "Failed to initialize token"
        );
      },
      [createActorWithIdentity, callCanister]
    ),
  };

  // ============= ALIAS REGISTRY CANISTER HOOKS =============
  const aliasCalls = {
    registerAlias: useCallback(
      async (
        alias: string,
        description?: string,
        icon?: string
      ): Promise<AliasRegistrationResult | null> => {
        const actor = createActorWithIdentity(
          createAliasActor,
          aliasCanisterId
        ) as ActorSubclass<AliasService>;
        return callCanister(
          () =>
            actor.register_alias(
              alias,
              description ? [description] : [],
              icon ? [icon] : []
            ),
          "Alias registered successfully",
          "Failed to register alias"
        );
      },
      [createActorWithIdentity, callCanister]
    ),

    removeAlias: useCallback(
      async (alias: string): Promise<AliasRegistrationResult | null> => {
        const actor = createActorWithIdentity(
          createAliasActor,
          aliasCanisterId
        ) as ActorSubclass<AliasService>;
        return callCanister(
          () => actor.remove_alias(alias),
          "Alias removed successfully",
          "Failed to remove alias"
        );
      },
      [createActorWithIdentity, callCanister]
    ),

    updateAliasMetadata: useCallback(
      async (
        alias: string,
        new_alias: string,
        description?: string,
        icon?: string
      ): Promise<AliasRegistrationResult | null> => {
        const actor = createActorWithIdentity(
          createAliasActor,
          aliasCanisterId
        ) as ActorSubclass<AliasService>;
        return callCanister(
          () =>
            actor.update_alias_metadata(
              alias,
              new_alias,
              description ? [description] : [],
              icon ? [icon] : []
            ),
          "Alias updated successfully",
          "Failed to update alias"
        );
      },
      [createActorWithIdentity, callCanister]
    ),

    resolveAlias: useCallback(
      async (alias: string): Promise<Principal | null> => {
        const actor = createActorWithIdentity(
          createAliasActor,
          aliasCanisterId
        ) as ActorSubclass<AliasService>;
        const result = await callCanister(
          () => actor.resolve_alias(alias),
          undefined,
          "Failed to resolve alias"
        );
        return result?.[0] || null;
      },
      [createActorWithIdentity, callCanister]
    ),

    getAliasInfo: useCallback(
      async (alias: string): Promise<AliasEntry | null> => {
        const actor = createActorWithIdentity(
          createAliasActor,
          aliasCanisterId
        ) as ActorSubclass<AliasService>;
        const result = await callCanister(
          () => actor.get_alias_info(alias),
          undefined,
          "Failed to get alias info"
        );
        return result?.[0] || null;
      },
      [createActorWithIdentity, callCanister]
    ),

    getAliasesOf: useCallback(
      async (principal: Principal): Promise<string[] | null> => {
        const actor = createActorWithIdentity(
          createAliasActor,
          aliasCanisterId
        ) as ActorSubclass<AliasService>;
        return callCanister(
          () => actor.get_aliases_of(principal),
          undefined,
          "Failed to get aliases"
        );
      },
      [createActorWithIdentity, callCanister]
    ),

    isAliasAvailable: useCallback(
      async (alias: string): Promise<boolean | null> => {
        const actor = createActorWithIdentity(
          createAliasActor,
          aliasCanisterId
        ) as ActorSubclass<AliasService>;
        return callCanister(
          () => actor.is_alias_available(alias),
          undefined,
          "Failed to check alias availability"
        );
      },
      [createActorWithIdentity, callCanister]
    ),

    getAllAliases: useCallback(async (): Promise<Array<
      [string, AliasEntry]
    > | null> => {
      const actor = createActorWithIdentity(
        createAliasActor,
        aliasCanisterId
      ) as ActorSubclass<AliasService>;
      return callCanister(
        () => actor.get_all_aliases(),
        undefined,
        "Failed to get all aliases"
      );
    }, [createActorWithIdentity, callCanister]),
  };

  // ============= ANALYTICS LOGGER CANISTER HOOKS =============
  const analyticsCalls = {
    logEvent: useCallback(
      async (
        eventType: EventType,
        principal: Principal,
        amount?: bigint,
        alias?: string,
        metadata?: Array<[string, string]>
      ): Promise<bigint | null> => {
        const actor = createActorWithIdentity(
          createAnalyticsActor,
          analyticsCanisterId
        ) as ActorSubclass<AnalyticsService>;
        return callCanister(
          () =>
            actor.log_event(
              eventType,
              principal,
              amount ? [amount] : [],
              alias ? [alias] : [],
              metadata ? [metadata] : []
            ),
          undefined,
          "Failed to log event"
        );
      },
      [createActorWithIdentity, callCanister]
    ),

    getRecentEvents: useCallback(
      async (limit?: bigint): Promise<AnalyticsEvent[] | null> => {
        const actor = createActorWithIdentity(
          createAnalyticsActor,
          analyticsCanisterId
        ) as ActorSubclass<AnalyticsService>;
        return callCanister(
          () => actor.get_recent_events(limit ? [limit] : []),
          undefined,
          "Failed to get recent events"
        );
      },
      [createActorWithIdentity, callCanister]
    ),

    getEventsByPrincipal: useCallback(
      async (
        principal: Principal,
        limit?: bigint
      ): Promise<AnalyticsEvent[] | null> => {
        const actor = createActorWithIdentity(
          createAnalyticsActor,
          analyticsCanisterId
        ) as ActorSubclass<AnalyticsService>;
        return callCanister(
          () => actor.get_events_by_principal(principal, limit ? [limit] : []),
          undefined,
          "Failed to get events by principal"
        );
      },
      [createActorWithIdentity, callCanister]
    ),

    getEventsByType: useCallback(
      async (
        eventType: EventType,
        limit?: bigint
      ): Promise<AnalyticsEvent[] | null> => {
        const actor = createActorWithIdentity(
          createAnalyticsActor,
          analyticsCanisterId
        ) as ActorSubclass<AnalyticsService>;
        return callCanister(
          () => actor.get_events_by_type(eventType, limit ? [limit] : []),
          undefined,
          "Failed to get events by type"
        );
      },
      [createActorWithIdentity, callCanister]
    ),

    getEventsByAlias: useCallback(
      async (
        alias: string,
        limit?: bigint
      ): Promise<AnalyticsEvent[] | null> => {
        const actor = createActorWithIdentity(
          createAnalyticsActor,
          analyticsCanisterId
        ) as ActorSubclass<AnalyticsService>;
        return callCanister(
          () => actor.get_events_by_alias(alias, limit ? [limit] : []),
          undefined,
          "Failed to get events by alias"
        );
      },
      [createActorWithIdentity, callCanister]
    ),

    getAnalyticsSummary: useCallback(async () => {
      const actor = createActorWithIdentity(
        createAnalyticsActor,
        analyticsCanisterId
      ) as ActorSubclass<AnalyticsService>;
      return callCanister(
        () => actor.get_analytics_summary(),
        undefined,
        "Failed to get analytics summary"
      );
    }, [createActorWithIdentity, callCanister]),

    getEventCount: useCallback(async (): Promise<bigint | null> => {
      const actor = createActorWithIdentity(
        createAnalyticsActor,
        analyticsCanisterId
      ) as ActorSubclass<AnalyticsService>;
      return callCanister(
        () => actor.get_event_count(),
        undefined,
        "Failed to get event count"
      );
    }, [createActorWithIdentity, callCanister]),
  };

  return {
    // State
    loading: callState.loading,
    error: callState.error,

    // Canister calls
    auth: authCalls,
    token: tokenCalls,
    alias: aliasCalls,
    analytics: analyticsCalls,

    // Utility
    clearError: () => setCallState((prev) => ({ ...prev, error: null })),
  };
};

export default useCanisterCalls;
