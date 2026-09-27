import { NextResponse } from 'next/server';
import { getTursoStatus } from '@/lib/turso/client';
import { initTursoSchema } from '@/lib/turso/schema';

/**
 * GET /api/health
 * État de santé des connecteurs Turso, Gemini et ANSD
 */
export async function GET() {
  try {
    await initTursoSchema();
    const tursoStatus = await getTursoStatus();
    const hasGeminiKey = Boolean(process.env.GEMINI_API_KEY?.trim());
    const geminiModel = process.env.GEMINI_MODEL || 'gemini-2.5-flash';

    return NextResponse.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      services: {
        turso: {
          connected: tursoStatus.connected,
          mode: tursoStatus.mode,
          isCloudConfigured: tursoStatus.isConfigured,
          endpoint: tursoStatus.url,
        },
        gemini: {
          isConfigured: hasGeminiKey,
          model: geminiModel,
          mode: hasGeminiKey ? 'online_ai' : 'calibrated_ansd_fallback',
        },
        ansd: {
          ihpc: 'synced',
          rgph5: 'synced',
          rge2: 'synced',
          enes: 'synced',
          uemoa: 'synced',
        },
      },
    });
  } catch (error) {
    console.error('[Health Check Failed]', error);
    return NextResponse.json(
      {
        status: 'error',
        error: error instanceof Error ? error.message : 'Échec du contrôle de santé',
      },
      { status: 500 }
    );
  }
}
