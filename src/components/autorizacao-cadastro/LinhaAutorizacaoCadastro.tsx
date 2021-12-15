import React from "react";
import './LinhaAutorizacaoCadastro.css';
import LinhaChaveValor from "../common/LinhaChaveValor";
import {ModeloBD} from "../../models/tipos";
import {EscolaPendente} from "../../models/Escola";

type Props = { escola: ModeloBD<EscolaPendente> }

export default class LinhaAutorizacaoCadastro extends React.Component<Props, {}> {
    render() {
        return (
            <div className="LinhaAutorizacaoCadastro">
                <p className="LinhaAutorizacaoCadastro-titulo"
                   style={{"flexGrow": "10"}}
                   onClick={() => window.location.href = `/info-escola?id=${this.props.escola.id}&action=answer`}
                >{this.props.escola.nome}</p>
                <div className="LinhaAutorizacaoCadastro-opcoes">
                    <LinhaChaveValor chave="Data de Entrada"
                                     valor={this.props.escola.cadastro.dataInsercao.toLocaleDateString()}/>
                </div>
            </div>
        );
    }
}
