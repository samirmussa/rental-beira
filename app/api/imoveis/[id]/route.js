// app/api/imoveis/[id]/route.js
import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Property from '@/models/Property';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth'

export async function DELETE(request, { params }) {
  try {
    const { id } = await params; // ← CORRIGIDO

    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'proprietario') {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    await mongoose.connect(process.env.MONGODB_URI);
    const imovel = await Property.findById(id);

    if (!imovel) {
      return NextResponse.json({ error: 'Imóvel não encontrado' }, { status: 404 });
    }

    if (imovel.proprietario.toString() !== session.user.id) {
      return NextResponse.json({ error: 'Você não é o dono' }, { status: 403 });
    }

    await Property.findByIdAndDelete(id);
    return NextResponse.json({ message: 'Excluído com sucesso' });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}