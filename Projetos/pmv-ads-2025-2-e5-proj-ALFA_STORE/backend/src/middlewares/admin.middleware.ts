import { Request, Response, NextFunction } from 'express';

export const adminMiddleware = (req: Request, res: Response, next: NextFunction) => {

  if (req.user && req.user.role === 'admin') {
    next(); // O usuário está autenticado e é um admin, pode prosseguir.
  } else {
    // Se não for admin, retornamos o erro 403 Forbidden.
    res.status(403).json({ message: "Acesso negado. Requer privilégios de administrador." });
  }
};