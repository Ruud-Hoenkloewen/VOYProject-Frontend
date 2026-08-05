import { useState } from "react";
import { followUser, unfollowUser } from "../../services/userService";
import { UserPlusIcon, UserCheckIcon } from "../icons";
import styles from "./FollowButton.module.css";

/**
 * FollowButton — botón de seguir/dejar de seguir a un usuario.
 *
 * Props:
 *   userId      {string}  — ID del usuario a seguir/dejar de seguir
 *   isFollowing {boolean} — estado inicial desde el backend
 *   compact     {boolean} — botón flotante sobre la foto de perfil
 */
export default function FollowButton({ userId, isFollowing: initialFollowing, compact = false }) {
  const [following, setFollowing]   = useState(initialFollowing);
  const [loading,   setLoading]     = useState(false);

  async function handleToggle(e) {
    if (e) e.stopPropagation();
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

  if (compact) {
    return (
      <button
        className={`${styles.compactBtn} ${following ? styles.compactFollowing : styles.compactNotFollowing}`}
        onClick={handleToggle}
        disabled={loading}
        title={following ? "Siguiendo (Clic para dejar de seguir)" : "Seguir usuario"}
        aria-label={following ? "Dejar de seguir" : "Seguir usuario"}
        type="button"
      >
        {following ? <UserCheckIcon size={15} color="#00FF9F" /> : <UserPlusIcon size={15} color="#000" />}
      </button>
    );
  }

  return (
    <button
      className={`${styles.btn} ${following ? styles.following : styles.notFollowing}`}
      onClick={handleToggle}
      disabled={loading}
      aria-label={following ? "Dejar de seguir" : "Seguir usuario"}
      type="button"
    >
      {following ? "SIGUIENDO" : "SEGUIR"}
    </button>
  );
}
