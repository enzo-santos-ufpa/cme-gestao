import React from "react";
import TelaEscolas from "../tela-escolas/TelaEscolas";
import {escolas} from "../../lib/api";
import LinhaAutorizacaoCadastro from "./LinhaAutorizacaoCadastro";
import {ModeloBD} from "../../models/tipos";
import {EscolaPendente} from "../../models/Escola";

function divideElementos(elementos: JSX.Element[], divisor: JSX.Element): JSX.Element[] {
    const resultado: JSX.Element[] = [divisor];
    elementos.forEach(elemento => resultado.push(elemento, divisor));
    return resultado;
}

class TelaAutorizacaoCadastro extends React.Component {
    render() {
        return (
            <TelaEscolas titulo="Autorização de Cadastro"
                         construtorEscolas={() => escolas.pendentes()}
                         construtorTabela={(escolas) => {
                             console.log(escolas);
                             return <div className="TelaAutorizacaoCadastro-tabela">
                                 {divideElementos(
                                     escolas
                                         .map(escola => escola as ModeloBD<EscolaPendente>)
                                         .sort((e0, e1): number => {
                                             const p0 = e0.processoAtual;
                                             const p1 = e1.processoAtual;
                                             if (p0 == null && p1 == null) return 0;
                                             if (p0 == null) return 1;
                                             if (p1 == null) return -1;
                                             return p0.dataFim.getTime() - p1.dataFim.getTime();
                                         })
                                         .map((escola) => <LinhaAutorizacaoCadastro escola={escola}/>),
                                     <hr className="TelaAutorizacaoCadastro-divisor"/>,
                                 )}
                             </div>;
                         }}
            />
        );
    }
}

export default TelaAutorizacaoCadastro;
