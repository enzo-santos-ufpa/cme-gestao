import React from "react";
import Forms from "../../../models/form";
import ReactInputMask from "react-input-mask";

type PropsComponenteCampo = { className?: string, style?: React.CSSProperties };

type PropsCampo<F, T extends string> = {
    campo: Forms.Campo<F>,
    onChanged: () => void,
    flex?: number,
    estilo?: Partial<Record<"campo" | T, PropsComponenteCampo>>,
};

export type PropsCampoTexto = PropsCampo<string, "nome" | "divisor" | "caixaTexto" | "erro"> & { mask?: string };

export class CampoTexto extends React.Component<PropsCampoTexto, {}> {
    render() {
        const mask: string | undefined = this.props.mask;
        const campo = this.props.campo;
        return <label {...this.props.estilo?.campo}>
            <div style={{display: "flex", flexDirection: "row"}}>
                <p {...this.props.estilo?.nome}>{campo.nome}</p>
                <div {...this.props.estilo?.divisor}/>
                <ReactInputMask
                    mask={mask == null ? [/.*/] : mask}
                    value={campo.valor}
                    {...this.props.estilo?.caixaTexto}
                    onChange={(e) => {
                        campo.valor = e.target.value;
                        this.props.onChanged();
                    }}/>
            </div>
            <p {...this.props.estilo?.erro}>{campo.erro}</p>
        </label>;
    }
}

type PropsCampoMultiplaEscolha = PropsCampo<string, "erro"> & { nome: string, opcoes: Readonly<string[]> };

export class CampoUnicaEscolha extends React.Component<PropsCampoMultiplaEscolha, {}> {
    render() {
        const campo = this.props.campo;
        return <div>
            <select
                {...this.props.estilo?.campo}
                value={campo.valor.length ? campo.valor : this.props.nome}
                onChange={(e) => {
                    const i = e.target.selectedIndex;
                    campo.valor = i > 0 ? e.target.value : "";
                    this.props.onChanged();
                }}>
                <option>{this.props.nome}</option>
                {this.props.opcoes.map(value => <option>{value}</option>)}
            </select>
            <p {...this.props.estilo?.erro}>{this.props.campo.erro}</p>
        </div>;
    }
}
