import { useState, useEffect, useRef } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import LogoVoy from "../../../components/LogoVoy/LogoVoy";
import UserAvatar from "../../../components/UserAvatar/UserAvatar";
import styles from "./EditorialHeader.module.css";

/**
 * COMPONENTE: EditorialHeader
 * Header editorial compartido — scroll-aware con hide/show por dirección.
 * Mobile: menú hamburguesa con drawer animado.
 */
export default function EditorialHeader({ ctaLabel = "ACCEDER", ctaTo = "/login" }) {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const lastScrollY = useRef(0);

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

  const NAV_LINKS = [
    { to: "/", label: "INICIO", end: true },
    { to: "/events", label: "EXPLORAR EVENTOS" },
  ];

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
        {/* LOGO */}
        <div onClick={closeMenu} style={{ cursor: "pointer" }}>
          <LogoVoy />
        </div>

        {/* NAV LINKS — desktop */}
        <nav className={styles.nav}>
          {NAV_LINKS.map(({ to, label, end }) => (
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

        {/* CTA / Usuario — desktop */}
        {isAuthenticated ? (
          <div className={styles.userArea}>
            <UserAvatar />
          </div>
        ) : (
          <Link to={ctaTo} className={`${styles.cta} ${styles.ctaDesktop}`}>
            {ctaLabel}
          </Link>
        )}

        {/* HAMBURGER — mobile only */}
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
      </header>

      {/* MOBILE DRAWER */}
      <div
        className={`${styles.drawer} ${menuOpen ? styles.drawerOpen : ""}`}
        aria-hidden={!menuOpen}
      >
        <nav className={styles.drawerNav}>
          {NAV_LINKS.map(({ to, label, end }) => (
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

      {/* OVERLAY */}
      {menuOpen && (
        <div className={styles.drawerOverlay} onClick={closeMenu} aria-hidden="true" />
      )}
    </>
  );
}