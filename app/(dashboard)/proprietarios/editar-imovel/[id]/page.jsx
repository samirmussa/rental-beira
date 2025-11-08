// app/(dashboard)/proprietarios/editar-imovel/[id]/page.jsx
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import PropertyForm from '@/components/PropertyForm';
import mongoose from 'mongoose';
import Property from '@/models/Property';

export default async function EditarImovel({ params }) {
  const { id } = await params; // ← ESSA LINHA RESOLVE O ERRO

  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'proprietario') redirect('/login');

  await mongoose.connect(process.env.MONGODB_URI);
  const imovelRaw = await Property.findOne({ _id: id, proprietario: session.user.id }).lean();

  if (!imovelRaw) redirect('/proprietarios');

  // SERIALIZAÇÃO SEGURA
  const imovel = JSON.parse(JSON.stringify(imovelRaw));

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <h1 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Editar Imóvel
        </h1>
        <PropertyForm imovelInicial={imovel} />
      </div>
    </div>
  );
}