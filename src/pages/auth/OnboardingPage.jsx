import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { updateMyProfile, GRADIENTS, AVATAR_COLORS } from "../../services/userService";
import { Button, Typography, Card } from "../../design-system";
import LogoVoy from "../../components/LogoVoy/LogoVoy";
import { MapPinIcon } from "../../components/icons";
import api from "../../services/api";
import styles from "./OnboardingPage.module.css";

const InstagramSVG = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);

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

// ── Live Preview ────────────────────────────────────────────────────────
function LivePreview({ data }) {
  const { user } = useAuth();
  const initials  = user?.nombre ? user.nombre.charAt(0).toUpperCase() : "U";
  let userHandle = user?.nombre ? user.nombre.toLowerCase().replace(/\s+/g, "") : "usuario";
  if (data?.instagram) {
    userHandle = data.instagram.replace('@', '');
  }
  const userBio   = data.bio || user?.bio || "Sin bio todavía. Editá tu perfil para contarle algo a la comunidad.";
  const avatarPhoto = user?.avatarUrl || user?.fotoPerfil || user?.avatar;
  const avatarColor = (data.avatarColor && data.avatarColor !== 'transparent') ? data.avatarColor : '#00FF9F';

  return (
    <aside className={styles.previewSection}>
      <div className={styles.previewSticky}>
        <Typography variant="caption" className={styles.previewTitle}>VISTA PREVIA</Typography>
        <Card className={styles.miniProfile}>
          <div
            className={styles.miniBanner}
            style={{ background: data.bannerImagen ? `url("${data.bannerImagen}") center/cover no-repeat` : (GRADIENTS[data.gradientKey] || GRADIENTS.g1) }}
          />
          <div className={styles.miniContent}>
            <div
              className={styles.miniAvatar}
              style={{ backgroundColor: avatarColor, padding: avatarPhoto ? 0 : '3px' }}
            >
              {avatarPhoto ? (
                <img src={avatarPhoto} alt="Avatar" className={styles.miniAvatarImg} />
              ) : (
                <span className={styles.miniAvatarText}>{initials}</span>
              )}
            </div>
            <div className={styles.miniDetails}>
              <div className={styles.miniNameRow}>
                <span className={styles.miniName}>{user?.nombre || "TU NOMBRE"}</span>
                <span className={user?.role === 'producer' ? styles.miniBadgeProducer : user?.role === 'artist' ? styles.miniBadgeArtist : styles.miniBadgeFan}>
                  {user?.role === 'producer' ? 'PRODUCTORA' : user?.role === 'artist' ? 'ARTISTA' : 'FAN'}
                </span>
              </div>
              <div className={styles.instagramPreviewBtn}>
                <InstagramSVG />
                <span>{userHandle}</span>
              </div>
              <p className={styles.miniBio}>{userBio}</p>
              <div className={styles.miniLocation}>
                <MapPinIcon size={12} className={styles.locationPin} />
                <span>San Miguel de Tucumán, Argentina</span>
              </div>
              {data.generos.length > 0 && (
                <div style={{ marginTop: '16px' }}>
                  <span className={styles.appearanceLabel} style={{ marginBottom: '8px', display: 'block', fontSize: '10px', fontWeight: 800, color: 'var(--ds-color-editorial-subtle)' }}>GÉNEROS</span>
                  <div className={styles.chipGrid}>
                    {data.generos.map((g) => (
                      <span key={g} className={`${styles.chip} ${styles.chipActiveGenre}`} style={{ cursor: 'default', fontSize: '0.65rem', padding: '3px 10px' }}>{g}</span>
                    ))}
                  </div>
                </div>
              )}
              {data.vibes.length > 0 && (
                <div style={{ marginTop: '12px' }}>
                  <span className={styles.appearanceLabel} style={{ marginBottom: '8px', display: 'block', fontSize: '10px', fontWeight: 800, color: 'var(--ds-color-editorial-subtle)' }}>VIBES</span>
                  <div className={styles.chipGrid}>
                    {data.vibes.map((v) => (
                      <span key={v} className={`${styles.chip} ${styles.chipActiveVibe}`} style={{ cursor: 'default', fontSize: '0.65rem', padding: '3px 10px' }}>{v}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </Card>
        <p className={styles.previewCaption}>
          * Podrás volver a cambiar estos colores y la portada en cualquier momento desde los ajustes de tu perfil.
        </p>
      </div>
    </aside>
  );
}

// ── Paso 1: Tu Perfil ─────────────────────────────────────────────────
function StepPerfil({ data, onChange, onNext, onSkip }) {
  const { user } = useAuth();
  const nombre = user?.nombre || "Vos";
  const initial = nombre.charAt(0).toUpperCase();

  return (
    <div className={styles.gridContainer}>
      <section className={styles.controlsSection}>
        <div className={styles.controlsCard}>
          <Typography variant="caption" className={styles.eyebrow}>PASO 1 — TU PERFIL</Typography>
          <h1 className={styles.title}>HOLA, {nombre.toUpperCase()}</h1>
          <p className={styles.subtitle}>Contanos un poco de vos.</p>

          <div className={styles.divider} />

          <div className={styles.fieldGroup}>
            <Typography variant="label" className={styles.label}>BIO</Typography>
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

          <div className={styles.fieldGroup} style={{ marginTop: '16px' }}>
            <Typography variant="label" className={styles.label}>INSTAGRAM</Typography>
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

          <div className={styles.actionRow}>
            <div className={styles.btnRow}>
              <Button variant="primary" style={{ flex: 1 }} onClick={onNext} fullWidth>
                SIGUIENTE →
              </Button>
            </div>
            <button className={styles.btnSkip} onClick={onSkip}>
              Saltar este paso
            </button>
          </div>
        </div>
      </section>
      <LivePreview data={data} />
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
    <div className={styles.gridContainer}>
      <section className={styles.controlsSection}>
        <div className={styles.controlsCard}>
          <Typography variant="caption" className={styles.eyebrow}>PASO 2 — TU MÚSICA</Typography>
          <h1 className={styles.title}>¿QUÉ MÚSICA TE MUEVE?</h1>
          <p className={styles.subtitle}>Elegí los géneros y vibes que van con vos.</p>

          <div className={styles.divider} />

          <div className={styles.sectionField}>
            <Typography variant="label" className={styles.sectionLabel}>GÉNEROS</Typography>
            <div className={styles.chipGrid}>
              {GENEROS.map((g) => (
                <button
                  key={g}
                  className={`${styles.chip} ${data.generos.includes(g) ? styles.chipActiveGenre : ""}`}
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

          <div className={styles.sectionField}>
            <Typography variant="label" className={styles.sectionLabel}>TU VIBE EN LOS SHOWS</Typography>
            <div className={styles.chipGrid}>
              {VIBES.map((v) => (
                <button
                  key={v.label}
                  className={`${styles.chip} ${data.vibes.includes(v.label) ? styles.chipActiveVibe : ""}`}
                  onClick={() => toggleVibe(v.label)}
                  type="button"
                >
                  {v.emoji} {v.label}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.actionRow}>
            <div className={styles.btnRow}>
              <button className={styles.btnBack} onClick={onBack}>VOLVER</button>
              <Button variant="primary" onClick={onNext} disabled={!canAdvance} fullWidth>
                SIGUIENTE →
              </Button>
            </div>
            <button className={styles.btnSkip} onClick={onSkip}>
              Saltar este paso
            </button>
          </div>
        </div>
      </section>
      <LivePreview data={data} />
    </div>
  );
}

// ── Paso 3: Tu Estilo ───────────────────────────────────────────────────
function StepEstilo({ data, onChange, onConfirm, onBack, onSkip, submitting }) {
  const bannerInputRef = useRef(null);
  const avatarInputRef = useRef(null);
  const { user, updateUser } = useAuth();
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  const handleAvatarFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingAvatar(true);
    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64 = event.target.result;
      try {
        const res = await updateMyProfile({ avatarUrl: base64, fotoPerfil: base64, avatar: base64 });
        updateUser(res.user || res);
      } catch (err) {
        console.error("Error al subir avatar en onboarding:", err);
      } finally {
        setUploadingAvatar(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleBannerFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      onChange("bannerImagen", event.target.result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className={styles.gridContainer}>
      <section className={styles.controlsSection}>
        <div className={styles.controlsCard}>
          <Typography variant="caption" className={styles.eyebrow}>PASO 3 — TU ESTILO</Typography>
          <h1 className={styles.title}>DEFINÍ TU IDENTIDAD VISUAL</h1>
          <p className={styles.subtitle}>
            Elegí tu foto, color de acento y portada que representarán tu presencia en VOY.
          </p>

          <div className={styles.divider} />

          {/* FOTO DE PERFIL */}
          <div className={styles.sectionField}>
            <Typography variant="label" className={styles.sectionLabel} style={{ textAlign: 'center', display: 'block', marginBottom: '0.6rem' }}>FOTO DE PERFIL (AVATAR)</Typography>
            <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
              <button
                type="button"
                onClick={() => avatarInputRef.current?.click()}
                style={{
                  background: 'rgba(0, 255, 159, 0.12)',
                  border: '1px solid rgba(0, 255, 159, 0.35)',
                  color: '#00FF9F',
                  padding: '0.6rem 1.4rem',
                  borderRadius: '8px',
                  fontSize: '0.78rem',
                  fontWeight: 900,
                  letterSpacing: '0.06em',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  width: '100%',
                  maxWidth: '280px',
                  boxShadow: '0 4px 16px rgba(0, 255, 159, 0.15)',
                  transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
                }}
              >
                📷 {uploadingAvatar ? "SUBIENDO FOTO..." : "SUBIR FOTO DE PERFIL"}
              </button>
              <input
                ref={avatarInputRef}
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleAvatarFile}
              />
            </div>
          </div>

          {/* COLOR DE AVATAR */}
          <div className={styles.sectionField}>
            <Typography variant="label" className={styles.sectionLabel}>COLOR / ACENTO DEL PERFIL</Typography>
            <div style={{ fontSize: '0.7rem', color: '#888', marginBottom: '0.35rem', fontWeight: 700 }}>COLORES FIJOS</div>
            <div className={styles.swatchesGrid} role="radiogroup" aria-label="Colores fijos">
              {(AVATAR_COLORS || []).filter(c => c.category === 'fijo').map((swatch) => (
                <button
                  key={swatch.value}
                  type="button"
                  role="radio"
                  aria-checked={data.avatarColor === swatch.value}
                  onClick={() => onChange("avatarColor", swatch.value)}
                  className={`${styles.swatchBtn} ${
                    data.avatarColor === swatch.value ? styles.swatchBtnActive : ""
                  }`}
                  style={{ background: swatch.value }}
                  title={swatch.name}
                />
              ))}
            </div>

            <div style={{ fontSize: '0.7rem', color: '#888', margin: '0.75rem 0 0.35rem', fontWeight: 700 }}>GRADIENTES MIXTOS Y ARCOÍRIS</div>
            <div className={styles.swatchesGrid} role="radiogroup" aria-label="Gradientes y arcoíris">
              {(AVATAR_COLORS || []).filter(c => c.category !== 'fijo').map((swatch) => (
                <button
                  key={swatch.value}
                  type="button"
                  role="radio"
                  aria-checked={data.avatarColor === swatch.value}
                  onClick={() => onChange("avatarColor", swatch.value)}
                  className={`${styles.swatchBtn} ${
                    data.avatarColor === swatch.value ? styles.swatchBtnActive : ""
                  }`}
                  style={{ background: swatch.value }}
                  title={swatch.name}
                />
              ))}
            </div>
          </div>

          {/* PORTADA */}
          <div className={styles.sectionField}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
              <Typography variant="label" className={styles.sectionLabel} style={{ margin: 0 }}>PORTADA DEL PERFIL (BANNER)</Typography>
              <button
                type="button"
                onClick={() => bannerInputRef.current?.click()}
                style={{
                  background: 'rgba(0, 255, 159, 0.1)',
                  border: '1px solid rgba(0, 255, 159, 0.3)',
                  color: '#00FF9F',
                  padding: '0.3rem 0.8rem',
                  borderRadius: '4px',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                📷 SUBIR FOTO DE PORTADA
              </button>
              <input
                ref={bannerInputRef}
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleBannerFile}
              />
            </div>

            <div className={styles.gradientsGrid} role="radiogroup" aria-label="Portada del perfil">
              {Object.keys(GRADIENTS).map((key) => (
                <button
                  key={key}
                  type="button"
                  role="radio"
                  aria-checked={data.gradientKey === key && !data.bannerImagen}
                  onClick={() => {
                    onChange("gradientKey", key);
                    onChange("bannerImagen", "");
                  }}
                  className={`${styles.gradientBtn} ${
                    data.gradientKey === key && !data.bannerImagen ? styles.gradientBtnActive : ""
                  }`}
                  style={{ background: GRADIENTS[key] }}
                  title={`Portada ${key.toUpperCase()}`}
                >
                  <span className={styles.gradientIndicator} />
                </button>
              ))}
            </div>

            <div className={styles.inputWrapper} style={{ marginTop: '0.5rem' }}>
              <input
                type="url"
                className={styles.inputInner}
                placeholder="O pegá la URL de una foto para el banner..."
                value={data.bannerImagen || ""}
                onChange={(e) => onChange("bannerImagen", e.target.value)}
              />
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
            <button className={styles.btnSkip} onClick={onSkip}>
              Saltar este paso
            </button>
          </div>
        </div>
      </section>

      <LivePreview data={data} />
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

  const [form, setForm] = useState({
    bio:          "",
    instagram:    "",
    generos:      [],
    vibes:        [],
    avatarColor:  "#00FF9F",
    gradientKey:  "g1",
    bannerImagen: "",
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
        generosMusicales: data.generos,
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
      const result = await updateMyProfile({
        avatarColor: form.avatarColor,
        bannerGradiente: form.gradientKey,
        bannerImagen: form.bannerImagen,
      });
      updateUser(result.user || result);
      localStorage.setItem("onboardingDone", "true");
      setShowWelcomeOverlay(true);
    } catch (err) {
      console.error("[Onboarding] Error al guardar estilo:", err.response?.data || err);
      alert(`Hubo un problema al guardar tus preferencias: ${err.response?.data?.error || err.message}`);
    } finally {
      setSaving(false);
    }
  }

  // Saltar desde cualquier paso → guarda lo que haya y abre aviso de bienvenida
  async function handleSkip() {
    setSaving(true);
    try {
      await saveProfileData(form);
      localStorage.setItem("onboardingDone", "true");
      setShowWelcomeOverlay(true);
    } catch (err) {
      console.error("[Onboarding] Error al saltar:", err);
      setShowWelcomeOverlay(true);
    } finally {
      setSaving(false);
    }
  }

  const avatarSrc = user?.avatarUrl || user?.fotoPerfil || user?.avatar;
  const avatarColor = form.avatarColor || 'transparent';
  const hasAvatarColor = avatarColor !== 'transparent' && avatarColor !== 'none';
  const avatarStyle = hasAvatarColor
    ? { background: avatarColor, padding: '3px' }
    : { background: 'transparent', padding: 0 };

  return (
    <div className={styles.page}>
      <div className={styles.grain} aria-hidden="true" />

      {/* Nav superior mínima */}
      <nav className={styles.nav}>
        <div className={styles.navLogo}>
          <LogoVoy />
        </div>
        <div className={styles.stepsIndicator}>
          Estás actualmente: <span className={styles.stepActive}>creando tu perfil.</span>
        </div>
      </nav>

      <main className={styles.main}>

        {saving ? (
          <div className={styles.savingMsg}>Guardando tu perfil...</div>
        ) : step === 0 ? (
          <StepPerfil
            data={form}
            onChange={handleChange}
            onNext={() => setStep(1)}
            onSkip={() => setStep(1)}
          />
        ) : step === 1 ? (
          <StepMusica
            data={form}
            onChange={handleChange}
            onNext={() => setStep(2)}
            onBack={() => setStep(0)}
            onSkip={() => setStep(2)}
          />
        ) : (
          <StepEstilo
            data={form}
            onChange={handleChange}
            onConfirm={handleConfirm}
            onBack={() => setStep(1)}
            onSkip={handleSkip}
            submitting={saving}
          />
        )}
      </main>

      {/* OVERLAY DE BIENVENIDA */}
      {showWelcomeOverlay && (
        <div className={styles.overlay} role="dialog" aria-modal="true">
          <div className={styles.welcomeCardDark}>
            <div className={styles.topGradientBar} />
            <div className={styles.overlayGrain} />
            
            <div className={styles.lightningBox} style={avatarStyle}>
              {avatarSrc ? (
                <img src={avatarSrc} alt={user?.nombre || "Avatar"} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 'inherit' }} />
              ) : (
                <div className={styles.lightningIcon} aria-hidden="true" style={{ animation: 'none', color: 'var(--ds-color-bg-surface)', textShadow: 'none', fontSize: '2.5rem', fontWeight: 900 }}>
                  {user?.nombre ? user.nombre.charAt(0).toUpperCase() : "U"}
                </div>
              )}
            </div>

            <p className={styles.welcomeEyebrow} style={{ letterSpacing: '0.15em' }}>¡BIENVENIDO/A!</p>
            <h1 className={styles.welcomeGiantNumber} style={{ fontSize: 'clamp(2rem, 6vw, 4rem)', wordBreak: 'break-word', padding: '0 10px' }}>
              {user?.nombre ? user.nombre.split(' ')[0].toUpperCase() : "USUARIO"}
            </h1>
            
            <p className={styles.welcomeDescriptionDark}>
              Tu perfil está listo. Acá vas a poder personalizar todo, seguir artistas y llevar el registro de tus shows.
            </p>

            <div className={styles.welcomeActionsRow}>
              <Button
                variant="ghost"
                onClick={() => navigate("/events")}
                className={`${styles.welcomeBtn} ${styles.btnExplorar}`}
                style={{ flex: 1 }}
              >
                EXPLORAR EVENTOS
              </Button>
              <Button
                variant="ghost"
                onClick={() => navigate(`/profile/me`)}
                className={`${styles.welcomeBtn} ${styles.btnPerfil}`}
                style={{ flex: 1 }}
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
