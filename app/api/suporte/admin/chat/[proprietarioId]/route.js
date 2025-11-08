// app/api/suporte/admin/chat/[proprietarioId]/route.js
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import mongoose from 'mongoose';
import SupportMessage from '@/models/SupportMessage';

export async function GET(request, { params }) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

  // AWAIT NO PARAMS
  const { proprietarioId } = await params;

  try {
    await mongoose.connect(process.env.MONGODB_URI);

    const mensagens = await SupportMessage.find({ proprietario: proprietarioId })
      .sort({ createdAt: 1 })
      .lean();

    // Marcar como lidas
    await SupportMessage.updateMany(
      { proprietario: proprietarioId, remetente: 'proprietario', lida: false },
      { lida: true }
    );

    return NextResponse.json(mensagens.map(m => ({
      ...m,
      _id: m._id.toString(),
      proprietario: m.proprietario.toString(),
    })));
  } catch (error) {
    console.error('Erro no GET chat:', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}

export async function POST(request, { params }) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

  // AWAIT NO PARAMS
  const { proprietarioId } = await params;
  const { texto } = await request.json();

  try {
    await mongoose.connect(process.env.MONGODB_URI);

    const novaMensagem = await SupportMessage.create({
      proprietario: proprietarioId,
      admin: session.user.id,
      texto,
      remetente: 'admin',
    });

    return NextResponse.json({ _id: novaMensagem._id.toString() });
  } catch (error) {
    console.error('Erro no POST chat:', error);
    return NextResponse.json({ error: 'Erro ao enviar' }, { status: 500 });
  }
}