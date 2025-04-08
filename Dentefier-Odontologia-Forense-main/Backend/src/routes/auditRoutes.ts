import { Router } from 'express';
import { getAuditLogs } from '../controllers/auditController';
import { authenticateJWT, authorizeRoles } from '../middlewares/authMiddleware';

const router = Router();

// Obter logs de auditoria (somente administradores)
router.get('/', authenticateJWT, authorizeRoles('admin'), getAuditLogs);

export default router;
