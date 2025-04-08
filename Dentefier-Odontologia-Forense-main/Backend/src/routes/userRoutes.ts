// src/routes/userRoutes.ts
import { Router } from 'express';
import {
  registerUser,
  listUsers,
  getUserById,
  updateUser,
  deleteUser,
  resetPassword,
  changePassword
} from '../controllers/userController';
import { authenticateJWT, authorizeRoles } from '../middlewares/authMiddleware';

const router = Router();

// Cadastro de novo usuário (apenas administradores)
router.post('/register', authenticateJWT, authorizeRoles('admin'), registerUser);

// Listagem e busca de usuários (apenas administradores)
router.get('/', authenticateJWT, authorizeRoles('admin'), listUsers);

// Obter detalhes de um usuário por ID (apenas administradores)
router.get('/:id', authenticateJWT, authorizeRoles('admin'), getUserById);

// Atualização de dados do usuário (apenas administradores)
// (Alteração direta de senha e role não é permitida aqui)
router.put('/:id', authenticateJWT, authorizeRoles('admin'), updateUser);

// Exclusão de usuário (apenas administradores)
router.delete('/:id', authenticateJWT, authorizeRoles('admin'), deleteUser);

// Reset de senha de um usuário (administrador redefinindo a senha)
router.put('/reset-password/:id', authenticateJWT, authorizeRoles('admin'), resetPassword);

// Alteração de senha pelo próprio usuário (rota aberta para qualquer usuário autenticado)
router.put('/change-password', authenticateJWT, changePassword);

export default router;
