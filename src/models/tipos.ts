// Returns R if T is a function, otherwise returns Fallback
type IsFunction<T, R, Fallback = T> = T extends (...args: any[]) => any ? R : Fallback

// Returns R if T is an object, otherwise returns Fallback
type IsObject<T, R, Fallback = T> = IsFunction<T, Fallback, (T extends (Date | number | string) ? Fallback : R)>

// "a.b.c" => "b.c"
type Tail<S> = S extends `${string}.${infer T}`? Tail<T> : S;

// typeof Object.values(T)
type Value<T> = T[keyof T]

// {a: {b: 1, c: 2}} => {"a.b": {b: 1, c: 2}, "a.c": {b: 1, c: 2}}
type FlattenStepOne<T> = {
    [K in keyof T as K extends string ? (IsObject<T[K], `${K}.${keyof T[K] & string}`, K>) : K]:
    IsObject<T[K], {[key in keyof T[K]]: T[K][key]}>
};

// {"a.b": {b: 1, c: 2}, "a.c": {b: 1, c: 2}} => {"a.b": {b: 1}, "a.c": {c: 2}}
type FlattenStepTwo<T> = {[a in keyof T]:  IsObject<T[a], Value<{[M in keyof T[a] as M extends Tail<a> ? M : never]: T[a][M] }>>}

// {a: {b: 1, c: {d: 1}}} => {"a.b": 1, "a.c": {d: 1}}
type FlattenOneLevel<T> = FlattenStepTwo<FlattenStepOne<T>>

// {a: {b: 1, c: {d: 1}}} => {"a.b": 1, "a.b.c.d": 1}
export type Flatten<T> = T extends FlattenOneLevel<T> ? T: Flatten<FlattenOneLevel<T>>

export type DadosCadastro = { dataInsercao: Date }

export type RespostaCadastro = "accept" | "refuse";

export type FiltroEscolasBD = {
    cadastro: "only-authorized" | "only-pending" | "all",
};

export enum DistritoAdministrativo { DABEL, DABEN, DAGUA, DAICO, DAOUT, DAMOS }

export enum SetorEscola { publico, privado}

export type Servidor = {
    nome: string,
    telefone: string,
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