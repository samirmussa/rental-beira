// components/AvaliacaoCard.jsx
'use client';

import { Star, MessageCircle } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';

export default function AvaliacaoCard({ avaliacao, isProprietario, imovelId, onResposta }) {
  const [resposta, setResposta] = useState('');
  const [enviando, setEnviando] = useState(false);

  const enviarResposta = async () => {
    setEnviando(true);
    await fetch(`/api/imoveis/${imovelId}/avaliacoes/${avaliacao._id}/resposta`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ resposta }),
    });
    router.refresh()
    onResposta();
    setResposta('');
    setEnviando(false);
  };

  return (
    <div className="border rounded-lg p-4 mb-4 bg-white shadow-sm">
      <div className="flex items-start gap-3">
        <Avatar>
          <AvatarImage src={avaliacao.arrendatario.imagem} />
          <AvatarFallback>{avaliacao.anonimo ? '?' : avaliacao.arrendatario.nome[0]}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <p className="font-medium">
              {avaliacao.anonimo ? 'Anônimo' : avaliacao.arrendatario.nome}
            </p>
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${i < avaliacao.nota ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                />
              ))}
            </div>
          </div>
          {avaliacao.comentario && (
            <p className="text-gray-700 text-sm mb-2">{avaliacao.comentario}</p>
          )}
          <p className="text-xs text-gray-500">
            {new Date(avaliacao.createdAt).toLocaleDateString('pt-MZ')}
          </p>

          {/* Resposta do proprietário */}
          {avaliacao.resposta && (
            <div className="mt-3 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm font-medium text-blue-900 mb-1">Resposta do proprietário:</p>
              <p className="text-sm text-blue-800">{avaliacao.resposta}</p>
            </div>
          )}

          {/* Formulário de resposta */}
          {isProprietario && !avaliacao.resposta && (
            <div className="mt-3 flex gap-2">
              <Textarea
                placeholder="Responder à avaliação..."
                value={resposta}
                onChange={(e) => setResposta(e.target.value)}
                rows={2}
              />
              <Button onClick={enviarResposta} disabled={enviando || !resposta.trim()}>
                <MessageCircle className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}