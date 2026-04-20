import { useRef } from "react";
import { calcularPilaCombustible } from "../physics/hydrogen";

export default function FuelCellPanel({ massH2Grams }) {
  const massKg = massH2Grams / 1000;
  const data = calcularPilaCombustible(massKg);

  const stages = [
    {
      label: "Entrada H₂",
      value: `${(massKg * 1000).toFixed(4)} g`,
      color: "#3b82f6",
      icon: "🔵",
    },
    {
      label: "Energía química",
      value: `${data.energyChemMJ.toFixed(4)} MJ`,
      color: "#fbbf24",
      icon: "⚗️",
    },
    {
      label: "Eficiencia PEM",
      value: `${data.efficiency}%`,
      color: "#22d3ee",
      icon: "⚙️",
    },
    {
      label: "Energía eléctrica",
      value: `${data.energyElecKWh.toFixed(5)} kWh`,
      color: "#4ade80",
      icon: "⚡",
    },
    {
      label: "Voltaje stack",
      value: `${data.stackVoltage.toFixed(1)} V DC`,
      color: "#818cf8",
      icon: "🔋",
    },
    {
      label: "Corriente stack",
      value: `${data.stackCurrent.toFixed(2)} A`,
      color: "#f472b6",
      icon: "〰️",
    },
  ];

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 16,
        padding: 20,
        height: "100%",
        overflowY: "auto",
      }}
    >
      {/* ── Diagrama de flujo de la pila ── */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <SectionTitle>Diagrama de la pila PEM</SectionTitle>

        <div
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: 12,
            padding: 20,
          }}
        >
          {/* Representación visual de la pila */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 0,
              alignItems: "center",
            }}
          >
            {/* Entrada H2 */}
            <FlowBox
              color="#3b82f6"
              label="H₂ almacenado"
              sub={`${(massKg * 1000).toFixed(4)} g`}
            />
            <FlowArrow />

            {/* Membrana PEM */}
            <div
              style={{
                width: "100%",
                padding: "14px 16px",
                background:
                  "linear-gradient(135deg, rgba(59,130,246,.1), rgba(239,68,68,.1))",
                border: "1px solid rgba(129,140,248,.3)",
                borderRadius: 10,
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: 12, fontWeight: 700, color: "#818cf8" }}>
                ⚙️ Membrana PEM
              </div>
              <div style={{ fontSize: 10, color: "#6b7280", marginTop: 4 }}>
                2H₂ → 4H⁺ + 4e⁻ &nbsp;|&nbsp; O₂ + 4H⁺ + 4e⁻ → 2H₂O
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-around",
                  marginTop: 10,
                }}
              >
                <div style={{ fontSize: 10, color: "#3b82f6" }}>
                  ← Cátodo (H₂)
                </div>
                <div style={{ fontSize: 10, color: "#ef4444" }}>
                  Ánodo (O₂) →
                </div>
              </div>
            </div>
            <FlowArrow />

            {/* Salida eléctrica */}
            <FlowBox
              color="#4ade80"
              label="Electricidad DC"
              sub={`${data.energyElecKWh.toFixed(5)} kWh`}
            />
            <FlowArrow />

            {/* Inversor */}
            <div
              style={{
                width: "100%",
                padding: "12px 16px",
                background: "rgba(251,191,36,.08)",
                border: "1px solid rgba(251,191,36,.25)",
                borderRadius: 10,
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: 12, fontWeight: 700, color: "#fbbf24" }}>
                🔄 Inversor DC → AC
              </div>
              <div style={{ fontSize: 10, color: "#6b7280", marginTop: 3 }}>
                Eficiencia: 92% · {data.stackVoltage.toFixed(0)}V DC → 120/220V
                AC
              </div>
            </div>
            <FlowArrow />

            {/* Salida AC */}
            <FlowBox
              color="#818cf8"
              label="Red AC disponible"
              sub="Lista para electrodomésticos"
            />

            {/* Subproducto agua */}
            <div
              style={{
                marginTop: 10,
                width: "100%",
                background: "rgba(34,211,238,.06)",
                border: "1px solid rgba(34,211,238,.2)",
                borderRadius: 8,
                padding: "8px 12px",
                textAlign: "center",
              }}
            >
              <span style={{ fontSize: 10, color: "#22d3ee" }}>
                💧 Subproducto: agua pura (H₂O) — 100% limpio, cero emisiones
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Métricas ── */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <SectionTitle>Parámetros de la pila PEM</SectionTitle>

        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}
        >
          {stages.map((s) => (
            <div
              key={s.label}
              style={{
                background: "var(--surface)",
                border: `1px solid ${s.color}25`,
                borderRadius: 8,
                padding: "10px 11px",
              }}
            >
              <div style={{ fontSize: 10, color: "#4b5563", marginBottom: 4 }}>
                {s.icon} {s.label}
              </div>
              <div
                style={{
                  fontSize: 15,
                  fontWeight: 700,
                  color: s.color,
                  fontFamily: "var(--font-mono)",
                }}
              >
                {s.value}
              </div>
            </div>
          ))}
        </div>

        {/* Barra de eficiencia */}
        <div
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: 10,
            padding: 14,
          }}
        >
          <div
            style={{
              fontSize: 11,
              color: "#9ca3af",
              marginBottom: 8,
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <span>Eficiencia pila PEM</span>
            <span style={{ color: "#4ade80", fontWeight: 700 }}>60%</span>
          </div>
          <div
            style={{
              height: 8,
              borderRadius: 4,
              background: "var(--surface2)",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                width: "60%",
                background: "#4ade80",
                borderRadius: 4,
                boxShadow: "0 0 8px #4ade8080",
              }}
            />
          </div>
          <div style={{ fontSize: 9, color: "#374151", marginTop: 6 }}>
            El 40% restante se disipa como calor — recuperable para calefacción
            en sistemas avanzados
          </div>
        </div>

        {/* Comparativa energética */}
        <div
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: 10,
            padding: 14,
          }}
        >
          <div
            style={{
              fontSize: 11,
              fontWeight: 600,
              color: "#9ca3af",
              marginBottom: 10,
            }}
          >
            Comparativa con fuentes convencionales
          </div>
          {[
            { label: "Motor a gasolina", eff: 25, color: "#ef4444" },
            { label: "Motor diésel", eff: 35, color: "#f97316" },
            { label: "Pila combustible PEM", eff: 60, color: "#4ade80" },
            { label: "Pila combustible SOFC", eff: 85, color: "#22d3ee" },
          ].map((c) => (
            <div key={c.label} style={{ marginBottom: 8 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: 10,
                  color: "#6b7280",
                  marginBottom: 3,
                }}
              >
                <span>{c.label}</span>
                <span style={{ color: c.color, fontWeight: 700 }}>
                  {c.eff}%
                </span>
              </div>
              <div
                style={{
                  height: 5,
                  borderRadius: 3,
                  background: "var(--surface2)",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    width: `${c.eff}%`,
                    background: c.color,
                    borderRadius: 3,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function FlowBox({ color, label, sub }) {
  return (
    <div
      style={{
        width: "100%",
        padding: "10px 14px",
        background: `${color}12`,
        border: `1px solid ${color}40`,
        borderRadius: 8,
        textAlign: "center",
      }}
    >
      <div style={{ fontSize: 12, fontWeight: 700, color }}>{label}</div>
      <div
        style={{
          fontSize: 10,
          color: "#9ca3af",
          marginTop: 2,
          fontFamily: "var(--font-mono)",
        }}
      >
        {sub}
      </div>
    </div>
  );
}

function FlowArrow() {
  return (
    <div
      style={{ fontSize: 16, color: "#374151", lineHeight: 1, margin: "2px 0" }}
    >
      ↓
    </div>
  );
}

function SectionTitle({ children }) {
  return (
    <div
      style={{
        fontSize: 10,
        fontWeight: 600,
        letterSpacing: ".1em",
        textTransform: "uppercase",
        color: "#6b7280",
        display: "flex",
        alignItems: "center",
        gap: 7,
      }}
    >
      {children}
      <span style={{ flex: 1, height: 1, background: "var(--border)" }} />
    </div>
  );
}
