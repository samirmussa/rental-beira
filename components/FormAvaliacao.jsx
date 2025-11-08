'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Star, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

export default function FormAvaliacao({ imovelId }) {
  const [nota, setNota] = useState(0);
  const [comentario, setComentario] = useState('');
  const [anonimo, setAnonimo] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const router = useRouter();

  const enviar = async () => {
    if (nota === 0) return alert('Selecione uma nota');
    setEnviando(true);
    const res = await fetch(`/api/imoveis/${imovelId}/avaliacoes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nota, comentario, anonimo }),
    });
    if (res.ok) {
      router.refresh(); // ← RECARREGA DADOS
    }
    setEnviando(false);
  };

  return (
    <div className="border rounded-lg p-6 bg-white shadow-md">
      <h3 className="text-lg font-semibold mb-4">Avalie este imóvel</h3>
      <div className="flex gap-1 mb-4">
        {[...Array(5)].map((_, i) => (
          <button
            key={i}
            onClick={() => setNota(i + 1)}
            className="transition-transform hover:scale-110"
          >
            <Star
              className={`w-8 h-8 ${i < nota ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
            />
          </button>
        ))}
      </div>
      <Textarea
        placeholder="Escreva seu comentário (opcional)..."
        value={comentario}
        onChange={(e) => setComentario(e.target.value)}
        rows={3}
        className="mb-3"
      />
      <div className="flex items-center gap-2 mb-4">
        <Checkbox id="anonimo" checked={anonimo} onCheckedChange={setAnonimo} />
        <Label htmlFor="anonimo">Avaliar como anônimo</Label>
      </div>
      <Button onClick={enviar} disabled={enviando} className="w-full">
        <Send className="w-4 h-4 mr-2" /> Enviar Avaliação
      </Button>
    </div>
  );
}