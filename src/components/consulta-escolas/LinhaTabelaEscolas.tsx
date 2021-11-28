import React from "react";
import './LinhaTabelaEscolas.css';
import Escola from "../../models/Escola";
import {Processo} from "../../models/tipos";

type LinhaChaveValorProps = { chave: string, valor: string }

type LinhaTabelaEscolasProps = { escola: Escola }

class LinhaChaveValor extends React.Component<LinhaChaveValorProps, {}> {
    render() {
        return <div className="LinhaChaveValor">
            <p style={{whiteSpace: "pre-wrap"}} className="LinhaChaveValor-chave">{this.props.chave + ": "}</p>
            <p className="LinhaChaveValor-valor">{this.props.valor}</p>
        </div>
    }
}

class LinhaTabelaEscolas extends React.Component<LinhaTabelaEscolasProps, {}> {
    private static renderProcessDiv(processo: Processo): JSX.Element {
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

    render() {
        const processoAtual = this.props.escola.processoAtual;
        return (
            <div>
                <p className="LinhaTabelaEscolas-titulo">{this.props.escola.nome}</p>
                {processoAtual == null ? null : LinhaTabelaEscolas.renderProcessDiv(processoAtual)}
            </div>
        );
    }
}

export default LinhaTabelaEscolas;