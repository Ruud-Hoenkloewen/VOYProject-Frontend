import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getMyProfile, updateMyProfile, checkUsername } from "../../services/userService";
import LogoVoy from "../../components/LogoVoy/LogoVoy";
import styles from "./ProfileEditPage.module.css";

const ROLES = ["fan", "artista", "productor"];

const GENEROS_MUSICALES = [
  "PUNK", "METAL", "HARDCORE", "GRUNGE", "ROCK", "INDIE",
  "TECHNO", "ELECTRÓNICA", "HOUSE", "POST-PUNK", "NOISE",
  "FOLK", "JAZZ", "HIP-HOP",
];

export default function ProfileEditPage() {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username:         "",
    bio:              "",
    ubicacion:        "",
    rol:              "fan",
    nombreArtistico:  "",
    generosMusicales: [],
    nombreProductora: "",
    redesSociales:    { instagram: "", twitter: "", spotify: "" },
  });

  const [loading,    setLoading]    = useState(true);
  const [saving,     setSaving]     = useState(false);
  const [feedback,   setFeedback]   = useState(null); // { type: "success"|"error", msg }

  // Username check
  const [usernameStatus, setUsernameStatus] = useState(null); // null | "checking" | "available" | "taken" | "own"
  const debounceRef = useRef(null);
  const originalUsername = useRef("");

  // ── Cargar perfil actual ──────────────────────────────────────────
  useEffect(() => {
    getMyProfile()
      .then((profile) => {
        originalUsername.current = profile.username || "";
        setForm({
          username:         profile.username         || "",
          bio:              profile.bio              || "",
          ubicacion:        profile.ubicacion        || "",
          rol:              profile.rol              || "fan",
          nombreArtistico:  profile.nombreArtistico  || "",
          generosMusicales: profile.generosMusicales || [],
          nombreProductora: profile.nombreProductora || "",
          redesSociales: {
            instagram: profile.redesSociales?.instagram || "",
            twitter:   profile.redesSociales?.twitter   || "",
            spotify:   profile.redesSociales?.spotify   || "",
          },
        });
      })
      .catch((err) => console.error("[ProfileEdit] Error cargando perfil:", err))
      .finally(() => setLoading(false));
  }, []);

  // ── Username con debounce ─────────────────────────────────────────
  const handleUsernameChange = useCallback((value) => {
    setForm((prev) => ({ ...prev, username: value }));

    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!value.trim()) { setUsernameStatus(null); return; }
    if (value === originalUsername.current) { setUsernameStatus("own"); return; }

    setUsernameStatus("checking");
    debounceRef.current = setTimeout(async () => {
      try {
        const { available } = await checkUsername(value);
        setUsernameStatus(available ? "available" : "taken");
      } catch {
        setUsernameStatus(null);
      }
    }, 500);
  }, []);

  // ── Handlers ─────────────────────────────────────────────────────
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

  // ── Guardar ───────────────────────────────────────────────────────
  async function handleSave() {
    if (usernameStatus === "taken") return;
    setSaving(true);
    setFeedback(null);

    try {
      const payload = {
        username:         form.username,
        bio:              form.bio,
        ubicacion:        form.ubicacion,
        rol:              form.rol,
        redesSociales:    form.redesSociales,
        ...(form.rol === "artista" && {
          nombreArtistico:  form.nombreArtistico,
          generosMusicales: form.generosMusicales,
        }),
        ...(form.rol === "productor" && {
          nombreProductora: form.nombreProductora,
        }),
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

  // ── Render ────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className={styles.page}>
        <div className={styles.loader}>Cargando perfil...</div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.grain} aria-hidden="true" />

      {/* Nav */}
      <nav className={styles.nav}>
        <div className={styles.navLogo}><LogoVoy /></div>
        <Link to={`/profile/${form.username || "me"}`} className={styles.navBack}>
          ← Volver al perfil
        </Link>
      </nav>

      <main className={styles.main}>
        <div className={styles.card}>
          <h1 className={styles.title}>EDITAR PERFIL</h1>
          <p className={styles.subtitle}>Actualizá tu información personal.</p>

          <div className={styles.divider} />

          {/* USERNAME */}
          <div className={styles.fieldGroup}>
            <label className={styles.label}>USERNAME</label>
            <div className={styles.inputWithStatus}>
              <input
                className={`${styles.input} ${
                  usernameStatus === "taken" ? styles.inputError :
                  usernameStatus === "available" ? styles.inputSuccess : ""
                }`}
                value={form.username}
                onChange={(e) => handleUsernameChange(e.target.value)}
                placeholder="tu_usuario"
                autoComplete="off"
              />
              <span className={styles.usernameStatus}>
                {usernameStatus === "checking"  && <span className={styles.checking}>...</span>}
                {usernameStatus === "available" && <span className={styles.available}>✓</span>}
                {usernameStatus === "taken"     && <span className={styles.taken}>✗</span>}
                {usernameStatus === "own"       && <span className={styles.available}>✓</span>}
              </span>
            </div>
            {usernameStatus === "taken" && (
              <span className={styles.errorMsg}>Este username ya está en uso.</span>
            )}
          </div>

          {/* BIO */}
          <div className={styles.fieldGroup}>
            <label className={styles.label}>BIO</label>
            <textarea
              className={styles.textarea}
              placeholder="Contanos algo de vos..."
              maxLength={160}
              value={form.bio}
              onChange={(e) => handleChange("bio", e.target.value)}
              rows={3}
            />
            <span className={styles.charCount}>{form.bio.length}/160</span>
          </div>

          {/* UBICACIÓN */}
          <div className={styles.fieldGroup}>
            <label className={styles.label}>UBICACIÓN</label>
            <input
              className={styles.input}
              placeholder="San Miguel de Tucumán, Argentina"
              value={form.ubicacion}
              onChange={(e) => handleChange("ubicacion", e.target.value)}
            />
          </div>

          {/* ROL */}
          <div className={styles.fieldGroup}>
            <label className={styles.label}>ROL</label>
            <div className={styles.rolGrid}>
              {ROLES.map((r) => (
                <button
                  key={r}
                  type="button"
                  className={`${styles.rolBtn} ${form.rol === r ? styles.rolBtnActive : ""}`}
                  onClick={() => handleChange("rol", r)}
                >
                  {r.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* CAMPOS SEGÚN ROL */}
          {form.rol === "artista" && (
            <>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>NOMBRE ARTÍSTICO</label>
                <input
                  className={styles.input}
                  placeholder="Tu nombre artístico"
                  value={form.nombreArtistico}
                  onChange={(e) => handleChange("nombreArtistico", e.target.value)}
                />
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>GÉNEROS MUSICALES</label>
                <div className={styles.chipGrid}>
                  {GENEROS_MUSICALES.map((g) => (
                    <button
                      key={g}
                      type="button"
                      className={`${styles.chip} ${form.generosMusicales.includes(g) ? styles.chipActive : ""}`}
                      onClick={() => toggleGenero(g)}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {form.rol === "productor" && (
            <div className={styles.fieldGroup}>
              <label className={styles.label}>NOMBRE DE PRODUCTORA</label>
              <input
                className={styles.input}
                placeholder="Nombre de tu productora"
                value={form.nombreProductora}
                onChange={(e) => handleChange("nombreProductora", e.target.value)}
              />
            </div>
          )}

          <div className={styles.divider} />

          {/* REDES SOCIALES */}
          <h2 className={styles.sectionTitle}>REDES SOCIALES</h2>

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
            <label className={styles.label}>TWITTER / X</label>
            <div className={styles.inputWrapper}>
              <span className={styles.inputPrefix}>@</span>
              <input
                className={styles.inputInner}
                placeholder="tu_usuario"
                value={form.redesSociales.twitter}
                onChange={(e) => handleRedSocial("twitter", e.target.value)}
              />
            </div>
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label}>SPOTIFY</label>
            <input
              className={styles.input}
              placeholder="URL de tu perfil de Spotify"
              value={form.redesSociales.spotify}
              onChange={(e) => handleRedSocial("spotify", e.target.value)}
            />
          </div>

          <div className={styles.divider} />

          {/* FEEDBACK */}
          {feedback && (
            <div className={`${styles.feedback} ${feedback.type === "success" ? styles.feedbackSuccess : styles.feedbackError}`}>
              {feedback.msg}
            </div>
          )}

          {/* BOTONES */}
          <div className={styles.btnRow}>
            <Link to={`/profile/${form.username || "me"}`} className={styles.btnBack}>
              CANCELAR
            </Link>
            <button
              className={styles.btnSave}
              onClick={handleSave}
              disabled={saving || usernameStatus === "taken"}
            >
              {saving ? "GUARDANDO..." : "GUARDAR CAMBIOS"}
            </button>
          </div>

        </div>
      </main>
    </div>
  );
}
