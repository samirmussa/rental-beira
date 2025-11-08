// app/api/notificacoes/route.js
import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Notificacao from '@/models/Notificacao';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });

  await mongoose.connect(process.env.MONGODB_URI);

  const notificacoes = await Notificacao.find({ destinatario: session.user.id })
    .populate('remetente', 'nome')
    .populate('imovel', 'titulo')
    .sort({ createdAt: -1 })
    .limit(20)
    .lean();

  // REMOVER NOTIFICAÇÕES COM IMÓVEL APAGADO
  const validas = notificacoes.filter(n => n.imovel !== null);

  const naoLidas = validas.filter(n => !n.lida).length;

  return NextResponse.json({ notificacoes: validas, naoLidas });
}