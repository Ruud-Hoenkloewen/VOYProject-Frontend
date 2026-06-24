import { lazy, Suspense, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";

// ── Lazy loading — cada ruta descarga su chunk solo cuando se necesita
const LandingPage          = lazy(() => import("./pages/landing/LandingPage"));
const EventsPage           = lazy(() => import("./pages/events/EventsPage"));
const EventDetailPage      = lazy(() => import("./pages/events/EventDetailPage"));
const RegisterPage         = lazy(() => import("./pages/auth/RegisterPage"));
const LoginPage            = lazy(() => import("./pages/auth/LoginPage"));
const CheckoutPage         = lazy(() => import("./pages/checkout/CheckoutPage"));
const CheckoutFormPage     = lazy(() => import("./pages/checkout/CheckoutFormPage"));
const CheckoutPaymentPage  = lazy(() => import("./pages/checkout/CheckoutPaymentPage"));
const PurchaseSuccessPage  = lazy(() => import("./pages/checkout/PurchaseSuccessPage"));
const OnboardingPage       = lazy(() => import("./pages/auth/OnboardingPage"));
const ProfilePage          = lazy(() => import("./pages/profile/ProfilePage"));
const ProfileEditPage      = lazy(() => import("./pages/profile/ProfileEditPage"));
const AdminDashboard       = lazy(() => import("./pages/dashboard/AdminDashboard"));
const ProducerDashboard    = lazy(() => import("./pages/dashboard/ProducerDashboard"));

/** Componente utilitario para resetear el scroll al principio al cambiar de ruta */
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

/** Fallback minimalista durante la carga del chunk */
function PageLoader() {
  return (
    <div className="page-loader">
      <span className="page-loader__text">CARGANDO...</span>
    </div>
  );
}

/** Redirige a / si el usuario ya está autenticado */
function ProtectedLoginRoute() {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Navigate to="/" replace /> : <LoginPage />;
}



/**
 * Ruta de onboarding — solo accesible para usuarios autenticados
 * que no hayan completado el onboarding todavía.
 */
function OnboardingRoute() {
  return <OnboardingPage />;
}

/**
 * Cada página gestiona su propio header:
 * - LandingPage      → EditorialHeader con nav links
 * - EventsPage       → Navbar con buscador
 * - EventDetailPage  → Navbar minimalista
 * - RegisterPage / LoginPage → nav mínima
 */
export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/"           element={<LandingPage />} />
            <Route path="/events"     element={<EventsPage />} />
            <Route path="/events/:id" element={<EventDetailPage />} />
            <Route path="/events/:id/checkout" element={
              <ProtectedRoute><CheckoutPage /></ProtectedRoute>
            } />
            <Route path="/events/:id/checkout/datos" element={
              <ProtectedRoute><CheckoutFormPage /></ProtectedRoute>
            } />
            <Route path="/events/:id/checkout/pago" element={
              <ProtectedRoute><CheckoutPaymentPage /></ProtectedRoute>
            } />
            <Route path="/compra/confirmacion" element={
              <ProtectedRoute><PurchaseSuccessPage /></ProtectedRoute>
            } />
            <Route path="/register"   element={<RegisterPage />} />
            <Route path="/login"      element={<ProtectedLoginRoute />} />
            <Route path="/onboarding" element={<OnboardingRoute />} />
            <Route path="/profile/:username" element={<ProfilePage />} />
            <Route path="/profile/edit" element={
              <ProtectedRoute><ProfileEditPage /></ProtectedRoute>
            } />
            <Route path="/dashboard/admin" element={
              <ProtectedRoute allowedRoles={["admin"]}><AdminDashboard /></ProtectedRoute>
            } />
            <Route path="/dashboard/producer" element={
              <ProtectedRoute allowedRoles={["producer"]}><ProducerDashboard /></ProtectedRoute>
            } />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </AuthProvider>
  );
}
