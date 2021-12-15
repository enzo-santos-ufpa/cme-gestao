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
            <TelaEscolas<EscolaPendente>
                titulo="Autorização de Cadastro"
                construtorEscolas={() => escolas.pendentes().then((escolas) => {
                    return escolas
                        .sort((e0, e1): number => {
                            const p0 = e0.cadastro.dataInsercao;
                            const p1 = e1.cadastro.dataInsercao;
                            return p0.getTime() - p1.getTime();
                        });
                })}
                construtorTabela={(escolas: ModeloBD<EscolaPendente>[]) => {
                    return <div className="TelaAutorizacaoCadastro-tabela">
                        {divideElementos(
                            escolas
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
