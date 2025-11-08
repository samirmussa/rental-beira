import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import mongoose from 'mongoose';
import Property from '@/models/Property';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });

    await mongoose.connect(process.env.MONGODB_URI);
    const data = await request.json();

    const property = await Property.create({
      ...data,
      proprietario: new mongoose.Types.ObjectId(session.user.id),
    });

    return NextResponse.json(property, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const properties = await Property.find({ disponivel: true })
      .populate('proprietario', 'nome telefone')
      .sort({ createdAt: -1 });

    return NextResponse.json(properties);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}