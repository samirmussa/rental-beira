import mongoose from 'mongoose';

const PropertySchema = new mongoose.Schema({
  titulo: { type: String, required: true },
  descricao: { type: String },
  preco: { type: Number, required: true },
  tipo: { type: String, enum: ['T1', 'T2', 'T3', 'T4', 'Apartamento', 'Moradia'], required: true },
  area: { type: Number },
  quartos: { type: Number },
  wc: { type: Number },
  cidade: { type: String, default: 'Beira' },
  bairro: { type: String, required: true },
  endereco: { type: String },
  coordenadas: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },
  imagens: [{ type: String }], // URLs do Cloudinary
  proprietario: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  disponivel: { type: Boolean, default: true },
  status: {
    type: String,
    enum: ['disponivel', 'arrendado', 'negociacao', 'manutencao'],
    default: 'disponivel',
  },
  contato: {
    telefone: String,
    whatsapp: String,
    email: String,
  },
  // Novos campos de curtidas
  curtidas: { type: Number, default: 0 }, // CONTAGEM TOTAL
  usuariosCurtiram: { 
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], 
    default: []  // ← CORREÇÃO APLICADA: VALOR PADRÃO COMO ARRAY VAZIO
  }, // USUÁRIOS QUE CURTIRAM
}, { timestamps: true });

export default mongoose.models.Property || mongoose.model('Property', PropertySchema);