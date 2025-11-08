// app/api/admin/imoveis/route.js
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import mongoose from 'mongoose';
import Property from '@/models/Property';

export async function GET(request) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'admin') return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const page = Number(searchParams.get('page')) || 1;
  const limit = Number(searchParams.get('limit')) || 10;
  const search = searchParams.get('search') || '';
  const status = searchParams.get('status') || 'todos';
  const tipo = searchParams.get('tipo') || 'todos';

  await mongoose.connect(process.env.MONGODB_URI);

  const filter = {};
  if (search) {
    filter.$or = [
      { titulo: { $regex: search, $options: 'i' } },
      { bairro: { $regex: search, $options: 'i' } },
    ];
  }
  if (status !== 'todos') filter.status = status;
  if (tipo !== 'todos') filter.tipo = tipo;

  const total = await Property.countDocuments(filter);
  const imoveis = await Property.find(filter)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .populate('proprietario', 'nome email')
    .lean();

  return NextResponse.json({ imoveis: imoveis.map(i => ({ ...i, _id: i._id.toString() })), total });
}