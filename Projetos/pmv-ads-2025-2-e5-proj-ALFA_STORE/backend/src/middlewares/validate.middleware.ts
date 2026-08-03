import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

// Verifique se o tipo do schema é z.ZodObject<any>
const validate = (schema: z.ZodObject<any>) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          message: "Erro de validação",
          errors: error.issues,
        });
      }

      // Se o erro não for do Zod, ele cai aqui
      return res.status(500).json({ message: "Erro interno do servidor" });
    }
};

export default validate;