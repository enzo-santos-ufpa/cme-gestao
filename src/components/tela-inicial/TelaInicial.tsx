import React from 'react';
import './TelaInicial.css';
import TelaAutenticacao from "./TelaAutenticacao";
import MenuPrincipal from "./MenuPrincipal";
import Autenticador from "../../models/Autenticador";

type _Estado = { autenticado: boolean }

class TelaInicial extends React.Component<PropsAutenticador, _Estado> {
    state = (() => {
        const conta: string | null = JSON.parse(localStorage.getItem("currentUser") ?? "null");
        return {autenticado: conta !== null};
    })();

    componentDidMount() {
        this.props.autenticador.addOnStateListener((autenticado) => {
            this.setState({autenticado: autenticado});
        });
    }

    render() {
        return (
            this.state.autenticado
                ? <MenuPrincipal autenticador={this.props.autenticador}/>
                : <TelaAutenticacao autenticador={this.props.autenticador}/>
        );
    }
}

export type PropsAutenticador = { autenticador: Autenticador }

export default TelaInicial;
