// app/api/imoveis/[id]/status/route.js
import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Property from '@/models/Property';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function PATCH(request, { params }) {
  const { id } = await params;
  const { status } = await request.json();
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'proprietario') {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

  await mongoose.connect(process.env.MONGODB_URI);

  const imovel = await Property.findById(id);
  if (imovel.proprietario.toString() !== session.user.id) {
    return NextResponse.json({ error: 'Não é seu imóvel' }, { status: 403 });
  }

  imovel.status = status;
  await imovel.save();

  return NextResponse.json({ status: imovel.status });
}