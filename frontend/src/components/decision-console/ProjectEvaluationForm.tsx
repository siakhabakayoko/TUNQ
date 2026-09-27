import React, { useState, useEffect } from 'react';
import { ProjectInput, SectorId, RegionId, CountryCode } from '@/types';
import { getAllSectors, getAllRegions, getUemoaCountries } from '@/lib/ansd-service';
import { Sparkles, ArrowRight, Play, Sliders, Globe, Check, Loader2, Sparkle } from 'lucide-react';
import type { PricingSuggestionOutput } from '@/lib/ansd-pricing';

interface ProjectEvaluationFormProps {
  onSubmit: (input: ProjectInput) => void;
  isLoading: boolean;
}

export const ProjectEvaluationForm: React.FC<ProjectEvaluationFormProps> = ({
  onSubmit,
  isLoading
}) => {
  const sectors = getAllSectors();
  const regions = getAllRegions();
  const uemoaCountries = getUemoaCountries();

  const [form, setForm] = useState<ProjectInput>({
    title: '',
    tagline: '',
    sectorId: (sectors[0]?.sector_id as SectorId) || 'TECH_DIGITAL',
    regionId: 'DK',
    description: '',
    unitPriceFcfa: 0,
    unitCostFcfa: 0,
    monthlyFixedCostsFcfa: 0,
    targetMonthlySalesVolume: 0,
    isUemoaExportTarget: false,
    uemoaTargetCountry: 'CI'
  });

  const [suggestion, setSuggestion] = useState<PricingSuggestionOutput | null>(null);
  const [isSuggesting, setIsSuggesting] = useState<boolean>(false);
  const [appliedAnsd, setAppliedAnsd] = useState<boolean>(false);

  const requestAnsdPricing = async (customForm?: ProjectInput) => {
    const target = customForm || form;
    if (!target.title || target.title.trim().length < 3) return;

    setIsSuggesting(true);
    try {
      const res = await fetch('/api/ansd/pricing-suggest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: target.title,
          description: target.description,
          sectorId: target.sectorId,
          regionId: target.regionId,
          isUemoaExportTarget: target.isUemoaExportTarget,
          uemoaTargetCountry: target.uemoaTargetCountry,
        }),
      });
      const data = await res.json();
      if (data.success && data.suggestion) {
        setSuggestion(data.suggestion);
      }
    } catch (err) {
      console.warn('Failed to fetch ANSD pricing suggestion:', err);
    } finally {
      setIsSuggesting(false);
    }
  };

  // Détection automatique dès que la partie gauche (titre, secteur, région, export) est modifiée
  useEffect(() => {
    if (!form.title || form.title.trim().length < 3) {
      setSuggestion(null);
      return;
    }
    const timer = setTimeout(() => {
      requestAnsdPricing(form);
    }, 750);
    return () => clearTimeout(timer);
  }, [form.title, form.description, form.sectorId, form.regionId, form.isUemoaExportTarget, form.uemoaTargetCountry]);

  const handleApplySuggestion = () => {
    if (!suggestion) return;
    setForm((prev) => ({
      ...prev,
      unitPriceFcfa: suggestion.suggestedUnitPriceFcfa,
      unitCostFcfa: suggestion.suggestedUnitCostFcfa,
      monthlyFixedCostsFcfa: suggestion.suggestedMonthlyFixedCostsFcfa,
      targetMonthlySalesVolume: suggestion.suggestedMonthlySalesVolume,
    }));
    setAppliedAnsd(true);
    setTimeout(() => setAppliedAnsd(false), 3000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Grid: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column: Scope & Geography */}
        <div className="space-y-5">
          <div className="space-y-1.5">
            <label htmlFor="field-project-title" className="block text-xs font-semibold text-foreground font-sans">
              Nom du projet <span className="text-destructive">*</span>
            </label>
            <input
              id="field-project-title"
              type="text"
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full bg-background border border-input px-3.5 py-2.5 text-sm text-foreground font-sans focus:border-primary focus:outline-hidden transition-colors"
              placeholder="Ex: Solution d'encaissement et TPE mobile"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label htmlFor="field-sector" className="block text-xs font-semibold text-foreground font-sans">
                Secteur d'activité <span className="text-destructive">*</span>
              </label>
              <select
                id="field-sector"
                value={form.sectorId}
                onChange={(e) => setForm({ ...form, sectorId: e.target.value as SectorId })}
                className="w-full bg-background border border-input px-3 py-2.5 text-xs text-foreground font-sans focus:border-primary focus:outline-hidden"
              >
                {sectors.map((s) => (
                  <option key={s.sector_id} value={s.sector_id}>
                    {s.name} (Survie: {s.survival_rate_3yr}%)
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="field-region" className="block text-xs font-semibold text-foreground font-sans">
                Région principale <span className="text-destructive">*</span>
              </label>
              <select
                id="field-region"
                value={form.regionId}
                onChange={(e) => setForm({ ...form, regionId: e.target.value as RegionId })}
                className="w-full bg-background border border-input px-3 py-2.5 text-xs text-foreground font-sans focus:border-primary focus:outline-hidden"
              >
                {regions.map((r) => (
                  <option key={r.region_id} value={r.region_id}>
                    {r.name} ({r.population.toLocaleString('fr-FR')} hab.)
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="field-description" className="block text-xs font-semibold text-foreground font-sans">
              Description de l'activité & proposition de valeur
            </label>
            <textarea
              id="field-description"
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full bg-background border border-input px-3.5 py-2.5 text-xs text-foreground font-sans focus:border-primary focus:outline-hidden leading-relaxed"
              placeholder="Précisez la proposition de valeur, les cibles clients et le modèle de distribution..."
            />
          </div>

          {/* UEMOA Export Target Toggle */}
          <div className="border border-border p-4 bg-secondary/30 flex items-start justify-between gap-4">
            <div className="space-y-0.5">
              <label htmlFor="field-uemoa-export" className="text-xs font-semibold text-foreground font-sans cursor-pointer block">
                Viser également un marché export UEMOA
              </label>
              <div className="text-xs text-muted-foreground font-sans">
                Permet d'évaluer le marché sous-régional élargi et les corridors commerciaux.
              </div>
            </div>
            <input
              id="field-uemoa-export"
              type="checkbox"
              checked={form.isUemoaExportTarget}
              onChange={(e) => setForm({ ...form, isUemoaExportTarget: e.target.checked })}
              className="h-4 w-4 mt-0.5 accent-primary cursor-pointer"
            />
          </div>

          {form.isUemoaExportTarget && (
            <div className="space-y-1.5">
              <label htmlFor="field-uemoa-country" className="block text-xs font-semibold text-foreground font-sans">
                Pays cible prioritaire dans l'UEMOA
              </label>
              <select
                id="field-uemoa-country"
                value={form.uemoaTargetCountry || 'CI'}
                onChange={(e) => setForm({ ...form, uemoaTargetCountry: e.target.value as CountryCode })}
                className="w-full bg-background border border-input px-3 py-2.5 text-xs text-foreground font-sans focus:border-primary focus:outline-hidden"
              >
                {uemoaCountries.filter(c => c.country_code !== 'SN').map((c) => (
                  <option key={c.country_code} value={c.country_code}>
                    {c.name} ({c.population.toLocaleString('fr-FR')} hab.)
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Right Column: Financial Inputs */}
        <div className="space-y-5">
          <div className="border border-border bg-card p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-3">
              <h3 className="text-xs font-bold text-foreground uppercase tracking-wider font-mono">
                Données financières prévisionnelles
              </h3>

              <button
                type="button"
                onClick={() => requestAnsdPricing()}
                disabled={isSuggesting || !form.title || form.title.trim().length < 3}
                className="inline-flex items-center gap-1.5 text-xs text-primary font-medium hover:underline disabled:opacity-40 disabled:no-underline cursor-pointer"
                title="Estimer les prix et charges à partir des indicateurs RGE-2 et RGPH-5 de l'ANSD"
              >
                {isSuggesting ? (
                  <>
                    <Loader2 className="h-3 w-3 animate-spin text-primary" />
                    <span>Calcul ANSD & IA...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-3 w-3 text-primary" />
                    <span>Estimer via l'ANSD</span>
                  </>
                )}
              </button>
            </div>

            {/* ANSD & Gemini Pricing Recommendation Banner */}
            {suggestion && (
              <div className="p-3.5 border border-primary/30 bg-secondary/50 space-y-2.5 transition-all">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold text-foreground flex items-center gap-1.5 font-heading">
                      <Sparkles className="h-3.5 w-3.5 text-primary" />
                      Tarification recommandée ANSD
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 bg-background border border-border font-mono text-muted-foreground">
                      {suggestion.source === 'gemini_ai' ? 'Gemini 3.8 + ANSD' : 'RGE-2 Calibré'}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={handleApplySuggestion}
                    className="text-xs font-semibold px-2.5 py-1 bg-primary text-primary-foreground hover:opacity-90 transition-all font-sans flex items-center gap-1 shadow-xs cursor-pointer"
                  >
                    {appliedAnsd ? (
                      <>
                        <Check className="h-3 w-3 text-emerald-400" />
                        <span>Appliqué !</span>
                      </>
                    ) : (
                      <>
                        <span>Appliquer ces prix</span>
                        <ArrowRight className="h-3 w-3" />
                      </>
                    )}
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
                  <div className="bg-background p-2 border border-border">
                    <div className="text-[10px] text-muted-foreground">Prix unitaire</div>
                    <div className="font-bold text-foreground">{suggestion.suggestedUnitPriceFcfa.toLocaleString('fr-FR')} F</div>
                  </div>
                  <div className="bg-background p-2 border border-border">
                    <div className="text-[10px] text-muted-foreground">Coût unitaire</div>
                    <div className="font-bold text-foreground">{suggestion.suggestedUnitCostFcfa.toLocaleString('fr-FR')} F</div>
                  </div>
                  <div className="bg-background p-2 border border-border">
                    <div className="text-[10px] text-muted-foreground">Charges fixes/m</div>
                    <div className="font-bold text-foreground">{suggestion.suggestedMonthlyFixedCostsFcfa.toLocaleString('fr-FR')} F</div>
                  </div>
                  <div className="bg-background p-2 border border-border">
                    <div className="text-[10px] text-muted-foreground">Ventes/m</div>
                    <div className="font-bold text-foreground">{suggestion.suggestedMonthlySalesVolume.toLocaleString('fr-FR')} u.</div>
                  </div>
                </div>

                <p className="text-[11px] text-muted-foreground font-sans leading-relaxed">
                  {suggestion.rationale}
                </p>
              </div>
            )}

            {!suggestion && (!form.title || form.title.trim().length < 3) && (
              <div className="text-[11px] text-muted-foreground font-sans bg-secondary/30 p-2.5 border border-dashed border-border flex items-center gap-2">
                <Sparkles className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                <span>Renseignez le nom et la description du projet à gauche pour obtenir la recommandation de prix automatique de l'ANSD.</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label htmlFor="field-unit-price" className="block text-xs font-medium text-muted-foreground font-sans">
                  Prix de vente unitaire
                </label>
                <div className="relative">
                  <input
                    id="field-unit-price"
                    type="number"
                    required
                    min={1}
                    value={form.unitPriceFcfa || ''}
                    onChange={(e) => setForm({ ...form, unitPriceFcfa: Number(e.target.value) })}
                    placeholder="25 000"
                    className="w-full bg-background border border-input px-3 py-2 text-xs text-foreground font-mono focus:border-primary focus:outline-hidden"
                  />
                  <span className="absolute right-3 top-2 text-[11px] text-muted-foreground font-mono">FCFA</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="field-unit-cost" className="block text-xs font-medium text-muted-foreground font-sans">
                  Coût de revient unitaire
                </label>
                <div className="relative">
                  <input
                    id="field-unit-cost"
                    type="number"
                    required
                    min={0}
                    value={form.unitCostFcfa || ''}
                    onChange={(e) => setForm({ ...form, unitCostFcfa: Number(e.target.value) })}
                    placeholder="12 500"
                    className="w-full bg-background border border-input px-3 py-2 text-xs text-foreground font-mono focus:border-primary focus:outline-hidden"
                  />
                  <span className="absolute right-3 top-2 text-[11px] text-muted-foreground font-mono">FCFA</span>
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="field-fixed-costs" className="block text-xs font-medium text-muted-foreground font-sans">
                Charges fixes mensuelles (loyer, salaires, énergie)
              </label>
              <div className="relative">
                <input
                  id="field-fixed-costs"
                  type="number"
                  required
                  min={1}
                  value={form.monthlyFixedCostsFcfa || ''}
                  onChange={(e) => setForm({ ...form, monthlyFixedCostsFcfa: Number(e.target.value) })}
                  placeholder="350 000"
                  className="w-full bg-background border border-input px-3 py-2 text-xs text-foreground font-mono focus:border-primary focus:outline-hidden"
                />
                <span className="absolute right-3 top-2 text-[11px] text-muted-foreground font-mono">FCFA / mois</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="field-sales-volume" className="block text-xs font-medium text-muted-foreground font-sans">
                Volume de ventes mensuel prévisionnel (unités)
              </label>
              <input
                id="field-sales-volume"
                type="number"
                required
                min={1}
                value={form.targetMonthlySalesVolume || ''}
                onChange={(e) => setForm({ ...form, targetMonthlySalesVolume: Number(e.target.value) })}
                placeholder="100"
                className="w-full bg-background border border-input px-3 py-2 text-xs text-foreground font-mono focus:border-primary focus:outline-hidden"
              />
            </div>

            {/* Quick Live Preview of Margin */}
            <div className="pt-3 border-t border-border flex justify-between items-center text-xs font-sans">
              <span className="text-muted-foreground">Marge brute unitaire estimée :</span>
              <span className={`font-mono font-bold ${form.unitPriceFcfa > form.unitCostFcfa ? 'text-emerald-700' : 'text-destructive'}`}>
                {(form.unitPriceFcfa - form.unitCostFcfa).toLocaleString('fr-FR')} FCFA (
                {form.unitPriceFcfa > 0
                  ? (((form.unitPriceFcfa - form.unitCostFcfa) / form.unitPriceFcfa) * 100).toFixed(1)
                  : 0}
                %)
              </span>
            </div>
          </div>

          {/* Launch Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 bg-primary hover:opacity-90 text-primary-foreground font-sans font-semibold text-sm tracking-wide transition-all shadow-xs flex items-center justify-center gap-2 border border-primary disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {isLoading ? (
              <>
                <div className="h-4 w-4 border-2 border-primary-foreground border-t-transparent animate-spin" />
                <span>Analyse en cours...</span>
              </>
            ) : (
              <>
                <span>Évaluer la viabilité du projet</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
};
