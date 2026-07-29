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
  const bannerInputRef = useRef(null);

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
    avatarColor:      AVATAR_COLORS?.[0]?.value || "#00FF9F",
    gradientKey:      "g1",
    bannerImagen:     "",
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

  const handleBannerFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64Data = event.target.result;
      handleChange("bannerImagen", base64Data);
    };
    reader.readAsDataURL(file);
  };

  // ── Cargar perfil ──────────────────────────────────────────────
  useEffect(() => {
    getMyProfile()
      .then(async (profile) => {
        let initialUsername = profile.username || "";
        if (!initialUsername && profile.nombre) {
          const base = profile.nombre.toLowerCase()
            .trim()
            .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
            .replace(/[^a-z0-9._]/g, "");
          try {
            const check = await checkUsername(base);
            if (check.available) {
              initialUsername = base;
            } else {
              initialUsername = `${base}${Math.floor(100 + Math.random() * 900)}`;
            }
          } catch {
            initialUsername = base;
          }
        }
        
        originalUsername.current = profile.username || initialUsername;
        
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
          avatarColor:      profile.avatarColor          || (AVATAR_COLORS?.[0]?.value || "#00FF9F"),
          gradientKey:      profile.bannerGradiente      || "g1",
          bannerImagen:     profile.bannerImagen         || "",
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
        bannerImagen:     form.bannerImagen,
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
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'var(--ds-color-bg-canvas)',
        backgroundImage: 'none',
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

  const bannerBg = form.bannerImagen 
    ? `url("${form.bannerImagen}") center/cover no-repeat` 
    : (GRADIENTS[form.gradientKey] || form.gradientKey || GRADIENTS.g1);

  const avatarColor = form.avatarColor || 'transparent';
  const hasAvatarColor = avatarColor !== 'transparent' && avatarColor !== 'none';
  const avatarStyle = hasAvatarColor
    ? { background: avatarColor, padding: '3px' }
    : { background: 'transparent', padding: 0 };

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

        <div 
          className={styles.banner} 
          style={{ background: bannerBg }}
          onClick={() => bannerInputRef.current?.click()}
        >
          <div className={styles.bannerOverlay}>
            <EditIcon size={22} />
            <span>CAMBIAR BANNER</span>
          </div>
        </div>
        <input
          ref={bannerInputRef}
          type="file"
          accept="image/*"
          className={styles.hiddenFileInput}
          onChange={handleBannerFileChange}
        />
      </div>

      {/* ── BODY DE EDICIÓN ── */}
      <div className={styles.editBody}>

        {/* ── PERFIL HEADER (Avatar + Nombre + Handle en Banner) ── */}
        <div className={styles.profileHeader}>
          <div 
            className={styles.avatarSquare} 
            style={avatarStyle}
            onClick={() => fileInputRef.current?.click()}
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
            <span className={styles.appearanceTitle}>APARIENCIA Y PERSONALIZACIÓN</span>

            <div className={styles.appearanceSection}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                <span className={styles.appearanceLabel}>FOTO DE PERFIL</span>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                    background: 'rgba(0, 255, 159, 0.1)',
                    border: '1px solid rgba(0, 255, 159, 0.3)',
                    color: '#00FF9F',
                    padding: '0.2rem 0.6rem',
                    borderRadius: '4px',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  📷 SUBIR FOTO
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={handleFileChange}
                />
              </div>
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
              <span className={styles.appearanceLabel}>COLOR / ACENTO DEL PERFIL</span>
              <div style={{ fontSize: '0.7rem', color: '#888', marginBottom: '0.35rem', fontWeight: 700 }}>COLORES FIJOS</div>
              <div className={styles.swatchGrid}>
                {(AVATAR_COLORS || []).filter(c => c.category === 'fijo').map((c) => (
                  <button
                    key={c.value}
                    className={`${styles.swatch} ${form.avatarColor === c.value ? styles.swatchActive : ""}`}
                    style={{ background: c.value }}
                    onClick={() => handleChange("avatarColor", c.value)}
                    title={c.name}
                    type="button"
                  />
                ))}
              </div>

              <div style={{ fontSize: '0.7rem', color: '#888', margin: '0.75rem 0 0.35rem', fontWeight: 700 }}>GRADIENTES MIXTOS Y ARCOÍRIS</div>
              <div className={styles.swatchGrid}>
                {(AVATAR_COLORS || []).filter(c => c.category !== 'fijo').map((c) => (
                  <button
                    key={c.value}
                    className={`${styles.swatch} ${form.avatarColor === c.value ? styles.swatchActive : ""}`}
                    style={{ background: c.value }}
                    onClick={() => handleChange("avatarColor", c.value)}
                    title={c.name}
                    type="button"
                  />
                ))}
              </div>
            </div>

            <div className={styles.appearanceSection}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                <span className={styles.appearanceLabel}>BANER DE PORTADA</span>
                <button
                  type="button"
                  onClick={() => bannerInputRef.current?.click()}
                  style={{
                    background: 'rgba(0, 255, 159, 0.1)',
                    border: '1px solid rgba(0, 255, 159, 0.3)',
                    color: '#00FF9F',
                    padding: '0.2rem 0.6rem',
                    borderRadius: '4px',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  📷 CARGAR FOTO BANNER
                </button>
                <input
                  ref={bannerInputRef}
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={handleBannerFileChange}
                />
              </div>

              <div className={styles.gradientGrid}>
                {Object.keys(GRADIENTS || {}).map((key) => (
                  <button
                    key={key}
                    className={`${styles.gradBtn} ${form.gradientKey === key && !form.bannerImagen ? styles.gradBtnActive : ""}`}
                    style={{ background: GRADIENTS[key] }}
                    onClick={() => {
                      handleChange("gradientKey", key);
                      handleChange("bannerImagen", "");
                    }}
                    type="button"
                  />
                ))}
              </div>

              <div className={styles.inputWrapper} style={{ marginTop: '0.5rem' }}>
                <input
                  type="url"
                  className={styles.inputInner}
                  placeholder="O pegá la URL de una foto para el banner..."
                  value={form.bannerImagen}
                  onChange={(e) => handleChange("bannerImagen", e.target.value)}
                />
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
