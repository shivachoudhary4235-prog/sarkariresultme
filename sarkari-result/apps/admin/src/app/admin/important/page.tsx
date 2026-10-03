import { CategoryManager } from '../../../components/CategoryManager';

export const metadata = {
  title: 'Manage Important Links | Sarkari Result Admin',
};

export default function ImportantAdminPage() {
  return (
    <CategoryManager
      category="important"
      categoryTitle="Important Updates & Links"
      categorySlug="important"
      publicPath="/important"
    />
  );
}
