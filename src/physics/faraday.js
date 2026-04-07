const F_CONST = 96485;
const M_H2 = 2.016;
const M_O2 = 32.0;

// Factor de eficiencia real por material de electrodo
// Platino es el más eficiente (100%), los demás tienen pérdidas
const ELECTRODE_EFFICIENCY = {
  "Platino (Pt)": 1.0, // 100% — electrodo ideal, sin reacciones secundarias
  "Grafito (C)": 0.78, // 78%  — económico pero se degrada, menor eficiencia
  "Níquel (Ni)": 0.89, // 89%  — buena eficiencia, usado en electrólisis industrial
  "Acero (Fe)": 0.65, // 65%  — se oxida, baja eficiencia, no recomendado
};

// Voltaje mínimo teórico para electrólisis
const V_MIN = 1.23;

export function calcular(
  voltage,
  resistance,
  time,
  conductivity,
  electrode = "Platino (Pt)",
) {
  const efficiency = ELECTRODE_EFFICIENCY[electrode] ?? 1.0;

  // Corriente según Ohm, afectada por conductividad del electrolito
  const current = (voltage / resistance) * conductivity;

  // Corriente efectiva — el material del electrodo reduce la corriente útil
  const effectiveCurrent = current * efficiency;

  const power = voltage * current; // potencia total consumida
  const charge = effectiveCurrent * time; // carga útil (Coulombs)
  const energy = power * time; // energía total (J)

  // Masa producida según Faraday con corriente efectiva
  const massH2 = (M_H2 * charge) / (2 * F_CONST);
  const massO2 = (M_O2 * charge) / (4 * F_CONST);

  // Eficiencia energética respecto al mínimo teórico
  const energyEfficiency =
    voltage > 0 ? Math.min(100, (V_MIN / voltage) * 100 * efficiency) : 0;

  return {
    current: parseFloat(current.toFixed(3)),
    effectiveCurrent: parseFloat(effectiveCurrent.toFixed(3)),
    power: parseFloat(power.toFixed(2)),
    charge: parseFloat(charge.toFixed(2)),
    energy: parseFloat(energy.toFixed(2)),
    massH2: parseFloat(massH2.toFixed(6)),
    massO2: parseFloat(massO2.toFixed(6)),
    efficiency: parseFloat(energyEfficiency.toFixed(1)),
    electrodeEff: parseFloat((efficiency * 100).toFixed(0)),
  };
}
