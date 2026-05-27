import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { registerUser } from "../services/authService";
import styles from "./RegisterPage.module.css";

/**
 * RegisterPage — Formulario de registro de nueva cuenta
 * Ruta: /register
 */
export default function RegisterPage() {
  const navigate    = useNavigate();
  const { login }   = useAuth();

  const [form,       setForm]       = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [errors,     setErrors]     = useState({});
  const [apiError,   setApiError]   = useState("");
  const [submitting, setSubmitting] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name])  setErrors((prev)  => ({ ...prev, [name]: "" }));
    if (apiError)      setApiError("");
  }

  function validate() {
    const next = {};
    if (!form.name.trim())       next.name = "El nombre es requerido";
    if (!form.email.trim())      next.email = "El email es requerido";
    else if (!/\S+@\S+\.\S+/.test(form.email)) next.email = "Email inválido";
    if (!form.password)          next.password = "La contraseña es requerida";
    else if (form.password.length < 6) next.password = "Mínimo 6 caracteres";
    if (form.password !== form.confirmPassword) next.confirmPassword = "Las contraseñas no coinciden";
    return next;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    setSubmitting(true);
    setApiError("");

    try {
      const data = await registerUser(form.name, form.email, form.password);
      login({ _id: data._id, nombre: data.nombre, email: data.email }, data.token);
      navigate("/");
    } catch (err) {
      const msg = err.response?.data?.mensaje || "Error al crear la cuenta. Intentá de nuevo.";
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
            <p className={styles.asideEyebrow}>◆ ESCENA EMERGENTE</p>
            <h2 className={styles.asideTitle}>
              LA MÚSICA<br />
              QUE<br />
              <span className={styles.asideTitleAccent}>IMPORTA.</span>
            </h2>
            <p className={styles.asideDesc}>
              Eventos de punk, rock, metal y grunge del
              noroeste argentino — todo en un solo lugar.
            </p>
            <div className={styles.asideDivider} />
            <ul className={styles.asideFeatures}>
              <li><span className={styles.featureDot}>◆</span>Descubrí shows antes que todos</li>
              <li><span className={styles.featureDot}>◆</span>Guardá eventos en tu agenda</li>
              <li><span className={styles.featureDot}>◆</span>Apoyá la escena local tucumana</li>
            </ul>
            <p className={styles.asideMeta}>VOY·PROJECT·v0.1-BETA — SMT·TUC·ARG·2026</p>
          </div>
        </aside>

        {/* Columna derecha — formulario */}
        <section className={styles.formSection}>
          <div className={styles.formCard}>
            <h1 className={styles.formTitle}>Creá tu cuenta</h1>
            <p className={styles.formSubtitle}>Unite a la escena — es gratis</p>

            {/* Error global del backend */}
            {apiError && (
              <div className={styles.apiError} role="alert">
                {apiError}
              </div>
            )}

            <form className={styles.form} onSubmit={handleSubmit} noValidate>
              <div className={styles.field}>
                <label className={styles.label} htmlFor="name">NOMBRE</label>
                <input
                  id="name" name="name" type="text" autoComplete="name"
                  placeholder="Tu nombre o apodo"
                  value={form.name} onChange={handleChange}
                  className={`${styles.input} ${errors.name ? styles.inputError : ""}`}
                />
                {errors.name && <span className={styles.errorMsg}>{errors.name}</span>}
              </div>

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

              <div className={styles.field}>
                <label className={styles.label} htmlFor="password">CONTRASEÑA</label>
                <input
                  id="password" name="password" type="password" autoComplete="new-password"
                  placeholder="Mínimo 6 caracteres"
                  value={form.password} onChange={handleChange}
                  className={`${styles.input} ${errors.password ? styles.inputError : ""}`}
                />
                {errors.password && <span className={styles.errorMsg}>{errors.password}</span>}
              </div>

              <div className={styles.field}>
                <label className={styles.label} htmlFor="confirmPassword">CONFIRMAR CONTRASEÑA</label>
                <input
                  id="confirmPassword" name="confirmPassword" type="password" autoComplete="new-password"
                  placeholder="Repetí tu contraseña"
                  value={form.confirmPassword} onChange={handleChange}
                  className={`${styles.input} ${errors.confirmPassword ? styles.inputError : ""}`}
                />
                {errors.confirmPassword && <span className={styles.errorMsg}>{errors.confirmPassword}</span>}
              </div>

              <button type="submit" className={styles.submitBtn} disabled={submitting}>
                {submitting ? "CARGANDO..." : "CREAR MI CUENTA →"}
              </button>
            </form>
          </div>

          <p className={styles.footerNote}>
            Al registrarte aceptás los términos de uso de VOY Project.
          </p>
        </section>
      </main>
    </div>
  );
}
