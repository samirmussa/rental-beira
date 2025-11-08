// models/Message.js
import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  imovel: { type: mongoose.Schema.Types.ObjectId, ref: 'Property', required: true },
  remetente: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  texto: { type: String, required: true },
}, { timestamps: true });

export default mongoose.models.Message || mongoose.model('Message', messageSchema)