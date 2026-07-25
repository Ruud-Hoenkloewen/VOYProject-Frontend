import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getMyProfile, updateMyProfile, checkUsername, GRADIENTS, AVATAR_COLORS } from "../../services/userService";
import LogoVoy from "../../components/LogoVoy/LogoVoy";
import { MapPinIcon, EditIcon } from "../../components/icons";
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
  const fileInputRef = useRef(null);

  const [form, setForm] = useState({
    nombre:           "",
    username:         "",
    bio:              "",
    ubicacion:        "",
    avatarUrl:        "",
    artistasFavoritos:"",
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

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64Data = event.target.result;
      handleChange("avatarUrl", base64Data);
    };
    reader.readAsDataURL(file);
  };

  // ── Cargar perfil ──────────────────────────────────────────────
  useEffect(() => {
    getMyProfile()
      .then((profile) => {
        let initialUsername = profile.username || "";
        if (!initialUsername && profile.nombre) {
          initialUsername = profile.nombre.toLowerCase()
            .trim()
            .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
            .replace(/[^a-z0-9._]/g, "");
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
          avatarUrl:        profile.avatarUrl || profile.fotoPerfil || profile.avatar || "",
          artistasFavoritos:profile.artistasFavoritos    || "",
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
    debounceRef.current = setTimeout(() => {
      checkUsername(value)
        .then(({ available }) => setUsernameStatus(available ? "available" : "taken"))
        .catch(() => setUsernameStatus(null));
    }, 400);
  }, []);

  const handleChange = (field, val) => {
    setForm((prev) => ({ ...prev, [field]: val }));
  };

  const handleRedSocial = (network, val) => {
    setForm((prev) => ({
      ...prev,
      redesSociales: { ...prev.redesSociales, [network]: val },
    }));
  };

  const toggleGenero = (g) => {
    setForm((prev) => {
      const exists = prev.generosMusicales.includes(g);
      const next   = exists
        ? prev.generosMusicales.filter((x) => x !== g)
        : [...prev.generosMusicales, g];
      return { ...prev, generosMusicales: next };
    });
  };

  const toggleVibe = (v) => {
    setForm((prev) => {
      const exists = prev.vibes.includes(v);
      const next   = exists
        ? prev.vibes.filter((x) => x !== v)
        : [...prev.vibes, v];
      return { ...prev, vibes: next };
    });
  };

  // ── Guardar ───────────────────────────────────────────────────
  const handleSave = async () => {
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
        avatar:           form.avatarUrl,
        avatarUrl:        form.avatarUrl,
        fotoPerfil:       form.avatarUrl,
        artistasFavoritos:form.artistasFavoritos,
        recitalMemorable: form.recitalMemorable,
        redesSociales:    form.redesSociales,
        generosMusicales: form.generosMusicales,
        vibeEnShows:      form.vibes,
        avatarColor:      form.avatarColor,
        bannerGradiente:  form.gradientKey,
      };

      const updated = await updateMyProfile(payload);
      if (updateUser) updateUser(updated);
      setFeedback({ type: "success", msg: "¡Perfil actualizado con éxito!" });
      setTimeout(() => {
        navigate(`/profile/${form.username || user?.username || "me"}`);
      }, 1200);
    } catch (err) {
      console.error("[ProfileEdit] Error al guardar:", err);
      const msg = err.response?.data?.message || "No se pudo guardar el perfil.";
      setFeedback({ type: "error", msg });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{
        position: 'fixed',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'var(--ds-color-bg-canvas)',
        backgroundImage: 'none',
        zIndex: 9999,
      }}>
        <span style={{
          color: '#4b5563',
          fontFamily: 'monospace',
          fontSize: '0.78rem',
          letterSpacing: '0.06em',
        }}>
          cargando...{' '}
          <span style={{ color: '#00FF9F' }}>perfil</span>
        </span>
      </div>
    );
  }

  const bannerBg = GRADIENTS[form.gradientKey] || GRADIENTS.g1;
  const initial  = (form.nombre || form.username || "U").charAt(0).toUpperCase();

  return (
    <div className={styles.page}>
      <div className={styles.headerContainer}>
        <nav className={styles.nav}>
          <div className={styles.navLogo}><LogoVoy inverse={true} /></div>
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
          <div 
            className={styles.avatarSquare} 
            style={{ backgroundColor: form.avatarColor }}
            onClick={() => fileInputRef.current?.click()}
            title="Hacé clic para cambiar tu foto de perfil"
          >
            {form.avatarUrl ? (
              <img src={form.avatarUrl} alt={form.nombre} className={styles.avatarImage} />
            ) : (
              initial
            )}
            <div className={styles.avatarOverlay}>
              <EditIcon size={20} />
              <span>CAMBIAR FOTO</span>
            </div>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className={styles.hiddenFileInput}
            onChange={handleFileChange}
          />
          
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
          <div className={`${styles.feedback} ${feedback.type === "success" ? styles.feedbackSuccess : styles.feedbackError}`}>
            {feedback.msg}
          </div>
        )}

        <div className={styles.topGrid}>
          {/* LEFT: BIO & ARTISTAS */}
          <div className={styles.topGridLeft}>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>BIO</label>
              <textarea
                className={styles.textarea}
                maxLength={160}
                value={form.bio}
                onChange={(e) => handleChange("bio", e.target.value)}
                rows={3}
                placeholder="Contanos tu movida..."
              />
            </div>

            <div className={`${styles.fieldGroup} ${styles.fieldGroupMarginTop}`}>
              <label className={styles.label}>ARTISTAS FAVORITOS</label>
              <div className={styles.inputWrapper}>
                <input
                  type="text"
                  className={styles.inputInner}
                  placeholder="Ej: La Mugre, Código Rojo, Palco Roto..."
                  value={form.artistasFavoritos}
                  onChange={(e) => handleChange("artistasFavoritos", e.target.value)}
                />
              </div>
            </div>

            <div className={`${styles.fieldGroup} ${styles.fieldGroupMarginTop}`}>
              <label className={styles.label}>SHOW O RECITAL INOLVIDABLE</label>
              <div className={styles.inputWrapper}>
                <input
                  type="text"
                  className={styles.inputInner}
                  placeholder="Ej: Wos en la Plaza de Toros, La Renga..."
                  value={form.recitalMemorable || ""}
                  onChange={(e) => handleChange("recitalMemorable", e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* RIGHT: APARIENCIA & FOTO */}
          <div className={styles.topGridRight}>
            <span className={styles.appearanceTitle}>APARIENCIA</span>

            <div className={styles.appearanceSection}>
              <span className={styles.appearanceLabel}>FOTO DE PERFIL (URL)</span>
              <div className={styles.inputWrapper}>
                <input
                  type="url"
                  className={styles.inputInner}
                  placeholder="https://link-a-tu-foto.jpg"
                  value={form.avatarUrl}
                  onChange={(e) => handleChange("avatarUrl", e.target.value)}
                />
              </div>
            </div>

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
                <MapPinIcon size={14} className={styles.locationIcon} />
                <input
                  className={styles.inputInner}
                  placeholder="San Miguel de Tucumán, Argentina"
                  value={form.ubicacion}
                  onChange={(e) => handleChange("ubicacion", e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className={`${styles.fieldGroup} ${styles.fieldGroupMarginTop}`}>
            <label className={styles.label}>GÉNEROS</label>
            <div className={styles.chipGrid}>
              {GENEROS_MUSICALES.map((g) => (
                <button
                  key={g}
                  type="button"
                  className={`${styles.chip} ${form.generosMusicales.includes(g) ? styles.chipActiveGenre : ""}`}
                  onClick={() => toggleGenero(g)}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          <div className={`${styles.fieldGroup} ${styles.fieldGroupMarginTop}`}>
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
