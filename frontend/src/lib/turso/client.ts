import { createClient, type Client } from '@libsql/client';
import path from 'path';
import fs from 'fs';
import type { TursoConnectionStatus } from './types';

let cachedClient: Client | null = null;
let cachedStatus: TursoConnectionStatus | null = null;

/**
 * Initialise ou retourne le client Turso / LibSQL singleton.
 * Supporte :
 * 1. Turso Cloud (si TURSO_DATABASE_URL commence par libsql:// ou https://)
 * 2. SQLite / LibSQL local avec WAL (repli de développement et hors-ligne)
 */
export function getTursoClient(): Client {
  if (cachedClient) {
    return cachedClient;
  }

  const databaseUrl = process.env.TURSO_DATABASE_URL?.trim();
  const authToken = process.env.TURSO_AUTH_TOKEN?.trim();

  if (databaseUrl && (databaseUrl.startsWith('libsql://') || databaseUrl.startsWith('https://'))) {
    // Mode Turso Cloud managé
    cachedClient = createClient({
      url: databaseUrl,
      authToken: authToken || undefined,
    });
    cachedStatus = {
      mode: 'turso_cloud',
      url: databaseUrl.replace(/:[^:@]+@/, ':***@'), // Masquer les identifiants
      isConfigured: true,
      connected: true,
    };
    return cachedClient;
  }

  // Repli local SQLite / LibSQL
  const potentialPaths = [
    path.resolve(process.cwd(), '../backend/data/ansd_master.db'),
    path.resolve(process.cwd(), 'backend/data/ansd_master.db'),
    path.resolve(process.cwd(), 'data/ansd_master.db'),
    path.resolve(process.cwd(), 'ansd_master.db'),
  ];

  let localDbPath = potentialPaths.find((p) => fs.existsSync(p));

  if (!localDbPath) {
    // Si aucun fichier n'existe, on cible le répertoire backend par défaut
    localDbPath = potentialPaths[0];
    const parentDir = path.dirname(localDbPath);
    if (!fs.existsSync(parentDir)) {
      fs.mkdirSync(parentDir, { recursive: true });
    }
  }

  const fileUrl = `file:${localDbPath}`;

  cachedClient = createClient({
    url: fileUrl,
  });

  cachedStatus = {
    mode: 'local_libsql',
    url: fileUrl,
    isConfigured: false,
    connected: true,
  };

  return cachedClient;
}

/**
 * Retourne le statut de la connexion Turso
 */
export async function getTursoStatus(): Promise<TursoConnectionStatus> {
  const client = getTursoClient();
  try {
    await client.execute('SELECT 1;');
    return {
      ...(cachedStatus || {
        mode: 'local_libsql',
        url: 'local',
        isConfigured: false,
        connected: true,
      }),
      connected: true,
    };
  } catch (error) {
    console.error('[Turso Connection Check Error]', error);
    return {
      ...(cachedStatus || {
        mode: 'local_libsql',
        url: 'unknown',
        isConfigured: false,
        connected: false,
      }),
      connected: false,
    };
  }
}
