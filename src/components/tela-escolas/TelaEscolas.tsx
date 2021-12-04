import React from "react";
import './TelaEscolas.css';
import Escola from "../../models/Escola";
import PlanoFundo, {bg} from "../common/PlanoFundo";
import {ModeloBD} from "../../models/tipos";
import {logger} from "../../lib/utils";

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
}

class TelaEscolas extends React.Component<_Props, _Estado> {
    state: _EstadoCarregando = {}

    componentDidMount() {
        const log = logger.client.at("TelaEscolas#componentDidMount").log;
        this.props.construtorEscolas().then((escolas) => {
            log(escolas);
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
        if (estado.escolas == null) return <p>Carregando..</p>;

        const escolas = (estado as _EstadoCarregado).escolasAtuais;
        if (!escolas.length) return <p>Nenhuma escola encontrada.</p>;
        return this.props.construtorTabela(escolas);
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
                </div>
            </PlanoFundo>
        );
    }
}

export default TelaEscolas;