// components/EmailButtonGmail.jsx
'use client';

import { Button } from '@/components/ui/button';
import { Mail, CheckCircle } from 'lucide-react';
import { useState } from 'react';

export default function EmailButtonGmail({ mensagemId }) {
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);

  const reenviar = async () => {
    setEnviando(true);
    try {
      const res = await fetch('/api/proprietario/reenviar-gmail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mensagemId }),
      });
      if (res.ok) {
        setEnviado(true);
        setTimeout(() => setEnviado(false), 3000);
      } else {
        alert('Erro ao reenviar email');
      }
    } catch (err) {
      alert('Falha na conexão');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <Button
      size="sm"
      variant={enviado ? "default" : "outline"}
      onClick={reenviar}
      disabled={enviando}
      className="flex items-center gap-1 text-xs h-8"
    >
      {enviado ? (
        <>
          <CheckCircle className="w-3 h-3" />
          Enviado!
        </>
      ) : (
        <>
          <Mail className="w-3 h-3" />
          {enviando ? 'Enviando...' : 'Reenviar'}
        </>
      )}
    </Button>
  );
}