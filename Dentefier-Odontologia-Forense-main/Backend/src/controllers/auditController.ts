import { Request, Response } from 'express';
import AuditLog from '../models/AuditLog';

// Função para buscar os logs de auditoria
export const getAuditLogs = async (req: Request, res: Response) => {
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

    const logs = await AuditLog.find(filter).sort({ timestamp: -1 });

    res.json(logs);
  } catch (error) {
    console.error('Erro ao buscar logs:', error);
    res.status(500).json({ error: 'Erro ao buscar logs de auditoria' });
  }
};
