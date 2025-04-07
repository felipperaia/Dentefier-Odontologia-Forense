"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const CasoSchema = new mongoose_1.Schema({
    numeroCaso: { type: String, required: true, unique: true },
    titulo: { type: String, required: true },
    dataAbertura: { type: Date, required: true },
    responsavel: { type: String, required: true },
    status: { type: String, enum: ['Em andamento', 'Finalizado', 'Arquivado'], required: true },
    contexto: {
        tipoCaso: { type: String, required: true },
        origemDemanda: { type: String, required: true },
        descricao: { type: String, required: true }
    },
    dadosIndividuo: {
        nome: { type: String },
        idadeEstimado: { type: Number },
        sexo: { type: String },
        etnia: { type: String },
        identificadores: { type: String },
        antecedentes: { type: String }
    },
    documentacao: {
        registrosAnte: { type: String },
        registrosPost: { type: String },
        fotografias: [{ type: String }]
    },
    cadeiaCustodia: {
        evidencias: { type: String },
        dataColeta: { type: Date },
        responsavelColeta: { type: String }
    },
    historico: [
        {
            data: { type: Date },
            responsavel: { type: String },
            justificativa: { type: String },
            substatus: { type: String }
        }
    ]
});
exports.default = mongoose_1.default.model('Caso', CasoSchema);
