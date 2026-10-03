/**
 * Seed migration script.
 * Reads from the original seedData.ts and inserts into Supabase PostgreSQL.
 *
 * Usage:
 *   cd services/api
 *   pnpm db:seed
 *
 * This is a ONE-TIME migration. After seeding, the app reads from Supabase.
 * Do NOT delete seedData.ts until you have verified the seed completed correctly.
 */
import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
import {
  INITIAL_NOTIFICATIONS,
  INITIAL_TICKER_ITEMS,
  INITIAL_FEATURED_TILES,
} from './seedData';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SECRET_KEY!
);

async function seed() {
  console.log('🌱 Starting seed migration from seedData.ts → Supabase...\n');

  // ── Notifications ──────────────────────────────────────────────────────────
  console.log(`📄 Migrating ${INITIAL_NOTIFICATIONS.length} notifications...`);
  let notifSuccess = 0;
  let notifFailed = 0;

  for (const notif of INITIAL_NOTIFICATIONS) {
    const { error } = await supabase.from('notifications').upsert(
      {
        // Map camelCase → snake_case
        id: notif.id,
        slug: notif.slug,
        title: notif.title,
        category: notif.category,
        organization: notif.organization,
        department: notif.department,
        state: notif.state,
        qualification: notif.qualification,
        total_vacancies: notif.totalVacancies,
        post_date: notif.postDate,
        last_date: notif.lastDate,
        exam_date: notif.examDate,
        admit_card_date: notif.admitCardDate,
        result_date: notif.resultDate,
        answer_key_date: notif.answerKeyDate,
        answer_key_close_date: notif.answerKeyCloseDate,
        answer_key_url: notif.answerKeyUrl,
        objection_url: notif.objectionUrl,
        teaching_level: notif.teachingLevel,
        teaching_subject: notif.teachingSubject,
        tet_requirement: notif.tetRequirement,
        fee_general: notif.feeGeneral,
        fee_reserved: notif.feeReserved,
        age_min: notif.ageMin,
        age_max: notif.ageMax,
        age_as_on_date: notif.ageAsOnDate,
        age_relaxation_notes: notif.ageRelaxationNotes,
        post_wise_age_limits: notif.postWiseAgeLimits,
        eligibility: notif.eligibility,
        short_description: notif.shortDescription,
        apply_url: notif.applyUrl,
        apply_url_server2: notif.applyUrlServer2,
        notification_url: notif.notificationUrl,
        official_url: notif.officialUrl,
        telegram_url: notif.telegramUrl,
        whatsapp_url: notif.whatsappUrl,
        custom_links: notif.customLinks ?? [],
        article_content: notif.articleContent,
        how_to_apply: notif.howToApply,
        selection_process: notif.selectionProcess,
        status_badge: notif.statusBadge,
        featured: notif.featured ?? false,
        published: notif.published,
        in_trash: notif.inTrash ?? false,
        views: notif.views ?? 0,
      },
      { onConflict: 'slug' }
    );

    if (error) {
      console.error(`  ❌ Failed: ${notif.slug} — ${error.message}`);
      notifFailed++;
    } else {
      notifSuccess++;
    }
  }
  console.log(`  ✅ Notifications: ${notifSuccess} seeded, ${notifFailed} failed\n`);

  // ── Ticker items ────────────────────────────────────────────────────────────
  console.log(`📢 Migrating ${INITIAL_NOTIFICATIONS.length} ticker items...`);
  const { error: tickerError } = await supabase.from('ticker_items').upsert(
    INITIAL_TICKER_ITEMS.map((t: any, i: number) => ({
      id: t.id,
      title: t.title,
      url: t.url,
      active: t.active,
      category: t.category,
      badge: t.badge,
      target_slug: t.targetSlug,
      sort_order: i,
    })),
    { onConflict: 'id' }
  );
  if (tickerError) {
    console.error(`  ❌ Ticker seed failed: ${tickerError.message}`);
  } else {
    console.log(`  ✅ ${INITIAL_TICKER_ITEMS.length} ticker items seeded\n`);
  }

  // ── Featured tiles ──────────────────────────────────────────────────────────
  console.log(`🎨 Migrating ${INITIAL_FEATURED_TILES.length} featured tiles...`);
  const { error: featuredError } = await supabase.from('featured_tiles').upsert(
    INITIAL_FEATURED_TILES.map((tile: any, i: number) => ({
      id: tile.id,
      title: tile.title,
      action_text: tile.actionText,
      bg_color: tile.bgColor,
      action_color: tile.actionColor,
      slug: tile.slug,
      active: tile.active,
      sort_order: i,
    })),
    { onConflict: 'id' }
  );
  if (featuredError) {
    console.error(`  ❌ Featured tiles seed failed: ${featuredError.message}`);
  } else {
    console.log(`  ✅ ${INITIAL_FEATURED_TILES.length} featured tiles seeded\n`);
  }

  // ── Verify counts ───────────────────────────────────────────────────────────
  console.log('🔍 Verifying seeded counts...');
  const { count: notifCount } = await supabase.from('notifications').select('*', { count: 'exact', head: true });
  const { count: tickerCount } = await supabase.from('ticker_items').select('*', { count: 'exact', head: true });
  const { count: featuredCount } = await supabase.from('featured_tiles').select('*', { count: 'exact', head: true });

  console.log(`  📊 notifications: ${notifCount}`);
  console.log(`  📊 ticker_items: ${tickerCount}`);
  console.log(`  📊 featured_tiles: ${featuredCount}`);
  console.log('\n✅ Seed migration complete!');
  console.log('📌 Next steps:');
  console.log('   1. Verify the counts above match your seedData.ts');
  console.log('   2. Switch the apps to use the API instead of seedData.ts');
  console.log('   3. Only then remove the seedData.ts import in the old app');
}

seed().catch((err) => {
  console.error('❌ Seed migration failed:', err);
  process.exit(1);
});
