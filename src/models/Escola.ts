import {FlatEncoded, FlatEncoder, FlatEncoderDecorator, ModeloBD} from "./tipos";

export type RespostaCadastro = "accept" | "refuse";

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
    diretor: Servidor,
    secretario: Servidor,
    coordenador: Servidor,
    tipo: TipoEscola,
    modalidadesEnsino: ModalidadeEnsino[],
    convenioSemec?: ConvenioSEMEC,
    filiais: Escola[],
}

export type EscolaBase = Omit<Escola, "modalidadeEnsino" | "filiais">;

export type EscolaAutorizada = EscolaBase & { processoAtual: Processo };

export type DadosCadastro = { dataInsercao: Date }
export type EscolaPendente = EscolaBase & { cadastro: DadosCadastro };

type SetorEscola = "Pública" | "Privada";
export type TipoEscola = {
    setor: SetorEscola,
    sigla: string,
}

export namespace constantes {
    export const distritos = ["DABEL", "DABEN", "DAGUA", "DAICO", "DAOUT", "DAMOS"] as const;

    type SiglasEscola = { setor: SetorEscola, siglas: string[] };
    export const tiposEscola: SiglasEscola[] = [
        {setor: "Pública", siglas: ["EMEIF", "EMEF", "EMEI", "UEI"]},
        {setor: "Privada", siglas: ["OSC", "Comunitária", "Confessional", "Privada"]},
    ];

    export function isDistrito(value: string): value is DistritoAdministrativo {
        return distritos.includes(value as any);
    }

    export const etapasEnsino = ["Educação infantil", "Educação fundamental", "Educação fundamental (EJA)"] as const;
    export type EtapaEnsino = typeof etapasEnsino[number];
    type LegendaEtapaEnsino = { titulo: EtapaEnsino, subtitulo: string, modalidades: string[] };
    export const modalidadesEnsino: LegendaEtapaEnsino[] = [
        {
            titulo: "Educação infantil",
            subtitulo: "",
            modalidades: ["Creche", "Pré-escola"],
        },
        {
            titulo: "Educação fundamental",
            subtitulo: "Ciclos de formação (anos iniciais e finais)",
            modalidades: ["CF I (1º, 2º e 3º ano)", "CF II (4º e 5º ano)", "CF III (6º e 7º ano)", "CF IV (8º e 9º ano)"],
        },
        {
            titulo: "Educação fundamental (EJA)",
            subtitulo: "Totalidades do conhecimento (anos iniciais e finais)",
            modalidades: ["CF I (1º, 2º e 3º ano)", "CF II (4º e 5º ano)", "CF III (6º e 7º ano)", "CF IV (8º e 9º ano)"],
        },
    ];
}

export type DistritoAdministrativo = typeof constantes.distritos[number];
export type ModalidadeEnsino = { etapa: constantes.EtapaEnsino, nome: string };
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
                distrito: value.distrito as DistritoAdministrativo,
                telefone: value.telefone,
                sigla: value.sigla,
                dataCriacao: new Date(Date.parse(value.dataCriacao)),
                vigenciaConselho: value.vigenciaConselho,
                codigoInep: value.codigoInep,
                cnpjConselho: value.cnpjConselho,
                nomeEntidadeMantenedora: value.nomeEntidadeMantenedora,
                tipo: {
                    setor: value["tipo.setor"] as "Pública" | "Privada",
                    sigla: value["tipo.sigla"],
                },
                convenioSemec: value["convenioSemec.numConvenio"] == null ? undefined : {
                    numConvenio: parseInt(value["convenioSemec.numConvenio"]!),
                    objeto: value["convenioSemec.objeto"]!,
                    vigencia: value["convenioSemec.vigencia"]!,
                },
                diretor: {
                    nome: value["diretor.nome"],
                    email: value["diretor.email"],
                    telefone: value["diretor.telefone"],
                },
                secretario: {
                    nome: value["secretario.nome"],
                    email: value["secretario.email"],
                    telefone: value["secretario.telefone"],
                },
                coordenador: {
                    nome: value["coordenador.nome"],
                    email: value["coordenador.email"],
                    telefone: value["coordenador.telefone"],
                },
                modalidadesEnsino: JSON.parse(value["modalidadesEnsino"]),
            };
        }

        encode(value: EscolaBase): FlatEncoded<EscolaBase> {
            return {
                "convenioSemec.vigencia": value.convenioSemec?.vigencia,
                "convenioSemec.numConvenio": value.convenioSemec?.numConvenio?.toString(),
                "convenioSemec.objeto": value.convenioSemec?.objeto,
                "diretor.email": value.diretor.email,
                "diretor.telefone": value.diretor.telefone,
                "diretor.nome": value.diretor.nome,
                "secretario.email": value.secretario.email,
                "secretario.telefone": value.secretario.telefone,
                "secretario.nome": value.secretario.nome,
                "coordenador.email": value.coordenador.email,
                "coordenador.telefone": value.coordenador.telefone,
                "coordenador.nome": value.coordenador.nome,
                "tipo.setor": value.tipo.setor,
                "tipo.sigla": value.tipo.sigla,
                modalidadesEnsino: JSON.stringify(value.modalidadesEnsino),
                bairro: value.bairro,
                cep: value.cep,
                cidade: value.cidade,
                cnpj: value.cnpj,
                cnpjConselho: value.cnpjConselho,
                codigoInep: value.codigoInep,
                dataCriacao: value.dataCriacao.toISOString(),
                distrito: value.distrito,
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
                "processoAtual.nome": value.processoAtual?.nome,
                "processoAtual.resolucao": value.processoAtual?.resolucao,
                "processoAtual.inicio": value.processoAtual?.inicio.toISOString(),
                "processoAtual.duracao": value.processoAtual?.duracao.toString(),
                "processoAtual.dataFim": "",
                "processoAtual.diasRestantes": "",
            };
        }
    }

    class ListaValoresEncoder<T> {
        private readonly encoder: FlatEncoder<T>;

        constructor(encoder: FlatEncoder<T>) {
            this.encoder = encoder;
        }

        decode(value: { [p: string]: FlatEncoded<T> }): T[] {
            return Object.values(value).map(v => this.encoder.decode(v));
        }

        encode(value: T[]): { [p: string]: FlatEncoded<T> } {
            return Object.fromEntries(value.map((v, i) => [`${i}`, this.encoder.encode(v)]));
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

    export function escolaPendente(): FlatEncoder<EscolaPendente> {
        return new EscolaPendenteEncoder(escolaBase());
    }

    export function escolaAutorizada(): FlatEncoder<EscolaAutorizada> {
        return new EscolaAutorizadaEncoder(escolaBase());
    }

    export function lista<T>(encoder: FlatEncoder<T>): ListaValoresEncoder<T> {
        return new ListaValoresEncoder(encoder);
    }

    export function modeloDB<T>(encoder: FlatEncoder<T>): FlatEncoder<ModeloBD<T>> {
        return new ModeloDBEncoder(encoder);
    }
}

