import { useState, useEffect, useCallback } from "react";
import "./App.css";
import Scene3D from "./components/Scene3D";
import ControlPanel from "./components/ControlPanel";
import Topbar from "./components/Topbar";
import Logbar from "./components/Logbar";
import EnergyPanel from "./components/EnergyPanel";
import SystemTabs from "./components/SystemTabs";
import StoragePanel from "./components/StoragePanel";
import FuelCellPanel from "./components/FuelCellPanel";
import ConsumptionPanel from "./components/ConsumptionPanel";
import { calcular } from "./physics/faraday";
import { calcularPilaCombustible } from "./physics/hydrogen";

function App() {
  const [params, setParams] = useState({
    voltage: 12,
    resistance: 5,
    time: 60,
    electrolyte: 1.0,
    ph: 14,
    electrode: "Platino (Pt)",
  });
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(true);
  const [history, setHistory] = useState([]);
  const [activeTab, setActiveTab] = useState("electrolysis");
  const [waterSource, setWaterSource] = useState("rain");

  const results = calcular(
    params.voltage,
    params.resistance,
    params.time,
    params.electrolyte,
    params.electrode,
  );

  const fuelCell = calcularPilaCombustible(results.massH2 / 1000);

  useEffect(() => {
    if (!running) return;
    const interval = setInterval(() => {
      setSeconds((s) => s + 1);
      setHistory((prev) => [
        ...prev.slice(-300),
        {
          t: prev.length,
          H2: results.massH2,
          O2: results.massO2,
          I: results.current,
          V: params.voltage,
          P: results.power,
        },
      ]);
    }, 1000);
    return () => clearInterval(interval);
  }, [running, results, params.voltage]);

  const handleReset = useCallback(() => {
    setSeconds(0);
    setHistory([]);
  }, []);

  const handleExportCSV = useCallback(() => {
    const headers = "Tiempo(s),H2(g),O2(g),Corriente(A),Voltaje(V),Potencia(W)";
    const rows = history
      .map(
        (r) =>
          `${r.t},${r.H2.toFixed(6)},${r.O2.toFixed(6)},${r.I.toFixed(3)},${r.V},${r.P.toFixed(2)}`,
      )
      .join("\n");
    const blob = new Blob([headers + "\n" + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `electrolisis_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }, [history]);

  return (
    <div className="app-layout">
      <Topbar
        seconds={seconds}
        running={running}
        onToggle={() => setRunning((r) => !r)}
        onReset={handleReset}
        onExport={handleExportCSV}
        hasData={history.length > 0}
      />

      {/* Pestañas del sistema */}
      <SystemTabs activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Contenido según pestaña activa */}
      {activeTab === "electrolysis" && (
        <>
          <Scene3D params={params} results={results} running={running} />
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}
          >
            <EnergyPanel results={results} params={params} />
            <ControlPanel
              params={params}
              setParams={setParams}
              results={results}
            />
          </div>
        </>
      )}

      {activeTab === "storage" && (
        <div style={{ gridColumn: "1 / -1", overflow: "hidden" }}>
          <StoragePanel
            massH2Grams={results.massH2}
            waterSource={waterSource}
            onWaterSourceChange={setWaterSource}
          />
        </div>
      )}

      {activeTab === "fuelcell" && (
        <div style={{ gridColumn: "1 / -1", overflow: "hidden" }}>
          <FuelCellPanel massH2Grams={results.massH2} />
        </div>
      )}

      {activeTab === "consumption" && (
        <div
          style={{
            gridColumn: "1 / -1",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <ConsumptionPanel energyElecKWh={fuelCell.energyElecKWh} />
        </div>
      )}

      <Logbar
        params={params}
        results={results}
        seconds={seconds}
        running={running}
      />
    </div>
  );
}

export default App;
