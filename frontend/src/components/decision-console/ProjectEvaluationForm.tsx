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
    title: PRESETS[0].title,
    tagline: PRESETS[0].tagline,
    sectorId: PRESETS[0].sectorId,
    regionId: PRESETS[0].regionId,
    description: PRESETS[0].description,
    unitPriceFcfa: PRESETS[0].unitPriceFcfa,
    unitCostFcfa: PRESETS[0].unitCostFcfa,
    monthlyFixedCostsFcfa: PRESETS[0].monthlyFixedCostsFcfa,
    targetMonthlySalesVolume: PRESETS[0].targetMonthlySalesVolume,
    isUemoaExportTarget: PRESETS[0].isUemoaExportTarget,
    uemoaTargetCountry: PRESETS[0].uemoaTargetCountry
  });

  const applyPreset = (idx: number) => {
    setForm({ ...PRESETS[idx] });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Quick-Load Presets Bar */}
      <div className="bg-secondary/40 border border-border p-3 font-mono text-xs">
        <div className="flex items-center justify-between mb-2 text-muted-foreground">
          <span className="flex items-center gap-1.5 font-semibold text-foreground">
            <Sparkles className="h-3.5 w-3.5 text-primary" /> MODÈLES ÉCONOMIQUES ÉTALONS (PRESETS)
          </span>
          <span className="text-[10px] text-muted-foreground uppercase">PARAMÈTRES ANSD PRÉ-CHARGÉS</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {PRESETS.map((p, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => applyPreset(idx)}
              className="text-left p-2.5 border border-border hover:border-primary hover:bg-secondary transition-all group bg-card"
            >
              <div className="text-[11px] font-semibold text-foreground group-hover:text-primary truncate">
                {p.title}
              </div>
              <div className="text-[9px] text-muted-foreground uppercase mt-0.5">
                {p.sectorId.replace('_', ' ')} // {p.regionId}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Grid: 2 Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column: Scope & Geography */}
        <div className="space-y-4">
          <div>
            <label className="block font-mono text-xs text-foreground/80 font-medium mb-1">
              [INTITULÉ DU PROJET D’ENTREPRISE] *
            </label>
            <input
              type="text"
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full bg-background border border-input px-3 py-2 text-xs text-foreground font-mono focus:border-primary focus:outline-hidden"
              placeholder="Ex: Plateforme de livraison éco-responsable"
            />
          </div>

          <div>
            <label className="block font-mono text-xs text-foreground/80 font-medium mb-1">
              [SECTEUR D’ACTIVITÉ (ANSD RGE-2)] *
            </label>
            <select
              value={form.sectorId}
              onChange={(e) => setForm({ ...form, sectorId: e.target.value as SectorId })}
              className="w-full bg-background border border-input px-3 py-2 text-xs text-foreground font-mono focus:border-primary focus:outline-hidden"
            >
              {sectors.map((s) => (
                <option key={s.sector_id} value={s.sector_id}>
                  {s.name} (Survie 3 ans: {s.survival_rate_3yr}%)
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-mono text-xs text-foreground/80 font-medium mb-1">
              [RÉGION D’IMPLANTATION PRINCIPALE (RGPH-5)] *
            </label>
            <select
              value={form.regionId}
              onChange={(e) => setForm({ ...form, regionId: e.target.value as RegionId })}
              className="w-full bg-background border border-input px-3 py-2 text-xs text-foreground font-mono focus:border-primary focus:outline-hidden"
            >
              {regions.map((r) => (
                <option key={r.region_id} value={r.region_id}>
                  {r.name} ({r.population.toLocaleString('fr-FR')} hab. - Revenu: {r.purchasing_tier})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-mono text-xs text-foreground/80 font-medium mb-1">
              [DESCRIPTION STRATÉGIQUE & PROPOSITION DE VALEUR]
            </label>
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full bg-background border border-input px-3 py-2 text-xs text-foreground font-sans focus:border-primary focus:outline-hidden leading-relaxed"
              placeholder="Expliquez la proposition de valeur, les clients cibles et les canaux de distribution..."
            />
          </div>

          {/* UEMOA Export Target Toggle */}
          <div className="border border-border p-3 bg-secondary/30 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-primary" />
              <div>
                <div className="font-mono text-xs text-foreground font-semibold">
                  EXTENSION TRANSFRONTALIÈRE UEMOA
                </div>
                <div className="text-[10px] text-muted-foreground">
                  Calcul du TAM élargi (142M hab.) & corridors de fret
                </div>
              </div>
            </div>
            <input
              type="checkbox"
              checked={form.isUemoaExportTarget}
              onChange={(e) => setForm({ ...form, isUemoaExportTarget: e.target.checked })}
              className="h-4 w-4 accent-primary rounded-none"
            />
          </div>

          {form.isUemoaExportTarget && (
            <div>
              <label className="block font-mono text-xs text-foreground/80 font-medium mb-1">
                [PAYS CIBLE PRIORITAIRE EN SOUS-RÉGION]
              </label>
              <select
                value={form.uemoaTargetCountry || 'CI'}
                onChange={(e) => setForm({ ...form, uemoaTargetCountry: e.target.value as CountryCode })}
                className="w-full bg-background border border-input px-3 py-2 text-xs text-foreground font-mono focus:border-primary focus:outline-hidden"
              >
                {uemoaCountries.filter(c => c.country_code !== 'SN').map((c) => (
                  <option key={c.country_code} value={c.country_code}>
                    {c.name} ({c.population.toLocaleString('fr-FR')} hab. - {c.ease_of_business_rank})
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Right Column: Financial Model Inputs */}
        <div className="space-y-4">
          <div className="border border-border bg-secondary/20 p-4">
            <div className="font-mono text-xs text-foreground font-bold mb-3 flex items-center gap-1.5 pb-2 border-b border-border">
              <Sliders className="h-3.5 w-3.5 text-primary" /> PARAMÈTRES FINANCIERS DE RENTABILITÉ (FCFA)
            </div>

            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <label className="block font-mono text-[11px] text-muted-foreground mb-1">
                  PRIX DE VENTE UNITAIRE *
                </label>
                <div className="relative">
                  <input
                    type="number"
                    required
                    min={1}
                    value={form.unitPriceFcfa}
                    onChange={(e) => setForm({ ...form, unitPriceFcfa: Number(e.target.value) })}
                    className="w-full bg-background border border-input px-2.5 py-1.5 text-xs text-foreground font-mono focus:border-primary focus:outline-hidden"
                  />
                  <span className="absolute right-2 top-2 text-[10px] text-muted-foreground font-mono">FCFA</span>
                </div>
              </div>

              <div>
                <label className="block font-mono text-[11px] text-muted-foreground mb-1">
                  COÛT DE REVIENT UNITAIRE *
                </label>
                <div className="relative">
                  <input
                    type="number"
                    required
                    min={0}
                    value={form.unitCostFcfa}
                    onChange={(e) => setForm({ ...form, unitCostFcfa: Number(e.target.value) })}
                    className="w-full bg-background border border-input px-2.5 py-1.5 text-xs text-foreground font-mono focus:border-primary focus:outline-hidden"
                  />
                  <span className="absolute right-2 top-2 text-[10px] text-muted-foreground font-mono">FCFA</span>
                </div>
              </div>
            </div>

            <div className="mb-3">
              <label className="block font-mono text-[11px] text-muted-foreground mb-1">
                CHARGES FIXES MENSUELLES (LOYER, SALAIRES, ÉNERGIE, SAAS) *
              </label>
              <div className="relative">
                <input
                  type="number"
                  required
                  min={1}
                  value={form.monthlyFixedCostsFcfa}
                  onChange={(e) => setForm({ ...form, monthlyFixedCostsFcfa: Number(e.target.value) })}
                  className="w-full bg-background border border-input px-2.5 py-1.5 text-xs text-foreground font-mono focus:border-primary focus:outline-hidden"
                />
                <span className="absolute right-2 top-2 text-[10px] text-muted-foreground font-mono">FCFA / MOIS</span>
              </div>
            </div>

            <div>
              <label className="block font-mono text-[11px] text-muted-foreground mb-1">
                OBJECTIF VOLUME MENSUEL DES VENTES (UNITÉS / CLIENTS) *
              </label>
              <input
                type="number"
                required
                min={1}
                value={form.targetMonthlySalesVolume}
                onChange={(e) => setForm({ ...form, targetMonthlySalesVolume: Number(e.target.value) })}
                className="w-full bg-background border border-input px-2.5 py-1.5 text-xs text-foreground font-mono focus:border-primary focus:outline-hidden"
              />
            </div>

            {/* Quick Live Preview of Margin */}
            <div className="mt-4 pt-3 border-t border-border flex justify-between items-center font-mono text-[11px]">
              <span className="text-muted-foreground">Marge brute unitaire estimée :</span>
              <span className={`font-bold ${form.unitPriceFcfa > form.unitCostFcfa ? 'text-emerald-700' : 'text-destructive'}`}>
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
            className="w-full py-3.5 bg-primary hover:opacity-90 text-primary-foreground font-mono font-bold text-sm tracking-wider uppercase transition-all shadow-xs flex items-center justify-center gap-2 border border-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <div className="h-4 w-4 border-2 border-primary-foreground border-t-transparent animate-spin" />
                ARBITRAGE JEV & SYNTHÈSE GEMINI EN COURS...
              </>
            ) : (
              <>
                <Play className="h-4 w-4 fill-current" />
                LANCER L’ÉVALUATION STRATÉGIQUE COMPLÈTE
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
};
