const visitaSchema = new mongoose.Schema({
  imovel: { type: mongoose.Schema.Types.ObjectId, ref: 'Property' },
  arrendatario: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  data: Date,
  status: { type: String, enum: ['pendente', 'confirmada', 'cancelada'], default: 'pendente' },
  qrCode: String, // URL para check-in
});