import React from "react";
import './MenuPrincipal.css';
import {ItemTelaInicial, ItemTelaInicialProps} from "./ItemTelaInicial";
import {PropsAutenticador} from "./TelaInicial";
import PlanoFundo, {bg} from "../common/PlanoFundo";
import {BsBarChartLineFill, BsCardChecklist, BsFileEarmarkPostFill, BsPeopleFill, BsSearch} from "react-icons/bs";

class MenuPrincipal extends React.Component<PropsAutenticador, {}> {
    private static readonly colunas = 3;
    private static readonly itens: ItemTelaInicialProps[] = [
        {
            nome: "Cadastro\nde usuário",
            construtorIcone: () => <BsPeopleFill size={50}/>,
        },
        {
            nome: "Consulta de\ninstituições",
            construtorIcone: () => <BsSearch size={50}/>,
            caminhoRota: "/consulta-escolas"
        },
        {
            nome: "Tabelas e\ngráficos",
            construtorIcone: () => <BsBarChartLineFill size={50}/>,
        },
        {
            nome: "Autorização\nde cadastro",
            construtorIcone: () => <BsCardChecklist size={50}/>,
            caminhoRota: "/autoriza-cadastro"
        },
        {
            nome: "Consultar\nrelatórios",
            construtorIcone: () => <BsFileEarmarkPostFill size={50}/>,
        },
    ];

    render() {
        const numCols = MenuPrincipal.colunas;
        const itens = MenuPrincipal.itens.map((item, i) => {
            return <div key={i} style={{
                gridRow: (i / numCols) + 1,
                gridColumn: (i % numCols) + 1
            }}>
                <ItemTelaInicial {...item}/>
            </div>
        });
        return (
            <PlanoFundo bg={bg.menu}>
                <div className="MenuPrincipal">
                    <div className="MenuPrincipal-grade">{itens}</div>

                </div>
                <p className="MenuPrincipal-botaoSair"
                   onClick={() => this.props.autenticador.logout()}>Sair</p>
            </PlanoFundo>
        );
    }
}

export default MenuPrincipal;