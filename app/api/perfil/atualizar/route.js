// app/api/perfil/atualizar/route.js
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import User from '@/models/User';
import mongoose from 'mongoose';

export async function POST(request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });

  const { nome, email, telefone } = await request.json();
  await mongoose.connect(process.env.MONGODB_URI);

  await User.findByIdAndUpdate(session.user.id, { nome, email, telefone });

  return NextResponse.json({ success: true });
}