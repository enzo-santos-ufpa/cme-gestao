import React from "react";
import Forms from "../../../models/form";
import ReactInputMask from "react-input-mask";

type PropsComponenteCampo = { className?: string, style?: React.CSSProperties };

type PropsCampo<T extends string> = {
    campo: Forms.Campo,
    onChanged: () => void,
    flex?: number,
    estilo?: Record<"campo" | T, PropsComponenteCampo | undefined>,
};

export type PropsCampoTexto = PropsCampo<"nome" | "divisor" | "caixaTexto" | "erro"> & { mask?: string };

export class CampoTexto extends React.Component<PropsCampoTexto, {}> {
    render() {
        const mask = this.props.mask;
        const campo = this.props.campo;
        return <label {...this.props.estilo?.campo}>
            <div style={{display: "flex", flexDirection: "row"}}>
                <p {...this.props.estilo?.nome}>{campo.nome}</p>
                <div {...this.props.estilo?.divisor}/>
                <ReactInputMask
                    mask={mask == null ? [/.*/] : mask}
                    value={campo.texto}
                    {...this.props.estilo?.caixaTexto}
                    onChange={(e) => {
                        campo.consome(e);
                        this.props.onChanged();
                    }}/>
            </div>
            <p {...this.props.estilo?.erro}>{campo.erro}</p>
        </label>;
    }
}

type PropsCampoMultiplaEscolha = PropsCampo<string> & { nome: string, opcoes: Readonly<string[]> };

export class CampoMultiplaEscolha extends React.Component<PropsCampoMultiplaEscolha, {}> {
    render() {
        const campo = this.props.campo;
        return <select
            {...this.props.estilo?.campo}
            value={campo.texto.length ? campo.texto : this.props.nome}
            onChange={(e) => {
                const i = e.target.selectedIndex;
                campo.texto = i > 0 ? e.target.value : "";
                this.props.onChanged();
            }}>
            <option>{this.props.nome}</option>
            {this.props.opcoes.map(value => <option>{value}</option>)}
        </select>;
    }
}
