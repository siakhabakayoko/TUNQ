import { NextResponse } from 'next/server';
import ihpcData from '@/data/ansd/ihpc_senegal.json';
import rgph5Data from '@/data/ansd/rgph5_demographie.json';
import rgeData from '@/data/ansd/rge_entreprises.json';
import enesData from '@/data/ansd/enes_salaires.json';
import uemoaData from '@/data/ansd/uemoa_regional.json';
import catalogData from '@/data/ansd/catalog_metadata.json';

const DATASETS: Record<string, unknown> = {
  ihpc: ihpcData,
  rgph5: rgph5Data,
  rge: rgeData,
  enes: enesData,
  uemoa: uemoaData,
  catalog: catalogData,
};

export async function GET(
  request: Request,
  { params }: { params: Promise<{ dataset: string }> }
) {
  const { dataset } = await params;
  const key = dataset.toLowerCase();

  if (DATASETS[key]) {
    return NextResponse.json({
      success: true,
      dataset: key,
      data: DATASETS[key],
    });
  }

  return NextResponse.json(
    {
      success: false,
      error: `Jeu de données '${dataset}' non reconnu. Valeurs acceptées: ${Object.keys(DATASETS).join(', ')}`,
    },
    { status: 404 }
  );
}
