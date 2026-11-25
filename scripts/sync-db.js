const { execSync } = require('child_process');

const dbUrl = process.env.POSTGRES_PRISMA_URL || process.env.DATABASE_URL;
const isPostgres = Boolean(
  process.env.POSTGRES_PRISMA_URL ||
  process.env.POSTGRES_URL ||
  (dbUrl && (dbUrl.startsWith('postgres://') || dbUrl.startsWith('postgresql://')))
);

if (isPostgres && dbUrl) {
  console.log('[DB Sync] PostgreSQL environment detected on Vercel. Syncing schema to database...');
  try {
    execSync('npx prisma db push --accept-data-loss', {
      stdio: 'inherit',
      env: { ...process.env, DATABASE_URL: dbUrl }
    });
    console.log('[DB Sync] PostgreSQL schema synchronized successfully.');
  } catch (err) {
    console.warn('[DB Sync] Warning during db push:', err.message);
  }
} else {
  console.log('[DB Sync] Local or mock environment detected. Skipping remote db push.');
}
