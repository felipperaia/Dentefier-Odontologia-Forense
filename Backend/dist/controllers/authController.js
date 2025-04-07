"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = exports.login = void 0;
const User_1 = __importDefault(require("../models/User"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// Carregar a chave secreta do JWT do arquivo .env
const JWT_SECRET = process.env.JWT_SECRET || ''; // Defina um valor default caso não esteja no .env
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ message: 'Username e senha são obrigatórios' });
        }
        // 🔎 Busca o usuário e inclui a senha
        const user = yield User_1.default.findOne({ username }).select('+password');
        if (!user) {
            return res.status(401).json({ message: 'Usuário não encontrado' });
        }
        // 🔐 Valida a senha com o método comparePassword
        const isValid = yield user.comparePassword(password);
        if (!isValid) {
            return res.status(401).json({ message: 'Senha incorreta' });
        }
        // 🔑 Gera o token JWT
        const token = jsonwebtoken_1.default.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: process.env.JWT_EXPIRATION || '2h' });
        res.json({
            message: 'Login realizado com sucesso',
            token,
            user: { id: user._id, username: user.username, role: user.role }
        });
    }
    catch (error) {
        console.error('Erro no login:', error);
        res.status(500).json({ message: 'Erro interno no servidor', error });
    }
});
exports.login = login;
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password, role } = req.body;
        const existingUser = yield User_1.default.findOne({ username });
        if (existingUser) {
            return res.status(409).json({ message: 'Nome de usuário já está em uso' });
        }
        const newUser = new User_1.default({ username, password, role });
        yield newUser.save();
        res.status(201).json({ message: 'Usuário registrado com sucesso' });
    }
    catch (error) {
        console.error('Erro ao registrar usuário:', error);
        res.status(500).json({ message: 'Erro ao registrar usuário', error });
    }
});
exports.register = register;
