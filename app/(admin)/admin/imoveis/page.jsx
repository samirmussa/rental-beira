// app/(admin)/admin/imoveis/page.jsx
'use client';

import { useState, useEffect } from 'react';
import { redirect } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { use } from 'react'; // IMPORTANTE
import AdminLayout from '@/components/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Home, Search, Eye, Edit, Trash2, MapPin, DollarSign, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { Toaster, toast } from 'sonner';
import DeletePropertyButton from '@/components/DeletePropertyButton';

export default function ImoveisPage({ searchParams }) {
  const { data: session, status } = useSession();
  const [imoveis, setImoveis] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  // UNWRAP searchParams COM React.use()
  const params = use(searchParams);
  const page = Number(params.page) || 1;
  const limit = 10;
  const search = params.search || '';
  const statusFilter = params.status || 'todos';
  const tipo = params.tipo || 'todos';

  useEffect(() => {
    if (status === 'unauthenticated') redirect('/login');
    if (session?.user.role !== 'admin') redirect('/perfil');

    const fetchImoveis = async () => {
      setLoading(true);
      try {
        const query = new URLSearchParams({ page, limit, search, status: statusFilter, tipo });
        const res = await fetch(`/api/admin/imoveis?${query}`);
        if (res.ok) {
          const data = await res.json();
          setImoveis(data.imoveis);
          setTotal(data.total);
        }
      } catch {
        toast.error('Erro ao carregar imóveis');
      } finally {
        setLoading(false);
      }
    };

    if (session) fetchImoveis();
  }, [session, status, page, search, statusFilter, tipo]);

  const totalPages = Math.ceil(total / limit);

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center py-10">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Imóveis</h1>
          <Badge variant="outline" className="text-lg px-3 py-1">
            Total: {total}
          </Badge>
        </div>

        {/* FILTROS */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Filtros</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <Input
                  name="search"
                  placeholder="Título ou bairro..."
                  defaultValue={search}
                  className="pl-10"
                />
              </div>
              <Select name="status" defaultValue={statusFilter}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os status</SelectItem>
                  <SelectItem value="disponivel">Disponível</SelectItem>
                  <SelectItem value="arrendado">Arrendado</SelectItem>
                  <SelectItem value="negociacao">Em Negociação</SelectItem>
                  <SelectItem value="manutencao">Manutenção</SelectItem>
                </SelectContent>
              </Select>
              <Select name="tipo" defaultValue={tipo}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os tipos</SelectItem>
                  <SelectItem value="T1">T1</SelectItem>
                  <SelectItem value="T2">T2</SelectItem>
                  <SelectItem value="T3">T3</SelectItem>
                  <SelectItem value="T4">T4</SelectItem>
                  <SelectItem value="Apartamento">Apartamento</SelectItem>
                  <SelectItem value="Moradia">Moradia</SelectItem>
                </SelectContent>
              </Select>
              <Button type="submit" className="w-full md:w-auto">
                Filtrar
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* TABELA */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Imóvel</TableHead>
                  <TableHead>Proprietário</TableHead>
                  <TableHead className="text-center">Preço</TableHead>
                  <TableHead className="text-center">Tipo</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-center">Curtidas</TableHead>
                  <TableHead className="text-center">Quartos</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {imoveis.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8 text-gray-500">
                      Nenhum imóvel encontrado
                    </TableCell>
                  </TableRow>
                ) : (
                  imoveis.map((imovel) => (
                    <TableRow key={imovel._id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <Home className="w-4 h-4 text-gray-400" />
                          <div>
                            <p className="font-semibold">{imovel.titulo}</p>
                            <p className="text-xs text-gray-500 flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {imovel.bairro}, {imovel.cidade}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{imovel.proprietario.nome}</p>
                          <p className="text-xs text-gray-500">{imovel.proprietario.email}</p>
                        </div>
                      </TableCell>
                      <TableCell className="text-center font-bold text-green-600">
                        {imovel.preco?.toLocaleString('pt-MZ')} MZN
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="outline">{imovel.tipo}</Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge
                          variant={
                            imovel.status === 'disponivel' ? 'success' :
                            imovel.status === 'arrendado' ? 'destructive' : 'secondary'
                          }
                        >
                          {imovel.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center font-semibold">
                        {imovel.curtidas || 0}
                      </TableCell>
                      <TableCell className="text-center">
                        {imovel.quartos || '-'}
                      </TableCell>
                      <TableCell>
                        {format(new Date(imovel.createdAt), 'dd/MM/yyyy')}
                      </TableCell>
                      <TableCell className="text-right space-x-1">
                        <Button size="icon" variant="ghost" title="Visualizar">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button size="icon" variant="ghost" title="Editar">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <DeletePropertyButton imovelId={imovel._id} />
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* PAGINAÇÃO */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 flex-wrap">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <Button
                key={p}
                variant={p === page ? 'default' : 'outline'}
                size="sm"
                asChild
              >
                <a
                  href={`/admin/imoveis?page=${p}&search=${search}&status=${statusFilter}&tipo=${tipo}`}
                >
                  {p}
                </a>
              </Button>
            ))}
          </div>
        )}
      </div>
      <Toaster position="top-right" richColors />
    </AdminLayout>
  );
}