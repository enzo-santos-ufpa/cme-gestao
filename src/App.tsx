import React from 'react';
import './App.css';
import TelaInicial from "./components/tela-inicial/TelaInicial";
import {BrowserRouter, Routes, Route} from "react-router-dom";
import TelaConsultaEscolas from "./components/consulta-escolas/TelaConsultaEscolas";

class App extends React.Component {
    render() {
        return <BrowserRouter>
            <Routes>
                <Route path="/" element={<TelaInicial/>}/>
                <Route path="/consulta-escolas" element={<TelaConsultaEscolas titulo="Consulta de Instituições" mostraStatus={false}/>}/>
                <Route path="/valida-escolas" element={<TelaConsultaEscolas titulo="Validação de Instituições" mostraStatus={true}/>}/>
            </Routes>
        </BrowserRouter>;
    }
}

export default App;
