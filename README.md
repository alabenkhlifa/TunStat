# TunStat

> Tunisia, measured clearly.

[![Monthly update](https://img.shields.io/badge/update-monthly-e70013)](https://github.com/alabenkhlifa/TunStat)
[![Data cut-off](https://img.shields.io/badge/data%20cut--off-29%20July%202026-087e8b)](https://github.com/alabenkhlifa/TunStat)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4.3.3-38bdf8?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Chart.js](https://img.shields.io/badge/Chart.js-4.5.1-ff6384?logo=chartdotjs&logoColor=white)](https://www.chartjs.org/)
[![Open data](https://img.shields.io/badge/data-CSV-f18f01)](data/)

TunStat is an evidence-based dashboard and research dossier covering Tunisia’s economy, external liquidity, banks, households, electricity, water, public finances, debt, investment, state-owned enterprises and major projects. It combines current official data with a sequenced recovery program and detailed comparisons with Morocco, Jordan and Egypt.

The project is designed to answer eight questions:

- What is happening in Tunisia now?
- Are reserves, banks, government cash and public enterprises creating connected risks?
- What is driving electricity and energy insecurity?
- How exposed are households and water services?
- Where is public money going, and how is the state financed?
- Which major investments are operational, under construction, financed or still in preparation?
- Which economic, legal and institutional changes are practical at each time horizon?
- What can Tunisia learn from Morocco, Jordan and Egypt without treating any of them as an identical case?

## Monthly updates

TunStat will be updated **monthly** as new official releases become available. Each release will refresh the latest macroeconomic, external, banking, household, labor, trade, energy, water, fiscal, investment, SOE and project indicators.

Every value is labeled by status:

- **Actual:** reported for a completed period, sometimes provisional.
- **Forecast:** a published projection, not a realized outcome.
- **Declared:** a registered investment intention, not proof of execution.
- **Approved:** financing or authorization exists, but completion is not implied.
- **Proposed:** a TunStat policy recommendation or target.

## Website

The website is mobile-first and includes:

- persistent light and dark themes;
- responsive navigation and accessible controls;
- a current economic snapshot;
- twelve interactive Chart.js chart groups with tooltips, exact-value tables and responsive layouts;
- a searchable health-reference registry covering every tracked or missing metric;
- three dedicated country-comparison pages with interactive evidence, causal analysis and Tunisia-specific lessons;
- a 39-metric coverage audit that distinguishes current, partial and missing public data;
- reserve, banking, household, water and state-owned-enterprise risk analysis;
- electricity-outage and energy-security analysis;
- public-spending, subsidy, debt and loan breakdowns;
- a status-classified major-project portfolio;
- a sequenced recovery program;
- legal and institutional reform priorities; and
- direct access to source documents and CSV datasets.

After GitHub Pages is enabled, the public site is available at:

**https://alabenkhlifa.github.io/TunStat/**

## Latest snapshot

Evidence cut-off: **29 July 2026**

| Indicator | Latest value |
|---|---:|
| Real GDP growth | +2.6% year on year, Q1 2026 |
| Consumer inflation | 5.3%, June 2026 |
| Unemployment | 15.0%, Q1 2026 |
| Youth unemployment | 37.5%, Q1 2026 |
| H1 trade deficit | TND 12.57bn |
| FX reserve cover | 97 import days, 3 July 2026 |
| Banking-sector classified loans | 14.9%, end-2025 |
| Energy independence | 34%, January–May 2026 |
| Dam filling | Approximately 60%, June 2026 |
| Public debt | 82.1% of GDP, end-2025 provisional |
| 2025 declared investment | TND 8.36bn |

## Research dossier

1. [Executive summary](00-executive-summary.md)
2. [Current economic snapshot](01-current-economic-snapshot.md)
3. [Power system and July 2026 outages](02-power-system-and-outages.md)
4. [Public finance, expenses, debt and loans](03-public-finance-debt-and-loans.md)
5. [Investment and major projects](04-investment-and-major-projects.md)
6. [Diagnosis: what is holding Tunisia back](05-diagnosis.md)
7. [Short-, medium- and long-term recovery program](06-recovery-program.md)
8. [Legal and institutional reform agenda](07-legal-and-institutional-reforms.md)
9. [Implementation, financing and scorecard](08-implementation-scorecard.md)
10. [Risks and scenarios](09-risks-and-scenarios.md)
11. [Sources, definitions and methodology](10-sources-and-methodology.md)
12. [Critical metrics and system-risk dashboard](11-critical-metrics-and-system-risk.md)
13. [Healthy ranges and benchmark methodology](12-health-benchmarks.md)

## Country comparisons

- [Tunisia and Morocco: same foundations, different execution](comparisons/morocco.html)
- [Tunisia and Jordan: similar pressure, different protection](comparisons/jordan.html)
- [Tunisia and Egypt: similar debt, different crisis mechanics](comparisons/egypt.html)

These comparisons use each country for a specific analytical purpose. Morocco is the structural and investment benchmark, Jordan is the macroeconomic-stability comparator, and Egypt is the fiscal–currency risk comparator. Differences in reporting periods and debt definitions are preserved rather than hidden.

## Data and charts

The [`data/`](data/) directory contains twenty-four CSV datasets. The website renders the main interactive dashboard plus comparison charts on three dedicated country pages. The [`charts/`](charts/) directory preserves thirteen accessible SVG charts for the Markdown research chapters and non-JavaScript use.

The values behind each visualization are preserved in CSV form. The [metric health reference](data/metric_health_reference.csv) states what healthy, watch, stress, gap and context mean for every metric. Declared investment is never added to realized international investment; approved financing is not reported as completed construction; and proposed targets are not presented as official forecasts.

## Run locally

Requirements: Node.js 20 or newer.

```bash
npm install
npm run build
python3 -m http.server 8000
```

Open `http://localhost:8000`.

For Tailwind development:

```bash
npm run dev
```

## Project structure

```text
.
├── index.html                  # Responsive dashboard
├── assets/
│   ├── app.js                  # Theme and mobile navigation
│   ├── charts.js               # Interactive charts and metric registry
│   ├── comparisons.js          # Country-comparison charts and tables
│   ├── chart.umd.min.js        # Chart.js runtime copied during build
│   ├── og.png                  # Social preview
│   └── styles.css              # Compiled Tailwind CSS
├── src/input.css               # Tailwind source
├── comparisons/                # Morocco, Jordan and Egypt comparison pages
├── charts/                     # SVG fallbacks for research documents
├── data/                       # Twenty-four CSV datasets
├── 00-...md to 12-...md        # Research chapters
└── package.json
```

## Source policy

TunStat prioritizes:

1. Tunisia’s official statistical, ministerial, parliamentary, legal and utility sources;
2. primary World Bank, African Development Bank, EBRD, EIB and related development-finance sources;
3. official national news reporting for very recent events; and
4. secondary reporting only when primary details are unavailable.

See [Sources, definitions and methodology](10-sources-and-methodology.md) for the complete bibliography, calculation notes and limitations.

## Important limitations

- Some official figures are provisional and may be revised.
- A complete public real-time outage dataset was not found.
- Current consolidated data on government arrears, outstanding guarantees, SOE cross-debt, household energy burden and water-service interruptions were not found.
- Missing public metrics are preserved as `NA` with a proposed publishing institution; they are never treated as zero.
- Health thresholds are labeled by type and are not treated as universal rules or automatic policy triggers.
- Project costs can differ because sources use different dates and scopes.
- This project provides economic-policy research, not legal, financial or investment advice.
- Legal texts must be checked in their consolidated official form before implementation.

## Repository topics

`tunisia` · `economy` · `open-data` · `data-visualization` · `public-finance` · `banking` · `energy` · `water-security` · `macroeconomics` · `policy-analysis` · `infrastructure` · `tailwindcss`
