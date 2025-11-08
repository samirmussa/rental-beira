// components/AdminSupportWidget.jsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { Mic, Headphones, Send, X, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { useSession } from 'next-auth/react';

export default function AdminSupportWidget() {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const [conversas, setConversas] = useState([]);
  const [conversaAtiva, setConversaAtiva] = useState(null);
  const [mensagens, setMensagens] = useState([]);
  const [texto, setTexto] = useState('');
  const [enviando, setEnviando] = useState(false);
  const scrollRef = useRef(null);

  const carregarConversas = async () => {
    if (!session?.user?.id) return;
    try {
      const res = await fetch('/api/suporte/admin/conversas');
      if (res.ok) {
        const data = await res.json();
        setConversas(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const carregarMensagens = async () => {
    if (!conversaAtiva) return;
    try {
      const res = await fetch(`/api/suporte/admin/chat/${conversaAtiva.proprietarioId}`);
      if (res.ok) {
        const data = await res.json();
        setMensagens(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const enviarMensagem = async () => {
    if (!texto.trim() || !conversaAtiva || enviando) return;
    setEnviando(true);
    try {
      await fetch(`/api/suporte/admin/chat/${conversaAtiva.proprietarioId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ texto }),
      });
      setTexto('');
      carregarMensagens();
    } catch (err) {
      alert('Erro ao enviar');
    } finally {
      setEnviando(false);
    }
  };

  useEffect(() => {
    if (open) {
      carregarConversas();
      const interval = setInterval(carregarConversas, 10000);
      return () => clearInterval(interval);
    }
  }, [open, session]);

  useEffect(() => {
    if (conversaAtiva) {
      carregarMensagens();
      const interval = setInterval(carregarMensagens, 3000);
      return () => clearInterval(interval);
    }
  }, [conversaAtiva]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [mensagens]);

  if (!session || session.user.role !== 'admin') return null;

  const naoLidasTotal = conversas.reduce((acc, c) => acc + c.naoLidas, 0);

  return (
    <>
      {/* BOTÃO FLUTUANTE */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full shadow-xl flex items-center justify-center text-white hover:scale-110 transition-all duration-200 z-50 group"
        aria-label="Abrir Suporte"
      >
        <div className="relative">
          <Headphones className="w-6 h-6 absolute -top-1 -left-1 opacity-70" />
          <Mic className="w-5 h-5" />
        </div>
        {naoLidasTotal > 0 && (
          <Badge className="absolute -top-2 -right-2 h-6 w-6 p-0 flex items-center justify-center text-xs bg-red-500">
            {naoLidasTotal}
          </Badge>
        )}
        <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></span>
      </button>

      {/* MODAL DO SUPORTE */}
      {open && (
        <div className="fixed bottom-24 right-6 w-96 h-96 bg-white rounded-xl shadow-2xl border flex flex-col z-50">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-xl">
            <h3 className="font-semibold">Suporte ao Proprietário</h3>
            <button onClick={() => setOpen(false)} className="hover:bg-white/20 rounded p-1">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex flex-1 overflow-hidden">
            {/* Lista de Conversas */}
            <div className={`border-r ${conversaAtiva ? 'w-1/3 hidden lg:block' : 'w-full'}`}>
              <ScrollArea className="h-full p-2">
                {conversas.length === 0 ? (
                  <p className="text-center text-gray-500 text-sm p-4">Nenhuma mensagem</p>
                ) : (
                  conversas.map((conv) => (
                    <button
                      key={conv.proprietarioId}
                      onClick={() => setConversaAtiva(conv)}
                      className={`w-full p-3 text-left rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-3 mb-1 ${
                        conversaAtiva?.proprietarioId === conv.proprietarioId ? 'bg-blue-50' : ''
                      }`}
                    >
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{conv.nome}</p>
                        <p className="text-xs text-gray-500 truncate">{conv.email}</p>
                      </div>
                      {conv.naoLidas > 0 && (
                        <Badge className="bg-red-500 text-white text-xs">{conv.naoLidas}</Badge>
                      )}
                    </button>
                  ))
                )}
              </ScrollArea>
            </div>

            {/* Chat */}
            {conversaAtiva && (
              <div className="flex-1 flex flex-col">
                <div className="p-3 border-b flex items-center gap-2 bg-gray-50">
                  <button onClick={() => setConversaAtiva(null)} className="lg:hidden">
                    <X className="w-4 h-4" />
                  </button>
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{conversaAtiva.nome}</p>
                    <p className="text-xs text-gray-500">{conversaAtiva.email}</p>
                  </div>
                </div>

                <ScrollArea className="flex-1 p-3">
                  {mensagens.map((msg) => (
                    <div
                      key={msg._id}
                      className={`mb-3 flex ${msg.remetente === 'admin' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs px-3 py-2 rounded-lg text-sm ${
                          msg.remetente === 'admin'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        <p>{msg.texto}</p>
                        <p className="text-xs opacity-70 mt-1">
                          {new Date(msg.createdAt).toLocaleTimeString('pt-MZ', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                    </div>
                  ))}
                  <div ref={scrollRef} />
                </ScrollArea>

                <div className="p-3 border-t flex gap-2">
                  <Input
                    value={texto}
                    onChange={(e) => setTexto(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && enviarMensagem()}
                    placeholder="Digite sua resposta..."
                    disabled={enviando}
                  />
                  <Button
                    onClick={enviarMensagem}
                    disabled={enviando || !texto.trim()}
                    size="icon"
                    className="bg-gradient-to-r from-blue-600 to-purple-600"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}