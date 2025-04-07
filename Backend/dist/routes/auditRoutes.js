"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auditController_1 = require("../controllers/auditController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = (0, express_1.Router)();
// Obter logs de auditoria (somente administradores)
router.get('/', authMiddleware_1.authenticateJWT, (0, authMiddleware_1.authorizeRoles)('admin'), auditController_1.getAuditLogs);
exports.default = router;
