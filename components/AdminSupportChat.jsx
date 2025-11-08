// components/AdminSupportChat.jsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { Send, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function AdminSupportChat({ conversa, onBack }) {
  const [mensagens, setMensagens] = useState([]);
  const [texto, setTexto] = useState('');
  const [enviando, setEnviando] = useState(false);
  const scrollRef = useRef(null);

  const carregar = async () => {
    const res = await fetch(`/api/suporte/admin/chat/${conversa.proprietarioId}`);
    if (res.ok) {
      const data = await res.json();
      setMensagens(data);
    }
  };

  const enviar = async () => {
    if (!texto.trim() || enviando) return;
    setEnviando(true);
    await fetch(`/api/suporte/admin/chat/${conversa.proprietarioId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ texto }),
    });
    setTexto('');
    carregar();
    setEnviando(false);
  };

  useEffect(() => {
    if (conversa) carregar();
    const interval = conversa ? setInterval(carregar, 3000) : null;
    return () => clearInterval(interval);
  }, [conversa]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [mensagens]);

  if (!conversa) return null;

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b flex items-center gap-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <button onClick={onBack} className="lg:hidden">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h3 className="font-semibold truncate">{conversa.nome}</h3>
      </div>

      <ScrollArea className="flex-1 p-4">
        {mensagens.map((msg) => (
          <div
            key={msg._id}
            className={`mb-3 flex ${msg.remetente === 'admin' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs px-4 py-2 rounded-lg text-sm ${
                msg.remetente === 'admin'
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
        ))}
        <div ref={scrollRef} />
      </ScrollArea>

      <div className="p-3 border-t flex gap-2">
        <Input
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && enviar()}
          placeholder="Digite sua resposta..."
          disabled={enviando}
        />
        <Button
          onClick={enviar}
          disabled={enviando || !texto.trim()}
          size="icon"
          className="bg-gradient-to-r from-blue-600 to-purple-600"
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}