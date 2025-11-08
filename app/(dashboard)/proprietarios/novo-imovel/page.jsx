import PropertyForm from '@/components/PropertyForm';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export default async function NovoImovel() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'proprietario') {
    redirect('/(auth)/login');
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <PropertyForm />
      </div>
    </div>
  );
}