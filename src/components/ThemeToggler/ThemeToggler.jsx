import { useTheme } from "../../context/ThemeContext";
import { Moon, Sun } from "lucide-react";
import styles from "./ThemeToggler.module.css";

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
