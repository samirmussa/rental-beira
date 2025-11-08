// app/proprietario/page.jsx (ou app/(dashboard)/proprietarios/page.jsx)
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import DeletePropertyButton from '@/components/DeletePropertyButton';
import { authOptions } from '@/lib/auth';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PropertyCard from '@/components/PropertyCard';
import NotificacaoBell from '@/components/NotificacaoBell';
import StatusBadge from '@/components/StatusBadge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import EmailButtonGmail from '@/components/EmailButtonGmail';
import mongoose from 'mongoose';
import Property from '@/models/Property';
import Message from '@/models/Message';
import { revalidatePath } from 'next/cache';
import { format } from 'date-fns';
import SupportChatWidget from '@/components/SupportChatWidget';

// Server Action: Atualizar status
async function updateStatus(imovelId, novoStatus) {
  'use server';
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    await Property.findByIdAndUpdate(imovelId, { status: novoStatus });
    revalidatePath('/proprietario');
  } catch (error) {
    console.error('Erro ao atualizar status:', error);
    throw new Error('Erro ao atualizar status do imóvel');
  }
}

export const dynamic = 'force-dynamic';

export default async function ProprietarioDashboard() {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/login');
  if (session.user.role !== 'proprietario') redirect('/perfil');

  await mongoose.connect(process.env.MONGODB_URI);

  // Meus imóveis
  const imoveisRaw = await Property.find({ proprietario: session.user.id })
    .sort({ createdAt: -1 })
    .lean();
  const imoveis = JSON.parse(JSON.stringify(imoveisRaw));

  // Mensagens recebidas
  const imovelIds = imoveis.map(i => i._id);
  const mensagensRaw = await Message.find({ imovel: { $in: imovelIds } })
    .sort({ createdAt: -1 })
    .limit(10)
    .populate('remetente', 'nome email')
    .populate('imovel', 'titulo')
    .lean();

  // CONVERTER _id para STRING ANTES DE PASSAR AO CLIENTE
  const mensagens = mensagensRaw.map(msg => ({
    ...msg,
    _id: msg._id.toString(), // CONVERSÃO AQUI
    imovel: {
      ...msg.imovel,
      _id: msg.imovel._id.toString(),
    },
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Painel do Proprietário</h1>
          <NotificacaoBell />
        </div>
      </header>

      {/* Conteúdo Principal */}
      <div className="py-12">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Título + Botão Novo */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Meus Imóveis
              </h1>
              <p className="text-gray-600 mt-2">Gerencie seus anúncios de arrendamento</p>
            </div>
            <Link href="/proprietarios/novo-imovel">
              <Button size="lg" className="w-full sm:w-auto">
                + Novo Imóvel
              </Button>
            </Link>
          </div>

          {/* TABS */}
          <Tabs defaultValue="imoveis" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="imoveis">Meus Imóveis</TabsTrigger>
              <TabsTrigger value="mensagens">Mensagens Recebidas</TabsTrigger>
            </TabsList>

            {/* MEUS IMÓVEIS */}
            <TabsContent value="imoveis">
              {imoveis.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-xl shadow-md">
                  <p className="text-xl text-gray-600 mb-6">Você ainda não cadastrou nenhum imóvel.</p>
                  <Link href="/proprietarios/novo-imovel">
                    <Button>Cadastrar Primeiro Imóvel</Button>
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {imoveis.map((imovel) => (
                    <div key={imovel._id} className="relative">
                      <PropertyCard
                        imovel={imovel}
                        showActions={true}
                        imovelId={imovel._id}
                      />
                      {/* Controles de Status */}
                      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-2 shadow-sm">
                        <div className="flex items-center gap-2">
                          <StatusBadge status={imovel.status} />
                          <Select
                            defaultValue={imovel.status}
                            onValueChange={async (value) => {
                              'use server';
                              await updateStatus(imovel._id, value);
                            }}
                          >
                            <SelectTrigger className="w-40 h-8">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="disponivel">Disponível</SelectItem>
                              <SelectItem value="arrendado">Arrendado</SelectItem>
                              <SelectItem value="negociacao">Em Negociação</SelectItem>
                              <SelectItem value="manutencao">Em Manutenção</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* MENSAGENS RECEBIDAS */}
            <TabsContent value="mensagens">
              {mensagens.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-xl shadow-md">
                  <p className="text-xl text-gray-600">Nenhuma mensagem recebida ainda.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {mensagens.map((msg) => (
                    <div key={msg._id} className="bg-white rounded-lg shadow-sm p-4 border">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold text-sm">{msg.remetente.nome}</p>
                          <p className="text-xs text-gray-500">{msg.remetente.email}</p>
                        </div>
                        <p className="text-xs text-gray-500">
                          {format(new Date(msg.createdAt), 'dd/MM HH:mm')}
                        </p>
                      </div>
                      <div className="mt-2">
                        <p className="font-medium text-sm">Imóvel: {msg.imovel.titulo}</p>
                        <p className="text-sm text-gray-700 mt-1">{msg.texto}</p>
                      </div>

                      {/* BOTÃO DE REENVIAR EMAIL */}
                      <div className="flex justify-end mt-3">
                        <EmailButtonGmail mensagemId={msg._id} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* BOTÃO DE SUPORTE FLUTUANTE */}
      <SupportChatWidget />
    </div>
  );
}