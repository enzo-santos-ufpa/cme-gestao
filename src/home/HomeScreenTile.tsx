import React from "react";
import './HomeScreenTile.css';

export interface HomeScreenTileProps {
    name: string;
    icon: string;
}

export class HomeScreenTile extends React.Component<HomeScreenTileProps, {}> {
    render() {
        return <div className="HomeScreenTile">
            <div className="HomeScreenTile-bg">
                <div className="HomeScreenTile-fg">
                    <p className="HomeScreenTile-label">{this.props.name}</p>
                    <img style={{height: "150px", width: undefined}} src={this.props.icon}/>
                </div>
            </div>
        </div>;
    }
}
