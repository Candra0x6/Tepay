import { useAuth, AuthProvider } from "./utility/use-auth-client";
import {
  BrowserRouter,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

// Others

import { RegistrationProvider } from "./utility/RegistrationContext";
import InternetIdentityPage from "./pages/auth/internet-identity-login";

  import { backend } from "@declarations/backend";


const LoadingScreen = ({ onComplete }: { onComplete: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      exit={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="fixed inset-0 flex justify-center items-center bg-white z-50"
    ></motion.div>
  );
};

const AnimatedRoutes: React.FC = () => {
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuth();


  return (
    <>

      {loading && <LoadingScreen onComplete={() => setLoading(false)} />}

      <AnimatePresence mode="wait">

        {/* <Navbar /> */}
        {!loading && (
          <Routes location={location} key={location.pathname}>
            {/* DEFAULT PAGES SECTION */}

            <Route path="/" element={
                <div className="">
                  <h1>Hello World</h1>
                </div>
              
            } />

        
            <Route
              path="/internet-identity"
              element={
                <div className="">
                  <InternetIdentityPage />
                </div>
              }
            />

         
          </Routes>
        )}
      </AnimatePresence>
    </>
  );
};

const App: React.FC = () => {
  const auth = useAuth();
  const [isRegistered, setIsRegistered] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  if (!auth) return null;

  const { isAuthenticated, principal } = auth;
  console.log("isAuthenticated ", isAuthenticated);

  useEffect(() => {
    const checkIfRegistered = async () => {
      if (isAuthenticated && principal) {
        try {

          // @ts-ignore
          const result = await backend.getUserByPrincipal(principal);
          result ? setIsRegistered(true) : setIsRegistered(false);
        } catch (error) {
          console.error("Error checking registration:", error);
        }
      }
      setLoading(false);
    };

    if (isAuthenticated && principal) {
      checkIfRegistered();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, principal]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <main id="pageContent">
      <BrowserRouter>
        {/* @ts-ignore */}
        <Toaster position="top-center" />
        <AnimatedRoutes />
      </BrowserRouter>
    </main>
  );
};

export default () => (
  <AuthProvider>
    <RegistrationProvider>
      <App />
    </RegistrationProvider>
  </AuthProvider>
);
