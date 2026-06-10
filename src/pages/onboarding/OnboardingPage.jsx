import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";
import styles from "./OnboardingPage.module.css";

// ── Datos ────────────────────────────────────────────────────────────
const GENEROS = [
  "PUNK", "METAL", "HARDCORE", "GRUNGE", "ROCK", "INDIE",
  "TECHNO", "ELECTRÓNICA", "HOUSE", "POST-PUNK", "NOISE",
  "FOLK", "JAZZ", "HIP-HOP",
];

const VIBES = [
  { label: "Pogo",             emoji: "🔥" },
  { label: "Dance floor",      emoji: "🕺" },
  { label: "Karaoke",          emoji: "🎤" },
  { label: "Contemplación",    emoji: "😌" },
  { label: "Mosh pit",         emoji: "🤘" },
  { label: "Cerveza en mano",  emoji: "🍺" },
  { label: "Fotógrafo",        emoji: "📷" },
  { label: "Arte en vivo",     emoji: "🎨" },
  { label: "Noctámbulo",       emoji: "🌙" },
  { label: "Guitarrero",       emoji: "🎸" },
  { label: "Baterista de corazón", emoji: "🥁" },
  { label: "Synth lover",      emoji: "🎹" },
];

// ── Stepper ──────────────────────────────────────────────────────────
function Stepper({ current }) {
  const steps = [
    { id: 0, label: "TU PERFIL",  icon: "👤" },
    { id: 1, label: "TU MÚSICA",  icon: "🎵" },
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
      {/* Avatar */}
      <div className={styles.avatar}>{initial}</div>
      <h2 className={styles.stepTitle}>HOLA, {nombre.toUpperCase()}</h2>
      <p className={styles.stepSubtitle}>Contanos un poco de vos.</p>

      {/* Bio */}
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

      {/* Instagram */}
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

      {/* Géneros */}
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

      {/* Vibes */}
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

// ── Página principal ──────────────────────────────────────────────────
export default function OnboardingPage() {
  const navigate  = useNavigate();
  const { user, login, token } = useAuth();

  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    bio:       "",
    instagram: "",
    generos:   [],
    vibes:     [],
  });

  function handleChange(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function saveAndFinish(data) {
    setSaving(true);
    try {
      const payload = {
        bio: data.bio,
        redesSociales: { instagram: data.instagram },
        generosPreferidos: data.generos,
        vibeEnShows: data.vibes,
      };
      await api.put("/users/me", payload);
      // Actualizar user en localStorage con los nuevos datos
      const updatedUser = { ...user, ...payload };
      localStorage.setItem("voy_user", JSON.stringify(updatedUser));
    } catch (err) {
      console.error("[Onboarding] Error al guardar perfil:", err);
    } finally {
      setSaving(false);
      markDone();
    }
  }

  function markDone() {
    localStorage.setItem("onboardingDone", "true");
    navigate("/");
  }

  // Avanzar paso 1 → paso 2
  function handleStep1Next() {
    setStep(1);
  }

  // Finalizar desde paso 2
  async function handleStep2Next() {
    await saveAndFinish(form);
  }

  // Saltar desde cualquier paso → finalizar
  async function handleSkip() {
    await saveAndFinish(form);
  }

  return (
    <div className={styles.page}>
      <div className={styles.grain} aria-hidden="true" />

      {/* Nav mínima */}
      <nav className={styles.nav}>
        <span className={styles.navLogo}>
          <span className={styles.navLogoBox}>V</span>
          VOY PROJECT
        </span>
      </nav>

      <main className={styles.main}>
        <Stepper current={step} />

        {saving ? (
          <div className={styles.savingMsg}>Guardando tu perfil...</div>
        ) : step === 0 ? (
          <StepPerfil
            data={form}
            onChange={handleChange}
            onNext={handleStep1Next}
            onSkip={handleSkip}
          />
        ) : (
          <StepMusica
            data={form}
            onChange={handleChange}
            onNext={handleStep2Next}
            onBack={() => setStep(0)}
            onSkip={handleSkip}
          />
        )}
      </main>
    </div>
  );
}
