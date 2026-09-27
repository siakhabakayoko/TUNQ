import { getTursoClient } from './client';

let tablesInitialized = false;

/**
 * Initialise le schéma relationnel dans Turso / LibSQL.
 * Exécute les migrations CREATE TABLE IF NOT EXISTS.
 */
export async function initTursoSchema(): Promise<void> {
  if (tablesInitialized) {
    return;
  }

  const client = getTursoClient();

  await client.executeMultiple(`
    CREATE TABLE IF NOT EXISTS projects (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      sector_id TEXT NOT NULL,
      region_id TEXT NOT NULL,
      description TEXT,
      is_uemoa_target INTEGER DEFAULT 0,
      uemoa_target_country TEXT,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS evaluations (
      id TEXT PRIMARY KEY,
      project_id TEXT NOT NULL,
      unit_price_fcfa REAL NOT NULL,
      unit_cost_fcfa REAL NOT NULL,
      monthly_fixed_costs_fcfa REAL NOT NULL,
      target_monthly_sales_volume INTEGER NOT NULL,
      breakeven_units REAL NOT NULL,
      breakeven_revenue_fcfa REAL NOT NULL,
      gross_margin_pct REAL NOT NULL,
      working_capital_rec_fcfa REAL NOT NULL,
      verdict TEXT NOT NULL,
      confidence_score REAL NOT NULL,
      gemini_analysis_json TEXT NOT NULL,
      created_at TEXT NOT NULL,
      FOREIGN KEY (project_id) REFERENCES projects(id)
    );

    CREATE TABLE IF NOT EXISTS documents (
      id TEXT PRIMARY KEY,
      organization_id TEXT NOT NULL,
      title TEXT NOT NULL,
      category TEXT NOT NULL,
      file_size_mb REAL NOT NULL,
      source TEXT NOT NULL,
      status TEXT NOT NULL,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS ansd_datasets (
      dataset_id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      category TEXT NOT NULL,
      payload_json TEXT NOT NULL,
      last_sync TEXT NOT NULL
    );
  `);

  tablesInitialized = true;
}

