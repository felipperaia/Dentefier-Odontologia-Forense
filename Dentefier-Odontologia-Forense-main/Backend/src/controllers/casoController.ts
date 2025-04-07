import { Request, Response } from 'express';
import Caso from '../models/Caso';

export const createCaso = async (req: Request, res: Response) => {
  try {
    const novoCaso = new Caso(req.body);
    await novoCaso.save();
    res.status(201).json({ message: 'Caso criado com sucesso', caso: novoCaso });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao criar caso', error });
  }
};

export const listCasos = async (req: Request, res: Response) => {
  try {
    const casos = await Caso.find();
    res.json(casos);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao listar casos', error });
  }
};

export const updateCaso = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updatedCaso = await Caso.findByIdAndUpdate(id, req.body, { new: true });
    res.json({ message: 'Caso atualizado', caso: updatedCaso });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao atualizar caso', error });
  }
};

export const deleteCaso = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await Caso.findByIdAndDelete(id);
    res.json({ message: 'Caso excluído com sucesso' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao excluir caso', error });
  }
};
