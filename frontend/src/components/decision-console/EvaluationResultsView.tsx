import React from 'react';
import { FullProjectEvaluation } from '@/types';
import { VerdictBadge } from '@/components/typesafe-ui/VerdictBadge';
import { CalibratedSlider } from '@/components/typesafe-ui/CalibratedSlider';
import { TechWindow } from '@/components/typesafe-ui/TechWindow';
import {
  TrendingUp,
  CheckCircle2,
  Calendar,
  ArrowLeft,
  Flame,
  Clock,
  FileText
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
    <div className="space-y-10 animate-fadeIn">
      {/* Top Controls / Action Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <button
            onClick={onReset}
            className="inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors cursor-pointer mb-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Nouvelle évaluation</span>
          </button>
          <h1 className="text-2xl font-bold text-foreground font-heading">
            {project.title}
          </h1>
          <p className="text-xs text-muted-foreground font-sans mt-0.5">
            Dossier n° {evaluation.id} — Région : {project.regionId} — Secteur : {project.sectorId.replace('_', ' ')}
          </p>
        </div>

        <button
          onClick={onReset}
          className="px-4 py-2 bg-secondary hover:bg-muted text-foreground border border-border text-xs font-medium transition-all"
        >
          Modifier les paramètres
        </button>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 1. VERDICT & SCORING */}
      {/* ------------------------------------------------------------- */}
      <TechWindow
        title="Arbitrage décisionnel et évaluation des risques"
        badge="Analyse prédictive"
        badgeColor={decision.verdict === 'GO' ? 'emerald' : decision.verdict === 'PIVOT' ? 'amber' : 'rose'}
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Verdict Box */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
            <VerdictBadge
              verdict={decision.verdict}
              confidence={decision.confidence}
              rationale={decision.coreRationale}
            />

            {/* Critical Constraints */}
            <div className="border border-border bg-card p-5 space-y-3 font-sans text-xs">
              <div className="text-xs font-bold text-foreground uppercase tracking-wide font-mono border-b border-border pb-2">
                Critères fondamentaux de viabilité
              </div>

              <div className="flex items-center justify-between py-1 border-b border-border/60">
                <span className="text-muted-foreground">Économie unitaire :</span>
                <span className={`font-semibold ${decision.noulChecks.unitEconomicsViable ? 'text-emerald-700' : 'text-rose-700'}`}>
                  {decision.noulChecks.unitEconomicsViable ? 'Viable (marge positive)' : 'Déficitaire'}
                </span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-border/60">
                <span className="text-muted-foreground">Pouvoir d’achat local :</span>
                <span className={`font-semibold ${decision.noulChecks.localPurchasingPowerFit ? 'text-emerald-700' : 'text-amber-800'}`}>
                  {decision.noulChecks.localPurchasingPowerFit ? 'Adéquat' : 'Prix supérieur au panier moyen'}
                </span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-border/60">
                <span className="text-muted-foreground">Trésorerie de démarrage :</span>
                <span className={`font-semibold ${decision.noulChecks.cashRunwaySufficient ? 'text-emerald-700' : 'text-rose-700'}`}>
                  {decision.noulChecks.cashRunwaySufficient ? 'Sécurisée (≥ 6 mois)' : 'Insuffisante'}
                </span>
              </div>

              {project.isUemoaExportTarget && (
                <div className="flex items-center justify-between py-1">
                  <span className="text-muted-foreground">Potentiel export UEMOA :</span>
                  <span className="font-semibold text-sky-800">
                    {decision.noulChecks.uemoaCrossborderViable ? 'Favorable' : 'À consolider'}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Calibrated Sliders Column */}
          <div className="lg:col-span-7 space-y-4">
            <div className="border-b border-border pb-2 flex items-center justify-between text-xs text-muted-foreground font-sans">
              <span className="font-semibold text-foreground uppercase tracking-wide font-mono">
                Indicateurs sectoriels comparés
              </span>
              <span>Échelle de 1.0 à 10.0</span>
            </div>

            <CalibratedSlider
              label="Rentabilité et marges brutes"
              score={decision.scores.profitabilityScore}
              benchmarkLabel="Moyenne sectorielle"
              benchmarkScore={6.0}
            />

            <CalibratedSlider
              label="Profondeur du besoin de marché"
              score={decision.scores.marketAttractivenessScore}
              benchmarkLabel="Seuil de viabilité"
              benchmarkScore={5.0}
            />

            <CalibratedSlider
              label="Sécurité de la chaîne d'approvisionnement"
              score={decision.scores.supplyChainRiskScore}
              benchmarkLabel="Seuil d'alerte"
              benchmarkScore={4.5}
            />

            <CalibratedSlider
              label="Taux de pérennité à 3 ans (ANSD RGE-2)"
              score={decision.scores.sectorSurvivalScore}
              benchmarkLabel="Moyenne nationale"
              benchmarkScore={5.1}
            />

            {project.isUemoaExportTarget && (
              <CalibratedSlider
                label="Potentiel d'expansion sous-régionale"
                score={decision.scores.uemoaExportScore}
                benchmarkLabel="Seuil d'accès"
                benchmarkScore={5.5}
              />
            )}
          </div>
        </div>
      </TechWindow>

      {/* ------------------------------------------------------------- */}
      {/* 2. FINANCIAL PROFITABILITY & BREAK-EVEN */}
      {/* ------------------------------------------------------------- */}
      <TechWindow
        title="Analyse financière et seuil de rentabilité"
        badge="Modélisation FCFA"
        badgeColor="neutral"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="border border-border bg-card p-5">
            <span className="text-xs text-muted-foreground block font-sans">Seuil de rentabilité</span>
            <span className="text-2xl font-bold text-foreground font-heading block mt-2">
              {financials.breakEvenMonthlyUnits.toLocaleString('fr-FR')}{' '}
              <span className="text-xs font-normal text-muted-foreground font-sans">unités / mois</span>
            </span>
            <span className="text-xs text-muted-foreground block mt-1 font-sans">
              Soit environ {Math.ceil(financials.breakEvenMonthlyUnits / 26)} unités / jour ouvré
            </span>
          </div>

          <div className="border border-border bg-card p-5">
            <span className="text-xs text-muted-foreground block font-sans">Chiffre d'affaires critique</span>
            <span className="text-2xl font-bold text-foreground font-heading block mt-2">
              {financials.breakEvenMonthlyRevenueFcfa.toLocaleString('fr-FR')}{' '}
              <span className="text-xs font-normal text-muted-foreground font-sans">FCFA</span>
            </span>
            <span className="text-xs text-muted-foreground block mt-1 font-sans">
              Délai moyen d'atteinte : {financials.monthsToBreakEven} mois
            </span>
          </div>

          <div className="border border-border bg-card p-5">
            <span className="text-xs text-muted-foreground block font-sans">Marge brute estimée</span>
            <span className="text-2xl font-bold text-foreground font-heading block mt-2">
              {financials.grossMarginPct}%
            </span>
            <span className={`text-xs font-semibold block mt-1 font-sans ${financials.marginVariancePct >= 0 ? 'text-emerald-700' : 'text-amber-800'}`}>
              {financials.marginVariancePct >= 0 ? `+${financials.marginVariancePct}%` : `${financials.marginVariancePct}%`} vs référence ({financials.sectorBenchmarkMarginPct}%)
            </span>
          </div>

          <div className="border border-border bg-card p-5">
            <span className="text-xs text-muted-foreground block font-sans">Fonds de roulement recommandé</span>
            <span className="text-2xl font-bold text-foreground font-heading block mt-2">
              {financials.workingCapitalReserveFcfa.toLocaleString('fr-FR')}{' '}
              <span className="text-xs font-normal text-muted-foreground font-sans">FCFA</span>
            </span>
            <span className="text-xs text-muted-foreground block mt-1 font-sans">
              Couverture de sécurité conseillée
            </span>
          </div>
        </div>

        {/* Stress Testing */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border border-border bg-card p-5 space-y-3">
            <div className="flex items-center gap-2 font-bold text-foreground text-sm font-sans">
              <Flame className="h-4 w-4 text-amber-600" />
              <span>Test de résistance : Inflation des intrants (+15%)</span>
            </div>
            <p className="text-xs text-muted-foreground font-sans leading-relaxed">
              Simulation d'une hausse brutale des coûts matières ou de l'énergie conforme aux historiques de l'ANSD.
            </p>
            <div className="pt-2 border-t border-border space-y-2 text-xs font-sans">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Marge brute après choc :</span>
                <span className="font-mono font-bold text-foreground">{financials.stressTestInflation.newGrossMarginPct}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Maintien de la rentabilité :</span>
                <span className={`font-semibold ${financials.stressTestInflation.isStillProfitable ? 'text-emerald-700' : 'text-rose-700'}`}>
                  {financials.stressTestInflation.isStillProfitable ? 'Oui (modèle résilient)' : 'Non (déficit d’exploitation)'}
                </span>
              </div>
            </div>
          </div>

          <div className="border border-border bg-card p-5 space-y-3">
            <div className="flex items-center gap-2 font-bold text-foreground text-sm font-sans">
              <Clock className="h-4 w-4 text-sky-700" />
              <span>Test de résistance : Démarrage différé (90 jours)</span>
            </div>
            <p className="text-xs text-muted-foreground font-sans leading-relaxed">
              Estimation du besoin de trésorerie strict en cas de cycle de prospection client plus long que prévu.
            </p>
            <div className="pt-2 border-t border-border space-y-2 text-xs font-sans">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Trésorerie d'urgence requise :</span>
                <span className="font-mono font-bold text-foreground">
                  {financials.stressTestDelay.requiredCashRunwayFcfa.toLocaleString('fr-FR')} FCFA
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Charges fixes incompressibles :</span>
                <span className="font-mono font-semibold text-foreground">
                  {project.monthlyFixedCostsFcfa.toLocaleString('fr-FR')} FCFA / mois
                </span>
              </div>
            </div>
          </div>
        </div>
      </TechWindow>

      {/* ------------------------------------------------------------- */}
      {/* 3. STRATEGIC DIAGNOSIS & REGIONAL TAM/SAM/SOM */}
      {/* ------------------------------------------------------------- */}
      <TechWindow
        title="Marché adressable et diagnostic stratégique"
        badge="Données démographiques ANSD"
        badgeColor="neutral"
      >
        {/* TAM / SAM / SOM */}
        <div className="border border-border bg-card p-6 mb-8 space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-border pb-3">
            <h3 className="text-xs font-bold text-foreground uppercase tracking-wider font-mono">
              Dimensionnement du marché (FCFA)
            </h3>
            <span className="text-xs text-muted-foreground font-sans">
              Population du pôle : {diagnosis.tamSamSom.targetPopulation.toLocaleString('fr-FR')} habitants
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="border border-border p-4 bg-background">
              <span className="text-xs text-muted-foreground font-sans block">TAM — Marché total</span>
              <span className="text-2xl font-bold text-foreground font-heading block mt-2">
                {(diagnosis.tamSamSom.tamFcfa / 1000000).toFixed(1)} M FCFA
              </span>
              <span className="text-xs text-muted-foreground font-sans block mt-1">Dépense annuelle estimée</span>
            </div>

            <div className="border border-border p-4 bg-background">
              <span className="text-xs text-muted-foreground font-sans block">SAM — Marché disponible</span>
              <span className="text-2xl font-bold text-foreground font-heading block mt-2">
                {(diagnosis.tamSamSom.samFcfa / 1000000).toFixed(1)} M FCFA
              </span>
              <span className="text-xs text-muted-foreground font-sans block mt-1">Cible régionale prioritaire</span>
            </div>

            <div className="border border-border p-4 bg-background">
              <span className="text-xs text-muted-foreground font-sans block">SOM — Objectif an 1 (2.5%)</span>
              <span className="text-2xl font-bold text-foreground font-heading block mt-2">
                {(diagnosis.tamSamSom.somFcfa / 1000000).toFixed(1)} M FCFA
              </span>
              <span className="text-xs text-muted-foreground font-sans block mt-1">Part capturable initiale</span>
            </div>
          </div>

          <p className="text-xs text-muted-foreground font-sans italic pt-2">
            Méthodologie : {diagnosis.tamSamSom.explanation}
          </p>
        </div>

        {/* SWOT Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="border border-border bg-card p-5 space-y-3">
            <h4 className="text-xs font-bold text-emerald-800 uppercase tracking-wider font-mono">
              Forces & atouts
            </h4>
            <ul className="text-xs text-foreground/90 space-y-2 list-disc list-inside font-sans">
              {diagnosis.swot.strengths.map((s, idx) => (
                <li key={idx} className="leading-relaxed">{s}</li>
              ))}
            </ul>
          </div>

          <div className="border border-border bg-card p-5 space-y-3">
            <h4 className="text-xs font-bold text-rose-800 uppercase tracking-wider font-mono">
              Faiblesses & vigilances
            </h4>
            <ul className="text-xs text-foreground/90 space-y-2 list-disc list-inside font-sans">
              {diagnosis.swot.weaknesses.map((w, idx) => (
                <li key={idx} className="leading-relaxed">{w}</li>
              ))}
            </ul>
          </div>

          <div className="border border-border bg-card p-5 space-y-3">
            <h4 className="text-xs font-bold text-sky-800 uppercase tracking-wider font-mono">
              Opportunités de marché
            </h4>
            <ul className="text-xs text-foreground/90 space-y-2 list-disc list-inside font-sans">
              {diagnosis.swot.opportunities.map((o, idx) => (
                <li key={idx} className="leading-relaxed">{o}</li>
              ))}
            </ul>
          </div>

          <div className="border border-border bg-card p-5 space-y-3">
            <h4 className="text-xs font-bold text-amber-800 uppercase tracking-wider font-mono">
              Menaces & risques externes
            </h4>
            <ul className="text-xs text-foreground/90 space-y-2 list-disc list-inside font-sans">
              {diagnosis.swot.threats.map((t, idx) => (
                <li key={idx} className="leading-relaxed">{t}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* PESTEL Senegal layout */}
        <div className="border border-border bg-card p-6 space-y-4">
          <h4 className="text-xs font-bold text-foreground uppercase tracking-wider font-mono border-b border-border pb-3">
            Contexte macroéconomique (PESTEL Sénégal & UEMOA)
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 font-sans text-xs">
            <div className="p-3 bg-secondary/40 border border-border">
              <span className="font-semibold text-foreground block mb-1">Politique & Réglementation :</span>
              <p className="text-muted-foreground leading-relaxed">{diagnosis.pestelSenegal.political}</p>
            </div>
            <div className="p-3 bg-secondary/40 border border-border">
              <span className="font-semibold text-foreground block mb-1">Économie & Pouvoir d'achat :</span>
              <p className="text-muted-foreground leading-relaxed">{diagnosis.pestelSenegal.economic}</p>
            </div>
            <div className="p-3 bg-secondary/40 border border-border">
              <span className="font-semibold text-foreground block mb-1">Socioculturel & Usages :</span>
              <p className="text-muted-foreground leading-relaxed">{diagnosis.pestelSenegal.social}</p>
            </div>
            <div className="p-3 bg-secondary/40 border border-border">
              <span className="font-semibold text-foreground block mb-1">Technologie & Connectivité :</span>
              <p className="text-muted-foreground leading-relaxed">{diagnosis.pestelSenegal.technological}</p>
            </div>
            <div className="p-3 bg-secondary/40 border border-border">
              <span className="font-semibold text-foreground block mb-1">Environnement & Climat :</span>
              <p className="text-muted-foreground leading-relaxed">{diagnosis.pestelSenegal.environmental}</p>
            </div>
            <div className="p-3 bg-secondary/40 border border-border">
              <span className="font-semibold text-foreground block mb-1">Fiscalité & SYSCOHADA :</span>
              <p className="text-muted-foreground leading-relaxed">{diagnosis.pestelSenegal.legal}</p>
            </div>
          </div>
        </div>
      </TechWindow>

      {/* ------------------------------------------------------------- */}
      {/* 4. GOOGLE GEMINI STRATEGIC REPORT & 30/60/90 ROADMAP */}
      {/* ------------------------------------------------------------- */}
      <TechWindow
        title="Synthèse stratégique et plan d'exécution"
        badge="Feuille de route 90 jours"
        badgeColor="neutral"
      >
        {/* Executive Summary */}
        <div className="border-l-2 border-primary bg-secondary/30 p-6 mb-8">
          <span className="text-xs text-foreground uppercase tracking-wider block font-bold font-mono mb-2">
            Recommandation générale
          </span>
          <p className="text-sm text-foreground/90 leading-relaxed font-sans">
            {actionPlan.executiveSummary}
          </p>
        </div>

        {/* 30 / 60 / 90 Days Timeline */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Phase 30 Days */}
          <div className="border border-border bg-card p-5 space-y-3">
            <div className="flex items-center gap-1.5 text-emerald-700 font-bold text-xs font-mono">
              <Calendar className="h-4 w-4" /> 1er mois (J+1 à J+30)
            </div>
            <h5 className="text-sm font-bold text-foreground font-sans">
              {actionPlan.phase30Days.title}
            </h5>
            <p className="text-xs text-muted-foreground font-sans leading-relaxed">
              {actionPlan.phase30Days.focus}
            </p>
            <div className="space-y-2 border-t border-border pt-3">
              {actionPlan.phase30Days.milestones.map((m, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-foreground/90 font-sans">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{m}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Phase 60 Days */}
          <div className="border border-border bg-card p-5 space-y-3">
            <div className="flex items-center gap-1.5 text-amber-800 font-bold text-xs font-mono">
              <Calendar className="h-4 w-4" /> 2e mois (J+31 à J+60)
            </div>
            <h5 className="text-sm font-bold text-foreground font-sans">
              {actionPlan.phase60Days.title}
            </h5>
            <p className="text-xs text-muted-foreground font-sans leading-relaxed">
              {actionPlan.phase60Days.focus}
            </p>
            <div className="space-y-2 border-t border-border pt-3">
              {actionPlan.phase60Days.milestones.map((m, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-foreground/90 font-sans">
                  <CheckCircle2 className="h-4 w-4 text-amber-700 shrink-0 mt-0.5" />
                  <span>{m}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Phase 90 Days */}
          <div className="border border-border bg-card p-5 space-y-3">
            <div className="flex items-center gap-1.5 text-sky-800 font-bold text-xs font-mono">
              <Calendar className="h-4 w-4" /> 3e mois (J+61 à J+90)
            </div>
            <h5 className="text-sm font-bold text-foreground font-sans">
              {actionPlan.phase90Days.title}
            </h5>
            <p className="text-xs text-muted-foreground font-sans leading-relaxed">
              {actionPlan.phase90Days.focus}
            </p>
            <div className="space-y-2 border-t border-border pt-3">
              {actionPlan.phase90Days.milestones.map((m, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-foreground/90 font-sans">
                  <CheckCircle2 className="h-4 w-4 text-sky-700 shrink-0 mt-0.5" />
                  <span>{m}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Institutional Proof / Citations Box */}
        <div className="border border-border bg-card p-6 space-y-4">
          <div className="border-b border-border pb-3 flex items-center justify-between text-xs">
            <span className="font-bold text-foreground uppercase tracking-wide font-mono">
              Références et sources certifiées
            </span>
            <span className="text-muted-foreground font-sans">Bases officielles</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {actionPlan.institutionalCitations.map((c, idx) => (
              <div key={idx} className="border border-border p-4 bg-secondary/20 space-y-1">
                <div className="text-xs font-bold text-foreground font-sans">{c.institution}</div>
                <div className="text-xs text-primary font-medium">{c.sourceDocument}</div>
                <div className="text-xs text-muted-foreground font-sans pt-1">{c.keyMetric}</div>
              </div>
            ))}
          </div>
        </div>
      </TechWindow>
    </div>
  );
};

