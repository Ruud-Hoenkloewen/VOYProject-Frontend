import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { updateMyProfile, GRADIENTS, AVATAR_COLORS } from "../../services/userService";
import { Button, Typography, Card } from "../../design-system";
import LogoVoy from "../../components/LogoVoy/LogoVoy";
import { MapPinIcon } from "../../components/icons";
import api from "../../services/api";
import styles from "./OnboardingPage.module.css";

// ── Datos ────────────────────────────────────────────────────────────
const GENEROS = [
  "PUNK", "METAL", "HARDCORE", "GRUNGE", "ROCK", "INDIE",
  "TECHNO", "ELECTRÓNICA", "HOUSE", "POST-PUNK", "NOISE",
  "FOLK", "JAZZ", "HIP-HOP",
];

const VIBES = [
  { label: "Pogo",                 emoji: "🔥" },
  { label: "Dance floor",          emoji: "🕺" },
  { label: "Karaoke",              emoji: "🎤" },
  { label: "Contemplación",        emoji: "😌" },
  { label: "Mosh pit",             emoji: "🤘" },
  { label: "Cerveza en mano",      emoji: "🍺" },
  { label: "Fotógrafo",            emoji: "📷" },
  { label: "Arte en vivo",         emoji: "🎨" },
  { label: "Noctámbulo",           emoji: "🌙" },
  { label: "Guitarrero",           emoji: "🎸" },
  { label: "Baterista de corazón", emoji: "🥁" },
  { label: "Synth lover",          emoji: "🎹" },
];

// ── Stepper ──────────────────────────────────────────────────────────
function Stepper({ current }) {
  const steps = [
    { id: 0, label: "TU PERFIL", icon: "👤" },
    { id: 1, label: "TU MÚSICA", icon: "🎵" },
    { id: 2, label: "TU ESTILO", icon: "🎨" },
  ];

  return (
    <div className={styles.stepper}>
      {steps.map((step, i) => (
        <div key={step.id} className={styles.stepperItem}>
          <div className={`${styles.stepperIcon} ${
            current > step.id ? styles.stepperDone :
            current === step.id ? styles.stepperActive :
            styles.stepperPending
          }`}>
            {current > step.id ? "✓" : step.icon}
          </div>
          <span className={`${styles.stepperLabel} ${
            current === step.id ? styles.stepperLabelActive : ""
          }`}>
            {step.label}
          </span>
          {i < steps.length - 1 && (
            <div className={`${styles.stepperLine} ${current > i ? styles.stepperLineDone : ""}`} />
          )}
        </div>
      ))}
    </div>
  );
}

// ── Paso 1: Tu Perfil ─────────────────────────────────────────────────
function StepPerfil({ data, onChange, onNext, onSkip }) {
  const { user } = useAuth();
  const nombre = user?.nombre || "Vos";
  const initial = nombre.charAt(0).toUpperCase();

  return (
    <div className={styles.stepContainer}>
      <div className={styles.avatar}>{initial}</div>
      <h2 className={styles.stepTitle}>HOLA, {nombre.toUpperCase()}</h2>
      <p className={styles.stepSubtitle}>Contanos un poco de vos.</p>

      <div className={styles.fieldGroup}>
        <label className={styles.label}>BIO</label>
        <textarea
          className={styles.textarea}
          placeholder="Qué géneros te mueven, en qué shows te encontramos..."
          maxLength={150}
          value={data.bio}
          onChange={(e) => onChange("bio", e.target.value)}
          rows={4}
        />
        <span className={styles.charCount}>{data.bio.length}/150</span>
      </div>

      <div className={styles.fieldGroup}>
        <label className={styles.label}>INSTAGRAM</label>
        <div className={styles.inputWrapper}>
          <span className={styles.inputPrefix}>@</span>
          <input
            type="text"
            className={styles.input}
            placeholder="tu_usuario"
            value={data.instagram}
            onChange={(e) => onChange("instagram", e.target.value)}
          />
        </div>
      </div>

      <button className={styles.btnPrimary} onClick={onNext}>
        SIGUIENTE →
      </button>
      <button className={styles.btnSkip} onClick={onSkip}>
        Saltar
      </button>
    </div>
  );
}

// ── Paso 2: Tu Música ─────────────────────────────────────────────────
function StepMusica({ data, onChange, onNext, onBack, onSkip }) {
  const canAdvance = data.generos.length >= 1;

  function toggleGenero(g) {
    const next = data.generos.includes(g)
      ? data.generos.filter((x) => x !== g)
      : [...data.generos, g];
    onChange("generos", next);
  }

  function toggleVibe(v) {
    const next = data.vibes.includes(v)
      ? data.vibes.filter((x) => x !== v)
      : [...data.vibes, v];
    onChange("vibes", next);
  }

  return (
    <div className={styles.stepContainer}>
      <h2 className={styles.stepTitleMusica}>
        <span className={styles.musicEmoji}>🎵</span> ¿QUÉ MÚSICA TE MUEVE?
      </h2>
      <p className={styles.stepSubtitle}>Elegí los géneros y vibes que van con vos.</p>

      <div className={styles.section}>
        <span className={styles.sectionLabel}>GÉNEROS</span>
        <div className={styles.chipGrid}>
          {GENEROS.map((g) => (
            <button
              key={g}
              className={`${styles.chip} ${data.generos.includes(g) ? styles.chipActive : ""}`}
              onClick={() => toggleGenero(g)}
              type="button"
            >
              {g}
            </button>
          ))}
        </div>
        {data.generos.length === 0 && (
          <p className={styles.validationHint}>Seleccioná al menos 1 género para continuar.</p>
        )}
      </div>

      <div className={styles.section}>
        <span className={styles.sectionLabel}>TU VIBE EN LOS SHOWS</span>
        <div className={styles.chipGrid}>
          {VIBES.map((v) => (
            <button
              key={v.label}
              className={`${styles.chip} ${data.vibes.includes(v.label) ? styles.chipActive : ""}`}
              onClick={() => toggleVibe(v.label)}
              type="button"
            >
              {v.emoji} {v.label}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.btnRow}>
        <button className={styles.btnBack} onClick={onBack}>VOLVER</button>
        <button
          className={styles.btnPrimary}
          onClick={onNext}
          disabled={!canAdvance}
        >
          SIGUIENTE →
        </button>
      </div>
      <button className={styles.btnSkip} onClick={onSkip}>
        Saltar
      </button>
    </div>
  );
}

// ── Paso 3: Tu Estilo ─────────────────────────────────────────────────
function StepEstilo({ data, onChange, onConfirm, onBack, submitting }) {
  const { user } = useAuth();
  const initials  = user?.nombre ? user.nombre.charAt(0).toUpperCase() : "U";
  const userHandle = user?.nombre ? user.nombre.toLowerCase().replace(/\s+/g, "") : "usuario";
  const userBio   = data.bio || user?.bio || "Sin bio todavía. Editá tu perfil para contarle algo a la comunidad.";

  return (
    <div className={styles.gridContainer}>

      {/* COLUMNA IZQUIERDA — CONTROLES */}
      <section className={styles.controlsSection}>
        <div className={styles.controlsCard}>
          <Typography variant="caption" className={styles.eyebrow}>PASO 3 — TU ESTILO</Typography>
          <h1 className={styles.title}>Definí tu identidad visual</h1>
          <p className={styles.subtitle}>
            Elegí los colores y portadas que representarán tu presencia dentro de la comunidad de VOY.
          </p>

          <div className={styles.divider} />

          {/* COLOR DE AVATAR */}
          <div className={styles.sectionField}>
            <Typography variant="label" className={styles.sectionLabel}>COLOR DE AVATAR</Typography>
            <div className={styles.swatchesGrid} role="radiogroup" aria-label="Color de avatar">
              {AVATAR_COLORS.map((swatch) => (
                <button
                  key={swatch.value}
                  role="radio"
                  aria-checked={data.avatarColor === swatch.value}
                  onClick={() => onChange("avatarColor", swatch.value)}
                  className={`${styles.swatchBtn} ${
                    data.avatarColor === swatch.value ? styles.swatchBtnActive : ""
                  }`}
                  style={{ backgroundColor: swatch.value }}
                  title={swatch.name}
                />
              ))}
            </div>
          </div>

          {/* PORTADA */}
          <div className={styles.sectionField}>
            <Typography variant="label" className={styles.sectionLabel}>PORTADA DEL PERFIL (BANNER)</Typography>
            <div className={styles.gradientsGrid} role="radiogroup" aria-label="Portada del perfil">
              {Object.keys(GRADIENTS).map((key) => (
                <button
                  key={key}
                  role="radio"
                  aria-checked={data.gradientKey === key}
                  onClick={() => onChange("gradientKey", key)}
                  className={`${styles.gradientBtn} ${
                    data.gradientKey === key ? styles.gradientBtnActive : ""
                  }`}
                  style={{ background: GRADIENTS[key] }}
                  title={`Portada ${key.toUpperCase()}`}
                >
                  <span className={styles.gradientIndicator} />
                </button>
              ))}
            </div>
          </div>

          <div className={styles.actionRow}>
            <div className={styles.btnRow}>
              <button className={styles.btnBack} onClick={onBack}>VOLVER</button>
              <Button
                variant="primary"
                onClick={onConfirm}
                disabled={submitting}
                fullWidth
              >
                {submitting ? "GUARDANDO..." : "CONFIRMAR Y FINALIZAR →"}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* COLUMNA DERECHA — LIVE PREVIEW */}
      <aside className={styles.previewSection}>
        <div className={styles.previewSticky}>
          <Typography variant="caption" className={styles.previewTitle}>VISTA PREVIA EN TIEMPO REAL</Typography>

          <Card className={styles.miniProfile}>
            <div
              className={styles.miniBanner}
              style={{ background: GRADIENTS[data.gradientKey] }}
            />
            <div className={styles.miniContent}>
              <div
                className={styles.miniAvatar}
                style={{ backgroundColor: data.avatarColor }}
              >
                <span className={styles.miniAvatarText}>{initials}</span>
              </div>
              <div className={styles.miniDetails}>
                <div className={styles.miniNameRow}>
                  <span className={styles.miniName}>{user?.nombre || "TU NOMBRE"}</span>
                  <span className={styles.miniBadge}>FAN</span>
                </div>
                <span className={styles.miniHandle}>@{userHandle}</span>
                <p className={styles.miniBio}>{userBio}</p>
                <div className={styles.miniLocation}>
                  <MapPinIcon size={12} className={styles.locationPin} />
                  <span>San Miguel de Tucumán, Argentina</span>
                </div>
              </div>
            </div>
          </Card>

          <p className={styles.previewCaption}>
            * Podrás volver a cambiar estos colores y la portada en cualquier momento desde los ajustes de tu perfil.
          </p>
        </div>
      </aside>

    </div>
  );
}

// ── Página principal ──────────────────────────────────────────────────
export default function OnboardingPage() {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();

  const [step,     setStep]     = useState(0);
  const [saving,   setSaving]   = useState(false);
  const [showWelcomeOverlay, setShowWelcomeOverlay] = useState(false);

  const userHandle = user?.nombre ? user.nombre.toLowerCase().replace(/\s+/g, "") : "usuario";

  const [form, setForm] = useState({
    bio:         "",
    instagram:   "",
    generos:     [],
    vibes:       [],
    avatarColor: AVATAR_COLORS[0].value,
    gradientKey: "g1",
  });

  function handleChange(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  // Guardar bio + música en el backend
  async function saveProfileData(data) {
    try {
      const payload = {
        bio: data.bio,
        redesSociales: { instagram: data.instagram },
        generosPreferidos: data.generos,
        vibeEnShows: data.vibes,
      };
      await api.put("/users/me", payload);
      const updatedUser = { ...user, ...payload };
      localStorage.setItem("voy_user", JSON.stringify(updatedUser));
    } catch (err) {
      console.error("[Onboarding] Error al guardar perfil:", err);
    }
  }

  // Guardar estilo visual y finalizar
  async function handleConfirm() {
    setSaving(true);
    try {
      await saveProfileData(form);
      const result = await updateMyProfile(form.avatarColor, form.gradientKey);
      updateUser(result.user);
      localStorage.setItem("onboardingDone", "true");
      setShowWelcomeOverlay(true);
    } catch (err) {
      console.error("[Onboarding] Error al guardar estilo:", err);
      alert("Hubo un problema al guardar tus preferencias. Por favor intentá de nuevo.");
    } finally {
      setSaving(false);
    }
  }

  // Saltar desde cualquier paso → guarda lo que haya y finaliza
  async function handleSkip() {
    setSaving(true);
    try {
      await saveProfileData(form);
      localStorage.setItem("onboardingDone", "true");
    } catch (err) {
      console.error("[Onboarding] Error al saltar:", err);
    } finally {
      setSaving(false);
      navigate("/");
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.grain} aria-hidden="true" />

      {/* Nav superior mínima */}
      <nav className={styles.nav}>
        <div className={styles.navLogo}>
          <LogoVoy />
        </div>
        <div className={styles.stepsIndicator}>
          <span className={step > 0 ? styles.stepDone : styles.stepActive}>
            {step > 0 ? "Perfil ✓" : "Perfil ●"}
          </span>
          <span className={styles.stepDivider}>—</span>
          <span className={step > 1 ? styles.stepDone : step === 1 ? styles.stepActive : styles.stepPending}>
            {step > 1 ? "Música ✓" : "Música"}
          </span>
          <span className={styles.stepDivider}>—</span>
          <span className={step === 2 ? styles.stepActive : styles.stepPending}>
            Tu Estilo {step === 2 ? "●" : ""}
          </span>
        </div>
      </nav>

      <main className={styles.main}>
        <Stepper current={step} />

        {saving ? (
          <div className={styles.savingMsg}>Guardando tu perfil...</div>
        ) : step === 0 ? (
          <StepPerfil
            data={form}
            onChange={handleChange}
            onNext={() => setStep(1)}
            onSkip={handleSkip}
          />
        ) : step === 1 ? (
          <StepMusica
            data={form}
            onChange={handleChange}
            onNext={() => setStep(2)}
            onBack={() => setStep(0)}
            onSkip={handleSkip}
          />
        ) : (
          <StepEstilo
            data={form}
            onChange={handleChange}
            onConfirm={handleConfirm}
            onBack={() => setStep(1)}
            submitting={saving}
          />
        )}
      </main>

      {/* OVERLAY DE BIENVENIDA */}
      {showWelcomeOverlay && (
        <div className={styles.overlay} role="dialog" aria-modal="true">
          <div className={styles.welcomeCard}>
            <div className={styles.overlayGrain} />
            <div className={styles.welcomeHeader}>
              <div className={styles.lightningIcon} aria-hidden="true">⚡</div>
              <h2 className={styles.welcomeTitle}>¡BIENVENIDO/A! {user?.nombre?.toUpperCase()}</h2>
            </div>
            <p className={styles.welcomeDescription}>
              Tu cuenta ha sido creada e inicializada con éxito. Ahora tu perfil tiene su estilo propio y estás listo para sumergirte en la escena underground tucumana.
            </p>
            <div className={styles.welcomeActions}>
              <Button
                variant="primary"
                onClick={() => navigate("/events")}
                className={styles.welcomeBtn}
              >
                EXPLORAR EVENTOS
              </Button>
              <Button
                variant="secondary"
                onClick={() => navigate(`/profile/${userHandle}`)}
                className={styles.welcomeBtn}
              >
                VER MI PERFIL
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
