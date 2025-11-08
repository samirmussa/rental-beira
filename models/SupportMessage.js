// models/SupportMessage.js
import mongoose from 'mongoose';

const SupportMessageSchema = new mongoose.Schema({
  proprietario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  texto: {
    type: String,
    required: true,
  },
  remetente: {
    type: String, // 'proprietario' ou 'admin'
    required: true,
  },
  lida: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

export default mongoose.models.SupportMessage || mongoose.model('SupportMessage', SupportMessageSchema);