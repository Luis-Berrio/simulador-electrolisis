// ══════════════════════════════════════════════════
//  FÍSICA DEL TRANSPORTE CON HIDRÓGENO
// ══════════════════════════════════════════════════

// Consumo real: Toyota Mirai consume ~0.89 kg H₂ / 100 km
const H2_CONSUMPTION_KG_PER_100KM = 0.89;

// Capacidad tanque típica: 5.6 kg a 700 bar
const TANK_CAPACITY_KG = 5.6;

// Velocidad carga en estación H₂: 3-5 min para tanque lleno
const REFUEL_TIME_MINUTES = 4;

// Velocidad de electrólisis doméstica vs comercial
const DOMESTIC_H2_PER_HOUR_G = 2.0; // gramos H₂ por hora en sistema casero

// Autonomía máxima con tanque lleno
const MAX_RANGE_KM = (TANK_CAPACITY_KG / H2_CONSUMPTION_KG_PER_100KM) * 100; // ~629 km

// ══════════════════════════════════════════════════
//  DESTINOS DE EJEMPLO — Colombia
// ══════════════════════════════════════════════════
export const DESTINATIONS = [
  {
    id: "short",
    name: "Al trabajo y regreso",
    km: 15,
    icon: "🏢",
    type: "Diario",
  },
  { id: "gym", name: "Al gimnasio", km: 8, icon: "💪", type: "Diario" },
  { id: "mall", name: "Centro comercial", km: 25, icon: "🛍️", type: "Semanal" },
  {
    id: "airport",
    name: "Aeropuerto (Bogotá)",
    km: 45,
    icon: "✈️",
    type: "Ocasional",
  },
  { id: "chia", name: "Bogotá → Chía", km: 27, icon: "🏘️", type: "Semanal" },
  {
    id: "villavi",
    name: "Bogotá → Villavicencio",
    km: 130,
    icon: "🏞️",
    type: "Fin semana",
  },
  {
    id: "medellin",
    name: "Bogotá → Medellín",
    km: 420,
    icon: "🏔️",
    type: "Viaje largo",
  },
  {
    id: "cartag",
    name: "Bogotá → Cartagena",
    km: 1040,
    icon: "🏝️",
    type: "Vacaciones",
  },
];

// ══════════════════════════════════════════════════
//  TIPOS DE CARRO PARA COMPARACIÓN
// ══════════════════════════════════════════════════
export const CAR_TYPES = [
  {
    id: "h2",
    name: "Hidrógeno",
    icon: "💧",
    color: "#3b82f6",
    co2_per_km: 0.0,
    cost_per_km_COP: 95, // con H₂ a precio comercial
    cost_per_km_USD: 0.023,
    refuel_time: "4 min",
    range_km: 629,
    maintenance: "Bajo",
  },
  {
    id: "electric",
    name: "Eléctrico",
    icon: "🔋",
    color: "#4ade80",
    co2_per_km: 0.05, // indirecto por red eléctrica
    cost_per_km_COP: 65,
    cost_per_km_USD: 0.016,
    refuel_time: "30-60 min",
    range_km: 450,
    maintenance: "Bajo",
  },
  {
    id: "gasoline",
    name: "Gasolina",
    icon: "⛽",
    color: "#ef4444",
    co2_per_km: 0.192,
    cost_per_km_COP: 320,
    cost_per_km_USD: 0.078,
    refuel_time: "5 min",
    range_km: 650,
    maintenance: "Alto",
  },
  {
    id: "diesel",
    name: "Diésel",
    icon: "🚛",
    color: "#f97316",
    co2_per_km: 0.171,
    cost_per_km_COP: 260,
    cost_per_km_USD: 0.063,
    refuel_time: "5 min",
    range_km: 800,
    maintenance: "Medio",
  },
];

// ══════════════════════════════════════════════════
//  CÁLCULOS PRINCIPALES
// ══════════════════════════════════════════════════
export function calcularTransporte(
  massH2Grams,
  energyCost_COP = 0,
  energyCost_USD = 0,
) {
  const massH2Kg = massH2Grams / 1000;

  // Autonomía real con el H₂ producido
  const rangeKm = (massH2Kg / H2_CONSUMPTION_KG_PER_100KM) * 100;

  // Porcentaje del tanque lleno
  const tankFillPercent = Math.min(100, (massH2Kg / TANK_CAPACITY_KG) * 100);

  // Tiempo producción casera equivalente (horas)
  const domesticHours = massH2Grams / DOMESTIC_H2_PER_HOUR_G;

  // Destinos que puede alcanzar
  const reachableDestinations = DESTINATIONS.map((d) => {
    const trips = Math.floor(rangeKm / d.km);
    const canReach = rangeKm >= d.km;
    const partialTrip = rangeKm < d.km ? (rangeKm / d.km) * 100 : 100;
    return { ...d, trips, canReach, partialTrip };
  });

  // Ahorro vs gasolina
  const gasoline = CAR_TYPES.find((c) => c.id === "gasoline");
  const costSavedCOP = rangeKm * (gasoline.cost_per_km_COP - 95);
  const costSavedUSD = rangeKm * (gasoline.cost_per_km_USD - 0.023);
  const co2AvoidedKg = rangeKm * gasoline.co2_per_km;

  return {
    massH2Kg: parseFloat(massH2Kg.toFixed(5)),
    rangeKm: parseFloat(rangeKm.toFixed(2)),
    tankFillPercent: parseFloat(tankFillPercent.toFixed(2)),
    domesticHours: parseFloat(domesticHours.toFixed(2)),
    reachableDestinations,
    costSavedCOP: parseFloat(costSavedCOP.toFixed(0)),
    costSavedUSD: parseFloat(costSavedUSD.toFixed(2)),
    co2AvoidedKg: parseFloat(co2AvoidedKg.toFixed(3)),
    maxRangeKm: MAX_RANGE_KM,
    tankCapacity: TANK_CAPACITY_KG,
  };
}

export { H2_CONSUMPTION_KG_PER_100KM, TANK_CAPACITY_KG, MAX_RANGE_KM };
