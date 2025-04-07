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
exports.deleteCaso = exports.updateCaso = exports.listCasos = exports.createCaso = void 0;
const Caso_1 = __importDefault(require("../models/Caso"));
const createCaso = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const novoCaso = new Caso_1.default(req.body);
        yield novoCaso.save();
        res.status(201).json({ message: 'Caso criado com sucesso', caso: novoCaso });
    }
    catch (error) {
        res.status(500).json({ message: 'Erro ao criar caso', error });
    }
});
exports.createCaso = createCaso;
const listCasos = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const casos = yield Caso_1.default.find();
        res.json(casos);
    }
    catch (error) {
        res.status(500).json({ message: 'Erro ao listar casos', error });
    }
});
exports.listCasos = listCasos;
const updateCaso = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const updatedCaso = yield Caso_1.default.findByIdAndUpdate(id, req.body, { new: true });
        res.json({ message: 'Caso atualizado', caso: updatedCaso });
    }
    catch (error) {
        res.status(500).json({ message: 'Erro ao atualizar caso', error });
    }
});
exports.updateCaso = updateCaso;
const deleteCaso = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        yield Caso_1.default.findByIdAndDelete(id);
        res.json({ message: 'Caso excluído com sucesso' });
    }
    catch (error) {
        res.status(500).json({ message: 'Erro ao excluir caso', error });
    }
});
exports.deleteCaso = deleteCaso;
