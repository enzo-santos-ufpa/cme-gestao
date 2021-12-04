import React from "react";
import './LinhaConsultaEscolas.css';
import Escola from "../../models/Escola";
import {Processo} from "../../models/tipos";
import LinhaChaveValor from "../common/LinhaChaveValor";

type _Props = { escola: Escola, mostraStatus: boolean }

class LinhaConsultaEscolas extends React.Component<_Props, {}> {
    private static renderizaDescricaoProcesso(processo?: Processo): JSX.Element | null {
        if (processo == null) return null;
        return <div style={{display: "flex"}}>
            <div style={{display: "flex", flexDirection: "column"}}>
                <LinhaChaveValor chave="Processo atual" valor={processo.nome}/>
                <LinhaChaveValor chave="Nº da resolução" valor={processo.resolucao}/>
            </div>
            <div style={{width: "30px"}}>

            </div>
            <div style={{display: "flex", flexDirection: "column"}}>
                <LinhaChaveValor chave="Tempo de vigência" valor={`${processo.anosVigencia} anos`}/>
                <LinhaChaveValor chave="Período de vigência"
                                 valor={`${processo.dataInicio.toLocaleDateString("pt-BR")} - ${processo.dataFim.toLocaleDateString("pt-BR")}`}/>
            </div>
            <div style={{width: "30px"}}/>

            <div style={{display: "flex", flexDirection: "column"}}>
                <p/>
                <LinhaChaveValor chave="Dias restantes" valor={`${processo.diasRestantes} dias`}/>
            </div>
        </div>
    }

    private renderizaStatus(processo?: Processo): JSX.Element | null {
        if (processo == null) return null;
        if (!this.props.mostraStatus) return null;
        const cor = LinhaConsultaEscolas.mapeiaCor(processo.diasRestantes);
        return <div className="LinhaConsultaEscolas-status" style={{backgroundColor: cor}}/>
    }

    private static mapeiaCor(diasRestantes: number): string {
        if (diasRestantes >= 120) return "#7ED957";
        if (diasRestantes >= 100) return "#FFDE59";
        if (diasRestantes >= 60) return "#FFA500";
        return "#FF1616";
    }

    render() {
        const processoAtual = this.props.escola.processoAtual;
        console.log(JSON.stringify(processoAtual));
        return (
            <div className="LinhaConsultaEscolas">
                {this.renderizaStatus(processoAtual)}
                <div>
                    <p className="LinhaConsultaEscolas-titulo">{this.props.escola.nome}</p>
                    {LinhaConsultaEscolas.renderizaDescricaoProcesso(processoAtual)}
                </div>
            </div>
        );
    }
}

export default LinhaConsultaEscolas;