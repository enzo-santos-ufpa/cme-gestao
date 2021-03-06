import React from "react";
import './TelaAutenticacao.css';
import logo from '../../assets/logo-CME.png';
import {PropsAutenticador} from "./TelaInicial";
import {EstadoAutenticacao} from "../../models/Autenticador";
import PlanoFundo, {bg} from "../common/PlanoFundo";
import Forms from "../../models/form";

type _Estado = { form: EstadoAutenticacao };

class TelaAutenticacao extends React.Component<PropsAutenticador, _Estado> {
    readonly state: _Estado;

    constructor(props: PropsAutenticador) {
        super(props);
        this.state = {
            form: new Forms.Formulario({
                email: new Forms.CampoTexto(),
                senha: new Forms.CampoTexto()
            }),
        }
    }

    render() {
        const form = this.state.form;
        return (
            <PlanoFundo bg={bg.login}>
                <div className="TelaAutenticacao">
                    <div className="TelaAutenticacao-grade">
                        <div className="TelaAutenticacao-container">
                            <img className="TelaAutenticacao-logo" src={logo} alt="Logo do sistema de gestão CME"/>
                            <input className="TelaAutenticacao-caixaTexto"
                                   type="text"
                                   placeholder="insira seu e-mail"
                                   value={form.campo("email").valor}
                                   onChange={(e) => {
                                       form.campo("email").valor = e.target.value;
                                       this.setState({form});
                                   }}/>
                            <span
                                className="TelaAutenticacao-erroCaixaTexto">{form.campo("email").erro}</span>
                            <div style={{height: "10px"}}/>
                            <input className="TelaAutenticacao-caixaTexto"
                                   type="text"
                                   placeholder="insira sua senha"
                                   value={form.campo("senha").valor}
                                   onChange={(e) => {
                                       form.campo("senha").valor = e.target.value;
                                       this.setState({form});
                                   }}/>
                            <span
                                className="TelaAutenticacao-erroCaixaTexto">{form.campo("senha").erro}</span>
                            <div style={{height: "20px"}}/>
                            <div className="TelaAutenticacao-botoes">
                                <input className="TelaAutenticacao-botao"
                                       type="button"
                                       value="Cadastrar escola"
                                       onClick={(_) => window.location.href = "/cadastro-escola"}/>
                                <input className="TelaAutenticacao-botao"
                                       type="button"
                                       value="Entrar"
                                       onClick={(_) => {
                                           const sucesso = this.props.autenticador.login(form);
                                           if (sucesso) return;
                                           this.setState({form});
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