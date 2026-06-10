import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { updateMyProfile, GRADIENTS, AVATAR_COLORS } from "../../services/userService";
import { Button, Typography, Card, Container } from "../../design-system";
import LogoVoy from "../../components/LogoVoy/LogoVoy";
import { MapPinIcon } from "../../components/icons";
import styles from "./OnboardingPage.module.css";

export default function OnboardingPage() {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();

  // Estados locales para la personalización
  const [selectedAvatarColor, setSelectedAvatarColor] = useState(
    user?.avatarColor || AVATAR_COLORS[0].value
  );
  const [selectedGradientKey, setSelectedGradientKey] = useState(
    user?.bannerGradiente || "g1"
  );
  const [submitting, setSubmitting] = useState(false);
  const [showWelcomeOverlay, setShowWelcomeOverlay] = useState(false);

  // Generar username y inicial del usuario logueado
  const initials = user?.nombre ? user.nombre.charAt(0).toUpperCase() : "U";
  const userHandle = user?.nombre ? user.nombre.toLowerCase().replace(/\s+/g, '') : "usuario";
  const userBio = user?.bio || "Sin bio todavía. Editá tu perfil para contarle algo a la comunidad.";

  // Guardar configuración del perfil
  const handleConfirm = async () => {
    setSubmitting(true);
    try {
      // Simular llamada PUT /api/users/me y guardar en localStorage
      const result = await updateMyProfile(selectedAvatarColor, selectedGradientKey);
      
      // Actualizar el estado global del usuario en el AuthContext
      updateUser(result.user);
      
      // Mostrar overlay de bienvenida y poner la bandera en localStorage
      localStorage.setItem("onboardingDone", "true");
      setShowWelcomeOverlay(true);
    } catch (err) {
      console.error("Error al actualizar la personalización del perfil:", err);
      alert("Hubo un problema al guardar tus preferencias. Por favor intentá de nuevo.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.grain} aria-hidden="true" />

      {/* Nav superior mínima */}
      <nav className={styles.nav}>
        <div className={styles.navLogo}>
          <LogoVoy />
        </div>
        <div className={styles.stepsIndicator}>
          <span className={styles.stepDone}>Cuenta ✓</span>
          <span className={styles.stepDivider}>—</span>
          <span className={styles.stepDone}>Info ✓</span>
          <span className={styles.stepDivider}>—</span>
          <span className={styles.stepActive}>Tu Estilo ●</span>
        </div>
      </nav>

      <main className={styles.main}>
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
                      aria-checked={selectedAvatarColor === swatch.value}
                      onClick={() => setSelectedAvatarColor(swatch.value)}
                      className={`${styles.swatchBtn} ${
                        selectedAvatarColor === swatch.value ? styles.swatchBtnActive : ""
                      }`}
                      style={{ backgroundColor: swatch.value }}
                      title={swatch.name}
                    />
                  ))}
                </div>
              </div>

              {/* PORTADA DEL PERFIL (GRADIENTES) */}
              <div className={styles.sectionField}>
                <Typography variant="label" className={styles.sectionLabel}>PORTADA DEL PERFIL (BANNER)</Typography>
                <div className={styles.gradientsGrid} role="radiogroup" aria-label="Portada del perfil">
                  {Object.keys(GRADIENTS).map((key) => (
                    <button
                      key={key}
                      role="radio"
                      aria-checked={selectedGradientKey === key}
                      onClick={() => setSelectedGradientKey(key)}
                      className={`${styles.gradientBtn} ${
                        selectedGradientKey === key ? styles.gradientBtnActive : ""
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
                <Button
                  variant="primary"
                  onClick={handleConfirm}
                  disabled={submitting}
                  fullWidth
                >
                  {submitting ? "GUARDANDO ESTILO..." : "CONFIRMAR Y FINALIZAR →"}
                </Button>
              </div>

            </div>
          </section>

          {/* COLUMNA DERECHA — LIVE PREVIEW */}
          <aside className={styles.previewSection}>
            <div className={styles.previewSticky}>
              <Typography variant="caption" className={styles.previewTitle}>VISTA PREVIA EN TIEMPO REAL</Typography>
              
              {/* MINI REPLICA DE PERFIL */}
              <Card className={styles.miniProfile}>
                
                {/* Banner con gradiente seleccionado */}
                <div 
                  className={styles.miniBanner} 
                  style={{ background: GRADIENTS[selectedGradientKey] }}
                />

                <div className={styles.miniContent}>
                  
                  {/* Avatar con color seleccionado */}
                  <div 
                    className={styles.miniAvatar}
                    style={{ backgroundColor: selectedAvatarColor }}
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
      </main>

      {/* OVERLAY DE PANTALLA DE BIENVENIDA (MODAL POST-CONFIRMACIÓN) */}
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
