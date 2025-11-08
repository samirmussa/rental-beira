// app/api/favoritos/route.js
import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import User from '@/models/User';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });

  await mongoose.connect(process.env.MONGODB_URI);

  const user = await User.findById(session.user.id)
    .populate({
      path: 'favoritos',
      populate: { path: 'proprietario', select: 'nome' }
    })
    .lean();

  return NextResponse.json({ favoritos: user?.favoritos || [] });
}