import React from "react";
import './LinhaAutorizacaoCadastro.css';
import {FcCancel, FcOk} from "react-icons/fc";
import LinhaChaveValor from "../common/LinhaChaveValor";
import {ModeloBD, RespostaCadastro} from "../../models/tipos";
import {escolas} from "../../lib/api";
import {EscolaPendente} from "../../models/Escola";

type _Props = { escola: ModeloBD<EscolaPendente> }

class LinhaAutorizacaoCadastro extends React.Component<_Props, {}> {
    private async responderTriagem(resposta: RespostaCadastro) {
        await escolas.answer(this.props.escola, resposta);
        switch (resposta) {
            case "accept": {
                alert(`Escola autorizada com sucesso.`);
                break;
            }
            case "refuse": {
                alert(`A escola foi recusada com sucesso.`);
                break;
            }
        }
        window.location.reload();
    }

    render() {
        return (
            <div className="LinhaAutorizacaoCadastro">
                <p style={{"flexGrow": "10"}} className="LinhaAutorizacaoCadastro-titulo">{this.props.escola.nome}</p>
                <div className="LinhaAutorizacaoCadastro-opcoes">
                    <LinhaChaveValor chave="Data de Entrada"
                                     valor={this.props.escola.cadastro.dataInsercao.toLocaleDateString()}/>
                    <div style={{width: "20px"}}/>
                    <FcCancel className="LinhaAutorizacaoCadastro-BotaoResposta"
                              size="40px"
                              onClick={(_) => this.responderTriagem("refuse")}/>
                    <FcOk className="LinhaAutorizacaoCadastro-BotaoResposta"
                          size="40px"
                          onClick={(_) => this.responderTriagem("accept")}/>
                </div>
            </div>
        );
    }
}

export default LinhaAutorizacaoCadastro;