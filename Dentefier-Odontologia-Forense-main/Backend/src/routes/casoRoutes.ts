import { Router } from 'express';
import { createCaso, listCasos, updateCaso, deleteCaso } from '../controllers/casoController';
import { authenticateJWT, authorizeRoles } from '../middlewares/authMiddleware';

const router = Router();

// Rotas para peritos e administradores (exemplo)
router.post('/', authenticateJWT, authorizeRoles('admin', 'perito'), createCaso);
router.get('/', authenticateJWT, authorizeRoles('admin', 'perito', 'assistente'), listCasos);
router.put('/:id', authenticateJWT, authorizeRoles('admin', 'perito'), updateCaso);
router.delete('/:id', authenticateJWT, authorizeRoles('admin'), deleteCaso);

export default router;
