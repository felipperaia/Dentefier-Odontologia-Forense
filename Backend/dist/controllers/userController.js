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
exports.resetPassword = exports.changePassword = exports.deleteUser = exports.updateUser = exports.getUserById = exports.listUsers = exports.registerUser = void 0;
const User_1 = __importDefault(require("../models/User"));
const mongoose_1 = __importDefault(require("mongoose"));
/**
 * Cadastro de usuário com validações aprimoradas.
 * Apenas administradores podem criar novos usuários.
 */
const registerUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const existingUser = yield User_1.default.findOne({
            $or: [{ username }, { email: email === null || email === void 0 ? void 0 : email.toLowerCase() }]
        }).select('username email');
        if (existingUser) {
            const conflictField = existingUser.username === username ? 'username' : 'email';
            return res.status(409).json({
                message: `${conflictField} já está em uso`,
                conflictField
            });
        }
        // Criação do usuário (o pre-save hook cuidará do hash da senha)
        const newUser = yield User_1.default.create({
            username,
            password,
            role,
            email: email === null || email === void 0 ? void 0 : email.toLowerCase(),
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
    }
    catch (error) {
        handleControllerError(error, res, 'Erro ao registrar usuário');
    }
});
exports.registerUser = registerUser;
/**
 * Listagem e busca de usuários com paginação.
 * Permite filtrar por username (busca case-insensitive).
 */
const listUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { search = '', page = 1, limit = 10 } = req.query;
        const query = {
            username: { $regex: search.toString(), $options: 'i' }
        };
        const [users, total] = yield Promise.all([
            User_1.default.find(query)
                .select('-password -__v')
                .skip((Number(page) - 1) * Number(limit))
                .limit(Number(limit)),
            User_1.default.countDocuments(query)
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
    }
    catch (error) {
        handleControllerError(error, res, 'Erro ao listar usuários');
    }
});
exports.listUsers = listUsers;
/**
 * Obtém os detalhes de um usuário pelo ID.
 */
const getUserById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield User_1.default.findById(req.params.id).select('-password -__v');
        if (!user) {
            return res.status(404).json({
                message: 'Usuário não encontrado',
                resourceId: req.params.id
            });
        }
        res.json(user);
    }
    catch (error) {
        handleControllerError(error, res, 'Erro ao buscar usuário');
    }
});
exports.getUserById = getUserById;
/**
 * Atualiza dados do usuário.
 * Campos sensíveis como senha e role não podem ser alterados aqui.
 */
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const updateData = Object.assign({}, req.body);
        // Impede alteração direta de senha e role
        delete updateData.password;
        delete updateData.role;
        const updatedUser = yield User_1.default.findByIdAndUpdate(id, updateData, {
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
    }
    catch (error) {
        handleControllerError(error, res, 'Erro ao atualizar usuário');
    }
});
exports.updateUser = updateUser;
/**
 * Exclui (ou desativa) um usuário.
 */
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const deletedUser = yield User_1.default.findByIdAndDelete(id).select('-password -__v');
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
    }
    catch (error) {
        handleControllerError(error, res, 'Erro ao excluir usuário');
    }
});
exports.deleteUser = deleteUser;
/**
 * Permite que o próprio usuário altere sua senha.
 * Requer que o usuário informe a senha atual e a nova senha.
 */
const changePassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { currentPassword, newPassword } = req.body;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                message: 'Ambas as senhas são obrigatórias',
                requiredFields: ['currentPassword', 'newPassword']
            });
        }
        // Seleciona explicitamente o campo da senha
        const user = yield User_1.default.findById(userId).select('+password');
        if (!user) {
            return res.status(404).json({
                message: 'Usuário não encontrado',
                resourceId: userId
            });
        }
        // Validação da senha atual utilizando o método do modelo (que usa bcrypt)
        const isMatch = yield user.comparePassword(currentPassword);
        if (!isMatch) {
            return res.status(401).json({ message: 'Senha atual incorreta' });
        }
        // Atribuição da nova senha; o pre-save hook cuidará do hash
        user.password = newPassword;
        yield user.save();
        res.json({ message: 'Senha alterada com sucesso' });
    }
    catch (error) {
        handleControllerError(error, res, 'Erro ao alterar senha');
    }
});
exports.changePassword = changePassword;
/**
 * Permite que um administrador redefina a senha de um usuário.
 */
const resetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { newPassword } = req.body;
        if (!newPassword) {
            return res.status(400).json({ message: 'Nova senha é obrigatória' });
        }
        // Seleciona o campo da senha para permitir a alteração
        const user = yield User_1.default.findById(id).select('+password');
        if (!user) {
            return res.status(404).json({
                message: 'Usuário não encontrado',
                resourceId: id
            });
        }
        user.password = newPassword;
        yield user.save();
        res.json({ message: 'Senha redefinida com sucesso' });
    }
    catch (error) {
        handleControllerError(error, res, 'Erro ao redefinir senha');
    }
});
exports.resetPassword = resetPassword;
/**
 * Função utilitária para tratamento de erros.
 * Verifica se o erro é de validação ou conversão de ID e retorna mensagens apropriadas.
 */
const handleControllerError = (error, res, defaultMessage) => {
    console.error(defaultMessage + ':', error);
    if (error instanceof mongoose_1.default.Error.ValidationError) {
        const errors = Object.values(error.errors).map((err) => err.message);
        return res.status(400).json({
            message: 'Erro de validação',
            errors
        });
    }
    if (error instanceof mongoose_1.default.Error.CastError) {
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
