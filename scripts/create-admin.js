// scripts/create-admin.js
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../models/User.js'; // ← .js e sem .default

(async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/rental-beira';
    await mongoose.connect(mongoUri);
    console.log('Conectado ao MongoDB');

    const hashedPassword = await bcrypt.hash('admin123', 10);

    const admin = await User.findOneAndUpdate(
      { email: 'admin@beira.com' },
      {
        nome: 'Administrador',
        email: 'admin@beira.com',
        password: hashedPassword,
        role: 'admin',
        telefone: '840000000',
        verified: true,
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    console.log('Admin criado/atualizado com sucesso!');
    console.log('   Email: admin@beira.com');
    console.log('   Senha: admin123');
    console.log('   ID:', admin._id);
  } catch (error) {
    console.error('Erro:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('Desconectado do MongoDB');
  }
})();