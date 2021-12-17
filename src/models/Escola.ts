import {FlatEncoded, FlatEncoder, FlatEncoderDecorator, ModeloBD} from "./tipos";

type Escola = {
    nome: string,
    sigla: string,
    dataCriacao: Date,
    codigoInep: string,
    cnpj: string,
    cnpjConselho: string,
    vigenciaConselho: string,
    distrito: DistritoAdministrativo,
    endereco: string,
    cidade: string,
    uf: string,
    bairro: string,
    cep: string,
    email: string,
    telefone: string,
    nomeEntidadeMantenedora: string,
    servidores: {
        diretor: Servidor,
        secretario: Servidor,
        coordenador: Servidor,
    },
    tipo: TipoEscola,
    modalidadeEnsino: ModalidadeEnsino,
    convenioSemec?: ConvenioSEMEC,
    filiais: Escola[],
}

export type EscolaBase = Omit<Escola, "tipo" | "modalidadeEnsino" | "convenioSemec" | "filiais">;
export type EscolaAutorizada = EscolaBase & { processoAtual: Processo };
export type EscolaPendente = EscolaBase & { cadastro: DadosCadastro };

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

export namespace encoding {
    class EscolaBaseEncoder extends FlatEncoder<EscolaBase> {
        decode(value: FlatEncoded<EscolaBase>): EscolaBase {
            return {
                nome: value.nome,
                cnpj: value.cnpj,
                uf: value.uf,
                cep: value.cep,
                email: value.email,
                cidade: value.cidade,
                bairro: value.bairro,
                endereco: value.endereco,
                distrito: DistritoAdministrativo[value.distrito as keyof typeof DistritoAdministrativo],
                telefone: value.telefone,
                sigla: value.sigla,
                dataCriacao: new Date(Date.parse(value.dataCriacao)),
                vigenciaConselho: value.vigenciaConselho,
                codigoInep: value.codigoInep,
                cnpjConselho: value.cnpjConselho,
                nomeEntidadeMantenedora: value.nomeEntidadeMantenedora,
                servidores: {
                    diretor: {
                        nome: value["servidores.diretor.nome"],
                        email: value["servidores.diretor.email"],
                        telefone: value["servidores.diretor.telefone"],
                    },
                    secretario: {
                        nome: value["servidores.secretario.nome"],
                        email: value["servidores.secretario.email"],
                        telefone: value["servidores.secretario.telefone"],
                    },
                    coordenador: {
                        nome: value["servidores.coordenador.nome"],
                        email: value["servidores.coordenador.email"],
                        telefone: value["servidores.coordenador.telefone"],
                    },
                }
            };
        }

        encode(value: EscolaBase): FlatEncoded<EscolaBase> {
            return {
                "servidores.diretor.email": value.servidores.diretor.email,
                "servidores.diretor.telefone": value.servidores.diretor.telefone,
                "servidores.diretor.nome": value.servidores.diretor.nome,
                "servidores.secretario.email": value.servidores.secretario.email,
                "servidores.secretario.telefone": value.servidores.secretario.telefone,
                "servidores.secretario.nome": value.servidores.secretario.nome,
                "servidores.coordenador.email": value.servidores.coordenador.email,
                "servidores.coordenador.telefone": value.servidores.coordenador.telefone,
                "servidores.coordenador.nome": value.servidores.coordenador.nome,
                bairro: value.bairro,
                cep: value.cep,
                cidade: value.cidade,
                cnpj: value.cnpj,
                cnpjConselho: value.cnpjConselho,
                codigoInep: value.codigoInep,
                dataCriacao: value.dataCriacao.toISOString(),
                distrito: DistritoAdministrativo[value.distrito],
                email: value.email,
                endereco: value.endereco,
                nome: value.nome,
                nomeEntidadeMantenedora: value.nomeEntidadeMantenedora,
                sigla: value.sigla,
                telefone: value.telefone,
                uf: value.uf,
                vigenciaConselho: value.vigenciaConselho,
            };
        }
    }

    abstract class EscolaBaseEncoderDecorator<T extends EscolaBase> extends FlatEncoderDecorator<EscolaBase, T> {
    }

    class EscolaPendenteEncoder extends EscolaBaseEncoderDecorator<EscolaPendente> {
        decode(value: FlatEncoded<EscolaPendente>): EscolaPendente {
            return {
                ...this.encoder.decode(value),
                cadastro: {
                    dataInsercao: new Date(Date.parse(value["cadastro.dataInsercao"])),
                },
            };
        }

        encode(value: EscolaPendente): FlatEncoded<EscolaPendente> {
            return {
                ...this.encoder.encode(value),
                "cadastro.dataInsercao": value.cadastro.dataInsercao.toISOString(),
            };
        }

    }

    class EscolaAutorizadaEncoder extends EscolaBaseEncoderDecorator<EscolaAutorizada> {
        decode(value: FlatEncoded<EscolaAutorizada>): EscolaAutorizada {
            return {
                ...this.encoder.decode(value),
                processoAtual: new Processo({
                    nome: value["processoAtual.nome"],
                    resolucao: value["processoAtual.resolucao"],
                    inicio: new Date(Date.parse(value["processoAtual.inicio"])),
                    duracao: parseInt(value["processoAtual.duracao"]),
                }),
            };
        }

        encode(value: EscolaAutorizada): FlatEncoded<EscolaAutorizada> {
            return {
                ...this.encoder.encode(value),
                "processoAtual.nome": value.processoAtual.nome,
                "processoAtual.resolucao": value.processoAtual.resolucao,
                "processoAtual.inicio": value.processoAtual.inicio.toISOString(),
                "processoAtual.duracao": value.processoAtual.duracao.toString(),
                "processoAtual.dataFim": "",
                "processoAtual.diasRestantes": "",
            };
        }
    }

    class ModeloDBEncoder<T> extends FlatEncoderDecorator<T, ModeloBD<T>> {
        decode(value: FlatEncoded<ModeloBD<T>>): ModeloBD<T> {
            return {...this.encoder.decode(value), id: parseInt(value.id)};
        }

        encode(value: ModeloBD<T>): FlatEncoded<ModeloBD<T>> {
            // @ts-ignore
            return {...this.encoder.encode(value), id: value.id.toString()};
        }
    }

    export function escolaBase(): FlatEncoder<EscolaBase> {
        return new EscolaBaseEncoder();
    }

    export function escolaPendente<T extends EscolaBase>(encoder: FlatEncoder<T>): FlatEncoder<EscolaPendente> {
        return new EscolaPendenteEncoder(encoder);
    }

    export function escolaAutorizada<T extends EscolaBase>(encoder: FlatEncoder<T>): FlatEncoder<EscolaAutorizada> {
        return new EscolaAutorizadaEncoder(encoder);
    }

    export function modeloDB<T>(encoder: FlatEncoder<T>): FlatEncoder<ModeloBD<T>> {
        return new ModeloDBEncoder(encoder);
    }
}

