import React from "react";
import './TelaConsultaEscolas.css';
import LinhaTabelaEscolas from "./LinhaTabelaEscolas";
import Escola from "../../models/Escola";
import {escolas} from "../../lib/api";
import PlanoFundo, {bg} from "../common/PlanoFundo";

function divideElementos(elementos: JSX.Element[], divisor: JSX.Element): JSX.Element[] {
    const resultado: JSX.Element[] = [divisor];
    elementos.forEach(elemento => resultado.push(elemento, divisor));
    return resultado;
}

type _Props = { titulo: string, mostraStatus: boolean }

type _Estado = _EstadoCarregando | _EstadoCarregado;

type _EstadoCarregando = {
    escolas?: undefined
};

type _EstadoCarregado = {
    escolas: Escola[],
    escolasAtuais: Escola[],
}

async function retornaEscolas() {
    return await escolas.read();
}

class TelaConsultaEscolas extends React.Component<_Props, _Estado> {
    state: _EstadoCarregando = {}

    componentDidMount() {
        retornaEscolas().then((escolas) => {
            const novoEstado: _EstadoCarregado = {escolas: escolas, escolasAtuais: escolas};
            this.setState(novoEstado);
        });
    }

    private onBusca(text: string) {
        let estadoAtual: _Estado = this.state;
        if (estadoAtual.escolas == null) return;

        estadoAtual = estadoAtual as _EstadoCarregado;
        const estadoNovo: _EstadoCarregado = {
            ...estadoAtual,
            escolasAtuais: estadoAtual.escolas.filter(escola => escola.nome.toLowerCase().includes(text.toLowerCase()))
        };
        this.setState(estadoNovo);
    }

    private renderizaTabela(): JSX.Element {
        const estado = this.state as _Estado;
        if (estado.escolas == null) return <p>Carregando...</p>;

        const escolas = (estado as _EstadoCarregado).escolasAtuais;
        if (!escolas.length) return <p>Nenhuma escola encontrada.</p>;
        return <div className="TelaConsultaEscolas-tabela">
            {divideElementos(
                escolas
                    .sort((e0, e1): number => {
                        const p0 = e0.processoAtual;
                        const p1 = e1.processoAtual;
                        if (p0 === undefined && p1 === undefined) return 0;
                        if (p0 === undefined) return 1;
                        if (p1 === undefined) return -1;
                        return p0.dataFim.getTime() - p1.dataFim.getTime();
                    })
                    .map((escola) => <LinhaTabelaEscolas escola={escola} mostraStatus={this.props.mostraStatus}/>),
                <hr className="TelaConsultaEscolas-divisor"/>,
            )}
        </div>

    }

    render() {
        return (
            <PlanoFundo bg={bg.tela}>
                <div className="TelaConsultaEscolas">
                    <div className="TelaConsultaEscolas-linhaCabecalho">
                        <div className="TelaConsultaEscolas-colunaCabecalho">
                            <p className="TelaConsultaEscolas-titulo">{this.props.titulo}</p>
                            <input className="TelaConsultaEscolas-caixaTexto" type="text"
                                   placeholder="Digite o nome de uma instituição"
                                   onChange={(e) => this.onBusca(e.target.value.trim())}/>
                        </div>
                    </div>
                    {this.renderizaTabela()}
                </div>
            </PlanoFundo>
        );
    }
}

export default TelaConsultaEscolas;