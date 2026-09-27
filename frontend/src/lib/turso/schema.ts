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

  // Initialisation des documents de base dans la Data Room si la table est vide
  const docsCount = await client.execute('SELECT count(*) as count FROM documents;');
  const rowCount = Number(docsCount.rows[0]?.count ?? 0);

  if (rowCount === 0) {
    const initialDocs = [
      {
        id: 'doc_syscohada_01',
        org: 'ORG_SN_88204',
        title: 'bilan_comptable_syscohada_2025.xlsx',
        cat: 'Bilan & Comptes de Résultat (SYSCOHADA)',
        size: 1.18,
        source: 'gdrive',
        status: 'Indexé',
        date: '2026-09-15T10:00:00Z',
      },
      {
        id: 'doc_etude_02',
        org: 'ORG_SN_88204',
        title: 'etude_terrain_consommateurs_dakar.pdf',
        cat: 'Enquête terrain & Étude de marché',
        size: 4.01,
        source: 'upload',
        status: 'Analysé',
        date: '2026-09-18T14:30:00Z',
      },
      {
        id: 'doc_devis_03',
        org: 'ORG_SN_88204',
        title: 'devis_fournisseurs_intrants_chine_turquie.pdf',
        cat: 'Devis & Factures Proforma',
        size: 0.81,
        source: 'gmail',
        status: 'Indexé',
        date: '2026-09-20T09:15:00Z',
      },
      {
        id: 'doc_statuts_04',
        org: 'ORG_SN_88204',
        title: 'pacte_actionnaires_statuts_ohada.pdf',
        cat: "Statuts d'entreprise (OHADA)",
        size: 1.72,
        source: 'upload',
        status: 'Indexé',
        date: '2026-09-22T16:00:00Z',
      },
    ];

    for (const doc of initialDocs) {
      await client.execute({
        sql: `INSERT INTO documents (id, organization_id, title, category, file_size_mb, source, status, created_at)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?);`,
        args: [doc.id, doc.org, doc.title, doc.cat, doc.size, doc.source, doc.status, doc.date],
      });
    }
  }

  tablesInitialized = true;
}
