import React from "react";
import './MenuPrincipal.css';
import {ItemTelaInicial, ItemTelaInicialProps} from "./ItemTelaInicial";
import icPeople from "../../assets/people-icon.png";
import icSearch from "../../assets/magnifier-icon.png";
import icChart from "../../assets/chart-icon.png";
import icCalendar from "../../assets/calendar-icon.png";
import icCheck from "../../assets/check-icon.png";
import icChat from "../../assets/chat-icon.png";
import {PropsAutenticador} from "./TelaInicial";
import PlanoFundo, {bg} from "../common/PlanoFundo";

class MenuPrincipal extends React.Component<PropsAutenticador, {}> {
    private static readonly colunas = 3;
    private static readonly itens: Array<ItemTelaInicialProps> = [
        {nome: "Cadastro\nde Usuário", caminhoIcone: icPeople},
        {nome: "Consulta de\nInstituições", caminhoIcone: icSearch, caminhoRota: "/consulta-escolas"},
        {nome: "Tabelas e\nGráficos", caminhoIcone: icChart},
        {nome: "Autorização\nde Cadastro", caminhoIcone: icCheck},
        {nome: "Consultar\nrelatórios", caminhoIcone: icChart},
    ];

    render() {
        const numCols = MenuPrincipal.colunas;
        const itens = MenuPrincipal.itens.map((item, i) => {
            return <div key={i} style={{
                gridRow: (i / numCols) + 1,
                gridColumn: (i % numCols) + 1
            }}>
                <ItemTelaInicial nome={item.nome} caminhoIcone={item.caminhoIcone}
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