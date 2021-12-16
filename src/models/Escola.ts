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
    servidores: {
        diretor: ContatoServidor,
        secretario: ContatoServidor,
        coordenador: ContatoServidor,
    },
    tipo: TipoEscola,
    modalidadeEnsino: ModalidadeEnsino,
    convenioSemec?: ConvenioSEMEC,
    filiais: Escola[],
    nomeEntidadeMantenedora: string,
}

export type EscolaBase = Omit<Escola, "tipo" | "modalidadeEnsino" | "convenioSemec" | "filiais">;
export type EscolaAutorizada = EscolaBase & { processoAtual: Processo };
export type EscolaPendente = EscolaBase & { cadastro: DadosCadastro };
