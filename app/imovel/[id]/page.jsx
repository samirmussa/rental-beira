// app/imovel/[id]/page.jsx
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import mongoose from 'mongoose';
import Property from '@/models/Property';
import ImovelMapClient from '@/components/ImovelMapClient';
import ChatBox from '@/components/ChatBox';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import FormAvaliacao from '@/components/FormAvaliacao';
import AvaliacaoCard from '@/components/AvaliacaoCard';
import { Star } from 'lucide-react';
import StatusBadge from '@/components/StatusBadge';
import FavoriteButton from '@/components/FavoriteButton';

export default async function ImovelDetalhe({ params }) {
  const { id } = await params;
  const session = await getServerSession(authOptions);

  await mongoose.connect(process.env.MONGODB_URI);

  const imovelRaw = await Property.findById(id)
    .populate('proprietario', 'nome telefone')
    .lean();

  if (!imovelRaw) notFound();

  const imovel = JSON.parse(JSON.stringify(imovelRaw));

  const res = await fetch(`${process.env.NEXTAUTH_URL}/api/imoveis/${id}/avaliacoes`, {
    cache: 'no-store',
  });

  let avaliacoes = [];
  let media = 0;
  let total = 0;

  if (res.ok) {
    const data = await res.json();
    avaliacoes = data.avaliacoes || [];
    media = Number(data.media) || 0;
    total = data.total || 0;
  }

  const jaAvaliou = session?.user?.id
    ? avaliacoes.some(a => a.arrendatario._id === session.user.id)
    : false;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Galeria */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {imovel.imagens.slice(0, 4).map((img, i) => (
            <div key={i} className="relative h-64 md:h-80 rounded-xl overflow-hidden shadow-md">
              <Image
                src={img}
                alt={`Foto ${i + 1}`}
                fill
                className="object-cover hover:scale-105 transition-transform duration-300"
                unoptimized
              />
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Detalhes */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h1 className="text-4xl font-bold mb-2 text-gray-900">{imovel.titulo}</h1>
              <p className="text-xl text-gray-600">{imovel.bairro}, Beira</p>
            </div>

            {/* Seção atualizada com FavoriteButton */}
            <div className="flex items-center gap-4 flex-wrap mt-2">
              <StatusBadge status={imovel.status} />
              <span className="text-3xl font-bold text-blue-600">
                {imovel.preco.toLocaleString()} MZN
              </span>
              <FavoriteButton 
                imovelId={id} 
                initialCurtidas={imovel.curtidas} 
                initialCurtido={imovel.usuariosCurtiram?.includes(session?.user?.id)}
              />
            </div>

            <div className="flex items-center gap-4 flex-wrap">
              <Badge variant="secondary" className="text-lg px-4 py-1">
                {imovel.tipo}
              </Badge>
            </div>

            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-gray-100 p-4 rounded-lg">
                <p className="text-2xl font-bold">{imovel.quartos || 0}</p>
                <p className="text-sm text-gray-600">Quartos</p>
              </div>
              <div className="bg-gray-100 p-4 rounded-lg">
                <p className="text-2xl font-bold">{imovel.wc || 0}</p>
                <p className="text-sm text-gray-600">WC</p>
              </div>
              {imovel.area && (
                <div className="bg-gray-100 p-4 rounded-lg">
                  <p className="text-2xl font-bold">{imovel.area}</p>
                  <p className="text-sm text-gray-600">m²</p>
                </div>
              )}
            </div>

            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-3">Descrição</h3>
              <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                {imovel.descricao || 'Sem descrição disponível.'}
              </p>
            </Card>
          </div>

          {/* Contato + Mapa */}
          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4">Contato</h3>
              <p className="font-medium text-gray-800">
                {imovel.proprietario?.nome || 'Proprietário não disponível'}
              </p>
              <div className="space-y-2 mt-3">
                {imovel.contato?.telefone && (
                  <Button asChild className="w-full bg-blue-600 hover:bg-blue-700">
                    <a href={`tel:${imovel.contato.telefone}`}>Ligar</a>
                  </Button>
                )}
                {imovel.contato?.whatsapp && (
                  <Button asChild variant="secondary" className="w-full">
                    <a
                      href={`https://wa.me/${imovel.contato.whatsapp.replace(/\D/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      WhatsApp
                    </a>
                  </Button>
                )}
                {!imovel.contato?.telefone && !imovel.contato?.whatsapp && (
                  <p className="text-sm text-gray-500 text-center">Contato não informado</p>
                )}
              </div>
            </Card>

            <Card className="overflow-hidden shadow-md">
              <div className="h-64">
                <ImovelMapClient lat={imovel.coordenadas.lat} lng={imovel.coordenadas.lng} />
              </div>
            </Card>
          </div>
        </div>

        {/* Seção de Avaliações */}
        <div className="mt-12">
          <div className="flex items-center gap-2 mb-4">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-5 h-5 ${
                    i < Math.floor(media)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="font-semibold">
              {parseFloat(media).toFixed(1)} ({total} avaliação{total !== 1 ? 'es' : ''})
            </span>
          </div>

          {session?.user.role === 'arrendatario' && !jaAvaliou && (
            <FormAvaliacao imovelId={id} />
          )}

          <div className="mt-8">
            <h3 className="text-xl font-semibold mb-4">Avaliações</h3>
            {avaliacoes.length > 0 ? (
              avaliacoes.map(avaliacao => (
                <AvaliacaoCard
                  key={avaliacao._id}
                  avaliacao={avaliacao}
                  imovelId={id}
                  isProprietario={
                    session?.user.role === 'proprietario' &&
                    imovel.proprietario._id === session.user.id
                  }
                />
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">
                Este imóvel ainda não possui avaliações.
              </p>
            )}
          </div>
        </div>

        {/* ChatBox para arrendatários e proprietário do imóvel */}
        {session && (session.user.role === 'arrendatario' || 
          (session.user.role === 'proprietario' && imovel.proprietario._id === session.user.id)) && (
          <div className="mt-12">
            <ChatBox
              imovelId={imovel._id}
              proprietarioNome={imovel.proprietario?.nome || 'Proprietário'}
              proprietarioId={imovel.proprietario._id}
            />
          </div>
        )}
      </div>
    </div>
  );
}