// app/api/suporte/mensagens/route.js
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import mongoose from 'mongoose';
import SupportMessage from '@/models/SupportMessage';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'proprietario') {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

  await mongoose.connect(process.env.MONGODB_URI);

  const mensagens = await SupportMessage.find({
    proprietario: session.user.id,
  })
    .sort({ createdAt: 1 })
    .lean();

  return NextResponse.json(mensagens.map(m => ({
    ...m,
    _id: m._id.toString(),
  })));
}
export async function POST(request) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'proprietario') {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

  await mongoose.connect(process.env.MONGODB_URI);
  const { texto } = await request.json();

  const novaMensagem = await SupportMessage.create({
    proprietario: session.user.id,
    texto,
    remetente: 'proprietario',
  });

  return NextResponse.json({ _id: novaMensagem._id.toString() });
}