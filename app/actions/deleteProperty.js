// app/actions/deleteProperty.js
'use server';

import { revalidatePath } from 'next/cache';
import mongoose from 'mongoose';
import Property from '@/models/Property';
import Message from '@/models/Message';

export async function deleteProperty(imovelId) {
  'use server';
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    const deleted = await Property.findByIdAndDelete(imovelId);
    if (!deleted) throw new Error('Imóvel não encontrado');

    // Excluir mensagens relacionadas
    await Message.deleteMany({ imovel: imovelId });

    revalidatePath('/proprietario');
    return { success: true, message: 'Imóvel excluído com sucesso!' };
  } catch (error) {
    console.error('Erro ao excluir imóvel:', error);
    return { success: false, message: 'Erro ao excluir imóvel' };
  }
}