// components/PropertyCard.jsx
'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, MapPin, Home, Bed, Bath, Edit } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import StatusBadge from './StatusBadge';
import DeletePropertyButton from '@/components/DeletePropertyButton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useRouter } from 'next/navigation';

export default function PropertyCard({ 
  imovel, 
  showActions = false, 
  imovelId,
  isFavorito: initialFavorito = false, 
  onFavoritoChange,
  onDelete // ← NOVA PROP
}) {
  const router = useRouter();
  const [curtido, setCurtido] = useState(initialFavorito);
  const [curtidas, setCurtidas] = useState(imovel.curtidas || 0);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(imovel.status);

  const toggleFavorito = async () => {
    if (loading) return;
    setLoading(true);

    try {
      const res = await fetch(`/api/imoveis/${imovel._id}/curtir`, {
        method: 'POST',
      });

      if (res.ok) {
        const data = await res.json();
        setCurtido(data.curtido);
        setCurtidas(data.curtidas);
        onFavoritoChange?.(); // ← CHAMA A FUNÇÃO DO PAI
      }
    } catch (error) {
      console.error('Erro ao curtir:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (newStatus) => {
    try {
      const res = await fetch(`/api/imoveis/${imovelId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      
      if (res.ok) {
        setStatus(newStatus);
        router.refresh();
      } else {
        const data = await res.json();
        alert(data.error || 'Erro ao atualizar status');
      }
    } catch (error) {
      alert('Erro de conexão ao atualizar status');
    }
  };

  const imagem = imovel.imagens[0] || '/placeholder.jpg';

  return (
    <Card className="overflow-hidden hover:shadow-xl transition-shadow">
      <div className="relative h-48">
        <Link href={`/imovel/${imovel._id}`}>
          <Image
            src={imagem}
            alt={imovel.titulo}
            fill
            className="object-cover hover:scale-105 transition-transform duration-300"
            unoptimized
          />
        </Link>
        
        {/* Badge do tipo no canto superior direito */}
        <Badge className="absolute top-3 right-3 bg-black/70 text-white border-none">
          {imovel.tipo}
        </Badge>
        
        {/* Botão de favorito no canto superior esquerdo */}
        <Button
          onClick={toggleFavorito}
          disabled={loading}
          size="icon"
          variant="ghost"
          className={`absolute top-2 left-2 ${
            curtido ? 'text-red-500 bg-white/90' : 'text-white bg-black/30'
          } hover:bg-white/80 transition-colors`}
        >
          <Heart className={`w-5 h-5 ${curtido ? 'fill-red-500' : ''}`} />
        </Button>
      </div>

      <CardContent className="p-4">
        <Link href={`/imovel/${imovel._id}`} className="block">
          <h3 className="font-semibold text-lg hover:text-blue-600 transition-colors mb-1">
            {imovel.titulo}
          </h3>
        </Link>
        
        <p className="text-sm text-gray-600 flex items-center gap-1 mb-2">
          <MapPin className="w-4 h-4" />
          {imovel.bairro}, Beira
        </p>

        <div className="flex items-center justify-between mb-3">
          <span className="text-xl font-bold text-blue-600">
            {imovel.preco.toLocaleString()} MZN
          </span>
          <div className="flex gap-3 text-sm text-gray-600">
            {imovel.quartos && (
              <span className="flex items-center gap-1">
                <Bed className="w-4 h-4" />
                {imovel.quartos}
              </span>
            )}
            {imovel.wc && (
              <span className="flex items-center gap-1">
                <Bath className="w-4 h-4" />
                {imovel.wc}
              </span>
            )}
            {imovel.area && (
              <span className="flex items-center gap-1">
                <Home className="w-4 h-4" />
                {imovel.area}m²
              </span>
            )}
          </div>
        </div>

        {/* Contador de curtidas */}
        <div className="flex items-center gap-1 text-sm text-gray-500 mb-3">
          <Heart className="w-4 h-4" />
          {curtidas} curtida{curtidas !== 1 ? 's' : ''}
        </div>

        {/* Seção de Status */}
        <div className="pt-3 border-t">
          <div className="flex items-center justify-between">
            <StatusBadge status={status} />
            {showActions && (
              <Select value={status} onValueChange={updateStatus}>
                <SelectTrigger className="w-32 h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="disponivel">Disponível</SelectItem>
                  <SelectItem value="arrendado">Arrendado</SelectItem>
                  <SelectItem value="negociacao">Em Negociação</SelectItem>
                  <SelectItem value="manutencao">Em Manutenção</SelectItem>
                </SelectContent>
              </Select>
            )}
          </div>
        </div>

        {/* Ações do proprietário */}
        {showActions && (
          <div className="mt-4 pt-4 border-t flex gap-2">
            <Link href={`/proprietarios/editar-imovel/${imovelId}`} className="flex-1">
              <Button size="sm" variant="outline" className="w-full">
                <Edit className="w-4 h-4 mr-1" /> Editar
              </Button>
            </Link>

            <DeletePropertyButton 
              imovelId={imovelId} 
              onDelete={onDelete} // ← PASSA A PROP PARA O COMPONENTE DE DELETE
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}