import { useState } from "react";
import { Link } from "react-router-dom";
import EditorialHeader from "../../design-system/composites/EditorialHeader/EditorialHeader";
import Container from "../../design-system/layout/Container/Container";
import { useAuth } from "../../context/AuthContext";

export default function ProducerDashboard() {
  const { user } = useAuth();
  const [events] = useState([
    { id: 1, title: "Tucumán Shoegaze Night", date: "28 de Junio, 2026", ticketsSold: 120, capacity: 150, status: "ACTIVO" },
    { id: 2, title: "Pogo en el Barrio (Punk Rock)", date: "15 de Julio, 2026", ticketsSold: 80, capacity: 200, status: "ACTIVO" },
    { id: 3, title: "Metal Extremo Fest III", date: "02 de Mayo, 2026", ticketsSold: 250, capacity: 250, status: "FINALIZADO" },
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
            }}>PRODUCTOR DIGITAL</span>
            <h1 style={{
              fontSize: "36px",
              fontWeight: 900,
              letterSpacing: "-0.02em",
              margin: "8px 0 0 0",
              textTransform: "uppercase",
            }}>PANEL PRODUCTOR</h1>
          </div>
          <div>
            <Link to="/events/create" style={{
              background: "#a3e635",
              color: "#000",
              textDecoration: "none",
              padding: "12px 24px",
              fontWeight: 900,
              fontSize: "12px",
              letterSpacing: "0.1em",
              borderRadius: "4px",
              display: "inline-block",
              textTransform: "uppercase",
              boxShadow: "0 0 15px rgba(163, 230, 53, 0.4)",
              transition: "transform 0.2s, boxShadow 0.2s",
            }} onMouseOver={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 0 22px rgba(163, 230, 53, 0.6)";
            }} onMouseOut={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 0 15px rgba(163, 230, 53, 0.4)";
            }}>
              + Crear Nuevo Evento
            </Link>
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
            { label: "SHOWS PROGRAMADOS", val: "2", color: "#a3e635" },
            { label: "TICKETS VENDIDOS (MES)", val: "200", color: "#ffffff" },
            { label: "CAPACIDAD PROMEDIO", val: "87%", color: "#06b6d4" },
            { label: "INGRESOS PENDIENTES", val: "$450.000", color: "#a044ff" },
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
          background: "#0c0c0c",
          border: "1px solid #161616",
          borderRadius: "8px",
          padding: "24px",
        }}>
          <h2 style={{ fontSize: "18px", fontWeight: 800, textTransform: "uppercase", marginBottom: "20px", letterSpacing: "0.05em" }}>Tus Shows y Eventos</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {events.map((evt) => {
              const fillPercentage = Math.round((evt.ticketsSold / evt.capacity) * 100);
              const isActive = evt.status === "ACTIVO";
              return (
                <div key={evt.id} style={{
                  padding: "20px",
                  background: "#111",
                  border: `1px solid ${isActive ? "#2a2a2a" : "#1a1a1a"}`,
                  borderRadius: "6px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: "16px",
                }}>
                  <div style={{ flex: 1, minWidth: "200px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <strong style={{ fontSize: "16px", color: "#fff" }}>{evt.title}</strong>
                      <span style={{
                        fontSize: "9px",
                        fontWeight: 900,
                        padding: "2px 8px",
                        borderRadius: "2px",
                        background: isActive ? "#a3e635" : "#333",
                        color: isActive ? "#000" : "#888",
                        letterSpacing: "0.05em"
                      }}>{evt.status}</span>
                    </div>
                    <span style={{ fontSize: "13px", color: "#666", display: "block", marginTop: "4px" }}>📅 {evt.date}</span>
                  </div>
                  
                  {/* Progress Bar container */}
                  <div style={{ display: "flex", alignItems: "center", gap: "16px", minWidth: "220px" }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "#888", marginBottom: "6px" }}>
                        <span>Entradas vendidas: {evt.ticketsSold}/{evt.capacity}</span>
                        <span>{fillPercentage}%</span>
                      </div>
                      <div style={{ width: "100%", height: "6px", background: "#222", borderRadius: "3px", overflow: "hidden" }}>
                        <div style={{ width: `${fillPercentage}%`, height: "100%", background: isActive ? "#a3e635" : "#888", borderRadius: "3px" }} />
                      </div>
                    </div>
                    
                    <button style={{
                      background: "transparent",
                      color: "#fff",
                      border: "1px solid #333",
                      padding: "8px 16px",
                      fontSize: "11px",
                      fontWeight: 800,
                      letterSpacing: "0.05em",
                      textTransform: "uppercase",
                      cursor: "pointer",
                      borderRadius: "4px",
                      transition: "border-color 0.2s",
                    }} onMouseOver={(e) => e.currentTarget.style.borderColor = "#666"}
                       onMouseOut={(e) => e.currentTarget.style.borderColor = "#333"}>
                      Gestionar
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Container>
    </div>
  );
}
