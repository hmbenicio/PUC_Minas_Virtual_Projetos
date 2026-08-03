import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

interface EmailOptions {
  email: string;
  subject: string;
  message: string;
  html?: string;
}

const sendEmail = async (options: EmailOptions) => {
  // 1. Verificação de Segurança (Guard Clause)
  // Se as variáveis essenciais estiverem vazias, paramos aqui.
  if (!process.env.EMAIL_HOST || !process.env.EMAIL_USERNAME || !process.env.EMAIL_PASSWORD) {
    // Logamos um aviso no servidor para o desenvolvedor saber
    console.warn("⚠️  AVISO: E-mail não enviado. Credenciais SMTP (EMAIL_HOST, USERNAME, PASSWORD) não configuradas no .env.");
    
    // Lançamos um erro controlado. 
    // No cadastro, esse erro será "engolido" (soft fail). 
    // No 'esqueci senha', esse erro será retornado ao usuário (hard fail), o que é correto.
    throw new Error("Serviço de e-mail não configurado.");
  }

  // 2. Criação do Transporter (só acontece se passou pela verificação acima)
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT) || 587, // Se a porta estiver vazia, usa 587
    secure: false, 
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: `Loja Backend <${process.env.EMAIL_FROM || 'noreply@loja.com'}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html,
  };

  await transporter.sendMail(mailOptions);
};

export default sendEmail;