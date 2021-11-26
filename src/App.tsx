import React from 'react';
import './App.css';
import HomeScreen from "./home/HomeScreen";
import {BrowserRouter, Routes, Route} from "react-router-dom";
import SchoolsTable from "./schools-table/SchoolsTable";

class App extends React.Component {
    render() {
        return <BrowserRouter>
            <Routes>
                <Route path="/" element={<HomeScreen/>}/>
                <Route path="/consultaEscola" element={<SchoolsTable/>}/>
            </Routes>
        </BrowserRouter>;
    }
}

export default App;
