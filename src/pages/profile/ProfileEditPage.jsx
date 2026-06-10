import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getMyProfile, updateMyProfile, checkUsername, GRADIENTS, AVATAR_COLORS } from "../../services/userService";
import LogoVoy from "../../components/LogoVoy/LogoVoy";
import { MapPinIcon, TicketIcon } from "../../components/icons";
import styles from "./ProfileEditPage.module.css";

const GENEROS_MUSICALES = [
  "PUNK", "METAL", "HARDCORE", "GRUNGE", "ROCK", "INDIE",
  "TECHNO", "ELECTRÓNICA", "HOUSE", "POST-PUNK", "NOISE",
  "FOLK", "JAZZ", "HIP-HOP",
];

const VIBES_OPTIONS = [
  "Pogo", "Dance floor", "Karaoke", "Contemplación", "Mosh pit",
  "Cerveza en mano", "Fotógrafo", "Arte en vivo", "Noctámbulo",
  "Guitarrero", "Baterista de corazón", "Synth lover",
];

export default function ProfileEditPage() {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nombre:           "",
    username:         "",
    bio:              "",
    ubicacion:        "",
    redesSociales:    { instagram: "", twitter: "", spotify: "" },
    generosMusicales: [],
    vibes:            [],
    avatarColor:      AVATAR_COLORS?.[0]?.value || "#a3e635",
    gradientKey:      "g1",
  });

  const [loading,  setLoading]  = useState(true);
  const [saving,   setSaving]   = useState(false);
  const [feedback, setFeedback] = useState(null);

  const [usernameStatus, setUsernameStatus] = useState(null);
  const debounceRef      = useRef(null);
  const originalUsername = useRef("");

  // ── Cargar perfil ──────────────────────────────────────────────
  useEffect(() => {
    getMyProfile()
      .then((profile) => {
        let initialUsername = profile.username || "";
        if (!initialUsername && profile.nombre) {
          initialUsername = profile.nombre.toLowerCase()
            .trim()
            .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // remove accents
            .replace(/[^a-z0-9._]/g, ""); // keep only valid characters
        }
        
        originalUsername.current = profile.username || "";
        
        if (initialUsername) {
          if (initialUsername === originalUsername.current) {
            setUsernameStatus("own");
          } else {
            setUsernameStatus("checking");
            checkUsername(initialUsername)
              .then(({ available }) => {
                setUsernameStatus(available ? "available" : "taken");
              })
              .catch(() => setUsernameStatus(null));
          }
        } else {
          setUsernameStatus("empty");
        }

        setForm({
          nombre:           profile.nombre                || "",
          username:         initialUsername,
          bio:              profile.bio                   || "",
          ubicacion:        profile.ubicacion             || "",
          redesSociales: {
            instagram: profile.redesSociales?.instagram  || "",
            twitter:   profile.redesSociales?.twitter    || "",
            spotify:   profile.redesSociales?.spotify    || "",
          },
          generosMusicales: profile.generosMusicales     || [],
          vibes:            profile.vibeEnShows          || [],
          avatarColor:      profile.avatarColor          || (AVATAR_COLORS?.[0]?.value || "#a3e635"),
          gradientKey:      profile.bannerGradiente      || "g1",
        });
      })
      .catch((err) => console.error("[ProfileEdit] Error:", err))
      .finally(() => setLoading(false));
  }, []);

  // ── Username debounce ──────────────────────────────────────────
  const handleUsernameChange = useCallback((value) => {
    setForm((prev) => ({ ...prev, username: value }));
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!value.trim()) { setUsernameStatus("empty"); return; }
    if (value === originalUsername.current) { setUsernameStatus("own"); return; }
    setUsernameStatus("checking");
    debounceRef.current = setTimeout(async () => {
      try {
        const { available } = await checkUsername(value);
        setUsernameStatus(available ? "available" : "taken");
      } catch { setUsernameStatus(null); }
    }, 500);
  }, []);

  function handleChange(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleRedSocial(red, value) {
    setForm((prev) => ({
      ...prev,
      redesSociales: { ...prev.redesSociales, [red]: value },
    }));
  }

  function toggleGenero(g) {
    setForm((prev) => {
      const next = prev.generosMusicales.includes(g)
        ? prev.generosMusicales.filter((x) => x !== g)
        : [...prev.generosMusicales, g];
      return { ...prev, generosMusicales: next };
    });
  }

  function toggleVibe(v) {
    setForm((prev) => {
      const next = prev.vibes.includes(v)
        ? prev.vibes.filter((x) => x !== v)
        : [...prev.vibes, v];
      return { ...prev, vibes: next };
    });
  }

  // ── Guardar ────────────────────────────────────────────────────
  async function handleSave() {
    if (!form.nombre.trim()) {
      setFeedback({ type: "error", msg: "El nombre es obligatorio." });
      return;
    }
    if (!form.username.trim()) {
      setFeedback({ type: "error", msg: "El nombre de usuario es obligatorio." });
      return;
    }
    if (usernameStatus === "taken") {
      setFeedback({ type: "error", msg: "El nombre de usuario ya está en uso." });
      return;
    }
    
    setSaving(true);
    setFeedback(null);
    try {
      const payload = {
        nombre:           form.nombre,
        username:         form.username,
        bio:              form.bio,
        ubicacion:        form.ubicacion,
        redesSociales:    form.redesSociales,
        generosMusicales: form.generosMusicales,
        vibeEnShows:      form.vibes,
        avatarColor:      form.avatarColor,
        bannerGradiente:  form.gradientKey,
      };
      const result = await updateMyProfile(payload);
      if (updateUser) updateUser(result.user || result);
      originalUsername.current = form.username;
      setUsernameStatus("own");
      setFeedback({ type: "success", msg: "¡Perfil actualizado con éxito!" });
      setTimeout(() => navigate(`/profile/${form.username}`), 1200);
    } catch (err) {
      const msg = err.response?.data?.mensaje || "Error al guardar. Intentá de nuevo.";
      setFeedback({ type: "error", msg });
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className={styles.page}>
        <div className={styles.loader}>Cargando perfil...</div>
      </div>
    );
  }

  const initial    = (form.nombre || form.username || user?.nombre || "U").charAt(0).toUpperCase();
  const bannerBg   = GRADIENTS?.[form.gradientKey] || "linear-gradient(90deg,#C6F92B,#A044FF)";

  return (
    <div className={styles.page}>
      <div className={styles.grain} aria-hidden="true" />

      {/* ── HEADER CON NAV Y PORTADA ── */}
      <div className={styles.headerContainer}>
        {/* ── NAV — MODO EDICIÓN ── */}
        <nav className={styles.nav}>
          <div className={styles.navLogo}><LogoVoy /></div>
          <div className={styles.navActions}>
            <Link
              to={`/profile/${originalUsername.current || "me"}`}
              className={styles.btnCancel}
            >
              ✕ Cancelar
            </Link>
            <button
              className={styles.btnSaveNav}
              onClick={handleSave}
              disabled={saving || usernameStatus === "taken"}
            >
              {saving ? "GUARDANDO..." : "✓ GUARDAR"}
            </button>
          </div>
        </nav>

        <div className={styles.banner} style={{ background: bannerBg }} />
      </div>

      {/* ── BODY DE EDICIÓN ── */}
      <div className={styles.editBody}>

        {/* ── PERFIL HEADER (Avatar + Nombre + Handle en Banner) ── */}
        <div className={styles.profileHeader}>
          <div className={styles.avatarSquare} style={{ backgroundColor: form.avatarColor }}>
            {initial}
          </div>
          
          <div className={styles.userInfoEdit}>
            <div className={styles.nameInputWrapper}>
              <input
                type="text"
                className={styles.inputNombre}
                placeholder="Tu nombre"
                value={form.nombre}
                onChange={(e) => handleChange("nombre", e.target.value)}
              />
            </div>
            
            <div className={styles.usernameInputWrapper}>
              <span className={styles.usernamePrefix}>@</span>
              <input
                type="text"
                className={styles.inputUsername}
                placeholder="usuario"
                value={form.username}
                onChange={(e) => handleUsernameChange(e.target.value)}
                autoComplete="off"
              />
              {usernameStatus === "taken" && <span className={styles.takenBadge}>✗ en uso</span>}
              {usernameStatus === "available" && <span className={styles.availableBadge}>✓</span>}
            </div>
          </div>
        </div>

        {/* FEEDBACK INTEGRADO */}
        {feedback && (
          <div className={`${styles.feedback} ${feedback.type === "success" ? styles.feedbackSuccess : styles.feedbackError}`} style={{ margin: '0 0 20px 0' }}>
            {feedback.msg}
          </div>
        )}

        <div className={styles.topGrid}>
          {/* LEFT: BIO */}
          <div className={styles.topGridLeft}>
            <div className={styles.rolBadgeWrapper}>
              <span className={styles.rolBadge}>
                <TicketIcon size={12} /> FAN
              </span>
            </div>
            
            <div className={styles.fieldGroup}>
              <label className={styles.label}>BIO</label>
              <textarea
                className={styles.textarea}
                maxLength={160}
                value={form.bio}
                onChange={(e) => handleChange("bio", e.target.value)}
                rows={4}
              />
            </div>
          </div>

          {/* RIGHT: APARIENCIA */}
          <div className={styles.topGridRight}>
            <span className={styles.appearanceTitle}>APARIENCIA</span>

            <div className={styles.appearanceSection}>
              <span className={styles.appearanceLabel}>COLOR DE AVATAR</span>
              <div className={styles.swatchGrid}>
                {(AVATAR_COLORS || []).map((c) => (
                  <button
                    key={c.value}
                    className={`${styles.swatch} ${form.avatarColor === c.value ? styles.swatchActive : ""}`}
                    style={{ backgroundColor: c.value }}
                    onClick={() => handleChange("avatarColor", c.value)}
                    title={c.name}
                    type="button"
                  />
                ))}
              </div>
            </div>

            <div className={styles.appearanceSection}>
              <span className={styles.appearanceLabel}>PORTADA</span>
              <div className={styles.gradientGrid}>
                {Object.keys(GRADIENTS || {}).map((key) => (
                  <button
                    key={key}
                    className={`${styles.gradBtn} ${form.gradientKey === key ? styles.gradBtnActive : ""}`}
                    style={{ background: GRADIENTS[key] }}
                    onClick={() => handleChange("gradientKey", key)}
                    type="button"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM: DATOS DEL PERFIL */}
        <div className={styles.datosCard}>
          <h2 className={styles.sectionTitle}>DATOS DEL PERFIL</h2>
          <div className={styles.divider} />

          <div className={styles.fieldsGrid}>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>INSTAGRAM</label>
              <div className={styles.inputWrapper}>
                <span className={styles.inputPrefix}>@</span>
                <input
                  className={styles.inputInner}
                  placeholder="tu_usuario"
                  value={form.redesSociales.instagram}
                  onChange={(e) => handleRedSocial("instagram", e.target.value)}
                />
              </div>
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.label}>UBICACIÓN</label>
              <div className={styles.inputWrapper}>
                <MapPinIcon size={14} style={{ color: 'var(--ds-color-brand-lime)', flexShrink: 0, marginLeft: '12px' }} />
                <input
                  className={styles.inputInner}
                  placeholder="San Miguel de Tucumán, Argentina"
                  value={form.ubicacion}
                  onChange={(e) => handleChange("ubicacion", e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className={styles.fieldGroup} style={{ marginTop: '24px' }}>
            <label className={styles.label}>GÉNEROS</label>
            <div className={styles.chipGrid}>
              {GENEROS_MUSICALES.map((g) => (
                <button
                  key={g}
                  type="button"
                  className={`${styles.chip} ${form.generosMusicales.includes(g) ? styles.chipActiveGenre : ""}`}
                  onClick={() => toggleGenero(g)}
                >
                  {form.generosMusicales.includes(g) && <span style={{ marginRight: '4px' }}></span>}{g}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.fieldGroup} style={{ marginTop: '24px' }}>
            <label className={styles.label}>VIBES</label>
            <div className={styles.chipGrid}>
              {VIBES_OPTIONS.map((v) => (
                <button
                  key={v}
                  type="button"
                  className={`${styles.chip} ${form.vibes.includes(v) ? styles.chipActiveVibe : ""}`}
                  onClick={() => toggleVibe(v)}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>
        </div>



      </div>
    </div>
  );
}
