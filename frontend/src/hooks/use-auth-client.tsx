import {
  AuthClient,
  AuthClientCreateOptions,
  AuthClientLoginOptions,
} from "@dfinity/auth-client";
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { ActorSubclass, Identity } from "@dfinity/agent";
import { Principal } from "@dfinity/principal";
import toast from "react-hot-toast";
import { canisterId, createActor } from "@declarations/auth";
import { _SERVICE } from "@declarations/auth/auth.did";

interface AuthOptions {
  createOptions?: AuthClientCreateOptions;
  loginOptions?: AuthClientLoginOptions;
}

interface AuthContextType {
  isAuthenticated: boolean;
  login: () => void;
  logout: () => Promise<void>;
  authClient: AuthClient | null;
  authActor: ActorSubclass<_SERVICE>;
  identity: Identity | null;
  principal: Principal | null;
  user: UserCredentials | null;
  setUser: (user: UserCredentials) => void;
}

type AuthProviderProps = {
  children: ReactNode;
};

export type UserCredentials = {
  name: string;
  email: string;
  principalAddress: string;
  identity: Identity | null;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const getIdentityProvider = (): string | undefined => {
  let idpProvider: string | undefined;
  if (typeof window !== "undefined") {
    const isLocal = process.env.DFX_NETWORK !== "ic";
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

    if (isLocal && isSafari) {
      idpProvider = `http://localhost:4943/?canisterId=${process.env.CANISTER_ID_INTERNET_IDENTITY}`;
    } else if (isLocal) {
      idpProvider = `http://${process.env.CANISTER_ID_INTERNET_IDENTITY}.localhost:4943`;
    }
  }
  return idpProvider;
};

export const defaultOptions: AuthOptions = {
  createOptions: {
    idleOptions: {
      disableIdle: true,
    },
  },
  loginOptions: {
    identityProvider: getIdentityProvider(),
  },
};

export const useAuthClient = (
  options: AuthOptions = defaultOptions
): AuthContextType => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [authClient, setAuthClient] = useState<AuthClient | null>(null);
  const [identity, setIdentity] = useState<Identity | null>(null);
  const [principal, setPrincipal] = useState<Principal | null>(null);
  const [authActor, setAuthActor] = useState<ActorSubclass<any> | null>(null);
  const [user, setUser] = useState<UserCredentials | null>(null);

  useEffect(() => {
    AuthClient.create(options.createOptions).then(async (client) => {
      await updateClient(client);
    });
  }, []);

  // Logic to handle authentication state changes
  const login = async () => {
    if (!authClient) return;
    authClient.login({
      ...options.loginOptions,
      onSuccess: () => {
        updateClient(authClient);
        toast.success("Internet Identity Login Successful");
      },
    });
  };

  async function updateClient(client: AuthClient) {
    const isAuthenticated = await client.isAuthenticated();
    setIsAuthenticated(isAuthenticated);

    const identity = client.getIdentity();
    setIdentity(identity);

    const principal = identity.getPrincipal();
    setPrincipal(principal);

    setAuthClient(client);

    const actor = createActor(canisterId, {
      agentOptions: {
        // @ts-ignore
        identity,
      },
    });

    setAuthActor(actor);

    if (isAuthenticated) {
      console.log("Login Successful!");
    }
  }

  //  This function is called when the user logs out
  async function logout() {
    if (authClient) {
      await authClient.logout();
      toast.success("Logout Successful");
      await updateClient(authClient);
    }
  }

  return {
    isAuthenticated,
    login,
    logout,
    authClient,
    identity,
    principal,
    authActor,
    user,
    setUser,
  };
};

//  This is the AuthProvider component that provides the authentication context to the application
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const auth = useAuthClient();
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};

//  This is a custom hook to use the AuthContext in other components
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
