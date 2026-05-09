export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    // Importing lib/db triggers the top-level await initDb() which syncs all tables.
    await import('./lib/db/index.js')
  }
}
