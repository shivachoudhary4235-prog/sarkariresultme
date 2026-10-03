import { CategoryManager } from '../../../components/CategoryManager';

export const metadata = {
  title: 'Manage Exam Results | Sarkari Result Admin',
};

export default function ResultsAdminPage() {
  return (
    <CategoryManager
      category="result"
      categoryTitle="Manage Exam Results"
      categorySlug="results"
      publicPath="/results"
    />
  );
}
