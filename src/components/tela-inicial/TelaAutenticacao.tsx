import React from "react";
import './TelaAutenticacao.css';
import logo from '../../assets/logo-CME.png'
import {PropsAutenticador} from "./TelaInicial";
import {EstadoAutenticacao} from "../../models/Autenticador";
import PlanoFundo, {bg} from "../common/PlanoFundo";
import Forms from "../../models/form";

class TelaAutenticacao extends React.Component<PropsAutenticador, EstadoAutenticacao> {
    state: EstadoAutenticacao = {email: {texto: ""}, senha: {texto: ""}};

    render() {
        return (
            <PlanoFundo bg={bg.login}>
                <div className="TelaAutenticacao">
                    <div className="TelaAutenticacao-grade">
                        <div className="TelaAutenticacao-container">
                            <img className="TelaAutenticacao-logo" src={logo} alt="Logo do sistema de gestão CME"/>
                            <input className="TelaAutenticacao-caixaTexto"
                                   type="text"
                                   placeholder="insira seu e-mail"
                                   value={this.state.email.texto}
                                   onChange={Forms.atualizaCampo(this.state, "email", this.setState)}/>
                            <span style={{color: "red"}}>{this.state.email.erro}</span>
                            <div style={{height: "10px"}}/>
                            <input className="TelaAutenticacao-caixaTexto"
                                   type="text"
                                   placeholder="insira sua senha"
                                   value={this.state.senha.texto}
                                   onChange={Forms.atualizaCampo(this.state, "senha", this.setState)}/>
                            <span style={{color: "red"}}>{this.state.senha.erro}</span>
                            <div style={{height: "20px"}}/>
                            <div className="TelaAutenticacao-botoes">
                                <input className="TelaAutenticacao-botao" type="button" value="Cadastrar nova escola"
                                       onClick={(_) => {
                                           window.location.href = "/cadastro-escola";
                                       }}/><input className="TelaAutenticacao-botao"
                                                  type="button"
                                                  value="Entrar"
                                                  onClick={(_) => {
                                                      const estado = this.state;
                                                      const novoEstado = this.props.autenticador.login(estado);
                                                      if (novoEstado == null) return;
                                                      this.setState(novoEstado);
                                                  }}/>

                            </div>
                        </div>
                    </div>
                </div>
            </PlanoFundo>
        );
    }
}

export default TelaAutenticacao;