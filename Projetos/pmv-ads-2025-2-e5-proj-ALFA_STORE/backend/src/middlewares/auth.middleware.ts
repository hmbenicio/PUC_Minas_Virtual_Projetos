import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/user.model'; 

declare global {
  namespace Express {
    interface Request {
      user?: any; 
    }
  }
}

interface DecodedToken {
  id: string;
}

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ 
      status: 'error', 
      message: "Token de autenticação não fornecido ou mal formatado." 
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken;
    
    const user = await User.findById(decoded.id).select('-senha');

    if (!user) {
      return res.status(401).json({ 
        status: 'error', 
        message: "Não autorizado, usuário do token não existe mais." 
      });
    }
    
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ 
      status: 'error', 
      message: "Não autorizado, token inválido." 
    });
  }
};