import { getNotifications } from '../../lib/api';
import { SearchClient } from './SearchClient';

interface Props {
  searchParams: Promise<{ q?: string }>;
}

export default async function SearchPage({ searchParams }: Props) {
  const { q } = await searchParams;
  const initialData = await getNotifications('all', 1, 100);
  const notifications = initialData.items ?? initialData;

  return <SearchClient initialNotifications={notifications} initialQuery={q || ''} />;
}
