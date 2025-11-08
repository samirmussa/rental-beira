// app/api/admin/stats/route.js
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import mongoose from 'mongoose';
import Property from '@/models/Property';
import User from '@/models/User';
import Message from '@/models/Message';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI);

    const [
      totalImoveis,
      totalUsuarios,
      totalMensagens,
      imoveisCurtidos,
      imoveisPopulares,
      usuariosRecentes
    ] = await Promise.all([
      Property.countDocuments(),
      User.countDocuments(),
      Message.countDocuments(),
      Property.countDocuments({ curtidas: { $gt: 0 } }),
      Property.find()
        .sort({ curtidas: -1, visualizacoes: -1 })
        .limit(5)
        .select('titulo curtidas visualizacoes')
        .lean(),
      User.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .select('nome email role createdAt')
        .lean(),
    ]);

    return NextResponse.json({
      stats: { totalImoveis, totalUsuarios, totalMensagens, imoveisCurtidos },
      imoveisPopulares: imoveisPopulares.map(i => ({
        _id: i._id.toString(),
        titulo: i.titulo,
        curtidas: i.curtidas || 0,
        visualizacoes: i.visualizacoes || 0,
      })),
      usuariosRecentes: usuariosRecentes.map(u => ({
        _id: u._id.toString(),
        nome: u.nome,
        email: u.email,
        role: u.role,
        createdAt: u.createdAt?.toISOString() || null,
      })),
    });
  } catch (error) {
    console.error('Erro no admin stats:', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}