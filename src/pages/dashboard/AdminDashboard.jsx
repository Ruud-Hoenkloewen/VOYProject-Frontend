import { useState } from "react";
import EditorialHeader from "../../design-system/composites/EditorialHeader/EditorialHeader";
import Container from "../../design-system/layout/Container/Container";
import { useAuth } from "../../context/AuthContext";

export default function AdminDashboard() {
  const { user } = useAuth();
  const [logs] = useState([
    { id: 1, action: "Usuario registrado", details: "carlos_pogo@email.com", time: "Hace 5 minutos" },
    { id: 2, action: "Evento publicado", details: "Festival Tucumán Hardcore", time: "Hace 12 minutos" },
    { id: 3, action: "Pago procesado", details: "Orden #VOY-9821 ($14.500)", time: "Hace 20 minutos" },
    { id: 4, action: "Cambio de rol", details: "producciones_norte -> PRODUCER", time: "Hace 1 hora" },
  ]);

  return (
    <div style={{
      backgroundColor: "#050505",
      color: "#f5f5f5",
      minHeight: "100vh",
      paddingTop: "90px",
      fontFamily: "var(--ds-font-family-sans, sans-serif)",
    }}>
      <EditorialHeader />

      <Container>
        {/* Header Section */}
        <div style={{
          borderBottom: "1px solid #1a1a1a",
          paddingBottom: "24px",
          marginBottom: "32px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
        }}>
          <div>
            <span style={{
              fontSize: "11px",
              fontWeight: 800,
              color: "#a3e635",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
            }}>PANEL DE CONTROL</span>
            <h1 style={{
              fontSize: "36px",
              fontWeight: 900,
              letterSpacing: "-0.02em",
              margin: "8px 0 0 0",
              textTransform: "uppercase",
            }}>ADMINISTRACIÓN VOY</h1>
          </div>
          <div style={{
            fontSize: "12px",
            color: "#666",
            fontFamily: "var(--ds-font-family-mono, monospace)"
          }}>
            SESIÓN: {user?.nombre?.toUpperCase()} [ADMIN]
          </div>
        </div>

        {/* Metrics Grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "20px",
          marginBottom: "40px",
        }}>
          {[
            { label: "USUARIOS TOTALES", val: "1,248", color: "#a3e635" },
            { label: "EVENTOS ACTIVOS", val: "42", color: "#ffffff" },
            { label: "ENTRADAS VENDIDAS", val: "3,892", color: "#f43f5e" },
            { label: "RECAUDACIÓN TOTAL", val: "$4.8M", color: "#06b6d4" },
          ].map((item, idx) => (
            <div key={idx} style={{
              background: "#0c0c0c",
              border: "1px solid #161616",
              borderRadius: "8px",
              padding: "24px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
            }}>
              <span style={{ fontSize: "11px", fontWeight: 700, color: "#666", letterSpacing: "0.1em" }}>{item.label}</span>
              <div style={{ fontSize: "32px", fontWeight: 900, color: item.color, marginTop: "8px" }}>{item.val}</div>
            </div>
          ))}
        </div>

        {/* Core Content */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr",
          gap: "30px",
        }}>
          {/* Main Action Area */}
          <div style={{
            background: "#0c0c0c",
            border: "1px solid #161616",
            borderRadius: "8px",
            padding: "24px",
          }}>
            <h2 style={{ fontSize: "18px", fontWeight: 800, textTransform: "uppercase", marginBottom: "20px", letterSpacing: "0.05em" }}>Actividad Reciente del Sistema</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {logs.map((log) => (
                <div key={log.id} style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "16px",
                  background: "#111",
                  border: "1px solid #1a1a1a",
                  borderRadius: "6px",
                }}>
                  <div>
                    <strong style={{ fontSize: "14px", color: "#fff", display: "block" }}>{log.action}</strong>
                    <span style={{ fontSize: "12px", color: "#888" }}>{log.details}</span>
                  </div>
                  <span style={{
                    fontSize: "11px",
                    color: "#666",
                    fontFamily: "var(--ds-font-family-mono, monospace)"
                  }}>{log.time}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions Panel */}
          <div style={{
            background: "#0c0c0c",
            border: "1px solid #161616",
            borderRadius: "8px",
            padding: "24px",
            display: "flex",
            flexDirection: "column",
            gap: "20px",
          }}>
            <h2 style={{ fontSize: "18px", fontWeight: 800, textTransform: "uppercase", marginBottom: "4px", letterSpacing: "0.05em" }}>Acciones Rápidas</h2>
            <button style={{
              background: "transparent",
              color: "#a3e635",
              border: "1px solid #a3e635",
              borderRadius: "4px",
              padding: "12px",
              fontWeight: 800,
              fontSize: "12px",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              cursor: "pointer",
              transition: "all 0.2s",
            }} onMouseOver={(e) => { e.currentTarget.style.background = "#a3e635"; e.currentTarget.style.color = "#000"; }}
               onMouseOut={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#a3e635"; }}>
              Aprobar Eventos Pendientes
            </button>
            <button style={{
              background: "transparent",
              color: "#fff",
              border: "1px solid #333",
              borderRadius: "4px",
              padding: "12px",
              fontWeight: 800,
              fontSize: "12px",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              cursor: "pointer",
              transition: "all 0.2s",
            }} onMouseOver={(e) => { e.currentTarget.style.borderColor = "#666"; }}
               onMouseOut={(e) => { e.currentTarget.style.borderColor = "#333"; }}>
              Verificar Usuarios
            </button>
            <button style={{
              background: "transparent",
              color: "#f43f5e",
              border: "1px solid #f43f5e",
              borderRadius: "4px",
              padding: "12px",
              fontWeight: 800,
              fontSize: "12px",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              cursor: "pointer",
              transition: "all 0.2s",
            }} onMouseOver={(e) => { e.currentTarget.style.background = "#f43f5e"; e.currentTarget.style.color = "#000"; }}
               onMouseOut={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#f43f5e"; }}>
              Auditar Logs Críticos
            </button>
          </div>
        </div>
      </Container>
    </div>
  );
}
