import React from "react";
import './TelaEscolas.css';
import Escola from "../../models/Escola";
import PlanoFundo, {bg} from "../common/PlanoFundo";
import {ModeloBD} from "../../models/tipos";

type _Props = {
    titulo: string,
    construtorEscolas: () => Promise<ModeloBD<Escola>[]>,
    construtorTabela: (escolas: ModeloBD<Escola>[]) => JSX.Element,
}


type _Estado = _EstadoCarregando | _EstadoCarregado;

type _EstadoCarregando = {
    escolas?: undefined
};

type _EstadoCarregado = {
    escolas: ModeloBD<Escola>[],
    escolasAtuais: ModeloBD<Escola>[],
    paginaAtual: number,
    paginaAtualPesquisa?: number,
}

class TelaEscolas extends React.Component<_Props, _Estado> {
    private static readonly escolasPorPagina = 6;

    state: _EstadoCarregando = {}

    componentDidMount() {
        this.props.construtorEscolas().then((escolas) => {
            const novoEstado: _EstadoCarregado = {
                escolas: escolas,
                escolasAtuais: escolas,
                paginaAtual: 0,
            };
            this.setState(novoEstado);
        });
    }

    private onBusca(text: string) {
        let estadoAtual: _Estado = this.state;
        if (estadoAtual.escolas == null) return;

        estadoAtual = estadoAtual as _EstadoCarregado;
        const escolasAtuais = estadoAtual.escolas.filter(escola => escola.nome.toLowerCase().includes(text.toLowerCase()));
        const estadoNovo: _EstadoCarregado = {
            escolas: estadoAtual.escolas,
            paginaAtual: estadoAtual.paginaAtual,
            escolasAtuais: escolasAtuais,
            paginaAtualPesquisa: 0,
        };
        this.setState(estadoNovo);
    }

    private renderizaTabela(): JSX.Element {
        const estado = this.state as _Estado;
        if (estado.escolas == null) return <p>Carregando..</p>;

        console.log(estado.paginaAtual * TelaEscolas.escolasPorPagina);
        console.log((estado.paginaAtual + 1) * TelaEscolas.escolasPorPagina);

        const escolasPorPagina = TelaEscolas.escolasPorPagina;
        const escolas = (estado as _EstadoCarregado).escolasAtuais
            .slice(estado.paginaAtual * escolasPorPagina, (estado.paginaAtual + 1) * escolasPorPagina);
        if (!escolas.length) return <p>Nenhuma escola encontrada.</p>;
        return this.props.construtorTabela(escolas);
    }

    private renderizaBotaoAnterior(): JSX.Element | null {
        const estado = this.state as _Estado;
        if (estado.escolas == null) return null;
        if (estado.paginaAtual === 0) return null;
        return <p
            className="TelaEscolas-botaoControle"
            onClick={(_) => this.setState({...estado, paginaAtual: estado.paginaAtual - 1})}>
            ANTERIOR</p>;
    }

    private renderizaBotaoProximo(): JSX.Element | null {
        const estado = this.state as _Estado;
        if (estado.escolas == null) return null;
        if ((TelaEscolas.escolasPorPagina * (estado.paginaAtual + 1)) >= estado.escolasAtuais.length) return null;
        return <p
            className="TelaEscolas-botaoControle"
            onClick={(_) => this.setState({...estado, paginaAtual: estado.paginaAtual + 1})}>
            PRÓXIMO</p>;
    }

    render() {
        return (
            <PlanoFundo bg={bg.tela}>
                <div className="TelaEscolas">
                    <div className="TelaEscolas-linhaCabecalho">
                        <div className="TelaEscolas-colunaCabecalho">
                            <p className="TelaEscolas-titulo">{this.props.titulo}</p>
                            <input className="TelaEscolas-caixaTexto" type="text"
                                   placeholder="Digite o nome de uma instituição"
                                   onChange={(e) => this.onBusca(e.target.value.trim())}/>
                        </div>
                    </div>
                    {this.renderizaTabela()}
                    <div className="TelaEscolas-controlePaginas">
                        {this.renderizaBotaoAnterior()}
                        {this.renderizaBotaoProximo()}
                    </div>
                </div>
            </PlanoFundo>
        );
    }
}

export default TelaEscolas;