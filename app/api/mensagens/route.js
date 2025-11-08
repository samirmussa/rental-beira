// app/api/mensagens/route.js
import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Message from '@/models/Message';
import Property from '@/models/Property';
import { enviarEmailGmail } from '@/lib/email';

export async function POST(request) {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const { imovelId, texto, remetenteId } = await request.json();

    const novaMensagem = await Message.create({
      imovel: imovelId,
      texto,
      remetente: remetenteId,
    });

    const mensagem = await Message.findById(novaMensagem._id)
      .populate('remetente', 'nome email')
      .populate({
        path: 'imovel',
        populate: { path: 'proprietario', select: 'nome email' },
      })
      .lean();

    const imovel = mensagem.imovel;
    const proprietario = imovel.proprietario;
    const remetente = mensagem.remetente;

    // ENVIAR EMAIL AO PROPRIETÁRIO (GMAIL)
    await enviarEmailGmail({
      to: proprietario,
      imovel: {
        titulo: imovel.titulo,
        bairro: imovel.bairro,
        preco: imovel.preco,
      },
      remetente,
      mensagem: mensagem.texto,
    });

    return NextResponse.json({ success: true, mensagem });
  } catch (error) {
    console.error('Erro ao enviar mensagem/email:', error);
    return NextResponse.json({ error: 'Erro ao processar' }, { status: 500 });
  }
}