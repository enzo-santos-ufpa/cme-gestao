import React from "react";
import './Aba.css';

type Props = { text: string, isSelected: boolean, onChanged: () => void };

export default class Aba extends React.Component<Props, {}> {
    render() {
        return <p
            className={this.props.isSelected ? "Aba-selected" : "Aba-default"}
            onClick={() => this.props.onChanged()}>{this.props.text}</p>;
    }
}