import React from "react";
import './TelaEscolas.css';
import Escola from "../../models/Escola";
import PlanoFundo, {bg} from "../common/PlanoFundo";
import {DistritoAdministrativo, ModeloBD} from "../../models/tipos";

type _Props = {
    titulo: string,
    construtorEscolas: () => Promise<ModeloBD<Escola>[]>,
    construtorTabela: (escolas: ModeloBD<Escola>[]) => JSX.Element,
}

type _Filtro = Readonly<{
    distrito?: DistritoAdministrativo,
    sigla?: string,
}>;

type _Estado = _EstadoCarregando | _EstadoCarregado;

type _EstadoCarregando = {
    escolas?: undefined
};

type _EstadoCarregado = {
    escolas: ModeloBD<Escola>[],
    escolasAtuais: ModeloBD<Escola>[],
    paginaAtual: number,
    filtro: _Filtro,
}

function isCarregando(estado: _Estado): estado is _EstadoCarregando {
    return estado.escolas == null;
}

class TelaEscolas extends React.Component<_Props, _Estado> {
    private static readonly escolasPorPagina = 6;

    state: _EstadoCarregando = {}

    private static filtra<T extends Escola>(filtro: _Filtro, escolas: T[]): T[] {
        let escolasFiltradas = escolas;
        if (filtro.distrito != null) {
            escolasFiltradas = escolasFiltradas.filter(escola => escola.distrito === filtro.distrito);
        }
        if (filtro.sigla != null) {
            escolasFiltradas = escolasFiltradas.filter(escola => escola.sigla === filtro.sigla);
        }
        return escolasFiltradas;
    }

    componentDidMount() {
        this.props.construtorEscolas().then((escolas) => {
            const novoEstado: _EstadoCarregado = {
                escolas: escolas,
                escolasAtuais: escolas,
                paginaAtual: 0,
                filtro: {},
            };
            this.setState(novoEstado);
        });
    }

    private onBusca(text: string) {
        let estado: _Estado = this.state;
        if (isCarregando(estado)) return;

        estado = estado as _EstadoCarregado;
        const escolasAtuais = estado.escolas.filter(escola => escola.nome.toLowerCase().includes(text.toLowerCase()));
        const estadoNovo: _EstadoCarregado = {
            escolas: estado.escolas,
            paginaAtual: 0,
            escolasAtuais: escolasAtuais,
            filtro: estado.filtro,
        };
        this.setState(estadoNovo);
    }

    private get escolasAtuais(): ModeloBD<Escola>[] {
        const estado = this.state as _Estado;
        if (isCarregando(estado)) return [];

        const escolasPorPagina = TelaEscolas.escolasPorPagina;
        let escolas = (estado as _EstadoCarregado).escolasAtuais
            .slice(estado.paginaAtual * escolasPorPagina, (estado.paginaAtual + 1) * escolasPorPagina);
        return TelaEscolas.filtra(estado.filtro, escolas);
    }

    private renderizaTabela(): JSX.Element {
        const estado = this.state as _Estado;
        if (isCarregando(estado)) return <p>Carregando..</p>;
        const escolas = this.escolasAtuais;
        if (!escolas.length) return <p>Nenhuma escola encontrada.</p>;
        return this.props.construtorTabela(escolas);
    }

    private renderizaBotaoAnterior(): JSX.Element | null {
        const estado = this.state as _Estado;
        if (isCarregando(estado)) return null;
        if (!this.escolasAtuais.length) return null;
        if (estado.paginaAtual === 0) return null;
        return <p
            className="TelaEscolas-botaoControle"
            onClick={(_) => this.setState({...estado, paginaAtual: estado.paginaAtual - 1})}>
            ANTERIOR</p>;
    }

    private renderizaBotaoProximo(): JSX.Element | null {
        const estado = this.state as _Estado;
        if (isCarregando(estado)) return null;
        if (!this.escolasAtuais.length) return null;
        if ((TelaEscolas.escolasPorPagina * (estado.paginaAtual + 1)) >= estado.escolasAtuais.length) return null;
        return <p
            className="TelaEscolas-botaoControle"
            onClick={(_) => this.setState({...estado, paginaAtual: estado.paginaAtual + 1})}>
            PRÓXIMO</p>;
    }

    private renderizaFiltros(): JSX.Element | null {
        const estado = this.state as _Estado;
        if (isCarregando(estado)) return null;

        const sigla = estado.filtro.sigla;
        const distrito = estado.filtro.distrito;
        return <div>
            <select
                className="TelaEscolas-filtro"
                value={distrito == null ? "" : DistritoAdministrativo[distrito]}
                onChange={(e) => {
                    this.setState({
                        ...estado,
                        filtro: {
                            ...estado.filtro,
                            distrito: DistritoAdministrativo[e.target.value as keyof typeof DistritoAdministrativo]
                        },
                    });
                }}>
                <option value={undefined}>distrito</option>
                {Object.values(DistritoAdministrativo)
                    .filter(value => {
                        // noinspection SuspiciousTypeOfGuard
                        return typeof value === "string";
                    })
                    .map(value => <option>{value}</option>)}
            </select>
            <select
                className="TelaEscolas-filtro"
                value={sigla == null ? "" : sigla}
                onChange={(e) => {
                    const value = e.target.value === "sigla" ? undefined : e.target.value;
                    this.setState({
                        ...estado,
                        filtro: {...estado.filtro, sigla: value},
                    });
                }}>
                <option value={undefined}>sigla</option>
                {["EMEI", "EMEIF", "UEI", "EMEF", "OSC", "Privada"].map(value => <option>{value}</option>)}
            </select>
        </div>;
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
                        <div style={{display: "flex"}}>
                            <p>filtrar por</p>
                            {this.renderizaFiltros()}
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