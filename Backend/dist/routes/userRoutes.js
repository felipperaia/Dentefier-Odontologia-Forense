"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/userRoutes.ts
const express_1 = require("express");
const userController_1 = require("../controllers/userController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = (0, express_1.Router)();
// Cadastro de novo usuário (apenas administradores)
router.post('/register', authMiddleware_1.authenticateJWT, (0, authMiddleware_1.authorizeRoles)('admin'), userController_1.registerUser);
// Listagem e busca de usuários (apenas administradores)
router.get('/', authMiddleware_1.authenticateJWT, (0, authMiddleware_1.authorizeRoles)('admin'), userController_1.listUsers);
// Obter detalhes de um usuário por ID (apenas administradores)
router.get('/:id', authMiddleware_1.authenticateJWT, (0, authMiddleware_1.authorizeRoles)('admin'), userController_1.getUserById);
// Atualização de dados do usuário (apenas administradores)
// (Alteração direta de senha e role não é permitida aqui)
router.put('/:id', authMiddleware_1.authenticateJWT, (0, authMiddleware_1.authorizeRoles)('admin'), userController_1.updateUser);
// Exclusão de usuário (apenas administradores)
router.delete('/:id', authMiddleware_1.authenticateJWT, (0, authMiddleware_1.authorizeRoles)('admin'), userController_1.deleteUser);
// Reset de senha de um usuário (administrador redefinindo a senha)
router.put('/reset-password/:id', authMiddleware_1.authenticateJWT, (0, authMiddleware_1.authorizeRoles)('admin'), userController_1.resetPassword);
// Alteração de senha pelo próprio usuário (rota aberta para qualquer usuário autenticado)
router.put('/change-password', authMiddleware_1.authenticateJWT, userController_1.changePassword);
exports.default = router;
