// app/(admin)/admin/page.jsx
'use client'; // ← CLIENT COMPONENT

import { useState, useEffect } from 'react';
import { redirect } from 'next/navigation';
import { useSession } from 'next-auth/react';
import AdminLayout from '@/components/AdminLayout';
import AdminChart from '@/components/AdminChart';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Home, Users, MessageCircle, TrendingUp, Trash2, Edit, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import AdminSupportWidget from '@/components/AdminSupportWidget';

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      redirect('/login');
    }
    if (session?.user.role !== 'admin') {
      redirect('/perfil');
    }

    const fetchData = async () => {
      try {
        const res = await fetch('/api/admin/stats');
        if (res.ok) {
          const json = await res.json();
          setData(json);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (session) fetchData();
  }, [session, status]);

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-96">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      </AdminLayout>
    );
  }

  if (!data) {
    return (
      <AdminLayout>
        <div className="text-center text-red-600">Erro ao carregar dados</div>
      </AdminLayout>
    );
  }

  const { stats, imoveisPopulares, usuariosRecentes } = data;

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Painel do Administrador</h1>
          <p className="text-gray-600 mt-1">Gerencie usuários, imóveis e estatísticas da plataforma</p>
        </div>

        {/* ESTATÍSTICAS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total de Imóveis</CardTitle>
              <Home className="w-5 h-5 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalImoveis}</div>
              <p className="text-xs text-gray-600">+12% este mês</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Usuários</CardTitle>
              <Users className="w-5 h-5 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsuarios}</div>
              <p className="text-xs text-gray-600">+8 novos hoje</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Mensagens</CardTitle>
              <MessageCircle className="w-5 h-5 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalMensagens}</div>
              <p className="text-xs text-gray-600">+120 hoje</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Imóveis Curtidos</CardTitle>
              <TrendingUp className="w-5 h-5 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.imoveisCurtidos}</div>
              <p className="text-xs text-gray-600">{stats.imoveisCurtidos} únicos</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AdminChart imoveisPopulares={imoveisPopulares} />

          <Card>
            <CardHeader>
              <CardTitle>Imóveis em Destaque</CardTitle>
              <CardDescription>Baseado em curtidas e visualizações</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Título</TableHead>
                    <TableHead className="text-center">Curtidas</TableHead>
                    <TableHead className="text-center">Visualizações</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {imoveisPopulares.map((imovel) => (
                    <TableRow key={imovel._id}>
                      <TableCell className="font-medium">
                        {imovel.titulo.length > 25
                          ? imovel.titulo.substring(0, 25) + '...'
                          : imovel.titulo}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="secondary">{imovel.curtidas}</Badge>
                      </TableCell>
                      <TableCell className="text-center">{imovel.visualizacoes}</TableCell>
                      <TableCell className="text-right">
                        <Button size="icon" variant="ghost">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button size="icon" variant="ghost" className="text-red-600">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Usuários Recentes</CardTitle>
            <CardDescription>Últimos cadastros na plataforma</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Data</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {usuariosRecentes.map((user) => (
                  <TableRow key={user._id}>
                    <TableCell>{user.nome}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge variant={user.role === 'proprietario' ? 'default' : 'secondary'}>
                        {user.role === 'proprietario' ? 'Proprietário' : 'Arrendatário'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {user.createdAt && !isNaN(new Date(user.createdAt).getTime())
                        ? format(new Date(user.createdAt), 'dd/MM/yyyy')
                        : '—'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* WIDGET DE SUPORTE */}
        <AdminSupportWidget />
      </div>
    </AdminLayout>
  );
}