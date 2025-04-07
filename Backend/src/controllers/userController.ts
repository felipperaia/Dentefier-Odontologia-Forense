// src/controllers/userController.ts
import { Request, Response } from 'express';
import User, { IUser } from '../models/User';
import { AuthRequest } from '../middlewares/authMiddleware';
import mongoose from 'mongoose';

/**
 * Cadastro de usuário com validações aprimoradas.
 * Apenas administradores podem criar novos usuários.
 */
export const registerUser = async (req: Request, res: Response) => {
  try {
    const { username, password, role, email, phone, department } = req.body;

    // Validação dos campos obrigatórios
    if (!username || !password || !role) {
      return res.status(400).json({
        message: 'Campos obrigatórios faltando: username, password, role',
        requiredFields: ['username', 'password', 'role']
      });
    }

    // Verifica se já existe um usuário com o mesmo username ou email
    const existingUser = await User.findOne({
      $or: [{ username }, { email: email?.toLowerCase() }]
    }).select('username email');

    if (existingUser) {
      const conflictField = existingUser.username === username ? 'username' : 'email';
      return res.status(409).json({
        message: `${conflictField} já está em uso`,
        conflictField
      });
    }

    // Criação do usuário (o pre-save hook cuidará do hash da senha)
    const newUser = await User.create({
      username,
      password,
      role,
      email: email?.toLowerCase(),
      phone,
      department
    });

    // Remove a senha da resposta
    const userResponse = newUser.toObject();
    delete userResponse.password;

    res.status(201).json({
      message: 'Usuário criado com sucesso',
      user: userResponse
    });
  } catch (error) {
    handleControllerError(error, res, 'Erro ao registrar usuário');
  }
};

/**
 * Listagem e busca de usuários com paginação.
 * Permite filtrar por username (busca case-insensitive).
 */
export const listUsers = async (req: Request, res: Response) => {
  try {
    const { search = '', page = 1, limit = 10 } = req.query;

    const query = {
      username: { $regex: search.toString(), $options: 'i' }
    };

    const [users, total] = await Promise.all([
      User.find(query)
        .select('-password -__v')
        .skip((Number(page) - 1) * Number(limit))
        .limit(Number(limit)),
      User.countDocuments(query)
    ]);

    res.json({
      data: users,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    handleControllerError(error, res, 'Erro ao listar usuários');
  }
};

/**
 * Obtém os detalhes de um usuário pelo ID.
 */
export const getUserById = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id).select('-password -__v');

    if (!user) {
      return res.status(404).json({
        message: 'Usuário não encontrado',
        resourceId: req.params.id
      });
    }

    res.json(user);
  } catch (error) {
    handleControllerError(error, res, 'Erro ao buscar usuário');
  }
};

/**
 * Atualiza dados do usuário.
 * Campos sensíveis como senha e role não podem ser alterados aqui.
 */
export const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    // Impede alteração direta de senha e role
    delete updateData.password;
    delete updateData.role;

    const updatedUser = await User.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true
    }).select('-password -__v');

    if (!updatedUser) {
      return res.status(404).json({
        message: 'Usuário não encontrado para atualização',
        resourceId: id
      });
    }

    res.json({
      message: 'Usuário atualizado com sucesso',
      user: updatedUser
    });
  } catch (error) {
    handleControllerError(error, res, 'Erro ao atualizar usuário');
  }
};

/**
 * Exclui (ou desativa) um usuário.
 */
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const deletedUser = await User.findByIdAndDelete(id).select('-password -__v');

    if (!deletedUser) {
      return res.status(404).json({
        message: 'Usuário não encontrado para exclusão',
        resourceId: id
      });
    }

    res.json({
      message: 'Usuário excluído com sucesso',
      deletedUser
    });
  } catch (error) {
    handleControllerError(error, res, 'Erro ao excluir usuário');
  }
};

/**
 * Permite que o próprio usuário altere sua senha.
 * Requer que o usuário informe a senha atual e a nova senha.
 */
export const changePassword = async (req: AuthRequest, res: Response) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user?.id;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        message: 'Ambas as senhas são obrigatórias',
        requiredFields: ['currentPassword', 'newPassword']
      });
    }

    // Seleciona explicitamente o campo da senha
    const user = await User.findById(userId).select('+password');
    if (!user) {
      return res.status(404).json({
        message: 'Usuário não encontrado',
        resourceId: userId
      });
    }

    // Validação da senha atual utilizando o método do modelo (que usa bcrypt)
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({ message: 'Senha atual incorreta' });
    }

    // Atribuição da nova senha; o pre-save hook cuidará do hash
    user.password = newPassword;
    await user.save();

    res.json({ message: 'Senha alterada com sucesso' });
  } catch (error) {
    handleControllerError(error, res, 'Erro ao alterar senha');
  }
};

/**
 * Permite que um administrador redefina a senha de um usuário.
 */
export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { newPassword } = req.body;

    if (!newPassword) {
      return res.status(400).json({ message: 'Nova senha é obrigatória' });
    }

    // Seleciona o campo da senha para permitir a alteração
    const user = await User.findById(id).select('+password');
    if (!user) {
      return res.status(404).json({
        message: 'Usuário não encontrado',
        resourceId: id
      });
    }

    user.password = newPassword;
    await user.save();

    res.json({ message: 'Senha redefinida com sucesso' });
  } catch (error) {
    handleControllerError(error, res, 'Erro ao redefinir senha');
  }
};

/**
 * Função utilitária para tratamento de erros.
 * Verifica se o erro é de validação ou conversão de ID e retorna mensagens apropriadas.
 */
const handleControllerError = (
  error: unknown,
  res: Response,
  defaultMessage: string
) => {
  console.error(defaultMessage + ':', error);

  if (error instanceof mongoose.Error.ValidationError) {
    const errors = Object.values(error.errors).map((err) => err.message);
    return res.status(400).json({
      message: 'Erro de validação',
      errors
    });
  }

  if (error instanceof mongoose.Error.CastError) {
    return res.status(400).json({
      message: 'ID inválido',
      invalidId: error.value
    });
  }

  res.status(500).json({
    message: 'Erro interno no servidor',
    error: process.env.NODE_ENV === 'development' ? error : undefined
  });
};
