import React from "react";
import './BarraLateral.css';
import {
    BsBarChartFill,
    BsCardChecklist,
    BsFileEarmarkPostFill,
    BsHouse,
    BsHouseFill,
    BsPeopleFill,
    BsSearch
} from "react-icons/bs";
import {IconType} from "react-icons";
import ReactTooltip from "react-tooltip";

type PropsItemBarraLateral = { nome: string, elemento: IconType, href?: string };

export default class BarraLateral extends React.Component {
    render() {
        const href = new URL(window.location.href).pathname;
        const props: PropsItemBarraLateral[] = [
            {nome: "Início", elemento: BsHouseFill, href: "/"},
            {nome: "Cadastro de usuário", elemento: BsPeopleFill},
            {nome: "Consulta de instituições", elemento: BsSearch, href: "/consulta-escolas"},
            {nome: "Tabelas e gráficos", elemento: BsBarChartFill},
            {nome: "Autorização de cadastro", elemento: BsCardChecklist, href: "/autoriza-cadastro"},
            {nome: "Consultar relatórios", elemento: BsFileEarmarkPostFill},
        ];
        return <div className="BarraLateral">
            {props.map(prop => {
                const possuiHref = prop.href != null;
                const isAtual = href === prop.href;
                return <div className="BarraLateral-item"
                            data-tip={(!possuiHref || isAtual) ? "" : prop.nome}
                            style={{cursor: (!possuiHref || isAtual) ? "default" : "pointer"}}
                            onClick={() => {
                                if (isAtual) return;
                                if (prop.href == null) return;
                                window.location.href = prop.href;
                            }}>
                    {prop.elemento({size: 30, color: isAtual ? "darkslateblue" : "black"})}
                </div>
            })
            }
            <ReactTooltip/>
        </div>;
    }
}
