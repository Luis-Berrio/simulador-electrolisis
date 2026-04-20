import { calcularAlmacenamiento, WATER_SOURCES } from "../physics/hydrogen";

export default function StoragePanel({
  massH2Grams,
  waterSource,
  onWaterSourceChange,
}) {
  const massKg = massH2Grams / 1000;
  const data = calcularAlmacenamiento(massKg);
  const source =
    WATER_SOURCES.find((w) => w.id === waterSource) || WATER_SOURCES[0];

  const fillColor =
    data.fillPercent < 30
      ? "#3b82f6"
      : data.fillPercent < 70
        ? "#fbbf24"
        : "#ef4444";

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 16,
        padding: "20px",
        height: "100%",
        overflowY: "auto",
      }}
    >
      {/* ── Tanque visual ── */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <SectionTitle>Tanque de almacenamiento H₂</SectionTitle>

        {/* Tanque animado */}
        <div
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: 12,
            padding: 20,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 12,
          }}
        >
          {/* Representación del tanque */}
          <div style={{ position: "relative", width: 120, height: 200 }}>
            {/* Cuerpo del tanque */}
            <div
              style={{
                width: 120,
                height: 180,
                border: `2px solid ${fillColor}`,
                borderRadius: "8px 8px 40px 40px",
                overflow: "hidden",
                position: "relative",
                background: "var(--bg)",
                boxShadow: `0 0 20px ${fillColor}30`,
              }}
            >
              {/* Líquido */}
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: `${data.fillPercent}%`,
                  background: `linear-gradient(180deg, ${fillColor}60, ${fillColor}90)`,
                  transition: "height .8s ease",
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "center",
                  paddingTop: 6,
                }}
              >
                {data.fillPercent > 15 && (
                  <span
                    style={{
                      fontSize: 11,
                      color: "#fff",
                      fontFamily: "var(--font-mono)",
                      fontWeight: 700,
                    }}
                  >
                    {data.fillPercent.toFixed(1)}%
                  </span>
                )}
              </div>
              {/* Marcas del tanque */}
              {[25, 50, 75].map((m) => (
                <div
                  key={m}
                  style={{
                    position: "absolute",
                    left: 0,
                    right: 0,
                    bottom: `${m}%`,
                    borderTop: "1px dashed rgba(255,255,255,.1)",
                    display: "flex",
                    alignItems: "center",
                    paddingLeft: 4,
                  }}
                >
                  <span
                    style={{
                      fontSize: 8,
                      color: "#374151",
                      fontFamily: "var(--font-mono)",
                    }}
                  >
                    {m}%
                  </span>
                </div>
              ))}
            </div>
            {/* Válvula superior */}
            <div
              style={{
                width: 20,
                height: 20,
                borderRadius: "50%",
                background: "#374151",
                border: "2px solid #4b5563",
                position: "absolute",
                top: -10,
                left: "50%",
                transform: "translateX(-50%)",
              }}
            />
          </div>

          <div style={{ textAlign: "center" }}>
            <div
              style={{
                fontSize: 22,
                fontWeight: 700,
                color: fillColor,
                fontFamily: "var(--font-mono)",
              }}
            >
              {data.massGrams.toFixed(4)} g
            </div>
            <div style={{ fontSize: 10, color: "#6b7280", marginTop: 2 }}>
              H₂ almacenado
            </div>
          </div>
        </div>

        {/* Fuente de agua */}
        <SectionTitle>Fuente de agua</SectionTitle>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {WATER_SOURCES.map((ws) => (
            <button
              key={ws.id}
              onClick={() => onWaterSourceChange(ws.id)}
              style={{
                background:
                  waterSource === ws.id
                    ? "rgba(59,130,246,.1)"
                    : "var(--surface)",
                border: `1px solid ${waterSource === ws.id ? "#3b82f6" : "var(--border)"}`,
                borderRadius: 8,
                padding: "10px 12px",
                cursor: "pointer",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                transition: "all .2s",
              }}
            >
              <div style={{ textAlign: "left" }}>
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: waterSource === ws.id ? "#3b82f6" : "#e8eaf2",
                    fontFamily: "var(--font-main)",
                  }}
                >
                  {ws.label}
                </div>
                <div
                  style={{
                    fontSize: 10,
                    color: "#6b7280",
                    marginTop: 2,
                    fontFamily: "var(--font-mono)",
                  }}
                >
                  pH {ws.ph} · Pureza {ws.purity}% · Conductividad ×
                  {ws.conductivity}
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: ws.costPerL_COP === 0 ? "#4ade80" : "#fbbf24",
                    fontFamily: "var(--font-mono)",
                  }}
                >
                  {ws.costPerL_COP === 0
                    ? "GRATIS"
                    : `$${ws.costPerL_COP} COP/L`}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* ── Métricas ── */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <SectionTitle>Parámetros del almacenamiento</SectionTitle>

        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}
        >
          <MetricBox
            label="Volumen a presión atm."
            value={data.volumenAtmL.toFixed(4)}
            unit="L"
            color="#3b82f6"
          />
          <MetricBox
            label="Volumen en tanque (350 bar)"
            value={data.volumenTankL.toFixed(5)}
            unit="L"
            color="#22d3ee"
          />
          <MetricBox
            label="Energía química H₂"
            value={data.energyMJ.toFixed(4)}
            unit="MJ"
            color="#fbbf24"
          />
          <MetricBox
            label="Equivalente eléctrico"
            value={data.energyKWh.toFixed(5)}
            unit="kWh"
            color="#4ade80"
          />
        </div>

        {/* Barra de llenado */}
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
              display: "flex",
              justifyContent: "space-between",
              fontSize: 11,
              color: "#9ca3af",
              marginBottom: 8,
            }}
          >
            <span>Nivel del tanque (cap. 2L)</span>
            <span
              style={{
                color: fillColor,
                fontWeight: 700,
                fontFamily: "var(--font-mono)",
              }}
            >
              {data.fillPercent.toFixed(2)}%
            </span>
          </div>
          <div
            style={{
              height: 10,
              borderRadius: 5,
              background: "var(--surface2)",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                borderRadius: 5,
                width: `${Math.max(0.5, data.fillPercent)}%`,
                background: fillColor,
                boxShadow: `0 0 8px ${fillColor}80`,
                transition: "width .8s ease",
              }}
            />
          </div>
        </div>

        {/* Info fuente activa */}
        <div
          style={{
            background: "rgba(34,211,238,.06)",
            border: "1px solid rgba(34,211,238,.2)",
            borderRadius: 10,
            padding: 14,
          }}
        >
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: "#22d3ee",
              marginBottom: 8,
            }}
          >
            💧 Fuente activa: {source.label}
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 6,
              fontSize: 11,
              fontFamily: "var(--font-mono)",
              color: "#9ca3af",
            }}
          >
            <div>
              pH: <span style={{ color: "#e8eaf2" }}>{source.ph}</span>
            </div>
            <div>
              Pureza: <span style={{ color: "#e8eaf2" }}>{source.purity}%</span>
            </div>
            <div>
              Conductividad:{" "}
              <span style={{ color: "#e8eaf2" }}>×{source.conductivity}</span>
            </div>
            <div>
              Costo:{" "}
              <span
                style={{
                  color: source.costPerL_COP === 0 ? "#4ade80" : "#fbbf24",
                }}
              >
                {source.costPerL_COP === 0
                  ? "Gratuita"
                  : `$${source.costPerL_COP} COP/L`}
              </span>
            </div>
          </div>
        </div>

        {/* Nota técnica */}
        <div
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: 8,
            padding: 12,
            fontSize: 10,
            color: "#4b5563",
            lineHeight: 1.7,
          }}
        >
          <span style={{ color: "#6b7280", fontWeight: 600 }}>
            Nota técnica:{" "}
          </span>
          El H₂ se almacena comprimido a 350 bar en tanques de acero de alta
          resistencia. A presión atmosférica, 1 g de H₂ ocupa aproximadamente
          11.1 litros. El poder calorífico inferior del H₂ es 119.96 MJ/kg — el
          más alto de cualquier combustible.
        </div>
      </div>
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

function MetricBox({ label, value, unit, color }) {
  return (
    <div
      style={{
        background: "var(--surface)",
        border: `1px solid ${color}30`,
        borderRadius: 8,
        padding: "10px 11px",
      }}
    >
      <div
        style={{
          fontSize: 16,
          fontWeight: 700,
          color,
          fontFamily: "var(--font-mono)",
          lineHeight: 1,
        }}
      >
        {value}
        <span style={{ fontSize: 10, marginLeft: 2, color: "#6b7280" }}>
          {unit}
        </span>
      </div>
      <div style={{ fontSize: 10, color: "#4b5563", marginTop: 4 }}>
        {label}
      </div>
    </div>
  );
}
