import { CategoryManager } from '../../../components/CategoryManager';

export const metadata = {
  title: 'Manage Certificate Verification | Sarkari Result Admin',
};

export default function CertificateAdminPage() {
  return (
    <CategoryManager
      category="important"
      categoryTitle="Certificate Verification"
      categorySlug="certificate"
      publicPath="/certificate-verification"
    />
  );
}
