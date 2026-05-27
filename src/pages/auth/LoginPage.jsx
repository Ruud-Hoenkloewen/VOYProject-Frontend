import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { loginUser } from "../../services/authService";
import styles from "./RegisterPage.module.css"; // Reutiliza el mismo diseño

/**
 * LoginPage — Formulario de inicio de sesión.
 * Ruta: /login
 * Redirige a / si el usuario ya está autenticado (ver AppRouter).
 */
export default function LoginPage() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const { login } = useAuth();

  // Si venimos redirigidos desde una ruta protegida, volvemos ahí después del login
  const redirectTo = location.state?.from?.pathname ?? '/';

  const [form,       setForm]       = useState({ email: "", password: "" });
  const [errors,     setErrors]     = useState({});
  const [apiError,   setApiError]   = useState("");   // Error del backend
  const [submitting, setSubmitting] = useState(false);
  const [showPass,   setShowPass]   = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name])  setErrors((prev)   => ({ ...prev, [name]: "" }));
    if (apiError)      setApiError("");
  }

  function validate() {
    const next = {};
    if (!form.email.trim())    next.email    = "El email es requerido";
    else if (!/\S+@\S+\.\S+/.test(form.email)) next.email = "Email inválido";
    if (!form.password)        next.password = "La contraseña es requerida";
    return next;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    setSubmitting(true);
    setApiError("");

    try {
      const data = await loginUser(form.email, form.password);
      // data = { _id, nombre, email, token }
      login({ _id: data._id, nombre: data.nombre, email: data.email }, data.token);
      navigate(redirectTo, { replace: true });
    } catch (err) {
      const msg = err.response?.data?.mensaje || "Error al iniciar sesión. Intentá de nuevo.";
      setApiError(msg);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.grain} aria-hidden="true" />

      {/* Nav mínima */}
      <nav className={styles.nav}>
        <Link to="/" className={styles.navLogo}>
          <span className={styles.navLogoBox}>V</span>
          VOY PROJECT
        </Link>
      </nav>

      <main className={styles.main}>
        {/* Columna izquierda — branding */}
        <aside className={styles.aside}>
          <div className={styles.asideInner}>
            <p className={styles.asideEyebrow}>◆ BIENVENIDO DE VUELTA</p>
            <h2 className={styles.asideTitle}>
              LA ESCENA<br />
              TE<br />
              <span className={styles.asideTitleAccent}>ESPERA.</span>
            </h2>
            <p className={styles.asideDesc}>
              Iniciá sesión para ver tus eventos guardados,
              comprar entradas y apoyar la música underground tucumana.
            </p>
            <div className={styles.asideDivider} />
            <ul className={styles.asideFeatures}>
              <li><span className={styles.featureDot}>◆</span>Accedé a tus entradas</li>
              <li><span className={styles.featureDot}>◆</span>Seguí a tus artistas favoritos</li>
              <li><span className={styles.featureDot}>◆</span>Descubrí shows antes que todos</li>
            </ul>
            <p className={styles.asideMeta}>VOY·PROJECT·v0.1-BETA — SMT·TUC·ARG·2026</p>
          </div>
        </aside>

        {/* Columna derecha — formulario */}
        <section className={styles.formSection}>
          <div className={styles.formCard}>
            <h1 className={styles.formTitle}>Ingresá</h1>
            <p className={styles.formSubtitle}>Accedé a tu cuenta de VOY Project</p>

            {/* Error global del backend */}
            {apiError && (
              <div className={styles.apiError} role="alert">
                {apiError}
              </div>
            )}

            <form className={styles.form} onSubmit={handleSubmit} noValidate>

              {/* EMAIL */}
              <div className={styles.field}>
                <label className={styles.label} htmlFor="email">EMAIL</label>
                <input
                  id="email" name="email" type="email" autoComplete="email"
                  placeholder="tu@email.com"
                  value={form.email} onChange={handleChange}
                  className={`${styles.input} ${errors.email ? styles.inputError : ""}`}
                />
                {errors.email && <span className={styles.errorMsg}>{errors.email}</span>}
              </div>

              {/* CONTRASEÑA con ojo */}
              <div className={styles.field}>
                <label className={styles.label} htmlFor="password">CONTRASEÑA</label>
                <div className={styles.passwordWrapper}>
                  <input
                    id="password" name="password"
                    type={showPass ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="Tu contraseña"
                    value={form.password} onChange={handleChange}
                    className={`${styles.input} ${styles.inputWithIcon} ${errors.password ? styles.inputError : ""}`}
                  />
                  <button
                    type="button"
                    className={styles.eyeBtn}
                    onClick={() => setShowPass((v) => !v)}
                    aria-label={showPass ? "Ocultar contraseña" : "Mostrar contraseña"}
                  >
                    {showPass ? "🙈" : "👁️"}
                  </button>
                </div>
                {errors.password && <span className={styles.errorMsg}>{errors.password}</span>}
              </div>

              <button type="submit" className={styles.submitBtn} disabled={submitting}>
                {submitting ? "INGRESANDO..." : "INGRESAR →"}
              </button>
            </form>

            <p className={styles.altLink}>
              ¿No tenés cuenta?{" "}
              <Link to="/register" className={styles.altLinkBtn}>
                Registrate
              </Link>
            </p>
          </div>

          <p className={styles.footerNote}>
            Al ingresar aceptás los términos de uso de VOY Project.
          </p>
        </section>
      </main>
    </div>
  );
}
