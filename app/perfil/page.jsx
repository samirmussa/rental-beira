// app/perfil/page.jsx
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Home, Heart, MessageCircle, Eye, Edit, User as UserIcon, Mail } from 'lucide-react';
import mongoose from 'mongoose';
import User from '@/models/User';
import Property from '@/models/Property';
import Message from '@/models/Message';
import Link from 'next/link';
import { format } from 'date-fns';

export const dynamic = 'force-dynamic';

export default async function PerfilPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/login');

  const userId = session.user.id;
  await mongoose.connect(process.env.MONGODB_URI);

  const user = await User.findById(userId)
    .select('nome email telefone avatar favoritos')
    .populate({
      path: 'favoritos',
      select: 'titulo preco imagens bairro tipo',
      limit: 6,
    })
    .lean();

  // Histórico de visualizações (simulado ou via cookie/localStorage no futuro)
  const visualizados = await Property.find({ 'visualizacoesPor': userId })
    .sort({ updatedAt: -1 })
    .limit(6)
    .select('titulo preco imagens bairro tipo')
    .lean();

  // Mensagens enviadas - CORREÇÃO: Filtrar mensagens com imóvel null
  const mensagens = await Message.find({ 
    remetente: userId,
    imovel: { $ne: null } // Só traz mensagens que têm imóvel
  })
    .sort({ createdAt: -1 })
    .limit(5)
    .populate('imovel', 'titulo')
    .lean();

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Meu Perfil</h1>
        <p className="text-gray-600">Gerencie suas informações e atividades</p>
      </div>

      {/* PERFIL + EDITAR */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="md:col-span-1">
          <CardContent className="p-6 text-center">
            <Avatar className="w-24 h-24 mx-auto mb-4">
              <AvatarImage src={user.avatar} />
              <AvatarFallback>{user.nome?.charAt(0) || 'U'}</AvatarFallback>
            </Avatar>
            <h2 className="text-xl font-bold">{user.nome}</h2>
            <p className="text-sm text-gray-600">{user.email}</p>
            {user.telefone && (
              <p className="text-sm text-gray-500 mt-1">{user.telefone}</p>
            )}
            <Badge className="mt-3" variant="secondary">
              Arrendatário
            </Badge>
            <Button asChild className="mt-4 w-full">
              <Link href="/perfil/editar">
                <Edit className="w-4 h-4 mr-2" />
                Editar Perfil
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Estatísticas Rápidas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-3xl font-bold text-green-600">{user.favoritos?.length || 0}</p>
                <p className="text-sm text-gray-600">Favoritos</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-blue-600">{visualizados?.length || 0}</p>
                <p className="text-sm text-gray-600">Visualizados</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-purple-600">{mensagens?.length || 0}</p>
                <p className="text-sm text-gray-600">Mensagens</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* TABS */}
      <Tabs defaultValue="favoritos" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="favoritos">
            <Heart className="w-4 h-4 mr-2" />
            Favoritos
          </TabsTrigger>
          <TabsTrigger value="visualizados">
            <Eye className="w-4 h-4 mr-2" />
            Visualizados
          </TabsTrigger>
          <TabsTrigger value="mensagens">
            <MessageCircle className="w-4 h-4 mr-2" />
            Mensagens
          </TabsTrigger>
        </TabsList>

        {/* FAVORITOS */}
        <TabsContent value="favoritos">
          <Card>
            <CardHeader>
              <CardTitle>Imóveis Favoritos</CardTitle>
            </CardHeader>
            <CardContent>
              {!user.favoritos || user.favoritos.length === 0 ? (
                <p className="text-center text-gray-500 py-8">
                  Você ainda não tem favoritos. Explore imóveis!
                </p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {user.favoritos.map((imovel) => (
                    <Link
                      key={imovel._id}
                      href={`/imovel/${imovel._id}`}
                      className="border rounded-lg overflow-hidden hover:shadow-lg transition"
                    >
                      {/* IMAGEM REAL COM FALLBACK */}
                      {imovel.imagens && imovel.imagens[0] ? (
                        <img
                          src={imovel.imagens[0]}
                          alt={imovel.titulo}
                          className="w-full h-40 object-cover"
                        />
                      ) : (
                        <div className="bg-gray-200 border-2 border-dashed rounded-t-lg w-full h-40 flex items-center justify-center">
                          <Home className="w-8 h-8 text-gray-400" />
                        </div>
                      )}

                      <div className="p-3">
                        <h3 className="font-semibold text-sm truncate">{imovel.titulo || 'Sem título'}</h3>
                        <p className="text-xs text-gray-600">{imovel.bairro || 'Bairro não informado'}</p>
                        <p className="font-bold text-green-600">
                          {imovel.preco?.toLocaleString('pt-MZ') || '0'} MZN
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* VISUALIZADOS */}
        <TabsContent value="visualizados">
          <Card>
            <CardHeader>
              <CardTitle>Últimos Visualizados</CardTitle>
            </CardHeader>
            <CardContent>
              {!visualizados || visualizados.length === 0 ? (
                <p className="text-center text-gray-500 py-8">
                  Você ainda não visualizou imóveis.
                </p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {visualizados.map((imovel) => (
                    <Link
                      key={imovel._id}
                      href={`/imovel/${imovel._id}`}
                      className="border rounded-lg overflow-hidden hover:shadow-lg transition"
                    >
                      {/* IMAGEM REAL COM FALLBACK */}
                      {imovel.imagens && imovel.imagens[0] ? (
                        <img
                          src={imovel.imagens[0]}
                          alt={imovel.titulo}
                          className="w-full h-40 object-cover"
                        />
                      ) : (
                        <div className="bg-gray-200 border-2 border-dashed rounded-t-lg w-full h-40 flex items-center justify-center">
                          <Home className="w-8 h-8 text-gray-400" />
                        </div>
                      )}

                      <div className="p-3">
                        <h3 className="font-semibold text-sm truncate">{imovel.titulo || 'Sem título'}</h3>
                        <p className="text-xs text-gray-600">{imovel.bairro || 'Bairro não informado'}</p>
                        <p className="font-bold text-green-600">
                          {imovel.preco?.toLocaleString('pt-MZ') || '0'} MZN
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* MENSAGENS - CORREÇÃO APLICADA AQUI */}
        <TabsContent value="mensagens">
          <Card>
            <CardHeader>
              <CardTitle>Mensagens Enviadas</CardTitle>
            </CardHeader>
            <CardContent>
              {!mensagens || mensagens.length === 0 ? (
                <p className="text-center text-gray-500 py-8">
                  Você ainda não enviou mensagens.
                </p>
              ) : (
                <div className="space-y-3">
                  {mensagens.map((msg) => (
                    <div key={msg._id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          {/* CORREÇÃO: Verificação segura para msg.imovel */}
                          <p className="font-semibold">
                            {msg.imovel?.titulo || 'Imóvel não disponível'}
                          </p>
                          <p className="text-sm text-gray-600">{msg.texto}</p>
                        </div>
                        <p className="text-xs text-gray-500">
                          {format(new Date(msg.createdAt), 'dd/MM HH:mm')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}