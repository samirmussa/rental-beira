// app/api/imoveis/[id]/avaliacoes/route.js
import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Avaliacao from '@/models/Avaliacao';
import Property from '@/models/Property';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(request, { params }) {
  const { id } = await params;
  await mongoose.connect(process.env.MONGODB_URI);

  const avaliacoes = await Avaliacao.find({ imovel: id })
    .sort({ createdAt: -1 })
    .populate('arrendatario', 'nome imagem')
    .lean();

  const total = avaliacoes.length;
  const media = total > 0
    ? avaliacoes.reduce((acc, a) => acc + a.nota, 0) / total
    : 0;

  return NextResponse.json({ avaliacoes, media: media.toFixed(1), total });
}

export async function POST(request, { params }) {
  const { id } = await params;
  const { nota, comentario, anonimo } = await request.json();
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'arrendatario') {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

  await mongoose.connect(process.env.MONGODB_URI);

  // Verifica se já avaliou
  const jaAvaliou = await Avaliacao.findOne({ imovel: id, arrendatario: session.user.id });
  if (jaAvaliou) return NextResponse.json({ error: 'Você já avaliou este imóvel' }, { status: 400 });

  const nova = await Avaliacao.create({
    imovel: id,
    arrendatario: session.user.id,
    nota,
    comentario,
    anonimo,
  });

  const avaliacao = await Avaliacao.findById(nova._id)
    .populate('arrendatario', 'nome imagem')
    .lean();

  return NextResponse.json(avaliacao);
}