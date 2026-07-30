(() => {
  "use strict";

  const state = {
    regional: [],
    macro: [],
    projects: [],
    peers: [],
    budget: [],
    debt: [],
    revisions: [],
    charts: {},
    map: null,
    mapLayer: null,
    markers: [],
  };

  const colors = {
    red: "#e70013",
    teal: "#087e8b",
    gold: "#f18f01",
    blue: "#2563eb",
    green: "#059669",
    purple: "#7c3aed",
    slate: "#64748b",
    rose: "#be123c",
  };

  const countryColors = { Tunisia: colors.red, Morocco: colors.teal, Jordan: colors.blue, Egypt: colors.gold };

  function t(value) {
    return window.tunstatTranslate?.(value) || value;
  }

  function locale() {
    const language = window.tunstatLanguage?.();
    return language === "tn" ? "ar-TN" : language === "fr" ? "fr-FR" : "en-US";
  }

  function number(value, digits = 1) {
    if (value === "" || value === null || value === undefined) return "—";
    const numeric = Number(value);
    return Number.isFinite(numeric) ? numeric.toLocaleString(locale(), { maximumFractionDigits: digits }) : "—";
  }

  function numeric(value) {
    return value === "" || value === null || value === undefined ? Number.NaN : Number(value);
  }

  function escapeHtml(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function parseCSV(text) {
    const rows = [];
    let row = [];
    let field = "";
    let quoted = false;
    for (let index = 0; index < text.length; index += 1) {
      const character = text[index];
      if (quoted) {
        if (character === '"' && text[index + 1] === '"') {
          field += '"';
          index += 1;
        } else if (character === '"') quoted = false;
        else field += character;
      } else if (character === '"') quoted = true;
      else if (character === ",") {
        row.push(field);
        field = "";
      } else if (character === "\n") {
        row.push(field.replace(/\r$/, ""));
        rows.push(row);
        row = [];
        field = "";
      } else field += character;
    }
    if (field || row.length) {
      row.push(field);
      rows.push(row);
    }
    const headers = rows.shift();
    return rows
      .filter((item) => item.length === headers.length)
      .map((item) => Object.fromEntries(headers.map((header, index) => [header, item[index]])));
  }

  async function loadCSV(path) {
    const response = await fetch(path);
    if (!response.ok) throw new Error(`${path}: HTTP ${response.status}`);
    return parseCSV(await response.text());
  }

  function chartTheme() {
    const dark = document.documentElement.classList.contains("dark");
    return {
      text: dark ? "#e7e5e4" : "#44403c",
      muted: dark ? "#a8a29e" : "#78716c",
      grid: dark ? "rgba(255,255,255,.09)" : "rgba(120,113,108,.16)",
      tooltip: dark ? "#111a17" : "#1c1917",
      rtl: document.documentElement.dir === "rtl",
    };
  }

  function commonOptions(extra = {}) {
    const theme = chartTheme();
    return {
      responsive: true,
      maintainAspectRatio: false,
      locale: locale(),
      resizeDelay: 80,
      animation: matchMedia("(prefers-reduced-motion: reduce)").matches ? false : { duration: 400 },
      interaction: { mode: "index", intersect: false },
      plugins: {
        legend: {
          position: "bottom",
          rtl: theme.rtl,
          textDirection: theme.rtl ? "rtl" : "ltr",
          labels: { color: theme.text, usePointStyle: true, boxWidth: 8, padding: 14 },
        },
        tooltip: {
          backgroundColor: theme.tooltip,
          rtl: theme.rtl,
          textDirection: theme.rtl ? "rtl" : "ltr",
          padding: 12,
        },
      },
      scales: {
        x: { grid: { display: false }, ticks: { color: theme.muted, maxRotation: 0 } },
        y: { beginAtZero: true, grid: { color: theme.grid }, ticks: { color: theme.muted } },
      },
      ...extra,
    };
  }

  function replaceChart(name, canvas, config) {
    state.charts[name]?.destroy();
    state.charts[name] = new Chart(canvas, config);
  }

  function syncSelect(select, items, fallbackValue = "") {
    const selectedValue = select.value;
    const availableValues = items.map((item) => String(item.value));
    select.innerHTML = items
      .map((item) => `<option value="${escapeHtml(item.value)}">${escapeHtml(t(item.label))}</option>`)
      .join("");
    select.value = availableValues.includes(selectedValue) ? selectedValue : fallbackValue;
    if (!availableValues.includes(select.value) && availableValues.length) select.value = availableValues[0];
  }

  function metricColor(value, min, max) {
    if (!Number.isFinite(value)) return "#a8a29e";
    const ratio = max === min ? 0.5 : (value - min) / (max - min);
    if (ratio < 0.33) return colors.green;
    if (ratio < 0.66) return colors.gold;
    return colors.red;
  }

  function initRegionalMap() {
    const host = document.querySelector("#regional-map");
    if (!host || state.map || !window.L) return;
    state.map = L.map(host, { scrollWheelZoom: false, minZoom: 5, maxZoom: 9 }).setView([34.45, 9.55], 6);
    state.mapLayer = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(state.map);
  }

  function renderRegions() {
    const selector = document.querySelector("[data-region-metric]");
    const list = document.querySelector("[data-region-list]");
    const note = document.querySelector("[data-region-note]");
    if (!selector || !list || !note) return;
    initRegionalMap();
    syncSelect(
      selector,
      [
        { value: "youth_unemployment_percent", label: "Youth unemployment" },
        { value: "declared_investment_mdt", label: "Declared investment" },
      ],
      "youth_unemployment_percent",
    );
    const metric = selector.value;
    const isInvestment = metric === "declared_investment_mdt";
    const values = state.regional.map((record) => numeric(record[metric])).filter(Number.isFinite);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const unit = isInvestment ? t("TND million") : "%";
    const period = isInvestment ? t("January–September 2025; only the published top ten are populated.") : t("2014 census youth unemployment; use as a structural baseline, not a current rate.");

    state.markers.forEach((marker) => marker.remove());
    state.markers = [];
    if (state.map) {
      state.regional.forEach((record) => {
        const value = numeric(record[metric]);
        const valid = Number.isFinite(value);
        const marker = L.circleMarker([Number(record.latitude), Number(record.longitude)], {
          radius: valid ? 7 + ((value - min) / Math.max(max - min, 1)) * 8 : 6,
          color: "#fff",
          weight: 1.5,
          fillColor: metricColor(value, min, max),
          fillOpacity: valid ? 0.9 : 0.45,
        }).addTo(state.map);
        marker.bindPopup(`<strong>${escapeHtml(t(record.governorate))}</strong><br>${escapeHtml(valid ? `${number(value)} ${unit}` : t("Not published in the reviewed dataset"))}<br><small>${escapeHtml(period)}</small>`);
        state.markers.push(marker);
      });
    }

    const sorted = [...state.regional].sort((a, b) => {
      const aValue = numeric(a[metric]);
      const bValue = numeric(b[metric]);
      if (!Number.isFinite(aValue)) return 1;
      if (!Number.isFinite(bValue)) return -1;
      return bValue - aValue;
    });
    list.innerHTML = sorted
      .map((record, index) => {
        const value = numeric(record[metric]);
        const valid = Number.isFinite(value);
        return `<button type="button" class="flex w-full items-center gap-3 border-b border-stone-200 px-2 py-3 text-start last:border-0 dark:border-white/10" data-region-focus="${escapeHtml(record.governorate)}">
          <span class="grid size-7 shrink-0 place-items-center rounded-full text-xs font-black text-white" style="background:${metricColor(value, min, max)}">${valid ? index + 1 : "—"}</span>
          <span class="min-w-0 flex-1"><span class="block truncate font-bold">${escapeHtml(t(record.governorate))}</span><span class="block text-xs text-stone-500 dark:text-stone-400">${escapeHtml(t(record.region_group))}</span></span>
          <span class="text-sm font-black">${valid ? `${number(value)} ${unit}` : t("Missing")}</span>
        </button>`;
      })
      .join("");
    list.querySelectorAll("[data-region-focus]").forEach((button) => {
      button.addEventListener("click", () => {
        const index = state.regional.findIndex((record) => record.governorate === button.dataset.regionFocus);
        const record = state.regional[index];
        if (state.map && record) {
          state.map.flyTo([Number(record.latitude), Number(record.longitude)], 8);
          state.markers[index]?.openPopup();
        }
      });
    });
    note.textContent = `${period} ${t("Missing values are preserved as missing and are not zero.")}`;
  }

  function macroSeries() {
    return state.macro.map((row) => ({
      metric: row.indicator,
      unit: row.unit,
      source: row.source,
      values: ["2023", "2024", "2025", "2026", "2027", "2028"].map((year) => ({ year, value: Number(row[year]), status: Number(year) >= 2026 ? "forecast" : "historical" })),
    }));
  }

  function renderTrends() {
    const selector = document.querySelector("[data-trend-metric]");
    const canvas = document.querySelector("[data-trend-chart]");
    const table = document.querySelector("[data-trend-table]");
    if (!selector || !canvas || !table) return;
    const series = macroSeries();
    syncSelect(
      selector,
      series.map((item) => ({ value: item.metric, label: item.metric })),
      series[0]?.metric,
    );
    const active = series.find((item) => item.metric === selector.value) || series[0];
    const actual = active.values.map((item) => (item.status === "historical" ? item.value : null));
    const forecast = active.values.map((item, index) => (item.status === "forecast" || index === 2 ? item.value : null));
    replaceChart("trend", canvas, {
      type: "line",
      data: {
        labels: active.values.map((item) => item.year),
        datasets: [
          { label: t("Historical / estimate"), data: actual, borderColor: colors.teal, backgroundColor: `${colors.teal}22`, pointRadius: 4, borderWidth: 3, tension: 0.25 },
          { label: t("Forecast"), data: forecast, borderColor: colors.gold, backgroundColor: `${colors.gold}22`, pointRadius: 4, borderWidth: 3, borderDash: [7, 5], tension: 0.25 },
        ],
      },
      options: commonOptions({ scales: { x: { grid: { display: false }, ticks: { color: chartTheme().muted } }, y: { grid: { color: chartTheme().grid }, ticks: { color: chartTheme().muted }, title: { display: true, text: t(active.unit), color: chartTheme().muted } } } }),
    });
    table.innerHTML = `<div class="chart-data-table"><table><thead><tr><th>${t("Year")}</th><th>${t("Value")}</th><th>${t("Status")}</th></tr></thead><tbody>${active.values
      .map((item) => `<tr><th>${item.year}</th><td>${number(item.value, 2)} ${escapeHtml(t(active.unit))}</td><td>${escapeHtml(t(item.status))}</td></tr>`)
      .join("")}</tbody></table></div><p class="mt-3 px-2 text-xs text-stone-500 dark:text-stone-400">${escapeHtml(active.source)}</p>`;
  }

  function renderProjects() {
    const search = document.querySelector("[data-project-search]");
    const sector = document.querySelector("[data-project-sector]");
    const stage = document.querySelector("[data-project-stage]");
    const grid = document.querySelector("[data-project-grid]");
    const count = document.querySelector("[data-project-count]");
    if (!search || !sector || !stage || !grid || !count) return;
    syncSelect(sector, [
      { value: "", label: "All sectors" },
      ...[...new Set(state.projects.map((record) => record.sector))].sort().map((value) => ({ value, label: value })),
    ]);
    syncSelect(stage, [
      { value: "", label: "All stages" },
      ...[...new Set(state.projects.map((record) => record.stage))].sort().map((value) => ({ value, label: value })),
    ]);
    const query = search.value.trim().toLowerCase();
    const visible = state.projects.filter((record) => {
      const matchesQuery = !query || Object.values(record).join(" ").toLowerCase().includes(query);
      return matchesQuery && (!sector.value || record.sector === sector.value) && (!stage.value || record.stage === stage.value);
    });
    count.textContent = `${visible.length} ${t("of")} ${state.projects.length} ${t("projects shown")}`;
    grid.innerHTML = visible
      .map((record) => `<article class="panel min-w-0 p-6">
        <div class="flex flex-col justify-between gap-3 sm:flex-row sm:items-start"><div><p class="text-xs font-black tracking-wider text-tunis-red uppercase">${escapeHtml(t(record.sector))} · ${escapeHtml(t(record.region))}</p><h3 class="mt-2 text-2xl font-black">${escapeHtml(t(record.project))}</h3></div><span class="status-pill shrink-0">${escapeHtml(t(record.stage))}</span></div>
        <p class="mt-4 text-sm leading-6 text-stone-600 dark:text-stone-300">${escapeHtml(t(record.scale_or_cost))}</p>
        <div class="mt-5"><div class="flex justify-between text-xs font-bold"><span>${t("Administrative stage")}</span><span>${record.stage_score}/100</span></div><div class="mt-2 h-2 overflow-hidden rounded-full bg-stone-200 dark:bg-white/10"><div class="h-full rounded-full bg-sea" style="width:${Number(record.stage_score)}%"></div></div><p class="mt-2 text-[11px] text-stone-500 dark:text-stone-400">${escapeHtml(t(record.score_definition))}</p></div>
        <div class="mt-5 rounded-2xl bg-stone-100 p-4 dark:bg-white/5"><p class="text-[10px] font-black tracking-wider text-stone-500 uppercase">${t("Next public milestone")}</p><p class="mt-2 text-sm leading-6">${escapeHtml(t(record.next_public_milestone))}</p></div>
        <div class="mt-5 flex items-center justify-between gap-4 text-xs text-stone-500 dark:text-stone-400"><span>${escapeHtml(record.evidence_date)}</span><a class="font-bold text-tunis-red hover:underline" href="${escapeHtml(record.source_url)}" target="_blank" rel="noreferrer">${t("Source")} ↗</a></div>
      </article>`)
      .join("");
  }

  function normalizedMetric(metric) {
    if (/debt/i.test(metric) && !/interest/i.test(metric)) return "Public debt";
    if (/FDI|foreign direct investment/i.test(metric)) return "FDI";
    return metric;
  }

  function renderPeers() {
    const selector = document.querySelector("[data-peer-metric]");
    const canvas = document.querySelector("[data-peer-chart]");
    const notes = document.querySelector("[data-peer-notes]");
    if (!selector || !canvas || !notes) return;
    const metrics = [...new Set(state.peers.map((record) => normalizedMetric(record.metric)))].sort();
    syncSelect(
      selector,
      metrics.map((metric) => ({ value: metric, label: metric })),
      metrics[0],
    );
    const active = selector.value || metrics[0];
    const rows = state.peers.filter((record) => normalizedMetric(record.metric) === active);
    replaceChart("peer", canvas, {
      type: "bar",
      data: {
        labels: rows.map((record) => t(record.country)),
        datasets: [{ label: t(active), data: rows.map((record) => numeric(record.value)), backgroundColor: rows.map((record) => countryColors[record.country] || colors.slate), borderRadius: 7 }],
      },
      options: commonOptions({ plugins: { ...commonOptions().plugins, legend: { display: false }, tooltip: commonOptions().plugins.tooltip }, scales: { x: { grid: { display: false }, ticks: { color: chartTheme().muted } }, y: { beginAtZero: true, grid: { color: chartTheme().grid }, ticks: { color: chartTheme().muted }, title: { display: true, text: t(rows[0]?.unit || ""), color: chartTheme().muted } } } }),
    });
    notes.innerHTML = rows
      .map((record) => `<article class="rounded-2xl border border-stone-200 p-4 dark:border-white/10"><div class="flex items-center justify-between gap-3"><h4 class="font-black">${escapeHtml(t(record.country))}</h4><strong>${number(record.value, 2)} ${escapeHtml(t(record.unit))}</strong></div><p class="mt-2 text-xs font-bold text-stone-500 dark:text-stone-400">${escapeHtml(t(record.period))}</p><p class="mt-2 text-sm leading-6 text-stone-600 dark:text-stone-300">${escapeHtml(t(record.definition_note))}</p><a class="mt-3 inline-block text-xs font-bold text-tunis-red hover:underline" href="${escapeHtml(record.source_url)}" target="_blank" rel="noreferrer">${t("Source")} ↗</a></article>`)
      .join("");
  }

  function renderBudget() {
    const yearSelect = document.querySelector("[data-budget-year]");
    const categorySelect = document.querySelector("[data-budget-category]");
    const compositionCanvas = document.querySelector("[data-budget-composition]");
    const trendCanvas = document.querySelector("[data-budget-trend]");
    const table = document.querySelector("[data-budget-table]");
    if (!yearSelect || !categorySelect || !compositionCanvas || !trendCanvas || !table) return;
    const years = [...new Set(state.budget.map((record) => record.year))].sort();
    const categories = [...new Set(state.budget.map((record) => record.category))];
    syncSelect(
      yearSelect,
      years.map((year) => ({ value: year, label: year })),
      years.at(-1),
    );
    syncSelect(
      categorySelect,
      categories.map((category) => ({ value: category, label: category })),
      categories[0],
    );
    const compositionCategories = ["Wages", "Goods and services", "Transfers and interventions", "Capital expenditure", "Interest"];
    const yearRows = state.budget.filter((record) => record.year === yearSelect.value && compositionCategories.includes(record.category));
    replaceChart("budgetComposition", compositionCanvas, {
      type: "doughnut",
      data: { labels: yearRows.map((record) => t(record.category)), datasets: [{ data: yearRows.map((record) => Number(record.tnd_million) / 1000), backgroundColor: [colors.red, colors.blue, colors.gold, colors.green, colors.purple], borderWidth: 0 }] },
      options: commonOptions({ scales: undefined }),
    });
    const trendRows = state.budget.filter((record) => record.category === categorySelect.value).sort((a, b) => a.year.localeCompare(b.year));
    replaceChart("budgetTrend", trendCanvas, {
      type: "line",
      data: { labels: trendRows.map((record) => record.year), datasets: [{ label: t(categorySelect.value), data: trendRows.map((record) => Number(record.tnd_million) / 1000), borderColor: colors.teal, backgroundColor: `${colors.teal}22`, fill: true, tension: 0.25, pointRadius: 4, borderWidth: 3 }] },
      options: commonOptions({ scales: { x: { grid: { display: false }, ticks: { color: chartTheme().muted } }, y: { beginAtZero: true, grid: { color: chartTheme().grid }, ticks: { color: chartTheme().muted }, title: { display: true, text: t("TND billion"), color: chartTheme().muted } } } }),
    });
    const total = yearRows.reduce((sum, record) => sum + Number(record.tnd_million), 0);
    table.innerHTML = `<div class="chart-data-table mt-0"><table><thead><tr><th>${t("Category")}</th><th>${t("TND billion")}</th><th>${t("Share")}</th><th>${t("Status")}</th></tr></thead><tbody>${yearRows
      .map((record) => `<tr><th>${escapeHtml(t(record.category))}</th><td>${number(Number(record.tnd_million) / 1000, 2)}</td><td>${number((Number(record.tnd_million) / total) * 100)}%</td><td>${escapeHtml(t(record.status))}</td></tr>`)
      .join("")}</tbody></table></div>`;
  }

  function renderDebt() {
    const canvas = document.querySelector("[data-debt-chart]");
    const table = document.querySelector("[data-debt-table]");
    if (!canvas || !table) return;
    replaceChart("debt", canvas, {
      type: "bar",
      data: {
        labels: state.debt.map((record) => record.year),
        datasets: [
          { label: t("Principal"), data: state.debt.map((record) => Number(record.principal_tnd_billion)), backgroundColor: colors.teal, borderRadius: 5 },
          { label: t("Interest"), data: state.debt.map((record) => Number(record.interest_tnd_billion)), backgroundColor: colors.gold, borderRadius: 5 },
        ],
      },
      options: commonOptions({ scales: { x: { stacked: true, grid: { display: false }, ticks: { color: chartTheme().muted } }, y: { stacked: true, beginAtZero: true, grid: { color: chartTheme().grid }, ticks: { color: chartTheme().muted }, title: { display: true, text: t("TND billion"), color: chartTheme().muted } } } }),
    });
    table.innerHTML = `<div class="chart-data-table"><table><thead><tr><th>${t("Year")}</th><th>${t("Principal")}</th><th>${t("Interest")}</th><th>${t("Total service")}</th><th>${t("Domestic")}</th><th>${t("External")}</th><th>${t("Status")}</th></tr></thead><tbody>${state.debt
      .map((record) => `<tr><th>${record.year}</th><td>${number(record.principal_tnd_billion, 3)}</td><td>${number(record.interest_tnd_billion, 3)}</td><td>${number(record.total_service_tnd_billion, 3)}</td><td>${number(record.domestic_service_tnd_billion, 3)}</td><td>${number(record.external_service_tnd_billion, 3)}</td><td>${escapeHtml(t(record.status))}</td></tr>`)
      .join("")}</tbody></table></div>`;
  }

  function renderRevisions() {
    const search = document.querySelector("[data-revision-search]");
    const type = document.querySelector("[data-revision-type]");
    const list = document.querySelector("[data-revision-list]");
    const count = document.querySelector("[data-revision-count]");
    if (!search || !type || !list || !count) return;
    syncSelect(type, [
      { value: "", label: "All changes" },
      ...[...new Set(state.revisions.map((record) => record.change_type))].sort().map((value) => ({ value, label: value })),
    ]);
    const query = search.value.trim().toLowerCase();
    const visible = state.revisions.filter((record) => (!query || Object.values(record).join(" ").toLowerCase().includes(query)) && (!type.value || record.change_type === type.value));
    count.textContent = `${visible.length} ${t("of")} ${state.revisions.length} ${t("changes shown")}`;
    list.innerHTML = visible
      .map((record) => `<article class="panel p-5 sm:p-6"><div class="flex flex-col justify-between gap-3 sm:flex-row sm:items-start"><div><p class="text-xs font-black tracking-wider text-tunis-red uppercase">${escapeHtml(t(record.change_type))} · ${escapeHtml(record.dataset)}</p><h3 class="mt-2 text-xl font-black">${escapeHtml(t(record.metric))}</h3></div><time class="text-xs font-bold text-stone-500 dark:text-stone-400">${escapeHtml(record.release_date)}</time></div><div class="mt-4 grid gap-3 sm:grid-cols-2"><div class="rounded-xl bg-stone-100 p-3 dark:bg-white/5"><p class="text-[10px] font-black tracking-wider text-stone-500 uppercase">${t("Previous")}</p><p class="mt-1 text-sm">${escapeHtml(record.previous_value ? t(record.previous_value) : t("New observation"))}</p></div><div class="rounded-xl bg-stone-100 p-3 dark:bg-white/5"><p class="text-[10px] font-black tracking-wider text-stone-500 uppercase">${t("New")}</p><p class="mt-1 text-sm">${escapeHtml(t(record.new_value))}</p></div></div><p class="mt-4 text-sm leading-6 text-stone-600 dark:text-stone-300">${escapeHtml(t(record.reason))}</p><a class="mt-3 inline-block text-xs font-bold text-tunis-red hover:underline" href="${escapeHtml(record.source_url)}" target="_blank" rel="noreferrer">${t("Source")} ↗</a></article>`)
      .join("");
  }

  function renderAll() {
    renderRegions();
    renderTrends();
    renderProjects();
    renderPeers();
    renderBudget();
    renderDebt();
    renderRevisions();
  }

  function bindControls() {
    document.querySelector("[data-region-metric]")?.addEventListener("change", renderRegions);
    document.querySelector("[data-trend-metric]")?.addEventListener("change", renderTrends);
    ["[data-project-search]", "[data-project-sector]", "[data-project-stage]"].forEach((selector) => document.querySelector(selector)?.addEventListener(selector.includes("search") ? "input" : "change", renderProjects));
    document.querySelector("[data-peer-metric]")?.addEventListener("change", renderPeers);
    document.querySelector("[data-budget-year]")?.addEventListener("change", renderBudget);
    document.querySelector("[data-budget-category]")?.addEventListener("change", renderBudget);
    document.querySelector("[data-revision-search]")?.addEventListener("input", renderRevisions);
    document.querySelector("[data-revision-type]")?.addEventListener("change", renderRevisions);
    document.documentElement.addEventListener("tunstat:theme", renderAll);
    document.documentElement.addEventListener("tunstat:language", renderAll);
  }

  async function start() {
    try {
      [state.regional, state.macro, state.projects, state.peers, state.budget, state.debt, state.revisions] = await Promise.all([
        loadCSV("./data/regional_dashboard.csv"),
        loadCSV("./data/macro_dashboard.csv"),
        loadCSV("./data/project_tracker.csv"),
        loadCSV("./data/country_comparisons_2025.csv"),
        loadCSV("./data/budget_history.csv"),
        loadCSV("./data/debt_calendar.csv"),
        loadCSV("./data/revision_history.csv"),
      ]);
      bindControls();
      renderAll();
    } catch (error) {
      document.querySelectorAll(".explorer-section .shell").forEach((section) => section.insertAdjacentHTML("afterbegin", `<p class="mb-4 rounded-xl border border-red-300 bg-red-50 p-4 text-sm text-red-800 dark:border-red-900 dark:bg-red-950/30 dark:text-red-200">${t("Explorer data could not be loaded. Use the linked CSV files.")}</p>`));
      console.error(error);
    }
  }

  start();
})();
