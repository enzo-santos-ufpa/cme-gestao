import React from 'react';
import './App.css';
import TelaInicial from "./components/tela-inicial/TelaInicial";
import {BrowserRouter, Routes, Route} from "react-router-dom";
import TelaConsultaEscolas from "./components/consulta-escolas/TelaConsultaEscolas";
import Autenticador from "./models/Autenticador";
import TelaCadastroEscola from "./components/cadastro-escolas/TelaCadastroEscola";
import TelaAutorizacaoCadastro from "./components/autorizacao-cadastro/TelaAutorizacaoCadastro";
import TelaTabelasGraficos from "./components/tabelas-graficos/TelaTabelasGraficos";

class App extends React.Component {
    private static autenticador = new Autenticador();

    render() {
        return <BrowserRouter>
            <Routes>
                <Route path="/" element={<TelaInicial autenticador={App.autenticador}/>}/>
                <Route path="/consulta-escolas" element={<TelaConsultaEscolas/>}/>
                <Route path="/autoriza-cadastro" element={<TelaAutorizacaoCadastro/>}/>
                <Route path="/cadastro-escola" element={<TelaCadastroEscola/>}/>
                <Route path="/tabelas-graficos" element={<TelaTabelasGraficos/>}/>
            </Routes>
        </BrowserRouter>;
    }
}

export default App;
