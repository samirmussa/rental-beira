// app/api/admin/imoveis/[id]/status/route.js
import { NextResponse } from 'next/server';
import Property from '@/models/Property';
import mongoose from 'mongoose';

export async function POST(request, { params }) {
  try {
    const { id } = params;
    const { novoStatus } = await request.json();

    await mongoose.connect(process.env.MONGODB_URI);
    const imovel = await Property.findById(id);
    if (!imovel) return NextResponse.json({ error: 'Imóvel não encontrado' }, { status: 404 });

    imovel.status = novoStatus;
    await imovel.save();

    return NextResponse.json({ success: true, status: imovel.status });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}