import { CategoryManager } from '../../../components/CategoryManager';

export const metadata = {
  title: 'Manage Outsourcing Jobs | Sarkari Result Admin',
};

export default function OutsourcingAdminPage() {
  return (
    <CategoryManager
      category="outsourcing"
      categoryTitle="Outsourcing & Contractual Jobs"
      categorySlug="outsourcing"
      publicPath="/outsourcing"
    />
  );
}
