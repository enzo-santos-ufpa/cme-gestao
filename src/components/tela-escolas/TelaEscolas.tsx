import React from "react";
import './TelaEscolas.css';
import {EscolaBase, DistritoAdministrativo, constantes} from "../../models/Escola";
import PlanoFundo, {bg} from "../common/PlanoFundo";
import {ModeloBD} from "../../models/tipos";

type Props<T extends EscolaBase> = {
    titulo: string,
    construtorEscolas: () => Promise<ModeloBD<T>[]>,
    construtorTabela: (escolas: ModeloBD<T>[]) => JSX.Element,
};

type Filtro = Readonly<{
    distrito?: DistritoAdministrativo,
    sigla?: string,
}>;

type Estado<T extends EscolaBase> = EstadoCarregando | EstadoCarregado<T>;

type EstadoCarregando = {
    escolas?: undefined
};

type EstadoCarregado<T extends EscolaBase> = {
    escolas: ModeloBD<T>[],
    escolasAtuais: ModeloBD<T>[],
    paginaAtual: number,
    filtro: Filtro,
};

function isCarregando(estado: Estado<any>): estado is EstadoCarregando {
    return estado.escolas == null;
}

class TelaEscolas<T extends EscolaBase> extends React.Component<Props<T>, Estado<T>> {
    private static readonly escolasPorPagina = 6;

    state: EstadoCarregando = {}

    private static filtra<T extends EscolaBase>(filtro: Filtro, escolas: T[]): T[] {
        let escolasFiltradas = escolas;
        if (filtro.sigla != null) {
            escolasFiltradas = escolasFiltradas.filter(escola => {
                return escola.tipo.sigla === filtro.sigla;
            });
        }
        if (filtro.distrito != null) {
            escolasFiltradas = escolasFiltradas.filter(escola => escola.distrito === filtro.distrito);
        }
        return escolasFiltradas;
    }

    componentDidMount() {
        this.props.construtorEscolas().then((escolas) => {
            const novoEstado: EstadoCarregado<T> = {
                escolas: escolas,
                escolasAtuais: escolas,
                paginaAtual: 0,
                filtro: {},
            };
            this.setState(novoEstado);
        });
    }

    private onBusca(text: string) {
        let estado: Estado<T> = this.state;
        if (isCarregando(estado)) return;

        estado = estado as EstadoCarregado<T>;
        const escolasAtuais = estado.escolas.filter(escola => escola.nome.toLowerCase().includes(text.toLowerCase()));
        const estadoNovo: EstadoCarregado<T> = {
            escolas: estado.escolas,
            paginaAtual: 0,
            escolasAtuais: escolasAtuais,
            filtro: estado.filtro,
        };
        this.setState(estadoNovo);
    }

    private get escolasAtuais(): ModeloBD<T>[] {
        const estado = this.state as Estado<T>;
        if (isCarregando(estado)) return [];

        const escolasPorPagina = TelaEscolas.escolasPorPagina;
        const escolas = (estado as EstadoCarregado<T>).escolasAtuais
            .slice(estado.paginaAtual * escolasPorPagina, (estado.paginaAtual + 1) * escolasPorPagina);
        return TelaEscolas.filtra(estado.filtro, escolas);
    }

    private renderizaTabela(): JSX.Element {
        const estado = this.state as Estado<T>;
        if (isCarregando(estado)) return <p>Carregando..</p>;
        const escolas = this.escolasAtuais;
        if (!escolas.length) return <p>Nenhuma escola encontrada.</p>;
        return this.props.construtorTabela(escolas);
    }

    private renderizaBotaoAnterior(): JSX.Element | null {
        const estado = this.state as Estado<T>;
        if (isCarregando(estado)) return null;
        if (!this.escolasAtuais.length) return null;
        if (estado.paginaAtual === 0) return null;
        return <p
            className="TelaEscolas-botaoControle"
            onClick={(_) => this.setState({...estado, paginaAtual: estado.paginaAtual - 1})}>
            ANTERIOR</p>;
    }

    private renderizaBotaoProximo(): JSX.Element | null {
        const estado = this.state as Estado<T>;
        if (isCarregando(estado)) return null;
        if (!this.escolasAtuais.length) return null;
        if ((TelaEscolas.escolasPorPagina * (estado.paginaAtual + 1)) >= estado.escolasAtuais.length) return null;
        return <p
            className="TelaEscolas-botaoControle"
            onClick={(_) => this.setState({...estado, paginaAtual: estado.paginaAtual + 1})}>
            PRÓXIMO</p>;
    }

    private renderizaFiltros(): JSX.Element | null {
        const estado = this.state as Estado<T>;
        if (isCarregando(estado)) return null;

        const sigla = estado.filtro.sigla;
        const distrito = estado.filtro.distrito;
        return <div>
            <select
                className="TelaEscolas-filtro"
                value={distrito == null ? "" : distrito}
                onChange={(e) => {
                    this.setState({
                        ...estado,
                        paginaAtual: 0,
                        filtro: {
                            ...estado.filtro,
                            distrito: e.target.value as DistritoAdministrativo,
                        },
                    });
                }}>
                <option value={undefined}>distrito</option>
                {constantes.distritos.map(value => <option>{value}</option>)}
            </select>
            <select
                className="TelaEscolas-filtro"
                value={sigla == null ? "" : sigla}
                onChange={(e) => {
                    const value = e.target.value === "sigla" ? undefined : e.target.value;
                    this.setState({
                        ...estado,
                        paginaAtual: 0,
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