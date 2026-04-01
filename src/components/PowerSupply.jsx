import { useRef, useEffect, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

function ScreenTexture({ voltage, current }) {
  const canvas = useMemo(() => document.createElement("canvas"), []);
  const texture = useMemo(() => new THREE.CanvasTexture(canvas), [canvas]);

  useEffect(() => {
    canvas.width = 512;
    canvas.height = 256;
    const ctx = canvas.getContext("2d");

    // Fondo LCD
    ctx.fillStyle = "#001a00";
    ctx.fillRect(0, 0, 512, 256);

    // Borde interior con brillo
    ctx.strokeStyle = "#14532d";
    ctx.lineWidth = 3;
    ctx.strokeRect(6, 6, 500, 244);

    // Píxeles decorativos esquinas
    ctx.fillStyle = "#052e16";
    ctx.fillRect(0, 0, 20, 20);
    ctx.fillRect(492, 0, 20, 20);
    ctx.fillRect(0, 236, 20, 20);
    ctx.fillRect(492, 236, 20, 20);

    // Label superior
    ctx.font = "500 22px monospace";
    ctx.fillStyle = "#166534";
    ctx.textAlign = "center";
    ctx.fillText("DC POWER SUPPLY", 256, 32);

    // Línea separadora
    ctx.strokeStyle = "#14532d";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(20, 44);
    ctx.lineTo(492, 44);
    ctx.stroke();

    // Voltaje — número grande
    ctx.font = "bold 96px monospace";
    ctx.fillStyle = "#4ade80";
    ctx.shadowColor = "#4ade80";
    ctx.shadowBlur = 18;
    ctx.textAlign = "center";
    ctx.fillText(`${parseFloat(voltage).toFixed(1)} V`, 256, 148);

    // Corriente
    ctx.font = "500 42px monospace";
    ctx.fillStyle = "#22d3ee";
    ctx.shadowColor = "#22d3ee";
    ctx.shadowBlur = 10;
    ctx.textAlign = "center";
    ctx.fillText(`I = ${parseFloat(current).toFixed(2)} A`, 256, 210);

    // Punto parpadeante (indicador activo)
    ctx.shadowBlur = 0;
    ctx.fillStyle = "#4ade80";
    ctx.beginPath();
    ctx.arc(470, 22, 6, 0, Math.PI * 2);
    ctx.fill();

    texture.needsUpdate = true;
  }, [voltage, current, canvas, texture]);

  return texture;
}

export default function PowerSupply({ voltage, current }) {
  const screenLightRef = useRef();
  const screenMeshRef = useRef();

  const texture = ScreenTexture({ voltage, current });

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (screenLightRef.current) {
      screenLightRef.current.intensity = 1.0 + Math.sin(t * 2) * 0.2;
    }
  });

  return (
    <group position={[0, 3.4, 0]}>
      {/* ── Cuerpo principal ── */}
      <mesh castShadow>
        <boxGeometry args={[3.0, 0.95, 1.2]} />
        <meshStandardMaterial color="#0d1117" roughness={0.3} metalness={0.9} />
      </mesh>

      {/* Panel frontal ligeramente elevado */}
      <mesh position={[0, 0, 0.61]}>
        <boxGeometry args={[2.98, 0.93, 0.02]} />
        <meshStandardMaterial color="#111827" roughness={0.4} metalness={0.8} />
      </mesh>

      {/* Tornillos esquinas */}
      {[
        [-1.4, 0.38, 0.62],
        [1.4, 0.38, 0.62],
        [-1.4, -0.38, 0.62],
        [1.4, -0.38, 0.62],
      ].map((p, i) => (
        <group key={i} position={p}>
          <mesh>
            <cylinderGeometry args={[0.035, 0.035, 0.025, 8]} />
            <meshStandardMaterial
              color="#374151"
              metalness={0.9}
              roughness={0.2}
            />
          </mesh>
          <mesh position={[0, 0, 0.013]}>
            <planeGeometry args={[0.05, 0.01]} />
            <meshStandardMaterial color="#1f2937" />
          </mesh>
        </group>
      ))}

      {/* Rejilla ventilación derecha */}
      {[-0.25, -0.1, 0.05, 0.2].map((z, i) => (
        <mesh key={i} position={[1.42, 0, z]}>
          <boxGeometry args={[0.02, 0.6, 0.025]} />
          <meshStandardMaterial color="#1f2937" metalness={0.7} />
        </mesh>
      ))}

      {/* ── Marco pantalla ── */}
      <mesh position={[0.1, 0.08, 0.62]}>
        <boxGeometry args={[1.9, 0.68, 0.015]} />
        <meshStandardMaterial color="#030a03" roughness={0.6} metalness={0.2} />
      </mesh>

      {/* ── PANTALLA con textura Canvas ── */}
      <mesh ref={screenMeshRef} position={[0.1, 0.08, 0.63]}>
        <planeGeometry args={[1.78, 0.6]} />
        <meshStandardMaterial
          map={texture}
          emissiveMap={texture}
          emissive="#ffffff"
          emissiveIntensity={0.55}
          roughness={0.0}
          metalness={0.0}
          toneMapped={false}
        />
      </mesh>

      {/* Reflejo cristal pantalla */}
      <mesh position={[0.1, 0.08, 0.641]}>
        <planeGeometry args={[1.78, 0.6]} />
        <meshPhysicalMaterial
          transparent
          opacity={0.06}
          roughness={0}
          transmission={0.95}
          color="#a8d8ff"
        />
      </mesh>

      {/* Luz de la pantalla */}
      <pointLight
        ref={screenLightRef}
        position={[0.1, 0.08, 1.1]}
        intensity={1.0}
        color="#4ade80"
        distance={3}
      />

      {/* ── Perillas ── */}
      {[-1.1, -0.8, -0.5].map((x, i) => (
        <group key={i} position={[x, -0.22, 0.62]}>
          <mesh>
            <cylinderGeometry args={[0.07, 0.07, 0.065, 24]} />
            <meshStandardMaterial
              color="#1e293b"
              roughness={0.15}
              metalness={0.95}
            />
          </mesh>
          <mesh position={[0, 0.045, 0.05]} rotation={[0.4, 0, 0]}>
            <boxGeometry args={[0.012, 0.045, 0.012]} />
            <meshStandardMaterial
              color="#6b7280"
              metalness={1}
              roughness={0.1}
            />
          </mesh>
          {/* Anillo perilla */}
          <mesh position={[0, -0.02, 0]}>
            <torusGeometry args={[0.07, 0.008, 8, 24]} />
            <meshStandardMaterial color="#374151" metalness={0.9} />
          </mesh>
        </group>
      ))}

      {/* ── LED indicador activo ── */}
      <LEDIndicator />

      {/* ── Terminales ── */}
      <Terminal
        pos={[-0.55, -0.22, 0.62]}
        color="#ef4444"
        emissive="#ef4444"
        label="+"
      />
      <Terminal
        pos={[0.55, -0.22, 0.62]}
        color="#374151"
        emissive="#6b7280"
        label="−"
      />
    </group>
  );
}

function LEDIndicator() {
  const ref = useRef();
  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.emissiveIntensity =
        1.5 + Math.sin(clock.getElapsedTime() * 2) * 0.5;
    }
  });
  return (
    <group position={[-1.1, 0.32, 0.63]}>
      <mesh>
        <sphereGeometry args={[0.04, 12, 12]} />
        <meshStandardMaterial
          ref={ref}
          color="#4ade80"
          emissive="#4ade80"
          emissiveIntensity={2}
        />
      </mesh>
      <pointLight
        position={[0, 0, 0.1]}
        intensity={0.25}
        color="#4ade80"
        distance={0.6}
      />
    </group>
  );
}

function Terminal({ pos, color, emissive, label }) {
  return (
    <group position={pos}>
      {/* Base */}
      <mesh>
        <cylinderGeometry args={[0.07, 0.07, 0.04, 16]} />
        <meshStandardMaterial color="#1f2937" roughness={0.3} metalness={0.8} />
      </mesh>
      {/* Tornillo terminal */}
      <mesh position={[0, 0.03, 0]}>
        <cylinderGeometry args={[0.055, 0.055, 0.08, 16]} />
        <meshStandardMaterial
          color={color}
          emissive={emissive}
          emissiveIntensity={0.4}
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>
      {/* Agujero cable */}
      <mesh position={[0, 0.07, 0]}>
        <cylinderGeometry args={[0.025, 0.025, 0.04, 8]} />
        <meshStandardMaterial color="#050a05" />
      </mesh>
    </group>
  );
}
