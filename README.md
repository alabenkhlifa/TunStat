# TunStat

> Tunisia, measured clearly.

[![Monthly update](https://img.shields.io/badge/update-monthly-e70013)](https://github.com/alabenkhlifa/TunStat)
[![Data cut-off](https://img.shields.io/badge/data%20cut--off-29%20July%202026-087e8b)](https://github.com/alabenkhlifa/TunStat)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4.3.3-38bdf8?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Open data](https://img.shields.io/badge/data-CSV-f18f01)](data/)

TunStat is an evidence-based dashboard and research dossier covering Tunisia’s economy, electricity system, public finances, debt, investment and major projects. It combines current official data with a sequenced short-, medium- and long-term recovery program.

The project is designed to answer five questions:

- What is happening in Tunisia now?
- What is driving electricity and energy insecurity?
- Where is public money going, and how is the state financed?
- Which major investments are operational, under construction, financed or still in preparation?
- Which economic, legal and institutional changes are practical at each time horizon?

## Monthly updates

TunStat will be updated **monthly** as new official releases become available. Each release will refresh the latest macroeconomic, labor, trade, energy, fiscal, investment and project indicators.

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
- seven reusable data visualizations;
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
| Energy independence | 34%, January–May 2026 |
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

## Data and charts

The [`data/`](data/) directory contains eleven CSV datasets. The [`charts/`](charts/) directory contains seven accessible SVG charts.

The values behind each visualization are preserved in CSV form. Declared investment is never added to realized international investment; approved financing is not reported as completed construction; and proposed targets are not presented as official forecasts.

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
│   ├── og.png                  # Social preview
│   └── styles.css              # Compiled Tailwind CSS
├── src/input.css               # Tailwind source
├── charts/                     # Seven SVG visualizations
├── data/                       # Eleven CSV datasets
├── 00-...md to 10-...md        # Research chapters
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
- Project costs can differ because sources use different dates and scopes.
- This project provides economic-policy research, not legal, financial or investment advice.
- Legal texts must be checked in their consolidated official form before implementation.

## Repository topics

`tunisia` · `economy` · `open-data` · `data-visualization` · `public-finance` · `energy` · `macroeconomics` · `policy-analysis` · `infrastructure` · `tailwindcss`
