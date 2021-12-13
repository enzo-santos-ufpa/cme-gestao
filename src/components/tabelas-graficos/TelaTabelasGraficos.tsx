import React from "react";
import {GraficoBarra, GraficoBarraAgrupada, GraficoPizza} from "../common/D3Component";

class TelaTabelasGraficos extends React.Component {
    render() {
        return <div>
            <GraficoPizza
                altura={500}
                largura={500}
                margem={{top: 50, right: 50, bottom: 50, left: 50}}
                dados={[
                    {x: "EMEI", y: 28},
                    {x: "EMEIF", y: 41},
                    {x: "EMEF", y: 40},
                    {x: "UEI", y: 28},
                    {x: "OSC", y: 20},
                    {x: "Privadas", y: 26},
                ]}/>
            <GraficoBarra
                altura={500}
                largura={500}
                margem={{top: 20, right: 30, bottom: 30, left: 40}}
                dados={[
                    {x: "2012", y: 1},
                    {x: "2013", y: 2},
                    {x: "2014", y: 3},
                    {x: "2015", y: 1},
                ]}/>
            <GraficoBarraAgrupada
                altura={500}
                largura={500}
                margem={{top: 20, right: 30, bottom: 30, left: 40}}
                dados={{
                    legendas: [
                        "Autorizado sem pendências",
                        "Autorizado com pendências",
                        "Não autorizado",
                    ],
                    grupos: [
                        {nome: "DAGUA", dados: [13, 7, 14]},
                        {nome: "DABEL", dados: [7, 0, 15]},
                        {nome: "DABEN", dados: [21, 0, 16]},
                        {nome: "DAOUT", dados: [8, 0, 2]},
                        {nome: "DAICO", dados: [26, 0, 6]},
                        {nome: "DAMOS", dados: [10, 0, 6]},
                        {nome: "DASAC", dados: [13, 0, 4]},
                        {nome: "DAENT", dados: [15, 0, 0]},
                    ],
                }}/>
        </div>
    }
}

export default TelaTabelasGraficos;