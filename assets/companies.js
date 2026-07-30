(() => {
  "use strict";

  if (!window.Chart) return;

  const charts = new Map();
  const translate = (value) => (window.tunstatTranslate ? window.tunstatTranslate(value) : value);
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

  function palette(forceDark = false) {
    const dark = forceDark || document.documentElement.classList.contains("dark");
    return {
      text: dark ? "#e7e5e4" : "#44403c",
      muted: dark ? "#a8a29e" : "#78716c",
      grid: dark ? "rgba(255,255,255,.10)" : "rgba(68,64,60,.12)",
      red: "#e70013",
      green: "#059669",
      amber: "#f59e0b",
      blue: "#2563eb",
      teal: "#087e8b",
    };
  }

  function destroy(name) {
    charts.get(name)?.destroy();
    charts.delete(name);
  }

  function baseOptions(forceDark = false) {
    const color = palette(forceDark);
    return {
      responsive: true,
      maintainAspectRatio: false,
      animation: reducedMotion ? false : { duration: 450 },
      interaction: { mode: "nearest", intersect: false },
      plugins: {
        legend: {
          position: "bottom",
          labels: { color: color.text, usePointStyle: true, boxWidth: 10, padding: 18 },
        },
        tooltip: {
          backgroundColor: forceDark || document.documentElement.classList.contains("dark") ? "#f5f5f4" : "#111827",
          titleColor: forceDark || document.documentElement.classList.contains("dark") ? "#111827" : "#fff",
          bodyColor: forceDark || document.documentElement.classList.contains("dark") ? "#374151" : "#e5e7eb",
          padding: 12,
        },
      },
      scales: {
        x: {
          ticks: { color: color.muted, maxRotation: 0, autoSkip: false },
          grid: { color: color.grid },
          border: { color: color.grid },
        },
        y: {
          ticks: { color: color.muted },
          grid: { color: color.grid },
          border: { color: color.grid },
        },
      },
    };
  }

  function renderTunisair() {
    const canvas = document.getElementById("tunisair-change-chart");
    if (!canvas) return;
    destroy("tunisair");
    const color = palette();
    const options = baseOptions();
    options.indexAxis = "y";
    options.scales.x.title = { display: true, text: translate("Change from 2024"), color: color.muted };
    options.scales.x.suggestedMin = -22;
    options.scales.x.suggestedMax = 22;
    options.plugins.legend.display = false;
    options.plugins.tooltip.callbacks = {
      label(context) {
        const pointMetrics = new Set([1, 2]);
        return `${context.parsed.x > 0 ? "+" : ""}${context.parsed.x.toFixed(1)}${pointMetrics.has(context.dataIndex) ? " pp" : "%"}`;
      },
    };
    charts.set("tunisair", new Chart(canvas, {
      type: "bar",
      data: {
        labels: [
          translate("Passengers"),
          translate("Load factor"),
          translate("Punctuality"),
          translate("Debt"),
          translate("Employees"),
          translate("Cash"),
          translate("Fuel spending"),
        ],
        datasets: [{
          data: [-4.8, 3.0, -9.0, 3.1, -9.3, 17.5, -19.7],
          borderWidth: 0,
          borderRadius: 6,
          backgroundColor: (context) => context.raw >= 0 ? color.teal : color.red,
        }],
      },
      options,
    }));
  }

  function renderBanks() {
    const canvas = document.getElementById("bank-income-chart");
    if (!canvas) return;
    destroy("banks");
    const color = palette();
    const options = baseOptions();
    options.scales.y.title = { display: true, text: translate("TND million"), color: color.muted };
    charts.set("banks", new Chart(canvas, {
      type: "bar",
      data: {
        labels: ["BNA", "STB", "BH Bank"],
        datasets: [
          { label: "2024", data: [254.6, 82.5, 70.404], backgroundColor: color.muted, borderRadius: 6 },
          { label: "2025", data: [274.5, 65.9, 39.769], backgroundColor: [color.green, color.amber, color.red], borderRadius: 6 },
        ],
      },
      options,
    }));
  }

  const scenarioData = {
    punctuality: {
      label: "Tunisair punctuality",
      unit: "%",
      values: [37, 35, 55, 75],
      note: "Flights arriving or departing within 15 minutes",
    },
    passengers: {
      label: "Tunisair passenger volume",
      unit: "2025 = 100",
      values: [100, 92, 110, 129],
      note: "Passenger-volume index",
    },
    debt: {
      label: "Tunisair debt",
      unit: "2025 = 100",
      values: [100, 119, 102, 71],
      note: "Debt index; lower is better",
    },
    telecom: {
      label: "Tunisie Telecom real regulated revenue",
      unit: "2025 = 100",
      values: [100, 92, 100, 108],
      note: "Inflation-adjusted regulated-revenue index",
    },
  };

  function renderScenario() {
    const canvas = document.getElementById("scenario-chart");
    const select = document.getElementById("scenario-metric");
    if (!canvas || !select) return;
    destroy("scenario");
    const selected = scenarioData[select.value] || scenarioData.punctuality;
    const color = palette(true);
    const options = baseOptions(true);
    options.plugins.legend.display = false;
    options.plugins.title = {
      display: true,
      text: [translate(selected.label), translate(selected.note)],
      color: color.text,
      font: { size: 15, weight: "700" },
      padding: { bottom: 22 },
    };
    options.scales.y.title = { display: true, text: translate(selected.unit), color: color.muted };
    options.scales.y.beginAtZero = true;
    options.plugins.tooltip.callbacks = {
      label(context) {
        return `${translate(selected.label)}: ${context.parsed.y}${selected.unit === "%" ? "%" : ""}`;
      },
    };
    charts.set("scenario", new Chart(canvas, {
      type: "bar",
      data: {
        labels: [translate("2025 actual"), translate("2028 stress"), translate("2028 baseline"), translate("2028 reform")],
        datasets: [{
          data: selected.values,
          backgroundColor: [color.blue, color.red, color.amber, color.green],
          borderRadius: 8,
          maxBarThickness: 74,
        }],
      },
      options,
    }));
  }

  function renderAll() {
    renderTunisair();
    renderBanks();
    renderScenario();
  }

  document.getElementById("scenario-metric")?.addEventListener("change", renderScenario);
  document.documentElement.addEventListener("tunstat:theme", renderAll);
  document.documentElement.addEventListener("tunstat:language", renderAll);
  renderAll();
})();
