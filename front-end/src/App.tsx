
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import { useAuth } from "./hooks/useAuth";
import History from "./pages/History";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";
import Withdrawal from "./pages/Withdrawal";
import Deposit from "./pages/Deposit";
import Chat from "./pages/Chat";
import Admin from "./pages/Admin";
import UserMessages from "./pages/UserMessages";
import UserNotifications from "./pages/UserNotifications";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import NotFound from "./pages/NotFound";
import { Toaster } from "sonner";
import { QueryProvider } from "./lib/query/react-provider";
import { AuthProvider } from "./context/AuthProvider";
import TradingInterface from "./pages/BuySell";
import RealtimeChart from "./pages/chart";
import RealtimeLineAreaChart from "./pages/chart2";
import Index from "./pages/LandingPage";
import TradingChart from "./pages/MainChart";
import CustomerServicePage from "./pages/CustomerServices";
import OPTEmail from "./pages/OTPEmail";
import OTPVerificationPage from "./pages/OTPCodeVerification";
import DeskTopChart from "./pages/DeskTopChart";

const queryClient = new QueryClient();

const AppContent = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-lg">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <main>
      <Routes>
        {/* Public routes */}
        <Route
          path="/signin"
          element={isAuthenticated ? <Navigate to="/" replace /> : <SignIn />}
        />
        <Route
          path="/signup"
          element={isAuthenticated ? <Navigate to="/" replace /> : <SignUp />}
        />

        <Route
          path="/landing"
          element={isAuthenticated ? <Navigate to="/" replace /> : <Index />}
        />

<Route
          path="/otp-email"
          element={isAuthenticated ? <Navigate to="/" replace /> : <OPTEmail />}
        />

<Route
          path="/otp-code/:sessionId"
          element={isAuthenticated ? <Navigate to="/" replace /> : <OTPVerificationPage />}
        />
       

        {/* Protected routes */}
        <Route path="/*" element={
          <ProtectedRoute>
            <Layout>
              <Routes>
                <Route path="/history" element={<History />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/withdrawal" element={<Withdrawal />} />
                <Route path="/deposit" element={<Deposit />} />
                <Route path="/chat/:userId" element={<Chat />} />
                <Route path="/buy" element={<TradingInterface />} />
                <Route path="/notifications/:notId" element={<UserNotifications />} />
                <Route path="/chart" element={<TradingChart />} />
                <Route path="/chat" element={<CustomerServicePage />} />
                <Route path="/desk-chat" element={<DeskTopChart />} />

                {/* Admin routes */}
                <Route path="/admin" element={
                  <ProtectedRoute requireAdmin>
                    <Admin />
                  </ProtectedRoute>
                } />
                <Route path="/admin/user/:userId/messages" element={
                  <ProtectedRoute requireAdmin>
                    <UserMessages />
                  </ProtectedRoute>
                } />
                <Route path="/admin/user/:userId/notifications" element={
                  <ProtectedRoute requireAdmin>
                    <UserNotifications />
                  </ProtectedRoute>
                } />

                {/* Catch-all route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Layout>
          </ProtectedRoute>
        } />
      </Routes>
      <Toaster />
    </main>

  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster richColors  />
      <BrowserRouter>
        <QueryProvider>
          < AuthProvider>
            <AppContent />
          </AuthProvider>

        </QueryProvider>

      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
