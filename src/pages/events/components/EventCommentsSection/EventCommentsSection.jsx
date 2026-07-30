import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../../context/AuthContext';
import { addEventComment, deleteEventComment } from '../../../../services/eventService';
import { TrashIcon, UsersIcon } from '../../../../components/icons';
import styles from './EventCommentsSection.module.css';

function formatDate(dateStr) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return '';
  return date.toLocaleDateString('es-AR', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function EventCommentsSection({ eventId, initialComments = [], eventCreatorId }) {
  const { user, isAuthenticated } = useAuth();
  const [comments, setComments] = useState(initialComments);
  const [text, setText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim() || isSubmitting) return;

    try {
      setIsSubmitting(true);
      setErrorMsg('');
      const updatedComments = await addEventComment(eventId, text.trim());
      setComments(updatedComments.map((c) => ({
        id: c._id || c.id,
        texto: c.texto,
        createdAt: c.createdAt,
        usuario: c.usuario ? {
          id: c.usuario._id || c.usuario.id,
          nombre: c.usuario.nombre || 'Usuario',
          username: c.usuario.username || '',
          avatar: c.usuario.avatar || c.usuario.avatarUrl || c.usuario.fotoPerfil || '',
          avatarColor: c.usuario.avatarColor || '#00FF9F',
          role: c.usuario.role || c.usuario.rol || 'client',
        } : null,
      })));
      setText('');
    } catch (err) {
      console.error(err);
      setErrorMsg('No se pudo enviar el comentario. Intentalo de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (commentId) => {
    try {
      await deleteEventComment(eventId, commentId);
      setComments((prev) => prev.filter((c) => c.id !== commentId && c._id !== commentId));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className={styles.commentsSection}>
      <div className={styles.headerRow}>
        <h2 className={styles.title}>
          <UsersIcon className={styles.titleIcon} size={20} />
          COMENTARIOS DE LA MOVIDA
        </h2>
        <span className={styles.countBadge}>{comments.length} COMENTARIOS</span>
      </div>

      {/* Form Box */}
      <div className={styles.formBox}>
        {isAuthenticated ? (
          <form onSubmit={handleSubmit}>
            <textarea
              className={styles.textarea}
              placeholder="¿Vas a ir? ¿Con quién salís? Dejá tu mensaje acá..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={3}
            />
            {errorMsg && <div style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '6px' }}>{errorMsg}</div>}
            <div className={styles.formFooter}>
              <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
                Comentando como <strong>{user?.nombre || user?.username}</strong>
              </span>
              <button
                type="submit"
                className={styles.submitBtn}
                disabled={!text.trim() || isSubmitting}
              >
                {isSubmitting ? 'PUBLICANDO...' : 'PUBLICAR COMENTARIO'}
              </button>
            </div>
          </form>
        ) : (
          <div className={styles.formFooter} style={{ justifyContent: 'center' }}>
            <span className={styles.loginNotice}>
              Para participar de la conversación, <Link to="/login" className={styles.loginLink}>iniciá sesión</Link>.
            </span>
          </div>
        )}
      </div>

      {/* Comments List */}
      {comments.length === 0 ? (
        <div className={styles.emptyComments}>
          Aún no hay comentarios en este evento. ¡Sé el primero en comentar!
        </div>
      ) : (
        <div className={styles.commentsList}>
          {comments.map((comment) => {
            const author = comment.usuario;
            const authorName = author?.nombre || 'Usuario';
            const username = author?.username || author?.id;
            const avatarColor = author?.avatarColor || 'transparent';
            const avatarStyle = avatarColor !== 'transparent'
              ? { background: avatarColor, padding: '2px' }
              : { background: '#1a1d29' };
            const profilePath = username ? `/profile/${username}` : '#';

            const isAuthor = user && (user._id === author?.id || user.id === author?.id);
            const isOwner = user && (user._id === eventCreatorId || user.id === eventCreatorId);

            const role = author?.role || author?.rol;
            const roleBadgeClass = role === 'artist'
              ? styles.roleBadgeArtist
              : role === 'producer'
              ? styles.roleBadgeProducer
              : styles.roleBadgeFan;

            const roleLabel = role === 'artist' ? 'ARTISTA' : role === 'producer' ? 'PRODUCTOR' : 'FAN';

            return (
              <div key={comment.id || comment._id} className={styles.commentCard}>
                <div className={styles.avatarSquare} style={avatarStyle}>
                  {author?.avatar ? (
                    <img src={author.avatar} alt={authorName} className={styles.avatarImg} />
                  ) : (
                    authorName.charAt(0).toUpperCase()
                  )}
                </div>

                <div className={styles.commentBody}>
                  <div className={styles.commentHeader}>
                    <Link to={profilePath} className={styles.authorLink}>
                      <span className={styles.authorName}>{authorName}</span>
                      {author?.username && (
                        <span className={styles.authorUsername}>@{author.username}</span>
                      )}
                      <span className={`${styles.roleBadge} ${roleBadgeClass}`}>
                        {roleLabel}
                      </span>
                    </Link>

                    <div className={styles.commentMeta}>
                      <span className={styles.timeAgo}>{formatDate(comment.createdAt)}</span>
                      {(isAuthor || isOwner) && (
                        <button
                          type="button"
                          className={styles.deleteBtn}
                          onClick={() => handleDelete(comment.id || comment._id)}
                          title="Eliminar comentario"
                        >
                          <TrashIcon size={14} />
                        </button>
                      )}
                    </div>
                  </div>

                  <div className={styles.commentText}>{comment.texto}</div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
