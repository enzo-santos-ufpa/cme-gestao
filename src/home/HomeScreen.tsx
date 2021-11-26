import React from 'react';
import bg from '../assets/background-painel.png'
import icCalendar from '../assets/calendar-icon.png';
import icChat from '../assets/chat-icon.png';
import icChart from '../assets/chart-icon.png';
import icCheck from '../assets/check-icon.png';
import icSearch from '../assets/magnifier-icon.png';
import icPeople from '../assets/people-icon.png';
import './HomeScreen.css';
import {HomeScreenTile, HomeScreenTileProps} from "./HomeScreenTile";


class HomeScreen extends React.Component {
    private static readonly cols = 3;
    private static readonly tiles: Array<HomeScreenTileProps> = [
        {name: "Cadastro de\nUsuários", icon: icPeople},
        {name: "Consulta de\nInstituições", icon: icSearch, route: "/consultaEscola"},
        {name: "Tabelas e\nGráficos", icon: icChart},
        {name: "Instituições com\nValidade Vencida", icon: icCalendar},
        {name: "Avaliação de\nSituação de Regularização", icon: icCheck},
        {name: "Atendimento de\nChamados", icon: icChat},
    ];

    render() {
        const cols = HomeScreen.cols;
        const tiles = HomeScreen.tiles.map((property, i) => {
            return <div key={i} style={{
                gridRow: (i / cols) + 1,
                gridColumn: (i % cols) + 1
            }}>
                <HomeScreenTile name={property.name} icon={property.icon} route={property.route}/>
            </div>
        });
        return (
            <div
                className="HomeScreen-bg"
                style={{
                    backgroundImage: `url(${bg})`,
                }}>
                <div className="HomeScreen-grid"
                     style={{
                         gridTemplateColumns: Array(cols).fill("1fr").join(" "),
                     }}>{tiles}</div>
            </div>
        );
    }
}

export default HomeScreen;
