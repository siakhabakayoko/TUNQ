import { NextRequest, NextResponse } from 'next/server';
import { suggestPricingWithAnsd } from '@/lib/ansd-pricing';
import { SectorId, RegionId, CountryCode } from '@/types';

/**
 * POST /api/ansd/pricing-suggest
 * Propose une tarification et des volumes calibrés sur les données officielles
 * de l'ANSD (RGE-2, RGPH-5, IHPC) et enrichis par l'IA Gemini 2.5 Flash.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, description, sectorId, regionId, isUemoaExportTarget, uemoaTargetCountry } = body;

    if (!title || !title.trim()) {
      return NextResponse.json(
        { error: 'Le titre du projet est requis pour estimer la tarification' },
        { status: 400 }
      );
    }

    const suggestion = await suggestPricingWithAnsd({
      title: title.trim(),
      description: description?.trim() || '',
      sectorId: (sectorId as SectorId) || 'TECH_DIGITAL',
      regionId: (regionId as RegionId) || 'DK',
      isUemoaExportTarget: Boolean(isUemoaExportTarget),
      uemoaTargetCountry: uemoaTargetCountry as CountryCode,
    });

    return NextResponse.json({
      success: true,
      suggestion,
    });
  } catch (error) {
    console.error('[API /api/ansd/pricing-suggest Error]', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Erreur lors de la suggestion tarifaire ANSD',
      },
      { status: 500 }
    );
  }
}
