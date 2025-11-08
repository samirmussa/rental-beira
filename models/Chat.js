// models/Chat.js
import mongoose from 'mongoose';

const mensagemSchema = new mongoose.Schema({
  remetente: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  texto: { type: String, required: true },
  lida: { type: Boolean, default: false },
}, { timestamps: true });

const chatSchema = new mongoose.Schema({
  imovel: { type: mongoose.Schema.Types.ObjectId, ref: 'Property', required: true },
  arrendatario: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  proprietario: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  mensagens: [mensagemSchema],
  ativo: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.models.Chat || mongoose.model('Chat', chatSchema);