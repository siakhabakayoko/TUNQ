import { getTursoClient } from './client';
import { initTursoSchema } from './schema';
import type { ProjectEntity, EvaluationEntity, DocumentEntity } from './types';
import crypto from 'crypto';

/**
 * Enregistre un projet ou met à jour ses métadonnées.
 */
export async function saveProject(project: {
  id?: string;
  title: string;
  sector_id: string;
  region_id: string;
  description: string;
  is_uemoa_target: number;
  uemoa_target_country?: string | null;
}): Promise<ProjectEntity> {
  await initTursoSchema();
  const client = getTursoClient();

  const id = project.id || `proj_${crypto.randomUUID().slice(0, 8)}`;
  const now = new Date().toISOString();

  await client.execute({
    sql: `
      INSERT INTO projects (id, title, sector_id, region_id, description, is_uemoa_target, uemoa_target_country, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET
        title = excluded.title,
        sector_id = excluded.sector_id,
        region_id = excluded.region_id,
        description = excluded.description,
        is_uemoa_target = excluded.is_uemoa_target,
        uemoa_target_country = excluded.uemoa_target_country;
    `,
    args: [
      id,
      project.title,
      project.sector_id,
      project.region_id,
      project.description,
      project.is_uemoa_target,
      project.uemoa_target_country || null,
      now,
    ],
  });

  return {
    id,
    title: project.title,
    sector_id: project.sector_id,
    region_id: project.region_id,
    description: project.description,
    is_uemoa_target: project.is_uemoa_target,
    uemoa_target_country: project.uemoa_target_country,
    created_at: now,
  };
}

/**
 * Enregistre une évaluation financière et stratégique liée à un projet.
 */
export async function saveEvaluation(evaluation: Omit<EvaluationEntity, 'id' | 'created_at'>): Promise<EvaluationEntity> {
  await initTursoSchema();
  const client = getTursoClient();

  const id = `eval_${crypto.randomUUID().slice(0, 8)}`;
  const now = new Date().toISOString();

  await client.execute({
    sql: `
      INSERT INTO evaluations (
        id, project_id, unit_price_fcfa, unit_cost_fcfa, monthly_fixed_costs_fcfa,
        target_monthly_sales_volume, breakeven_units, breakeven_revenue_fcfa,
        gross_margin_pct, working_capital_rec_fcfa, verdict, confidence_score,
        gemini_analysis_json, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
    `,
    args: [
      id,
      evaluation.project_id,
      evaluation.unit_price_fcfa,
      evaluation.unit_cost_fcfa,
      evaluation.monthly_fixed_costs_fcfa,
      evaluation.target_monthly_sales_volume,
      evaluation.breakeven_units,
      evaluation.breakeven_revenue_fcfa,
      evaluation.gross_margin_pct,
      evaluation.working_capital_rec_fcfa,
      evaluation.verdict,
      evaluation.confidence_score,
      evaluation.gemini_analysis_json,
      now,
    ],
  });

  return {
    ...evaluation,
    id,
    created_at: now,
  };
}

/**
 * Récupère les évaluations récentes avec les métadonnées de projet.
 */
export async function getRecentEvaluations(limit: number = 10): Promise<
  Array<{
    evaluation: EvaluationEntity;
    project: ProjectEntity;
  }>
> {
  await initTursoSchema();
  const client = getTursoClient();

  const result = await client.execute({
    sql: `
      SELECT 
        e.id as eval_id, e.project_id, e.unit_price_fcfa, e.unit_cost_fcfa, e.monthly_fixed_costs_fcfa,
        e.target_monthly_sales_volume, e.breakeven_units, e.breakeven_revenue_fcfa, e.gross_margin_pct,
        e.working_capital_rec_fcfa, e.verdict, e.confidence_score, e.gemini_analysis_json, e.created_at as eval_created_at,
        p.id as proj_id, p.title as proj_title, p.sector_id, p.region_id, p.description,
        p.is_uemoa_target, p.uemoa_target_country, p.created_at as proj_created_at
      FROM evaluations e
      JOIN projects p ON e.project_id = p.id
      ORDER BY e.created_at DESC
      LIMIT ?;
    `,
    args: [limit],
  });

  return result.rows.map((r) => ({
    evaluation: {
      id: String(r.eval_id),
      project_id: String(r.project_id),
      unit_price_fcfa: Number(r.unit_price_fcfa),
      unit_cost_fcfa: Number(r.unit_cost_fcfa),
      monthly_fixed_costs_fcfa: Number(r.monthly_fixed_costs_fcfa),
      target_monthly_sales_volume: Number(r.target_monthly_sales_volume),
      breakeven_units: Number(r.breakeven_units),
      breakeven_revenue_fcfa: Number(r.breakeven_revenue_fcfa),
      gross_margin_pct: Number(r.gross_margin_pct),
      working_capital_rec_fcfa: Number(r.working_capital_rec_fcfa),
      verdict: String(r.verdict) as EvaluationEntity['verdict'],
      confidence_score: Number(r.confidence_score),
      gemini_analysis_json: String(r.gemini_analysis_json),
      created_at: String(r.eval_created_at),
    },
    project: {
      id: String(r.proj_id),
      title: String(r.proj_title),
      sector_id: String(r.sector_id),
      region_id: String(r.region_id),
      description: String(r.description || ''),
      is_uemoa_target: Number(r.is_uemoa_target),
      uemoa_target_country: r.uemoa_target_country ? String(r.uemoa_target_country) : null,
      created_at: String(r.proj_created_at),
    },
  }));
}

/**
 * Récupère les documents enregistrés dans la Data Room.
 */
export async function getDocuments(organizationId: string = 'ORG_SN_88204'): Promise<DocumentEntity[]> {
  await initTursoSchema();
  const client = getTursoClient();

  const result = await client.execute({
    sql: `SELECT * FROM documents WHERE organization_id = ? ORDER BY created_at DESC;`,
    args: [organizationId],
  });

  return result.rows.map((r) => ({
    id: String(r.id),
    organization_id: String(r.organization_id),
    title: String(r.title),
    category: String(r.category),
    file_size_mb: Number(r.file_size_mb),
    source: String(r.source) as DocumentEntity['source'],
    status: String(r.status) as DocumentEntity['status'],
    created_at: String(r.created_at),
  }));
}

/**
 * Ajoute un document dans la Data Room.
 */
export async function addDocument(doc: {
  organization_id?: string;
  title: string;
  category: string;
  file_size_mb: number;
  source: 'upload' | 'gdrive' | 'gmail';
  status?: 'Indexé' | 'Analysé' | 'En attente';
}): Promise<DocumentEntity> {
  await initTursoSchema();
  const client = getTursoClient();

  const id = `doc_${crypto.randomUUID().slice(0, 8)}`;
  const org = doc.organization_id || 'ORG_SN_88204';
  const status = doc.status || 'Indexé';
  const now = new Date().toISOString();

  await client.execute({
    sql: `
      INSERT INTO documents (id, organization_id, title, category, file_size_mb, source, status, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?);
    `,
    args: [id, org, doc.title, doc.category, doc.file_size_mb, doc.source, status, now],
  });

  return {
    id,
    organization_id: org,
    title: doc.title,
    category: doc.category,
    file_size_mb: doc.file_size_mb,
    source: doc.source,
    status,
    created_at: now,
  };
}
