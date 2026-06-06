import { Link } from "react-router-dom";
import styles from "./LogoVoy.module.css";

export default function LogoVoy({ className = "" }) {
  return (
    <Link to="/" className={`${styles.logoContainer} ${className}`} aria-label="VOY Project Home">
      <div className={styles.ticketMark}>
        <span className={styles.ticketLetter}>V</span>
        <div className={styles.ticketDash} />
        <span className={styles.ticketLetter}>Y</span>
      </div>
      <div className={styles.logoText}>
        <span className={styles.logoProject}>PROJECT</span>
      </div>
    </Link>
  );
}
