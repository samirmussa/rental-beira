// app/api/admin/register/route.js
import { NextResponse } from 'next/server';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';

export async function POST(request) {
  try {
    const { nome, email, senha, telefone, secret } = await request.json();

    // Proteção opcional com senha secreta
    const ADMIN_SECRET = process.env.ADMIN_SECRET || 'beira2025';
    if (secret !== ADMIN_SECRET) {
      return NextResponse.json({ error: 'Acesso negado' }, { status: 403 });
    }

    await mongoose.connect(process.env.MONGODB_URI);

    const existing = await User.findOne({ email });
    if (existing) {
      return NextResponse.json({ error: 'Admin já existe' }, { status: 400 });
    }

    const hashed = await bcrypt.hash(senha, 10);

    const admin = await User.create({
      nome,
      email,
      senha: hashed,
      telefone,
      role: 'admin',
      verified: true,
    });

    return NextResponse.json({
      success: true,
      message: 'Admin criado com sucesso!',
      admin: { nome: admin.nome, email: admin.email }
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}