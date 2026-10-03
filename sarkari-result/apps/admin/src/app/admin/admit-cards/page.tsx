import { CategoryManager } from '../../../components/CategoryManager';

export const metadata = {
  title: 'Manage Admit Cards | Sarkari Result Admin',
};

export default function AdmitCardsAdminPage() {
  return (
    <CategoryManager
      category="admit-card"
      categoryTitle="Manage Admit Cards"
      categorySlug="admit-cards"
      publicPath="/admit-cards"
    />
  );
}
