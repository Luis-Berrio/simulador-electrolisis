import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, Stars, Text } from "@react-three/drei";
import Tank from "./Tank";
import Electrodes from "./Electrodes";
import Bubbles from "./Bubbles";
import PowerSupply from "./PowerSupply";
import Cables from "./Cables";
import LabEnvironment from "./LabEnvironment";
import MultimeterScreen from "./MultimeterScreen";
import DynamicLighting from "./DynamicLighting";
import Steam from "./Steam";

export default function Scene3D({ params, results }) {
  return (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      {/* Badge H2 */}
      <div style={badge("#3b82f6", "left")}>
        <div
          style={{
            fontSize: 22,
            fontWeight: 700,
            color: "#3b82f6",
            fontFamily: "var(--font-mono)",
          }}
        >
          {results.massH2.toFixed(5)} g
        </div>
        <div style={{ fontSize: 10, color: "#9ca3af", marginTop: 3 }}>
          H₂ producido — cátodo (−)
        </div>
        <div
          style={{
            fontSize: 9,
            color: "#3b82f6",
            marginTop: 2,
            fontFamily: "var(--font-mono)",
          }}
        >
          2H₂O + 2e⁻ → H₂ + 2OH⁻
        </div>
      </div>

      {/* Badge O2 */}
      <div style={badge("#ef4444", "right")}>
        <div
          style={{
            fontSize: 22,
            fontWeight: 700,
            color: "#ef4444",
            fontFamily: "var(--font-mono)",
            textAlign: "right",
          }}
        >
          {results.massO2.toFixed(5)} g
        </div>
        <div
          style={{
            fontSize: 10,
            color: "#9ca3af",
            marginTop: 3,
            textAlign: "right",
          }}
        >
          O₂ producido — ánodo (+)
        </div>
        <div
          style={{
            fontSize: 9,
            color: "#ef4444",
            marginTop: 2,
            fontFamily: "var(--font-mono)",
            textAlign: "right",
          }}
        >
          2H₂O → O₂ + 4H⁺ + 4e⁻
        </div>
      </div>

      {/* Badge corriente */}
      <div
        style={{
          position: "absolute",
          bottom: 16,
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 10,
          display: "flex",
          gap: 12,
          pointerEvents: "none",
        }}
      >
        {[
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
          {
            label: "Voltaje",
            value: params.voltage.toFixed(1),
            unit: "V",
            color: "#818cf8",
          },
        ].map((b) => (
          <div
            key={b.label}
            style={{
              background: "rgba(13,16,23,.85)",
              border: "1px solid rgba(255,255,255,.08)",
              borderRadius: 8,
              padding: "6px 14px",
              textAlign: "center",
              backdropFilter: "blur(8px)",
              fontFamily: "var(--font-mono)",
            }}
          >
            <div style={{ fontSize: 16, fontWeight: 700, color: b.color }}>
              {b.value}
              <span style={{ fontSize: 10, marginLeft: 2, color: "#6b7280" }}>
                {b.unit}
              </span>
            </div>
            <div style={{ fontSize: 9, color: "#4b5563", marginTop: 2 }}>
              {b.label}
            </div>
          </div>
        ))}
      </div>

      {/* Canvas 3D */}
      <Canvas
        shadows="soft"
        camera={{ position: [6, 3, 11], fov: 50 }}
        gl={{
          antialias: true,
          powerPreference: "high-performance",
          stencil: false,
          depth: true,
        }}
        performance={{ min: 0.5 }}
        style={{
          background:
            "radial-gradient(ellipse at 30% 40%, #0f1e3d 0%, #07090f 70%)",
        }}
      >
        <ambientLight intensity={0.25} />
        <directionalLight
          position={[8, 10, 6]}
          intensity={1.2}
          castShadow
          shadow-mapSize={[1024, 1024]}
        />
        <DynamicLighting voltage={params.voltage} current={results.current} />

        {/* Agrega junto a los otros componentes: */}
        {/* <Steam current={results.current} /> */}
        <MultimeterScreen
          voltage={params.voltage}
          current={results.current}
          resistance={params.resistance}
        />

        <Stars
          radius={80}
          depth={50}
          count={2000}
          factor={3}
          fade
          speed={0.3}
        />

        <PowerSupply voltage={params.voltage} current={results.current} />
        <Tank />
        <Electrodes />
        <Cables />
        <LabEnvironment />
        <Bubbles current={results.current} />

        <OrbitControls
          enablePan={false}
          minDistance={4}
          maxDistance={18}
          maxPolarAngle={Math.PI / 1.7}
          // autoRotate
          // autoRotateSpeed={0.4}
          autoRotate={false}
        />
        <Environment preset="warehouse" />
      </Canvas>
    </div>
  );
}
function badge(color, pos) {
  const rgb = color === "#3b82f6" ? "59,130,246" : "239,68,68";
  const side = pos === "left" ? { left: 16 } : { right: 16 };
  return {
    position: "absolute",
    top: 16,
    zIndex: 10,
    background: `rgba(${rgb}, 0.1)`,
    border: `1px solid rgba(${rgb}, 0.3)`,
    borderRadius: 10,
    padding: "10px 14px",
    backdropFilter: "blur(10px)",
    pointerEvents: "none",
    ...side,
  };
}
