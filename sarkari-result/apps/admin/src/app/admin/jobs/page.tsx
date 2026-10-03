import { CategoryManager } from '../../../components/CategoryManager';

export const metadata = {
  title: 'Manage Latest Jobs | Sarkari Result Admin',
};

export default function JobsAdminPage() {
  return (
    <CategoryManager
      category="latest-job"
      categoryTitle="Manage Latest Jobs"
      categorySlug="jobs"
      publicPath="/jobs"
    />
  );
}
