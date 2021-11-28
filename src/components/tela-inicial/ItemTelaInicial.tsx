import React from "react";
import './ItemTelaInicial.css';

export interface ItemTelaInicialProps {
    nome: string;
    caminhoIcone: string;
    caminhoRota?: string;
}

export class ItemTelaInicial extends React.Component<ItemTelaInicialProps, {}> {
    render() {
        return <div className="ItemTelaInicial">
            <div className="ItemTelaInicial-bg">
                <div className="ItemTelaInicial-fg" onClick={() => {
                    const route = this.props.caminhoRota;
                    if (route == null) return;
                    window.location.href = route;
                }}>
                    <p className="ItemTelaInicial-legenda">{this.props.nome}</p>
                    <img style={{height: "100px", width: undefined}} src={this.props.caminhoIcone}/>
                </div>
            </div>
        </div>;
    }
}
