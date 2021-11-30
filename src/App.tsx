import React from 'react';
import './App.css';
import TelaInicial from "./components/tela-inicial/TelaInicial";
import {BrowserRouter, Routes, Route} from "react-router-dom";
import TelaConsultaEscolas from "./components/consulta-escolas/TelaConsultaEscolas";
import Autenticador from "./models/Autenticador";
import TelaCadastroEscola from "./components/cadastro-escolas/TelaCadastroEscola";

class App extends React.Component {
    private static autenticador = new Autenticador();
    render() {
        return <BrowserRouter>
            <Routes>
                <Route path="/" element={<TelaInicial autenticador={App.autenticador}/>}/>
                <Route path="/consulta-escolas" element={<TelaConsultaEscolas titulo="Consulta de Instituições" mostraStatus={false}/>}/>
                <Route path="/valida-escolas" element={<TelaConsultaEscolas titulo="Validação de Instituições" mostraStatus={true}/>}/>
                <Route path="/cadastro-escola" element={<TelaCadastroEscola/>}/>
            </Routes>
        </BrowserRouter>;
    }
}

export default App;
