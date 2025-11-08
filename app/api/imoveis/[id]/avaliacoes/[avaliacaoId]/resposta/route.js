// app/api/imoveis/[id]/avaliacoes/[avaliacaoId]/resposta/route.js
import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Avaliacao from '@/models/Avaliacao';
import Property from '@/models/Property';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(request, { params }) {
  const { id, avaliacaoId } = await params;
  const { resposta } = await request.json();
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'proprietario') {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

  await mongoose.connect(process.env.MONGODB_URI);

  const imovel = await Property.findById(id);
  if (imovel.proprietario.toString() !== session.user.id) {
    return NextResponse.json({ error: 'Você não é o dono' }, { status: 403 });
  }

  const atualizada = await Avaliacao.findByIdAndUpdate(
    avaliacaoId,
    { resposta, dataResposta: new Date() },
    { new: true }
  ).populate('arrendatario', 'nome imagem');

  return NextResponse.json(atualizada);
}