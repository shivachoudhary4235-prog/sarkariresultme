import { CategoryManager } from '../../../components/CategoryManager';

export const metadata = {
  title: 'Manage Answer Keys | Sarkari Result Admin',
};

export default function AnswerKeysAdminPage() {
  return (
    <CategoryManager
      category="answer-key"
      categoryTitle="Manage Answer Keys"
      categorySlug="answer-keys"
      publicPath="/answer-keys"
    />
  );
}
