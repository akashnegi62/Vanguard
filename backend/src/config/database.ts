import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
});

let isPostgresReady = false;

export async function initDatabaseConnection(): Promise<boolean> {
  try {
    // Attempt connection with 3-second timeout
    await Promise.race([
      prisma.$connect(),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('PostgreSQL connection timeout (3s)')), 3000)
      ),
    ]);
    isPostgresReady = true;
    console.log('✅ Connected to PostgreSQL database successfully.');
    return true;
  } catch (error: any) {
    isPostgresReady = false;
    console.warn(
      '⚠️ PostgreSQL connection not available (' +
        (error?.message || 'Offline') +
        '). Using in-memory resilient mock database mode for local development.'
    );
    return false;
  }
}

export function isDatabaseConnected(): boolean {
  return isPostgresReady;
}
