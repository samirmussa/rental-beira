// app/(admin)/admin/usuarios/page.jsx
'use client';

import { useState, useEffect } from 'react'; // ← ADICIONEI useEffect AQUI
import { redirect } from 'next/navigation';
import { useSession } from 'next-auth/react';
import AdminLayout from '@/components/AdminLayout';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Ban, CheckCircle, Loader2, Trash2 } from 'lucide-react';
import { Toaster, toast } from 'sonner';

export default function UsuariosPage() {
  const { data: session, status } = useSession();
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') redirect('/login');
    if (session?.user.role !== 'admin') redirect('/perfil');

    const fetchUsuarios = async () => {
      try {
        const res = await fetch('/api/admin/usuarios', { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          setUsuarios(data);
        }
      } catch (err) {
        toast.error('Erro ao carregar usuários');
      } finally {
        setLoading(false);
      }
    };

    if (session) fetchUsuarios();
  }, [session, status]);

  const bloquearUsuario = async (id) => {
    if (!confirm('Tem certeza que deseja bloquear este usuário?')) return;
    try {
      const res = await fetch(`/api/admin/usuarios/${id}/bloquear`, { method: 'POST' });
      if (res.ok) {
        toast.success('Usuário bloqueado');
        setUsuarios(prev => prev.map(u => u._id === id ? { ...u, bloqueado: true } : u));
      }
    } catch {
      toast.error('Erro ao bloquear');
    }
  };

  const excluirUsuario = async (id) => {
    if (!confirm('ATENÇÃO: Isso excluirá o usuário e TODOS os imóveis dele. Continuar?')) return;
    try {
      const res = await fetch(`/api/admin/usuarios/${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('Usuário excluído');
        setUsuarios(prev => prev.filter(u => u._id !== id));
      }
    } catch {
      toast.error('Erro ao excluir');
    }
  };

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
        <h1 className="text-3xl font-bold">Usuários</h1>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {usuarios.map((u) => (
              <TableRow key={u._id}>
                <TableCell>{u.nome}</TableCell>
                <TableCell>{u.email}</TableCell>
                <TableCell>
                  <Badge variant={u.role === 'proprietario' ? 'default' : 'secondary'}>
                    {u.role}
                  </Badge>
                </TableCell>
                <TableCell>
                  {u.verified ? (
                    <Badge variant="success"><CheckCircle className="w-4 h-4 mr-1" /> Verificado</Badge>
                  ) : (
                    <Badge variant="destructive"><Ban className="w-4 h-4 mr-1" /> Pendente</Badge>
                  )}
                </TableCell>
                <TableCell className="space-x-1">
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => bloquearUsuario(u._id)}
                    disabled={u.bloqueado}
                  >
                    {u.bloqueado ? 'Bloqueado' : 'Bloquear'}
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="text-red-600"
                    onClick={() => excluirUsuario(u._id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <Toaster position="top-right" richColors />
    </AdminLayout>
  );
}