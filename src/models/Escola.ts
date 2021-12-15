import {
    ContatoServidor,
    ConvenioSEMEC, DadosCadastro,
    DistritoAdministrativo,
    ModalidadeEnsino,
    Processo,
    TipoEscola
} from "./tipos";

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
    contatoDiretor: ContatoServidor,
    contatoSecretario: ContatoServidor,
    tipo: TipoEscola,
    modalidadeEnsino: ModalidadeEnsino,
    convenioSemec?: ConvenioSEMEC,
    filiais: Escola[],
    nomeEntidadeMantenedora: string,
}

export type EscolaBase = Pick<Escola, "nome" | "sigla" | "cnpj" | "dataCriacao" | "codigoInep" | "nomeEntidadeMantenedora" | "cnpjConselho" | "vigenciaConselho">;
export type EscolaAutorizada = EscolaBase & { processoAtual: Processo };
export type EscolaPendente = EscolaBase & { cadastro: DadosCadastro };
