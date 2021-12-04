import React from "react";
import './LinhaAutorizacaoCadastro.css';
import Escola from "../../models/Escola";
import {FcCancel, FcOk} from "react-icons/fc";
import LinhaChaveValor from "../common/LinhaChaveValor";

type _Props = { escola: Escola }

class LinhaAutorizacaoCadastro extends React.Component<_Props, {}> {
    render() {
        return (
            <div className="LinhaAutorizacaoCadastro">
                <p style={{"flexGrow": "1"}} className="LinhaAutorizacaoCadastro-titulo">{this.props.escola.nome}</p>
                <div style={{"flexGrow": "5"}}>
                    <LinhaChaveValor chave="Data de Entrada" valor={"must pass"}/>
                </div>
                <FcCancel className="BotaoResposta" size="40px"/>
                <FcOk className="BotaoResposta" size="40px"/>
            </div>
        );
    }
}

export default LinhaAutorizacaoCadastro;