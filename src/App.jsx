import { lazy, Suspense, useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import ErrorBoundary from "./components/ErrorBoundary/ErrorBoundary";

// Componente ScrollToTop inline para asegurar scroll al tope al cambiar de ruta
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

// Lazy loading de páginas para code splitting y performance
const LandingPage          = lazy(() => import("./pages/landing/LandingPage"));
const EventsPage           = lazy(() => import("./pages/events/EventsPage"));
const EventDetailPage      = lazy(() => import("./pages/events/EventDetailPage"));
const CheckoutPage         = lazy(() => import("./pages/checkout/CheckoutPage"));
const CheckoutFormPage     = lazy(() => import("./pages/checkout/CheckoutFormPage"));
const CheckoutPaymentPage  = lazy(() => import("./pages/checkout/CheckoutPaymentPage"));
const PurchaseSuccessPage  = lazy(() => import("./pages/checkout/PurchaseSuccessPage"));
const RegisterPage         = lazy(() => import("./pages/auth/RegisterPage"));
const LoginPage            = lazy(() => import("./pages/auth/LoginPage"));
const OnboardingPage       = lazy(() => import("./pages/auth/OnboardingPage"));
const ProfilePage          = lazy(() => import("./pages/profile/ProfilePage"));
const ProfileEditPage      = lazy(() => import("./pages/profile/ProfileEditPage"));
const ProducerDashboard    = lazy(() => import("./pages/dashboard/ProducerDashboard"));
const ArtistDashboard      = lazy(() => import("./pages/dashboard/ArtistDashboard"));
const EventFormPage        = lazy(() => import("./pages/dashboard/EventFormPage"));
const CommunityPage        = lazy(() => import("./pages/community/CommunityPage"));

// Guard de rutas protegidas
function ProtectedRoute({ children, allowedRoles }) {
  const { isAuthenticated, role } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(role)) return <Navigate to="/" replace />;
  return children;
}

// Guard para login (redirige si ya está autenticado)
function ProtectedLoginRoute() {
  const { isAuthenticated } = useAuth();
  if (isAuthenticated) return <Navigate to="/" replace />;
  return <LoginPage />;
}

// Guard para onboarding
function OnboardingRoute() {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <OnboardingPage />;
}



// Fallback de carga mientras se resuelven los chunks lazy
function PageLoader() {
  const [pct, setPct] = useState(12);

  useEffect(() => {
    // Incremento rápido al principio, se desacelera al acercarse al 95%
    const id = setInterval(() => {
      setPct(prev => {
        if (prev >= 95) { clearInterval(id); return prev; }
        const step = prev < 60 ? 8 : prev < 85 ? 3 : 1;
        return Math.min(prev + step, 95);
      });
    }, 120);
    return () => clearInterval(id);
  }, []);

  return (
    <div style={{
      position: "fixed",
      inset: 0,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "var(--ds-color-bg-canvas)",
      backgroundImage: "none",
      zIndex: 9999,
    }}>
      <span style={{
        color: "#4b5563",
        fontFamily: "monospace",
        fontSize: "0.78rem",
        letterSpacing: "0.06em",
      }}>
        cargando...{" "}
        <span style={{ color: "#00FF9F" }}>{pct}%</span>
      </span>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
      <BrowserRouter>
        <ScrollToTop />
        <ErrorBoundary label="App">
          <Suspense fallback={<PageLoader />}>
            <Routes>
              {/* ── Inicio ─────────────────────────────────────────── */}
              <Route path="/" element={
                <ErrorBoundary label="Landing" inline>
                  <LandingPage />
                </ErrorBoundary>
              } />

              {/* ── Eventos ────────────────────────────────────────── */}
              <Route path="/events" element={
                <ErrorBoundary label="Eventos" inline>
                  <EventsPage />
                </ErrorBoundary>
              } />
              <Route path="/events/:id" element={
                <ErrorBoundary label="Detalle de Evento" inline>
                  <EventDetailPage />
                </ErrorBoundary>
              } />

              {/* ── Checkout ───────────────────────────────────────── */}
              <Route path="/events/:id/checkout" element={
                <ProtectedRoute>
                  <ErrorBoundary label="Checkout" inline>
                    <CheckoutPage />
                  </ErrorBoundary>
                </ProtectedRoute>
              } />
              <Route path="/events/:id/checkout/datos" element={
                <ProtectedRoute>
                  <ErrorBoundary label="Checkout Datos" inline>
                    <CheckoutFormPage />
                  </ErrorBoundary>
                </ProtectedRoute>
              } />
              <Route path="/events/:id/checkout/pago" element={
                <ProtectedRoute>
                  <ErrorBoundary label="Checkout Pago" inline>
                    <CheckoutPaymentPage />
                  </ErrorBoundary>
                </ProtectedRoute>
              } />
              <Route path="/compra/confirmacion" element={
                <ProtectedRoute>
                  <ErrorBoundary label="Confirmación de Compra" inline>
                    <PurchaseSuccessPage />
                  </ErrorBoundary>
                </ProtectedRoute>
              } />

              {/* ── Auth ───────────────────────────────────────────── */}
              <Route path="/register"   element={<RegisterPage />} />
              <Route path="/login"      element={<ProtectedLoginRoute />} />
              <Route path="/onboarding" element={<OnboardingRoute />} />

              {/* ── Perfil ─────────────────────────────────────────── */}
              {/* profile/edit DEBE ir ANTES que profile/:username para evitar colisión de ruta */}
              <Route path="/profile/edit" element={
                <ProtectedRoute>
                  <ErrorBoundary label="Edición de Perfil" inline>
                    <ProfileEditPage />
                  </ErrorBoundary>
                </ProtectedRoute>
              } />
              <Route path="/profile/:username" element={
                <ErrorBoundary label="Perfil de Usuario" inline>
                  <ProfilePage />
                </ErrorBoundary>
              } />

              {/* ── Comunidad ──────────────────────────────────────── */}
              <Route path="/community" element={
                <ProtectedRoute>
                  <ErrorBoundary label="Comunidad" inline>
                    <CommunityPage />
                  </ErrorBoundary>
                </ProtectedRoute>
              } />

              {/* ── Dashboards ─────────────────────────────────────── */}
              <Route path="/dashboard/producer" element={
                <ProtectedRoute allowedRoles={["producer"]}>
                  <ErrorBoundary label="Dashboard Productora" inline>
                    <ProducerDashboard />
                  </ErrorBoundary>
                </ProtectedRoute>
              } />
              <Route path="/dashboard/artist" element={
                <ProtectedRoute allowedRoles={["artist"]}>
                  <ErrorBoundary label="Dashboard Artista" inline>
                    <ArtistDashboard />
                  </ErrorBoundary>
                </ProtectedRoute>
              } />
              <Route path="/events/create" element={
                <ProtectedRoute allowedRoles={["producer"]}>
                  <ErrorBoundary label="Crear Evento" inline>
                    <EventFormPage />
                  </ErrorBoundary>
                </ProtectedRoute>
              } />
              <Route path="/events/edit/:id" element={
                <ProtectedRoute allowedRoles={["producer"]}>
                  <ErrorBoundary label="Editar Evento" inline>
                    <EventFormPage />
                  </ErrorBoundary>
                </ProtectedRoute>
              } />
            </Routes>
          </Suspense>
        </ErrorBoundary>
      </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}
