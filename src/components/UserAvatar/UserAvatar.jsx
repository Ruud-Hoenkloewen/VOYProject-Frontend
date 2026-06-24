import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function UserAvatar() {
  const { user } = useAuth();
  if (!user) return null;

  const safeName = user.nombre || user.username || 'Usuario';
  const initial = safeName.charAt(0).toUpperCase();
  const avatarColor = user.avatarColor || 'var(--ds-color-accent-primary)';

  const profileUrl = `/profile/${user.username || user._id || user.id || 'me'}`;

  return (
    <Link 
      to={profileUrl} 
      style={{
        width: "28px",
        height: "28px",
        backgroundColor: avatarColor,
        color: "var(--ds-color-bg-canvas)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: "700",
        fontSize: "14px",
        borderRadius: "2px",
        textDecoration: "none",
        border: "1px solid var(--ds-color-border)",
        transition: "border-color 0.2s",
        cursor: "pointer"
      }}
      onMouseOver={(e) => e.currentTarget.style.borderColor = "var(--ds-color-text-secondary)"}
      onMouseOut={(e) => e.currentTarget.style.borderColor = "var(--ds-color-border)"}
      title="Ir a Perfil"
    >
      {initial}
    </Link>
  );
}
