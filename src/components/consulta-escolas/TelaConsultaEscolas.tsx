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


type _Estado = _EstadoCarregando | _EstadoCarregado;

type _EstadoCarregando = {
    escolas?: undefined
};

type _EstadoCarregado = {
    escolas: Escola[],
    escolasAtuais: Escola[],
}

async function retornaEscolas(): Promise<Escola[]> {
    await new Promise(resolve => setTimeout(resolve, 2000));
    return Array(6).fill(escolaPadrao);
}

class TelaConsultaEscolas extends React.Component<{}, _Estado> {
    state: _EstadoCarregando = {}

    componentDidMount() {
        retornaEscolas().then((escolas) => {
            const novoEstado: _EstadoCarregado = {escolas: escolas, escolasAtuais: escolas};
            this.setState(novoEstado);
        });
    }

    onSearch(text: string) {
        let estadoAtual: _Estado = this.state;
        if (estadoAtual.escolas == null) return;

        estadoAtual = estadoAtual as _EstadoCarregado;
        const estadoNovo: _EstadoCarregado = {
            ...estadoAtual,
            escolasAtuais: estadoAtual.escolas.filter(escola => escola.nome.toLowerCase().includes(text.toLowerCase()))
        };
        this.setState(estadoNovo);
    }

    private static renderTabela(estado: _Estado): JSX.Element {
        if (estado.escolas == null) return <p>Carregando...</p>;

        const escolas = (estado as _EstadoCarregado).escolasAtuais;
        if (!escolas.length) return <p>Nenhuma escola encontrada.</p>;
        return <div className="TelaConsultaEscolas-tabela">
            {divideElementos(
                escolas.map((escola) => <LinhaTabelaEscolas escola={escola}/>),
                <hr className="TelaConsultaEscolas-divisor"/>,
            )}
        </div>

    }

    render() {
        return (
            <div className="TelaConsultaEscolas">
                <div className="TelaConsultaEscolas-linhaCabecalho">
                    <div className="TelaConsultaEscolas-colunaCabecalho">
                        <p className="TelaConsultaEscolas-titulo">Consulta de Instituições</p>
                        <input className="TelaConsultaEscolas-caixaTexto" type="text"
                               placeholder="Digite o nome de uma instituição"
                               onChange={(e) => this.onSearch(e.target.value.trim())}/>
                    </div>
                </div>
                {TelaConsultaEscolas.renderTabela(this.state)}
            </div>
        );
    }
}

export default TelaConsultaEscolas;