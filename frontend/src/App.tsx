import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ErrorBoundary } from "@/components/error-boundary";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useAuthStore } from "@/stores/auth-store";
import { useEffect } from "react";

// ─── Layouts ─────────────────────────────────────────────────────────────────

import DashboardLayout from "@/layouts/DashboardLayout";
import AuthLayout from "@/layouts/AuthLayout";

// ─── Lazy-loaded Pages ───────────────────────────────────────────────────────

const LandingPage = lazy(() => import("@/pages/landing"));
const LoginPage = lazy(() => import("@/pages/auth/login"));
const RegisterPage = lazy(() => import("@/pages/auth/register"));
const ForgotPasswordPage = lazy(() => import("@/pages/auth/forgot-password"));
const ResetPasswordPage = lazy(() => import("@/pages/auth/reset-password"));

const AboutPage = lazy(() => import("@/pages/static-pages").then(m => ({ default: m.AboutPage })));
const BlogPage = lazy(() => import("@/pages/static-pages").then(m => ({ default: m.BlogPage })));
const CareersPage = lazy(() => import("@/pages/static-pages").then(m => ({ default: m.CareersPage })));
const IntegrationsPage = lazy(() => import("@/pages/static-pages").then(m => ({ default: m.IntegrationsPage })));
const PrivacyPolicyPage = lazy(() => import("@/pages/static-pages").then(m => ({ default: m.PrivacyPolicyPage })));
const TermsOfServicePage = lazy(() => import("@/pages/static-pages").then(m => ({ default: m.TermsOfServicePage })));

const DashboardPage = lazy(() => import("@/pages/dashboard"));
const PropertiesPage = lazy(() => import("@/pages/properties/index"));
const PropertyDetailPage = lazy(() => import("@/pages/properties/[id]"));
const PermitsPage = lazy(() => import("@/pages/permits"));
const NightCapsPage = lazy(() => import("@/pages/night-caps"));
const DocumentsPage = lazy(() => import("@/pages/documents"));
const EuRegistrationPage = lazy(() => import("@/pages/eu-registration/index"));
const EuRegistrationPropertyPage = lazy(() => import("@/pages/eu-registration/[propertyId]"));
const AuCompliancePage = lazy(() => import("@/pages/au-compliance/index"));
const UsTaxPage = lazy(() => import("@/pages/us-tax/index"));
const AlertsPage = lazy(() => import("@/pages/alerts"));
const SettingsPage = lazy(() => import("@/pages/settings"));
const BillingPage = lazy(() => import("@/pages/billing"));

// ─── Query Client ────────────────────────────────────────────────────────────

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// ─── Page Loading Fallback ───────────────────────────────────────────────────

function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <LoadingSpinner size="lg" />
    </div>
  );
}

// ─── Public Only Route (redirects to dashboard if authenticated) ─────────────

function PublicOnlyRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore();
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  return <>{children}</>;
}

// ─── Protected Route (redirects to login if unauthenticated) ─────────────────

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}

// ─── Landing Route (redirects to dashboard if authenticated) ─────────────────

function LandingRoute() {
  const { isAuthenticated } = useAuthStore();
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  return <LandingPage />;
}

// ─── App ─────────────────────────────────────────────────────────────────────

function App() {
  const { loadUser } = useAuthStore();

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider delayDuration={200}>
          <BrowserRouter>
            <Suspense fallback={<PageLoader />}>
              <Routes>
                {/* Landing Page — Public (redirects to dashboard if authenticated) */}
                <Route path="/" element={<LandingRoute />} />

                {/* Static Pages — Public */}
                <Route path="/about" element={<AboutPage />} />
                <Route path="/blog" element={<BlogPage />} />
                <Route path="/careers" element={<CareersPage />} />
                <Route path="/integrations" element={<IntegrationsPage />} />
                <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
                <Route path="/terms-of-service" element={<TermsOfServicePage />} />

                {/* Auth Routes — Public Only */}
                <Route
                  element={
                    <PublicOnlyRoute>
                      <AuthLayout />
                    </PublicOnlyRoute>
                  }
                >
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                  <Route path="/reset-password" element={<ResetPasswordPage />} />
                </Route>

                {/* Dashboard Routes */}
                <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
                  <Route path="/dashboard" element={<DashboardPage />} />
                  <Route path="/properties" element={<PropertiesPage />} />
                  <Route path="/properties/:id" element={<PropertyDetailPage />} />
                  <Route path="/permits" element={<PermitsPage />} />
                  <Route path="/night-caps" element={<NightCapsPage />} />
                  <Route path="/documents" element={<DocumentsPage />} />
                  <Route path="/eu-registration" element={<EuRegistrationPage />} />
                  <Route path="/eu-registration/:propertyId" element={<EuRegistrationPropertyPage />} />
                  <Route path="/au-compliance" element={<AuCompliancePage />} />
                  <Route path="/us-tax" element={<UsTaxPage />} />
                  <Route path="/alerts" element={<AlertsPage />} />
                  <Route path="/settings" element={<SettingsPage />} />
                  <Route path="/billing" element={<BillingPage />} />
                </Route>

                {/* Catch-all Redirect */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Suspense>
          </BrowserRouter>

          {/* Toast Notifications */}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: "hsl(var(--background))",
                color: "hsl(var(--foreground))",
                border: "1px solid hsl(var(--border))",
              },
            }}
          />
        </TooltipProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
