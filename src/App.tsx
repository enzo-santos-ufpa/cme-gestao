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
                <Route path="/consultaEscola" element={<TelaConsultaEscolas/>}/>
            </Routes>
        </BrowserRouter>;
    }
}

export default App;
