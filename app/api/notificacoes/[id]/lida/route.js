// app/api/notificacoes/[id]/lida/route.js
import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Notificacao from '@/models/Notificacao';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(request, { params }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });

  const { id } = await params;
  await mongoose.connect(process.env.MONGODB_URI);

  await Notificacao.findOneAndUpdate(
    { _id: id, destinatario: session.user.id },
    { lida: true }
  );

  return NextResponse.json({ success: true });
}