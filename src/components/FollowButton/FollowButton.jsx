import { useState } from "react";
import { followUser, unfollowUser } from "../../services/userService";
import styles from "./FollowButton.module.css";

/**
 * FollowButton — botón de seguir/dejar de seguir a un usuario.
 *
 * Props:
 *   userId      {string}  — ID del usuario a seguir/dejar de seguir
 *   isFollowing {boolean} — estado inicial desde el backend
 */
export default function FollowButton({ userId, isFollowing: initialFollowing }) {
  const [following, setFollowing]   = useState(initialFollowing);
  const [loading,   setLoading]     = useState(false);

  async function handleToggle() {
    if (loading) return;

    // Actualización optimista — el UI cambia de inmediato
    const prev = following;
    setFollowing(!prev);
    setLoading(true);

    try {
      if (prev) {
        await unfollowUser(userId);
      } else {
        await followUser(userId);
      }
    } catch (err) {
      // Si el backend falla, revertimos al estado anterior
      console.error("[FollowButton] Error al actualizar follow:", err);
      setFollowing(prev);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      className={`${styles.btn} ${following ? styles.following : styles.notFollowing}`}
      onClick={handleToggle}
      disabled={loading}
      aria-label={following ? "Dejar de seguir" : "Seguir usuario"}
    >
      {following ? "SIGUIENDO" : "SEGUIR"}
    </button>
  );
}
