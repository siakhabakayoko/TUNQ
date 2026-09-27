/**
 * Strategic Diagnosis Engine for TUNQ.
 * Generates contextual SWOT, Porter 5 Forces, and PESTEL Senegal
 * tailored to the selected sector and regional ecosystem.
 */

import { ProjectInput, StrategicDiagnosis } from '@/types';
import { getSectorById, getRegionById, calculateDynamicTamSamSom } from './ansd-service';

export function generateStrategicDiagnosis(project: ProjectInput): StrategicDiagnosis {
  const sector = getSectorById(project.sectorId);
  const region = getRegionById(project.regionId);
  const tamSamSom = calculateDynamicTamSamSom(
    project.regionId,
    project.sectorId,
    project.unitPriceFcfa,
    project.isUemoaExportTarget
  );

  // 1. SWOT Dynamic Matrix
  const swot = {
    strengths: [
      `Proposition de valeur ciblée sur le pôle économique de ${region.name} (${region.purchasing_tier}).`,
      `Structure de coût unitaire à ${project.unitCostFcfa.toLocaleString('fr-FR')} FCFA permettant une marge brute calculée.`,
      `Agilité organisationnelle face aux acteurs historiques du secteur ${sector.name}.`
    ],
    weaknesses: [
      `Frais fixes mensuels de ${project.monthlyFixedCostsFcfa.toLocaleString('fr-FR')} FCFA imposant un volume minimum dès le démarrage.`,
      `Forte dépendance au fonds de roulement initial face aux délais d'encaissement locaux.`,
      `Vulnérabilité face au secteur informel très présent (${sector.informal_pct}% du secteur selon le RGE-2).`
    ],
    opportunities: [
      `Dynamique sectorielle favorable : ${sector.growth_trend}.`,
      project.isUemoaExportTarget
        ? `Potentiel d'expansion transfrontalière UEMOA (${sector.uemoa_export_potential}).`
        : `Accroissement rapide de la population urbaine dans la région (${region.urban_rate}% de taux d'urbanisation).`,
      `Adoption massive des canaux de paiement mobile (Wave, Orange Money) réduisant les frictions de paiement.`
    ],
    threats: [
      `Principale cause de faillite sectorielle constatée par l'ANSD : "${sector.top_failure_cause}".`,
      `Pression inflationniste sur les intrants (taux d'inflation national mesuré par l'IHPC).`,
      `Volatilité des chaînes d'approvisionnement régionales en cas de perturbations logistiques.`
    ]
  };

  // 2. Porter 5 Forces (Quantified for Senegal)
  const porter5Forces = {
    threatNewEntrants: {
      score: sector.informal_pct > 80 ? 7.8 : 5.4,
      label: sector.informal_pct > 80 ? 'Élevée' : 'Modérée',
      details: `Facilité d'entrée due au secteur informel (${sector.informal_pct}%), mais barrières techniques plus fortes sur les offres structurées.`
    },
    bargainingPowerBuyers: {
      score: 7.2,
      label: 'Élevé',
      details: `Sensibilité accrue au prix chez les consommateurs sénégalais, arbitrages fréquents en fonction de l'IHPC.`
    },
    bargainingPowerSuppliers: {
      score: 6.5,
      label: 'Moyen-Élevé',
      details: `Dépendance fréquente aux importations ou à un nombre restreint de grossistes locaux à Dakar et Touba.`
    },
    threatSubstitutes: {
      score: 6.0,
      label: 'Modérée',
      details: `Présence d'alternatives informelles et de circuits d'entraide communautaire/familiale.`
    },
    competitiveRivalry: {
      score: sector.units_count > 30000 ? 8.4 : 5.8,
      label: sector.units_count > 30000 ? 'Très Intense' : 'Modérée',
      details: `${sector.units_count.toLocaleString('fr-FR')} unités économiques répertoriées par l'ANSD dans ce secteur.`
    }
  };

  // 3. PESTEL Senegal
  const pestelSenegal = {
    political: `Nouvelle vision stratégique "Sénégal 2050", accent sur la souveraineté économique, la transformation locale et le contenu local.`,
    economic: `Taux directeur BCEAO à 3,50%, inflation contenue via l'IHPC, croissance soutenue par les projets d'infrastructures et d'énergie.`,
    social: `Population très jeune (60,4% de moins de 25 ans selon le RGPH-5), taille moyenne des ménages de 8,7 personnes, solidarité familiale structurante.`,
    technological: `Pénétration mobile money > 85%, adoption généralisée des QR codes de paiement, essor du commerce social (WhatsApp Business, TikTok).`,
    environmental: `Sensibilité au climat (hivernage), initiatives croissantes d'économie circulaire et d'efficacité énergétique solaire.`,
    legal: `Cadre juridique SYSCOHADA révisé, régime fiscal du CGI, facilités du Start-up Act sénégalais et guichet unique APIX.`
  };

  return {
    tamSamSom,
    swot,
    porter5Forces,
    pestelSenegal
  };
}
