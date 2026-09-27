import React, { useState } from 'react';
import {
  getIhpcData,
  getAllRegions,
  getAllSectors,
  getSalaryProfiles,
  getUemoaCountries,
  getCatalogMetadata
} from '@/lib/ansd-service';
import { TechWindow } from '@/components/typesafe-ui/TechWindow';
import { Database, TrendingUp, Users, Briefcase, DollarSign, Globe, CheckCircle, RefreshCw } from 'lucide-react';

export const AnsdDataExplorer: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'ihpc' | 'rgph5' | 'rge' | 'enes' | 'uemoa' | 'catalog'>('ihpc');

  const ihpc = getIhpcData();
  const regions = getAllRegions();
  const sectors = getAllSectors();
  const salaries = getSalaryProfiles();
  const uemoaCountries = getUemoaCountries();
  const catalog = getCatalogMetadata();

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Banner: Transparency & Credibility */}
      <div className="border border-border bg-secondary/40 p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 font-mono shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <Database className="h-4 w-4 text-primary" />
            <span className="text-sm font-bold text-foreground uppercase tracking-wider">
              OBSERVATOIRE ÉCONOMIQUE ANSD & UEMOA // DATA LAKE SÉNÉGAL
            </span>
          </div>
          <div className="text-xs text-muted-foreground mt-1 font-sans">
            Base officielle de 158 jeux de données statistiques certifiés (ANSD, BCEAO, BAD) alimentant les modèles d’arbitrage décisionnels.
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-muted-foreground border border-border bg-card px-2.5 py-1 font-semibold">
            CYCLE : MENSUEL (DELTA SYNC)
          </span>
          <span className="text-[10px] text-emerald-700 border border-emerald-300 bg-emerald-50 px-2.5 py-1 font-bold">
            ● INTÉGRITÉ SHA-256 CONTRÔLÉE
          </span>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="flex flex-wrap gap-1.5 border-b border-border pb-2.5 font-mono text-xs">
        <button
          onClick={() => setActiveTab('ihpc')}
          className={`px-3 py-2 border transition-all flex items-center gap-1.5 ${
            activeTab === 'ihpc'
              ? 'bg-primary text-primary-foreground border-primary font-bold shadow-xs'
              : 'border-border bg-card text-muted-foreground hover:text-foreground hover:bg-muted'
          }`}
        >
          <TrendingUp className="h-3.5 w-3.5" /> [ IHPC 2023 // INFLATION ]
        </button>

        <button
          onClick={() => setActiveTab('rgph5')}
          className={`px-3 py-2 border transition-all flex items-center gap-1.5 ${
            activeTab === 'rgph5'
              ? 'bg-primary text-primary-foreground border-primary font-bold shadow-xs'
              : 'border-border bg-card text-muted-foreground hover:text-foreground hover:bg-muted'
          }`}
        >
          <Users className="h-3.5 w-3.5" /> [ RGPH-5 // 14 RÉGIONS ]
        </button>

        <button
          onClick={() => setActiveTab('rge')}
          className={`px-3 py-2 border transition-all flex items-center gap-1.5 ${
            activeTab === 'rge'
              ? 'bg-primary text-primary-foreground border-primary font-bold shadow-xs'
              : 'border-border bg-card text-muted-foreground hover:text-foreground hover:bg-muted'
          }`}
        >
          <Briefcase className="h-3.5 w-3.5" /> [ RGE-2 // SURVIE PME ]
        </button>

        <button
          onClick={() => setActiveTab('enes')}
          className={`px-3 py-2 border transition-all flex items-center gap-1.5 ${
            activeTab === 'enes'
              ? 'bg-primary text-primary-foreground border-primary font-bold shadow-xs'
              : 'border-border bg-card text-muted-foreground hover:text-foreground hover:bg-muted'
          }`}
        >
          <DollarSign className="h-3.5 w-3.5" /> [ ENES // SALAIRES ]
        </button>

        <button
          onClick={() => setActiveTab('uemoa')}
          className={`px-3 py-2 border transition-all flex items-center gap-1.5 ${
            activeTab === 'uemoa'
              ? 'bg-primary text-primary-foreground border-primary font-bold shadow-xs'
              : 'border-border bg-card text-muted-foreground hover:text-foreground hover:bg-muted'
          }`}
        >
          <Globe className="h-3.5 w-3.5" /> [ UEMOA // CORRIDORS ]
        </button>

        <button
          onClick={() => setActiveTab('catalog')}
          className={`px-3 py-2 border transition-all flex items-center gap-1.5 ${
            activeTab === 'catalog'
              ? 'bg-primary text-primary-foreground border-primary font-bold shadow-xs'
              : 'border-border bg-card text-muted-foreground hover:text-foreground hover:bg-muted'
          }`}
        >
          <RefreshCw className="h-3.5 w-3.5" /> [ CATALOGUE & AUDIT DELTA ]
        </button>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* TAB 1: IHPC (PRIX & INFLATION) */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'ihpc' && (
        <TechWindow
          title="INDICE HARMONISÉ DES PRIX À LA CONSOMMATION // IHPC BASE 100 EN 2023"
          badge="12 POSTES COICOP"
          badgeColor="emerald"
        >
          {/* Monthly Trajectory Sparkline Bar */}
          <div className="bg-secondary/40 border border-border p-4 mb-6 font-mono text-xs shadow-xs">
            <div className="flex justify-between items-center mb-3">
              <span className="font-bold text-foreground">HISTORIQUE RÉCENT DE L'INFLATION ANNUELLE (GLISSEMENT ANNUEL %)</span>
              <span className="text-emerald-700 font-bold">DERNIÈRE PARUTION : 2026-08 (3,5% a/a)</span>
            </div>
            <div className="grid grid-cols-6 md:grid-cols-12 gap-1.5 items-end h-20 pt-4 border-b border-border pb-1">
              {ihpc.monthly_series.map((s, idx) => (
                <div key={idx} className="flex flex-col items-center gap-1">
                  <span className="text-[9px] text-muted-foreground font-semibold">{s.inflation_rate_yoy}%</span>
                  <div
                    className="w-full bg-primary hover:opacity-80 transition-all"
                    style={{ height: `${Math.max(10, s.inflation_rate_yoy * 14)}px` }}
                  />
                  <span className="text-[8px] text-muted-foreground truncate w-full text-center">
                    {s.period.slice(5)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Functions of Consumption Table */}
          <div className="overflow-x-auto border border-border shadow-xs">
            <table className="w-full text-left font-mono text-xs">
              <thead className="bg-secondary text-foreground font-bold border-b border-border">
                <tr>
                  <th className="p-3">CODE</th>
                  <th className="p-3">FONCTION DE CONSOMMATION</th>
                  <th className="p-3 text-right">PONDÉRATION (‰)</th>
                  <th className="p-3 text-right">INDICE ACTUEL</th>
                  <th className="p-3 text-right">VAR. MENSUELLE</th>
                  <th className="p-3 text-right">VAR. ANNUELLE</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border bg-card">
                {ihpc.functions.map((f) => (
                  <tr key={f.code} className="hover:bg-muted/40 transition-colors">
                    <td className="p-3 font-bold text-foreground/80">{f.code}</td>
                    <td className="p-3 text-foreground font-sans">{f.name}</td>
                    <td className="p-3 text-right text-muted-foreground">{f.weight.toFixed(1)}</td>
                    <td className="p-3 text-right font-bold text-foreground">{f.index_current}</td>
                    <td className={`p-3 text-right font-semibold ${f.change_monthly >= 0 ? 'text-amber-800' : 'text-emerald-700'}`}>
                      {f.change_monthly >= 0 ? `+${f.change_monthly}%` : `${f.change_monthly}%`}
                    </td>
                    <td className="p-3 text-right font-semibold text-foreground/80">
                      +{f.change_yearly}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TechWindow>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 2: RGPH-5 (DÉMOGRAPHIE PAR RÉGION) */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'rgph5' && (
        <TechWindow
          title="RECENSEMENT GÉNÉRAL DE LA POPULATION ET DE L'HABITAT // RGPH-5 SÉNÉGAL"
          badge="18 275 743 HABITANTS"
          badgeColor="emerald"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 font-mono text-xs">
            {regions.map((r) => (
              <div key={r.region_id} className="border border-border bg-card p-4 flex flex-col justify-between shadow-xs">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-bold text-foreground">[{r.region_id}] {r.name}</span>
                    <span className="text-[10px] px-1.5 py-0.5 border border-border bg-secondary text-foreground font-semibold">
                      {r.urban_rate}% URBAIN
                    </span>
                  </div>
                  <div className="space-y-1.5 text-muted-foreground">
                    <div className="flex justify-between">
                      <span>Population :</span>
                      <span className="font-bold text-foreground">{r.population.toLocaleString('fr-FR')} hab.</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Ménages estimés :</span>
                      <span className="text-foreground">{r.households.toLocaleString('fr-FR')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Revenu mensuel moyen :</span>
                      <span className="text-emerald-700 font-bold">{r.avg_monthly_income_fcfa.toLocaleString('fr-FR')} FCFA</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Niveau pouvoir d'achat :</span>
                      <span className="text-foreground font-semibold">{r.purchasing_tier}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-3 pt-2.5 border-t border-border">
                  <span className="text-[10px] text-muted-foreground uppercase block mb-1 font-semibold">Activités dominantes :</span>
                  <div className="flex flex-wrap gap-1">
                    {r.top_activities.map((act, i) => (
                      <span key={i} className="text-[9px] bg-secondary border border-border px-1.5 py-0.5 text-foreground">
                        {act}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TechWindow>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 3: RGE-2 (PÉRENNITÉ SECTORIELLE & TAUX DE SURVIE) */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'rge' && (
        <TechWindow
          title="RECENSEMENT GÉNÉRAL DES ENTREPRISES // RGE-2 & STATISTIQUES DE SURVIE"
          badge="407 882 ENTREPRISES"
          badgeColor="amber"
        >
          <div className="space-y-4 font-mono text-xs">
            {sectors.map((s) => (
              <div key={s.sector_id} className="border border-border bg-card p-4 shadow-xs">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2 mb-3">
                  <div>
                    <span className="text-sm font-bold text-foreground">{s.name}</span>
                    <span className="text-muted-foreground ml-2">({s.units_count.toLocaleString('fr-FR')} unités - {s.informal_pct}% informel)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-foreground bg-secondary border border-border px-2 py-0.5 font-semibold">
                      {s.growth_trend}
                    </span>
                  </div>
                </div>

                {/* Survival Gauges */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                  <div className="border border-border p-2.5 bg-secondary/30">
                    <div className="flex justify-between text-[10px] text-muted-foreground mb-1 font-semibold">
                      <span>SURVIE À 1 AN</span>
                      <span className="text-emerald-700 font-bold">{s.survival_rate_1yr}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-border">
                      <div className="h-full bg-emerald-600" style={{ width: `${s.survival_rate_1yr}%` }} />
                    </div>
                  </div>

                  <div className="border border-border p-2.5 bg-secondary/30">
                    <div className="flex justify-between text-[10px] text-muted-foreground mb-1 font-semibold">
                      <span>SURVIE À 3 ANS (CRITIQUE)</span>
                      <span className="text-primary font-bold">{s.survival_rate_3yr}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-border">
                      <div className="h-full bg-primary" style={{ width: `${s.survival_rate_3yr}%` }} />
                    </div>
                  </div>

                  <div className="border border-border p-2.5 bg-secondary/30">
                    <div className="flex justify-between text-[10px] text-muted-foreground mb-1 font-semibold">
                      <span>SURVIE À 5 ANS</span>
                      <span className="text-amber-800 font-bold">{s.survival_rate_5yr}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-border">
                      <div className="h-full bg-amber-600" style={{ width: `${s.survival_rate_5yr}%` }} />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px] pt-2.5 border-t border-border">
                  <div>
                    <span className="text-muted-foreground">Marge brute moyenne : </span>
                    <span className="text-foreground font-bold">{s.avg_gross_margin_pct}%</span>
                    <span className="text-muted-foreground ml-3">EBITDA moyen : </span>
                    <span className="text-emerald-700 font-bold">{s.avg_ebitda_margin_pct}%</span>
                  </div>
                  <div>
                    <span className="text-destructive font-semibold">Cause n°1 d’échec : </span>
                    <span className="text-foreground/90 font-sans">{s.top_failure_cause}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TechWindow>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 4: ENES (SALAIRES & EMPLOI) */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'enes' && (
        <TechWindow
          title="ENQUÊTE NATIONALE SUR L'EMPLOI AU SÉNÉGAL // GRILLES SALARIALES DE RÉFÉRENCE"
          badge="SMIG: 64 228 FCFA"
          badgeColor="neutral"
        >
          <div className="overflow-x-auto border border-border shadow-xs">
            <table className="w-full text-left font-mono text-xs">
              <thead className="bg-secondary text-foreground font-bold border-b border-border">
                <tr>
                  <th className="p-3">PROFIL / MÉTIER</th>
                  <th className="p-3 text-right">BRUT MOYEN DAKAR</th>
                  <th className="p-3 text-right">BRUT MOYEN RÉGIONS</th>
                  <th className="p-3">DISPONIBILITÉ MARCHÉ</th>
                  <th className="p-3 text-right">CHARGES PATRONALES</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border bg-card">
                {salaries.map((sal) => (
                  <tr key={sal.profile_id} className="hover:bg-muted/40 transition-colors">
                    <td className="p-3 font-semibold text-foreground font-sans">{sal.role}</td>
                    <td className="p-3 text-right font-bold text-emerald-700">
                      {sal.monthly_gross_dakar_fcfa.toLocaleString('fr-FR')} FCFA
                    </td>
                    <td className="p-3 text-right text-foreground">
                      {sal.monthly_gross_regions_fcfa.toLocaleString('fr-FR')} FCFA
                    </td>
                    <td className="p-3 text-muted-foreground">{sal.availability}</td>
                    <td className="p-3 text-right text-muted-foreground">{sal.employer_social_charges_pct}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TechWindow>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 5: UEMOA (CORRIDORS SOUS-RÉGIONAUX) */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'uemoa' && (
        <TechWindow
          title="INDICATEURS MACRO-ÉCONOMIQUES & CORRIDORS COMMERCIAUX UEMOA"
          badge="ZONE FCFA (BCEAO)"
          badgeColor="emerald"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
            {uemoaCountries.map((c) => (
              <div key={c.country_code} className="border border-border bg-card p-4 shadow-xs">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-bold text-foreground">[{c.country_code}] {c.name}</span>
                  <span className="text-[10px] text-muted-foreground border border-border px-1.5 py-0.5 font-semibold">
                    {c.ease_of_business_rank}
                  </span>
                </div>
                <div className="space-y-1.5 text-muted-foreground mb-3">
                  <div className="flex justify-between">
                    <span>Population :</span>
                    <span className="text-foreground font-semibold">{c.population.toLocaleString('fr-FR')} hab.</span>
                  </div>
                  <div className="flex justify-between">
                    <span>PIB estimé :</span>
                    <span className="text-foreground">{c.gdp_billions_fcfa.toLocaleString('fr-FR')} Mrds FCFA</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Taux d'inflation :</span>
                    <span className="text-foreground font-semibold">{c.inflation_pct}% a/a</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Balance avec le Sénégal :</span>
                    <span className="text-foreground font-sans">{c.trade_balance_with_sn}</span>
                  </div>
                </div>

                <div className="border-t border-border pt-2 text-[10px] text-muted-foreground">
                  <div>Export principal vers SN : {c.key_export_to_sn}</div>
                  <div>Import principal depuis SN : {c.key_import_from_sn}</div>
                </div>
              </div>
            ))}
          </div>
        </TechWindow>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 6: CATALOGUE DES DATASETS & DELTA AUDIT */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'catalog' && (
        <TechWindow
          title="REGISTRE GLOBAL DU CATALOGUE // CONTRÔLE MENSUEL DES DELTAS"
          badge="158 DATASETS RÉPERTORIÉS"
          badgeColor="emerald"
        >
          <div className="overflow-x-auto border border-border shadow-xs">
            <table className="w-full text-left font-mono text-xs">
              <thead className="bg-secondary text-foreground font-bold border-b border-border">
                <tr>
                  <th className="p-3">DATASET ID</th>
                  <th className="p-3">INTITULÉ DE LA BASE STATISTIQUE</th>
                  <th className="p-3">SOURCE</th>
                  <th className="p-3">FRÉQUENCE</th>
                  <th className="p-3">CHECKSUM (SHA-256)</th>
                  <th className="p-3 text-right">STATUT AUDIT</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border bg-card">
                {catalog.map((cat: any) => (
                  <tr key={cat.dataset_id} className="hover:bg-muted/40 transition-colors">
                    <td className="p-3 font-bold text-foreground">{cat.dataset_id}</td>
                    <td className="p-3 text-foreground font-sans">{cat.title}</td>
                    <td className="p-3 text-muted-foreground">{cat.source}</td>
                    <td className="p-3 text-muted-foreground">{cat.update_frequency}</td>
                    <td className="p-3 text-muted-foreground font-mono text-[10px]">
                      {cat.checksum || 'SHA256_VERIFIED'}
                    </td>
                    <td className="p-3 text-right">
                      <span className="px-2 py-0.5 border border-emerald-300 bg-emerald-50 text-emerald-800 text-[10px] font-bold">
                        ● {cat.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TechWindow>
      )}
    </div>
  );
};
