import React from 'react';
import bg from '../assets/background-painel.png'
import icCalendar from '../assets/calendar-icon.png';
import icChat from '../assets/chat-icon.png';
import icChart from '../assets/chart-icon.png';
import icCheck from '../assets/check-icon.png';
import icMagnifier from '../assets/magnifier-icon.png';
import icPeople from '../assets/people-icon.png';
import './HomeScreen.css';
import {HomeScreenTile, HomeScreenTileProps} from "./HomeScreenTile";

class HomeScreenTileProperty implements HomeScreenTileProps {
    name: string;
    icon: string;

    constructor(name: string, icon: string) {
        this.name = name;
        this.icon = icon;
    }
}

class HomeScreen extends React.Component {
    // from #85b6ee to #dcf0f7
    render() {
        const cols = 3;
        const tiles = [
            new HomeScreenTileProperty("Cadastro de\nUsuários", icPeople),
            new HomeScreenTileProperty("Consulta de\nInstituições", icMagnifier),
            new HomeScreenTileProperty("Tabelas e\nGráficos", icChart),
            new HomeScreenTileProperty("Instituições com\nValidade Vencida", icCalendar),
            new HomeScreenTileProperty("Avaliação de\nSituação de Regularização", icCheck),
            new HomeScreenTileProperty("Atendimento de\nChamados", icChat),
        ].map((property, i) => {
            return <div key={i} style={{
                gridRow: (i / cols) + 1,
                gridColumn: (i % cols) + 1
            }}>
                <HomeScreenTile name={property.name} icon={property.icon}/>
            </div>
        });
        return (
            <div
                className="HomeScreen-bg"
                style={{
                    backgroundImage: `url(${bg})`,
                }}>
                <div style={{
                    padding: "0px 100px",
                    height: "100%",
                    alignItems: "center",
                    justifyContent: "center",
                    display: "grid",
                    gap: "0px 50px",
                    gridTemplateColumns: Array(cols).fill("1fr").join(" "),
                }}>{tiles}</div>
            </div>
        );
    }
}

export default HomeScreen;
