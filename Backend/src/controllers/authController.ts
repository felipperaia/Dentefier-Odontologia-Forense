// src/controllers/authController.ts
import { Request, Response } from 'express';
import User from '../models/User';
import jwt from 'jsonwebtoken';

// Carregar a chave secreta do JWT do arquivo .env
const JWT_SECRET = process.env.JWT_SECRET || ''; // Defina um valor default caso não esteja no .env

export const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Username e senha são obrigatórios' });
    }

    // 🔎 Busca o usuário e inclui a senha
    const user = await User.findOne({ username }).select('+password');
    if (!user) {
      return res.status(401).json({ message: 'Usuário não encontrado' });
    }

    // 🔐 Valida a senha com o método comparePassword
    const isValid = await user.comparePassword(password);
    if (!isValid) {
      return res.status(401).json({ message: 'Senha incorreta' });
    }

    // 🔑 Gera o token JWT
    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: process.env.JWT_EXPIRATION || '2h' });

    res.json({
      message: 'Login realizado com sucesso',
      token,
      user: { id: user._id, username: user.username, role: user.role }
    });
  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({ message: 'Erro interno no servidor', error });
  }
};

export const register = async (req: Request, res: Response) => {
  try {
    const { username, password, role } = req.body;
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(409).json({ message: 'Nome de usuário já está em uso' });
    }

    const newUser = new User({ username, password, role });
    await newUser.save();
    res.status(201).json({ message: 'Usuário registrado com sucesso' });
  } catch (error) {
    console.error('Erro ao registrar usuário:', error);
    res.status(500).json({ message: 'Erro ao registrar usuário', error });
  }
};
