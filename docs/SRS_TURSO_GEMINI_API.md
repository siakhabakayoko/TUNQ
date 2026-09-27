# Spécification des Exigences Logicielles (SRS)
## Module : Intégration Turso (LibSQL) & Google Gemini API pour TUNQ
**Version** : 1.0.0  
**Statut** : Validé pour implémentation  
**Auteur** : TUNQ Engineering  

---

### 1. Objectifs & Portée du Système
Ce document détaille la conception technique pour le remplacement des données simulées par :
1. Une couche de persistance distribuée et edge-ready basée sur **Turso (LibSQL)**.
2. Une chaîne d'analyse cognitive basée sur **Google Gemini API** (modèle `gemini-2.5-flash`), contextualisée par les statistiques officielles de l'ANSD (Sénégal) et de l'UEMOA.
3. Des points d'accès API Next.js standardisés (`/api/evaluations`, `/api/ansd/*`, `/api/documents`).

---

### 2. Interfaces Système & Architecture

```
┌────────────────────────────────────────────────────────┐
│                   TUNQ Frontend UI                     │
│  (Studio d'arbitrage, Observatoire ANSD, Data Room)    │
└──────────────────────────┬─────────────────────────────┘
                           │ HTTP / JSON
┌──────────────────────────▼─────────────────────────────┐
│               Next.js Route Handlers                   │
│      /api/evaluations  |  /api/ansd  |  /api/documents │
└─────────────┬───────────────────────────┬──────────────┘
              │                           │
              │ SQL via @libsql/client    │ Prompt avec contexte ANSD
              ▼                           ▼
┌──────────────────────────┐  ┌──────────────────────────┐
│       Turso LibSQL       │  │    Google Gemini API     │
│   (Cloud / Local WAL)    │  │   (gemini-2.5-flash)     │
│  - projects              │  │  - Synthèse stratégique  │
│  - evaluations           │  │  - SWOT contextualisé    │
│  - documents             │  │  - Risques macro PESTEL  │
│  - ansd_datasets         │  │  - Roadmap 30/60/90 j    │
└──────────────────────────┘  └──────────────────────────┘
```

---

### 3. Schéma de la Base de Données Turso

#### 3.1 Table `projects`
- `id` : TEXT (PRIMARY KEY, UUID / nanoid)
- `title` : TEXT (NOT NULL)
- `sector_id` : TEXT (NOT NULL, FK vers secteurs ANSD)
- `region_id` : TEXT (NOT NULL, FK vers régions ANSD)
- `description` : TEXT
- `is_uemoa_target` : INTEGER (0 ou 1)
- `uemoa_target_country` : TEXT
- `created_at` : TEXT (ISO-8601)

#### 3.2 Table `evaluations`
- `id` : TEXT (PRIMARY KEY, UUID)
- `project_id` : TEXT (FK `projects.id`)
- `unit_price_fcfa` : REAL (NOT NULL)
- `unit_cost_fcfa` : REAL (NOT NULL)
- `monthly_fixed_costs_fcfa` : REAL (NOT NULL)
- `target_monthly_sales_volume` : INTEGER (NOT NULL)
- `breakeven_units` : REAL (NOT NULL)
- `breakeven_revenue_fcfa` : REAL (NOT NULL)
- `gross_margin_pct` : REAL (NOT NULL)
- `working_capital_rec_fcfa` : REAL (NOT NULL)
- `verdict` : TEXT (VIABLE_IMMÉDIAT | VIABLE_SOUS_CONDITIONS | NON_VIABLE | PIVOT_REQUIS)
- `confidence_score` : REAL (0 - 100)
- `gemini_analysis_json` : TEXT (Analyse IA structurée générée par Gemini)
- `created_at` : TEXT (ISO-8601)

#### 3.3 Table `documents`
- `id` : TEXT (PRIMARY KEY, UUID)
- `organization_id` : TEXT (NOT NULL, ex: "ORG_SN_88204")
- `title` : TEXT (NOT NULL)
- `category` : TEXT (NOT NULL)
- `file_size_mb` : REAL (NOT NULL)
- `source` : TEXT (NOT NULL, "upload" | "gdrive" | "gmail")
- `status` : TEXT (NOT NULL, "Indexé" | "Analysé" | "En attente")
- `created_at` : TEXT (ISO-8601)

#### 3.4 Table `ansd_datasets`
- `dataset_id` : TEXT (PRIMARY KEY)
- `title` : TEXT (NOT NULL)
- `category` : TEXT (NOT NULL)
- `payload_json` : TEXT (Contenu structuré des séries ANSD)
- `last_sync` : TEXT (ISO-8601)

---

### 4. Spécification des APIs

#### 4.1 `POST /api/evaluations`
- **Entrée** : Données du projet (`title`, `sectorId`, `regionId`, `description`, `unitPriceFcfa`, `unitCostFcfa`, `monthlyFixedCostsFcfa`, `targetMonthlySalesVolume`, `isUemoaExportTarget`, `uemoaTargetCountry`).
- **Traitement** :
  1. Validation des données entrantes (types stricts, valeurs positives).
  2. Calcul financier déterministe (seuil de rentabilité, marge brute, BFR).
  3. Extraction des données contextuelles ANSD (IHPC, taux de survie RGE-2, population RGPH-5).
  4. Appel à l'API **Google Gemini** pour produire l'évaluation stratégique contextualisée.
  5. Enregistrement transactionnel dans la base **Turso**.
- **Sortie** : Objet JSON complet de l'évaluation (`evaluationId`, `metrics`, `strategicAnalysis`, `verdict`, `timestamp`).

#### 4.2 `GET /api/evaluations`
- **Sortie** : Liste ordonnée chronologiquement des projets et évaluations enregistrés dans Turso.

#### 4.3 `GET /api/ansd/[dataset]`
- **Paramètre** : `dataset` (`ihpc`, `rgph5`, `rge`, `enes`, `uemoa`, `catalog`).
- **Sortie** : Données officielles certifiées extraites de Turso / base locale.

#### 4.4 `GET /api/documents` & `POST /api/documents`
- **Gestion des pièces de la Data Room** : listage et enregistrement de documents dans Turso.

---

### 5. Intégration Google Gemini
- **Modèle** : `gemini-2.5-flash` via le SDK `@google/genai` (ou `@google/generative-ai`).
- **Sécurité** : Clé injectée strictement via `process.env.GEMINI_API_KEY` (aucun secret hardcodé).
- **Prompting** : Injection dynamique des indicateurs économiques réels (inflation IHPC, mortalité des entreprises du secteur RGE-2, pouvoir d'achat régional RGPH-5).
- **Format de Réponse** : Sortie structurée JSON (validée ou castée) comprenant :
  - `verdictRationale` : Synthèse argumentée pour investisseurs.
  - `swot` : Forces, Faiblesses, Opportunités, Menaces spécifiques au marché sénégalais.
  - `pestel` : Facteurs macro-économiques locaux et régionaux.
  - `executionPlan` : Jalons d'actions à 30, 60 et 90 jours.
- **Résilience** : En l'absence de clé d'API ou en cas de coupure réseau, bascule automatique et transparente vers le moteur heuristique ANSD intégré.

---

### 6. Exigences Non-Fonctionnelles (Performances & Sécurité)
1. **Zéro Données en Clair** : Toutes les clés (`TURSO_DATABASE_URL`, `TURSO_AUTH_TOKEN`, `GEMINI_API_KEY`) doivent être déclarées dans `.env.local` et jamais versionnées dans Git.
2. **Latence** : Réponses des calculs financiers en < 50ms, appel Gemini en < 2.5s.
3. **Persistance Edge** : Support immédiat du mode local (`file:backend/data/ansd_master.db`) avec montée en charge fluide vers le cluster Turso managé.
