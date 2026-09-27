import React, { useState } from 'react';
import { ProjectInput, SectorId, RegionId, CountryCode } from '@/types';
import { getAllSectors, getAllRegions, getUemoaCountries } from '@/lib/ansd-service';
import { Sparkles, ArrowRight, Play, Sliders, Globe } from 'lucide-react';

interface ProjectEvaluationFormProps {
  onSubmit: (input: ProjectInput) => void;
  isLoading: boolean;
}

const PRESETS = [
  {
    title: 'Fintech & Terminal Marchand Mobile',
    tagline: 'Solution d’encaissement QR code & TPE hybride pour commerçants',
    sectorId: 'TECH_DIGITAL' as SectorId,
    regionId: 'DK' as RegionId,
    description: 'Déploiement d’un terminal de paiement et d’une app mobile pour les boutiques et supérettes à Dakar, interconnectée avec Wave et Orange Money.',
    unitPriceFcfa: 45000,
    unitCostFcfa: 18000,
    monthlyFixedCostsFcfa: 1850000,
    targetMonthlySalesVolume: 120,
    isUemoaExportTarget: true,
    uemoaTargetCountry: 'CI' as CountryCode
  },
  {
    title: 'Transformation Mangues & Céréales Locales',
    tagline: 'Unité agro-industrielle de séchage et conditionnement',
    sectorId: 'AGRO_INDUSTRY' as SectorId,
    regionId: 'TH' as RegionId,
    description: 'Transformation et emballage sous vide de mangues séchées du bassin des Niayes et céréales locales (mil, maïs) pour la grande distribution et l’export.',
    unitPriceFcfa: 2500,
    unitCostFcfa: 1200,
    monthlyFixedCostsFcfa: 1400000,
    targetMonthlySalesVolume: 2500,
    isUemoaExportTarget: true,
    uemoaTargetCountry: 'ML' as CountryCode
  },
  {
    title: 'Logistique Fret Transit Dakar-Bamako',
    tagline: 'Plateforme de traçabilité et groupage pour transporteurs',
    sectorId: 'TRANSPORT_LOGISTICS' as SectorId,
    regionId: 'TC' as RegionId,
    description: 'Plateforme SaaS et relais d’assistance logistique sur le corridor routier Dakar-Tambacounda-Bamako pour les importateurs maliens.',
    unitPriceFcfa: 120000,
    unitCostFcfa: 45000,
    monthlyFixedCostsFcfa: 2800000,
    targetMonthlySalesVolume: 65,
    isUemoaExportTarget: true,
    uemoaTargetCountry: 'ML' as CountryCode
  },
  {
    title: 'Pôle Médical & Imagerie Régionale',
    tagline: 'Centre de diagnostic et consultations spécialisées',
    sectorId: 'HEALTH_PHARMA' as SectorId,
    regionId: 'SL' as RegionId,
    description: 'Création d’un centre de diagnostic moderne à Saint-Louis pour réduire les évacuations sanitaires vers Dakar et la Mauritanie.',
    unitPriceFcfa: 35000,
    unitCostFcfa: 12000,
    monthlyFixedCostsFcfa: 3500000,
    targetMonthlySalesVolume: 220,
    isUemoaExportTarget: false
  }
];

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
    sectorId: sectors[0].sector_id,
    regionId: 'DK',
    description: '',
    unitPriceFcfa: 0,
    unitCostFcfa: 0,
    monthlyFixedCostsFcfa: 0,
    targetMonthlySalesVolume: 0,
    isUemoaExportTarget: false,
    uemoaTargetCountry: 'CI'
  });

  const applyPreset = (idx: number) => {
    setForm({ ...PRESETS[idx] });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Quick-Load Presets */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6 border-b border-border">
        <span className="text-xs font-medium text-muted-foreground font-sans">
          Charger un exemple type :
        </span>
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((p, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => applyPreset(idx)}
              className="px-3 py-1.5 border border-border hover:border-primary bg-card hover:bg-secondary text-xs text-foreground font-medium transition-all font-sans"
            >
              {p.title.split('&')[0].trim()}
            </button>
          ))}
        </div>
      </div>

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
            <h3 className="text-xs font-bold text-foreground uppercase tracking-wider font-mono border-b border-border pb-3">
              Données financières prévisionnelles
            </h3>

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
