// lib/email.js
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // TLS
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function enviarEmailGmail({ to, imovel, remetente, mensagem }) {
  const html = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background: #f8fafc; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
      <div style="text-align: center; margin-bottom: 24px;">
        <h1 style="color: #1d4ed8; font-size: 28px; margin: 0; font-weight: 700;">ArrendaBeira</h1>
        <p style="color: #64748b; margin: 8px 0 0; font-size: 14px;">Arrendamento em Moçambique</p>
      </div>

      <div style="background: white; padding: 20px; border-radius: 10px; margin-bottom: 20px; border: 1px solid #e2e8f0;">
        <h2 style="color: #1e293b; margin: 0 0 16px; font-size: 20px;">Nova Mensagem Recebida</h2>
        <p style="color: #475569; margin: 0 0 16px;">Olá <strong>${to.nome}</strong>,</p>
        <p style="color: #475569; margin: 0;">Você recebeu uma nova mensagem sobre seu imóvel:</p>
      </div>

      <div style="background: #f1f5f9; padding: 16px; border-radius: 10px; margin: 16px 0; border-left: 4px solid #3b82f6;">
        <p style="margin: 0 0 8px; font-weight: 600; color: #1e293b;">
          Imóvel: ${imovel.titulo}
        </p>
        <p style="margin: 0; color: #64748b;">
          Bairro: ${imovel.bairro} • Preço: ${imovel.preco?.toLocaleString('pt-MZ')} MZN
        </p>
      </div>

      <div style="background: #dbeafe; padding: 16px; border-radius: 10px; margin: 16px 0;">
        <p style="margin: 0 0 8px; font-weight: 600; color: #1e40af;">
          De: ${remetente.nome}
        </p>
        <p style="margin: 0 0 8px; color: #1e40af; font-size: 14px;">
          ${remetente.email}
        </p>
        <div style="background: white; padding: 14px; border-radius: 8px; font-style: italic; color: #1f2937; line-height: 1.5;">
          "${mensagem}"
        </div>
      </div>

      <div style="text-align: center; margin: 28px 0;">
        <a href="${process.env.NEXT_PUBLIC_URL}/proprietario" 
           style="background: #1d4ed8; color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; display: inline-block; box-shadow: 0 4px 6px rgba(29, 78, 216, 0.3);">
          Ver no Painel
        </a>
      </div>

      <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 28px 0;">

      <p style="text-align: center; color: #94a3b8; font-size: 12px; margin: 0;">
        © 2025 ArrendaBeira • Beira, Moçambique
      </p>
    </div>
  `;

  await transporter.sendMail({
    from: `"ArrendaBeira" <${process.env.EMAIL_USER}>`,
    to: to.email,
    subject: `Nova mensagem sobre "${imovel.titulo}"`,
    html,
  });
}