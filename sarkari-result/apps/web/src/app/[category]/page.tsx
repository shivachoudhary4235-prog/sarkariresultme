import { getNotifications } from '../../lib/api';
import { DirectoryViewClient } from '../../components/DirectoryViewClient';
import type { NotificationCategory } from '@sarkari/shared-types';

export const revalidate = 60;

const VALID_CATEGORIES: NotificationCategory[] = [
  'latest-job', 'result', 'admit-card', 'answer-key', 'syllabus', 'teaching', 'outsourcing', 'important'
];

interface Props {
  params: Promise<{ category: string }>;
}

export default async function CategoryPage({ params }: Props) {
  const { category } = await params;

  if (!VALID_CATEGORIES.includes(category as NotificationCategory)) {
    return <div className="p-8 text-center text-gray-600">Category not found.</div>;
  }

  const result = await getNotifications(category, 1, 50);

  return (
    <DirectoryViewClient
      category={category as NotificationCategory}
      notifications={result.items ?? result}
    />
  );
}
