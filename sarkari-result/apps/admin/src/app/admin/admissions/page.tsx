import { CategoryManager } from '../../../components/CategoryManager';

export const metadata = {
  title: 'Manage Admissions | Sarkari Result Admin',
};

export default function AdmissionsAdminPage() {
  return (
    <CategoryManager
      category="important"
      categoryTitle="Manage Admissions & Entrances"
      categorySlug="admissions"
      publicPath="/admissions"
    />
  );
}
