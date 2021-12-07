export type DadosCadastro = { dataInsercao: Date }

export type RespostaCadastro = "accept" | "refuse";

export type FiltroEscolasBD = {
    cadastro: "only-authorized" | "only-pending" | "all",
};

export enum DistritoAdministrativo { DABEL, DABEN, DAGUA, DAICO, DAOUT, DAMOS }

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
    nome: string, // EMEIF, EMEF, EMEI
}

export type EtapaEnsino = {
    nome: string, // Educação infantil, Ensino fundamental (CF), Ensino fundamental (EJA)
}

export type ModalidadeEnsino = {
    etapa: EtapaEnsino,
    nome: string, // Creche, Pré-escola, CF I
}

type _Processo = {
    nome: string,
    resolucao: string,
    inicio: Date,
    duracao: number,
}

export class Processo implements _Processo {
    nome: string;
    resolucao: string;
    inicio: Date;
    duracao: number;

    constructor(params: _Processo) {
        this.nome = params.nome;
        this.resolucao = params.resolucao;
        this.inicio = params.inicio;
        this.duracao = params.duracao;
    }

    get dataFim(): Date {
        const resultado = new Date(this.inicio.getTime());
        resultado.setFullYear(this.inicio.getFullYear() + this.duracao);
        return resultado;
    }

    get diasRestantes(): number {
        const diffTime = this.dataFim.getTime() - new Date().getTime();
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }
}

export type ModeloBD<T> = T & { id: number };

export type ValorAlt<T> = { valor: T, alt: string };