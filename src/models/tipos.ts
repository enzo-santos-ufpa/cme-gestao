export enum DistritoAdmnistrativo { DABEL, DABEN, DAGUA, DAICO, DAOUT, DAMOS }

export enum SetorEscola { publico, privado}

export type ContatoServidor = {
    telefone: string,
    whatsapp: string,
    email: string,
}

export type ConvenioSEMEC = {
    numConvenio: number,
    objeto: string,
    vigencia: string,
}

export type TipoEscola = {
    setor: SetorEscola,
    nome: string,
}

export type EtapaEnsino = {
    nome: string,
}

export type ModalidadeEnsino = {
    etapa: EtapaEnsino,
    nome: string,
}

export class Processo {
    nome: string;
    resolucao: string;
    dataInicio: Date;
    anosVigencia: number;

    constructor(nome: string, resolucao: string, dataInicio: Date, anosVigencia: number) {
        this.nome = nome;
        this.resolucao = resolucao;
        this.dataInicio = dataInicio;
        this.anosVigencia = anosVigencia;
    }

    get dataFim(): Date {
        const resultado = new Date(this.dataInicio.getTime());
        resultado.setFullYear(this.dataInicio.getFullYear() + this.anosVigencia);
        return resultado;
    }

    get diasRestantes(): number {
        const diffTime = Math.abs(this.dataInicio.getTime() - new Date().getTime());
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }
}

export type ModeloBD<T> = T & { id: number };