---
name: tfm-strategy
description: "TFM (Master's thesis) research question, strategy, timeline, and critical path"
metadata: 
  node_type: memory
  type: project
  originSessionId: 38085765-d620-4d70-ba17-bca52518b5bd
---

## Research question

> *Can a personalised acoustic masking sound for tinnitus be predicted from a psychoacoustic profile collected via a consumer app with AirPods Pro — without EEG or clinical audiometry?*

**Why novel:** Schiller 2025 does this at 98% accuracy WITH EEG. Doborjeh 2023 uses EEG + TFI at 98–100%. No one has tested whether psychoacoustic profile alone (measurable with a consumer app) is sufficient. That gap is the TFM contribution.

**Empirical justification (for introduction chapter):** Probst 2025 (TrackYourTinnitus, 67K samples, 10 years) shows external sound only helps ~20% of users. 75% get no benefit from generic approaches. Personalisation is not optional — it's the only thing that works at population scale.

**Testable secondary hypotheses:**
1. MML predicts BATS-positive status (proxy for EEG alpha/gamma features)
2. AM tinnitus responds better to AM-modulated masking at the same rate
3. TFI distress subscales predict masking type preference (pure notch vs. relaxation)
4. The ~20% responders share an identifiable psychoacoustic profile

## Critical path

- **Late August 2025:** email patrick.neff@uzh.ch for Regensburg dataset — arrive with work done
- **September 6:** TFM proposal meeting. Bring 1-page summary. Lead with Bonn + Medellín contacts.
- **September week 1:** submit to Comité de Ética — can take 2–4 months, do NOT delay
- **September week 1:** find director (health informatics, signal processing, or clinical AI profile)
- **Oct–Dec:** supervised learning + neural networks courses → apply directly to model
- **Jan–Mar 2026:** train and evaluate masking recommendation model
- **Apr–Jun 2026:** integrate model into app, clinical + Reddit validation
- **Summer 2026:** write thesis

## Key facts for proposal meeting

- iOS developer with 10M-user production app (1&1 Mail & Media) — implementation is not a risk
- Clinical collaborators on 2 continents (Bonn + Medellín)
- Pre-existing research: 11 papers, 3 datasets, working ML notebook, complete Notion workspace
- Hardware rationale (AirPods Pro ANC) is a methodological choice, not a product preference
- Data collection: zero personal data, ethics-first architecture, Contribute button for voluntary anonymised data
- Open source MIT upon delivery — publishable dataset on Zenodo/OSF

## GDPR / ethics

- Spanish university — submit to Comité de Ética de la Investigación
- Bonn contact can co-sign as clinical collaborator (strengthens ethics application)
- Data is truly anonymised (numeric values only, no re-identification path) → outside GDPR scope
- Contribute button goes live ONLY after ethics approval
- University provides GDPR-compliant data infrastructure — no external hosting needed
