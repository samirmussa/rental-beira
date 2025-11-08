// components/NotificacaoBell.jsx
'use client';

import { useState, useEffect } from 'react';
import { Bell, Heart, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

export default function NotificacaoBell() {
  const { data: session } = useSession();
  const [notificacoes, setNotificacoes] = useState([]);
  const [naoLidas, setNaoLidas] = useState(0);
  const [open, setOpen] = useState(false);

  const carregarNotificacoes = async () => {
    if (!session?.user?.id) return;
    try {
      const res = await fetch('/api/notificacoes');
      if (res.ok) {
        const data = await res.json();
        setNotificacoes(data.notificacoes || []);
        setNaoLidas(data.naoLidas || 0);
      }
    } catch (error) {
      console.error('Erro ao carregar notificações:', error);
    }
  };

  useEffect(() => {
    carregarNotificacoes();
    const interval = setInterval(carregarNotificacoes, 10000); // a cada 10s
    return () => clearInterval(interval);
  }, [session]);

  const marcarComoLida = async (id) => {
    try {
      await fetch(`/api/notificacoes/${id}/lida`, { method: 'POST' });
      carregarNotificacoes();
    } catch (error) {
      console.error('Erro ao marcar como lida:', error);
    }
  };

  if (!session) return null;

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5" />
          {naoLidas > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs">
              {naoLidas}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 max-h-96 overflow-y-auto">
        <div className="p-2 font-semibold border-b">Notificações</div>
        {notificacoes.length === 0 ? (
          <div className="p-4 text-center text-gray-500">Nenhuma notificação</div>
        ) : (
          notificacoes.map((notif) => (
            <DropdownMenuItem
              key={notif._id}
              className={`flex flex-col items-start p-3 ${!notif.lida ? 'bg-blue-50' : ''}`}
              onClick={() => marcarComoLida(notif._id)}
            >
              <div className="flex items-center gap-2 w-full">
                {notif.tipo === 'curtida' && <Heart className="w-4 h-4 text-red-500" />}
                {notif.tipo === 'mensagem' && <MessageCircle className="w-4 h-4 text-green-500" />}
                <span className="font-medium text-sm">{notif.remetente?.nome || 'Usuário'}</span>
              </div>
              <p className="text-xs text-gray-600 mt-1">{notif.mensagem}</p>

              {/* LINK CONDICIONAL: SÓ SE imovel EXISTIR E TIVER _id */}
              {notif.imovel && notif.imovel._id ? (
                <Link href={`/imovel/${notif.imovel._id}`} className="text-xs text-blue-600 mt-1">
                  Ver imóvel
                </Link>
              ) : (
                <span className="text-xs text-gray-400 mt-1">Imóvel removido</span>
              )}

              <span className="text-xs text-gray-400 mt-1">
                {new Date(notif.createdAt).toLocaleString('pt-MZ')}
              </span>
            </DropdownMenuItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}