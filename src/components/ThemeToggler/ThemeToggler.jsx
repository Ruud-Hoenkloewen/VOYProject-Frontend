import { useTheme } from "../../context/ThemeContext";
import styles from "./ThemeToggler.module.css";

const Sun = ({ size = 20, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="4"/>
    <path d="M12 2v2"/>
    <path d="M12 20v2"/>
    <path d="m4.93 4.93 1.41 1.41"/>
    <path d="m17.66 17.66 1.41 1.41"/>
    <path d="M2 12h2"/>
    <path d="M20 12h2"/>
    <path d="m6.34 17.66-1.41 1.41"/>
    <path d="m19.07 4.93-1.41 1.41"/>
  </svg>
);

const Moon = ({ size = 20, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 3a6 6 0 0 0 9 9 9 0 1 1-9-9Z"/>
  </svg>
);

export default function ThemeToggler({ className, style }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      className={`${styles.toggler} ${className || ""}`}
      style={style}
      onClick={toggleTheme}
      aria-label="Toggle theme"
    >
      {theme === "light" ? (
        <Moon size={20} className={styles.icon} />
      ) : (
        <Sun size={20} className={styles.icon} />
      )}
    </button>
  );
}
