// models/User.js (adicione campo favoritos)
import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  senha: { type: String, required: true },
  telefone: String,
  role: { type: String, enum: ['proprietario', 'arrendatario','admin'], default: 'arrendatario' },
  avatar: String,
  favoritos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Property' }], // ← NOVO
}, { timestamps: true });


export default mongoose.models.User || mongoose.model('User', UserSchema);