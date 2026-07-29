# Healthy ranges and benchmark methodology

## Purpose

TunStat now states what “healthy” means for every metric it publishes or identifies as a critical data gap. The complete machine-readable registry is in [`data/metric_health_reference.csv`](data/metric_health_reference.csv).

A healthy range is a reference for interpretation. It is not automatically:

- a legal limit;
- an official Tunisian target;
- a forecast;
- evidence that one observation is sufficient to judge the whole system; or
- a trigger for an immediate policy change.

Each reference is labeled so readers can distinguish a binding or prudential minimum from an official program target, an international comparison and a TunStat policy reference.

## Benchmark hierarchy

### 1. Legal or prudential minimum

This is the strongest category. It covers a binding domestic rule or a recognized supervisory minimum. National requirements prevail when an international standard is cited for comparison.

Examples include the Basel liquidity coverage ratio reference of 100% and Basel capital references. The dashboard does not claim that a Basel comparison replaces the applicable Central Bank of Tunisia rule.

### 2. Official Tunisian or financed-program target

This is a target published by the Tunisian authorities or in an approved program document.

Examples include the TEREG electricity-sector targets for renewable generation, cost recovery, losses and collection. The target is official to that program; it is not relabeled as an economy-wide law.

### 3. International reference

This is a recognized comparison, rule of thumb or development objective. It is useful for orientation but is not automatically binding on Tunisia.

Examples include:

- at least three months of import cover as a traditional reserve reference;
- the IMF reserve-adequacy range of 100–150% of the ARA metric;
- the European Union’s 3% deficit and 60% debt references, explicitly marked as non-binding on Tunisia;
- the Sustainable Development Goal direction for poverty reduction; and
- international operating references for water losses.

### 4. TunStat policy or monitoring reference

This is a country-specific operating range proposed for monitoring or recovery planning. It is not an official forecast or legal ceiling.

Examples include sustained real GDP growth above 3.5%, public debt declining toward below 70% of GDP by 2035, an investment rate above 20% in the medium term and publication targets for currently missing service-quality data.

### 5. Directional or contextual test

Some indicators have no defensible universal healthy number. For these, health means the direction, quality, distribution or seasonal comparison is improving.

Examples include:

- the dinar exchange rate, which must be assessed with inflation, reserves and the external balance;
- dam filling, which requires a date-matched seasonal comparison and cannot represent groundwater or service continuity;
- declared investment, which becomes meaningful only when comparable projects reach financing, construction and operation; and
- tourism and remittance receipts, which should grow in real terms and become more diversified.

## Current assessment labels

The registry uses five assessment labels:

| Label | Meaning |
|---|---|
| `healthy` | The latest reading meets the stated reference, subject to the metric’s limitations. |
| `watch` | The reading is close to the reference, weakening or incomplete. |
| `stress` | The reading is outside the stated stress range or signals a material structural problem. |
| `gap` | No current, recurring and comparable public observation was found. |
| `context` | The number is informative, but a fixed threshold would be misleading. |

These labels are analytical summaries. They do not replace a debt-sustainability analysis, bank-level supervisory review, engineering study, poverty-distribution exercise or seasonal hydrological model.

## Core references

### External liquidity

The IMF describes three months of prospective imports as a traditional reserve-adequacy reference and treats 100–150% of the ARA metric as broadly adequate for many countries. TunStat uses 90 import days as the minimum reference and 120 days as the preferred buffer for Tunisia’s energy and import exposure.

- [IMF: Assessing Reserve Adequacy](https://www.elibrary.imf.org/view/journals/007/2016/018/article-A001-en.xml)

### Banking

Basel references include common equity Tier 1 of 4.5%, Tier 1 capital of 6% and total capital of 8%, with the conservation buffer adding 2.5 percentage points to the relevant minimum-plus-buffer comparison. The liquidity coverage ratio and net stable funding ratio use 100% minimum references. Applicable Tunisian rules remain controlling.

The IMF defines nonperforming-loan measures but does not set a universal healthy NPL ratio. TunStat’s 5% comparison and 70% coverage reference are therefore labeled as monitoring references, not IMF limits.

- [Basel Committee: Basel III monitoring report](https://www.bis.org/bcbs/publ/d581.pdf)
- [Basel Framework: minimum capital requirements](https://www.bis.org/basel_framework/chapter/RBC/20.htm?inforce=20270101&published=20191215)
- [IMF Financial Soundness Indicators Guide](https://www.imf.org/en/-/media/files/data/2019/2019-fsi-guide.pdf)

### Fiscal policy

The European Union’s 3% deficit and 60% debt references are included only as international comparisons; they are not binding Tunisian limits. Tunisia requires its own debt-sustainability path, maturity strategy and protection of essential services and investment.

- [European Commission: fiscal surveillance reference values](https://commission.europa.eu/topics/economy-and-euro/european-semester/european-semester-timeline/european-semester-spring-package_en)
- [European Fiscal Board compliance tracker](https://commission.europa.eu/european-fiscal-board-efb/compliance-tracker_en)

### Electricity

The TEREG program provides official targets for renewable electricity, cost recovery, network performance and private-investment mobilization. Reliability remains partly unassessable until Tunisia publishes reserve margin, available capacity, forced outages, unserved energy and interruption duration at a recurring frequency.

- [World Bank TEREG appraisal document](https://documents1.worldbank.org/curated/en/099031525065039924/pdf/P507304-161c6028-502c-4281-85b6-9e7f219973d9.pdf)

### Water

Water-loss comparisons must identify whether the measure covers production, physical leakage, non-revenue water or irrigation conveyance. The dashboard uses 15% as an international potable-network operating reference and 20% as a TunStat irrigation-loss objective. Dam filling remains a seasonal context measure.

- [World Bank operational water-loss benchmark reference](https://documents1.worldbank.org/curated/en/707991467999081746/pdf/ACS13859-WP-P154212-OUO-9-Box391472B-ACS.pdf)
- [Tunisia irrigation-water project appraisal](https://documents1.worldbank.org/curated/en/099020626172042635/pdf/P511719-ba379039-6898-4c94-ae53-0a713d6fd43a.pdf)

### Jobs, poverty and investment

The ILO recommends reading labor-market indicators together rather than using one universal unemployment threshold. TunStat’s unemployment and participation ranges are policy references for Tunisia. The poverty direction follows Sustainable Development Goal 1, while national policy should use Tunisia’s official national poverty measure when current results are published.

The 20% medium-term investment-rate reference is a TunStat policy range. The 25% comparison is associated with high-investment convergence experience and is not a guarantee of growth or an instruction to fund weak projects.

- [ILO Key Indicators of the Labour Market](https://www.ilo.org/resource/key-indicators-labour-market-kilm-seventh-edition)
- [United Nations Sustainable Development Goal 1](https://sdgs.un.org/goals/goal1)
- [World Bank investment-rate comparison](https://documents1.worldbank.org/curated/en/763771468197384854/pdf/Kenya000Countr0nd0shared0prosperity.pdf)

## How to use the registry

Read the fields together:

1. `healthy_meaning` states the desired range, direction or quality test.
2. `watch_or_stress` states what deterioration looks like.
3. `benchmark_type` identifies the authority and limits of the reference.
4. `current_reading` preserves the date and measurement context.
5. `assessment` summarizes the latest evidence.
6. `source_url` links to the supporting source.

When a new release arrives, update the current reading and assessment. Change the healthy reference only when the underlying law, prudential framework, official program or documented analytical rationale changes.

## Limitations

- Thresholds can create false precision when data are revised, seasonal or incomplete.
- Aggregate bank ratios can hide institution-level risk.
- A fiscal ratio cannot show spending quality by itself.
- Reserve cover depends on capital flows, debt maturities and exchange-rate flexibility as well as imports.
- Water and electricity reliability require service-level and regional data.
- Investment quantity is not a substitute for project quality, maintenance or execution.
- “Healthy” does not mean “risk free.”

This project provides economic-policy research, not legal, financial or investment advice.
