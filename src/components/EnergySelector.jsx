import {
  ENERGY_SOURCES,
  H2_COLORS,
  calcularImpactoAmbiental,
} from "../physics/energySources";

export default function EnergySelector({
  selectedSource,
  onChange,
  massH2Grams,
  energyKWh,
}) {
  const selected =
    ENERGY_SOURCES.find((s) => s.id === selectedSource) || ENERGY_SOURCES[0];
  const impact = calcularImpactoAmbiental(
    selectedSource,
    massH2Grams,
    energyKWh,
  );
  const h2Info = H2_COLORS[selected.h2Color];

  return (
    <div
      style={{
        padding: "14px 16px",
        borderBottom: "1px solid var(--border)",
      }}
    >
      {/* Título */}
      <div
        style={{
          fontSize: 10,
          fontWeight: 600,
          letterSpacing: ".1em",
          textTransform: "uppercase",
          color: "var(--muted)",
          marginBottom: 11,
          display: "flex",
          alignItems: "center",
          gap: 7,
        }}
      >
        Fuente de energía
        <span style={{ flex: 1, height: 1, background: "var(--border)" }} />
      </div>

      {/* Botones de fuentes */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 6,
          marginBottom: 12,
        }}
      >
        {ENERGY_SOURCES.map((s) => {
          const active = selectedSource === s.id;
          return (
            <button
              key={s.id}
              onClick={() => onChange(s.id)}
              style={{
                background: active ? `${s.color}18` : "var(--surface)",
                border: `1px solid ${active ? s.color : "var(--border)"}`,
                borderRadius: 8,
                padding: "10px 10px",
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                gap: 4,
                alignItems: "flex-start",
                transition: "all .2s",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  width: "100%",
                }}
              >
                <span style={{ fontSize: 16 }}>{s.icon}</span>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    color: active ? s.color : "var(--text)",
                    flex: 1,
                    textAlign: "left",
                  }}
                >
                  {s.name}
                </span>
                {s.renewable && (
                  <span
                    style={{
                      fontSize: 9,
                      padding: "1px 6px",
                      background: "rgba(74,222,128,.15)",
                      border: "1px solid rgba(74,222,128,.3)",
                      borderRadius: 10,
                      color: "#4ade80",
                      fontWeight: 600,
                    }}
                  >
                    ♻ RENOVABLE
                  </span>
                )}
              </div>
              <div
                style={{
                  fontSize: 10,
                  color: "var(--muted)",
                  fontFamily: "var(--font-mono)",
                }}
              >
                ${s.costPerKWh_COP.toLocaleString("es-CO")}/kWh · {s.co2PerKgH2}{" "}
                kg CO₂/kg H₂
              </div>
            </button>
          );
        })}
      </div>

      {/* Tarjeta de la fuente activa */}
      <div
        style={{
          background: `${selected.color}10`,
          border: `1px solid ${selected.color}40`,
          borderRadius: 10,
          padding: "12px 14px",
          marginBottom: 10,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 8,
            paddingBottom: 8,
            borderBottom: "1px solid rgba(255,255,255,.05)",
          }}
        >
          <span style={{ fontSize: 22 }}>{selected.icon}</span>
          <div style={{ flex: 1 }}>
            <div
              style={{ fontSize: 13, fontWeight: 700, color: selected.color }}
            >
              {selected.name}
            </div>
            <div style={{ fontSize: 10, color: "var(--muted)" }}>
              Disponibilidad: {selected.availability} ·{" "}
              {(selected.availabilityFactor * 100).toFixed(0)}% útil
            </div>
          </div>
          <div
            style={{
              padding: "3px 10px",
              background: `${selected.h2ColorHex}20`,
              border: `1px solid ${selected.h2ColorHex}50`,
              borderRadius: 20,
              display: "flex",
              alignItems: "center",
              gap: 5,
            }}
          >
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: selected.h2ColorHex,
                boxShadow: `0 0 6px ${selected.h2ColorHex}`,
              }}
            />
            <span
              style={{
                fontSize: 10,
                fontWeight: 700,
                color: selected.h2ColorHex,
                letterSpacing: ".05em",
              }}
            >
              H₂ {selected.h2Color.toUpperCase()}
            </span>
          </div>
        </div>

        <div
          style={{
            fontSize: 11,
            color: "var(--muted2)",
            marginBottom: 10,
            lineHeight: 1.5,
          }}
        >
          {selected.description}
        </div>
        <div
          style={{
            fontSize: 10,
            color: "var(--muted)",
            fontStyle: "italic",
            lineHeight: 1.5,
          }}
        >
          {h2Info.desc}
        </div>
      </div>

      {/* Impacto ambiental — métricas */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
        <MetricBox
          label="Emisiones CO₂"
          value={impact.emisionesCO2.toFixed(3)}
          unit="kg"
          color={impact.emisionesCO2 === 0 ? "#4ade80" : "#ef4444"}
          icon="💨"
        />
        <MetricBox
          label="CO₂ evitado vs. fósil"
          value={impact.emisionesEvitadas.toFixed(3)}
          unit="kg"
          color="#4ade80"
          icon="🌿"
        />
        <MetricBox
          label="Árboles equivalentes"
          value={impact.arbolesEquivalentes.toFixed(2)}
          unit="árb/año"
          color="#4ade80"
          icon="🌳"
        />
        <MetricBox
          label="Km auto gasolina"
          value={impact.kmAutoEquivalentes.toFixed(1)}
          unit="km evitado"
          color="#22d3ee"
          icon="🚗"
        />
      </div>

      {/* Pros y contras */}
      <div
        style={{
          marginTop: 10,
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: 8,
          padding: "10px 12px",
        }}
      >
        <div
          style={{
            fontSize: 10,
            color: "var(--muted)",
            fontWeight: 600,
            letterSpacing: ".08em",
            marginBottom: 8,
          }}
        >
          VENTAJAS Y DESVENTAJAS
        </div>
        {selected.pros.map((p, i) => (
          <div key={i} style={{ display: "flex", gap: 6, marginBottom: 3 }}>
            <span style={{ color: "#4ade80", fontSize: 12 }}>✓</span>
            <span style={{ fontSize: 11, color: "var(--muted2)" }}>{p}</span>
          </div>
        ))}
        {selected.cons.map((c, i) => (
          <div key={i} style={{ display: "flex", gap: 6, marginBottom: 3 }}>
            <span style={{ color: "#ef4444", fontSize: 12 }}>✗</span>
            <span style={{ fontSize: 11, color: "var(--muted2)" }}>{c}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function MetricBox({ label, value, unit, color, icon }) {
  return (
    <div
      style={{
        background: "var(--surface)",
        border: `1px solid ${color}25`,
        borderRadius: 8,
        padding: "8px 10px",
      }}
    >
      <div
        style={{
          fontSize: 10,
          color: "var(--muted)",
          marginBottom: 3,
          display: "flex",
          alignItems: "center",
          gap: 4,
        }}
      >
        <span style={{ fontSize: 12 }}>{icon}</span>
        <span>{label}</span>
      </div>
      <div
        style={{
          fontSize: 14,
          fontWeight: 700,
          color,
          fontFamily: "var(--font-mono)",
          lineHeight: 1,
        }}
      >
        {value}
        <span
          style={{
            fontSize: 10,
            marginLeft: 2,
            color: "var(--muted)",
            fontWeight: 400,
          }}
        >
          {unit}
        </span>
      </div>
    </div>
  );
}
