import { NextResponse } from 'next/server';
import { getDocuments, addDocument } from '@/lib/turso/repository';

/**
 * GET /api/documents
 * Récupère les documents enregistrés dans la Data Room Turso.
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const orgId = searchParams.get('orgId') || 'ORG_SN_88204';
    const documents = await getDocuments(orgId);

    return NextResponse.json({
      success: true,
      count: documents.length,
      data: documents,
    });
  } catch (error) {
    console.error('[API GET /api/documents Error]', error);
    return NextResponse.json(
      { success: false, error: 'Impossible de charger les documents' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/documents
 * Ajoute un nouveau document dans la Data Room Turso.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.title || !body.category) {
      return NextResponse.json(
        { success: false, error: 'Champs obligatoires manquants (title, category)' },
        { status: 400 }
      );
    }

    const newDoc = await addDocument({
      organization_id: body.organization_id || 'ORG_SN_88204',
      title: body.title,
      category: body.category,
      file_size_mb: body.file_size_mb || 1.0,
      source: body.source || 'upload',
      status: body.status || 'Indexé',
    });

    return NextResponse.json({
      success: true,
      document: newDoc,
    });
  } catch (error) {
    console.error('[API POST /api/documents Error]', error);
    return NextResponse.json(
      { success: false, error: 'Erreur lors de l\'enregistrement du document' },
      { status: 500 }
    );
  }
}
