import { NavLink, Link } from "react-router-dom";
import SearchBar from "../SearchBar/SearchBar";
import { useAuth } from "../../../context/AuthContext";
import UserAvatar from "../../../components/UserAvatar/UserAvatar";
import ThemeToggler from "../../../components/ThemeToggler/ThemeToggler";
import styles from "./Navbar.module.css";

/**
 * COMPONENTE: Navbar
 * Header de la página de exploración de eventos.
 * Incluye buscador, link "Explorar Eventos" que se ilumina en /events,
 * y acciones de autenticación (Ingresar / Crear Evento).
 * NO se usa en LandingPage — esta tiene su propio header editorial.
 */
export default function Navbar() {
  const { isAuthenticated, role, user } = useAuth();

  return (
    <header className={styles.root}>
      <Link to="/" className={styles.brand}>
        <span className={styles.brandMark}>V</span>
        <strong>VOY PROJECT</strong>
      </Link>

      <div className={styles.search}>
        <SearchBar />
      </div>

      <nav className={styles.actions}>
        <NavLink
          to="/events"
          className={({ isActive }) =>
            `${styles.eventsLink} ${isActive ? styles.eventsLinkActive : ""}`
          }
        >
          Explorar Eventos
        </NavLink>
        <NavLink
          to="/community"
          className={({ isActive }) =>
            `${styles.eventsLink} ${isActive ? styles.eventsLinkActive : ""}`
          }
        >
          Comunidad
        </NavLink>
        {isAuthenticated ? (
          <>
            {role === "producer" && (
              <Link to="/dashboard/producer" className={styles.actionPrimary} style={{ marginRight: "1rem" }}>
                Panel Productor
              </Link>
            )}
            {role === "artist" && (
              <Link to="/dashboard/artist" className={styles.actionPrimary} style={{ marginRight: "1rem" }}>
                Panel Artista
              </Link>
            )}
            <UserAvatar />
            <ThemeToggler />
          </>
        ) : (
          <>
            <Link to="/login" className={styles.actionGhost}>Ingresar</Link>
            <Link to="/register" className={styles.actionPrimary}>Crear Evento</Link>
            <ThemeToggler />
          </>
        )}
      </nav>
    </header>
  );
}
