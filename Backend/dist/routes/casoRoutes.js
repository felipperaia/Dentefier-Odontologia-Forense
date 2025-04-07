"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const casoController_1 = require("../controllers/casoController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = (0, express_1.Router)();
// Rotas para peritos e administradores (exemplo)
router.post('/', authMiddleware_1.authenticateJWT, (0, authMiddleware_1.authorizeRoles)('admin', 'perito'), casoController_1.createCaso);
router.get('/', authMiddleware_1.authenticateJWT, (0, authMiddleware_1.authorizeRoles)('admin', 'perito', 'assistente'), casoController_1.listCasos);
router.put('/:id', authMiddleware_1.authenticateJWT, (0, authMiddleware_1.authorizeRoles)('admin', 'perito'), casoController_1.updateCaso);
router.delete('/:id', authMiddleware_1.authenticateJWT, (0, authMiddleware_1.authorizeRoles)('admin'), casoController_1.deleteCaso);
exports.default = router;
