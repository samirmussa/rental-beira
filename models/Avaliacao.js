// models/Avaliacao.js
import mongoose from 'mongoose';

const avaliacaoSchema = new mongoose.Schema({
  imovel: { type: mongoose.Schema.Types.ObjectId, ref: 'Property', required: true },
  arrendatario: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  nota: { type: Number, min: 1, max: 5, required: true },
  comentario: { type: String, maxlength: 500 },
  anonimo: { type: Boolean, default: false },
  resposta: { type: String, maxlength: 500 }, // Resposta do proprietário
  dataResposta: { type: Date },
}, { timestamps: true });

// Índice para evitar avaliações duplicadas
avaliacaoSchema.index({ imovel: 1, arrendatario: 1 }, { unique: true });

export default mongoose.models.Avaliacao || mongoose.model('Avaliacao', avaliacaoSchema);