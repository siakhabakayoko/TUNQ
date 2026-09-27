# TUNQ // Plateforme d'Intelligence Économique & d'Arbitrage Décisionnel

> **Système d'évaluation de viabilité commerciale, de rentabilité financière et de décision assistée par IA pour le Sénégal et l'espace UEMOA.**

Inspiré par le design épuré et l'ingénierie de précision, **TUNQ** combine l'arbitrage formel sans complaisance du **Moteur Décisionnel TUNQ Core**, la puissance générative de **Google Gemini**, la persistance haute performance à l'edge de **Turso (LibSQL)**, et le référentiel statistique officiel de l'**ANSD (Agence Nationale de la Statistique et de la Démographie du Sénégal)** et de la **BCEAO**.

---

## 🏛️ Les 4 Piliers Fondateurs

### 1. Observatoire Économique ANSD & Data Lake Local (`backend/data/`)
* **Scraping et normalisation** des séries statistiques de `senegal.opendataforafrica.org` et de l'ANSD.
* **Indice Harmonisé des Prix à la Consommation (IHPC)** : Base 100 en 2023, 12 fonctions COICOP, séries mensuelles récentes.
* **Démographie RGPH-5** : Population, taille des ménages et pouvoir d'achat des 14 régions du Sénégal.
* **Baromètre de Pérennité RGE-2** : Taux de survie des entreprises sénégalaises à 1, 3 et 5 ans par secteur, marges moyennes et causes d'échec.
* **Grilles Salariales ENES** : Salaires de référence Dakar vs Régions.
* **Corridors UEMOA** : Flux commerciaux et macro-économie comparée (Sénégal, Côte d'Ivoire, Mali, Burkina Faso, Guinée).
* **Contrôle mensuel des deltas** : Script d'audit et de hachage SHA-256 (`backend/scraper/delta_watcher.py`).

### 2. Studio de Décision & Modélisation Financière
* **Seuil de rentabilité & Point mort** : Calcul automatique du volume critique et du Chiffre d'Affaires d'équilibre en FCFA.
* **Économie unitaire (Unit Economics)** : Marge brute unitaire, marge en % et comparaison directe avec la moyenne sectorielle du RGE.
* **Stress-tests de résilience** :
  * Choc d'inflation (+15% sur les coûts d'intrants selon l'IPPI).
  * Retard commercial (besoin de trésorerie sur 90 jours sans vente).
* **Diagnostic stratégique** : TAM / SAM / SOM dynamique en FCFA, matrice SWOT, 5 Forces de Porter contextualisées et PESTEL Sénégal (OHADA, monnaie FCFA, fiscalité locale).

### 3. Moteur d'Arbitrage Économique & Scoring de Viabilité
* Contrairement aux LLMs conversationnels classiques sujets aux biais de complaisance, **TUNQ** applique des règles d'arbitrage mathématiques rigoureuses :
  * **Contrôles de Viabilité** : `unit_economics_viable`, `local_purchasing_power_fit`, `cash_runway_sufficient`.
  * **Scores Calibrés (1.0 à 10.0)** : `profitabilityScore`, `marketAttractivenessScore`, `supplyChainRiskScore`, `sectorSurvivalScore`.
  * **Verdict d'arbitrage** : `[ GO ]`, `[ PIVOT ]`, `[ NO_GO ]` avec indice de confiance certifié.

### 4. Synthèse Exécutive & Plan d'Action Gemini
* **Rapport stratégique** rédigé pour l'entrepreneur et les investisseurs.
* **Feuille de route 30 / 60 / 90 jours** :
  * *J+1 à J+30* : Sécurisation administrative (NINEA, APIX), mercuriales fournisseurs.
  * *J+31 à J+60* : Déploiement commercial vers le point mort.
  * *J+61 à J+90* : Consolidation et expansion vers la sous-région UEMOA (TEC, corridor Dakar-Bamako).
* **Citations institutionnelles vérifiées** (ANSD, BCEAO, Banque Mondiale).

---

## 🔒 Data Room & Workspaces (Vision Foundry)
* **Architecture multi-tenant hermétique** préparée pour le pilotage d'entreprises existantes.
* **Connecteurs Cloud** :
  * Google Drive (synchronisation des rapports et bilans SYSCOHADA).
  * Gmail (veille et extraction automatique des devis fournisseurs).
* **Dépôt sécurisé** avec indexation vectorielle RAG.

---

## 🚀 Démarrage Rapide

### Prérequis
* Node.js 20+ (testé sur Node v24)
* Python 3.9+

### 1. Backend (Data Lake ANSD & Veille)
```bash
# Générer la base de données SQLite et les exports JSON
python3 backend/scraper/ansd_master_builder.py

# Exécuter l'audit mensuel de détection des deltas
python3 backend/scraper/delta_watcher.py

# Lancer la suite de tests unitaires
python3 -m unittest backend/tests/test_ansd_data.py
```

### 2. Frontend (Application Next.js)
```bash
cd frontend

# Installer les dépendances
npm install

# Lancer les tests unitaires financiers
node src/tests/financial-engine.test.mjs

# Lancer le serveur de développement
npm run dev
```

L'application est accessible sur : `http://localhost:3000`

---

## 🎨 Design System & Esthétique
Inspiré par le site de **TypeSafe AI (`typesafe.ai`)** :
* **Typographie duale** : Grotesque percutant (`Geist / Swiss Grotesk`) pour les titres et Monospace haute précision (`Geist_Mono / IBM Plex Mono`) pour toutes les métriques financières et dates.
* **Composants mécaniques** : Fenêtres techniques encadrées (`[ TECH_WINDOW ]`), bordures franches 1px, réticules de visée (`┌ ┐ └ ┘`), trame de points (halftone dither).
* **Jauges calibrées** : Sliders horizontaux avec repères de seuil et moyennes sectorielles ANSD.
* **Palette** : Noir obsidienne (`#07090E`), accent émeraude néon (`#03FFB2`), ambre (`#FFB224`), rouge signalétique (`#FF3B30`) et cyan (`#00D2FF`).

---

## 📜 Licence & Propriété
Développé selon les standards **GRAFHILUX_GLOBAL_STANDARDS** pour l'écosystème sénégalais et ouest-africain.
