import React, {FormEvent} from "react";
import './TelaCadastroEscolas.css';
import '../common/Tela.css';
import Forms from "../../models/form";
import {escolas} from "../../lib/api";
import PlanoFundo, {bg} from "../common/PlanoFundo";
import {Processo} from "../../models/tipos";

type FormularioCadastro = Forms.Formulario<"nome" | "processo.nome" | "processo.resolucao" | "processo.duracao" | "processo.inicio">;
type Estado = { form: FormularioCadastro };

function parseDate(value: string): Date {
    const tokens = value.split("/");
    return new Date(
        parseInt(tokens[2], 10),
        parseInt(tokens[1], 10) - 1,
        parseInt(tokens[0], 10),
    );
}

class TelaCadastroEscola extends React.Component<{}, Estado> {
    state: Estado

    constructor(props: {}) {
        super(props);

        this.state = {
            form: new Forms.Formulario({
                "nome": new Forms.Campo(),
                "processo.nome": new Forms.Campo(),
                "processo.resolucao": new Forms.Campo(),
                "processo.duracao": new Forms.Campo(),
                "processo.inicio": new Forms.Campo(),
            }),
        };
        this.onSubmit = this.onSubmit.bind(this);
    }

    private async onSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const form = this.state.form.clone();
        const valido = form.valida((form) => {
            form.campo("nome").valida("Insira o nome da instituição.", (v) => /^.+$/.test(v));
            form.campo("processo.nome").valida("Insira o nome do processo atual.", (v) => /^.+$/.test(v));
            form.campo("processo.resolucao").valida("Insira a resolução.", (v) => /^.+$/.test(v));
            form.campo("processo.inicio").valida("Insira a data de início.", (v) => /^.+$/.test(v));
            form.campo("processo.duracao").valida("Insira o tempo de vigência.", (v) => /^.+$/.test(v));
            form.campo("processo.inicio").valida("A data deve estar no formato DD/MM/YYYY.", (v) => /^\d{2}\/\d{2}\/\d{4}$/.test(v));
            form.campo("processo.duracao").valida("O tempo de vigência fornecido é inválido.", (v) => /^\d+$/.test(v));
        });
        if (!valido) {
            this.setState({form});
        } else {
            const json = form.json();
            await escolas.criar({
                nome: json["nome"],
                processoAtual: new Processo({
                    nome: json["processo.nome"],
                    resolucao: json["processo.resolucao"],
                    inicio: parseDate(json["processo.inicio"]),
                    duracao: parseInt(json["processo.duracao"]),
                }),
            });
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
                                       value={this.state.form.campo("nome").texto}
                                       onChange={(e) => {
                                           const form = this.state.form;
                                           form.campo("nome").consome(e);
                                           this.setState({form});
                                       }}/>
                                <p>{this.state.form.campo("nome").erro}</p>
                            </label>
                            <label className="TelaCadastroEscolas-campo">
                                Processo atual:
                                <div className="TelaCadastroEscolas-divisorCampo"/>
                                <input type="text"
                                       value={this.state.form.campo("processo.nome").texto}
                                       className="TelaCadastroEscolas-caixaTexto"
                                       onChange={(e) => {
                                           const form = this.state.form;
                                           form.campo("processo.nome").consome(e);
                                           this.setState({form});
                                       }}/>
                                <p>{this.state.form.campo("processo.nome").erro}</p>
                            </label>
                            <label className="TelaCadastroEscolas-campo">
                                Resolução:
                                <div className="TelaCadastroEscolas-divisorCampo"/>
                                <input type="text"
                                       value={this.state.form.campo("processo.resolucao").texto}
                                       className="TelaCadastroEscolas-caixaTexto"
                                       onChange={(e) => {
                                           const form = this.state.form;
                                           form.campo("processo.resolucao").consome(e);
                                           this.setState({form});
                                       }}/>
                                <p>{this.state.form.campo("processo.resolucao").erro}</p>
                            </label>
                            <label className="TelaCadastroEscolas-campo">
                                Início de vigência (DD/MM/YYYY):
                                <div className="TelaCadastroEscolas-divisorCampo"/>
                                <input type="text"
                                       value={this.state.form.campo("processo.inicio").texto}
                                       className="TelaCadastroEscolas-caixaTexto"
                                       onChange={(e) => {
                                           const form = this.state.form;
                                           form.campo("processo.inicio").consome(e);
                                           this.setState({form});
                                       }}/>
                                <p>{this.state.form.campo("processo.inicio").erro}</p>
                            </label>
                            <label className="TelaCadastroEscolas-campo">
                                Tempo de vigência (anos):
                                <div className="TelaCadastroEscolas-divisorCampo"/>
                                <input type="text"
                                       value={this.state.form.campo("processo.duracao").texto}
                                       className="TelaCadastroEscolas-caixaTexto"
                                       onChange={(e) => {
                                           const form = this.state.form;
                                           form.campo("processo.duracao").consome(e);
                                           this.setState({form});
                                       }}/>
                                <p>{this.state.form.campo("processo.duracao").erro}</p>
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