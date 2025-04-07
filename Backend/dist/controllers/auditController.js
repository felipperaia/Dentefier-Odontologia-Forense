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
exports.getAuditLogs = void 0;
const AuditLog_1 = __importDefault(require("../models/AuditLog"));
// Função para buscar os logs de auditoria
const getAuditLogs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { date } = req.query;
        // Garantir que date seja uma string antes de tentar criar um objeto Date
        let filter = {};
        if (date && typeof date === 'string') {
            const parsedDate = new Date(date); // Converte para Date
            if (!isNaN(parsedDate.getTime())) {
                filter = { timestamp: { $gte: parsedDate } };
            }
        }
        const logs = yield AuditLog_1.default.find(filter).sort({ timestamp: -1 });
        res.json(logs);
    }
    catch (error) {
        console.error('Erro ao buscar logs:', error);
        res.status(500).json({ error: 'Erro ao buscar logs de auditoria' });
    }
});
exports.getAuditLogs = getAuditLogs;
