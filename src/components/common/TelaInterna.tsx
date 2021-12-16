import React from "react";
import BarraLateral from "./BarraLateral";

export default class TelaInterna extends React.Component {
    render() {
        return <div style={{display: "flex", flexDirection: "row", alignSelf: "stretch"}}>
            <BarraLateral/>
            <div style={{flex: "1"}}>
                {this.props.children}
            </div>
        </div>;
    }
}