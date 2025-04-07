"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const auditLogSchema = new mongoose_1.Schema({
    user: { type: String, required: true },
    action: { type: String, required: true },
    details: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
});
const AuditLog = (0, mongoose_1.model)('AuditLog', auditLogSchema);
exports.default = AuditLog;
