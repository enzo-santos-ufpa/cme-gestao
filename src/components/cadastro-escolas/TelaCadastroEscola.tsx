import React, {FormEvent} from "react";
import './TelaCadastroEscolas.css';
import '../common/Tela.css';
import Forms from "../../models/form";
import {escolas} from "../../lib/api";
import PlanoFundo, {bg} from "../common/PlanoFundo";
import {EscolaBase} from "../../models/Escola";
import ReactInputMask from "react-input-mask";
import Campo = Forms.Campo;
import Validador, {Validadores} from "../../models/Validador";
import {parseDate} from "../../lib/utils";

type FormularioCadastro = Forms.Formulario<keyof EscolaBase>;
type Estado = { form: FormularioCadastro };


type PropsCampoCadastro = { campo: Campo, onChange: () => void };

class CampoCadastroEscola extends React.Component<PropsCampoCadastro, {}> {
    render() {
        const campo = this.props.campo;
        return (
            <label className="TelaCadastroEscolas-campo">
                <div>
                    <div style={{display: "flex", flexDirection: "row"}}>
                        {campo.nome}
                        <div className="TelaCadastroEscolas-divisorCampo"/>
                        <ReactInputMask
                            mask={campo.mask == null ? [/.*/] : campo.mask}
                            value={campo.texto}
                            className="TelaCadastroEscolas-caixaTexto"
                            onChange={(e) => {
                                campo.consome(e);
                                this.props.onChange();
                            }}/>
                    </div>
                    <p>{campo.erro}</p>
                </div>
            </label>
        );
    }
}


class TelaCadastroEscola extends React.Component<{}, Estado> {
    state: Estado

    constructor(props: {}) {
        super(props);

        this.state = {
            form: new Forms.Formulario({
                "nome": new Forms.Campo({
                    nome: "Nome da instituição",
                    texto: "",
                    validador: new Validador().use(Validadores.required()),
                }),
                "sigla": new Forms.Campo({
                    nome: "Sigla",
                    texto: "",
                    validador: new Validador().use(Validadores.required()),
                }),
                "cnpj": new Forms.Campo({
                    nome: "CNPJ",
                    texto: "",
                    validador: new Validador().use(Validadores.required()).use(Validadores.cnpj()),
                    mask: "99.999.999/9999-99",
                }),
                "dataCriacao": new Forms.Campo({
                    nome: "Data de fundação",
                    texto: "",
                    validador: new Validador().use(Validadores.required()).use(Validadores.date()),
                    mask: "99/99/9999",
                }),
                "codigoInep": new Forms.Campo({
                    nome: "Código INEP",
                    texto: "",
                    validador: new Validador().use(Validadores.required()).use((texto) => !texto.match(/^\d{8}$/) ? "O código INEP deve estar no formato XXXXXXXX." : undefined),
                    mask: "99999999",
                }),
                "nomeEntidadeMantenedora": new Forms.Campo({
                    nome: "Nome da entidade mantenedora",
                    texto: "",
                    validador: new Validador().use(Validadores.required()),
                }),
                "cnpjConselho": new Forms.Campo({
                    nome: "CNPF/Conselho",
                    texto: "",
                    validador: new Validador().use(Validadores.required()).use(Validadores.cnpj()),
                    mask: "99.999.999/9999-99",
                }),
                "vigenciaConselho": new Forms.Campo({
                    nome: "Vigência/Conselho",
                    texto: "",
                    validador: new Validador().use(Validadores.required()),
                }),
            }),
        };
        this.onSubmit = this.onSubmit.bind(this);
    }

    private async onSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const form = this.state.form.clone();
        form.chaves.forEach(chave => form.campo(chave).valida());
        if (form.possuiErro) {
            this.setState({form});
        } else {
            const json = form.json();
            try {
                await escolas.criar({
                    nome: json["nome"],
                    cnpj: json["cnpj"],
                    sigla: json["sigla"],
                    dataCriacao: parseDate(json["dataCriacao"])!,
                    codigoInep: json["codigoInep"],
                    nomeEntidadeMantenedora: json["nomeEntidadeMantenedora"],
                    cnpjConselho: json["cnpjConselho"],
                    vigenciaConselho: json["vigenciaConselho"],
                });
            } catch (e) {
                alert("Ocorreu um erro. Tente novamente mais tarde.");
                return;
            }
            alert("Escola cadastrada com sucesso!");
            window.history.back();
        }
    }

    private updateSelf(): void {
        this.setState(this.state);
    }

    render() {
        const form = this.state.form;
        return (
            <PlanoFundo bg={bg.tela}>
                <div className="TelaCadastroEscolas">
                    <p className="Tela-titulo">Cadastrar escola</p>
                    <form onSubmit={this.onSubmit}>
                        <div className="TelaCadastroEscolas-formulario">
                            <div style={{display: "flex", flexDirection: "row"}}>
                                <CampoCadastroEscola campo={form.campo("nome")}
                                                     onChange={() => this.updateSelf()}/>
                                <CampoCadastroEscola campo={form.campo("sigla")}
                                                     onChange={() => this.updateSelf()}/>
                                <CampoCadastroEscola campo={form.campo("cnpj")}
                                                     onChange={() => this.updateSelf()}/>
                            </div>
                            <div style={{display: "flex", flexDirection: "row"}}>
                                <CampoCadastroEscola campo={form.campo("dataCriacao")}
                                                     onChange={() => this.updateSelf()}/>
                                <CampoCadastroEscola campo={form.campo("codigoInep")}
                                                     onChange={() => this.updateSelf()}/>
                            </div>
                            <div style={{display: "flex", flexDirection: "row"}}>
                                <CampoCadastroEscola campo={form.campo("nomeEntidadeMantenedora")}
                                                     onChange={() => this.updateSelf()}/>
                            </div>
                            <div style={{display: "flex", flexDirection: "row"}}>
                                <CampoCadastroEscola campo={form.campo("cnpjConselho")}
                                                     onChange={() => this.updateSelf()}/>
                                <CampoCadastroEscola campo={form.campo("vigenciaConselho")}
                                                     onChange={() => this.updateSelf()}/>
                            </div>
                        </div>
                        <input type="submit" value="Cadastrar"/>
                        <button type="button" onClick={(_) => {
                            form.campo("nome").texto = Math.random().toString(36).replace(/[^a-z]+/g, '').slice(0, 10);
                            form.campo("nomeEntidadeMantenedora").texto = Math.random().toString(36).replace(/[^a-z]+/g, '').slice(0, 10);
                            form.campo("sigla").texto = Math.random().toString(36).replace(/[^a-z]+/g, '').slice(0, 5);
                            form.campo("vigenciaConselho").texto = Math.random().toString().replace(/[^0-9]+/g, '').slice(0, 14);
                            form.campo("codigoInep").texto = Math.random().toString().replace(/[^0-9]+/g, '').slice(0, 8);
                            form.campo("dataCriacao").texto = new Date(2021, Math.floor(Math.random() * 12), Math.floor(Math.random() * 31) + 1).toLocaleString().split(' ')[0];
                            form.campo("cnpj").texto = `${Math.floor(Math.random() * 100)}.${Math.floor(Math.random() * 1000)}.${Math.floor(Math.random() * 1000)}/${Math.floor(Math.random() * 10000) + 1000}-${Math.floor(Math.random() * 100)}`
                            form.campo("cnpjConselho").texto = `${Math.floor(Math.random() * 100)}.${Math.floor(Math.random() * 1000)}.${Math.floor(Math.random() * 1000)}/${Math.floor(Math.random() * 10000) + 1000}-${Math.floor(Math.random() * 100)}`
                            this.updateSelf();
                        }}>
                            Preencher formulário (será removido)
                        </button>
                    </form>
                </div>
            </PlanoFundo>
        );
    }
}

export default TelaCadastroEscola;