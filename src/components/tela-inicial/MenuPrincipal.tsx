import React from "react";
import './MenuPrincipal.css';
import {ItemTelaInicial, ItemTelaInicialProps} from "./ItemTelaInicial";
import icPeople from "../../assets/people-icon.png";
import icSearch from "../../assets/magnifier-icon.png";
import icChart from "../../assets/chart-icon.png";
import icCheck from "../../assets/check-icon.png";
import {PropsAutenticador} from "./TelaInicial";
import PlanoFundo, {bg} from "../common/PlanoFundo";

class MenuPrincipal extends React.Component<PropsAutenticador, {}> {
    private static readonly colunas = 3;
    private static readonly itens: Array<ItemTelaInicialProps> = [
        {
            nome: "Cadastro\nde Usuário",
            icone: {valor: icPeople, alt: "Ícone de grupo de pessoas"},
        },
        {
            nome: "Consulta de\nInstituições",
            icone: {valor: icSearch, alt: "Ícone de busca"},
            caminhoRota: "/consulta-escolas"
        },
        {
            nome: "Tabelas e\nGráficos",
            icone: {valor: icChart, alt: "Ícone de gráficos"},
        },
        {
            nome: "Autorização\nde Cadastro",
            icone: {valor: icCheck, alt: "Ícone de verificação"}
        },
        {
            nome: "Consultar\nrelatórios",
            icone: {valor: icChart, alt: "Ícone de gráficos"}
        },
    ];

    render() {
        const numCols = MenuPrincipal.colunas;
        const itens = MenuPrincipal.itens.map((item, i) => {
            return <div key={i} style={{
                gridRow: (i / numCols) + 1,
                gridColumn: (i % numCols) + 1
            }}>
                <ItemTelaInicial nome={item.nome}
                                 icone={item.icone}
                                 caminhoRota={item.caminhoRota}/>
            </div>
        });
        return (
            <PlanoFundo bg={bg.menu}>
                <p className="MenuPrincipal-botaoSair"
                   onClick={(_) => this.props.autenticador.logout()}>Sair</p>
                <div className="MenuPrincipal-grade"
                     style={{
                         gridTemplateColumns: Array(numCols).fill("1fr").join(" "),
                     }}>{itens}</div>
            </PlanoFundo>
        );
    }
}

export default MenuPrincipal;