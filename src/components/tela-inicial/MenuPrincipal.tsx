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

class MenuPrincipal extends React.Component<PropsAutenticador, {}> {
    private static readonly colunas = 3;
    private static readonly itens: Array<ItemTelaInicialProps> = [
        {nome: "Cadastro de\nUsuários", caminhoIcone: icPeople},
        {nome: "Consulta de\nInstituições", caminhoIcone: icSearch, caminhoRota: "/consulta-escolas"},
        {nome: "Tabelas e\nGráficos", caminhoIcone: icChart},
        {nome: "Instituições com\nValidade Vencida", caminhoIcone: icCalendar, caminhoRota: "/valida-escolas"},
        {nome: "Avaliação de\nSituação de Regularização", caminhoIcone: icCheck},
        {nome: "Atendimento de\nChamados", caminhoIcone: icChat},
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
            <div className="MenuPrincipal-bg">
                <div className="MenuPrincipal-grade"
                     style={{
                         gridTemplateColumns: Array(numCols).fill("1fr").join(" "),
                     }}>{itens}</div>
            </div>
        );
    }
}

export default MenuPrincipal;