/**
 * ANSD & UEMOA Data Service for TUNQ.
 * Reads and serves official statistics from ANSD Senegal (IHPC, RGPH-5, RGE-2, ENES)
 * and regional UEMOA/BCEAO benchmarks.
 */

import ihpcRaw from '@/data/ansd/ihpc_senegal.json';
import rgph5Raw from '@/data/ansd/rgph5_demographie.json';
import rgeRaw from '@/data/ansd/rge_entreprises.json';
import enesRaw from '@/data/ansd/enes_salaires.json';
import uemoaRaw from '@/data/ansd/uemoa_regional.json';
import catalogRaw from '@/data/ansd/catalog_metadata.json';
import { SectorId, RegionId, CountryCode } from '@/types';

export function getAllSectors() {
  return rgeRaw.sectors;
}

export function getSectorById(sectorId: SectorId) {
  const found = rgeRaw.sectors.find((s) => s.sector_id === sectorId);
  return found || rgeRaw.sectors[0];
}

export function getAllRegions() {
  return rgph5Raw.regions;
}

export function getRegionById(regionId: RegionId) {
  const found = rgph5Raw.regions.find((r) => r.region_id === regionId);
  return found || rgph5Raw.regions[0];
}

export function getIhpcData() {
  return ihpcRaw;
}

export function getSalaryProfiles() {
  return enesRaw.profiles;
}

export function getUemoaCountries() {
  return uemoaRaw.countries;
}

export function getUemoaCountryByCode(code: CountryCode) {
  const found = uemoaRaw.countries.find((c) => c.country_code === code);
  return found || uemoaRaw.countries[0];
}

export function getCatalogMetadata() {
  return catalogRaw;
}

/**
 * Calculates realistic TAM / SAM / SOM metrics based on RGPH-5 population
 * and household purchasing power.
 */
export function calculateDynamicTamSamSom(
  regionId: RegionId,
  sectorId: SectorId,
  unitPriceFcfa: number,
  isUemoaExport: boolean
) {
  const region = getRegionById(regionId);
  const nationalPopulation = rgph5Raw.metadata.total_population;
  const regionPopulation = region.population;

  // Average household size in Senegal is 8.7 (RGPH-5)
  const estimatedHouseholds = Math.round(regionPopulation / 8.7);

  // Sector penetration rate assumption for addressable market
  let sectorPenetrationPct = 0.25;
  if (sectorId === 'TECH_DIGITAL') sectorPenetrationPct = 0.35;
  if (sectorId === 'AGRO_INDUSTRY' || sectorId === 'COMMERCE_RETAIL') sectorPenetrationPct = 0.65;
  if (sectorId === 'HEALTH_PHARMA') sectorPenetrationPct = 0.40;
  if (sectorId === 'BTP_REALESTATE') sectorPenetrationPct = 0.15;

  // TAM (Total Addressable Market in FCFA per year)
  // If UEMOA export is targeted, expand to the 142M population of UEMOA
  const addressablePop = isUemoaExport ? uemoaRaw.metadata.total_uemoa_population : nationalPopulation;
  const annualConsumptionFrequency = 12; // units or transactions per year per addressable unit
  const tamFcfa = Math.round(addressablePop * sectorPenetrationPct * unitPriceFcfa * 2);

  // SAM (Serviceable Available Market in target region)
  const samPopulation = Math.round(regionPopulation * sectorPenetrationPct);
  const samFcfa = Math.round(samPopulation * unitPriceFcfa * 3);

  // SOM (Serviceable Obtainable Market - realistic market share of 1.5% to 4% at launch)
  const realisticMarketShare = 0.025;
  const somFcfa = Math.round(samFcfa * realisticMarketShare);

  return {
    targetPopulation: regionPopulation,
    tamFcfa,
    samFcfa,
    somFcfa,
    explanation: `Calculé d'après le recensement RGPH-5 (${region.name} : ${regionPopulation.toLocaleString('fr-FR')} habitants, ${estimatedHouseholds.toLocaleString('fr-FR')} ménages). ${
      isUemoaExport ? 'Inclut l’expansion UEMOA (142,5 millions d’habitants).' : 'Base marché national Sénégal.'
    }`
  };
}
