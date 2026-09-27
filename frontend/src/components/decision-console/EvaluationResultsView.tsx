import React from 'react';
import { FullProjectEvaluation } from '@/types';
import { VerdictBadge } from '@/components/typesafe-ui/VerdictBadge';
import { CalibratedSlider } from '@/components/typesafe-ui/CalibratedSlider';
import { TechWindow } from '@/components/typesafe-ui/TechWindow';
import {
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Layers,
  ShieldCheck,
  Building2,
  ExternalLink,
  Flame,
  Clock
} from 'lucide-react';

interface EvaluationResultsViewProps {
  evaluation: FullProjectEvaluation;
  onReset: () => void;
}

export const EvaluationResultsView: React.FC<EvaluationResultsViewProps> = ({
  evaluation,
  onReset
}) => {
  const { project, financials, diagnosis, decision, actionPlan } = evaluation;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Controls / Action Bar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-[#11141A] border border-[#21262D] p-3 font-mono text-xs">
        <div className="flex items-center gap-3">
          <span className="text-[#03FFB2] font-bold">DOSSIER : #{evaluation.id}</span>
          <span className="text-zinc-500">|</span>
          <span className="text-zinc-300 font-semibold">{project.title}</span>
          <span className="text-zinc-500">({project.regionId})</span>
        </div>
        <button
          onClick={onReset}
          className="px-3 py-1.5 bg-[#1C2128] hover:bg-[#272B33] text-zinc-300 border border-zinc-700 text-xs font-mono transition-all"
        >
          [ ← NOUVELLE ÉVALUATION ]
        </button>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 1. JEV SYSTEM ONE DECISION WINDOW */}
      {/* ------------------------------------------------------------- */}
      <TechWindow
        title="ARBITRAGE DÉCISIONNEL // TYPESAFE AI JEV"
        badge={`${(decision.confidence * 100).toFixed(1)}% CALIBRÉ`}
        badgeColor={decision.verdict === 'GO' ? 'emerald' : decision.verdict === 'PIVOT' ? 'amber' : 'rose'}
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Verdict Box */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <VerdictBadge
              verdict={decision.verdict}
              confidence={decision.confidence}
              latencyMs={decision.executionLatencyMs}
              rationale={decision.coreRationale}
            />

            {/* Noul Checks (Deterministic Probabilistic Checks) */}
            <div className="mt-4 border border-[#21262D] bg-[#0A0D12] p-3 font-mono text-xs space-y-2">
              <div className="text-[10px] text-zinc-500 tracking-wider uppercase mb-1">
                VALIDATION DES CONTRAINTES CRITIQUES (NOUL PRIMITIVES)
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-400">Économie unitaire viable :</span>
                <span className={`font-semibold ${decision.noulChecks.unitEconomicsViable ? 'text-[#03FFB2]' : 'text-[#FF3B30]'}`}>
                  {decision.noulChecks.unitEconomicsViable ? 'OUI (Viable)' : 'NON (Déficit)'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-400">Adéquation pouvoir d’achat local :</span>
                <span className={`font-semibold ${decision.noulChecks.localPurchasingPowerFit ? 'text-[#03FFB2]' : 'text-[#FFB224]'}`}>
                  {decision.noulChecks.localPurchasingPowerFit ? 'OUI (Conforme)' : 'ATTENTION (Élevé)'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-400">Trésorerie de démarrage suffisante :</span>
                <span className={`font-semibold ${decision.noulChecks.cashRunwaySufficient ? 'text-[#03FFB2]' : 'text-[#FF3B30]'}`}>
                  {decision.noulChecks.cashRunwaySufficient ? 'OUI (≥ 6 mois)' : 'NON (< Seuil)'}
                </span>
              </div>
              {project.isUemoaExportTarget && (
                <div className="flex items-center justify-between">
                  <span className="text-zinc-400">Scalabilité export UEMOA :</span>
                  <span className="font-semibold text-cyan-400">
                    {decision.noulChecks.uemoaCrossborderViable ? 'OUI (Prêt)' : 'À STRUCTURER'}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Calibrated Sliders Column */}
          <div className="lg:col-span-7 space-y-1">
            <div className="font-mono text-xs text-zinc-400 mb-2 flex items-center justify-between">
              <span>INDICATEURS ÉTALONNÉS PAR JEV</span>
              <span className="text-[10px] text-zinc-500">ÉCHELLE DÉCISIONNELLE 1.0 - 10.0</span>
            </div>

            <CalibratedSlider
              label="SCORE DE RENTABILITÉ & MARGES"
              score={decision.scores.profitabilityScore}
              benchmarkLabel="Moyenne Secteur"
              benchmarkScore={6.0}
            />

            <CalibratedSlider
              label="ATTRACTIVITÉ DU MARCHÉ & BESOIN RÉEL"
              score={decision.scores.marketAttractivenessScore}
              benchmarkLabel="Seuil Minimal"
              benchmarkScore={5.0}
            />

            <CalibratedSlider
              label="SÉCURITÉ D’APPROVISIONNEMENT & INTRANTS"
              score={decision.scores.supplyChainRiskScore}
              benchmarkLabel="Alerte Risque"
              benchmarkScore={4.5}
            />

            <CalibratedSlider
              label="PÉRENNITÉ SECTORIELLE (RGE ANSD SURVIE 3 ANS)"
              score={decision.scores.sectorSurvivalScore}
              benchmarkLabel="Moyenne Nationale"
              benchmarkScore={5.1}
            />

            {project.isUemoaExportTarget && (
              <CalibratedSlider
                label="POTENTIEL D’EXPANSION SOUS-RÉGIONALE (UEMOA)"
                score={decision.scores.uemoaExportScore}
                benchmarkLabel="Seuil d'entrée"
                benchmarkScore={5.5}
              />
            )}
          </div>
        </div>
      </TechWindow>

      {/* ------------------------------------------------------------- */}
      {/* 2. FINANCIAL PROFITABILITY & BREAK-EVEN WINDOW */}
      {/* ------------------------------------------------------------- */}
      <TechWindow
        title="INGÉNIERIE FINANCIÈRE // ANALYSE DE RENTABILITÉ & POINT MORT"
        badge="FCFA XOF"
        badgeColor="neutral"
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 font-mono">
          <div className="bg-[#0A0D12] border border-[#21262D] p-3.5">
            <span className="text-[10px] text-zinc-500 block uppercase">SEUIL DE RENTABILITÉ (UNITÉS)</span>
            <span className="text-xl font-bold text-white block mt-1">
              {financials.breakEvenMonthlyUnits.toLocaleString('fr-FR')}{' '}
              <span className="text-xs text-zinc-400 font-normal">unités / mois</span>
            </span>
            <span className="text-[10px] text-zinc-500 block mt-1">
              Soit {Math.ceil(financials.breakEvenMonthlyUnits / 26)} unités / jour ouvré
            </span>
          </div>

          <div className="bg-[#0A0D12] border border-[#21262D] p-3.5">
            <span className="text-[10px] text-zinc-500 block uppercase">POINT MORT MENSUEL (CA CRITIQUE)</span>
            <span className="text-xl font-bold text-[#03FFB2] block mt-1">
              {financials.breakEvenMonthlyRevenueFcfa.toLocaleString('fr-FR')}{' '}
              <span className="text-xs text-zinc-400 font-normal">FCFA</span>
            </span>
            <span className="text-[10px] text-zinc-500 block mt-1">
              Délai moyen d’atteinte : {financials.monthsToBreakEven} mois
            </span>
          </div>

          <div className="bg-[#0A0D12] border border-[#21262D] p-3.5">
            <span className="text-[10px] text-zinc-500 block uppercase">MARGE BRUTE RÉELLE VS ANSD</span>
            <span className="text-xl font-bold text-white block mt-1">
              {financials.grossMarginPct}%
            </span>
            <span className={`text-[10px] font-semibold block mt-1 ${financials.marginVariancePct >= 0 ? 'text-[#03FFB2]' : 'text-[#FFB224]'}`}>
              {financials.marginVariancePct >= 0 ? `+${financials.marginVariancePct}%` : `${financials.marginVariancePct}%`} vs RGE ({financials.sectorBenchmarkMarginPct}%)
            </span>
          </div>

          <div className="bg-[#0A0D12] border border-[#21262D] p-3.5">
            <span className="text-[10px] text-zinc-500 block uppercase">BFR & RÉSERVE DE SÉCURITÉ RECOMMANDÉE</span>
            <span className="text-xl font-bold text-cyan-400 block mt-1">
              {financials.workingCapitalReserveFcfa.toLocaleString('fr-FR')}{' '}
              <span className="text-xs text-zinc-400 font-normal">FCFA</span>
            </span>
            <span className="text-[10px] text-zinc-500 block mt-1">
              Couvre 4,5 mois de charges + stock
            </span>
          </div>
        </div>

        {/* Stress Testing Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
          <div className="border border-[#272B33] bg-[#0A0D12] p-4">
            <div className="flex items-center gap-2 font-bold text-zinc-200 mb-2">
              <Flame className="h-4 w-4 text-orange-400" />
              STRESS-TEST 1 : CHOC D’INFLATION SUR INTRANTS (+15%)
            </div>
            <p className="text-zinc-400 text-[11px] font-sans mb-3">
              Simule une flambée des prix matières ou de l'énergie conforme aux pics de l'IPPI/IHPC au Sénégal.
            </p>
            <div className="flex justify-between py-1 border-t border-[#1C2128]">
              <span className="text-zinc-500">Marge brute après choc :</span>
              <span className={`font-bold ${financials.stressTestInflation.newGrossMarginPct > 15 ? 'text-[#03FFB2]' : 'text-red-400'}`}>
                {financials.stressTestInflation.newGrossMarginPct}%
              </span>
            </div>
            <div className="flex justify-between py-1 border-t border-[#1C2128]">
              <span className="text-zinc-500">Le modèle reste-t-il bénéficiaire ?</span>
              <span className={`font-bold ${financials.stressTestInflation.isStillProfitable ? 'text-[#03FFB2]' : 'text-red-400'}`}>
                {financials.stressTestInflation.isStillProfitable ? 'OUI (Marge positive)' : 'NON (Passe en perte)'}
              </span>
            </div>
          </div>

          <div className="border border-[#272B33] bg-[#0A0D12] p-4">
            <div className="flex items-center gap-2 font-bold text-zinc-200 mb-2">
              <Clock className="h-4 w-4 text-cyan-400" />
              STRESS-TEST 2 : RETARD COMMERCIAL (90 JOURS SANS VENTES)
            </div>
            <p className="text-zinc-400 text-[11px] font-sans mb-3">
              Mesure la trésorerie purement requise pour tenir en cas de lenteur d’amorçage client au Sénégal.
            </p>
            <div className="flex justify-between py-1 border-t border-[#1C2128]">
              <span className="text-zinc-500">Trésorerie d’urgence 90 jours :</span>
              <span className="text-cyan-400 font-bold">
                {financials.stressTestDelay.requiredCashRunwayFcfa.toLocaleString('fr-FR')} FCFA
              </span>
            </div>
            <div className="flex justify-between py-1 border-t border-[#1C2128]">
              <span className="text-zinc-500">Charges fixes mensuelles incompressibles :</span>
              <span className="text-zinc-200">
                {project.monthlyFixedCostsFcfa.toLocaleString('fr-FR')} FCFA / mois
              </span>
            </div>
          </div>
        </div>
      </TechWindow>

      {/* ------------------------------------------------------------- */}
      {/* 3. STRATEGIC DIAGNOSIS & REGIONAL TAM/SAM/SOM */}
      {/* ------------------------------------------------------------- */}
      <TechWindow
        title="DIAGNOSTIC STRATÉGIQUE // PESTEL SÉNÉGAL, 5 FORCES & TAM/SAM/SOM"
        badge="RGPH-5 ANSD"
        badgeColor="emerald"
      >
        {/* TAM / SAM / SOM Header */}
        <div className="bg-[#0A0D12] border border-[#21262D] p-4 mb-6 font-mono">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-3">
            <span className="font-bold text-[#03FFB2] text-xs">
              MÉTRIQUES DE TAILLE DE MARCHÉ (TAM / SAM / SOM EN FCFA)
            </span>
            <span className="text-[10px] text-zinc-500">
              POPULATION CIBLE : {diagnosis.tamSamSom.targetPopulation.toLocaleString('fr-FR')} HABITANTS
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="border border-[#1C2128] p-3 bg-[#11141A]">
              <span className="text-[10px] text-zinc-400 block">TAM (MARCHÉ TOTAL ADRESSABLE)</span>
              <span className="text-lg font-bold text-white block mt-1">
                {(diagnosis.tamSamSom.tamFcfa / 1000000).toFixed(1)} M FCFA
              </span>
              <span className="text-[10px] text-zinc-500 block">Dépense annuelle globale estimée</span>
            </div>
            <div className="border border-[#1C2128] p-3 bg-[#11141A]">
              <span className="text-[10px] text-zinc-400 block">SAM (MARCHÉ DISPONIBLE RÉGIONAL)</span>
              <span className="text-lg font-bold text-[#03FFB2] block mt-1">
                {(diagnosis.tamSamSom.samFcfa / 1000000).toFixed(1)} M FCFA
              </span>
              <span className="text-[10px] text-zinc-500 block">Cible sur le pôle {project.regionId}</span>
            </div>
            <div className="border border-[#1C2128] p-3 bg-[#11141A]">
              <span className="text-[10px] text-zinc-400 block">SOM (OBJECTIF AN 1 RÉALISTE - 2.5%)</span>
              <span className="text-lg font-bold text-cyan-400 block mt-1">
                {(diagnosis.tamSamSom.somFcfa / 1000000).toFixed(1)} M FCFA
              </span>
              <span className="text-[10px] text-zinc-500 block">Part capturable à l’amorçage</span>
            </div>
          </div>
          <div className="text-[11px] text-zinc-400 mt-3 font-sans italic">
            Note méthodologique : {diagnosis.tamSamSom.explanation}
          </div>
        </div>

        {/* SWOT Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="border border-emerald-900/40 bg-emerald-950/10 p-4">
            <span className="font-mono text-xs font-bold text-[#03FFB2] block mb-2">
              [FORCES // ATOUTS COMPÉTITIFS]
            </span>
            <ul className="text-xs text-zinc-300 space-y-1.5 list-disc list-inside">
              {diagnosis.swot.strengths.map((s, idx) => (
                <li key={idx}>{s}</li>
              ))}
            </ul>
          </div>

          <div className="border border-rose-900/40 bg-rose-950/10 p-4">
            <span className="font-mono text-xs font-bold text-[#FF3B30] block mb-2">
              [FAIBLESSES // VULNÉRABILITÉS INTERNES]
            </span>
            <ul className="text-xs text-zinc-300 space-y-1.5 list-disc list-inside">
              {diagnosis.swot.weaknesses.map((w, idx) => (
                <li key={idx}>{w}</li>
              ))}
            </ul>
          </div>

          <div className="border border-blue-900/40 bg-blue-950/10 p-4">
            <span className="font-mono text-xs font-bold text-cyan-400 block mb-2">
              [OPPORTUNITÉS // DYNAMIQUE DU MARCHÉ]
            </span>
            <ul className="text-xs text-zinc-300 space-y-1.5 list-disc list-inside">
              {diagnosis.swot.opportunities.map((o, idx) => (
                <li key={idx}>{o}</li>
              ))}
            </ul>
          </div>

          <div className="border border-amber-900/40 bg-amber-950/10 p-4">
            <span className="font-mono text-xs font-bold text-[#FFB224] block mb-2">
              [MENACES // RISQUES MACRO-ÉCONOMIQUES]
            </span>
            <ul className="text-xs text-zinc-300 space-y-1.5 list-disc list-inside">
              {diagnosis.swot.threats.map((t, idx) => (
                <li key={idx}>{t}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* PESTEL Senegal Accordion-style layout */}
        <div className="border border-[#21262D] bg-[#0A0D12] p-4 font-mono text-xs">
          <div className="text-xs font-bold text-zinc-300 mb-3 pb-1 border-b border-[#21262D]">
            [CADRE PESTEL CONTEXTUALISÉ AU SÉNÉGAL & À L'UEMOA]
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 font-sans text-xs">
            <div>
              <span className="font-mono text-[11px] text-[#03FFB2] font-semibold block">POLITIQUE :</span>
              <p className="text-zinc-400">{diagnosis.pestelSenegal.political}</p>
            </div>
            <div>
              <span className="font-mono text-[11px] text-cyan-400 font-semibold block">ÉCONOMIQUE :</span>
              <p className="text-zinc-400">{diagnosis.pestelSenegal.economic}</p>
            </div>
            <div>
              <span className="font-mono text-[11px] text-amber-400 font-semibold block">SOCIOCULTUREL :</span>
              <p className="text-zinc-400">{diagnosis.pestelSenegal.social}</p>
            </div>
            <div>
              <span className="font-mono text-[11px] text-purple-400 font-semibold block">TECHNOLOGIQUE :</span>
              <p className="text-zinc-400">{diagnosis.pestelSenegal.technological}</p>
            </div>
            <div>
              <span className="font-mono text-[11px] text-emerald-400 font-semibold block">ENVIRONNEMENTAL :</span>
              <p className="text-zinc-400">{diagnosis.pestelSenegal.environmental}</p>
            </div>
            <div>
              <span className="font-mono text-[11px] text-rose-400 font-semibold block">LÉGAL & FISCAL :</span>
              <p className="text-zinc-400">{diagnosis.pestelSenegal.legal}</p>
            </div>
          </div>
        </div>
      </TechWindow>

      {/* ------------------------------------------------------------- */}
      {/* 4. GOOGLE GEMINI STRATEGIC REPORT & 30/60/90 ROADMAP */}
      {/* ------------------------------------------------------------- */}
      <TechWindow
        title="SYNTHÈSE EXÉCUTIVE & PLAN D'ACTION OPÉRATIONNEL // GOOGLE GEMINI"
        badge="ROADMAP 30/60/90"
        badgeColor="emerald"
      >
        {/* Executive Summary */}
        <div className="bg-[#11141A] border-l-4 border-[#03FFB2] p-4 mb-6">
          <span className="font-mono text-xs text-[#03FFB2] block uppercase tracking-wider mb-1">
            RÉSUMÉ EXÉCUTIF POUR L'ENTREPRENEUR & INVESTISSEURS
          </span>
          <p className="text-sm text-zinc-200 leading-relaxed font-sans">
            {actionPlan.executiveSummary}
          </p>
        </div>

        {/* 30 / 60 / 90 Days Timeline */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 font-mono text-xs">
          {/* Phase 30 Days */}
          <div className="border border-[#272B33] bg-[#0A0D12] p-4">
            <div className="flex items-center gap-1.5 text-[#03FFB2] font-bold mb-1">
              <Calendar className="h-4 w-4" /> J+1 À J+30
            </div>
            <div className="text-xs text-white font-semibold mb-2">
              {actionPlan.phase30Days.title}
            </div>
            <p className="text-[11px] text-zinc-400 font-sans mb-3">
              {actionPlan.phase30Days.focus}
            </p>
            <div className="space-y-2 border-t border-[#1C2128] pt-2">
              {actionPlan.phase30Days.milestones.map((m, idx) => (
                <div key={idx} className="flex items-start gap-1.5 text-[11px] text-zinc-300 font-sans">
                  <CheckCircle2 className="h-3.5 w-3.5 text-[#03FFB2] shrink-0 mt-0.5" />
                  <span>{m}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Phase 60 Days */}
          <div className="border border-[#272B33] bg-[#0A0D12] p-4">
            <div className="flex items-center gap-1.5 text-[#FFB224] font-bold mb-1">
              <Calendar className="h-4 w-4" /> J+31 À J+60
            </div>
            <div className="text-xs text-white font-semibold mb-2">
              {actionPlan.phase60Days.title}
            </div>
            <p className="text-[11px] text-zinc-400 font-sans mb-3">
              {actionPlan.phase60Days.focus}
            </p>
            <div className="space-y-2 border-t border-[#1C2128] pt-2">
              {actionPlan.phase60Days.milestones.map((m, idx) => (
                <div key={idx} className="flex items-start gap-1.5 text-[11px] text-zinc-300 font-sans">
                  <CheckCircle2 className="h-3.5 w-3.5 text-[#FFB224] shrink-0 mt-0.5" />
                  <span>{m}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Phase 90 Days */}
          <div className="border border-[#272B33] bg-[#0A0D12] p-4">
            <div className="flex items-center gap-1.5 text-cyan-400 font-bold mb-1">
              <Calendar className="h-4 w-4" /> J+61 À J+90
            </div>
            <div className="text-xs text-white font-semibold mb-2">
              {actionPlan.phase90Days.title}
            </div>
            <p className="text-[11px] text-zinc-400 font-sans mb-3">
              {actionPlan.phase90Days.focus}
            </p>
            <div className="space-y-2 border-t border-[#1C2128] pt-2">
              {actionPlan.phase90Days.milestones.map((m, idx) => (
                <div key={idx} className="flex items-start gap-1.5 text-[11px] text-zinc-300 font-sans">
                  <CheckCircle2 className="h-3.5 w-3.5 text-cyan-400 shrink-0 mt-0.5" />
                  <span>{m}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Institutional Proof / Citations Box */}
        <div className="border border-[#21262D] bg-[#0A0D12] p-4 font-mono text-xs">
          <div className="text-zinc-400 font-semibold mb-3 flex items-center justify-between pb-1 border-b border-[#21262D]">
            <span>[PREUVES & CITATIONS INSTITUTIONNELLES VÉRIFIÉES]</span>
            <span className="text-[10px] text-zinc-500">SOURCÉ SUR BASES OFFICIELLES</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {actionPlan.institutionalCitations.map((c, idx) => (
              <div key={idx} className="border border-[#1C2128] p-2.5 bg-[#11141A]">
                <div className="text-[11px] font-bold text-zinc-200">{c.institution}</div>
                <div className="text-[10px] text-[#03FFB2]">{c.sourceDocument}</div>
                <div className="text-[10px] text-zinc-400 mt-1 font-sans">{c.keyMetric}</div>
                <div className="text-[9px] text-zinc-600 mt-1">{c.domain}</div>
              </div>
            ))}
          </div>
        </div>
      </TechWindow>
    </div>
  );
};
