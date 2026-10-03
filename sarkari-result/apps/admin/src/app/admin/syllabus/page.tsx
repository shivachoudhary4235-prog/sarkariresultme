import { CategoryManager } from '../../../components/CategoryManager';

export const metadata = {
  title: 'Manage Exam Syllabus | Sarkari Result Admin',
};

export default function SyllabusAdminPage() {
  return (
    <CategoryManager
      category="syllabus"
      categoryTitle="Manage Exam Syllabus"
      categorySlug="syllabus"
      publicPath="/syllabus"
    />
  );
}
