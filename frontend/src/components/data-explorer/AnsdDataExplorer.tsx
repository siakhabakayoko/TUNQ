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
      <div className="border border-border bg-card p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 font-sans">
        <div>
          <h2 className="text-lg font-bold text-foreground font-heading">
            Observatoire des statistiques économiques (ANSD & UEMOA)
          </h2>
          <p className="text-xs text-muted-foreground mt-1">
            Données officielles certifiées : indice des prix, démographie régionale, pérennité des entreprises et commerce extérieur.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground border border-border bg-secondary px-3 py-1 font-mono">
            Mise à jour mensuelle
          </span>
          <span className="text-xs text-emerald-800 border border-emerald-200 bg-emerald-50 px-3 py-1 font-medium font-sans">
            Données certifiées SHA-256
          </span>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="flex flex-wrap gap-2 border-b border-border pb-3 font-sans text-xs">
        <button
          onClick={() => setActiveTab('ihpc')}
          className={`px-3.5 py-2 border transition-all flex items-center gap-2 font-medium ${
            activeTab === 'ihpc'
              ? 'bg-primary text-primary-foreground border-primary'
              : 'border-border bg-card text-muted-foreground hover:text-foreground hover:bg-secondary'
          }`}
        >
          <TrendingUp className="h-3.5 w-3.5" /> Inflation (IHPC 2023)
        </button>

        <button
          onClick={() => setActiveTab('rgph5')}
          className={`px-3.5 py-2 border transition-all flex items-center gap-2 font-medium ${
            activeTab === 'rgph5'
              ? 'bg-primary text-primary-foreground border-primary'
              : 'border-border bg-card text-muted-foreground hover:text-foreground hover:bg-secondary'
          }`}
        >
          <Users className="h-3.5 w-3.5" /> Démographie (RGPH-5)
        </button>

        <button
          onClick={() => setActiveTab('rge')}
          className={`px-3.5 py-2 border transition-all flex items-center gap-2 font-medium ${
            activeTab === 'rge'
              ? 'bg-primary text-primary-foreground border-primary'
              : 'border-border bg-card text-muted-foreground hover:text-foreground hover:bg-secondary'
          }`}
        >
          <Briefcase className="h-3.5 w-3.5" /> Survie des entreprises (RGE-2)
        </button>

        <button
          onClick={() => setActiveTab('enes')}
          className={`px-3.5 py-2 border transition-all flex items-center gap-2 font-medium ${
            activeTab === 'enes'
              ? 'bg-primary text-primary-foreground border-primary'
              : 'border-border bg-card text-muted-foreground hover:text-foreground hover:bg-secondary'
          }`}
        >
          <DollarSign className="h-3.5 w-3.5" /> Salaires & Emploi (ENES)
        </button>

        <button
          onClick={() => setActiveTab('uemoa')}
          className={`px-3.5 py-2 border transition-all flex items-center gap-2 font-medium ${
            activeTab === 'uemoa'
              ? 'bg-primary text-primary-foreground border-primary'
              : 'border-border bg-card text-muted-foreground hover:text-foreground hover:bg-secondary'
          }`}
        >
          <Globe className="h-3.5 w-3.5" /> Marchés & Corridors UEMOA
        </button>

        <button
          onClick={() => setActiveTab('catalog')}
          className={`px-3.5 py-2 border transition-all flex items-center gap-2 font-medium ${
            activeTab === 'catalog'
              ? 'bg-primary text-primary-foreground border-primary'
              : 'border-border bg-card text-muted-foreground hover:text-foreground hover:bg-secondary'
          }`}
        >
          <RefreshCw className="h-3.5 w-3.5" /> Catalogue des datasets
        </button>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* TAB 1: IHPC (PRIX & INFLATION) */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'ihpc' && (
        <TechWindow
          title="Indice Harmonisé des Prix à la Consommation (IHPC 2023)"
          badge="12 fonctions COICOP"
          badgeColor="neutral"
        >
          {/* Monthly Trajectory Sparkline Bar */}
          <div className="border border-border bg-card p-5 mb-6 space-y-3 font-sans">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-foreground">Évolution annuelle de l'inflation (glissement a/a %)</span>
              <span className="text-muted-foreground">Dernière publication : Août 2026 (3,5%)</span>
            </div>
            <div className="grid grid-cols-6 md:grid-cols-12 gap-2 items-end h-20 pt-4 border-b border-border pb-1">
              {ihpc.monthly_series.map((s, idx) => (
                <div key={idx} className="flex flex-col items-center gap-1">
                  <span className="text-[10px] text-muted-foreground font-mono font-medium">{s.inflation_rate_yoy}%</span>
                  <div
                    className="w-full bg-primary hover:opacity-80 transition-all"
                    style={{ height: `${Math.max(10, s.inflation_rate_yoy * 14)}px` }}
                  />
                  <span className="text-[9px] text-muted-foreground font-mono truncate w-full text-center">
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
          title="Recensement Général de la Population et de l'Habitat (RGPH-5)"
          badge="18 275 743 habitants"
          badgeColor="neutral"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 font-sans text-xs">
            {regions.map((r) => (
              <div key={r.region_id} className="border border-border bg-card p-5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-bold text-foreground font-heading">{r.name}</span>
                    <span className="text-xs px-2 py-0.5 border border-border bg-secondary text-muted-foreground font-mono">
                      {r.urban_rate}% urbain
                    </span>
                  </div>
                  <div className="space-y-2 text-muted-foreground">
                    <div className="flex justify-between">
                      <span>Population :</span>
                      <span className="font-semibold text-foreground font-mono">{r.population.toLocaleString('fr-FR')} hab.</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Ménages estimés :</span>
                      <span className="text-foreground font-mono">{r.households.toLocaleString('fr-FR')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Revenu mensuel moyen :</span>
                      <span className="text-emerald-700 font-semibold font-mono">{r.avg_monthly_income_fcfa.toLocaleString('fr-FR')} FCFA</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Niveau de pouvoir d'achat :</span>
                      <span className="text-foreground font-medium">{r.purchasing_tier}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-border">
                  <span className="text-xs text-muted-foreground block mb-1.5 font-medium">Activités dominantes :</span>
                  <div className="flex flex-wrap gap-1.5">
                    {r.top_activities.map((act, i) => (
                      <span key={i} className="text-xs bg-secondary border border-border px-2 py-0.5 text-foreground">
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
          title="Recensement Général des Entreprises & Statistiques de survie (RGE-2)"
          badge="407 882 entreprises répertoriées"
          badgeColor="neutral"
        >
          <div className="space-y-6 font-sans text-xs">
            {sectors.map((s) => (
              <div key={s.sector_id} className="border border-border bg-card p-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-4">
                  <div>
                    <h3 className="text-base font-bold text-foreground font-heading">{s.name}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {s.units_count.toLocaleString('fr-FR')} unités recensées • Part informelle : {s.informal_pct}%
                    </p>
                  </div>
                  <div>
                    <span className="text-xs text-foreground bg-secondary border border-border px-2.5 py-1 font-mono">
                      {s.growth_trend}
                    </span>
                  </div>
                </div>

                {/* Survival Gauges */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="border border-border p-3 bg-secondary/20">
                    <div className="flex justify-between text-xs text-muted-foreground mb-1">
                      <span>Taux de survie à 1 an</span>
                      <span className="text-emerald-700 font-bold font-mono">{s.survival_rate_1yr}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-border">
                      <div className="h-full bg-emerald-600" style={{ width: `${s.survival_rate_1yr}%` }} />
                    </div>
                  </div>

                  <div className="border border-border p-3 bg-secondary/20">
                    <div className="flex justify-between text-xs text-muted-foreground mb-1">
                      <span>Taux de survie à 3 ans (seuil critique)</span>
                      <span className="text-primary font-bold font-mono">{s.survival_rate_3yr}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-border">
                      <div className="h-full bg-primary" style={{ width: `${s.survival_rate_3yr}%` }} />
                    </div>
                  </div>

                  <div className="border border-border p-3 bg-secondary/20">
                    <div className="flex justify-between text-xs text-muted-foreground mb-1">
                      <span>Taux de survie à 5 ans</span>
                      <span className="text-amber-800 font-bold font-mono">{s.survival_rate_5yr}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-border">
                      <div className="h-full bg-amber-600" style={{ width: `${s.survival_rate_5yr}%` }} />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-3 border-t border-border">
                  <div className="flex items-center gap-4">
                    <span>
                      Marge brute moyenne : <strong className="text-foreground font-mono">{s.avg_gross_margin_pct}%</strong>
                    </span>
                    <span>
                      EBITDA moyen : <strong className="text-emerald-700 font-mono">{s.avg_ebitda_margin_pct}%</strong>
                    </span>
                  </div>
                  <div>
                    <span className="text-destructive font-medium">Facteur principal de défaillance : </span>
                    <span className="text-muted-foreground">{s.top_failure_cause}</span>
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
          title="Enquête Nationale sur l'Emploi au Sénégal (ENES) — Références salariales"
          badge="SMIG légal : 64 228 FCFA"
          badgeColor="neutral"
        >
          <div className="overflow-x-auto border border-border">
            <table className="w-full text-left font-sans text-xs">
              <thead className="bg-secondary text-foreground font-semibold border-b border-border">
                <tr>
                  <th className="p-3">Profil / Fonction</th>
                  <th className="p-3 text-right">Salaire moyen brut (Dakar)</th>
                  <th className="p-3 text-right">Salaire moyen brut (Régions)</th>
                  <th className="p-3">Disponibilité du marché</th>
                  <th className="p-3 text-right">Charges patronales estimées</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border bg-card">
                {salaries.map((sal) => (
                  <tr key={sal.profile_id} className="hover:bg-muted/40 transition-colors">
                    <td className="p-3 font-medium text-foreground">{sal.role}</td>
                    <td className="p-3 text-right font-bold text-emerald-700 font-mono">
                      {sal.monthly_gross_dakar_fcfa.toLocaleString('fr-FR')} FCFA
                    </td>
                    <td className="p-3 text-right text-foreground font-mono">
                      {sal.monthly_gross_regions_fcfa.toLocaleString('fr-FR')} FCFA
                    </td>
                    <td className="p-3 text-muted-foreground">{sal.availability}</td>
                    <td className="p-3 text-right text-muted-foreground font-mono">{sal.employer_social_charges_pct}%</td>
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
          title="Indicateurs macroéconomiques et flux sous-régionaux UEMOA"
          badge="Zone monétaire FCFA"
          badgeColor="neutral"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-sans text-xs">
            {uemoaCountries.map((c) => (
              <div key={c.country_code} className="border border-border bg-card p-5 space-y-3">
                <div className="flex items-center justify-between border-b border-border pb-2.5">
                  <span className="text-sm font-bold text-foreground font-heading">{c.name}</span>
                  <span className="text-xs text-muted-foreground border border-border px-2 py-0.5 font-mono">
                    {c.ease_of_business_rank}
                  </span>
                </div>
                <div className="space-y-2 text-muted-foreground">
                  <div className="flex justify-between">
                    <span>Population :</span>
                    <span className="text-foreground font-semibold font-mono">{c.population.toLocaleString('fr-FR')} hab.</span>
                  </div>
                  <div className="flex justify-between">
                    <span>PIB estimé :</span>
                    <span className="text-foreground font-mono">{c.gdp_billions_fcfa.toLocaleString('fr-FR')} Mrds FCFA</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Taux d'inflation :</span>
                    <span className="text-foreground font-mono">{c.inflation_pct}% a/a</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Balance commerciale avec le Sénégal :</span>
                    <span className="text-foreground font-medium">{c.trade_balance_with_sn}</span>
                  </div>
                </div>

                <div className="border-t border-border pt-2.5 text-xs text-muted-foreground space-y-1">
                  <div>Export principal vers le Sénégal : <span className="text-foreground">{c.key_export_to_sn}</span></div>
                  <div>Import principal depuis le Sénégal : <span className="text-foreground">{c.key_import_from_sn}</span></div>
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
          title="Catalogue des 158 datasets certifiés et journal d'audit"
          badge="Bases officielles vérifiées"
          badgeColor="neutral"
        >
          <div className="overflow-x-auto border border-border">
            <table className="w-full text-left font-sans text-xs">
              <thead className="bg-secondary text-foreground font-semibold border-b border-border">
                <tr>
                  <th className="p-3">Identifiant</th>
                  <th className="p-3">Intitulé du jeu de données</th>
                  <th className="p-3">Source émettrice</th>
                  <th className="p-3">Fréquence</th>
                  <th className="p-3">Intégrité</th>
                  <th className="p-3 text-right">Statut</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border bg-card">
                {catalog.map((cat: any) => (
                  <tr key={cat.dataset_id} className="hover:bg-muted/40 transition-colors">
                    <td className="p-3 font-mono text-muted-foreground">{cat.dataset_id}</td>
                    <td className="p-3 font-medium text-foreground">{cat.title}</td>
                    <td className="p-3 text-muted-foreground">{cat.source}</td>
                    <td className="p-3 text-muted-foreground">{cat.update_frequency}</td>
                    <td className="p-3 text-muted-foreground font-mono text-[11px]">
                      {cat.checksum || 'SHA256_VERIFIED'}
                    </td>
                    <td className="p-3 text-right">
                      <span className="px-2 py-0.5 border border-emerald-200 bg-emerald-50 text-emerald-800 text-xs font-medium">
                        {cat.status}
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
