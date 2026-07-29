import { useState, useEffect, useRef } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import LogoVoy from "../../../components/LogoVoy/LogoVoy";
import ThemeToggler from "../../../components/ThemeToggler/ThemeToggler";
import HowItWorksModal from "../../../components/HowItWorksModal/HowItWorksModal";
import styles from "./EditorialHeader.module.css";

export default function EditorialHeader({ ctaLabel = "ACCEDER", ctaTo = "/login" }) {
  const { user, isAuthenticated, logout, role } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isProducer = role === 'producer' || user?.role === 'producer';
  const isProducerDashboard = location.pathname.includes('/producer');
  const isEventForm = location.pathname.includes('/events/create') || location.pathname.includes('/events/edit');
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showHowModal, setShowHowModal] = useState(false);
  const [badgeVisible, setBadgeVisible] = useState(true);
  const lastScrollY = useRef(0);
  const dropdownRef = useRef(null);

  // Ocultar la píldora de ayuda automáticamente a los 4.5s
  useEffect(() => {
    const timer = setTimeout(() => {
      setBadgeVisible(false);
    }, 4500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleLogout() {
    logout();
    navigate("/");
  }

  useEffect(() => {
    const onScroll = () => {
      const currentY = window.scrollY;
      const delta = currentY - lastScrollY.current;
      if (currentY < 10) {
        setHidden(false);
      } else if (delta > 6) {
        setHidden(true);
        setMenuOpen(false);
      } else if (delta < -6) {
        setHidden(false);
      }
      lastScrollY.current = currentY;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  const navLinks = [
    { to: "/", label: "INICIO", end: true },
    { to: "/events", label: "EXPLORAR EVENTOS" },
  ];

  if (isAuthenticated) {
    if (role === "producer") {
      navLinks.push({ to: "/dashboard/producer", label: "PANEL PRODUCTOR" });
    } else if (role === "artist") {
      navLinks.push({ to: "/dashboard/artist", label: "PANEL ARTISTA" });
    }
  }

  return (
    <>
      <header
        className={`${styles.header} ${hidden ? styles.hidden : ""}`}
        onMouseEnter={() => setHidden(false)}
        onMouseLeave={() => {
          if (location.pathname !== "/" && window.scrollY > 60) {
            setHidden(true);
          }
        }}
      >
        <div className={styles.leftContainer} onClick={closeMenu} style={{ cursor: "pointer" }}>
          <LogoVoy inverse={true} />
        </div>

        <nav className={styles.nav}>
          {navLinks.map(({ to, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `${styles.navLink} ${isActive ? styles.navLinkActive : ""}`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>

        <div className={styles.rightContainer}>
          {isAuthenticated ? (
            <div className={styles.userArea}>
              <div className={styles.userDropdownContainer} ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className={styles.userWidget}
                  style={{ cursor: "pointer", color: "inherit", fontFamily: "inherit", textAlign: "left" }}
                  aria-haspopup="true"
                  aria-expanded={dropdownOpen}
                >
                  <div
                    className={styles.userAvatar}
                    style={{ backgroundColor: user?.avatarColor || 'var(--ds-color-brand-lime)' }}
                  >
                    {(user?.avatar || user?.avatarUrl || user?.fotoPerfil) ? (
                      <img src={user.avatar || user.avatarUrl || user.fotoPerfil} alt="Avatar" className={styles.userAvatarImg} />
                    ) : (
                      (user?.nombre || user?.username || 'U').charAt(0).toUpperCase()
                    )}
                  </div>
                  <div className={styles.userInfo} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <span className={styles.userNombre}>
                      {(user?.nombre || user?.username || 'Usuario').toUpperCase()}
                    </span>
                  </div>
                </button>

                {dropdownOpen && (
                  <div className={styles.dropdownMenu}>
                    <Link to={`/profile/${user?.username || user?._id || 'me'}`} onClick={() => setDropdownOpen(false)}>
                      Mi Perfil
                    </Link>
                    <Link to="/profile/edit" onClick={() => setDropdownOpen(false)}>
                      Ajustes de perfil
                    </Link>
                    <hr />
                    <button onClick={() => { setDropdownOpen(false); handleLogout(); }}>
                      Cerrar sesión
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <Link to={ctaTo} className={`${styles.cta} ${styles.ctaDesktop}`}>
              {ctaLabel}
            </Link>
          )}

          <ThemeToggler style={{ color: "#c8c8c8", borderColor: "#3a3a3a" }} />

          <button
            className={styles.hamburger}
            onClick={() => setMenuOpen((o) => !o)}
            aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={menuOpen}
          >
            <span className={`${styles.hamburgerBar} ${menuOpen ? styles.barTop : ""}`} />
            <span className={`${styles.hamburgerBar} ${menuOpen ? styles.barMid : ""}`} />
            <span className={`${styles.hamburgerBar} ${menuOpen ? styles.barBot : ""}`} />
          </button>
        </div>
      </header>

      <div
        className={`${styles.drawer} ${menuOpen ? styles.drawerOpen : ""}`}
        aria-hidden={!menuOpen}
      >
        <nav className={styles.drawerNav}>
          {navLinks.map(({ to, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `${styles.drawerLink} ${isActive ? styles.drawerLinkActive : ""}`
              }
              onClick={closeMenu}
            >
              {label}
            </NavLink>
          ))}

          {isAuthenticated ? (
            <button className={styles.drawerCta} onClick={() => { handleLogout(); closeMenu(); }}>
              SALIR
            </button>
          ) : (
            <Link to={ctaTo} className={styles.drawerCta} onClick={closeMenu}>
              {ctaLabel}
            </Link>
          )}
        </nav>
        <p className={styles.drawerFooter}>VOY PROJECT · TUCUMÁN · 2026</p>
      </div>

      {menuOpen && (
        <div className={styles.drawerOverlay} onClick={closeMenu} aria-hidden="true" />
      )}

      {/* Botón flotante inferior derecho con animación ¿Necesitás ayuda? (Solo visible en el panel para productores y fuera de los formularios) */}
      {(!isEventForm && (!isProducer || isProducerDashboard)) && (
        <div 
          className={styles.floatingHelpWrapper}
          onMouseEnter={() => setBadgeVisible(false)}
        >
          <div className={`${styles.floatingHelpBadge} ${!badgeVisible ? styles.floatingHelpBadgeHidden : ""}`}>
            <span className={styles.floatingHelpDot} />
            <span>¿Necesitás ayuda?</span>
          </div>
          <button
            type="button"
            className={styles.floatingHelpBtn}
            onClick={() => {
              setBadgeVisible(false);
              setShowHowModal(true);
            }}
            aria-label="¿Cómo funciona VOY Project?"
          >
            ?
          </button>
        </div>
      )}

      {showHowModal && (
        <HowItWorksModal isProducer={isProducerDashboard} onClose={() => setShowHowModal(false)} />
      )}
    </>
  );
}