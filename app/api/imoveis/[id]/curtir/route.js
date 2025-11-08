// app/api/imoveis/[id]/curtir/route.js
import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Property from '@/models/Property';
import User from '@/models/User';
import Notificacao from '@/models/Notificacao';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });

    const { id } = await params; // ← [id] da URL
    await mongoose.connect(process.env.MONGODB_URI);

    const userId = session.user.id;
    const imovel = await Property.findById(id).populate('proprietario');
    if (!imovel) return NextResponse.json({ error: 'Imóvel não encontrado' }, { status: 404 });

    // Evita proprietário curtir próprio imóvel
    if (imovel.proprietario._id.toString() === userId) {
      return NextResponse.json({ error: 'Não pode curtir próprio imóvel' }, { status: 400 });
    }

    // GARANTE ARRAY
    if (!Array.isArray(imovel.usuariosCurtiram)) {
      imovel.usuariosCurtiram = [];
    }

    const jaCurtiu = imovel.usuariosCurtiram.some(uid => uid.toString() === userId);

    if (jaCurtiu) {
      // DESCURTIR
      imovel.curtidas -= 1;
      imovel.usuariosCurtiram = imovel.usuariosCurtiram.filter(uid => uid.toString() !== userId);
      await User.findByIdAndUpdate(userId, { $pull: { favoritos: id } });
    } else {
      // CURTIR
      imovel.curtidas += 1;
      imovel.usuariosCurtiram.push(userId);
      await User.findByIdAndUpdate(userId, { $addToSet: { favoritos: id } });

      // NOTIFICAÇÃO
      await Notificacao.create({
        tipo: 'curtida',
        mensagem: `${session.user.name} curtiu seu imóvel "${imovel.titulo}"`,
        imovel: id,
        remetente: userId,
        destinatario: imovel.proprietario._id,
        lida: false,
      });
    }

    await imovel.save();

    return NextResponse.json({
      curtidas: imovel.curtidas,
      curtido: !jaCurtiu,
    });
  } catch (error) {
    console.error('Erro ao curtir:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}