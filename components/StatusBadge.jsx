// components/StatusBadge.jsx
import { Badge } from '@/components/ui/badge';
import { Check, X, Clock, Wrench } from 'lucide-react';

const statusConfig = {
  disponivel: { label: 'Disponível', color: 'bg-green-500', icon: Check },
  arrendado: { label: 'Arrendado', color: 'bg-red-500', icon: X },
  negociacao: { label: 'Em Negociação', color: 'bg-yellow-500', icon: Clock },
  manutencao: { label: 'Em Manutenção', color: 'bg-gray-500', icon: Wrench },
};

export default function StatusBadge({ status }) {
  const config = statusConfig[status] || statusConfig.disponivel;
  const Icon = config.icon;

  return (
    <Badge className={`${config.color} text-white flex items-center gap-1`}>
      <Icon className="w-3 h-3" />
      {config.label}
    </Badge>
  );
}