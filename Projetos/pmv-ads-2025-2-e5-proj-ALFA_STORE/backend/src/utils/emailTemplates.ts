// src/utils/emailTemplates.ts

export const getWelcomeTemplate = (nome: string) => {
  return `
    <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
      <h2 style="color: #2c3e50; text-align: center;">Bem-vindo à AlfaStore! 👟</h2>
      <p>Olá <strong>${nome}</strong>,</p>
      <p>Estamos muito felizes em ter você conosco! Sua conta foi criada com sucesso.</p>
      <p>Aproveite nossas ofertas exclusivas em sandálias.</p>
      <br>
      <p style="text-align: center;">
        <a href="${process.env.FRONTEND_URL}" style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">Ir para a Loja</a>
      </p>
      <br>
      <p style="font-size: 12px; color: #888; text-align: center;">Atenciosamente,<br>Equipe AlfaStore</p>
    </div>
  `;
};

export const getPasswordResetTemplate = (resetUrl: string) => {
  return `
    <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
      <h2 style="color: #d9534f; text-align: center;">Redefinição de Senha</h2>
      <p>Olá,</p>
      <p>Recebemos uma solicitação para redefinir a senha da sua conta na <strong>AlfaStore</strong>.</p>
      <p>Clique no botão abaixo para criar uma nova senha:</p>
      <br>
      <p style="text-align: center;">
        <a href="${resetUrl}" style="background-color: #d9534f; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">Redefinir Minha Senha</a>
      </p>
      <br>
      <p>Ou copie e cole o link abaixo no seu navegador:</p>
      <p style="font-size: 12px; color: #555; word-break: break-all;">${resetUrl}</p>
      <br>
      <p style="font-size: 12px; color: #888;">Se você não solicitou isso, por favor ignore este e-mail. Sua senha permanecerá a mesma.</p>
      <p style="font-size: 12px; color: #888; text-align: center;">Atenciosamente,<br>Equipe AlfaStore</p>
    </div>
  `;
};