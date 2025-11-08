// models/Notificacao.js
import mongoose from 'mongoose';

const NotificacaoSchema = new mongoose.Schema({
  tipo: { 
    type: String, 
    enum: ['curtida', 'mensagem', 'avaliacao'], 
    required: true 
  },
  mensagem: { type: String, required: true },
  imovel: { type: mongoose.Schema.Types.ObjectId, ref: 'Property', required: true },
  remetente: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // quem curtiu
  destinatario: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // proprietário
  lida: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.models.Notificacao || mongoose.model('Notificacao', NotificacaoSchema);