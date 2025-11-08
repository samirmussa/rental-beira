// app/api/proprietario/reenviar-gmail/route.js
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import mongoose from 'mongoose';
import Message from '@/models/Message';
import { enviarEmailGmail } from '@/lib/email';

export async function POST(request) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'proprietario') {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

  await mongoose.connect(process.env.MONGODB_URI);
  const { mensagemId } = await request.json();

  const mensagem = await Message.findById(mensagemId)
    .populate('remetente', 'nome email')
    .populate({
      path: 'imovel',
      populate: { path: 'proprietario', select: 'nome email' },
    })
    .lean();

  if (!mensagem || mensagem.imovel.proprietario._id.toString() !== session.user.id) {
    return NextResponse.json({ error: 'Acesso negado' }, { status: 403 });
  }

  await enviarEmailGmail({
    to: mensagem.imovel.proprietario,
    imovel: mensagem.imovel,
    remetente: mensagem.remetente,
    mensagem: mensagem.texto,
  });

  return NextResponse.json({ success: true });
}