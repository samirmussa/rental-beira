// components/SupportChatWidget.jsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { Mic, Headphones, Send, X, Bot, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useSession } from 'next-auth/react';

export default function SupportChatWidget() {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const [mensagens, setMensagens] = useState([]);
  const [texto, setTexto] = useState('');
  const [enviando, setEnviando] = useState(false);
  const scrollRef = useRef(null);

  const carregarMensagens = async () => {
    if (!session?.user?.id) return;
    try {
      const res = await fetch('/api/suporte/mensagens');
      if (res.ok) {
        const data = await res.json();
        setMensagens(data);
      }
    } catch (err) {
      console.error('Erro ao carregar mensagens:', err);
    }
  };

  const enviarMensagem = async () => {
    if (!texto.trim() || enviando) return;
    setEnviando(true);
    try {
      await fetch('/api/suporte/mensagens', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ texto }),
      });
      setTexto('');
      carregarMensagens();
    } catch (err) {
      alert('Erro ao enviar mensagem');
    } finally {
      setEnviando(false);
    }
  };

  useEffect(() => {
    if (open) carregarMensagens();
    const interval = open ? setInterval(carregarMensagens, 3000) : null;
    return () => clearInterval(interval);
  }, [open, session]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [mensagens]);

  if (!session || session.user.role !== 'proprietario') return null;

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
        <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></span>
      </button>

      {/* MODAL DO CHAT */}
      {open && (
        <div className="fixed bottom-24 right-6 w-80 h-96 bg-white rounded-xl shadow-2xl border flex flex-col z-50">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-xl">
            <div className="flex items-center gap-2">
              <Bot className="w-5 h-5" />
              <span className="font-semibold">Suporte ArrendaBeira</span>
            </div>
            <button onClick={() => setOpen(false)} className="hover:bg-white/20 rounded p-1">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Mensagens */}
          <ScrollArea className="flex-1 p-4">
            {mensagens.length === 0 ? (
              <p className="text-center text-gray-500 text-sm">Inicie a conversa!</p>
            ) : (
              mensagens.map((msg) => (
                <div
                  key={msg._id}
                  className={`mb-3 flex ${msg.remetente === 'proprietario' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs px-4 py-2 rounded-lg text-sm ${
                      msg.remetente === 'proprietario'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    <p>{msg.texto}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {new Date(msg.createdAt).toLocaleTimeString('pt-MZ', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))
            )}
            <div ref={scrollRef} />
          </ScrollArea>

          {/* Input */}
          <div className="p-3 border-t flex gap-2">
            <Input
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && enviarMensagem()}
              placeholder="Digite sua mensagem..."
              className="flex-1"
              disabled={enviando}
            />
            <Button
              onClick={enviarMensagem}
              disabled={enviando || !texto.trim()}
              size="icon"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </>
  );
}