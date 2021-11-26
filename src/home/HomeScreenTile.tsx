import React from "react";
import './HomeScreenTile.css';

export interface HomeScreenTileProps {
    name: string;
    icon: string;
    route?: string;
}

export class HomeScreenTile extends React.Component<HomeScreenTileProps, {}> {
    render() {
        return <div className="HomeScreenTile">
            <div className="HomeScreenTile-bg">
                <div className="HomeScreenTile-fg" onClick={() => {
                    const route = this.props.route;
                    if (route == null) return;
                    window.location.href = route;
                }}>
                    <p className="HomeScreenTile-label">{this.props.name}</p>
                    <img style={{height: "100px", width: undefined}} src={this.props.icon}/>
                </div>
            </div>
        </div>;
    }
}
