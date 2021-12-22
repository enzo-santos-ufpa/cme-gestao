import React from "react";
import './TelaEscolas.css';
import {EscolaBase, constantes} from "../../models/Escola";
import PlanoFundo, {bg} from "../common/PlanoFundo";
import {ModeloBD} from "../../models/tipos";
import {CampoUnicaEscolha} from "../common/forms/Campo";
import Forms from "../../models/form";
import Formulario = Forms.Formulario;
import Validador from "../../models/Validador";

type Props<T extends EscolaBase> = {
    titulo: string,
    construtorEscolas: () => Promise<ModeloBD<T>[]>,
    construtorTabela: (escolas: ModeloBD<T>[]) => JSX.Element,
};

type Estado<T extends EscolaBase> = EstadoCarregando | EstadoCarregado<T>;

type EstadoCarregando = {
    escolas?: undefined
};

type Filtro = Formulario<"distrito" | "setor" | "sigla">;

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
        const sigla = filtro.campo("sigla").valor;
        if (sigla) {
            escolasFiltradas = escolasFiltradas.filter(escola => escola.tipo.sigla === sigla);
        }
        const setor = filtro.campo("setor").valor;
        if (setor) {
            escolasFiltradas = escolasFiltradas.filter(escola => escola.tipo.setor === setor);
        }
        const distrito = filtro.campo("distrito").valor;
        if (distrito) {
            escolasFiltradas = escolasFiltradas.filter(escola => escola.distrito === distrito);
        }
        return escolasFiltradas;
    }

    componentDidMount() {
        this.props.construtorEscolas().then((escolas) => {
            const novoEstado: EstadoCarregado<T> = {
                escolas: escolas,
                escolasAtuais: escolas,
                paginaAtual: 0,
                filtro: new Forms.Formulario({
                    sigla: new Forms.CampoTexto({
                        nome: "sigla",
                        valor: "",
                        validador: new Validador(),
                    }),
                    setor: new Forms.CampoTexto({
                        nome: "setor",
                        valor: "",
                        validador: new Validador(),
                    }),
                    distrito: new Forms.CampoTexto({
                        nome: "distrito",
                        valor: "",
                        validador: new Validador(),
                    }),
                }),
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
        if (!escolas) return <p>Nenhuma escola encontrada.</p>;
        return this.props.construtorTabela(escolas);
    }

    private renderizaBotaoAnterior(): JSX.Element | null {
        const estado = this.state as Estado<T>;
        if (isCarregando(estado)) return null;
        if (!this.escolasAtuais) return null;
        if (estado.paginaAtual === 0) return null;
        return <p
            className="TelaEscolas-botaoControle"
            onClick={(_) => this.setState({...estado, paginaAtual: estado.paginaAtual - 1})}>
            ANTERIOR</p>;
    }

    private renderizaBotaoProximo(): JSX.Element | null {
        const estado = this.state as Estado<T>;
        if (isCarregando(estado)) return null;
        if (!this.escolasAtuais) return null;
        if ((TelaEscolas.escolasPorPagina * (estado.paginaAtual + 1)) >= estado.escolasAtuais.length) return null;
        return <p
            className="TelaEscolas-botaoControle"
            onClick={(_) => this.setState({...estado, paginaAtual: estado.paginaAtual + 1})}>
            PRÓXIMO</p>;
    }

    private renderizaFiltros(): JSX.Element | null {
        const estado = this.state as Estado<T>;
        if (isCarregando(estado)) return null;

        return <div>
            <CampoUnicaEscolha campo={estado.filtro.campo("distrito")}
                               nome="distrito"
                               opcoes={constantes.distritos}
                               estilo={{campo: {className: "TelaEscolas-filtro"}}}
                               onChanged={() => this.setState({...estado, paginaAtual: 0})}/>
            <CampoUnicaEscolha campo={estado.filtro.campo("setor")}
                               nome="setor"
                               opcoes={constantes.tiposEscola.map(tipo => tipo.setor)}
                               estilo={{campo: {className: "TelaEscolas-filtro"}}}
                               onChanged={() => {
                                   const setor = estado.filtro.campo("setor").valor;
                                   if (setor) estado.filtro.campo("sigla").valor = "";
                                   this.setState({...estado, paginaAtual: 0});
                               }}/>
            <CampoUnicaEscolha campo={estado.filtro.campo("sigla")}
                               nome="sigla"
                               opcoes={constantes.tiposEscola.flatMap(tipo => {
                                   const setor = estado.filtro.campo("setor").valor;
                                   if (!setor) return tipo.siglas;
                                   if (setor === tipo.setor) return tipo.siglas;
                                   return [];
                               })}
                               estilo={{campo: {className: "TelaEscolas-filtro"}}}
                               onChanged={() => this.setState({...estado, paginaAtual: 0})}/>
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