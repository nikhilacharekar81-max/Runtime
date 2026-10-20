import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pkg from 'pg';
import { postgresStore, getPool } from './postgresStore.js';
import { DEFAULT_SITE_SETTINGS } from '../../src/server/siteSettings.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '../..');
const DATA_DIR = path.join(ROOT_DIR, 'data');

export async function importDataToPostgres(targetDatabase?: string) {
  await postgresStore.runMigrations();
  const pool = getPool();
  console.log(`[Import] Running initial data migration into PostgreSQL database: ${pool.options.database}`);

  // 1. Users
  const usersFile = path.join(DATA_DIR, 'users.json');
  let users: any[] = [];
  if (fs.existsSync(usersFile)) {
    try {
      const u = JSON.parse(fs.readFileSync(usersFile, 'utf-8'));
      if (Array.isArray(u)) users = u;
    } catch {}
  }
  if (users.length > 0) {
    console.log(`[Import] Importing ${users.length} users...`);
    await postgresStore.saveUsers(users as any);
  }

  // 2. Gigs
  const gigsFile = path.join(DATA_DIR, 'gigs.json');
  let gigs: any[] = [];
  if (fs.existsSync(gigsFile)) {
    try {
      const g = JSON.parse(fs.readFileSync(gigsFile, 'utf-8'));
      if (Array.isArray(g)) gigs = g;
    } catch {}
  }
  if (gigs.length > 0) {
    console.log(`[Import] Importing ${gigs.length} gigs...`);
    await postgresStore.saveGigs(gigs as any);
  }

  // 3. Projects
  const projectsFile = path.join(DATA_DIR, 'workstream_projects.json');
  let projects: any[] = [];
  if (fs.existsSync(projectsFile)) {
    try {
      const p = JSON.parse(fs.readFileSync(projectsFile, 'utf-8'));
      if (Array.isArray(p)) projects = p;
    } catch {}
  }
  if (projects.length > 0) {
    console.log(`[Import] Importing ${projects.length} projects...`);
    await postgresStore.saveProjects(projects as any);
  }

  // 4. Proposals
  const proposalsFile = path.join(DATA_DIR, 'workstream_proposals.json');
  let proposals: any[] = [];
  if (fs.existsSync(proposalsFile)) {
    try {
      const pr = JSON.parse(fs.readFileSync(proposalsFile, 'utf-8'));
      if (Array.isArray(pr)) proposals = pr;
    } catch {}
  }
  if (proposals.length > 0) {
    console.log(`[Import] Importing ${proposals.length} proposals...`);
    await postgresStore.saveProposals(proposals as any);
  }

  // 5. Orders
  const ordersFile = path.join(DATA_DIR, 'workstream_orders.json');
  let orders: any[] = [];
  if (fs.existsSync(ordersFile)) {
    try {
      const o = JSON.parse(fs.readFileSync(ordersFile, 'utf-8'));
      if (Array.isArray(o)) orders = o;
    } catch {}
  }
  if (orders.length > 0) {
    console.log(`[Import] Importing ${orders.length} orders...`);
    await postgresStore.saveOrders(orders as any);
  }

  // 6. Messages
  const messagesFile = path.join(DATA_DIR, 'workstream_messages.json');
  let messages: any[] = [];
  if (fs.existsSync(messagesFile)) {
    try {
      const m = JSON.parse(fs.readFileSync(messagesFile, 'utf-8'));
      if (Array.isArray(m)) messages = m;
    } catch {}
  }
  if (messages.length > 0) {
    console.log(`[Import] Importing ${messages.length} messages...`);
    await postgresStore.saveMessages(messages as any);
  }

  // 7. Reviews
  const reviewsFile = path.join(DATA_DIR, 'workstream_reviews.json');
  let reviews: any[] = [];
  if (fs.existsSync(reviewsFile)) {
    try {
      const r = JSON.parse(fs.readFileSync(reviewsFile, 'utf-8'));
      if (Array.isArray(r)) reviews = r;
    } catch {}
  }
  if (reviews.length > 0) {
    console.log(`[Import] Importing ${reviews.length} reviews...`);
    await postgresStore.saveReviews(reviews as any);
  }

  // 8. Workspaces
  const workspacesFile = path.join(DATA_DIR, 'workspaces.json');
  if (fs.existsSync(workspacesFile)) {
    try {
      const ws = JSON.parse(fs.readFileSync(workspacesFile, 'utf-8'));
      if (Array.isArray(ws)) {
        console.log(`[Import] Importing ${ws.length} workspaces...`);
        await postgresStore.saveWorkspaces(ws);
      }
    } catch {}
  }

  // 9. Workstream Offers
  const offersFile = path.join(DATA_DIR, 'workstream_offers.json');
  if (fs.existsSync(offersFile)) {
    try {
      const off = JSON.parse(fs.readFileSync(offersFile, 'utf-8'));
      if (Array.isArray(off)) {
        console.log(`[Import] Importing ${off.length} offers...`);
        await postgresStore.saveOffers(off);
      }
    } catch {}
  }

  // 10. Custom Invoices
  const invoicesFile = path.join(DATA_DIR, 'custom_invoices.json');
  if (fs.existsSync(invoicesFile)) {
    try {
      const inv = JSON.parse(fs.readFileSync(invoicesFile, 'utf-8'));
      if (Array.isArray(inv)) {
        console.log(`[Import] Importing ${inv.length} custom invoices...`);
        await postgresStore.saveCustomInvoices(inv);
      }
    } catch {}
  }

  // 11. Site Settings
  const siteSettingsFile = path.join(DATA_DIR, 'site_settings.json');
  let settings = DEFAULT_SITE_SETTINGS;
  if (fs.existsSync(siteSettingsFile)) {
    try {
      settings = JSON.parse(fs.readFileSync(siteSettingsFile, 'utf-8'));
    } catch {}
  }
  await postgresStore.saveSiteSettings(settings);

  // 12. Payment Gateways
  const gatewaysFile = path.join(DATA_DIR, 'payment_gateways.json');
  if (fs.existsSync(gatewaysFile)) {
    try {
      const gw = JSON.parse(fs.readFileSync(gatewaysFile, 'utf-8'));
      await postgresStore.savePaymentGateways(gw);
    } catch {}
  }

  // 13. Financial Ledger State
  const ledgerFile = path.join(DATA_DIR, 'financial_ledger.json');
  if (fs.existsSync(ledgerFile)) {
    try {
      const ledger = JSON.parse(fs.readFileSync(ledgerFile, 'utf-8'));
      await postgresStore.saveLedgerState(ledger);
      console.log('[Import] Financial ledger state imported successfully.');
    } catch {}
  }

  // 14. Upload Records
  const uploadsFile = path.join(DATA_DIR, 'workstream_uploads.json');
  if (fs.existsSync(uploadsFile)) {
    try {
      const uploads = JSON.parse(fs.readFileSync(uploadsFile, 'utf-8'));
      if (uploads && typeof uploads === 'object') {
        for (const [filename, rec] of Object.entries<any>(uploads)) {
          await postgresStore.saveUploadRecord(filename, rec);
        }
      }
    } catch {}
  }

  await postgresStore.markInitialized();
  console.log('[Import] PostgreSQL migration and seeding completed successfully!');
}

// Auto-run if executed directly via CLI
if (process.argv[1] && process.argv[1].endsWith('importJson.ts')) {
  importDataToPostgres()
    .then(() => process.exit(0))
    .catch(err => {
      console.error('[Import] Failed:', err);
      process.exit(1);
    });
}
