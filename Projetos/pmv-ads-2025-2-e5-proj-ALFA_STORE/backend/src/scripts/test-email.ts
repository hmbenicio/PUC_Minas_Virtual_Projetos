import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const testEmail = async () => {
  console.log("🔍 Iniciando teste de envio de e-mail...");
  console.log(`📡 Host: ${process.env.EMAIL_HOST}`);
  console.log(`👤 Usuário: ${process.env.EMAIL_USERNAME}`);
  console.log(`📧 Remetente (FROM): ${process.env.EMAIL_FROM}`);

  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT),
    secure: false, // true para 465, false para outras portas
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  try {
    const info = await transporter.sendMail({
      from: `Teste <${process.env.EMAIL_FROM}>`,
      to: process.env.EMAIL_FROM, // Manda para você mesmo (o email cadastrado no Brevo)
      subject: "Teste de Configuração - Loja Backend",
      text: "Se você recebeu isso, sua configuração SMTP está perfeita!",
    });

    console.log("✅ E-mail enviado com sucesso!");
    console.log("🆔 ID da mensagem:", info.messageId);
  } catch (error: any) {
    console.error("❌ FALHA NO ENVIO:");
    console.error(error);
    
    if (error.responseCode === 550) {
      console.log("\n💡 DICA: Erro 550 geralmente significa que o remetente não está autorizado.");
      console.log("Vá no Brevo -> Senders & IP e verifique se o email do .env está lá.");
    }
    if (error.code === 'EAUTH') {
        console.log("\n💡 DICA: Erro de autenticação. Verifique Login e Senha (Master Password ou API Key).");
    }
  }
};

testEmail();