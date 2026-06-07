---
name: project-tinnitus-app
description: "Full context of the tinnitus app project — architecture, decisions, repo, key contacts, and current state"
metadata: 
  node_type: memory
  type: project
  originSessionId: 38085765-d620-4d70-ba17-bca52518b5bd
---

## The app: my-tinnitus-mask

**GitHub:** https://github.com/NatAndDev/my-tinnitus-mask  
**Notion hub:** 🔬 TFM — Tinnitus AI App (workspace root level)

**Core function (two phases):**
1. **Tinnitus profiling** (no ML — pure algorithm): guided psychoacoustic matching via iPhone + AirPods Pro. Identifies tinnitus frequency (Hz), intensity (dB SL), type (tonal / amplitude_modulated / broadband / pulsatile), modulation rate (Hz), modulation depth (0–1), and MML (Minimum Masking Level).
2. **Masking recommendation** (ML): CoreML model outputs parameters of a mathematically synthesised masking sound — not selected from a catalogue. Cold start uses literature heuristic (notched noise ~0.5 octaves above tinnitus frequency). Adapts from feedback over time.

**Platform:** iPhone + AirPods Pro required (ANC = controlled acoustic environment). iOS 17+ minimum.  
**Price:** Free forever. No monetisation.  
**Data:** Zero personal data on-device. Optional Contribute button → POST to Google Apps Script → Google Sheets → CSV for ML training.  
**Open source:** MIT licence, published on GitHub upon TFM delivery.

**Key architectural decisions:**
- iOS stack: SwiftUI, SwiftData, AudioKit or AVFoundation, CoreML, async/await
- ML pipeline: Python (scikit-learn RF/XGBoost) → coremltools → CoreML model in app
- Onboarding questionnaires: THI (25 items, 0–100) + TFI (25 items, 8 subscales, 0–100)
- MML measured during intensity matching step — key bridge feature for BATS prediction
- Two-stage cold start based on user's MML + THI/TFI distress profile

**Repo structure:**
```
my-tinnitus-mask/
├── README.md
├── research/
│   ├── README.md (key findings table)
│   ├── papers/ (7 detailed .md notes)
│   ├── datasets/ (mendeley + synthetic baseline)
│   └── notebooks/ (tinnitus_ml_baseline.ipynb — working ML pipeline)
├── docs/ (app-design, data-protocol, research-question, papers)
├── app/ (iOS code — coming)
└── LICENSE (MIT)
```

**Existing ML work:**
- `tinnitus_ml_baseline.ipynb`: working pipeline on synthetic data (Dinther 2024 distributions). LR/RF/SVM, 5-fold CV, AUC=1.000 on synthetic (expected). Ready to swap in Mendeley CSV.

**Key datasets:**
- Mendeley Acoustic Therapies: public download, CC BY 4.0, 89 patients, THI + audiogram + treatment outcomes
- Regensburg BATS EEG (Schiller 2025): request to patrick.neff@uzh.ch — plan to email late August 2025

**Clinical contacts:**
- Bonn, Germany: HMO doctor willing to recommend patients to try app
- Medellín, Colombia: HMO doctor willing to recommend patients
- Reddit r/tinnitus: worldwide community for feedback and voluntary data

**Why:** Nat's husband describes his tinnitus as wave-like (amplitude modulated). The app needs to handle both wave-type and pure-tone (constant beep) tinnitus with different matching and masking strategies.
