import React from "react";
import './TelaConsultaEscolas.css';
import LinhaConsultaEscolas from "./LinhaConsultaEscolas";
import {escolas} from "../../lib/api";
import TelaEscolas from "../tela-escolas/TelaEscolas";

function divideElementos(elementos: JSX.Element[], divisor: JSX.Element): JSX.Element[] {
    const resultado: JSX.Element[] = [divisor];
    elementos.forEach(elemento => resultado.push(elemento, divisor));
    return resultado;
}

class TelaConsultaEscolas extends React.Component {
    render() {
        return (
            <TelaEscolas titulo="Consulta de Instituições"
                         construtorEscolas={() => escolas.autorizadas().then((escolas) => {
                             return escolas.sort((e0, e1): number => {
                                 const p0 = e0.processoAtual;
                                 const p1 = e1.processoAtual;
                                 if (p0 == null && p1 == null) return 0;
                                 if (p0 == null) return 1;
                                 if (p1 == null) return -1;
                                 return p0.dataFim.getTime() - p1.dataFim.getTime();
                             });
                         })}
                         construtorTabela={(escolas) => <div className="TelaConsultaEscolas-tabela">
                             {divideElementos(
                                 escolas.map((escola) => <LinhaConsultaEscolas escola={escola} mostraStatus={true}/>),
                                 <hr className="TelaConsultaEscolas-divisor"/>,
                             )}
                         </div>}
            />
        );
    }
}

export default TelaConsultaEscolas;
