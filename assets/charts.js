(() => {
  "use strict";

  if (!window.Chart) {
    document.querySelectorAll("[data-chart-group]").forEach((host) => {
      host.innerHTML = '<p class="p-5 text-sm text-red-700 dark:text-red-300">Interactive charts could not be loaded. Use the linked CSV data below.</p>';
    });
    return;
  }

  const C = {
    red: "#e70013",
    teal: "#087e8b",
    gold: "#f18f01",
    blue: "#2563eb",
    green: "#059669",
    purple: "#7c3aed",
    slate: "#64748b",
    rose: "#be123c",
  };
  const charts = [];
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

  const benchmarkLine = {
    id: "benchmarkLine",
    afterDraw(chart, _args, options) {
      if (!options || !Number.isFinite(options.value)) return;
      const scale = chart.scales[options.scaleID || "y"];
      if (!scale) return;
      const position = scale.getPixelForValue(options.value);
      const horizontal = scale.axis === "y";
      const { ctx, chartArea } = chart;
      ctx.save();
      ctx.strokeStyle = options.color || C.teal;
      ctx.fillStyle = options.color || C.teal;
      ctx.setLineDash([6, 5]);
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      if (horizontal) {
        ctx.moveTo(chartArea.left, position);
        ctx.lineTo(chartArea.right, position);
      } else {
        ctx.moveTo(position, chartArea.top);
        ctx.lineTo(position, chartArea.bottom);
      }
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.font = "600 10px system-ui";
      const label = options.label || `Reference: ${options.value}`;
      const width = ctx.measureText(label).width + 10;
      const x = horizontal ? chartArea.right - width : Math.min(position + 5, chartArea.right - width);
      const y = horizontal ? Math.max(chartArea.top + 14, position - 6) : chartArea.top + 14;
      ctx.fillRect(x, y - 11, width, 15);
      ctx.fillStyle = "#fff";
      ctx.fillText(label, x + 5, y);
      ctx.restore();
    },
  };
  Chart.register(benchmarkLine);

  const D = (label, data, color, extra = {}) => ({
    label,
    data,
    borderColor: color,
    backgroundColor: extra.fill ? `${color}22` : color,
    pointBackgroundColor: color,
    pointRadius: 3,
    pointHoverRadius: 6,
    borderWidth: 2.5,
    tension: 0.25,
    fill: Boolean(extra.fill),
    ...extra,
  });

  const chartGroups = {
    macro: {
      title: "Macroeconomic path",
      note: "Hover, tap or focus the charts to inspect annual values. Forecast years remain projections.",
      health: [
        "GDP: sustained growth above 3.5% with productivity and employment gains.",
        "Inflation: broadly stable around 3–5%, with food inflation no higher than headline inflation.",
        "Fiscal balance: deficit no larger than 3% of GDP over the cycle and debt clearly declining.",
        "Public debt: declining each year; below 70% of GDP is TunStat’s 2035 policy anchor.",
      ],
      source: "data/macro_dashboard.csv",
      charts: [
        {
          title: "Growth and inflation",
          type: "line",
          labels: ["2023", "2024", "2025", "2026f", "2027f", "2028f"],
          datasets: [D("Real GDP growth (%)", [0.2, 1.6, 2.5, 2.5, 2.3, 2.3], C.teal), D("Inflation (%)", [9.3, 7, 5.7, 5.5, 4.5, 4.5], C.red)],
          yTitle: "%",
          benchmark: { value: 3.5, label: "GDP healthy ≥3.5%" },
        },
        {
          title: "Fiscal balance",
          type: "line",
          labels: ["2023", "2024", "2025", "2026f", "2027f", "2028f"],
          datasets: [D("Fiscal balance (% GDP)", [-7.1, -6.1, -5.2, -6.1, -4.5, -4], C.red)],
          yTitle: "% of GDP",
          benchmark: { value: -3, label: "Reference ≥−3%" },
        },
        {
          title: "Public debt",
          type: "line",
          labels: ["2023", "2024", "2025", "2026f", "2027f", "2028f"],
          datasets: [D("Public debt (% GDP)", [84.6, 84.9, 82.2, 83.3, 82.7, 81.2], C.gold, { fill: true })],
          yTitle: "% of GDP",
          benchmark: { value: 70, label: "2035 policy anchor <70%" },
        },
      ],
    },
    coverage: {
      title: "Critical-metric coverage",
      note: "A healthy public-data system publishes all 39 audited measures on a current, recurring and comparable basis.",
      health: ["Coverage: 100% current and 0 missing. Partial or stale series do not count as current."],
      source: "data/metric_coverage.csv",
      charts: [
        {
          title: "Overall audit",
          type: "doughnut",
          labels: ["Current", "Partial", "Missing"],
          datasets: [D("Metrics", [13, 6, 20], C.teal, { backgroundColor: [C.green, C.gold, C.red], borderWidth: 0 })],
        },
        {
          title: "Coverage by domain",
          type: "bar",
          labels: ["External", "Banking", "Fiscal", "Households", "Electricity", "Water", "Investment", "Productive", "Labor", "SOEs"],
          datasets: [
            D("Current", [3, 1, 1, 1, 1, 1, 2, 1, 1, 1], C.green),
            D("Partial", [1, 1, 0, 1, 0, 1, 0, 1, 1, 0], C.gold),
            D("Missing", [0, 1, 3, 2, 3, 2, 2, 2, 2, 3], C.red),
          ],
          stacked: true,
          yTitle: "Number of metrics",
        },
      ],
    },
    external: {
      title: "External liquidity",
      note: "Reserve stock is shown with import cover because the TND amount alone has no fixed healthy level.",
      health: [
        "Import cover: at least 90 days; 120 days is the preferred Tunisia buffer.",
        "Current-account deficit: no more than 3% of GDP and funded by stable long-term inflows.",
        "Remittances and tourism: positive real growth with diversified sources; no fixed TND threshold.",
      ],
      source: "data/external_liquidity.csv",
      charts: [
        {
          title: "Foreign-exchange reserve stock",
          type: "line",
          labels: ["End-2024", "End-2025", "3 Jul 2026"],
          datasets: [D("TND bn", [27.3316, 25.1153, 24.5396], C.blue, { fill: true })],
          yTitle: "TND billion",
        },
        {
          title: "Import cover",
          type: "line",
          labels: ["End-2024", "End-2025", "3 Jul 2026"],
          datasets: [D("Import cover (days)", [121, 106, 97], C.red, { fill: true })],
          yTitle: "Days of imports",
          benchmark: { value: 90, label: "Adequate ≥90 days" },
        },
        {
          title: "Supporting inflows",
          type: "bar",
          labels: ["Workers' income 2025", "Tourism H1 2026"],
          datasets: [D("TND bn", [11.4446, 3.3524], C.teal)],
          yTitle: "TND billion",
        },
      ],
    },
    banking: {
      title: "Banking health",
      note: "Strong aggregate capital and liquidity coexist with weak asset quality and high public-sector exposure.",
      health: [
        "Solvency: above the national minimum; 10.5% is the Basel total-capital-plus-buffer reference.",
        "Tier 1 capital: above the national minimum; 8.5% is the Basel minimum-plus-buffer reference.",
        "Liquidity coverage: at least 100%.",
        "Classified loans: below 5% and falling; coverage at least 70%.",
        "Public-sector financing: transparent and declining toward below 20% of bank assets.",
      ],
      source: "data/banking_health_2025.csv",
      charts: [
        {
          title: "Capital, funding and asset quality",
          type: "bar",
          labels: ["Solvency", "Tier 1", "Loan/deposit", "Classified loans", "NPL coverage", "Public exposure"],
          datasets: [D("End-2025 (%)", [15.1, 12.1, 92.1, 14.9, 51.6, 27.6], C.blue, { backgroundColor: [C.green, C.green, C.teal, C.red, C.red, C.gold] })],
          yTitle: "%",
        },
        {
          title: "Liquidity coverage",
          type: "bar",
          labels: ["End-2025"],
          datasets: [D("LCR (%)", [252.8], C.green)],
          yTitle: "%",
          benchmark: { value: 100, label: "Basel minimum 100%" },
        },
        {
          title: "Credit allocation",
          type: "doughnut",
          labels: ["Private professionals", "Public enterprises", "Individuals"],
          datasets: [D("TND bn", [67.457, 16.598, 30.535], C.teal, { backgroundColor: [C.teal, C.gold, C.blue], borderWidth: 0 })],
        },
      ],
    },
    jobs: {
      title: "Jobs and welfare",
      note: "Labor-market health requires employment, unemployment, participation and inclusion to improve together.",
      health: [
        "National unemployment: below 10%; youth below 20%; graduates below 15% as TunStat policy references.",
        "Participation: above 55%, with the gender gap narrowing.",
        "Employment: sustained growth faster than the working-age population.",
        "Poverty: continuous decline under the national measure; the SDG direction is to halve national poverty.",
      ],
      source: "data/labour_2026q1.csv",
      charts: [
        {
          title: "Unemployment rates, Q1 2026",
          type: "bar",
          labels: ["National", "Women", "Graduates", "Youth"],
          datasets: [D("%", [15, 20.7, 24.2, 37.5], C.red)],
          yTitle: "%",
          benchmark: { value: 10, label: "National policy ref. <10%" },
        },
        {
          title: "Participation and women's employment share",
          type: "bar",
          labels: ["Participation", "Women share of employment"],
          datasets: [D("%", [45.9, 30.2], C.teal)],
          yTitle: "%",
        },
        {
          title: "Employment and unemployment levels",
          type: "bar",
          labels: ["Employed", "Unemployed"],
          datasets: [D("People (thousands)", [3626.3, 641.7], C.blue, { backgroundColor: [C.teal, C.red] })],
          yTitle: "Thousands of people",
        },
        {
          title: "Poverty outlook",
          type: "line",
          labels: ["2025 nowcast", "2026 forecast"],
          datasets: [D("Poverty rate (%)", [16, 15.7], C.gold, { fill: true })],
          yTitle: "%",
        },
      ],
    },
    water: {
      title: "Water security",
      note: "Dam filling is seasonal context, not a standalone national water-health threshold.",
      health: [
        "Dam filling: above its date-matched seasonal median with groundwater and demand also tracked.",
        "Potable-network physical losses: at or below 15% as an international operational reference.",
        "Public-irrigation losses: at or below 20% and falling.",
        "Drinking-water quality compliance: 100%; service interruptions should be declining and published.",
      ],
      source: "data/water_security.csv",
      charts: [
        {
          title: "Storage and physical losses",
          type: "bar",
          labels: ["Dam filling", "Potable losses", "Irrigation losses"],
          datasets: [D("%", [60, 23, 30], C.blue, { backgroundColor: [C.blue, C.gold, C.red] })],
          yTitle: "%",
        },
        {
          title: "Approved financing",
          type: "bar",
          labels: ["Potable water", "Irrigation"],
          datasets: [D("US$ million", [208.5, 124], C.teal)],
          yTitle: "US$ million",
        },
        {
          title: "Delivery scale",
          type: "bar",
          labels: ["Zarat now", "Zarat target", "Smart meters (thousands)"],
          datasets: [D("Capacity / units", [50, 100, 100], C.teal)],
          yTitle: "Thousand m³/day or thousand meters",
        },
      ],
    },
    energy: {
      title: "Energy security",
      note: "Reliability cannot be assessed fully until reserve margin, forced outages and interruption duration are published.",
      health: [
        "Energy independence: at least 50% and rising.",
        "Renewable electricity: on track for the official TEREG target of 27% by 2028.",
        "Gas share: below 60% with diversified supply and adequate flexibility.",
        "Transmission and distribution losses: below 10%; collection at least 98%.",
      ],
      source: "data/energy_may_2026.csv",
      charts: [
        {
          title: "Energy independence",
          type: "bar",
          labels: ["Jan–May 2025", "Jan–May 2026"],
          datasets: [D("%", [39, 34], C.red)],
          yTitle: "%",
          benchmark: { value: 50, label: "Policy ref. ≥50%" },
        },
        {
          title: "Domestic electricity production mix",
          type: "doughnut",
          labels: ["Gas", "Solar", "Wind", "Hydro"],
          datasets: [D("%", [91, 8.18, 0.8, 0.04], C.red, { backgroundColor: [C.red, C.gold, C.teal, C.blue], borderWidth: 0 })],
        },
        {
          title: "Energy trade deficit",
          type: "bar",
          labels: ["Jan–May 2025", "Jan–May 2026"],
          datasets: [D("TND bn", [4.368, 5.767], C.red)],
          yTitle: "TND billion",
        },
      ],
    },
    budget: {
      title: "Budget expenses, 2025",
      note: "Healthy composition protects essential services while shifting room toward maintenance and high-return investment.",
      health: [
        "Direct investment: at least 15% of primary spending and execution above 85%.",
        "Interest: below 10% of revenue and declining.",
        "Wages: stable or declining as a share of revenue through productivity, not abrupt service cuts.",
        "Transfers: targeted, transparent and assessed alongside household protection.",
      ],
      source: "data/budget_expenses_2025.csv",
      charts: [
        {
          title: "Expense composition",
          type: "bar",
          indexAxis: "y",
          labels: ["Wages", "Transfers", "Interest", "Investment", "Goods/services", "Financial"],
          datasets: [D("TND bn", [23.2811, 20.1517, 6.4585, 5.7295, 2.8086, 0.0412], C.red, { backgroundColor: [C.red, C.gold, C.rose, C.teal, C.blue, C.slate] })],
          xTitle: "TND billion",
        },
      ],
    },
    debt: {
      title: "Debt stock and service, 2025",
      note: "Debt health depends on the ratio to GDP, maturity, currency, rate and ability to fund essential spending—not the stock alone.",
      health: [
        "Public debt: clearly declining; below 70% of GDP is TunStat’s 2035 policy anchor.",
        "Debt service: below 20% of revenue with a smooth maturity profile.",
        "External debt service: below 15% of current external receipts; 15–20% is watch.",
      ],
      source: "data/public_debt_2025.csv",
      charts: [
        {
          title: "Debt stock",
          type: "doughnut",
          labels: ["Domestic", "External"],
          datasets: [D("TND bn", [86.178, 55.487], C.red, { backgroundColor: [C.red, C.blue], borderWidth: 0 })],
        },
        {
          title: "Debt service",
          type: "bar",
          labels: ["Domestic principal", "External principal", "Domestic interest", "External interest"],
          datasets: [D("TND bn", [9.6743, 8.3087, 4.6799, 1.7786], C.gold, { backgroundColor: [C.red, C.blue, C.rose, C.teal] })],
          yTitle: "TND billion",
        },
      ],
    },
    subsidies: {
      title: "Subsidies, 2025",
      note: "There is no healthy absolute subsidy number. Health means transparent, targeted support that declines only after reliable compensation reaches vulnerable households.",
      health: ["Generalized subsidies: fall as a share of GDP only after targeted transfers, service reliability and poverty safeguards are verified."],
      source: "data/subsidies_2025.csv",
      charts: [
        {
          title: "Executed subsidy composition",
          type: "doughnut",
          labels: ["Fuel", "Basic goods", "Transport"],
          datasets: [D("TND bn", [7.112, 3.801, 0.68], C.red, { backgroundColor: [C.red, C.gold, C.blue], borderWidth: 0 })],
        },
      ],
    },
    "investment-overview": {
      title: "Investment pipeline, 2025",
      note: "Declared projects and recorded international investment are separate concepts and are never added together.",
      health: [
        "Declared investment: context only until implementation can be verified.",
        "Recorded international investment: positive real growth and at least 2% of GDP over time.",
        "Project conversion: at least 60% of a comparable declared cohort operational within 36 months.",
      ],
      source: "data/investment_2025.csv",
      charts: [
        {
          title: "Recorded international investment",
          type: "bar",
          labels: ["2025"],
          datasets: [D("TND bn", [3.5721], C.green)],
          yTitle: "TND billion",
        },
        {
          title: "Declared investment by sector",
          type: "doughnut",
          labels: ["Industry", "Services", "Renewables", "Other"],
          datasets: [D("TND bn", [2.9247, 1.7554, 1.6851, 1.9912], C.teal, { backgroundColor: [C.teal, C.blue, C.gold, C.slate], borderWidth: 0 })],
        },
        {
          title: "Recorded FDI sector shares",
          type: "bar",
          labels: ["Manufacturing", "Services", "Energy", "Agriculture"],
          datasets: [D("%", [62.6, 18.8, 16.3, 2.4], C.blue)],
          yTitle: "%",
        },
      ],
    },
    "investment-execution": {
      title: "Investment execution",
      note: "2026 GFCF is a forecast and Q1 2026 FDI is not directly comparable with full-year observations.",
      health: [
        "Investment rate: above 20% of GDP in the medium term; 25% is a convergence comparison.",
        "Real GFCF: positive and faster than GDP for several years.",
        "Public capital execution: at least 85%, with procurement and completion milestones published.",
        "FDI: at least 2% of GDP with sector and regional diversification.",
      ],
      source: "data/investment_execution.csv",
      charts: [
        {
          title: "Gross fixed capital formation",
          type: "line",
          labels: ["2024", "2025", "2026f"],
          datasets: [D("TND bn", [24.302, 26.76, 29.979], C.teal, { fill: true })],
          yTitle: "TND billion",
        },
        {
          title: "Investment rate",
          type: "bar",
          labels: ["2024", "2025", "2026f"],
          datasets: [D("% of GDP", [15.2, 15.5, 16], C.red)],
          yTitle: "% of GDP",
          benchmark: { value: 20, label: "Medium-term ref. ≥20%" },
        },
        {
          title: "2025 GFCF by sector",
          type: "doughnut",
          labels: ["Agriculture", "Industry", "Services", "Collective"],
          datasets: [D("TND bn", [1.307, 7.378, 13.685, 4.39], C.blue, { backgroundColor: [C.gold, C.teal, C.blue, C.slate], borderWidth: 0 })],
        },
        {
          title: "Recorded FDI (periods differ)",
          type: "bar",
          labels: ["2024", "2025", "Q1 2026"],
          datasets: [D("TND bn", [2.6954, 3.5065, 0.8244], C.green)],
          yTitle: "TND billion",
        },
      ],
    },
  };

  function palette() {
    const dark = document.documentElement.classList.contains("dark");
    return {
      text: dark ? "#e7e5e4" : "#44403c",
      muted: dark ? "#a8a29e" : "#78716c",
      grid: dark ? "rgba(255,255,255,.09)" : "rgba(120,113,108,.16)",
    };
  }

  function optionsFor(spec) {
    const p = palette();
    const radial = spec.type === "doughnut" || spec.type === "pie";
    const compact = matchMedia("(max-width: 639px)").matches;
    const rtl = document.documentElement.dir === "rtl";
    const locale = window.tunstatLanguage?.() === "tn" ? "ar-TN" : window.tunstatLanguage?.() === "fr" ? "fr-FR" : "en-US";
    const tickOptions = {
      color: p.muted,
      autoSkip: true,
      maxTicksLimit: compact ? 5 : 9,
      maxRotation: compact ? 0 : 45,
      minRotation: 0,
    };
    return {
      responsive: true,
      locale,
      maintainAspectRatio: false,
      resizeDelay: 80,
      animation: reducedMotion ? false : { duration: 500 },
      indexAxis: spec.indexAxis || "x",
      layout: { padding: compact ? 0 : 4 },
      interaction: { mode: radial ? "nearest" : "index", intersect: false },
      plugins: {
        legend: {
          position: "bottom",
          rtl,
          textDirection: rtl ? "rtl" : "ltr",
          labels: {
            color: p.text,
            usePointStyle: true,
            boxWidth: 8,
            padding: compact ? 10 : 16,
            font: { size: compact ? 10 : 12 },
          },
        },
        tooltip: {
          enabled: true,
          rtl,
          textDirection: rtl ? "rtl" : "ltr",
          backgroundColor: document.documentElement.classList.contains("dark") ? "#111a17" : "#1c1917",
          padding: 12,
          callbacks: {
            label(context) {
              const value = context.parsed.y ?? context.parsed.x ?? context.parsed;
              return `${context.dataset.label}: ${Number(value).toLocaleString(locale, { maximumFractionDigits: 2 })}`;
            },
          },
        },
        benchmarkLine: spec.benchmark || false,
      },
      scales: radial
        ? undefined
        : {
            x: {
              stacked: Boolean(spec.stacked),
              grid: { color: spec.indexAxis === "y" ? p.grid : "transparent" },
              ticks: tickOptions,
              title: { display: Boolean(spec.xTitle), text: spec.xTitle, color: p.muted },
            },
            y: {
              stacked: Boolean(spec.stacked),
              beginAtZero: true,
              grid: { color: p.grid },
              ticks: tickOptions,
              title: { display: Boolean(spec.yTitle), text: spec.yTitle, color: p.muted },
            },
          },
    };
  }

  function dataTable(spec) {
    const head = spec.datasets.map((dataset) => `<th scope="col">${dataset.label}</th>`).join("");
    const rows = spec.labels
      .map((label, index) => `<tr><th scope="row">${label}</th>${spec.datasets.map((dataset) => `<td>${dataset.data[index] ?? "—"}</td>`).join("")}</tr>`)
      .join("");
    return `<details class="chart-data-table"><summary class="cursor-pointer px-3 py-3 text-xs font-bold">View exact chart data</summary><table><thead><tr><th scope="col">Period / category</th>${head}</tr></thead><tbody>${rows}</tbody></table></details>`;
  }

  function renderCharts() {
    charts.splice(0).forEach((chart) => chart.destroy());
    const translate = window.tunstatTranslate || ((value) => value);
    document.querySelectorAll("[data-chart-group]").forEach((host) => {
      const group = chartGroups[host.dataset.chartGroup];
      if (!group) return;
      host.innerHTML = `
        <div class="min-w-0 max-w-full p-3 sm:p-4">
          <div class="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
            <div><h3 class="text-xl font-black text-ink dark:text-white">${translate(group.title)}</h3><p class="mt-2 max-w-3xl text-xs leading-5 text-stone-500 dark:text-stone-400">${translate(group.note)}</p></div>
            <a class="shrink-0 text-xs font-bold text-tunis-red hover:underline" href="./${group.source}">${translate("CSV data ↓")}</a>
          </div>
          <div class="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-800 dark:bg-emerald-950/60">
            <p class="text-xs font-black tracking-wider text-emerald-800 uppercase dark:text-emerald-200">${translate("Healthy means")}</p>
            <ul class="mt-2 space-y-1 text-xs leading-5 text-emerald-950 dark:text-emerald-50">${group.health.map((item) => `<li>• ${translate(item)}</li>`).join("")}</ul>
          </div>
          <div class="mt-4 grid min-w-0 max-w-full gap-4 ${group.charts.length > 1 ? "lg:grid-cols-2" : ""}" data-chart-cards></div>
        </div>`;
      const cards = host.querySelector("[data-chart-cards]");
      group.charts.forEach((spec, index) => {
        const localizedSpec = {
          ...spec,
          title: translate(spec.title),
          labels: spec.labels.map(translate),
          datasets: spec.datasets.map((dataset) => ({ ...dataset, label: translate(dataset.label) })),
          xTitle: spec.xTitle ? translate(spec.xTitle) : spec.xTitle,
          yTitle: spec.yTitle ? translate(spec.yTitle) : spec.yTitle,
          benchmark: spec.benchmark ? { ...spec.benchmark, label: translate(spec.benchmark.label) } : spec.benchmark,
        };
        const card = document.createElement("section");
        card.className = "chart-panel";
        const canvasId = `chart-${host.dataset.chartGroup}-${index}`;
        card.innerHTML = `<h4 class="text-sm font-black text-stone-800 dark:text-stone-100">${localizedSpec.title}</h4><div class="chart-canvas-wrap"><canvas id="${canvasId}" role="img" aria-label="${translate(group.title)}: ${localizedSpec.title}"></canvas></div>${dataTable(localizedSpec)}`;
        cards.append(card);
        charts.push(
          new Chart(card.querySelector("canvas"), {
            type: localizedSpec.type,
            data: { labels: localizedSpec.labels, datasets: localizedSpec.datasets },
            options: optionsFor(localizedSpec),
          }),
        );
      });
    });
  }

  function parseCSV(text) {
    const rows = [];
    let row = [];
    let field = "";
    let quoted = false;
    for (let i = 0; i < text.length; i += 1) {
      const char = text[i];
      if (quoted) {
        if (char === '"' && text[i + 1] === '"') {
          field += '"';
          i += 1;
        } else if (char === '"') quoted = false;
        else field += char;
      } else if (char === '"') quoted = true;
      else if (char === ",") {
        row.push(field);
        field = "";
      } else if (char === "\n") {
        row.push(field.replace(/\r$/, ""));
        rows.push(row);
        row = [];
        field = "";
      } else field += char;
    }
    if (field || row.length) {
      row.push(field);
      rows.push(row);
    }
    const headers = rows.shift();
    return rows.filter((item) => item.length === headers.length).map((item) => Object.fromEntries(headers.map((header, index) => [header, item[index]])));
  }

  const statusClasses = {
    healthy: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300",
    watch: "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300",
    stress: "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300",
    gap: "bg-stone-200 text-stone-700 dark:bg-white/10 dark:text-stone-300",
    context: "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300",
  };

  function textNode(tag, className, value) {
    const node = document.createElement(tag);
    node.className = className;
    node.textContent = value;
    return node;
  }

  async function renderHealthRegistry() {
    const registry = document.querySelector("[data-health-registry]");
    if (!registry) return;
    const count = document.querySelector("[data-health-count]");
    const translate = window.tunstatTranslate || ((value) => value);
    try {
      const response = await fetch("./data/metric_health_reference.csv");
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const records = parseCSV(await response.text());
      const search = document.querySelector("[data-health-search]");
      const domain = document.querySelector("[data-health-domain]");
      const summary = document.querySelector("[data-health-summary]");
      [...new Set(records.map((record) => record.domain))].sort().forEach((value) => {
        const option = document.createElement("option");
        option.value = value;
        option.textContent = translate(value);
        domain.append(option);
      });

      const render = () => {
        const query = search.value.trim().toLowerCase();
        const selectedDomain = domain.value;
        const visible = records.filter((record) => {
          const matchesDomain = !selectedDomain || record.domain === selectedDomain;
          const matchesSearch = !query || Object.values(record).join(" ").toLowerCase().includes(query);
          return matchesDomain && matchesSearch;
        });
        count.textContent = `${visible.length} ${translate("of")} ${records.length} ${translate("metric references shown")}`;
        registry.replaceChildren();
        visible.forEach((record) => {
          const card = document.createElement("article");
          card.className = "health-row";
          const top = document.createElement("div");
          top.className = "flex flex-col justify-between gap-3 sm:flex-row sm:items-start";
          const title = document.createElement("div");
          title.append(textNode("p", "text-xs font-bold tracking-wider text-tunis-red uppercase", translate(record.domain)));
          title.append(textNode("h3", "mt-1 text-lg font-black text-ink dark:text-white", translate(record.metric)));
          const badge = textNode("span", `health-status ${statusClasses[record.assessment] || statusClasses.context}`, translate(record.assessment));
          top.append(title, badge);
          card.append(top);

          const grid = document.createElement("div");
          grid.className = "mt-4 grid gap-4 lg:grid-cols-3";
          [
            ["Healthy means", translate(record.healthy_meaning)],
            ["Watch or stress", translate(record.watch_or_stress)],
            ["Current reading", translate(record.current_reading)],
          ].forEach(([label, value]) => {
            const cell = document.createElement("div");
            cell.append(textNode("p", "text-[10px] font-black tracking-wider text-stone-500 uppercase dark:text-stone-400", label));
            cell.append(textNode("p", "mt-1 text-sm leading-6 text-stone-700 dark:text-stone-200", value));
            grid.append(cell);
          });
          card.append(grid);

          const meta = document.createElement("div");
          meta.className = "mt-4 flex flex-col gap-2 border-t border-stone-200 pt-4 text-xs text-stone-500 sm:flex-row sm:items-center sm:justify-between dark:border-white/10 dark:text-stone-400";
          meta.append(textNode("span", "font-semibold", translate(record.benchmark_type)));
          const link = document.createElement("a");
          link.className = "font-bold text-tunis-red hover:underline";
          link.href = record.source_url;
          link.target = "_blank";
          link.rel = "noreferrer";
          link.textContent = `${translate(record.source_label)} ↗`;
          meta.append(link);
          card.append(meta);
          registry.append(card);
        });
      };

      const totals = ["healthy", "watch", "stress", "gap", "context"].map((status) => [status, records.filter((record) => record.assessment === status).length]);
      summary.replaceChildren(
        ...totals.map(([status, total]) => {
          const item = document.createElement("div");
          item.className = "rounded-xl border border-stone-200 p-3 dark:border-white/10";
          item.append(textNode("span", `health-status ${statusClasses[status]}`, status));
          item.append(textNode("p", "mt-2 text-2xl font-black text-ink dark:text-white", total));
          return item;
        }),
      );
      search.addEventListener("input", render);
      domain.addEventListener("change", render);
      render();
    } catch (error) {
      count.textContent = translate("The metric registry could not be loaded.");
      registry.innerHTML = `<p class="panel p-6 text-sm text-red-700 dark:text-red-300">${translate("Use the CSV download above to access every health definition.")}</p>`;
    }
  }

  renderCharts();
  renderHealthRegistry();
  document.documentElement.addEventListener("tunstat:theme", renderCharts);
  document.documentElement.addEventListener("tunstat:language", renderCharts);
})();
