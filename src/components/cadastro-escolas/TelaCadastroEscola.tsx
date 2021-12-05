import React, {ChangeEvent, FormEvent} from "react";
import './TelaCadastroEscolas.css';
import '../common/Tela.css';
import Forms from "../../models/form";
import {escolas} from "../../lib/api";
import PlanoFundo, {bg} from "../common/PlanoFundo";

type _Estado = Forms.Formulario<"nome" | "processoAtual" | "resolucao" | "tempoVigencia" | "dataInicio">;

function parseDate(value: string): Date {
    const tokens = value.split("/");
    return new Date(
        parseInt(tokens[2], 10),
        parseInt(tokens[1], 10) - 1,
        parseInt(tokens[0], 10),
    );
}

class TelaCadastroEscola extends React.Component<{}, _Estado> {
    state: _Estado

    constructor(props: {}) {
        super(props);

        this.state = {
            nome: {texto: ""},
            processoAtual: {texto: ""},
            resolucao: {texto: ""},
            tempoVigencia: {texto: ""},
            dataInicio: {texto: ""},
        };
        this.onSubmit = this.onSubmit.bind(this);
    }

    private atualizaCampo(e: ChangeEvent<HTMLInputElement>, nomeCampo: keyof _Estado) {
        const estado = this.state;
        const novoEstado = {...estado};
        novoEstado[nomeCampo] = {...novoEstado[nomeCampo], texto: e.target.value};
        this.setState(novoEstado);
    }

    private static valida(estado: _Estado): _Estado | null {
        const novoEstado = {...estado};
        Forms.defineErro(novoEstado.nome, "Insira o nome da instituição.", (v) => /^.+$/.test(v));
        Forms.defineErro(novoEstado.processoAtual, "Insira o nome do processo atual.", (v) => /^.+$/.test(v));
        Forms.defineErro(novoEstado.resolucao, "Insira a resolução.", (v) => /^.+$/.test(v));
        Forms.defineErro(novoEstado.dataInicio, "Insira a data de início.", (v) => /^.+$/.test(v));
        Forms.defineErro(novoEstado.tempoVigencia, "Insira o tempo de vigência.", (v) => /^.+$/.test(v));
        Forms.defineErro(novoEstado.dataInicio, "A data deve estar no formado DD/MM/YYYY.", (v) => /^\d{2}\/\d{2}\/\d{4}$/.test(v));
        Forms.defineErro(novoEstado.tempoVigencia, "O tempo de vigência fornecido é inválido.", (v) => /^\d+$/.test(v));
        return Forms.possuiErro(novoEstado) ? novoEstado : null;
    }

    private async onSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const novoEstado = TelaCadastroEscola.valida(this.state);
        if (novoEstado !== null) {
            this.setState(novoEstado);
        } else {
            const json = Forms.json(this.state);

            await escolas.criar(
                json["nome"],
                json["processoAtual"],
                json["resolucao"],
                parseInt(json["tempoVigencia"]),
                parseDate(json["dataInicio"]),
            );
            alert("Escola cadastrada com sucesso!");
            window.history.back();
        }
    }

    render() {
        return (
            <PlanoFundo bg={bg.tela}>
                <div className="TelaCadastroEscolas">
                    <p className="Tela-titulo">Cadastrar escola</p>
                    <form onSubmit={this.onSubmit}>
                        <div className="TelaCadastroEscolas-formulario">
                            <label className="TelaCadastroEscolas-campo">
                                Nome da instituição:
                                <div className="TelaCadastroEscolas-divisorCampo"/>
                                <input type="text"
                                       className="TelaCadastroEscolas-caixaTexto"
                                       value={this.state.nome.texto}
                                       onChange={(e) => this.atualizaCampo(e, "nome")}/>
                                <p>{this.state.nome.erro}</p>
                            </label>
                            <label className="TelaCadastroEscolas-campo">
                                Processo atual:
                                <div className="TelaCadastroEscolas-divisorCampo"/>
                                <input type="text"
                                       value={this.state.processoAtual.texto}
                                       className="TelaCadastroEscolas-caixaTexto"
                                       onChange={(e) => this.atualizaCampo(e, "processoAtual")}/>
                                <p>{this.state.processoAtual.erro}</p>
                            </label>
                            <label className="TelaCadastroEscolas-campo">
                                Resolução:
                                <div className="TelaCadastroEscolas-divisorCampo"/>
                                <input type="text"
                                       value={this.state.resolucao.texto}
                                       className="TelaCadastroEscolas-caixaTexto"
                                       onChange={(e) => this.atualizaCampo(e, "resolucao")}/>
                                <p>{this.state.resolucao.erro}</p>
                            </label>
                            <label className="TelaCadastroEscolas-campo">
                                Início de vigência (DD/MM/YYYY):
                                <div className="TelaCadastroEscolas-divisorCampo"/>
                                <input type="text"
                                       value={this.state.dataInicio.texto}
                                       className="TelaCadastroEscolas-caixaTexto"
                                       onChange={(e) => this.atualizaCampo(e, "dataInicio")}/>
                                <p>{this.state.dataInicio.erro}</p>
                            </label>
                            <label className="TelaCadastroEscolas-campo">
                                Tempo de vigência (anos):
                                <div className="TelaCadastroEscolas-divisorCampo"/>
                                <input type="text"
                                       value={this.state.tempoVigencia.texto}
                                       className="TelaCadastroEscolas-caixaTexto"
                                       onChange={(e) => this.atualizaCampo(e, "tempoVigencia")}/>
                                <p>{this.state.tempoVigencia.erro}</p>
                            </label>
                        </div>
                        <input type="submit" value="Cadastrar"/>
                    </form>
                </div>
            </PlanoFundo>
        );
    }
}

export default TelaCadastroEscola;