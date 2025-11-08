'use client';

import { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Trash2, Send, MessageCircle } from 'lucide-react';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog';

export default function ChatBox({ imovelId, proprietarioNome, proprietarioId }) {
  const { data: session } = useSession();
  const [mensagens, setMensagens] = useState([]);
  const [novaMensagem, setNovaMensagem] = useState('');
  const [loading, setLoading] = useState(false);
  const [apagarOpen, setApagarOpen] = useState(false);
  const scrollRef = useRef(null);
  const eventSourceRef = useRef(null);

  const userId = session?.user?.id;
  const isArrendatario = session?.user?.role === 'arrendatario';
  const isProprietario = session?.user?.role === 'proprietario' && session?.user?.id === proprietarioId;

  // HOOK 1: SSE + MENSAGENS INICIAIS
  useEffect(() => {
    if (!imovelId || !userId) return;

    const eventSource = new EventSource(`/api/chat/${imovelId}?userId=${userId}`);
    eventSourceRef.current = eventSource;

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (Array.isArray(data)) {
          setMensagens(data);
        } else if (data._id) {
          setMensagens((prev) => [...prev, data]);
        }
      } catch (error) {
        console.error('Erro ao processar SSE:', error);
      }
    };

    eventSource.onerror = () => {
      console.error('SSE Error');
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, [imovelId, userId]);

  // HOOK 2: SCROLL AUTOMÁTICO
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [mensagens]);

  // FUNÇÃO: Enviar mensagem
  const enviarMensagem = async () => {
    if (!novaMensagem.trim() || loading) return;
    setLoading(true);

    try {
      const res = await fetch(`/api/chat/${imovelId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ texto: novaMensagem }),
      });

      if (res.ok) {
        setNovaMensagem('');
      } else {
        console.error('Falha ao enviar');
      }
    } catch (error) {
      console.error('Erro:', error);
    } finally {
      setLoading(false);
    }
  };

  // FUNÇÃO: Apagar conversa
  const apagarConversa = async () => {
    try {
      const res = await fetch(`/api/chat/${imovelId}`, { method: 'DELETE' });
      if (res.ok) {
        setMensagens([]);
        setApagarOpen(false);
      }
    } catch (error) {
      console.error('Erro ao apagar:', error);
    }
  };

  // 🧠 Render condicional seguro — sem violar as regras dos Hooks
  if (!session) {
    return (
      <p className="text-center text-gray-500 mt-4">
        Faça login para visualizar o chat.
      </p>
    );
  }

  if (!isArrendatario && !isProprietario) {
    return (
      <p className="text-center text-gray-500 mt-4">
        Você não tem permissão para acessar este chat.
      </p>
    );
  }

  return (
    <>
      <Card className="mt-8 shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <div className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-blue-600" />
            <CardTitle className="text-lg">
              Chat com {isArrendatario ? proprietarioNome : 'Arrendatário'}
            </CardTitle>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setApagarOpen(true)}
            className="text-red-500 hover:text-red-700"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-64 pr-4 mb-4">
            {mensagens.length === 0 ? (
              <p className="text-center text-gray-500 py-8">
                Nenhuma mensagem ainda. Inicie a conversa!
              </p>
            ) : (
              mensagens.map((msg) => (
                <div
                  key={msg._id}
                  className={`flex gap-3 mb-4 ${msg.remetente._id === userId ? 'flex-row-reverse' : ''}`}
                >
                  <Avatar className="w-8 h-8">
                    <AvatarFallback>
                      {msg.remetente.nome[0].toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div
                    className={`max-w-xs px-4 py-2 rounded-lg ${
                      msg.remetente._id === userId
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    <p className="text-sm">{msg.texto}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {format(new Date(msg.createdAt), 'HH:mm')}
                    </p>
                  </div>
                </div>
              ))
            )}
            <div ref={scrollRef} />
          </ScrollArea>

          <div className="flex gap-2">
            <Input
              value={novaMensagem}
              onChange={(e) => setNovaMensagem(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && enviarMensagem()}
              placeholder="Digite sua mensagem..."
              disabled={loading}
            />
            <Button onClick={enviarMensagem} disabled={loading || !novaMensagem.trim()}>
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={apagarOpen} onOpenChange={setApagarOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Apagar conversa?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={apagarConversa} className="bg-red-600">
              Apagar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
