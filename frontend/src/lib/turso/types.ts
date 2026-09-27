/**
 * Modèles de données pour la couche de persistance Turso (LibSQL)
 */

export interface ProjectEntity {
  id: string;
  title: string;
  sector_id: string;
  region_id: string;
  description: string;
  is_uemoa_target: number; // 0 ou 1
  uemoa_target_country?: string | null;
  created_at: string;
}

export interface EvaluationEntity {
  id: string;
  project_id: string;
  unit_price_fcfa: number;
  unit_cost_fcfa: number;
  monthly_fixed_costs_fcfa: number;
  target_monthly_sales_volume: number;
  breakeven_units: number;
  breakeven_revenue_fcfa: number;
  gross_margin_pct: number;
  working_capital_rec_fcfa: number;
  verdict: 'VIABLE_IMMÉDIAT' | 'VIABLE_SOUS_CONDITIONS' | 'NON_VIABLE' | 'PIVOT_REQUIS';
  confidence_score: number;
  gemini_analysis_json: string; // JSON sérialisé de l'analyse IA
  created_at: string;
}

export interface DocumentEntity {
  id: string;
  organization_id: string;
  title: string;
  category: string;
  file_size_mb: number;
  source: 'upload' | 'gdrive' | 'gmail';
  status: 'Indexé' | 'Analysé' | 'En attente';
  created_at: string;
}

export interface TursoConnectionStatus {
  mode: 'turso_cloud' | 'local_libsql';
  url: string;
  isConfigured: boolean;
  connected: boolean;
}
