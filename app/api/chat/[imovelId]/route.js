// app/api/chat/[imovelId]/route.js
import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Message from '@/models/Message';
import Chat from '@/models/Chat';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(request, { params }) {
  const { imovelId } = await params;
  const session = await getServerSession(authOptions);
  if (!session) return new Response('Não autorizado', { status: 401 });

  await mongoose.connect(process.env.MONGODB_URI);

  const headers = {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
  };

  const stream = new ReadableStream({
    async start(controller) {
      const send = (data) => {
        controller.enqueue(`data: ${JSON.stringify(data)}\n\n`);
      };

      // MENSAGENS INICIAIS
      const mensagens = await Message.find({ imovel: imovelId })
        .sort({ createdAt: 1 })
        .populate('remetente', 'nome')
        .lean();
      send(mensagens);

      // ESCUTA NOVAS
      const changeStream = Message.watch([
        { $match: { 'fullDocument.imovel': new mongoose.Types.ObjectId(imovelId) } }
      ]);

      changeStream.on('change', async (change) => {
        if (change.operationType === 'insert') {
          const msg = await Message.findById(change.fullDocument._id)
            .populate('remetente', 'nome')
            .lean();
          send(msg); // ENVIA OBJETO ÚNICO
        }
      });

      request.signal.addEventListener('abort', () => {
        changeStream.close();
        controller.close();
      });
    }
  });

  return new Response(stream, { headers });
}

export async function POST(request, { params }) {
  const { imovelId } = await params;
  const { texto } = await request.json();
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });

  await mongoose.connect(process.env.MONGODB_URI);

  const novaMsg = await Message.create({
    imovel: imovelId,
    remetente: session.user.id,
    texto,
  });

  const msgPopulada = await Message.findById(novaMsg._id)
    .populate('remetente', 'nome')
    .lean();

  return NextResponse.json(msgPopulada);
}

export async function DELETE(request, { params }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });

  const { imovelId } = await params;
  await mongoose.connect(process.env.MONGODB_URI);

  const chat = await Chat.findOne({ imovel: imovelId });
  if (!chat) return NextResponse.json({ error: 'Chat não encontrado' }, { status: 404 });

  if (
    chat.arrendatario.toString() !== session.user.id &&
    chat.proprietario.toString() !== session.user.id
  ) {
    return NextResponse.json({ error: 'Acesso negado' }, { status: 403 });
  }

  await Message.deleteMany({ imovel: imovelId });
  await Chat.deleteOne({ _id: chat._id });

  return NextResponse.json({ success: true });
}