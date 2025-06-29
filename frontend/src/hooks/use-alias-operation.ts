import { useAuth } from "./use-auth-client";
import useCanisterCalls from "./use-canister-calls";


export default function useAliasOperations() {
  const { identity, principal } = useAuth();
  const { alias, analytics, loading, error } = useCanisterCalls({ identity });

  const registerUserAlias = async (
    aliasName: string,
    description?: string,
    icon?: string
  ) => {
    if (!principal) return null;

    const result = await alias.registerAlias(aliasName, description, icon);

    if (result && "ok" in result) {
      // Log alias registration
      await analytics.logEvent(
        { AliasRegistration: null },
        principal,
        undefined,
        aliasName,
        [["action", "register"]]
      );
    }

    return result;
  };

  const getUserAliases = async () => {
    if (!principal) return null;
    return await alias.getAliasesOf(principal);
  };

  const checkAliasAvailability = async (aliasName: string) => {
    return await alias.isAliasAvailable(aliasName);
  };

  return {
    loading,
    error,
    registerUserAlias,
    getUserAliases,
    checkAliasAvailability,
    updateAlias: alias.updateAliasMetadata,
    removeAlias: alias.removeAlias,
    resolveAlias: alias.resolveAlias,
    getAliasInfo: alias.getAliasInfo,
  };
};
