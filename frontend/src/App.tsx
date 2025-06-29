import { useAuth, AuthProvider } from "./hooks/use-auth-client";
import {
  BrowserRouter,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { auth } from "@declarations/auth";
// Others
import { RegistrationProvider } from "./utils/RegistrationContext";
import { Toaster } from "react-hot-toast";
import CryptoPage from "./pages/landing-page";
import DashboardPage from "./pages/dashboard/dashboard-page";
import Navbar from "./components/elements/navigation-bar";
import Footer from "./components/elements/footer";
import CryptoCard from "./components/wallet-card";
import LandingPage from "./pages/landing-page";
import ProtectedRoute from "./utils/ProtectedRoute";
import PaymentPage from "./pages/send/send-link-page";
import { NameSetupPage } from "./pages/name-setup/name-setup-page";

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
        <Navbar />
        {!loading && (
          <Routes location={location} key={location.pathname}>
            {/* DEFAULT PAGES SECTION */}

            <Route path="/" element={<LandingPage />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/name-setup"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                  <NameSetupPage />
                </ProtectedRoute>
              }
            />
            <Route path="/send/:alias" element={<PaymentPage />} />
          </Routes>
        )}
      </AnimatePresence>
    </>
  );
};

const App: React.FC = () => {
  const { isAuthenticated, principal } = useAuth();
  //  State to track if the user is registered - Temporary unused right now
  const [isRegistered, setIsRegistered] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  if (!auth) return null;

  useEffect(() => {
    const checkIfRegistered = async () => {
      if (isAuthenticated && principal) {
        try {
          // @ts-ignore
          const result = await auth.getUserByPrincipal(principal);
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
