import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

// ══════════════════════════════════════════════
//  PANEL SOLAR EN EL TECHO
// ══════════════════════════════════════════════
function SolarPanel({ position, active }) {
  const glowRef = useRef();
  useFrame(({ clock }) => {
    if (!glowRef.current) return;
    glowRef.current.intensity = active
      ? 1.5 + Math.sin(clock.getElapsedTime() * 1.5) * 0.2
      : 0;
  });
  return (
    <group position={position} rotation={[-0.3, 0, 0]}>
      {/* Marco */}
      <mesh castShadow>
        <boxGeometry args={[3.0, 0.1, 1.8]} />
        <meshStandardMaterial color="#1f2937" metalness={0.8} roughness={0.3} />
      </mesh>
      {/* Células fotovoltaicas */}
      {[-1.2, -0.6, 0, 0.6, 1.2].map((x, i) =>
        [-0.6, 0, 0.6].map((z, j) => (
          <mesh key={`${i}-${j}`} position={[x, 0.06, z]}>
            <boxGeometry args={[0.52, 0.02, 0.52]} />
            <meshStandardMaterial
              color={active ? "#1e3a5f" : "#0f172a"}
              emissive={active ? "#3b82f6" : "#000"}
              emissiveIntensity={active ? 0.3 : 0}
              metalness={0.7}
              roughness={0.2}
            />
          </mesh>
        )),
      )}
      {/* Rejilla entre células */}
      {[-0.9, -0.3, 0.3, 0.9].map((x, i) => (
        <mesh key={i} position={[x, 0.08, 0]}>
          <boxGeometry args={[0.02, 0.01, 1.7]} />
          <meshStandardMaterial color="#9ca3af" metalness={0.9} />
        </mesh>
      ))}
      {/* Soporte */}
      <mesh position={[0, -0.4, -0.6]} rotation={[0.3, 0, 0]}>
        <cylinderGeometry args={[0.04, 0.04, 0.8, 8]} />
        <meshStandardMaterial color="#374151" metalness={0.8} />
      </mesh>
      {/* Luz emitida cuando activo — simula reflejo del sol */}
      {active && (
        <>
          <pointLight
            ref={glowRef}
            position={[0, 0.5, 0]}
            intensity={1.5}
            color="#fbbf24"
            distance={5}
          />
          {/* Rayos de luz decorativos */}
          <SunRays position={[0, 2, 1.5]} />
        </>
      )}
      {/* Etiqueta SOLAR */}
      <mesh position={[0, 0.12, 0.93]}>
        <planeGeometry args={[0.4, 0.08]} />
        <meshStandardMaterial
          color={active ? "#fbbf24" : "#374151"}
          emissive={active ? "#fbbf24" : "#000"}
          emissiveIntensity={active ? 0.5 : 0}
        />
      </mesh>
    </group>
  );
}

function SunRays({ position }) {
  const ref = useRef();
  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.z = clock.getElapsedTime() * 0.3;
    }
  });
  return (
    <group position={position}>
      {/* Sol */}
      <mesh>
        <sphereGeometry args={[0.25, 16, 16]} />
        <meshStandardMaterial
          color="#fef3c7"
          emissive="#fbbf24"
          emissiveIntensity={2.5}
        />
      </mesh>
      <pointLight intensity={1.2} color="#fbbf24" distance={8} />
      {/* Rayos */}
      <group ref={ref}>
        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
          const angle = (i * Math.PI) / 4;
          return (
            <mesh
              key={i}
              position={[Math.cos(angle) * 0.5, Math.sin(angle) * 0.5, 0]}
              rotation={[0, 0, angle]}
            >
              <boxGeometry args={[0.3, 0.04, 0.02]} />
              <meshStandardMaterial
                color="#fbbf24"
                emissive="#fbbf24"
                emissiveIntensity={2}
                transparent
                opacity={0.7}
              />
            </mesh>
          );
        })}
      </group>
    </group>
  );
}

// ══════════════════════════════════════════════
//  TURBINA EÓLICA
// ══════════════════════════════════════════════
function WindTurbine({ position, active }) {
  const bladesRef = useRef();
  const speedRef = useRef(0);

  useFrame((_, delta) => {
    if (!bladesRef.current) return;
    const target = active ? 1.5 : 0;
    speedRef.current += (target - speedRef.current) * 0.02;
    bladesRef.current.rotation.z += speedRef.current * delta;
  });

  return (
    <group position={position}>
      {/* Base */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.35, 0.45, 0.3, 16]} />
        <meshStandardMaterial color="#374151" roughness={0.5} metalness={0.4} />
      </mesh>
      {/* Torre */}
      <mesh position={[0, 2.5, 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.18, 5.0, 16]} />
        <meshStandardMaterial color="#e5e7eb" roughness={0.3} metalness={0.5} />
      </mesh>
      {/* Góndola */}
      <mesh position={[0, 5.1, 0.15]}>
        <boxGeometry args={[0.8, 0.35, 0.4]} />
        <meshStandardMaterial color="#f3f4f6" roughness={0.3} metalness={0.5} />
      </mesh>
      {/* Cubo central de aspas */}
      <mesh position={[0, 5.1, 0.4]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.12, 0.12, 0.15, 16]} />
        <meshStandardMaterial color="#d1d5db" roughness={0.3} metalness={0.6} />
      </mesh>
      {/* Aspas */}
      <group ref={bladesRef} position={[0, 5.1, 0.5]}>
        {[0, 1, 2].map((i) => {
          const angle = (i * Math.PI * 2) / 3;
          return (
            <group key={i} rotation={[0, 0, angle]}>
              <mesh position={[0, 1.1, 0]}>
                <boxGeometry args={[0.12, 2.2, 0.04]} />
                <meshStandardMaterial
                  color={active ? "#f3f4f6" : "#d1d5db"}
                  roughness={0.4}
                  metalness={0.3}
                />
              </mesh>
            </group>
          );
        })}
      </group>
      {/* LED activo */}
      <mesh position={[0, 5.1, -0.05]}>
        <sphereGeometry args={[0.04, 8, 8]} />
        <meshStandardMaterial
          color={active ? "#4ade80" : "#374151"}
          emissive={active ? "#4ade80" : "#000"}
          emissiveIntensity={active ? 3 : 0}
        />
      </mesh>
      {active && (
        <pointLight
          position={[0, 4, 1]}
          intensity={0.5}
          color="#22d3ee"
          distance={4}
        />
      )}
    </group>
  );
}

// ══════════════════════════════════════════════
//  MINI HIDROELÉCTRICA
// ══════════════════════════════════════════════
function HydroPlant({ position, active }) {
  const waterRef = useRef();
  useFrame(({ clock }) => {
    if (!waterRef.current) return;
    waterRef.current.material.emissiveIntensity = active
      ? 0.4 + Math.sin(clock.getElapsedTime() * 2) * 0.1
      : 0;
  });
  return (
    <group position={position}>
      {/* Represa */}
      <mesh castShadow>
        <boxGeometry args={[2.0, 1.5, 0.5]} />
        <meshStandardMaterial color="#4b5563" roughness={0.7} metalness={0.3} />
      </mesh>
      {/* Agua cayendo */}
      <mesh ref={waterRef} position={[0, -0.3, 0.3]}>
        <boxGeometry args={[1.6, 0.8, 0.05]} />
        <meshStandardMaterial
          color="#3b82f6"
          transparent
          opacity={0.7}
          emissive="#22d3ee"
          emissiveIntensity={active ? 0.4 : 0}
        />
      </mesh>
      {/* Turbina generador */}
      <mesh position={[0, 0.95, 0]}>
        <cylinderGeometry args={[0.25, 0.25, 0.3, 12]} />
        <meshStandardMaterial color="#e5e7eb" metalness={0.7} roughness={0.3} />
      </mesh>
      {/* Luz activa */}
      {active && (
        <pointLight
          position={[0, 0.5, 1]}
          intensity={0.6}
          color="#3b82f6"
          distance={4}
        />
      )}
    </group>
  );
}

// ══════════════════════════════════════════════
//  CONTROL PRINCIPAL
// ══════════════════════════════════════════════
export default function RenewableSources3D({ sourceId }) {
  return (
    <group>
      {/* Panel solar sobre el techo del laboratorio */}
      <SolarPanel position={[-3, 6, -2]} active={sourceId === "solar"} />

      {/* Turbina eólica — detrás del laboratorio, visible al fondo */}
      <WindTurbine position={[-8, -2, -8]} active={sourceId === "wind"} />

      {/* Hidroeléctrica — al lado del laboratorio */}
      <HydroPlant position={[8, 0, -5]} active={sourceId === "hydro"} />

      {/* Indicador de fuente en la "pared" del laboratorio */}
      <SourceIndicator sourceId={sourceId} position={[0, 4.5, -3]} />
    </group>
  );
}

function SourceIndicator({ sourceId, position }) {
  const colors = {
    solar: "#fbbf24",
    wind: "#22d3ee",
    hydro: "#3b82f6",
    mixed: "#fb923c",
    fossil: "#6b7280",
  };
  const h2Colors = {
    solar: "#4ade80",
    wind: "#4ade80",
    hydro: "#4ade80",
    mixed: "#facc15",
    fossil: "#9ca3af",
  };
  const color = colors[sourceId] || colors.mixed;
  const h2Color = h2Colors[sourceId] || "#9ca3af";

  return (
    <group position={position}>
      {/* Panel indicador flotante */}
      <mesh>
        <boxGeometry args={[1.2, 0.5, 0.08]} />
        <meshStandardMaterial color="#0d1117" roughness={0.5} metalness={0.4} />
      </mesh>
      {/* Borde emisivo */}
      <mesh position={[0, 0, 0.04]}>
        <boxGeometry args={[1.14, 0.44, 0.02]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.5}
        />
      </mesh>
      {/* Centro */}
      <mesh position={[0, 0, 0.05]}>
        <boxGeometry args={[1.08, 0.38, 0.01]} />
        <meshStandardMaterial color="#0a0d14" />
      </mesh>
      {/* Indicador color H2 */}
      <mesh position={[-0.45, 0, 0.06]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial
          color={h2Color}
          emissive={h2Color}
          emissiveIntensity={2}
        />
      </mesh>
      <pointLight
        position={[-0.45, 0, 0.2]}
        intensity={0.3}
        color={h2Color}
        distance={1}
      />
    </group>
  );
}
