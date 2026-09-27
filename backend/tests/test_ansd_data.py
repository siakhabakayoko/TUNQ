#!/usr/bin/env python3
"""
Unit and Integration Tests for ANSD Master Data Lake & Financial Models.
Verifies SQLite schema, dataset completeness, delta audit integrity,
and quantitative metrics calculations.
"""

import unittest
import os
import sqlite3
import json

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
DB_PATH = os.path.join(BASE_DIR, "data", "ansd_master.db")
DATASETS_DIR = os.path.join(BASE_DIR, "data", "datasets")

class TestAnsdDataLake(unittest.TestCase):

    def setUp(self):
        self.assertTrue(os.path.exists(DB_PATH), f"Database not found at {DB_PATH}")
        self.conn = sqlite3.connect(DB_PATH)
        self.cursor = self.conn.cursor()

    def tearDown(self):
        self.conn.close()

    def test_database_tables_exist(self):
        """Test that all required database tables exist."""
        required_tables = [
            "catalog_metadata",
            "ihpc_functions",
            "ihpc_series",
            "demographics_regions",
            "enterprises_sectors",
            "employment_salaries",
            "uemoa_countries"
        ]
        self.cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
        existing_tables = [row[0] for row in self.cursor.fetchall()]
        for table in required_tables:
            self.assertIn(table, existing_tables, f"Table '{table}' is missing from database.")

    def test_ihpc_coicop_weights_sum(self):
        """Test that the 12 COICOP consumption functions approximate 1000‰."""
        self.cursor.execute("SELECT SUM(weight) FROM ihpc_functions;")
        total_weight = self.cursor.fetchone()[0]
        self.assertAlmostEqual(total_weight, 1000.0, delta=10.0, msg="Total IHPC weights must sum to ~1000‰")

    def test_demographics_14_regions_coverage(self):
        """Test that all 14 official administrative regions of Senegal are present."""
        self.cursor.execute("SELECT COUNT(*) FROM demographics_regions;")
        count = self.cursor.fetchone()[0]
        self.assertEqual(count, 14, "Senegal must have exactly 14 administrative regions in RGPH-5.")

    def test_enterprise_survival_rates(self):
        """Test that 3-year survival rates are strictly between 0 and 100%."""
        self.cursor.execute("SELECT survival_rate_3yr FROM enterprises_sectors;")
        rates = [row[0] for row in self.cursor.fetchall()]
        self.assertTrue(len(rates) >= 8, "Expected at least 8 economic sectors.")
        for r in rates:
            self.assertGreater(r, 0.0)
            self.assertLess(r, 100.0)

    def test_uemoa_crossborder_corridors(self):
        """Test that Senegal and key trade partners (Mali, Ivory Coast) are populated."""
        self.cursor.execute("SELECT country_code FROM uemoa_countries;")
        codes = [row[0] for row in self.cursor.fetchall()]
        self.assertIn("SN", codes)
        self.assertIn("ML", codes)
        self.assertIn("CI", codes)

    def test_json_datasets_synced(self):
        """Test that JSON exports exist and are valid JSON."""
        expected_files = [
            "ihpc_senegal.json",
            "rgph5_demographie.json",
            "rge_entreprises.json",
            "enes_salaires.json",
            "uemoa_regional.json",
            "catalog_metadata.json"
        ]
        for fname in expected_files:
            fpath = os.path.join(DATASETS_DIR, fname)
            self.assertTrue(os.path.exists(fpath), f"JSON file missing: {fname}")
            with open(fpath, "r", encoding="utf-8") as f:
                data = json.load(f)
                self.assertIsNotNone(data)

if __name__ == "__main__":
    unittest.main()
