// app/api/auth/register/route.js
import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export async function POST(request) {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    const { nome, email, senha, telefone, role } = await request.json();

    if (!nome || !email || !senha || !role) {
      return NextResponse.json({ error: 'Preencha todos os campos obrigatórios' }, { status: 400 });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: 'Email já cadastrado' }, { status: 400 });
    }

    const hashedPassword = bcrypt.hashSync(senha, 10);

    await User.create({
      nome,
      email,
      senha: hashedPassword,
      telefone,
      role,
    });

    return NextResponse.json({ message: 'Usuário criado com sucesso' }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}