import { lazy, Suspense, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from "../context/AuthContext";

// ── Lazy loading — cada ruta descarga su chunk solo cuando se necesita
const LandingPage          = lazy(() => import("../pages/LandingPage"));
const EventsPage           = lazy(() => import("../pages/EventsPage"));
const EventDetailPage      = lazy(() => import("../pages/EventDetailPage"));
const RegisterPage         = lazy(() => import("../pages/RegisterPage"));
const LoginPage            = lazy(() => import("../pages/LoginPage"));
const CheckoutPage         = lazy(() => import("../pages/CheckoutPage"));
const CheckoutFormPage     = lazy(() => import("../pages/CheckoutFormPage"));
const CheckoutPaymentPage  = lazy(() => import("../pages/CheckoutPaymentPage"));
const PurchaseSuccessPage  = lazy(() => import("../pages/PurchaseSuccessPage"));

/** Componente utilitario para resetear el scroll al principio al cambiar de ruta */
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

/** Fallback minimalista durante la carga del chunk */
function PageLoader() {
  return (
    <div style={{ minHeight: "100vh", background: "#080808", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <span style={{ color: "#333", fontSize: "0.7rem", letterSpacing: "0.2em", fontFamily: "monospace" }}>
        CARGANDO...
      </span>
    </div>
  );
}

/** Redirige a / si el usuario ya está autenticado */
function ProtectedLoginRoute() {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Navigate to="/" replace /> : <LoginPage />;
}

/** Protege rutas que requieren sesión activa */
function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
}

/**
 * Cada página gestiona su propio header:
 * - LandingPage      → EditorialHeader con nav links
 * - EventsPage       → Navbar con buscador
 * - EventDetailPage  → Navbar minimalista
 * - RegisterPage / LoginPage → nav mínima
 */
export default function AppRouter() {
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
          </Routes>
        </Suspense>
      </BrowserRouter>
    </AuthProvider>
  );
}
