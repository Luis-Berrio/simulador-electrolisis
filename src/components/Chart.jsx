import { useEffect, useRef, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function Chart({ results, running }) {
  const [data, setData] = useState([]);
  const [visible, setVisible] = useState(false);
  const tickRef = useRef(0);

  useEffect(() => {
    if (!running) return;
    const interval = setInterval(() => {
      tickRef.current += 1;
      setData((prev) => {
        const next = [
          ...prev,
          {
            t: tickRef.current,
            H2: parseFloat(results.massH2.toFixed(5)),
            O2: parseFloat(results.massO2.toFixed(5)),
            I: parseFloat(results.current.toFixed(3)),
            P: parseFloat(results.power.toFixed(2)),
          },
        ];
        return next.slice(-60); // máximo 60 puntos
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [running, results]);

  if (!visible) {
    return (
      <button
        onClick={() => setVisible(true)}
        style={{
          position: "absolute",
          bottom: 60,
          right: 16,
          zIndex: 20,
          background: "rgba(13,16,23,.9)",
          border: "1px solid rgba(59,130,246,.4)",
          borderRadius: 8,
          padding: "7px 14px",
          color: "#3b82f6",
          fontSize: 12,
          fontWeight: 600,
          cursor: "pointer",
          fontFamily: "var(--font-mono)",
          backdropFilter: "blur(8px)",
        }}
      >
        📈 Ver gráfica en tiempo real
      </button>
    );
  }

  return (
    <div
      style={{
        position: "absolute",
        bottom: 60,
        left: "50%",
        transform: "translateX(-50%)",
        width: 580,
        zIndex: 20,
        background: "rgba(7,9,15,.92)",
        border: "1px solid rgba(255,255,255,.08)",
        borderRadius: 12,
        padding: "14px 16px",
        backdropFilter: "blur(12px)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 10,
        }}
      >
        <span
          style={{
            fontSize: 11,
            fontWeight: 700,
            color: "var(--muted2)",
            fontFamily: "var(--font-mono)",
            letterSpacing: ".06em",
          }}
        >
          PRODUCCIÓN EN TIEMPO REAL
        </span>
        <div style={{ display: "flex", gap: 8 }}>
          <button
            onClick={() => {
              setData([]);
              tickRef.current = 0;
            }}
            style={btnStyle("#ef4444")}
          >
            Limpiar
          </button>
          <button onClick={() => setVisible(false)} style={btnStyle("#6b7280")}>
            ✕
          </button>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={160}>
        <LineChart
          data={data}
          margin={{ top: 4, right: 8, left: -20, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,.05)" />
          <XAxis
            dataKey="t"
            tick={{ fill: "#4b5563", fontSize: 9, fontFamily: "monospace" }}
            label={{
              value: "seg",
              fill: "#4b5563",
              fontSize: 9,
              position: "insideRight",
            }}
          />
          <YAxis
            tick={{ fill: "#4b5563", fontSize: 9, fontFamily: "monospace" }}
            tickFormatter={(v) => v.toFixed(4)}
          />
          <Tooltip
            contentStyle={{
              background: "#0d1017",
              border: "1px solid #1f2937",
              borderRadius: 6,
              fontSize: 11,
              fontFamily: "monospace",
            }}
            labelStyle={{ color: "#6b7280" }}
            formatter={(val, name) => [val.toFixed(5) + " g", name]}
          />
          <Legend
            wrapperStyle={{
              fontSize: 10,
              fontFamily: "monospace",
              paddingTop: 6,
            }}
          />
          <Line
            type="monotone"
            dataKey="H2"
            stroke="#3b82f6"
            dot={false}
            strokeWidth={2}
            name="H₂ (g)"
            isAnimationActive={false}
          />
          <Line
            type="monotone"
            dataKey="O2"
            stroke="#ef4444"
            dot={false}
            strokeWidth={2}
            name="O₂ (g)"
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>

      {/* Mini métricas debajo */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4,1fr)",
          gap: 6,
          marginTop: 10,
        }}
      >
        {[
          {
            label: "H₂ acum.",
            value: results.massH2.toFixed(5),
            unit: "g",
            color: "#3b82f6",
          },
          {
            label: "O₂ acum.",
            value: results.massO2.toFixed(5),
            unit: "g",
            color: "#ef4444",
          },
          {
            label: "Corriente",
            value: results.current.toFixed(3),
            unit: "A",
            color: "#fbbf24",
          },
          {
            label: "Potencia",
            value: results.power.toFixed(2),
            unit: "W",
            color: "#4ade80",
          },
        ].map((m) => (
          <div
            key={m.label}
            style={{
              background: "#0d1017",
              border: "1px solid #1f2937",
              borderRadius: 6,
              padding: "6px 8px",
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontSize: 14,
                fontWeight: 700,
                color: m.color,
                fontFamily: "monospace",
              }}
            >
              {m.value}
              <span style={{ fontSize: 9, marginLeft: 2, color: "#4b5563" }}>
                {m.unit}
              </span>
            </div>
            <div style={{ fontSize: 9, color: "#374151", marginTop: 2 }}>
              {m.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const btnStyle = (color) => ({
  background: "transparent",
  border: `1px solid ${color}40`,
  borderRadius: 5,
  padding: "3px 9px",
  color,
  fontSize: 10,
  cursor: "pointer",
  fontFamily: "monospace",
});
