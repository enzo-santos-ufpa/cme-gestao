import React, {ChangeEvent, FormEvent} from "react";
import './TelaCadastroEscolas.css';
import Formulario from "../../models/form";
import {escolas} from "../../lib/api";

type _Estado = Formulario.Tipo<"nome" | "processoAtual" | "resolucao" | "tempoVigencia" | "dataInicio">;

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
        Formulario.defineErro(novoEstado.nome, "Insira o nome da instituição.", (v) => /^.+$/.test(v));
        Formulario.defineErro(novoEstado.processoAtual, "Insira o nome do processo atual.", (v) => /^.+$/.test(v));
        Formulario.defineErro(novoEstado.resolucao, "Insira a resolução.", (v) => /^.+$/.test(v));
        Formulario.defineErro(novoEstado.dataInicio, "Insira a data de início.", (v) => /^.+$/.test(v));
        Formulario.defineErro(novoEstado.tempoVigencia, "Insira o tempo de vigência.", (v) => /^.+$/.test(v));
        Formulario.defineErro(novoEstado.dataInicio, "A data deve estar no formado DD/MM/YYYY.", (v) => /^\d{2}\/\d{2}\/\d{4}$/.test(v));
        Formulario.defineErro(novoEstado.tempoVigencia, "O tempo de vigência fornecido é inválido.", (v) => /^\d+$/.test(v));
        return Formulario.possuiErro(novoEstado) ? novoEstado : null;
    }

    private async onSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const novoEstado = TelaCadastroEscola.valida(this.state);
        if (novoEstado !== null) {
            this.setState(novoEstado);
        } else {
            const json = Formulario.json(this.state);

            await escolas.create(
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
            <div>
                <form onSubmit={this.onSubmit}>
                    <div style={{display: "flex", flexDirection: "column"}}>
                        <label>
                            Nome da instituição:
                            <input type="text"
                                   value={this.state.nome.texto}
                                   onChange={(e) => this.atualizaCampo(e, "nome")}/>
                            <p>{this.state.nome.erro}</p>
                        </label>
                        <label>
                            Processo atual:
                            <input type="text" value={this.state.processoAtual.texto}
                                   onChange={(e) => this.atualizaCampo(e, "processoAtual")}/>
                            <p>{this.state.processoAtual.erro}</p>
                        </label>
                        <label>
                            Resolução:
                            <input type="text" value={this.state.resolucao.texto}
                                   onChange={(e) => this.atualizaCampo(e, "resolucao")}/>
                            <p>{this.state.resolucao.erro}</p>
                        </label>
                        <label>
                            Data de início de vigência:
                            <input type="text" value={this.state.dataInicio.texto}
                                   onChange={(e) => this.atualizaCampo(e, "dataInicio")}/>
                            <p>{this.state.dataInicio.erro}</p>
                        </label>
                        <label>
                            Tempo de vigência:
                            <input type="text" value={this.state.tempoVigencia.texto}
                                   onChange={(e) => this.atualizaCampo(e, "tempoVigencia")}/>
                            <p>{this.state.tempoVigencia.erro}</p>
                        </label>
                    </div>
                    <input type="submit" value="Cadastrar"/>
                </form>
            </div>
        );
    }
}

export default TelaCadastroEscola;