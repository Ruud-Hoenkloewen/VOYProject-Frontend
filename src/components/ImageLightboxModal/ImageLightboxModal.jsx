import { useEffect } from "react";
import styles from "./ImageLightboxModal.module.css";
import { X } from "lucide-react";

export default function ImageLightboxModal({ src, alt = "", caption = "", onClose }) {
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === "Escape") {
        onClose();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  if (!src) return null;

  return (
    <div className={styles.overlay} onClick={onClose} role="dialog" aria-modal="true">
      <div className={styles.content} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose} aria-label="Cerrar imagen">
          <X size={20} />
        </button>
        <div className={styles.imageWrapper}>
          <img src={src} alt={alt || caption || "Imagen ampliada"} className={styles.image} />
        </div>
        {(caption || alt) && (
          <div className={styles.captionBox}>
            <p className={styles.caption}>{caption || alt}</p>
          </div>
        )}
      </div>
    </div>
  );
}
