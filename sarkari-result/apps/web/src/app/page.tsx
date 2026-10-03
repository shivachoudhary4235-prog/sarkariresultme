/**
 * Home page — Server Component.
 * Fetches data server-side (ISR, revalidates every 60s).
 * Passes data to client components which preserve the existing UI.
 */
import { getNotifications, getTickerItems, getFeaturedTiles, getCategoryStats } from '../lib/api';
import { HomeClient } from '../components/HomeClient';

export const revalidate = 60; // ISR: revalidate every 60 seconds

export default async function HomePage() {
  const [notifications, tickerItems, featuredTiles, categoryStats] = await Promise.all([
    getNotifications('all', 1, 100),
    getTickerItems(),
    getFeaturedTiles(),
    getCategoryStats(),
  ]);

  return (
    <HomeClient
      initialNotifications={notifications}
      tickerItems={tickerItems}
      featuredTiles={featuredTiles}
      categoryStats={categoryStats}
    />
  );
}
