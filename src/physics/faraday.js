const F_CONST = 96485; // Constante de Faraday (C/mol)
const M_H2 = 2.016; // Masa molar H₂ (g/mol)
const M_O2 = 32.0; // Masa molar O₂ (g/mol)

export function calcular(voltage, resistance, time, conductivity) {
  const current = (voltage / resistance) * conductivity;
  const power = voltage * current;
  const charge = current * time;
  const energy = power * time;
  const massH2 = (M_H2 * charge) / (2 * F_CONST);
  const massO2 = (M_O2 * charge) / (4 * F_CONST);

  return {
    current: parseFloat(current.toFixed(3)),
    power: parseFloat(power.toFixed(2)),
    charge: parseFloat(charge.toFixed(2)),
    energy: parseFloat(energy.toFixed(2)),
    massH2: parseFloat(massH2.toFixed(5)),
    massO2: parseFloat(massO2.toFixed(5)),
  };
}
