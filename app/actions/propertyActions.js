// app/actions/propertyActions.js
'use server';

import mongoose from 'mongoose';
import Property from '@/models/Property';
import { revalidatePath } from 'next/cache';

export async function updateStatus(imovelId, novoStatus) {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    await Property.findByIdAndUpdate(imovelId, { status: novoStatus });
    revalidatePath('/proprietarios');
    return { success: true };
  } catch (error) {
    console.error('Erro ao atualizar status:', error);
    return { success: false, error: 'Erro ao atualizar status do imóvel' };
  }
}