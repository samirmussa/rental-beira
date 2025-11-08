// app/perfil/editar/page.jsx
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import mongoose from 'mongoose';
import User from '@/models/User';

export default async function EditarPerfil() {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/login');

  await mongoose.connect(process.env.MONGODB_URI);
  const user = await User.findById(session.user.id).select('nome email telefone').lean();

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Editar Perfil</CardTitle>
        </CardHeader>
        <CardContent>
          <form action="/api/perfil/atualizar" method="POST" className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Nome</label>
              <Input name="nome" defaultValue={user.nome} required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <Input name="email" type="email" defaultValue={user.email} required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Telefone</label>
              <Input name="telefone" defaultValue={user.telefone} />
            </div>
            <div className="flex gap-3">
              <Button type="submit" className="flex-1">Salvar</Button>
              <Button type="button" variant="outline" asChild>
                <a href="/perfil">Cancelar</a>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}