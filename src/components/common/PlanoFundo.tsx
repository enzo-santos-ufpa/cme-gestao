import bgTela from '../../assets/background-telas-internas.jpg';
import bgMenu from '../../assets/background-painel.png';
import bgLogin from '../../assets/background-login.jpg';
import React from "react";
import './PlanoFundo.css';

export const bg = {tela: bgTela, menu: bgMenu, login: bgLogin};

type _Props = { bg: string };

class PlanoFundo extends React.Component<_Props, {}> {
    render() {
        return <div className="PlanoFundo" style={{backgroundImage: `url(${this.props.bg})`}}>
            {this.props.children}
        </div>;
    }
}

export default PlanoFundo;
