import {
    ContatoServidor,
    ConvenioSEMEC,
    DistritoAdmnistrativo,
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
    distrito: DistritoAdmnistrativo,
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
    processoAtual?: Processo,
    filiais: Escola[],
}

export type EscolaPrivada = Escola & { nomeEntidadeMantenedora: string }

export default Escola;