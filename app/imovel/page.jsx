// app/imovel/[id]/page.jsx
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import mongoose from 'mongoose';
import Property from '@/models/Property';
import dynamic from 'next/dynamic';

const MapPin = dynamic(() => import('@/components/MapPin'), { ssr: false });

export default async function ImovelDetalhe({ params }) {
  await mongoose.connect(process.env.MONGODB_URI);
  const imovel = await Property.findById(params.id)
    .populate('proprietario', 'nome telefone')
    .lean();

  if (!imovel) notFound();

  // Função para manipular favoritos (será implementada no cliente)
  const handleFavorito = () => {
    // Esta função será implementada quando tornarmos o componente client-side
    console.log('Funcionalidade de favoritos a ser implementada');
  };

  const isFavorito = false; // Estado temporário - será gerenciado no cliente

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Galeria */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {imovel.imagens.slice(0, 4).map((img, i) => (
            <div key={i} className="relative h-64 md:h-80 rounded-xl overflow-hidden">
              <Image
                src={img}
                alt={`Foto ${i + 1}`}
                fill
                className="object-cover"
              />
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Detalhes */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h1 className="text-4xl font-bold mb-2">{imovel.titulo}</h1>
              <p className="text-xl text-gray-600">{imovel.bairro}, Beira</p>
            </div>

            <div className="flex items-center gap-4 flex-wrap">
              <Badge variant="secondary" className="text-lg px-4 py-1">
                {imovel.tipo}
              </Badge>
              <span className="text-3xl font-bold text-blue-600">
                {imovel.preco.toLocaleString()} MZN
              </span>
            </div>

            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-gray-100 p-4 rounded-lg">
                <p className="text-2xl font-bold">{imovel.quartos}</p>
                <p className="text-sm text-gray-600">Quartos</p>
              </div>
              <div className="bg-gray-100 p-4 rounded-lg">
                <p className="text-2xl font-bold">{imovel.wc}</p>
                <p className="text-sm text-gray-600">WC</p>
              </div>
              {imovel.area && (
                <div className="bg-gray-100 p-4 rounded-lg">
                  <p className="text-2xl font-bold">{imovel.area}</p>
                  <p className="text-sm text-gray-600">m²</p>
                </div>
              )}
            </div>

            {/* Botão de Favoritos - Adicionado aqui */}
            <div className="flex gap-3 mt-4">
              <Button 
                onClick={handleFavorito}
                className={`flex-1 ${isFavorito ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-100 hover:bg-gray-200 text-gray-800'}`}
              >
                {isFavorito ? '❤️ Salvo!' : '💙 Salvar'}
              </Button>
            </div>

            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-3">Descrição</h3>
              <p className="text-gray-700 whitespace-pre-wrap">
                {imovel.descricao || 'Sem descrição disponível.'}
              </p>
            </Card>
          </div>

          {/* Contato + Mapa */}
          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4">Contato</h3>
              <p className="font-medium">{imovel.proprietario.nome}</p>
              <div className="space-y-2 mt-3">
                {imovel.contato?.telefone && (
                  <Button asChild className="w-full">
                    <a href={`tel:${imovel.contato.telefone}`}>
                      Ligar
                    </a>
                  </Button>
                )}
                {imovel.contato?.whatsapp && (
                  <Button asChild variant="secondary" className="w-full">
                    <a
                      href={`https://wa.me/${imovel.contato.whatsapp.replace(/\D/g, '')}`}
                      target="_blank"
                    >
                      WhatsApp
                    </a>
                  </Button>
                )}
              </div>
            </Card>

            <Card className="overflow-hidden">
              <div className="h-64">
                <MapPin lat={imovel.coordenadas.lat} lng={imovel.coordenadas.lng} />
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}