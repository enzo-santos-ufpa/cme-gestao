import React, {FormEvent} from "react";
import './TelaCadastroEscolas.css';
import '../common/Tela.css';
import Forms from "../../models/form";
import {escolas} from "../../lib/api";
import {constantes, encoding, EscolaBase} from "../../models/Escola";
import Validador, {Validadores} from "../../models/Validador";
import {random} from "../../lib/utils";
import {Flatten} from "../../models/tipos";
import isDistrito = constantes.isDistrito;
import tiposEscola = constantes.tiposEscola;
import {CampoTexto, PropsCampoTexto} from "../common/forms/Campo";

type FormularioCadastro = Forms.Formulario<Extract<keyof Flatten<EscolaBase>, string>>;

type Estado = { form: FormularioCadastro };

type PropsCampoTextoCadastro = Omit<PropsCampoTexto, "estilo"> & { flex?: number };

class CampoTextoCadastro extends React.Component<PropsCampoTextoCadastro, any> {
    render() {
        return (
            <CampoTexto {...this.props} estilo={{
                campo: {className: "TelaCadastroEscolas-campo", style: {flex: this.props.flex}},
                nome: {className: "TelaCadastroEscolas-nomeCampo"},
                divisor: {className: "TelaCadastroEscolas-divisorCampo"},
                caixaTexto: {className: "TelaCadastroEscolas-caixaTexto"},
                erro: {className: "TelaCadastroEscolas-erroCampo"},
            }}/>
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
                }),
                "dataCriacao": new Forms.Campo({
                    nome: "Data de fundação",
                    texto: "",
                    validador: new Validador().use(Validadores.required()).use(Validadores.date()),
                }),
                "codigoInep": new Forms.Campo({
                    nome: "Código INEP",
                    texto: "",
                    validador: new Validador().use(Validadores.required()).use((texto) => !texto.match(/^\d{8}$/) ? "O código INEP deve estar no formato XXXXXXXX." : undefined),
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
                }),
                "vigenciaConselho": new Forms.Campo({
                    nome: "Vigência/Conselho",
                    texto: "",
                    validador: new Validador().use(Validadores.required()),
                }),
                "distrito": new Forms.Campo({
                    nome: "Distrito",
                    texto: "",
                    validador: new Validador().use(Validadores.required()).use((texto) => {
                        if (!isDistrito(texto))
                            return `Apenas os seguintes valores são permitidos: ${constantes.distritos.join(", ")}`;
                    }),
                }),
                "cidade": new Forms.Campo({
                    nome: "Cidade",
                    texto: "",
                    validador: new Validador().use(Validadores.required()),
                }),
                "uf": new Forms.Campo({
                    nome: "UF",
                    texto: "",
                    validador: new Validador().use(Validadores.required()),
                }),
                "bairro": new Forms.Campo({
                    nome: "Bairro",
                    texto: "",
                    validador: new Validador().use(Validadores.required()),
                }),
                "cep": new Forms.Campo({
                    nome: "CEP",
                    texto: "",
                    validador: new Validador().use(Validadores.required()).use(Validadores.cep()),
                }),
                "endereco": new Forms.Campo({
                    nome: "Endereço",
                    texto: "",
                    validador: new Validador().use(Validadores.required()),
                }),
                "email": new Forms.Campo({
                    nome: "E-mail institucional",
                    texto: "",
                    validador: new Validador().use(Validadores.required()),
                }),
                "telefone": new Forms.Campo({
                    nome: "Telefone",
                    texto: "",
                    validador: new Validador().use(Validadores.required()),
                }),
                "servidores.diretor.nome": new Forms.Campo({
                    nome: "Nome/Diretor",
                    texto: "",
                    validador: new Validador().use(Validadores.required()),
                }),
                "servidores.diretor.email": new Forms.Campo({
                    nome: "E-mail institucional",
                    texto: "",
                    validador: new Validador().use(Validadores.required()),
                }),
                "servidores.diretor.telefone": new Forms.Campo({
                    nome: "Telefone",
                    texto: "",
                    validador: new Validador().use(Validadores.required()),
                }),
                "servidores.secretario.nome": new Forms.Campo({
                    nome: "Nome/Secretário",
                    texto: "",
                    validador: new Validador().use(Validadores.required()),
                }),
                "servidores.secretario.email": new Forms.Campo({
                    nome: "E-mail institucional",
                    texto: "",
                    validador: new Validador().use(Validadores.required()),
                }),
                "servidores.secretario.telefone": new Forms.Campo({
                    nome: "Telefone",
                    texto: "",
                    validador: new Validador().use(Validadores.required()),
                }),
                "servidores.coordenador.nome": new Forms.Campo({
                    nome: "Nome/Coordenador",
                    texto: "",
                    validador: new Validador().use(Validadores.required()),
                }),
                "servidores.coordenador.email": new Forms.Campo({
                    nome: "E-mail institucional",
                    texto: "",
                    validador: new Validador().use(Validadores.required()),
                }),
                "servidores.coordenador.telefone": new Forms.Campo({
                    nome: "Telefone",
                    texto: "",
                    validador: new Validador().use(Validadores.required()),
                }),
                "tipo.setor": new Forms.Campo({
                    nome: "Setor",
                    texto: "",
                    validador: new Validador().use(Validadores.required()),
                }),
                "tipo.sigla": new Forms.Campo({
                    nome: "Setor",
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
                await escolas.criar(encoding.escolaBase().decode(json));
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
            <div className="TelaCadastroEscolas">
                <p className="Tela-titulo">Cadastrar escola</p>
                <form onSubmit={this.onSubmit}>
                    <div className="TelaCadastroEscolas-formulario">
                        <p>Dados</p>
                        <div className="TelaCadastroEscolas-linhaFormulario">
                            <CampoTextoCadastro flex={6}
                                                campo={form.campo("nome")}
                                                onChanged={() => this.updateSelf()}/>
                            <CampoTextoCadastro flex={3}
                                                campo={form.campo("sigla")}
                                                onChanged={() => this.updateSelf()}/>
                            <CampoTextoCadastro flex={3}
                                                mask={"99.999.999/9999-99"}
                                                campo={form.campo("cnpj")}
                                                onChanged={() => this.updateSelf()}/>
                        </div>
                        <div className="TelaCadastroEscolas-linhaFormulario">
                            <CampoTextoCadastro flex={3}
                                                mask={"99/99/9999"}
                                                campo={form.campo("dataCriacao")}
                                                onChanged={() => this.updateSelf()}/>
                            <CampoTextoCadastro flex={3}
                                                mask={"99999999"}
                                                campo={form.campo("codigoInep")}
                                                onChanged={() => this.updateSelf()}/>
                            <CampoTextoCadastro flex={6}
                                                campo={form.campo("nomeEntidadeMantenedora")}
                                                onChanged={() => this.updateSelf()}/>
                        </div>
                        <div className="TelaCadastroEscolas-linhaFormulario">
                            <CampoTextoCadastro flex={6}
                                                mask={"99.999.999/9999-99"}
                                                campo={form.campo("cnpjConselho")}
                                                onChanged={() => this.updateSelf()}/>
                            <CampoTextoCadastro flex={6}
                                                campo={form.campo("vigenciaConselho")}
                                                onChanged={() => this.updateSelf()}/>
                        </div>
                        <p>Localização</p>
                        <div className="TelaCadastroEscolas-linhaFormulario">
                            <CampoTextoCadastro flex={2}
                                                campo={form.campo("distrito")}
                                                onChanged={() => this.updateSelf()}/>
                            <CampoTextoCadastro flex={3}
                                                campo={form.campo("cidade")}
                                                onChanged={() => this.updateSelf()}/>
                            <CampoTextoCadastro flex={1}
                                                campo={form.campo("uf")}
                                                onChanged={() => this.updateSelf()}/>
                            <CampoTextoCadastro flex={4}
                                                campo={form.campo("bairro")}
                                                onChanged={() => this.updateSelf()}/>
                            <CampoTextoCadastro flex={2}
                                                mask={"999.99-999"}
                                                campo={form.campo("cep")}
                                                onChanged={() => this.updateSelf()}/>
                        </div>
                        <div className="TelaCadastroEscolas-linhaFormulario">
                            <CampoTextoCadastro flex={12}
                                                campo={form.campo("endereco")}
                                                onChanged={() => this.updateSelf()}/>
                        </div>
                        <p>Contato</p>
                        <div className="TelaCadastroEscolas-linhaFormulario">
                            <CampoTextoCadastro flex={6}
                                                campo={form.campo("email")}
                                                onChanged={() => this.updateSelf()}/>
                            <CampoTextoCadastro flex={6}
                                                mask={"(99) 99999-9999"}
                                                campo={form.campo("telefone")}
                                                onChanged={() => this.updateSelf()}/>
                        </div>
                        <p>Dados (servidores)</p>
                        <div className="TelaCadastroEscolas-linhaFormulario">
                            <CampoTextoCadastro flex={12}
                                                campo={form.campo("servidores.diretor.nome")}
                                                onChanged={() => this.updateSelf()}/>
                        </div>
                        <div className="TelaCadastroEscolas-linhaFormulario">
                            <CampoTextoCadastro flex={6}
                                                campo={form.campo("servidores.diretor.email")}
                                                onChanged={() => this.updateSelf()}/>
                            <CampoTextoCadastro flex={6}
                                                mask={"(99) 99999-9999"}
                                                campo={form.campo("servidores.diretor.telefone")}
                                                onChanged={() => this.updateSelf()}/>
                        </div>
                        <div className="TelaCadastroEscolas-linhaFormulario">
                            <CampoTextoCadastro flex={12}
                                                campo={form.campo("servidores.secretario.nome")}
                                                onChanged={() => this.updateSelf()}/>
                        </div>
                        <div className="TelaCadastroEscolas-linhaFormulario">
                            <CampoTextoCadastro flex={6}
                                                campo={form.campo("servidores.secretario.email")}
                                                onChanged={() => this.updateSelf()}/>
                            <CampoTextoCadastro flex={6}
                                                mask={"(99) 99999-9999"}
                                                campo={form.campo("servidores.secretario.telefone")}
                                                onChanged={() => this.updateSelf()}/>
                        </div>
                        <div className="TelaCadastroEscolas-linhaFormulario">
                            <CampoTextoCadastro flex={12}
                                                campo={form.campo("servidores.coordenador.nome")}
                                                onChanged={() => this.updateSelf()}/>
                        </div>
                        <div className="TelaCadastroEscolas-linhaFormulario">
                            <CampoTextoCadastro flex={6}
                                                campo={form.campo("servidores.coordenador.email")}
                                                onChanged={() => this.updateSelf()}/>
                            <CampoTextoCadastro flex={6}
                                                mask={"(99) 99999-9999"}
                                                campo={form.campo("servidores.coordenador.telefone")}
                                                onChanged={() => this.updateSelf()}/>
                        </div>
                        <p>Ficha técnica</p>
                        <select
                            className="TelaCadastroEscolas-nomeCampo"
                            value={form.campo("tipo.setor").texto.length ? form.campo("tipo.setor").texto : "sigla"}
                            onChange={(e) => {
                                form.campo("tipo.setor").texto = e.target.value === "setor" ? "" : e.target.value;
                                this.updateSelf();
                            }}
                        >
                            <option value={undefined}>setor</option>
                            <option>Pública</option>
                            <option>Privada</option>
                        </select>
                        <select
                            className="TelaCadastroEscolas-nomeCampo"
                            value={form.campo("tipo.sigla").texto.length ? form.campo("tipo.sigla").texto : "sigla"}
                            onChange={(e) => {
                                form.campo("tipo.sigla").texto = e.target.value === "sigla" ? "" : e.target.value;
                                this.updateSelf();
                            }}
                        >
                            <option value={undefined}>sigla</option>
                            {tiposEscola
                                .filter(tipo => {
                                    const setor = form.campo("tipo.setor").texto;
                                    return setor ? tipo.setor === setor : true;
                                })
                                .flatMap(tipo => tipo.siglas)
                                .map(sigla => <option>{sigla}</option>)}
                        </select>
                    </div>
                    <input className="TelaEscolas-botaoControle" type="submit" value="CADASTRAR"/>
                    <button type="button" onClick={(_) => {
                        function dsrandomf(format: string): string {
                            return format.split("").map((c) => c === "#" ? random.range(0, 9) : c).join("");
                        }

                        function wsrandomf(format: string): string {
                            return format.split("").map((c) => c === "#" ? random.word({size: 1}) : c).join("");
                        }

                        form.campo("nome").texto = wsrandomf("##########");
                        form.campo("sigla").texto = wsrandomf("#####");
                        form.campo("cnpj").texto = dsrandomf("##.###.###/####-##");
                        form.campo("dataCriacao").texto = new Date(random.range(1609459200000, 1640908800000)).toLocaleDateString();
                        form.campo("codigoInep").texto = dsrandomf("########");
                        form.campo("nomeEntidadeMantenedora").texto = wsrandomf("##########");
                        form.campo("cnpjConselho").texto = dsrandomf("##.###.###/####-##");
                        form.campo("vigenciaConselho").texto = wsrandomf("##########");
                        form.campo("distrito").texto = random.choice(["DABEL", "DABEN", "DAOUT"]);
                        form.campo("cidade").texto = random.choice(["Belém", "Ananindeua", "Marituba"]);
                        form.campo("uf").texto = "PA";
                        form.campo("bairro").texto = wsrandomf("##########");
                        form.campo("cep").texto = dsrandomf("###.##-###");
                        form.campo("endereco").texto = wsrandomf("###################################");
                        form.campo("email").texto = wsrandomf("######@gmail.com");
                        form.campo("telefone").texto = dsrandomf("(91) 98###-####");
                        form.campo("servidores.diretor.telefone").texto = dsrandomf("(91) 98###-####");
                        form.campo("servidores.secretario.telefone").texto = dsrandomf("(91) 98###-####");
                        form.campo("servidores.coordenador.telefone").texto = dsrandomf("(91) 98###-####");
                        form.campo("servidores.diretor.nome").texto = wsrandomf("##########");
                        form.campo("servidores.secretario.nome").texto = wsrandomf("##########");
                        form.campo("servidores.coordenador.nome").texto = wsrandomf("##########");
                        form.campo("servidores.diretor.email").texto = wsrandomf("######@gmail.com");
                        form.campo("servidores.secretario.email").texto = wsrandomf("######@gmail.com");
                        form.campo("servidores.coordenador.email").texto = wsrandomf("######@gmail.com");
                        form.campo("tipo.setor").texto = random.choice(["Pública", "Privada"]);
                        this.updateSelf();
                    }}>
                        Preencher formulário (será removido)
                    </button>
                </form>
            </div>

        );
    }
}

export default TelaCadastroEscola;