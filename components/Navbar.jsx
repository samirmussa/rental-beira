// components/Navbar.jsx
'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { Button } from '../components/ui/button';
import { Avatar, AvatarFallback } from '../components/ui/avatar';
import { User } from 'lucide-react';

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Arrenda Beira
        </Link>

        <div className="flex items-center gap-4">
          {session ? (
            <>
              <Link href={session.user.role === 'proprietario' ? '/proprietarios' : '/arrendatarios'}>
                <Button variant="ghost">Dashboard</Button>
              </Link>
              
              {/* Botão Perfil Adicionado */}
              {session && (
                <Button asChild variant="ghost">
                  <Link href="/perfil">
                    <User className="w-5 h-5 mr-2" />
                    Perfil
                  </Link>
                </Button>
              )}
              
              <Button onClick={() => signOut({ callbackUrl: '/login' })} variant="outline">
                Sair
              </Button>
              <Avatar>
                <AvatarFallback>{session.user.name?.[0] || 'U'}</AvatarFallback>
              </Avatar>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost">Entrar</Button>
              </Link>
              <Link href="/register">
                <Button>Cadastrar</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}