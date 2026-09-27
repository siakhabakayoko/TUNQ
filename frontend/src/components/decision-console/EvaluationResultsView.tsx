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
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-secondary/60 border border-border p-3.5 font-mono text-xs">
        <div className="flex items-center gap-3">
          <span className="text-foreground font-bold">DOSSIER : #{evaluation.id}</span>
          <span className="text-border">|</span>
          <span className="text-foreground font-semibold">{project.title}</span>
          <span className="text-muted-foreground">({project.regionId})</span>
        </div>
        <button
          onClick={onReset}
          className="px-3.5 py-1.5 bg-card hover:bg-muted text-foreground border border-border text-xs font-mono transition-all font-semibold"
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
            <div className="mt-4 border border-border bg-secondary/30 p-3.5 font-mono text-xs space-y-2">
              <div className="text-[10px] text-muted-foreground tracking-wider uppercase font-semibold mb-1">
                VALIDATION DES CONTRAINTES CRITIQUES (NOUL PRIMITIVES)
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Économie unitaire viable :</span>
                <span className={`font-bold ${decision.noulChecks.unitEconomicsViable ? 'text-emerald-700' : 'text-rose-700'}`}>
                  {decision.noulChecks.unitEconomicsViable ? 'OUI (Viable)' : 'NON (Déficit)'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Adéquation pouvoir d’achat local :</span>
                <span className={`font-bold ${decision.noulChecks.localPurchasingPowerFit ? 'text-emerald-700' : 'text-amber-800'}`}>
                  {decision.noulChecks.localPurchasingPowerFit ? 'OUI (Conforme)' : 'ATTENTION (Élevé)'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Trésorerie de démarrage suffisante :</span>
                <span className={`font-bold ${decision.noulChecks.cashRunwaySufficient ? 'text-emerald-700' : 'text-rose-700'}`}>
                  {decision.noulChecks.cashRunwaySufficient ? 'OUI (≥ 6 mois)' : 'NON (< Seuil)'}
                </span>
              </div>
              {project.isUemoaExportTarget && (
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Scalabilité export UEMOA :</span>
                  <span className="font-bold text-sky-800">
                    {decision.noulChecks.uemoaCrossborderViable ? 'OUI (Prêt)' : 'À STRUCTURER'}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Calibrated Sliders Column */}
          <div className="lg:col-span-7 space-y-1">
            <div className="font-mono text-xs text-muted-foreground mb-2 flex items-center justify-between font-semibold">
              <span>INDICATEURS ÉTALONNÉS PAR JEV</span>
              <span className="text-[10px] text-muted-foreground">ÉCHELLE DÉCISIONNELLE 1.0 - 10.0</span>
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
          <div className="bg-card border border-border p-3.5 shadow-xs">
            <span className="text-[10px] text-muted-foreground block uppercase font-semibold">SEUIL DE RENTABILITÉ (UNITÉS)</span>
            <span className="text-xl font-bold text-foreground block mt-1">
              {financials.breakEvenMonthlyUnits.toLocaleString('fr-FR')}{' '}
              <span className="text-xs text-muted-foreground font-normal">unités / mois</span>
            </span>
            <span className="text-[10px] text-muted-foreground block mt-1">
              Soit {Math.ceil(financials.breakEvenMonthlyUnits / 26)} unités / jour ouvré
            </span>
          </div>

          <div className="bg-card border border-border p-3.5 shadow-xs">
            <span className="text-[10px] text-muted-foreground block uppercase font-semibold">POINT MORT MENSUEL (CA CRITIQUE)</span>
            <span className="text-xl font-bold text-emerald-700 block mt-1">
              {financials.breakEvenMonthlyRevenueFcfa.toLocaleString('fr-FR')}{' '}
              <span className="text-xs text-muted-foreground font-normal">FCFA</span>
            </span>
            <span className="text-[10px] text-muted-foreground block mt-1">
              Délai moyen d’atteinte : {financials.monthsToBreakEven} mois
            </span>
          </div>

          <div className="bg-card border border-border p-3.5 shadow-xs">
            <span className="text-[10px] text-muted-foreground block uppercase font-semibold">MARGE BRUTE RÉELLE VS ANSD</span>
            <span className="text-xl font-bold text-foreground block mt-1">
              {financials.grossMarginPct}%
            </span>
            <span className={`text-[10px] font-bold block mt-1 ${financials.marginVariancePct >= 0 ? 'text-emerald-700' : 'text-amber-800'}`}>
              {financials.marginVariancePct >= 0 ? `+${financials.marginVariancePct}%` : `${financials.marginVariancePct}%`} vs RGE ({financials.sectorBenchmarkMarginPct}%)
            </span>
          </div>

          <div className="bg-card border border-border p-3.5 shadow-xs">
            <span className="text-[10px] text-muted-foreground block uppercase font-semibold">BFR & RÉSERVE DE SÉCURITÉ</span>
            <span className="text-xl font-bold text-sky-800 block mt-1">
              {financials.workingCapitalReserveFcfa.toLocaleString('fr-FR')}{' '}
              <span className="text-xs text-muted-foreground font-normal">FCFA</span>
            </span>
            <span className="text-[10px] text-muted-foreground block mt-1">
              Couvre 4,5 mois de charges + stock
            </span>
          </div>
        </div>

        {/* Stress Testing Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
          <div className="border border-border bg-card p-4 shadow-xs">
            <div className="flex items-center gap-2 font-bold text-foreground mb-2">
              <Flame className="h-4 w-4 text-amber-600" />
              STRESS-TEST 1 : CHOC D’INFLATION SUR INTRANTS (+15%)
            </div>
            <p className="text-muted-foreground text-[11px] font-sans mb-3 leading-relaxed">
              Simule une flambée des prix matières ou de l'énergie conforme aux pics de l'IPPI/IHPC au Sénégal.
            </p>
            <div className="flex justify-between py-1.5 border-t border-border">
              <span className="text-muted-foreground">Marge brute après choc :</span>
              <span className={`font-bold ${financials.stressTestInflation.newGrossMarginPct > 15 ? 'text-emerald-700' : 'text-rose-700'}`}>
                {financials.stressTestInflation.newGrossMarginPct}%
              </span>
            </div>
            <div className="flex justify-between py-1.5 border-t border-border">
              <span className="text-muted-foreground">Le modèle reste-t-il bénéficiaire ?</span>
              <span className={`font-bold ${financials.stressTestInflation.isStillProfitable ? 'text-emerald-700' : 'text-rose-700'}`}>
                {financials.stressTestInflation.isStillProfitable ? 'OUI (Marge positive)' : 'NON (Passe en perte)'}
              </span>
            </div>
          </div>

          <div className="border border-border bg-card p-4 shadow-xs">
            <div className="flex items-center gap-2 font-bold text-foreground mb-2">
              <Clock className="h-4 w-4 text-sky-700" />
              STRESS-TEST 2 : RETARD COMMERCIAL (90 JOURS SANS VENTES)
            </div>
            <p className="text-muted-foreground text-[11px] font-sans mb-3 leading-relaxed">
              Mesure la trésorerie purement requise pour tenir en cas de lenteur d’amorçage client au Sénégal.
            </p>
            <div className="flex justify-between py-1.5 border-t border-border">
              <span className="text-muted-foreground">Trésorerie d’urgence 90 jours :</span>
              <span className="text-sky-800 font-bold">
                {financials.stressTestDelay.requiredCashRunwayFcfa.toLocaleString('fr-FR')} FCFA
              </span>
            </div>
            <div className="flex justify-between py-1.5 border-t border-border">
              <span className="text-muted-foreground">Charges fixes mensuelles incompressibles :</span>
              <span className="text-foreground font-semibold">
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
        <div className="bg-secondary/40 border border-border p-4 mb-6 font-mono">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-3">
            <span className="font-bold text-foreground text-xs uppercase tracking-wide">
              MÉTRIQUES DE TAILLE DE MARCHÉ (TAM / SAM / SOM EN FCFA)
            </span>
            <span className="text-[10px] text-muted-foreground font-semibold">
              POPULATION CIBLE : {diagnosis.tamSamSom.targetPopulation.toLocaleString('fr-FR')} HABITANTS
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="border border-border p-3 bg-card shadow-xs">
              <span className="text-[10px] text-muted-foreground block font-semibold">TAM (MARCHÉ TOTAL ADRESSABLE)</span>
              <span className="text-lg font-bold text-foreground block mt-1 font-heading">
                {(diagnosis.tamSamSom.tamFcfa / 1000000).toFixed(1)} M FCFA
              </span>
              <span className="text-[10px] text-muted-foreground block">Dépense annuelle globale estimée</span>
            </div>
            <div className="border border-border p-3 bg-card shadow-xs">
              <span className="text-[10px] text-muted-foreground block font-semibold">SAM (MARCHÉ DISPONIBLE RÉGIONAL)</span>
              <span className="text-lg font-bold text-emerald-700 block mt-1 font-heading">
                {(diagnosis.tamSamSom.samFcfa / 1000000).toFixed(1)} M FCFA
              </span>
              <span className="text-[10px] text-muted-foreground block">Cible sur le pôle {project.regionId}</span>
            </div>
            <div className="border border-border p-3 bg-card shadow-xs">
              <span className="text-[10px] text-muted-foreground block font-semibold">SOM (OBJECTIF AN 1 RÉALISTE - 2.5%)</span>
              <span className="text-lg font-bold text-sky-800 block mt-1 font-heading">
                {(diagnosis.tamSamSom.somFcfa / 1000000).toFixed(1)} M FCFA
              </span>
              <span className="text-[10px] text-muted-foreground block">Part capturable à l’amorçage</span>
            </div>
          </div>
          <div className="text-[11px] text-muted-foreground mt-3 font-sans italic">
            Note méthodologique : {diagnosis.tamSamSom.explanation}
          </div>
        </div>

        {/* SWOT Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="border border-emerald-300 bg-emerald-50/70 p-4">
            <span className="font-mono text-xs font-bold text-emerald-800 block mb-2">
              [FORCES // ATOUTS COMPÉTITIFS]
            </span>
            <ul className="text-xs text-foreground space-y-1.5 list-disc list-inside font-sans">
              {diagnosis.swot.strengths.map((s, idx) => (
                <li key={idx}>{s}</li>
              ))}
            </ul>
          </div>

          <div className="border border-rose-300 bg-rose-50/70 p-4">
            <span className="font-mono text-xs font-bold text-rose-800 block mb-2">
              [FAIBLESSES // VULNÉRABILITÉS INTERNES]
            </span>
            <ul className="text-xs text-foreground space-y-1.5 list-disc list-inside font-sans">
              {diagnosis.swot.weaknesses.map((w, idx) => (
                <li key={idx}>{w}</li>
              ))}
            </ul>
          </div>

          <div className="border border-sky-300 bg-sky-50/70 p-4">
            <span className="font-mono text-xs font-bold text-sky-800 block mb-2">
              [OPPORTUNITÉS // DYNAMIQUE DU MARCHÉ]
            </span>
            <ul className="text-xs text-foreground space-y-1.5 list-disc list-inside font-sans">
              {diagnosis.swot.opportunities.map((o, idx) => (
                <li key={idx}>{o}</li>
              ))}
            </ul>
          </div>

          <div className="border border-amber-300 bg-amber-50/70 p-4">
            <span className="font-mono text-xs font-bold text-amber-800 block mb-2">
              [MENACES // RISQUES MACRO-ÉCONOMIQUES]
            </span>
            <ul className="text-xs text-foreground space-y-1.5 list-disc list-inside font-sans">
              {diagnosis.swot.threats.map((t, idx) => (
                <li key={idx}>{t}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* PESTEL Senegal layout */}
        <div className="border border-border bg-card p-4 font-mono text-xs shadow-xs">
          <div className="text-xs font-bold text-foreground mb-3 pb-2 border-b border-border">
            [CADRE PESTEL CONTEXTUALISÉ AU SÉNÉGAL & À L'UEMOA]
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-sans text-xs">
            <div className="p-2.5 bg-secondary/30 border border-border">
              <span className="font-mono text-[11px] text-foreground font-bold block mb-1">POLITIQUE :</span>
              <p className="text-muted-foreground leading-relaxed">{diagnosis.pestelSenegal.political}</p>
            </div>
            <div className="p-2.5 bg-secondary/30 border border-border">
              <span className="font-mono text-[11px] text-foreground font-bold block mb-1">ÉCONOMIQUE :</span>
              <p className="text-muted-foreground leading-relaxed">{diagnosis.pestelSenegal.economic}</p>
            </div>
            <div className="p-2.5 bg-secondary/30 border border-border">
              <span className="font-mono text-[11px] text-foreground font-bold block mb-1">SOCIOCULTUREL :</span>
              <p className="text-muted-foreground leading-relaxed">{diagnosis.pestelSenegal.social}</p>
            </div>
            <div className="p-2.5 bg-secondary/30 border border-border">
              <span className="font-mono text-[11px] text-foreground font-bold block mb-1">TECHNOLOGIQUE :</span>
              <p className="text-muted-foreground leading-relaxed">{diagnosis.pestelSenegal.technological}</p>
            </div>
            <div className="p-2.5 bg-secondary/30 border border-border">
              <span className="font-mono text-[11px] text-foreground font-bold block mb-1">ENVIRONNEMENTAL :</span>
              <p className="text-muted-foreground leading-relaxed">{diagnosis.pestelSenegal.environmental}</p>
            </div>
            <div className="p-2.5 bg-secondary/30 border border-border">
              <span className="font-mono text-[11px] text-foreground font-bold block mb-1">LÉGAL & FISCAL :</span>
              <p className="text-muted-foreground leading-relaxed">{diagnosis.pestelSenegal.legal}</p>
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
        <div className="bg-secondary/40 border-l-4 border-primary p-4 mb-6">
          <span className="font-mono text-xs text-foreground block uppercase tracking-wider mb-1 font-bold">
            RÉSUMÉ EXÉCUTIF POUR L'ENTREPRENEUR & INVESTISSEURS
          </span>
          <p className="text-sm text-foreground/90 leading-relaxed font-sans">
            {actionPlan.executiveSummary}
          </p>
        </div>

        {/* 30 / 60 / 90 Days Timeline */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 font-mono text-xs">
          {/* Phase 30 Days */}
          <div className="border border-border bg-card p-4 shadow-xs">
            <div className="flex items-center gap-1.5 text-emerald-700 font-bold mb-1">
              <Calendar className="h-4 w-4" /> J+1 À J+30
            </div>
            <div className="text-xs text-foreground font-semibold mb-2">
              {actionPlan.phase30Days.title}
            </div>
            <p className="text-[11px] text-muted-foreground font-sans mb-3 leading-relaxed">
              {actionPlan.phase30Days.focus}
            </p>
            <div className="space-y-2 border-t border-border pt-2">
              {actionPlan.phase30Days.milestones.map((m, idx) => (
                <div key={idx} className="flex items-start gap-1.5 text-[11px] text-foreground/90 font-sans">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{m}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Phase 60 Days */}
          <div className="border border-border bg-card p-4 shadow-xs">
            <div className="flex items-center gap-1.5 text-amber-800 font-bold mb-1">
              <Calendar className="h-4 w-4" /> J+31 À J+60
            </div>
            <div className="text-xs text-foreground font-semibold mb-2">
              {actionPlan.phase60Days.title}
            </div>
            <p className="text-[11px] text-muted-foreground font-sans mb-3 leading-relaxed">
              {actionPlan.phase60Days.focus}
            </p>
            <div className="space-y-2 border-t border-border pt-2">
              {actionPlan.phase60Days.milestones.map((m, idx) => (
                <div key={idx} className="flex items-start gap-1.5 text-[11px] text-foreground/90 font-sans">
                  <CheckCircle2 className="h-3.5 w-3.5 text-amber-700 shrink-0 mt-0.5" />
                  <span>{m}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Phase 90 Days */}
          <div className="border border-border bg-card p-4 shadow-xs">
            <div className="flex items-center gap-1.5 text-sky-800 font-bold mb-1">
              <Calendar className="h-4 w-4" /> J+61 À J+90
            </div>
            <div className="text-xs text-foreground font-semibold mb-2">
              {actionPlan.phase90Days.title}
            </div>
            <p className="text-[11px] text-muted-foreground font-sans mb-3 leading-relaxed">
              {actionPlan.phase90Days.focus}
            </p>
            <div className="space-y-2 border-t border-border pt-2">
              {actionPlan.phase90Days.milestones.map((m, idx) => (
                <div key={idx} className="flex items-start gap-1.5 text-[11px] text-foreground/90 font-sans">
                  <CheckCircle2 className="h-3.5 w-3.5 text-sky-700 shrink-0 mt-0.5" />
                  <span>{m}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Institutional Proof / Citations Box */}
        <div className="border border-border bg-card p-4 font-mono text-xs shadow-xs">
          <div className="text-muted-foreground font-semibold mb-3 flex items-center justify-between pb-2 border-b border-border">
            <span className="text-foreground font-bold">[PREUVES & CITATIONS INSTITUTIONNELLES VÉRIFIÉES]</span>
            <span className="text-[10px] text-muted-foreground">SOURCÉ SUR BASES OFFICIELLES</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {actionPlan.institutionalCitations.map((c, idx) => (
              <div key={idx} className="border border-border p-3 bg-secondary/30">
                <div className="text-[11px] font-bold text-foreground">{c.institution}</div>
                <div className="text-[10px] text-primary font-semibold">{c.sourceDocument}</div>
                <div className="text-[11px] text-foreground/90 mt-1 font-sans">{c.keyMetric}</div>
                <div className="text-[9px] text-muted-foreground mt-1 uppercase font-mono">{c.domain}</div>
              </div>
            ))}
          </div>
        </div>
      </TechWindow>
    </div>
  );
};
