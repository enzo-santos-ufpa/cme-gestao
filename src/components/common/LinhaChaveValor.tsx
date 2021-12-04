import React from "react";
import './LinhaChaveValor.css';

type LinhaChaveValorProps = { chave: string, valor: string }

class LinhaChaveValor extends React.Component<LinhaChaveValorProps, {}> {
    render() {
        return <div className="LinhaChaveValor">
            <p style={{whiteSpace: "pre-wrap"}} className="LinhaChaveValor-chave">{this.props.chave + ": "}</p>
            <p className="LinhaChaveValor-valor">{this.props.valor}</p>
        </div>
    }
}

export default LinhaChaveValor;