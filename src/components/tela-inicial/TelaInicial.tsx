import React from 'react';
import icCalendar from '../../assets/calendar-icon.png';
import icChat from '../../assets/chat-icon.png';
import icChart from '../../assets/chart-icon.png';
import icCheck from '../../assets/check-icon.png';
import icSearch from '../../assets/magnifier-icon.png';
import icPeople from '../../assets/people-icon.png';
import './TelaInicial.css';
import {ItemTelaInicial, ItemTelaInicialProps} from "./ItemTelaInicial";


class TelaInicial extends React.Component {
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
        const numCols = TelaInicial.colunas;
        const itens = TelaInicial.itens.map((property, i) => {
            return <div key={i} style={{
                gridRow: (i / numCols) + 1,
                gridColumn: (i % numCols) + 1
            }}>
                <ItemTelaInicial nome={property.nome} caminhoIcone={property.caminhoIcone}
                                 caminhoRota={property.caminhoRota}/>
            </div>
        });
        return (
            <div className="TelaInicial-bg">
                <div className="TelaInicial-grade"
                     style={{
                         gridTemplateColumns: Array(numCols).fill("1fr").join(" "),
                     }}>{itens}</div>
            </div>
        );
    }
}

export default TelaInicial;
