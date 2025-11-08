// app/api/admin/imoveis/rejeitar/route.js
import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Property from '@/models/Property';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(request) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

  const formData = await request.formData();
  const id = formData.get('id');

  await mongoose.connect(process.env.MONGODB_URI);
  await Property.findByIdAndDelete(id); // ou status: 'rejeitado'

  return NextResponse.redirect(new URL('/admin/dashboard', request.url));
}