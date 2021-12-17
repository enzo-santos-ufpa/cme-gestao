import React from 'react';
import './App.css';
import TelaInicial from "./components/tela-inicial/TelaInicial";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import TelaConsultaEscolas from "./components/consulta-escolas/TelaConsultaEscolas";
import Autenticador from "./models/Autenticador";
import TelaCadastroEscola from "./components/cadastro-escolas/TelaCadastroEscola";
import TelaAutorizacaoCadastro from "./components/autorizacao-cadastro/TelaAutorizacaoCadastro";
import TelaEscola from "./components/tela-escola/TelaEscola";

class App extends React.Component {
    private static autenticador = new Autenticador();

    render() {
        return <BrowserRouter>
            <Routes>
                <Route path="/" element={<TelaInicial autenticador={App.autenticador}/>}/>
                <Route path="/consulta-escolas" element={<TelaConsultaEscolas/>}/>
                <Route path="/autoriza-cadastro" element={<TelaAutorizacaoCadastro/>}/>
                <Route path="/cadastro-escola" element={<TelaCadastroEscola/>}/>
                <Route path="/info-escola" element={<TelaEscola/>}/>
            </Routes>
        </BrowserRouter>;
    }
}

export default App;
