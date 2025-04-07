"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/app.ts
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const db_1 = require("./config/db");
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
// Inicializa o app
const app = (0, express_1.default)();
dotenv_1.default.config();
// Conecta ao MongoDB
(0, db_1.connectDB)();
// Middlewares
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Servir arquivos estáticos do front-end (ex.: páginas, imagens, etc.)
const publicPath = path_1.default.join(__dirname, '../../frontend/public');
app.use(express_1.default.static(publicPath));
// Rota principal para carregar o index.html
app.get('/', (req, res) => {
    res.sendFile(path_1.default.join(publicPath, 'index.html'));
});
// Importa e utiliza as rotas da API
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const auditRoutes_1 = __importDefault(require("./routes/auditRoutes"));
app.use('/api/auth', authRoutes_1.default);
app.use('/api/users', userRoutes_1.default);
app.use('/api/audit-logs', auditRoutes_1.default);
// Middleware de erro global
app.use((err, req, res, next) => {
    console.error('Erro:', err);
    res.status(500).json({ error: 'Erro interno no servidor' });
});
// Inicializa o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Servidor rodando em http://localhost:${PORT}`));
