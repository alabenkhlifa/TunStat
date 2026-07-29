(() => {
  "use strict";

  if (!window.Chart) return;

  const page = document.body.dataset.comparison;
  if (!page) return;

  const colors = {
    tunisia: "#e70013",
    morocco: "#087e8b",
    jordan: "#2563eb",
    egypt: "#f18f01",
  };

  const pages = {
    morocco: {
      peer: "Morocco",
      color: colors.morocco,
      charts: {
        flow: {
          title: "Growth, prices and jobs",
          subtitle: "2025 calendar-year observations",
          labels: ["Real GDP growth", "Inflation", "Unemployment"],
          units: ["%", "%", "%"],
          tunisia: [2.5, 5.7, 15.2],
          peer: [4.9, 0.8, 13.0],
        },
        structure: {
          title: "Fiscal space and investment capacity",
          subtitle: "2025 estimates; percent of GDP",
          labels: ["Public debt", "Fiscal deficit", "Capital formation"],
          units: ["% of GDP", "% of GDP", "% of GDP"],
          tunisia: [82.2, 5.2, 15.5],
          peer: [68.2, 3.5, 30.9],
        },
      },
    },
    jordan: {
      peer: "Jordan",
      color: colors.jordan,
      charts: {
        flow: {
          title: "Growth, prices and jobs",
          subtitle: "2025 observations; Jordan unemployment covers Jordanians",
          labels: ["Real GDP growth", "Inflation", "Unemployment"],
          units: ["%", "%", "%"],
          tunisia: [2.5, 5.7, 15.2],
          peer: [2.8, 1.8, 21.3],
        },
        structure: {
          title: "Financing pressure and external buffers",
          subtitle: "2025; debt definitions differ",
          labels: ["Public debt", "Fiscal deficit", "Reserve cover (months)"],
          units: ["% of GDP", "% of GDP", "months"],
          tunisia: [82.2, 5.2, 3.2],
          peer: [83.6, 5.0, 8.6],
        },
      },
    },
    egypt: {
      peer: "Egypt",
      color: colors.egypt,
      charts: {
        flow: {
          title: "Growth, prices and jobs",
          subtitle: "Latest references; Egypt uses fiscal-year growth and February 2026 inflation",
          labels: ["Real GDP growth", "Inflation", "Unemployment"],
          units: ["%", "%", "%"],
          tunisia: [2.5, 5.7, 15.2],
          peer: [4.4, 13.4, 6.4],
        },
        structure: {
          title: "Debt and labor-market reach",
          subtitle: "Debt at end-2025 reference periods; participation is latest available",
          labels: ["Public debt", "Labor-force participation"],
          units: ["% of GDP", "%"],
          tunisia: [82.2, 45.9],
          peer: [82.5, 46.7],
        },
      },
    },
  };

  const active = pages[page];
  if (!active) return;

  const instances = [];

  function palette() {
    const dark = document.documentElement.classList.contains("dark");
    return {
      text: dark ? "#e7e5e4" : "#44403c",
      muted: dark ? "#a8a29e" : "#78716c",
      grid: dark ? "rgba(255,255,255,.09)" : "rgba(120,113,108,.16)",
      tooltip: dark ? "#111a17" : "#1c1917",
    };
  }

  function render() {
    instances.splice(0).forEach((chart) => chart.destroy());
    const compact = matchMedia("(max-width: 639px)").matches;
    const theme = palette();

    document.querySelectorAll("[data-comparison-chart]").forEach((canvas) => {
      const spec = active.charts[canvas.dataset.comparisonChart];
      if (!spec) return;
      const title = canvas.closest("[data-chart-card]")?.querySelector("[data-chart-title]");
      const subtitle = canvas.closest("[data-chart-card]")?.querySelector("[data-chart-subtitle]");
      if (title) title.textContent = spec.title;
      if (subtitle) subtitle.textContent = spec.subtitle;
      const card = canvas.closest("[data-chart-card]");
      if (card && !card.querySelector("[data-comparison-table]")) {
        const details = document.createElement("details");
        details.className = "chart-data-table";
        details.dataset.comparisonTable = "";
        details.innerHTML = `
          <summary class="cursor-pointer px-3 py-3 text-xs font-bold">View exact comparison data</summary>
          <table>
            <thead><tr><th scope="col">Metric</th><th scope="col">Tunisia</th><th scope="col">${active.peer}</th></tr></thead>
            <tbody>${spec.labels.map((label, index) => `<tr><th scope="row">${label}</th><td>${spec.tunisia[index]} ${spec.units[index]}</td><td>${spec.peer[index]} ${spec.units[index]}</td></tr>`).join("")}</tbody>
          </table>`;
        card.querySelector(".p-3, .p-4")?.append(details);
      }

      instances.push(
        new Chart(canvas, {
          type: "bar",
          data: {
            labels: spec.labels,
            datasets: [
              { label: "Tunisia", data: spec.tunisia, backgroundColor: colors.tunisia, borderRadius: 6 },
              { label: active.peer, data: spec.peer, backgroundColor: active.color, borderRadius: 6 },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            resizeDelay: 80,
            animation: matchMedia("(prefers-reduced-motion: reduce)").matches ? false : { duration: 450 },
            interaction: { mode: "index", intersect: false },
            layout: { padding: compact ? 0 : 4 },
            plugins: {
              legend: {
                position: "bottom",
                labels: { color: theme.text, usePointStyle: true, boxWidth: 8, padding: compact ? 10 : 16 },
              },
              tooltip: {
                backgroundColor: theme.tooltip,
                padding: 12,
                callbacks: {
                  label(context) {
                    return `${context.dataset.label}: ${context.parsed.y.toLocaleString()} ${spec.units[context.dataIndex]}`;
                  },
                },
              },
            },
            scales: {
              x: {
                grid: { display: false },
                ticks: { color: theme.muted, maxRotation: 0, autoSkip: true, font: { size: compact ? 10 : 12 } },
              },
              y: {
                beginAtZero: true,
                grid: { color: theme.grid },
                ticks: { color: theme.muted },
              },
            },
          },
        }),
      );
    });
  }

  render();
  document.documentElement.addEventListener("tunstat:theme", render);
})();
