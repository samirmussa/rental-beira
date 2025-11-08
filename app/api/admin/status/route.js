// app/api/admin/stats/route.js
import { NextResponse } from 'next/server';
import User from '@/models/User';
import Property from '@/models/Property';
import Message from '@/models/Message';
import mongoose from 'mongoose';

export async function GET() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    const totalUsuarios = await User.countDocuments();
    const totalImoveis = await Property.countDocuments();
    const totalMensagens = await Message.countDocuments();
    const imoveisCurtidos = await Property.countDocuments({ curtidas: { $gt: 0 } });

    const imoveisPopulares = await Property.find()
      .sort({ curtidas: -1, visualizacoes: -1 })
      .limit(5)
      .select('titulo curtidas visualizacoes')
      .lean();

    const usuariosRecentes = await User.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('nome email role createdAt')
      .lean();

    return NextResponse.json({
      stats: { totalUsuarios, totalImoveis, totalMensagens, imoveisCurtidos },
      imoveisPopulares,
      usuariosRecentes,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}