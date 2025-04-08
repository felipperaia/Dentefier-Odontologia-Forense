// src/app.ts
import express from 'express';
import cors from 'cors';
import { connectDB } from './config/db';
import path from 'path';
import dotenv from 'dotenv';

// Inicializa o app
const app = express();
dotenv.config();
// Conecta ao MongoDB
connectDB();

// Middlewares
app.use(cors());
app.use(express.json());

// Servir arquivos estáticos do front-end (ex.: páginas, imagens, etc.)
const publicPath = path.join(__dirname, '../../frontend/public');
app.use(express.static(publicPath));

// Rota principal para carregar o index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(publicPath, 'index.html'));
});

// Importa e utiliza as rotas da API
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import auditRoutes from './routes/auditRoutes';
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/audit-logs', auditRoutes);

// Middleware de erro global
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Erro:', err);
  res.status(500).json({ error: 'Erro interno no servidor' });
});

// Inicializa o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Servidor rodando em http://localhost:${PORT}`));
