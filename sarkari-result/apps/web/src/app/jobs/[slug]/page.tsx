import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getNotificationBySlug } from '../../../lib/api';
import { DetailViewClient } from '../../../components/DetailViewClient';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const notification = await getNotificationBySlug(slug);
    return {
      title: notification.title,
      description: notification.shortDescription,
      openGraph: {
        title: notification.title,
        description: notification.shortDescription,
        type: 'article',
      },
    };
  } catch {
    return { title: 'Notification Not Found' };
  }
}

export const revalidate = 60;

export default async function NotificationDetailPage({ params }: Props) {
  const { slug } = await params;

  let notification;
  try {
    notification = await getNotificationBySlug(slug);
  } catch {
    notFound();
  }

  return <DetailViewClient notification={notification} />;
}
