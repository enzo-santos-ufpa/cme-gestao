import React from "react";
import './TelaConsultaEscolas.css';
import LinhaTabelaEscolas from "./LinhaTabelaEscolas";
import Escola from "../../models/Escola";
import {DistritoAdmnistrativo, Processo, SetorEscola} from "../../models/tipos";

const escolaPadrao: Escola = {
    bairro: "CARANANDUBA - MOSQUEIRO",
    cep: "66923-060",
    cidade: "Belém",
    cnpj: "",
    cnpjConselho: "",
    codigoInep: "15043274",
    contatoDiretor: {telefone: "", email: "", whatsapp: ""},
    contatoSecretario: {telefone: "", email: "", whatsapp: ""},
    convenioSemec: undefined,
    dataCriacao: new Date(2019, 1, 1),
    distrito: DistritoAdmnistrativo.DAMOS,
    email: "",
    endereco: "RUA LALOR MOTA, 551",
    filiais: [],
    modalidadeEnsino: {nome: "", etapa: {nome: ""}},
    nome: "ABEL MARTINS",
    processoAtual: new Processo(
        "055/17-CME",
        "53/19-CME",
        new Date(2017, 12, 12),
        5,
    ),
    sigla: "",
    telefone: "",
    tipo: {setor: SetorEscola.publico, nome: "EMEF"},
    uf: "PA",
    vigenciaConselho: ""
}

function divideElementos(elementos: JSX.Element[], divisor: JSX.Element): JSX.Element[] {
    const resultado: JSX.Element[] = [divisor];
    elementos.forEach(elemento => resultado.push(elemento, divisor));
    return resultado;
}

class TelaConsultaEscolas extends React.Component {
    render() {
        return (
            <div className="TelaConsultaEscolas">
                <div className="TelaConsultaEscolas-linhaCabecalho">
                    <div className="TelaConsultaEscolas-colunaCabecalho">
                        <p className="TelaConsultaEscolas-titulo">Consulta de Instituições</p>
                        <input className="TelaConsultaEscolas-caixaTexto" type="text"
                               placeholder="Digite o nome de uma instituição"/>
                    </div>
                </div>
                <div className="TelaConsultaEscolas-tabela">
                    {divideElementos(
                        Array(6).fill(<LinhaTabelaEscolas escola={escolaPadrao}/>),
                        <hr className="TelaConsultaEscolas-divisor"/>,
                    )}
                </div>
            </div>
        );
    }
}

export default TelaConsultaEscolas;