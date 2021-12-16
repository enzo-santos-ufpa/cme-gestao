import React from "react";
import './ItemTelaInicial.css';

export type ItemTelaInicialProps = {
    nome: string,
    construtorIcone: () => JSX.Element,
    caminhoRota?: string,
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
                {this.props.construtorIcone()}
            </div>
        </div>);
    }
}
