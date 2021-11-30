import React from "react";
import './ItemTelaInicial.css';
import {ValorAlt} from "../../models/tipos";

export interface ItemTelaInicialProps {
    nome: string;
    icone: ValorAlt<string>;
    caminhoRota?: string;
}

export class ItemTelaInicial extends React.Component<ItemTelaInicialProps, {}> {
    render() {
        return (<div className="ItemTelaInicial ItemTelaInicial-bg">
            <div className="ItemTelaInicial-fg" onClick={() => {
                const route = this.props.caminhoRota;
                if (route == null) return;
                window.location.href = route;
            }}>
                <p className="ItemTelaInicial-legenda">{this.props.nome}</p>
                <img style={{height: "100px", width: undefined}}
                     src={this.props.icone.valor}
                     alt={this.props.icone.alt}/>
            </div>
        </div>);
    }
}
