import { calcular } from "../physics/faraday";
import EnergySelector from "./EnergySelector";
export default function ControlPanel({ params, setParams, results }) {
  const update = (key, val) => setParams((p) => ({ ...p, [key]: val }));

  const electrolytes = [
    { label: "NaOH 1M — pH 14", value: "1.0,14" },
    { label: "KOH 1M — pH 14", value: "0.9,14" },
    { label: "H₂SO₄ 0.5M — pH 1", value: "0.85,1" },
    { label: "NaCl 0.1M — pH 7", value: "0.6,7" },
    { label: "Agua destilada — pH 7", value: "0.15,7" },
  ];

  const electrodes = [
    "Platino (Pt)",
    "Grafito (C)",
    "Níquel (Ni)",
    "Acero (Fe)",
  ];

  return (
    <aside
      style={{
        background: "var(--bg2)",
        borderLeft: "1px solid var(--border)",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        overflowY: "auto",
        fontFamily: "var(--font-main)",
      }}
    >
      {/* ── Métricas ── */}
      <Section title="Magnitudes en tiempo real">
        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 7 }}
        >
          <MCard label="Voltaje" value={params.voltage.toFixed(1)} unit="V" />
          <MCard
            label="Corriente"
            value={results.current.toFixed(3)}
            unit="A"
          />
          <MCard
            label="H₂ producido"
            value={results.massH2.toFixed(5)}
            unit="g"
            color="#3b82f6"
            bg="rgba(59,130,246,.07)"
            border="rgba(59,130,246,.2)"
          />
          <MCard
            label="O₂ producido"
            value={results.massO2.toFixed(5)}
            unit="g"
            color="#ef4444"
            bg="rgba(239,68,68,.07)"
            border="rgba(239,68,68,.2)"
          />
          <MCard
            label="Potencia"
            value={results.power.toFixed(2)}
            unit="W"
            color="#4ade80"
            bg="rgba(74,222,128,.06)"
            border="rgba(74,222,128,.18)"
          />
          <MCard
            label="Carga acum."
            value={results.charge.toFixed(2)}
            unit="C"
            color="#fbbf24"
            bg="rgba(251,191,36,.06)"
            border="rgba(251,191,36,.18)"
          />
          <MCard
            label="Energía"
            value={(results.energy / 1000).toFixed(3)}
            unit="kJ"
            color="#818cf8"
            bg="rgba(129,140,248,.06)"
            border="rgba(129,140,248,.18)"
          />
          <MCard
            label="pH solución"
            value={params.ph.toFixed(1)}
            unit=""
            color="#22d3ee"
            bg="rgba(34,211,238,.06)"
            border="rgba(34,211,238,.18)"
          />
        </div>
      </Section>

      <EnergySelector
        selectedSource={params.energySource}
        onChange={(id) => update("energySource", id)}
        massH2Grams={results.massH2}
        energyKWh={results.energy / 3600000}
      />

      {/* ── Sliders ── */}
      <Section title="Control de variables">
        <Slider
          label="Voltaje"
          value={params.voltage}
          unit="V"
          min={1}
          max={30}
          step={0.5}
          cls=""
          onChange={(v) => update("voltage", v)}
        />
        <Slider
          label="Resistencia"
          value={params.resistance}
          unit="Ω"
          min={0.5}
          max={50}
          step={0.5}
          cls="red"
          onChange={(v) => update("resistance", v)}
        />
        <Slider
          label="Tiempo"
          value={params.time}
          unit="s"
          min={1}
          max={7200}
          step={1}
          cls="green"
          onChange={(v) => update("time", v)}
        />
      </Section>

      {/* ── Electrolito ── */}
      <Section title="Electrolito">
        <select
          style={sel}
          onChange={(e) => {
            const [c, p] = e.target.value.split(",").map(Number);
            setParams((prev) => ({ ...prev, electrolyte: c, ph: p }));
          }}
        >
          {electrolytes.map((e) => (
            <option key={e.value} value={e.value}>
              {e.label}
            </option>
          ))}
        </select>
      </Section>

      {/* ── Electrodos ── */}
      <Section title="Material de electrodos">
        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}
        >
          {electrodes.map((e) => (
            <button
              key={e}
              onClick={() => update("electrode", e)}
              style={{
                padding: "7px 0",
                borderRadius: 7,
                cursor: "pointer",
                fontSize: 11,
                fontWeight: 600,
                fontFamily: "var(--font-main)",
                border:
                  params.electrode === e
                    ? "1px solid #3b82f6"
                    : "1px solid var(--border2)",
                background:
                  params.electrode === e
                    ? "rgba(59,130,246,.1)"
                    : "var(--surface)",
                color: params.electrode === e ? "#3b82f6" : "var(--muted2)",
                transition: "all .2s",
              }}
            >
              {e}
            </button>
          ))}
        </div>
        {/* Eficiencia del electrodo seleccionado */}
        <div
          style={{
            marginTop: 8,
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: 7,
            padding: "8px 11px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span style={{ fontSize: 11, color: "var(--muted2)" }}>
            Eficiencia del electrodo
          </span>
          <span
            style={{
              fontSize: 14,
              fontWeight: 700,
              fontFamily: "var(--font-mono)",
              color:
                results.electrodeEff >= 90
                  ? "#4ade80"
                  : results.electrodeEff >= 75
                    ? "#fbbf24"
                    : "#ef4444",
            }}
          >
            {results.electrodeEff}%
          </span>
        </div>

        {/* Barra visual de eficiencia */}
        <div
          style={{
            height: 4,
            borderRadius: 2,
            background: "var(--surface2)",
            overflow: "hidden",
            marginTop: 6,
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${results.electrodeEff}%`,
              borderRadius: 2,
              background:
                results.electrodeEff >= 90
                  ? "#4ade80"
                  : results.electrodeEff >= 75
                    ? "#fbbf24"
                    : "#ef4444",
              transition: "width .4s ease, background .3s ease",
              boxShadow: `0 0 6px ${results.electrodeEff >= 90 ? "#4ade80" : results.electrodeEff >= 75 ? "#fbbf24" : "#ef4444"}60`,
            }}
          />
        </div>
      </Section>

      {/* ── Fórmulas ── */}
      <Section title="Leyes físicas aplicadas" last>
        <div
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: 8,
            padding: "12px 13px",
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            color: "var(--muted)",
            lineHeight: 2,
          }}
        >
          <div style={fLabel}>Ley de Ohm</div>
          <div style={fVal}>
            I = V / R →&nbsp;
            <span style={{ color: "var(--cyan)" }}>
              {params.voltage} / {params.resistance} ={" "}
              {results.current.toFixed(3)} A
            </span>
          </div>

          <div style={fLabel}>1ª Ley de Faraday</div>
          <div style={fVal}>m = (M × I × t) / (n × F)</div>
          <div style={{ color: "var(--cyan)", fontSize: 11 }}>
            m(H₂) = {results.massH2.toFixed(6)} g
          </div>
          <div style={{ color: "var(--red)", fontSize: 11 }}>
            m(O₂) = {results.massO2.toFixed(6)} g
          </div>

          <div style={fLabel}>Potencia disipada</div>
          <div style={fVal}>
            P = V × I →&nbsp;
            <span style={{ color: "var(--cyan)" }}>
              {results.power.toFixed(2)} W
            </span>
          </div>

          <div style={fLabel}>Energía total</div>
          <div style={fVal}>
            E = P × t →&nbsp;
            <span style={{ color: "var(--cyan)" }}>
              {(results.energy / 1000).toFixed(4)} kJ
            </span>
          </div>

          <div style={fLabel}>Constante de Faraday</div>
          <div style={fVal}>
            F = <span style={{ color: "var(--amber)" }}>96,485 C/mol</span>
          </div>
        </div>
      </Section>
    </aside>
  );
}

/* ─ sub-componentes ─ */
function Section({ title, children, last }) {
  return (
    <div
      style={{
        padding: "14px 16px",
        borderBottom: last ? "none" : "1px solid var(--border)",
        flex: last ? 1 : "none",
      }}
    >
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
        {title}
        <span style={{ flex: 1, height: 1, background: "var(--border)" }} />
      </div>
      {children}
    </div>
  );
}

function MCard({
  label,
  value,
  unit,
  color = "var(--text)",
  bg = "var(--surface)",
  border = "var(--border)",
}) {
  return (
    <div
      style={{
        background: bg,
        border: `1px solid ${border}`,
        borderRadius: 8,
        padding: "10px 11px",
      }}
    >
      <div
        style={{
          fontSize: 17,
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
            fontWeight: 400,
            color: "var(--muted)",
            marginLeft: 2,
          }}
        >
          {unit}
        </span>
      </div>
      <div style={{ fontSize: 10, color: "var(--muted)", marginTop: 4 }}>
        {label}
      </div>
    </div>
  );
}

function Slider({ label, value, unit, min, max, step, onChange, cls }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: 12,
          color: "var(--muted2)",
          marginBottom: 5,
        }}
      >
        <span>{label}</span>
        <strong
          style={{ color: "var(--text)", fontFamily: "var(--font-mono)" }}
        >
          {value} {unit}
        </strong>
      </div>
      <input
        type="range"
        className={cls}
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
      />
      <div
        style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 6 }}
      >
        <input
          type="number"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value) || min)}
          style={{
            width: 75,
            fontSize: 12,
            padding: "4px 8px",
            background: "var(--surface)",
            border: "1px solid var(--border2)",
            borderRadius: 6,
            color: "var(--text)",
            fontFamily: "var(--font-mono)",
            outline: "none",
          }}
        />
        <span style={{ fontSize: 11, color: "var(--muted)" }}>{unit}</span>
      </div>
    </div>
  );
}

const sel = {
  width: "100%",
  fontSize: 12,
  padding: "7px 10px",
  borderRadius: 7,
  background: "var(--surface2)",
  border: "1px solid var(--border2)",
  color: "var(--text)",
  outline: "none",
  cursor: "pointer",
  fontFamily: "var(--font-main)",
};
const fLabel = {
  fontSize: 10,
  color: "var(--border2)",
  textTransform: "uppercase",
  letterSpacing: ".07em",
};
const fVal = { color: "var(--muted2)", fontWeight: 600 };
