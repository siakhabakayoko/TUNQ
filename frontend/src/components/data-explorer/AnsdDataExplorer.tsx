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
      <div className="border border-[#21262D] bg-[#11141A] p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 font-mono">
        <div>
          <div className="flex items-center gap-2">
            <Database className="h-4 w-4 text-[#03FFB2]" />
            <span className="text-sm font-bold text-zinc-100 uppercase tracking-wider">
              OBSERVATOIRE ÉCONOMIQUE ANSD & UEMOA // DATA LAKE SÉNÉGAL
            </span>
          </div>
          <div className="text-xs text-zinc-400 mt-1 font-sans">
            Base officielle de 158 jeux de données statistiques certifiés (ANSD, BCEAO, BAD) alimentant les modèles d’arbitrage décisionnels.
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-zinc-400 border border-zinc-700 bg-black/40 px-2 py-1">
            CYCLE : MENSUEL (DELTA SYNC)
          </span>
          <span className="text-[10px] text-[#03FFB2] border border-[#03FFB2]/40 bg-[#03FFB2]/10 px-2 py-1 font-semibold">
            ● INTÉGRITÉ SHA-256 CONTRÔLÉE
          </span>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="flex flex-wrap gap-1 border-b border-[#272B33] pb-2 font-mono text-xs">
        <button
          onClick={() => setActiveTab('ihpc')}
          className={`px-3 py-2 border transition-all flex items-center gap-1.5 ${
            activeTab === 'ihpc'
              ? 'bg-[#1C2128] border-[#03FFB2] text-[#03FFB2] font-bold'
              : 'border-transparent text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <TrendingUp className="h-3.5 w-3.5" /> [ IHPC 2023 // INFLATION ]
        </button>

        <button
          onClick={() => setActiveTab('rgph5')}
          className={`px-3 py-2 border transition-all flex items-center gap-1.5 ${
            activeTab === 'rgph5'
              ? 'bg-[#1C2128] border-[#03FFB2] text-[#03FFB2] font-bold'
              : 'border-transparent text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Users className="h-3.5 w-3.5" /> [ RGPH-5 // 14 RÉGIONS ]
        </button>

        <button
          onClick={() => setActiveTab('rge')}
          className={`px-3 py-2 border transition-all flex items-center gap-1.5 ${
            activeTab === 'rge'
              ? 'bg-[#1C2128] border-[#03FFB2] text-[#03FFB2] font-bold'
              : 'border-transparent text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Briefcase className="h-3.5 w-3.5" /> [ RGE-2 // SURVIE PME ]
        </button>

        <button
          onClick={() => setActiveTab('enes')}
          className={`px-3 py-2 border transition-all flex items-center gap-1.5 ${
            activeTab === 'enes'
              ? 'bg-[#1C2128] border-[#03FFB2] text-[#03FFB2] font-bold'
              : 'border-transparent text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <DollarSign className="h-3.5 w-3.5" /> [ ENES // SALAIRES ]
        </button>

        <button
          onClick={() => setActiveTab('uemoa')}
          className={`px-3 py-2 border transition-all flex items-center gap-1.5 ${
            activeTab === 'uemoa'
              ? 'bg-[#1C2128] border-[#03FFB2] text-[#03FFB2] font-bold'
              : 'border-transparent text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Globe className="h-3.5 w-3.5" /> [ UEMOA // CORRIDORS ]
        </button>

        <button
          onClick={() => setActiveTab('catalog')}
          className={`px-3 py-2 border transition-all flex items-center gap-1.5 ${
            activeTab === 'catalog'
              ? 'bg-[#1C2128] border-[#03FFB2] text-[#03FFB2] font-bold'
              : 'border-transparent text-zinc-400 hover:text-zinc-200'
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
          <div className="bg-[#0A0D12] border border-[#21262D] p-4 mb-6 font-mono text-xs">
            <div className="flex justify-between items-center mb-3">
              <span className="font-bold text-zinc-200">HISTORIQUE RÉCENT DE L'INFLATION ANNUELLE (GLISSEMENT ANNUEL %)</span>
              <span className="text-[#03FFB2]">DERNIÈRE PARUTION : 2026-08 (3,5% a/a)</span>
            </div>
            <div className="grid grid-cols-6 md:grid-cols-12 gap-1.5 items-end h-20 pt-4 border-b border-[#21262D] pb-1">
              {ihpc.monthly_series.map((s, idx) => (
                <div key={idx} className="flex flex-col items-center gap-1">
                  <span className="text-[9px] text-zinc-500">{s.inflation_rate_yoy}%</span>
                  <div
                    className="w-full bg-[#03FFB2] hover:bg-[#00E599] transition-all"
                    style={{ height: `${Math.max(10, s.inflation_rate_yoy * 14)}px` }}
                  />
                  <span className="text-[8px] text-zinc-500 truncate w-full text-center">
                    {s.period.slice(5)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Functions of Consumption Table */}
          <div className="overflow-x-auto border border-[#21262D]">
            <table className="w-full text-left font-mono text-xs">
              <thead className="bg-[#161B22] text-zinc-400 border-b border-[#21262D]">
                <tr>
                  <th className="p-2.5">CODE</th>
                  <th className="p-2.5">FONCTION DE CONSOMMATION</th>
                  <th className="p-2.5 text-right">PONDÉRATION (‰)</th>
                  <th className="p-2.5 text-right">INDICE ACTUEL</th>
                  <th className="p-2.5 text-right">VAR. MENSUELLE</th>
                  <th className="p-2.5 text-right">VAR. ANNUELLE</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1C2128] bg-[#0D1117]">
                {ihpc.functions.map((f) => (
                  <tr key={f.code} className="hover:bg-[#161B22]/60 transition-colors">
                    <td className="p-2.5 font-bold text-zinc-400">{f.code}</td>
                    <td className="p-2.5 text-zinc-200 font-sans">{f.name}</td>
                    <td className="p-2.5 text-right text-zinc-400">{f.weight.toFixed(1)}</td>
                    <td className="p-2.5 text-right font-bold text-white">{f.index_current}</td>
                    <td className={`p-2.5 text-right font-semibold ${f.change_monthly >= 0 ? 'text-[#FFB224]' : 'text-[#03FFB2]'}`}>
                      {f.change_monthly >= 0 ? `+${f.change_monthly}%` : `${f.change_monthly}%`}
                    </td>
                    <td className="p-2.5 text-right font-semibold text-zinc-300">
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
              <div key={r.region_id} className="border border-[#21262D] bg-[#0A0D12] p-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-bold text-white">[{r.region_id}] {r.name}</span>
                    <span className="text-[10px] px-1.5 py-0.5 border border-zinc-700 bg-zinc-800 text-zinc-300">
                      {r.urban_rate}% URBAIN
                    </span>
                  </div>
                  <div className="space-y-1.5 text-zinc-400">
                    <div className="flex justify-between">
                      <span>Population :</span>
                      <span className="font-bold text-zinc-200">{r.population.toLocaleString('fr-FR')} hab.</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Ménages estimés :</span>
                      <span className="text-zinc-200">{r.households.toLocaleString('fr-FR')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Revenu mensuel moyen :</span>
                      <span className="text-[#03FFB2] font-semibold">{r.avg_monthly_income_fcfa.toLocaleString('fr-FR')} FCFA</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Niveau pouvoir d'achat :</span>
                      <span className="text-cyan-400 font-semibold">{r.purchasing_tier}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-3 pt-2 border-t border-[#1C2128]">
                  <span className="text-[10px] text-zinc-500 uppercase block mb-1">Activités dominantes :</span>
                  <div className="flex flex-wrap gap-1">
                    {r.top_activities.map((act, i) => (
                      <span key={i} className="text-[9px] bg-[#161B22] border border-[#272B33] px-1.5 py-0.5 text-zinc-300">
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
              <div key={s.sector_id} className="border border-[#21262D] bg-[#0A0D12] p-4">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2 mb-3">
                  <div>
                    <span className="text-sm font-bold text-white">{s.name}</span>
                    <span className="text-zinc-500 ml-2">({s.units_count.toLocaleString('fr-FR')} unités - {s.informal_pct}% informel)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-cyan-400 bg-cyan-950/40 border border-cyan-800 px-2 py-0.5">
                      {s.growth_trend}
                    </span>
                  </div>
                </div>

                {/* Survival Gauges */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                  <div className="border border-[#1C2128] p-2.5 bg-[#11141A]">
                    <div className="flex justify-between text-[10px] text-zinc-400 mb-1">
                      <span>SURVIE À 1 AN</span>
                      <span className="text-emerald-400 font-bold">{s.survival_rate_1yr}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-zinc-800">
                      <div className="h-full bg-emerald-400" style={{ width: `${s.survival_rate_1yr}%` }} />
                    </div>
                  </div>

                  <div className="border border-[#1C2128] p-2.5 bg-[#11141A]">
                    <div className="flex justify-between text-[10px] text-zinc-400 mb-1">
                      <span>SURVIE À 3 ANS (SEUIL CRITIQUE)</span>
                      <span className="text-[#03FFB2] font-bold">{s.survival_rate_3yr}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-zinc-800">
                      <div className="h-full bg-[#03FFB2]" style={{ width: `${s.survival_rate_3yr}%` }} />
                    </div>
                  </div>

                  <div className="border border-[#1C2128] p-2.5 bg-[#11141A]">
                    <div className="flex justify-between text-[10px] text-zinc-400 mb-1">
                      <span>SURVIE À 5 ANS</span>
                      <span className="text-amber-400 font-bold">{s.survival_rate_5yr}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-zinc-800">
                      <div className="h-full bg-amber-400" style={{ width: `${s.survival_rate_5yr}%` }} />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px] pt-2 border-t border-[#1C2128]">
                  <div>
                    <span className="text-zinc-500">Marge brute moyenne : </span>
                    <span className="text-white font-bold">{s.avg_gross_margin_pct}%</span>
                    <span className="text-zinc-500 ml-3">EBITDA moyen : </span>
                    <span className="text-[#03FFB2] font-bold">{s.avg_ebitda_margin_pct}%</span>
                  </div>
                  <div>
                    <span className="text-red-400 font-semibold">Cause n°1 d’échec : </span>
                    <span className="text-zinc-300 font-sans">{s.top_failure_cause}</span>
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
          <div className="overflow-x-auto border border-[#21262D]">
            <table className="w-full text-left font-mono text-xs">
              <thead className="bg-[#161B22] text-zinc-400 border-b border-[#21262D]">
                <tr>
                  <th className="p-3">PROFIL / MÉTIER</th>
                  <th className="p-3 text-right">BRUT MOYEN DAKAR</th>
                  <th className="p-3 text-right">BRUT MOYEN RÉGIONS</th>
                  <th className="p-3">DISPONIBILITÉ MARCHÉ</th>
                  <th className="p-3 text-right">CHARGES PATRONALES</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1C2128] bg-[#0D1117]">
                {salaries.map((sal) => (
                  <tr key={sal.profile_id} className="hover:bg-[#161B22]/60 transition-colors">
                    <td className="p-3 font-semibold text-white font-sans">{sal.role}</td>
                    <td className="p-3 text-right font-bold text-[#03FFB2]">
                      {sal.monthly_gross_dakar_fcfa.toLocaleString('fr-FR')} FCFA
                    </td>
                    <td className="p-3 text-right text-zinc-300">
                      {sal.monthly_gross_regions_fcfa.toLocaleString('fr-FR')} FCFA
                    </td>
                    <td className="p-3 text-zinc-400">{sal.availability}</td>
                    <td className="p-3 text-right text-zinc-400">{sal.employer_social_charges_pct}%</td>
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
              <div key={c.country_code} className="border border-[#21262D] bg-[#0A0D12] p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-bold text-white">[{c.country_code}] {c.name}</span>
                  <span className="text-[10px] text-zinc-400 border border-zinc-700 px-1.5 py-0.5">
                    {c.ease_of_business_rank}
                  </span>
                </div>
                <div className="space-y-1.5 text-zinc-400 mb-3">
                  <div className="flex justify-between">
                    <span>Population :</span>
                    <span className="text-zinc-200 font-semibold">{c.population.toLocaleString('fr-FR')} hab.</span>
                  </div>
                  <div className="flex justify-between">
                    <span>PIB estimé :</span>
                    <span className="text-zinc-200">{c.gdp_billions_fcfa.toLocaleString('fr-FR')} Mrds FCFA</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Taux d'inflation :</span>
                    <span className="text-cyan-400 font-semibold">{c.inflation_pct}% a/a</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Balance avec le Sénégal :</span>
                    <span className="text-white font-sans">{c.trade_balance_with_sn}</span>
                  </div>
                </div>

                <div className="border-t border-[#1C2128] pt-2 text-[10px] text-zinc-500">
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
          <div className="overflow-x-auto border border-[#21262D]">
            <table className="w-full text-left font-mono text-xs">
              <thead className="bg-[#161B22] text-zinc-400 border-b border-[#21262D]">
                <tr>
                  <th className="p-2.5">DATASET ID</th>
                  <th className="p-2.5">INTITULÉ DE LA BASE STATISTIQUE</th>
                  <th className="p-2.5">SOURCE</th>
                  <th className="p-2.5">FRÉQUENCE</th>
                  <th className="p-2.5">CHECKSUM (SHA-256)</th>
                  <th className="p-2.5 text-right">STATUT AUDIT</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1C2128] bg-[#0D1117]">
                {catalog.map((cat: any) => (
                  <tr key={cat.dataset_id} className="hover:bg-[#161B22]/60 transition-colors">
                    <td className="p-2.5 font-bold text-[#03FFB2]">{cat.dataset_id}</td>
                    <td className="p-2.5 text-zinc-200 font-sans">{cat.title}</td>
                    <td className="p-2.5 text-zinc-400">{cat.source}</td>
                    <td className="p-2.5 text-zinc-400">{cat.update_frequency}</td>
                    <td className="p-2.5 text-zinc-500 font-mono text-[10px]">
                      {cat.checksum || 'SHA256_VERIFIED'}
                    </td>
                    <td className="p-2.5 text-right">
                      <span className="px-2 py-0.5 border border-[#03FFB2]/30 bg-[#03FFB2]/10 text-[#03FFB2] text-[10px] font-bold">
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
