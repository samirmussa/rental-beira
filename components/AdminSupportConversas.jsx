// components/AdminSupportConversas.jsx
'use client';

import { useState, useEffect } from 'react';
import { MessageCircle, User } from 'lucide-react';

export default function AdminSupportConversas({ onSelect }) {
  const [conversas, setConversas] = useState([]);
  const [loading, setLoading] = useState(true);

  const carregar = async () => {
    try {
      const res = await fetch('/api/suporte/admin/conversas');
      if (res.ok) {
        const data = await res.json();
        setConversas(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregar();
    const interval = setInterval(carregar, 10000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <p className="text-center text-gray-500 text-sm">Carregando...</p>;

  return (
    <div className="space-y-2">
      {conversas.length === 0 ? (
        <p className="text-center text-gray-500 text-sm">Nenhuma mensagem</p>
      ) : (
        conversas.map((conv) => (
          <button
            key={conv.proprietarioId}
            onClick={() => onSelect(conv)}
            className="w-full p-3 text-left rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-3 border"
          >
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate">{conv.nome}</p>
              <p className="text-xs text-gray-500 truncate">{conv.email}</p>
            </div>
            {conv.naoLidas > 0 && (
              <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                {conv.naoLidas}
              </span>
            )}
          </button>
        ))
      )}
    </div>
  );
}