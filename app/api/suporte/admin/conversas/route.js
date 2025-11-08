// app/api/suporte/admin/conversas/route.js
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import mongoose from 'mongoose';
import SupportMessage from '@/models/SupportMessage';
import User from '@/models/User';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI);

    const conversas = await SupportMessage.aggregate([
      {
        $match: { remetente: 'proprietario' } // Só mensagens do proprietário
      },
      {
        $group: {
          _id: '$proprietario',
          ultimaMensagem: { $last: '$createdAt' },
          naoLidas: {
            $sum: { $cond: [{ $eq: ['$lida', false] }, 1, 0] }
          }
        }
      },
      { $sort: { ultimaMensagem: -1 } },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'proprietario'
        }
      },
      { $unwind: '$proprietario' },
      {
        $project: {
          proprietarioId: '$_id',
          nome: '$proprietario.nome',
          email: '$proprietario.email',
          ultimaMensagem: 1,
          naoLidas: 1
        }
      }
    ]);

    return NextResponse.json(conversas);
  } catch (error) {
    console.error('Erro ao carregar conversas:', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}