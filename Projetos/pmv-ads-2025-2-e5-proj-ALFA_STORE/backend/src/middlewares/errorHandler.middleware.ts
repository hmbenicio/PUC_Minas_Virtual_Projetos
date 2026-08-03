import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';

export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  // Loga o erro completo apenas no servidor (nunca expor ao cliente)
  if (process.env.NODE_ENV !== 'production') {
    console.error('\n=== ERRO CAPTURADO ===');
    console.error('Mensagem:', err.message);
    console.error('Stack:', err.stack);
    console.error('========================\n');
  } else {
    // Em produção, log mais limpo
    console.error(`[${new Date().toISOString()}] Erro: ${err.message}`);
  }

  // Se a resposta já tiver um status code definido (que não seja o padrão 200), use-o.
  // Senão, use o statusCode do erro, ou recorra ao 500.
  const statusCode = res.statusCode !== 200 ? res.statusCode : (err.statusCode || 500);
  
  // Em produção, não expor mensagens de erro internas para erros 500
  const isProduction = process.env.NODE_ENV === 'production';
  const message = statusCode === 500 && isProduction 
    ? "Ocorreu um erro interno no servidor." 
    : (err.message || "Ocorreu um erro interno no servidor.");
  
  res.status(statusCode).json({
    status: "error",
    statusCode,
    message,
    // Inclui stack trace apenas em desenvolvimento
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};