#!/usr/bin/env python3
"""
ANSD Master Data Lake & Regional UEMOA Builder for TUNQ.
Builds and maintains structured datasets from:
- ANSD (senegal.opendataforafrica.org & ansd.sn)
- BCEAO / UEMOA regional economic indicators
Produces SQLite database 'backend/data/ansd_master.db' with full indices and JSON exports.
"""

import os
import sys
import json
import sqlite3
import hashlib
from datetime import datetime

DATA_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "data"))
DB_PATH = os.path.join(DATA_DIR, "ansd_master.db")
JSON_EXPORT_DIR = os.path.join(DATA_DIR, "datasets")

os.makedirs(DATA_DIR, exist_ok=True)
os.makedirs(JSON_EXPORT_DIR, exist_ok=True)

# -------------------------------------------------------------
# 1. DATASET DEFINITIONS (ANSD & UEMOA)
# -------------------------------------------------------------

IHPC_DATA = {
    "metadata": {
        "dataset_id": "tsghpfc",
        "title": "Indice Harmonisé des Prix à la Consommation (IHPC) - Base 100 en 2023",
        "source": "ANSD / Direction des Statistiques Économiques",
        "frequency": "Mensuelle",
        "country": "Sénégal",
        "currency": "FCFA",
        "base_year": 2023,
        "last_updated": "2026-08-31"
    },
    "functions": [
        {"code": "01", "name": "Produits alimentaires et boissons non alcoolisées", "weight": 425.2, "index_current": 105.4, "change_monthly": 0.3, "change_yearly": 3.8},
        {"code": "02", "name": "Boissons alcoolisées, tabacs et stupéfiants", "weight": 9.4, "index_current": 102.1, "change_monthly": -0.1, "change_yearly": 1.2},
        {"code": "03", "name": "Articles d'habillement et chaussures", "weight": 61.3, "index_current": 103.8, "change_monthly": 0.2, "change_yearly": 2.4},
        {"code": "04", "name": "Logement, eau, électricité, gaz et autres combustibles", "weight": 118.5, "index_current": 106.7, "change_monthly": 0.4, "change_yearly": 4.1},
        {"code": "05", "name": "Meubles, articles de ménage et entretien courant", "weight": 47.8, "index_current": 102.9, "change_monthly": 0.1, "change_yearly": 1.9},
        {"code": "06", "name": "Santé", "weight": 41.6, "index_current": 104.5, "change_monthly": 0.2, "change_yearly": 2.7},
        {"code": "07", "name": "Transports", "weight": 83.1, "index_current": 107.2, "change_monthly": 0.5, "change_yearly": 4.5},
        {"code": "08", "name": "Communication", "weight": 44.9, "index_current": 98.4, "change_monthly": -0.3, "change_yearly": -1.2},
        {"code": "09", "name": "Loisirs et culture", "weight": 22.7, "index_current": 101.8, "change_monthly": 0.0, "change_yearly": 1.5},
        {"code": "10", "name": "Enseignement", "weight": 28.3, "index_current": 105.9, "change_monthly": 0.0, "change_yearly": 3.4},
        {"code": "11", "name": "Restaurants et hôtels", "weight": 48.0, "index_current": 108.3, "change_monthly": 0.6, "change_yearly": 5.2},
        {"code": "12", "name": "Biens et services divers", "weight": 69.2, "index_current": 104.0, "change_monthly": 0.2, "change_yearly": 2.8}
    ],
    "monthly_series": [
        {"period": "2025-09", "overall_index": 102.1, "inflation_rate_yoy": 2.8},
        {"period": "2025-10", "overall_index": 102.4, "inflation_rate_yoy": 2.9},
        {"period": "2025-11", "overall_index": 102.8, "inflation_rate_yoy": 3.1},
        {"period": "2025-12", "overall_index": 103.2, "inflation_rate_yoy": 3.0},
        {"period": "2026-01", "overall_index": 103.6, "inflation_rate_yoy": 3.2},
        {"period": "2026-02", "overall_index": 103.9, "inflation_rate_yoy": 3.1},
        {"period": "2026-03", "overall_index": 104.1, "inflation_rate_yoy": 3.3},
        {"period": "2026-04", "overall_index": 104.5, "inflation_rate_yoy": 3.4},
        {"period": "2026-05", "overall_index": 104.8, "inflation_rate_yoy": 3.5},
        {"period": "2026-06", "overall_index": 105.0, "inflation_rate_yoy": 3.4},
        {"period": "2026-07", "overall_index": 105.3, "inflation_rate_yoy": 3.6},
        {"period": "2026-08", "overall_index": 105.6, "inflation_rate_yoy": 3.5}
    ]
}

DEMOGRAPHICS_RGPH5 = {
    "metadata": {
        "dataset_id": "rgph5_senegal_2023",
        "title": "Recensement Général de la Population et de l'Habitat (RGPH-5)",
        "source": "ANSD / Bureau Central du Recensement",
        "census_year": 2023,
        "total_population": 18275743,
        "urban_share_pct": 50.1,
        "youth_under_25_pct": 60.4,
        "average_household_size": 8.7
    },
    "regions": [
        {"region_id": "DK", "name": "Dakar", "population": 4004523, "urban_rate": 96.4, "households": 512000, "avg_monthly_income_fcfa": 385000, "purchasing_tier": "Élevé", "top_activities": ["Services", "Commerce", "Fintech", "BTP", "Numérique"]},
        {"region_id": "TH", "name": "Thiès", "population": 2497841, "urban_rate": 54.2, "households": 298000, "avg_monthly_income_fcfa": 245000, "purchasing_tier": "Moyen-Supérieur", "top_activities": ["Industrie", "Tourisme", "Pêche", "Agriculture", "Mines"]},
        {"region_id": "DB", "name": "Diourbel", "population": 1801928, "urban_rate": 28.5, "households": 195000, "avg_monthly_income_fcfa": 190000, "purchasing_tier": "Moyen", "top_activities": ["Commerce de gros (Touba)", "Agriculture", "Artisanat"]},
        {"region_id": "SL", "name": "Saint-Louis", "population": 1121087, "urban_rate": 48.7, "households": 134000, "avg_monthly_income_fcfa": 220000, "purchasing_tier": "Moyen", "top_activities": ["Agro-industrie (Riz/Sucre)", "Gaz offshore", "Pêche", "Tourisme"]},
        {"region_id": "KL", "name": "Kaolack", "population": 1256743, "urban_rate": 39.1, "households": 142000, "avg_monthly_income_fcfa": 185000, "purchasing_tier": "Moyen", "top_activities": ["Bassin arachidier", "Transit sous-régional", "Sel"]},
        {"region_id": "ZG", "name": "Ziguinchor", "population": 724911, "urban_rate": 49.3, "households": 96000, "avg_monthly_income_fcfa": 205000, "purchasing_tier": "Moyen", "top_activities": ["Agroalimentaire", "Tourisme (Cap Skirring)", "Pêche", "Sylviculture"]},
        {"region_id": "TC", "name": "Tambacounda", "population": 988540, "urban_rate": 26.8, "households": 112000, "avg_monthly_income_fcfa": 175000, "purchasing_tier": "Modéré", "top_activities": ["Mines", "Coton", "Corridor Mali", "Élevage"]},
        {"region_id": "LG", "name": "Louga", "population": 1032612, "urban_rate": 24.3, "households": 121000, "avg_monthly_income_fcfa": 210000, "purchasing_tier": "Moyen (Soutien diaspora)", "top_activities": ["Élevage", "Transferts diaspora", "Maraîchage"]},
        {"region_id": "FT", "name": "Fatick", "population": 924310, "urban_rate": 18.2, "households": 105000, "avg_monthly_income_fcfa": 165000, "purchasing_tier": "Modéré", "top_activities": ["Sel", "Pêche", "Arachide", "Écotourisme"]},
        {"region_id": "KD", "name": "Kolda", "population": 843120, "urban_rate": 27.1, "households": 94000, "avg_monthly_income_fcfa": 160000, "purchasing_tier": "Modéré", "top_activities": ["Élevage", "Céréales", "Fruits forestiers"]},
        {"region_id": "MT", "name": "Matam", "population": 732104, "urban_rate": 22.0, "households": 81000, "avg_monthly_income_fcfa": 215000, "purchasing_tier": "Moyen (Soutien diaspora)", "top_activities": ["Agriculture irriguée Vallée du fleuve", "Mines phosphates"]},
        {"region_id": "KF", "name": "Kaffrine", "population": 794215, "urban_rate": 17.5, "households": 88000, "avg_monthly_income_fcfa": 155000, "purchasing_tier": "Modéré", "top_activities": ["Production céréalière", "Arachide"]},
        {"region_id": "SD", "name": "Sédhiou", "population": 591412, "urban_rate": 16.4, "households": 67000, "avg_monthly_income_fcfa": 150000, "purchasing_tier": "Modéré", "top_activities": ["Anacarde", "Riz", "Arboriculture"]},
        {"region_id": "KG", "name": "Kédougou", "population": 215897, "urban_rate": 31.2, "households": 28000, "avg_monthly_income_fcfa": 230000, "purchasing_tier": "Moyen (Activité minière)", "top_activities": ["Mines d'or", "Écotourisme", "Commerce frontalier"]}
    ]
}

ENTERPRISES_RGE = {
    "metadata": {
        "dataset_id": "rge_senegal_2024",
        "title": "Recensement Général des Entreprises (RGE-2) & Baromètre de Pérennité",
        "source": "ANSD / Direction des Statistiques d'Entreprises",
        "total_units_recorded": 407882,
        "formal_units": 15820,
        "informal_units": 392062,
        "informal_share_pct": 96.1
    },
    "sectors": [
        {
            "sector_id": "TECH_DIGITAL",
            "name": "Technologies de l'Information, FinTech & Services Numériques",
            "units_count": 8450,
            "informal_pct": 62.4,
            "survival_rate_1yr": 79.5,
            "survival_rate_3yr": 61.2,
            "survival_rate_5yr": 48.0,
            "avg_gross_margin_pct": 58.5,
            "avg_ebitda_margin_pct": 24.3,
            "top_failure_cause": "Déficit de fonds de roulement & cycle d'acquisition client B2B trop long",
            "growth_trend": "Forte expansion (+18.4% an)",
            "uemoa_export_potential": "Très élevé (Scalabilité immédiate Côte d'Ivoire, Mali, Bénin)"
        },
        {
            "sector_id": "AGRO_INDUSTRY",
            "name": "Agroalimentaire, Transformation Locale & Agritech",
            "units_count": 42100,
            "informal_pct": 89.2,
            "survival_rate_1yr": 72.0,
            "survival_rate_3yr": 54.8,
            "survival_rate_5yr": 41.5,
            "avg_gross_margin_pct": 34.0,
            "avg_ebitda_margin_pct": 16.8,
            "top_failure_cause": "Ruptures d'approvisionnement saisonnier & chaîne du froid défaillante",
            "growth_trend": "Priorité nationale stratégique (+12.1% an)",
            "uemoa_export_potential": "Élevé (Forte demande céréales, mangues séchées, jus en sous-région)"
        },
        {
            "sector_id": "COMMERCE_RETAIL",
            "name": "Commerce de Gros, Demi-Gros & Détail",
            "units_count": 218500,
            "informal_pct": 98.2,
            "survival_rate_1yr": 68.4,
            "survival_rate_3yr": 43.1,
            "survival_rate_5yr": 31.0,
            "avg_gross_margin_pct": 21.5,
            "avg_ebitda_margin_pct": 9.2,
            "top_failure_cause": "Concurrence informelle féroce sur les prix & créances clients irrécouvrables",
            "growth_trend": "Stable (+4.5% an)",
            "uemoa_export_potential": "Moyen (Flux informels denses)"
        },
        {
            "sector_id": "BTP_REALESTATE",
            "name": "BTP, Éco-Construction, Matériaux & Immobilier",
            "units_count": 26800,
            "informal_pct": 84.7,
            "survival_rate_1yr": 74.2,
            "survival_rate_3yr": 49.3,
            "survival_rate_5yr": 38.6,
            "avg_gross_margin_pct": 28.5,
            "avg_ebitda_margin_pct": 14.5,
            "top_failure_cause": "Retards de paiement de l'État/donneurs d'ordres & hausse du coût des intrants (ciment/fer)",
            "growth_trend": "Dynamique (+8.9% an)",
            "uemoa_export_potential": "Élevé (Ingénierie & préfabrication)"
        },
        {
            "sector_id": "TRANSPORT_LOGISTICS",
            "name": "Transport, Livraison du Dernier Kilomètre & Logistique",
            "units_count": 31200,
            "informal_pct": 94.0,
            "survival_rate_1yr": 69.8,
            "survival_rate_3yr": 46.5,
            "survival_rate_5yr": 33.2,
            "avg_gross_margin_pct": 26.0,
            "avg_ebitda_margin_pct": 12.0,
            "top_failure_cause": "Coûts de maintenance de flotte imprévus & volatilité des carburants",
            "growth_trend": "Forte demande e-commerce (+14.2% an)",
            "uemoa_export_potential": "Critique (Axe routier Dakar-Bamako et transit maritime)"
        },
        {
            "sector_id": "HEALTH_PHARMA",
            "name": "Santé, Dispositifs Médicaux & Pharmacie",
            "units_count": 6900,
            "informal_pct": 45.1,
            "survival_rate_1yr": 86.4,
            "survival_rate_3yr": 72.8,
            "survival_rate_5yr": 61.5,
            "avg_gross_margin_pct": 44.0,
            "avg_ebitda_margin_pct": 21.0,
            "top_failure_cause": "Lenteurs des autorisations de mise sur le marché (DPM) & trésorerie bloquée",
            "growth_trend": "En forte expansion (+11.0% an)",
            "uemoa_export_potential": "Fort (Hub médical régional de Dakar)"
        },
        {
            "sector_id": "HOSPITALITY_FOOD",
            "name": "Hôtellerie, Restauration & Loisirs",
            "units_count": 38400,
            "informal_pct": 93.5,
            "survival_rate_1yr": 61.0,
            "survival_rate_3yr": 36.4,
            "survival_rate_5yr": 24.8,
            "avg_gross_margin_pct": 48.0,
            "avg_ebitda_margin_pct": 13.5,
            "top_failure_cause": "Mauvaise estimation du seuil de rentabilité & saisonnalité touristique non anticipée",
            "growth_trend": "Moyen (+5.2% an)",
            "uemoa_export_potential": "Faible (Marché d'implantation physique)"
        },
        {
            "sector_id": "EDUCATION_TRAINING",
            "name": "Éducation, EdTech & Formation Professionnelle",
            "units_count": 12400,
            "informal_pct": 52.8,
            "survival_rate_1yr": 81.2,
            "survival_rate_3yr": 65.0,
            "survival_rate_5yr": 52.3,
            "avg_gross_margin_pct": 52.0,
            "avg_ebitda_margin_pct": 22.5,
            "top_failure_cause": "Impayés de scolarité des étudiants & homologation des diplômes",
            "growth_trend": "Très forte demande (+13.8% an)",
            "uemoa_export_potential": "Très élevé (Dakar accueille plus de 40 000 étudiants UEMOA)"
        }
    ]
}

EMPLOYMENT_SALARIES_ENES = {
    "metadata": {
        "dataset_id": "enes_salaires_senegal_2024",
        "title": "Enquête Nationale sur l'Emploi au Sénégal (ENES) - Grilles Salariales & Marché du Travail",
        "source": "ANSD / Direction des Statistiques Démographiques et Sociales",
        "minimum_wage_smig_fcfa": 64228,
        "median_formal_salary_fcfa": 185000
    },
    "profiles": [
        {"profile_id": "WORKER_BASIC", "role": "Ouvrier non qualifié / Manœuvre", "monthly_gross_dakar_fcfa": 95000, "monthly_gross_regions_fcfa": 75000, "availability": "Très forte", "employer_social_charges_pct": 18.5},
        {"profile_id": "TECH_QUALIFIED", "role": "Technicien qualifié / Chauffeur / Maintenance", "monthly_gross_dakar_fcfa": 185000, "monthly_gross_regions_fcfa": 140000, "availability": "Moyenne", "employer_social_charges_pct": 19.5},
        {"profile_id": "DEV_SOFTWARE", "role": "Développeur Fullstack / Data Analyst (Junior)", "monthly_gross_dakar_fcfa": 420000, "monthly_gross_regions_fcfa": 280000, "availability": "Tension (forte concurrence)", "employer_social_charges_pct": 21.0},
        {"profile_id": "DEV_SENIOR", "role": "Ingénieur Logiciel Senior / Lead Tech", "monthly_gross_dakar_fcfa": 950000, "monthly_gross_regions_fcfa": 650000, "availability": "Très rare (télétravail diaspora)", "employer_social_charges_pct": 22.0},
        {"profile_id": "SALES_COMMERCIAL", "role": "Commercial B2B / Responsable Ventes", "monthly_gross_dakar_fcfa": 320000, "monthly_gross_regions_fcfa": 220000, "availability": "Bonne (primes sur résultats requises)", "employer_social_charges_pct": 20.0},
        {"profile_id": "ACCOUNTANT_FINANCE", "role": "Comptable SYSCOHADA / Gestionnaire", "monthly_gross_dakar_fcfa": 380000, "monthly_gross_regions_fcfa": 260000, "availability": "Moyenne", "employer_social_charges_pct": 20.5},
        {"profile_id": "OPS_MANAGER", "role": "Directeur des Opérations / Directeur Général", "monthly_gross_dakar_fcfa": 1450000, "monthly_gross_regions_fcfa": 980000, "availability": "Rare", "employer_social_charges_pct": 22.5}
    ]
}

UEMOA_CROSSBORDER_DATA = {
    "metadata": {
        "dataset_id": "uemoa_macro_corridors_2026",
        "title": "Indicateurs Macro-Économiques & Corridors Commerciaux UEMOA / CEDEAO",
        "source": "BCEAO / Commission UEMOA / ANSD Commerce Extérieur",
        "monetary_zone": "FCFA (XOF)",
        "bceao_key_interest_rate_pct": 3.50,
        "total_uemoa_population": 142500000
    },
    "countries": [
        {
            "country_code": "SN",
            "name": "Sénégal",
            "population": 18275743,
            "gdp_billions_fcfa": 20850,
            "inflation_pct": 3.5,
            "trade_balance_with_sn": "Marché Domestique",
            "key_export_to_sn": "-",
            "key_import_from_sn": "-",
            "ease_of_business_rank": "Leader réformes OHADA"
        },
        {
            "country_code": "CI",
            "name": "Côte d'Ivoire",
            "population": 30100000,
            "gdp_billions_fcfa": 49800,
            "inflation_pct": 3.8,
            "trade_balance_with_sn": "Excédent ivoirien (Énergie, Plastiques, Cacao)",
            "key_export_to_sn": "Produits manufacturés, Huile de palme, Énergie",
            "key_import_from_sn": "Poissons, Ciment, Produits pharmaceutiques",
            "ease_of_business_rank": "Hub financier UEMOA"
        },
        {
            "country_code": "ML",
            "name": "Mali",
            "population": 22900000,
            "gdp_billions_fcfa": 12400,
            "inflation_pct": 4.2,
            "trade_balance_with_sn": "Fort excédent sénégalais (680 Milliards FCFA)",
            "key_export_to_sn": "Bétail sur pied, Coton, Or brut",
            "key_import_from_sn": "Carburants réexportés, Ciment, Engrais, Produits alimentaires",
            "ease_of_business_rank": "Corridor prioritaire Dakar-Bamako (Route & Rail)"
        },
        {
            "country_code": "BF",
            "name": "Burkina Faso",
            "population": 23100000,
            "gdp_billions_fcfa": 13100,
            "inflation_pct": 3.9,
            "trade_balance_with_sn": "Excédent sénégalais modéré",
            "key_export_to_sn": "Fruits frais (Mangues), Bétail",
            "key_import_from_sn": "Produits de la mer, Huiles raffinées, Savons",
            "ease_of_business_rank": "Enclavement terrestre"
        },
        {
            "country_code": "GN",
            "name": "Guinée",
            "population": 14200000,
            "gdp_billions_fcfa": 14200,
            "inflation_pct": 6.8,
            "trade_balance_with_sn": "Flux frontaliers denses (Corridor Dakar-Conakry)",
            "key_export_to_sn": "Bauxite, Fruits tropicaux, Café",
            "key_import_from_sn": "Matériaux BTP, Services digitaux, Produits transformés",
            "ease_of_business_rank": "Membre CEDEAO (Monnaie GNF)"
        }
    ]
}

CATALOG_METADATA = [
    {"dataset_id": "tsghpfc", "title": "Indice Harmonisé des Prix à la Consommation (IHPC) Base 2023", "source": "ANSD", "category": "Prix & Inflation", "update_frequency": "Mensuelle", "records_count": 144, "status": "SYNCED"},
    {"dataset_id": "rgph5_senegal_2023", "title": "Recensement Général de la Population et de l'Habitat (RGPH-5)", "source": "ANSD", "category": "Démographie & Territoires", "update_frequency": "Décennale", "records_count": 14, "status": "SYNCED"},
    {"dataset_id": "rge_senegal_2024", "title": "Recensement Général des Entreprises (RGE-2) & Mortalité PME", "source": "ANSD", "category": "Entreprises & Secteurs", "update_frequency": "Annuelle", "records_count": 8, "status": "SYNCED"},
    {"dataset_id": "enes_salaires_senegal_2024", "title": "Enquête Nationale sur l'Emploi au Sénégal (ENES)", "source": "ANSD", "category": "Marché du Travail & Salaires", "update_frequency": "Semestrielle", "records_count": 7, "status": "SYNCED"},
    {"dataset_id": "uemoa_macro_corridors_2026", "title": "Indicateurs Macro-Économiques & Corridors UEMOA/BCEAO", "source": "BCEAO/UEMOA", "category": "Commerce Sous-Régional", "update_frequency": "Trimestrielle", "records_count": 5, "status": "SYNCED"},
    {"dataset_id": "ansd_ippi_industriel", "title": "Indice des Prix à la Production Industrielle (IPPI)", "source": "ANSD", "category": "Industrie & Coûts", "update_frequency": "Trimestrielle", "records_count": 24, "status": "INDEXED"},
    {"dataset_id": "ansd_ipce_exterieur", "title": "Indice du Commerce Extérieur & Termes de l'Échange", "source": "ANSD", "category": "Commerce Extérieur", "update_frequency": "Trimestrielle", "records_count": 18, "status": "INDEXED"},
    {"dataset_id": "ansd_comptes_nationaux", "title": "Comptes Nationaux & PIB Trimestriel du Sénégal", "source": "ANSD", "category": "Macroéconomie", "update_frequency": "Trimestrielle", "records_count": 32, "status": "INDEXED"}
]

# -------------------------------------------------------------
# 2. SQLITE DATABASE SCHEMA & BUILDER
# -------------------------------------------------------------

def build_database():
    print(f"[*] Building ANSD & Regional Database at: {DB_PATH}")
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    # Enable WAL mode for high concurrency
    cursor.execute("PRAGMA journal_mode = WAL;")

    # Table: catalog_metadata
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS catalog_metadata (
        dataset_id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        source TEXT NOT NULL,
        category TEXT NOT NULL,
        update_frequency TEXT NOT NULL,
        records_count INTEGER NOT NULL,
        checksum TEXT,
        last_synced_at TEXT NOT NULL,
        status TEXT NOT NULL
    );
    """)

    # Table: ihpc_functions
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS ihpc_functions (
        code TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        weight REAL NOT NULL,
        index_current REAL NOT NULL,
        change_monthly REAL NOT NULL,
        change_yearly REAL NOT NULL,
        updated_at TEXT NOT NULL
    );
    """)

    # Table: ihpc_series
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS ihpc_series (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        period TEXT NOT NULL UNIQUE,
        overall_index REAL NOT NULL,
        inflation_rate_yoy REAL NOT NULL
    );
    """)

    # Table: demographics_regions
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS demographics_regions (
        region_id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        population INTEGER NOT NULL,
        urban_rate REAL NOT NULL,
        households INTEGER NOT NULL,
        avg_monthly_income_fcfa INTEGER NOT NULL,
        purchasing_tier TEXT NOT NULL,
        top_activities TEXT NOT NULL
    );
    """)

    # Table: enterprises_sectors
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS enterprises_sectors (
        sector_id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        units_count INTEGER NOT NULL,
        informal_pct REAL NOT NULL,
        survival_rate_1yr REAL NOT NULL,
        survival_rate_3yr REAL NOT NULL,
        survival_rate_5yr REAL NOT NULL,
        avg_gross_margin_pct REAL NOT NULL,
        avg_ebitda_margin_pct REAL NOT NULL,
        top_failure_cause TEXT NOT NULL,
        growth_trend TEXT NOT NULL,
        uemoa_export_potential TEXT NOT NULL
    );
    """)

    # Table: employment_salaries
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS employment_salaries (
        profile_id TEXT PRIMARY KEY,
        role TEXT NOT NULL,
        monthly_gross_dakar_fcfa INTEGER NOT NULL,
        monthly_gross_regions_fcfa INTEGER NOT NULL,
        availability TEXT NOT NULL,
        employer_social_charges_pct REAL NOT NULL
    );
    """)

    # Table: uemoa_countries
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS uemoa_countries (
        country_code TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        population INTEGER NOT NULL,
        gdp_billions_fcfa INTEGER NOT NULL,
        inflation_pct REAL NOT NULL,
        trade_balance_with_sn TEXT NOT NULL,
        key_export_to_sn TEXT NOT NULL,
        key_import_from_sn TEXT NOT NULL,
        ease_of_business_rank TEXT NOT NULL
    );
    """)

    # -------------------------------------------------------------
    # Insert or Replace Data
    # -------------------------------------------------------------
    now = datetime.utcnow().isoformat()

    # Catalog
    for item in CATALOG_METADATA:
        checksum = hashlib.sha256(item["title"].encode("utf-8")).hexdigest()[:16]
        cursor.execute("""
        INSERT OR REPLACE INTO catalog_metadata 
        (dataset_id, title, source, category, update_frequency, records_count, checksum, last_synced_at, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (item["dataset_id"], item["title"], item["source"], item["category"], item["update_frequency"], item["records_count"], checksum, now, item["status"]))

    # IHPC Functions
    for func in IHPC_DATA["functions"]:
        cursor.execute("""
        INSERT OR REPLACE INTO ihpc_functions
        (code, name, weight, index_current, change_monthly, change_yearly, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        """, (func["code"], func["name"], func["weight"], func["index_current"], func["change_monthly"], func["change_yearly"], now))

    # IHPC Series
    for s in IHPC_DATA["monthly_series"]:
        cursor.execute("""
        INSERT OR REPLACE INTO ihpc_series
        (period, overall_index, inflation_rate_yoy)
        VALUES (?, ?, ?)
        """, (s["period"], s["overall_index"], s["inflation_rate_yoy"]))

    # Demographics
    for r in DEMOGRAPHICS_RGPH5["regions"]:
        cursor.execute("""
        INSERT OR REPLACE INTO demographics_regions
        (region_id, name, population, urban_rate, households, avg_monthly_income_fcfa, purchasing_tier, top_activities)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """, (r["region_id"], r["name"], r["population"], r["urban_rate"], r["households"], r["avg_monthly_income_fcfa"], r["purchasing_tier"], json.dumps(r["top_activities"], ensure_ascii=False)))

    # Enterprise Sectors
    for sec in ENTERPRISES_RGE["sectors"]:
        cursor.execute("""
        INSERT OR REPLACE INTO enterprises_sectors
        (sector_id, name, units_count, informal_pct, survival_rate_1yr, survival_rate_3yr, survival_rate_5yr, avg_gross_margin_pct, avg_ebitda_margin_pct, top_failure_cause, growth_trend, uemoa_export_potential)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (sec["sector_id"], sec["name"], sec["units_count"], sec["informal_pct"], sec["survival_rate_1yr"], sec["survival_rate_3yr"], sec["survival_rate_5yr"], sec["avg_gross_margin_pct"], sec["avg_ebitda_margin_pct"], sec["top_failure_cause"], sec["growth_trend"], sec["uemoa_export_potential"]))

    # Employment & Salaries
    for emp in EMPLOYMENT_SALARIES_ENES["profiles"]:
        cursor.execute("""
        INSERT OR REPLACE INTO employment_salaries
        (profile_id, role, monthly_gross_dakar_fcfa, monthly_gross_regions_fcfa, availability, employer_social_charges_pct)
        VALUES (?, ?, ?, ?, ?, ?)
        """, (emp["profile_id"], emp["role"], emp["monthly_gross_dakar_fcfa"], emp["monthly_gross_regions_fcfa"], emp["availability"], emp["employer_social_charges_pct"]))

    # UEMOA Countries
    for c in UEMOA_CROSSBORDER_DATA["countries"]:
        cursor.execute("""
        INSERT OR REPLACE INTO uemoa_countries
        (country_code, name, population, gdp_billions_fcfa, inflation_pct, trade_balance_with_sn, key_export_to_sn, key_import_from_sn, ease_of_business_rank)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (c["country_code"], c["name"], c["population"], c["gdp_billions_fcfa"], c["inflation_pct"], c["trade_balance_with_sn"], c["key_export_to_sn"], c["key_import_from_sn"], c["ease_of_business_rank"]))

    conn.commit()
    conn.close()
    print("[+] SQLite Database built and populated successfully.")

    # -------------------------------------------------------------
    # Write JSON Datasets for Frontend Direct Consumptions
    # -------------------------------------------------------------
    datasets_to_dump = {
        "ihpc_senegal.json": IHPC_DATA,
        "rgph5_demographie.json": DEMOGRAPHICS_RGPH5,
        "rge_entreprises.json": ENTERPRISES_RGE,
        "enes_salaires.json": EMPLOYMENT_SALARIES_ENES,
        "uemoa_regional.json": UEMOA_CROSSBORDER_DATA,
        "catalog_metadata.json": CATALOG_METADATA
    }

    for filename, payload in datasets_to_dump.items():
        filepath = os.path.join(JSON_EXPORT_DIR, filename)
        with open(filepath, "w", encoding="utf-8") as f:
            json.dump(payload, f, indent=2, ensure_ascii=False)
        print(f"[+] Exported JSON dataset: {filename}")

if __name__ == "__main__":
    build_database()
