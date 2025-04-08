// src/middlewares/authMiddleware.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Interface para adicionar o usuário ao request
export interface AuthRequest extends Request {
  user?: {
    id: string;
    role: string;
  };
}

// Carregar a chave secreta do JWT do arquivo .env
const JWT_SECRET = process.env.JWT_SECRET || ''; // Defina um valor default caso não esteja no .env

// Middleware para validar o token JWT
export const authenticateJWT = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token não fornecido.' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AuthRequest['user'];
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Token inválido.' });
  }
};

// Middleware para validar roles específicos (admin, perito, assistente)
export const authorizeRoles = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Acesso negado.' });
    }
    next();
  };
};
