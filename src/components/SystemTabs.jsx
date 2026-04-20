import { useState } from "react";

const TABS = [
  { id: "electrolysis", label: "⚡ Electrólisis", step: 1 },
  { id: "storage", label: "🔵 Almacenamiento H₂", step: 2 },
  { id: "fuelcell", label: "⚙️ Pila de combustible", step: 3 },
  { id: "consumption", label: "🏠 Consumo energético", step: 4 },
];

export default function SystemTabs({ activeTab, onTabChange }) {
  return (
    <div
      style={{
        gridColumn: "1 / -1",
        background: "var(--bg2)",
        borderBottom: "1px solid var(--border)",
        display: "flex",
        alignItems: "stretch",
        padding: "0 20px",
        gap: 4,
        zIndex: 15,
        overflowX: "auto",
      }}
    >
      {TABS.map((tab, i) => {
        const active = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            style={{
              background: active ? "var(--surface)" : "transparent",
              border: "none",
              borderBottom: active
                ? "2px solid #3b82f6"
                : "2px solid transparent",
              borderTop: active
                ? "2px solid transparent"
                : "2px solid transparent",
              padding: "10px 18px",
              cursor: "pointer",
              color: active ? "#e8eaf2" : "#6b7280",
              fontSize: 12,
              fontWeight: active ? 700 : 400,
              fontFamily: "var(--font-main)",
              whiteSpace: "nowrap",
              display: "flex",
              alignItems: "center",
              gap: 7,
              transition: "all .2s",
            }}
          >
            {/* Número de etapa */}
            <span
              style={{
                width: 20,
                height: 20,
                borderRadius: "50%",
                background: active ? "#3b82f6" : "var(--surface2)",
                color: active ? "#fff" : "#6b7280",
                fontSize: 10,
                fontWeight: 700,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              {tab.step}
            </span>
            {tab.label}
          </button>
        );
      })}

      {/* Flecha indicadora del flujo */}
      <div
        style={{
          marginLeft: "auto",
          display: "flex",
          alignItems: "center",
          gap: 4,
          fontSize: 10,
          color: "#374151",
          fontFamily: "var(--font-mono)",
        }}
      >
        <span style={{ color: "#3b82f6" }}>Electrólisis</span>
        <span>→</span>
        <span style={{ color: "#22d3ee" }}>H₂</span>
        <span>→</span>
        <span style={{ color: "#fbbf24" }}>Pila</span>
        <span>→</span>
        <span style={{ color: "#4ade80" }}>AC</span>
        <span>→</span>
        <span style={{ color: "#818cf8" }}>Hogar</span>
      </div>
    </div>
  );
}
