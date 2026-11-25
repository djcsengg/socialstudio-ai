const fs = require('fs');
const path = require('path');

const schemaPath = path.join(__dirname, '..', 'prisma', 'schema.prisma');
if (!fs.existsSync(schemaPath)) {
  console.error('[Prisma Config] schema.prisma not found at:', schemaPath);
  process.exit(0);
}

let content = fs.readFileSync(schemaPath, 'utf8');

const isPostgres = Boolean(
  process.env.VERCEL ||
  process.env.POSTGRES_PRISMA_URL ||
  process.env.POSTGRES_URL ||
  (process.env.DATABASE_URL && (process.env.DATABASE_URL.startsWith('postgres://') || process.env.DATABASE_URL.startsWith('postgresql://')))
);

if (isPostgres) {
  content = content.replace(/provider\s*=\s*"sqlite"/g, 'provider = "postgresql"');
  console.log('[Prisma Config] Configured datasource provider for PostgreSQL (Production / Vercel).');
} else {
  content = content.replace(/provider\s*=\s*"postgresql"/g, 'provider = "sqlite"');
  console.log('[Prisma Config] Configured datasource provider for SQLite (Local / Development).');
}

fs.writeFileSync(schemaPath, content);
