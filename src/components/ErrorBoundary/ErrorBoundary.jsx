import React from 'react';

/**
 * ErrorBoundary — captura excepciones de renderizado de React.
 *
 * Props:
 *   - inline (bool): si true, muestra un bloque compacto en lugar de pantalla completa.
 *     Útil para envolver secciones individuales sin derribar toda la app.
 *   - label (string): nombre legible de la sección (p. ej. "Perfil", "Eventos", "Checkout").
 *     Aparece en el log de error para facilitar el diagnóstico.
 */
export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    const label = this.props.label || 'Desconocida';
    console.error(
      `[ErrorBoundary:${label}] Excepción capturada en renderizado:`,
      error,
      errorInfo
    );
  }

  handleReload = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/';
  };

  handleRetry = () => {
    // Intenta re-montar la sección sin redirigir
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    const { inline, label } = this.props;

    // ── Modo INLINE: bloque compacto dentro de la sección que falló ──────────
    if (inline) {
      return (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2.5rem 1rem',
          background: '#0f1117',
          border: '1px solid #2a2d3a',
          borderRadius: '10px',
          margin: '1rem 0',
          textAlign: 'center',
          gap: '0.5rem',
        }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24"
            fill="none" stroke="#f59e0b" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
            <line x1="12" y1="9" x2="12" y2="13"/>
            <line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
          <p style={{ color: '#f59e0b', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', margin: 0 }}>
            Error en {label || 'esta sección'}
          </p>
          {this.state.error && (
            <code style={{ color: '#6b7280', fontSize: '0.68rem', fontFamily: 'monospace', wordBreak: 'break-all', maxWidth: '400px' }}>
              {this.state.error.name}: {this.state.error.message}
            </code>
          )}
          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button onClick={this.handleRetry} style={{
              padding: '0.45rem 1.1rem', backgroundColor: 'transparent',
              color: '#00FF9F', border: '1px solid #00FF9F', borderRadius: '5px',
              fontWeight: 700, fontSize: '0.72rem', cursor: 'pointer', letterSpacing: '0.06em',
            }}>
              REINTENTAR
            </button>
            <button onClick={this.handleReload} style={{
              padding: '0.45rem 1.1rem', backgroundColor: '#00FF9F',
              color: '#08090d', border: 'none', borderRadius: '5px',
              fontWeight: 700, fontSize: '0.72rem', cursor: 'pointer', letterSpacing: '0.06em',
            }}>
              INICIO →
            </button>
          </div>
        </div>
      );
    }

    // ── Modo FULLSCREEN: pantalla de error completa (para la raíz) ───────────
    return (
      <div style={{
        position: 'fixed',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#08090d',
        color: '#ffffff',
        fontFamily: 'sans-serif',
        padding: '2rem',
        textAlign: 'center',
        zIndex: 9999,
      }}>
        <svg xmlns="http://www.w3.org/2000/svg" width="52" height="52" viewBox="0 0 24 24"
          fill="none" stroke="#f59e0b" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
          style={{ marginBottom: '1.25rem' }}>
          <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
          <line x1="12" y1="9" x2="12" y2="13"/>
          <line x1="12" y1="17" x2="12.01" y2="17"/>
        </svg>

        <h2 style={{ fontSize: '1.4rem', fontWeight: 900, marginBottom: '0.4rem', color: '#ffffff', letterSpacing: '0.05em' }}>
          Navegación Interrumpida
        </h2>
        <p style={{ color: '#f59e0b', fontSize: '0.82rem', fontWeight: 700, marginBottom: '0.75rem', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          Un error ha ocurrido{label ? ` · ${label}` : ''}
        </p>
        <p style={{ color: '#a0a5b5', maxWidth: '440px', marginBottom: '1.5rem', fontSize: '0.88rem', lineHeight: '1.6' }}>
          La plataforma ha prevenido un bloqueo de interfaz. Podés retornar al inicio con un solo clic para continuar navegando.
        </p>

        {this.state.error && (
          <div style={{
            backgroundColor: '#0f1117',
            border: '1px solid #2a2d3a',
            borderRadius: '8px',
            padding: '1rem 1.25rem',
            maxWidth: '560px',
            width: '100%',
            textAlign: 'left',
            marginBottom: '1.75rem',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.6rem' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#ef4444', display: 'inline-block' }}/>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#f59e0b', display: 'inline-block' }}/>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#22c55e', display: 'inline-block' }}/>
              <span style={{ marginLeft: '0.25rem', color: '#4b5563', fontSize: '0.72rem', fontFamily: 'monospace' }}>voy-error.log</span>
            </div>
            <code style={{ color: '#ef4444', fontSize: '0.75rem', fontFamily: 'monospace', display: 'block', marginBottom: '0.5rem', wordBreak: 'break-all' }}>
              {this.state.error.name}: {this.state.error.message}
            </code>
            {this.state.error.stack && (
              <pre style={{
                color: '#6b7280', fontSize: '0.68rem', fontFamily: 'monospace',
                margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-all',
                maxHeight: '120px', overflowY: 'auto', lineHeight: '1.5',
              }}>
                {this.state.error.stack.split('\n').slice(1, 6).join('\n')}
              </pre>
            )}
          </div>
        )}

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button onClick={this.handleRetry} style={{
            padding: '0.75rem 1.5rem', backgroundColor: 'transparent',
            color: '#00FF9F', border: '1px solid #00FF9F', borderRadius: '6px',
            fontWeight: 900, fontSize: '0.8rem', cursor: 'pointer',
            textTransform: 'uppercase', letterSpacing: '0.1em',
          }}>
            REINTENTAR
          </button>
          <button onClick={this.handleReload} style={{
            padding: '0.85rem 2rem', backgroundColor: '#00FF9F',
            color: '#08090d', border: 'none', borderRadius: '6px',
            fontWeight: 900, fontSize: '0.8rem', cursor: 'pointer',
            textTransform: 'uppercase', letterSpacing: '0.1em',
            boxShadow: '0 4px 20px rgba(0, 255, 159, 0.2)',
          }}>
            VOLVER AL INICIO →
          </button>
        </div>
      </div>
    );
  }
}

export default ErrorBoundary;
