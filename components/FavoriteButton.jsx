// components/FavoriteButton.jsx
'use client';

import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSession } from 'next-auth/react';

export default function FavoriteButton({ imovelId, initialCurtidas = 0, initialCurtido = false }) {
  const { data: session, status } = useSession();
  const [curtidas, setCurtidas] = useState(initialCurtidas);
  const [curtido, setCurtido] = useState(initialCurtido);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setCurtido(initialCurtido);
    setCurtidas(initialCurtidas);
  }, [initialCurtido, initialCurtidas]);

  const toggleCurtida = async () => {
    if (status !== 'authenticated') {
      alert('Faça login para curtir');
      return;
    }

    setLoading(true);
    const res = await fetch(`/api/imoveis/${imovelId}/curtir`, {
      method: 'POST',
    });

    if (res.ok) {
      const data = await res.json();
      setCurtidas(data.curtidas);
      setCurtido(data.curtido);
    }
    setLoading(false);
  };

  return (
    <Button
      onClick={toggleCurtida}
      disabled={loading}
      variant="ghost"
      size="sm"
      className={`flex items-center gap-1 ${curtido ? 'text-red-500' : 'text-gray-500'}`}
    >
      <Heart className={`w-5 h-5 ${curtido ? 'fill-red-500' : ''}`} />
      <span>{curtidas}</span>
    </Button>
  );
}