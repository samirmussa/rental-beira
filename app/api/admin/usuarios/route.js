// app/api/admin/usuarios/route.js
import { NextResponse } from 'next/server';
import User from '@/models/User';
import mongoose from 'mongoose';

export async function GET() {
  await mongoose.connect(process.env.MONGODB_URI);
  const usuarios = await User.find().select('nome email role verified').lean();
  return NextResponse.json(usuarios);
}