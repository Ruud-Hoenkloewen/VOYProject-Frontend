import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Building2, Guitar } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { registerUser } from "../../services/authService";
import { checkUsername, updateMyProfile } from "../../services/userService";
import LogoVoy from "../../components/LogoVoy/LogoVoy";
import styles from "./RegisterPage.module.css";

/**
 * RegisterPage — Formulario de registro de nueva cuenta
 * Ruta: /register
 */
export default function RegisterPage() {
  const navigate    = useNavigate();
  const { login }   = useAuth();

  const [form,       setForm]       = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [selectedRole, setSelectedRole] = useState(null);
  const [step, setStep] = useState(0); // 0: select role, 1: form
  const [errors,     setErrors]     = useState({});
  const [apiError,   setApiError]   = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function generateUniqueUsername(baseName) {
    let username = baseName.toLowerCase()
      .trim()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9._]/g, "");
    if (!username) username = "productor";
    
    let candidate = username;
    let isAvailable = false;
    let attempts = 0;
    
    while (!isAvailable && attempts < 10) {
      try {
        const res = await checkUsername(candidate);
        if (res.available) {
          isAvailable = true;
        } else {
          candidate = `${username}${Math.floor(100 + Math.random() * 900)}`;
          attempts++;
        }
      } catch (err) {
        candidate = `${username}${Math.floor(100 + Math.random() * 900)}`;
        break;
      }
    }
    return candidate;
  }

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

  const [showConfirmModal, setShowConfirmModal] = useState(false);

  async function handleOpenConfirm(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { 
      setErrors(errs); 
      return; 
    }
    setApiError("");
    setShowConfirmModal(true);
  }

  async function executeRegistration() {
    setSubmitting(true);
    setApiError("");

    try {
      const roleToRegister = selectedRole || "client";
      const data = await registerUser(form.name, form.email, form.password, roleToRegister);
      
      // Log in immediately after registration
      await login({ _id: data._id, nombre: data.nombre, username: data.username, email: data.email, role: data.role }, data.token);

      if (selectedRole === "producer" || selectedRole === "artist") {
        // Generate a unique username based on their name
        const uniqueUsername = await generateUniqueUsername(form.name);
        
        // Update user profile automatically
        const payload = {
          username: uniqueUsername,
          bio: selectedRole === "producer" ? "Organizador de eventos underground y ciclos culturales." : "Artista emergente de la escena local.",
          ubicacion: "San Miguel de Tucumán, Argentina",
          avatarColor: selectedRole === "producer" ? "#00E5FF" : "#FF00E5", 
          bannerGradiente: selectedRole === "producer" ? "g5" : "g4",
          vibeEnShows: ["Profesional"],
          redesSociales: { instagram: uniqueUsername }
        };
        
        const updated = await updateMyProfile(payload);
        await login({ ...updated, role: selectedRole }, data.token);

        localStorage.setItem("onboardingDone", "true");
        navigate(`/dashboard/${selectedRole}`);
      } else {
        // Fans can do onboarding
        navigate("/onboarding");
      }
    } catch (err) {
      setShowConfirmModal(false);
      const msg = err.response?.data?.mensaje || "Error al crear la cuenta. Intentá de nuevo.";
      setApiError(msg);
    } finally {
      setSubmitting(false);
    }
  }

  
  if (step === 0) {
    return (
      <div className={styles.page}>
        <div className={styles.grain} aria-hidden="true" />
        <nav className={styles.nav}>
          <div className={styles.navLogo}>
            <LogoVoy />
          </div>
        </nav>
        
        <main className={styles.onboardingStep}>
          <h1 className={styles.onboardingTitle}>
            BIENVENIDO A <span className={styles.onboardingTitleAccent}>VOY PROJECT</span>
          </h1>
          <p className={styles.onboardingSubtitle}>
            Elegí cómo querés ser parte de la escena.
          </p>

          <div className={styles.onboardingCards}>
            <div 
              className={`${styles.onboardingCard} ${selectedRole === "client" ? styles.onboardingCardActive : ""}`} 
              onClick={() => { setSelectedRole("client"); setStep(1); }}
            >
              <div className={styles.onboardingCardIcon}>
                <User size={34} />
              </div>
              <h3 className={styles.onboardingCardTitle}>SOY FAN</h3>
              <p className={styles.onboardingCardDesc}>
                Seguí artistas, comprá entradas y conectá con la escena local.
              </p>
            </div>

            <div 
              className={`${styles.onboardingCard} ${selectedRole === "producer" ? styles.onboardingCardActive : ""}`} 
              onClick={() => { setSelectedRole("producer"); setStep(1); }}
            >
              <div className={styles.onboardingCardIcon}>
                <Building2 size={34} />
              </div>
              <h3 className={styles.onboardingCardTitle}>PRODUZCO EVENTOS</h3>
              <p className={styles.onboardingCardDesc}>
                Publicá eventos, gestioná venues y vendé entradas.
              </p>
            </div>

            <div 
              className={`${styles.onboardingCard} ${selectedRole === "artist" ? styles.onboardingCardActive : ""}`} 
              onClick={() => { setSelectedRole("artist"); setStep(1); }}
            >
              <div className={styles.onboardingCardIcon}>
                <Guitar size={34} />
              </div>
              <h3 className={styles.onboardingCardTitle}>SOY ARTISTA</h3>
              <p className={styles.onboardingCardDesc}>
                Mostrá tu música, conectá con venues y armá tu comunidad.
              </p>
            </div>
          </div>

          <div className={styles.onboardingFooter}>
            ¿Ya tenés cuenta? <Link to="/login" className={styles.onboardingLoginLink}>Iniciá sesión</Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.grain} aria-hidden="true" />

      {/* Nav mínima */}
      <nav className={styles.nav}>
        <div className={styles.navLogo}>
          <LogoVoy inverse={true} />
        </div>
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
                ⚠️ {apiError}
              </div>
            )}

            <form className={styles.form} onSubmit={handleOpenConfirm} noValidate>
              

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
        </section>
      </main>

      {/* MODAL DE CONFIRMACIÓN DE REGISTRO */}
      {showConfirmModal && (
        <div className={styles.confirmOverlay} role="dialog" aria-modal="true">
          <div className={styles.confirmCard}>
            <div className={styles.confirmHeader}>
              <span className={styles.confirmBadge}>CONFIRMACIÓN DE DATOS DE CUENTA</span>
              <h2>¿Tus datos son correctos?</h2>
              <p>Por favor verificá la información antes de crear tu cuenta para asegurar que puedas iniciar sesión sin problemas.</p>
            </div>

            <div className={styles.confirmBody}>
              <div className={styles.confirmDataRow}>
                <span className={styles.confirmLabel}>TIPO DE CUENTA:</span>
                <span className={styles.confirmValueHighlight}>
                  {selectedRole === "producer" ? (
                    <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}><Building2 size={16} /> PRODUCCIÓN DE EVENTOS</span>
                  ) : selectedRole === "artist" ? (
                    <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}><Guitar size={16} /> ARTISTA</span>
                  ) : (
                    <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}><User size={16} /> FAN</span>
                  )}
                </span>
              </div>

              <div className={styles.confirmDataRow}>
                <span className={styles.confirmLabel}>NOMBRE DE USUARIO:</span>
                <span className={styles.confirmValue}>{form.name}</span>
              </div>

              <div className={styles.confirmDataRow}>
                <span className={styles.confirmLabel}>CORREO DE ACCESO:</span>
                <span className={styles.confirmValueMail}>{form.email}</span>
              </div>
            </div>

            <div className={styles.confirmNotice}>
              💡 <strong>Atención:</strong> El email <code>{form.email}</code> se asociará a tu usuario. Asegurate de que no tenga errores de tipeo.
            </div>

            <div className={styles.confirmActions}>
              <button
                type="button"
                className={styles.btnConfirmEdit}
                onClick={() => setShowConfirmModal(false)}
                disabled={submitting}
              >
                ← EDITAR DATOS
              </button>
              <button
                type="button"
                className={styles.btnConfirmCreate}
                onClick={executeRegistration}
                disabled={submitting}
              >
                {submitting ? "CREANDO..." : "✓ CONFIRMAR Y REGISTRARME"}
              </button>
            </div>
          </div>
        </div>
      )}


    </div>
  );
}
