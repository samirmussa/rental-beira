// components/DeletePropertyButton.jsx
'use client';

import { useState } from 'react';
import { Trash2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { deleteProperty } from '@/app/actions/deleteProperty';
import { toast } from 'sonner'; // ou useToast se usar shadcn

export default function DeletePropertyButton({ imovelId }) {
  const [loading, setLoading] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm) {
      setConfirm(true);
      setTimeout(() => setConfirm(false), 3000); // Cancela em 3s
      return;
    }

    setLoading(true);
    const result = await deleteProperty(imovelId);

    if (result.success) {
      toast.success(result.message);
      router.refresh(); // Atualiza a página
    } else {
      toast.error(result.message);
    }
    setLoading(false);
    setConfirm(false);
  };

  return (
    <Button
      size="icon"
      variant={confirm ? 'destructive' : 'ghost'}
      onClick={handleDelete}
      disabled={loading}
      className="text-red-600 hover:text-red-700"
    >
      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
      {confirm && <span className="ml-2">Confirmar?</span>}
    </Button>
  );
}