'use client';

import { useState, useEffect } from 'react';
import { redirect } from 'next/navigation';
import { useSession } from 'next-auth/react';
import dynamic from 'next/dynamic';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PropertyCard from '@/components/PropertyCard';

// Carrega o mapa apenas no cliente
const MapWithPins = dynamic(() => import('@/components/MapWithPins'), { ssr: false });

export default function ArrendatarioDashboard() {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      redirect('/login');
    },
  });

  const [imoveis, setImoveis] = useState([]);
  const [favoritos, setFavoritos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtros, setFiltros] = useState({
    minPreco: '',
    maxPreco: '',
    tipo: '',
    bairro: '',
  });

  useEffect(() => {
    if (session?.user.role !== 'arrendatario') {
      redirect('/proprietarios');
    }
  }, [session]);

  useEffect(() => {
    fetchImoveis();
    carregarFavoritos();
  }, [filtros]);

  // Carrega favoritos da API
  const carregarFavoritos = async () => {
    if (session?.user.id) {
      try {
        const res = await fetch('/api/favoritos');
        if (res.ok) {
          const data = await res.json();
          setFavoritos(data.favoritos || []);
        }
      } catch (error) {
        console.error('Erro ao carregar favoritos:', error);
      }
    }
  };

  const fetchImoveis = async () => {
    setLoading(true);
    const params = new URLSearchParams();

    if (filtros.minPreco) params.append('minPreco', filtros.minPreco);
    if (filtros.maxPreco) params.append('maxPreco', filtros.maxPreco);
    if (filtros.tipo && filtros.tipo !== 'todos') params.append('tipo', filtros.tipo);
    if (filtros.bairro) params.append('bairro', filtros.bairro);

    try {
      const res = await fetch(`/api/imoveis?${params}`);
      const data = await res.json();
      setImoveis(data);
    } catch (error) {
      console.error('Erro ao carregar imóveis:', error);
    } finally {
      setLoading(false);
    }
  };

  // Verifica se um imóvel está nos favoritos
  const isFavorito = (imovelId) => {
    return favoritos.some(fav => fav._id === imovelId);
  };

  // Atualiza a lista de favoritos após uma ação
  const atualizarFavoritos = () => {
    carregarFavoritos();
  };

  if (status === 'loading') return <p>Carregando...</p>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-100">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
            Encontre Sua Casa na Beira
          </h1>
          <p className="text-gray-600 mt-1">Explore imóveis disponíveis para arrendamento</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <Tabs defaultValue="busca" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="busca" className="flex items-center gap-2">
              🗺️ Busca
            </TabsTrigger>
            <TabsTrigger value="favoritos" className="flex items-center gap-2">
              ❤️ Favoritos ({favoritos.length})
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="busca">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Filtros */}
              <div className="lg:col-span-1">
                <Card className="p-5 sticky top-4">
                  <h3 className="font-semibold mb-4">Filtros</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Preço Mínimo</label>
                      <Input
                        type="number"
                        placeholder="ex: 5000"
                        value={filtros.minPreco}
                        onChange={(e) =>
                          setFiltros({ ...filtros, minPreco: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Preço Máximo</label>
                      <Input
                        type="number"
                        placeholder="ex: 20000"
                        value={filtros.maxPreco}
                        onChange={(e) =>
                          setFiltros({ ...filtros, maxPreco: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Tipo</label>
                      <Select
                        value={filtros.tipo || 'todos'}
                        onValueChange={(v) =>
                          setFiltros({ ...filtros, tipo: v === 'todos' ? '' : v })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Todos os tipos" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="todos">Todos os tipos</SelectItem>
                          <SelectItem value="T1">T1</SelectItem>
                          <SelectItem value="T2">T2</SelectItem>
                          <SelectItem value="T3">T3</SelectItem>
                          <SelectItem value="Apartamento">Apartamento</SelectItem>
                          <SelectItem value="Moradia">Moradia</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Bairro</label>
                      <Input
                        placeholder="ex: Manga"
                        value={filtros.bairro}
                        onChange={(e) =>
                          setFiltros({ ...filtros, bairro: e.target.value })
                        }
                      />
                    </div>
                    <Button onClick={fetchImoveis} className="w-full">
                      Aplicar Filtros
                    </Button>
                  </div>
                </Card>
              </div>

              {/* Mapa + Lista */}
              <div className="lg:col-span-3 space-y-6">
                {/* Mapa */}
                <Card className="overflow-hidden">
                  <div className="h-96">
                    <MapWithPins imoveis={imoveis} />
                  </div>
                </Card>

                {/* Lista */}
                <div>
                  <h2 className="text-xl font-semibold mb-4">
                    {imoveis.length} imóvel(imóveis) encontrado(s)
                  </h2>
                  {loading ? (
                    <p>Carregando imóveis...</p>
                  ) : imoveis.length === 0 ? (
                    <Card className="p-8 text-center">
                      <p className="text-gray-600">
                        Nenhum imóvel encontrado com os filtros atuais.
                      </p>
                    </Card>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {imoveis.map((imovel) => (
                        <PropertyCard 
                          key={imovel._id} 
                          imovel={imovel}
                          isFavorito={isFavorito(imovel._id)}
                          onFavoritoChange={atualizarFavoritos}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="favoritos">
            {/* Lista de favoritos */}
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">
                  Seus Imóveis Favoritos
                </h2>
                <p className="text-gray-600">
                  {favoritos.length} imóvel(imóveis) salvos
                </p>
              </div>

              {favoritos.length === 0 ? (
                <Card className="p-12 text-center">
                  <div className="text-6xl mb-4">❤️</div>
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">
                    Nenhum imóvel favoritado ainda
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Explore os imóveis disponíveis e salve os que mais gostar!
                  </p>
                  <Button 
                    onClick={() => document.querySelector('[data-value="busca"]').click()}
                    className="bg-gradient-to-r from-green-600 to-teal-600"
                  >
                    🗺️ Explorar Imóveis
                  </Button>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {favoritos.map(imovel => (
                    <PropertyCard 
                      key={imovel._id} 
                      imovel={imovel}
                      isFavorito={true}
                      onFavoritoChange={atualizarFavoritos}
                    />
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}