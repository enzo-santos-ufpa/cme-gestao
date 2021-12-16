import React, {FormEvent} from "react";
import './TelaCadastroEscolas.css';
import '../common/Tela.css';
import Forms from "../../models/form";
import {escolas} from "../../lib/api";
import PlanoFundo, {bg} from "../common/PlanoFundo";
import {EscolaBase} from "../../models/Escola";
import ReactInputMask from "react-input-mask";
import Validador, {Validadores} from "../../models/Validador";
import {parseDate} from "../../lib/utils";
import {DistritoAdministrativo} from "../../models/tipos";

type FormularioCadastro = Forms.Formulario<keyof EscolaBase>;
type Estado = { form: FormularioCadastro };


type PropsCampoCadastro = { campo: Forms.CampoSimples, onChange: () => void, flex?: number };

class CampoCadastroEscola extends React.Component<PropsCampoCadastro, {}> {
    render() {
        const campo = this.props.campo;
        return <label className="TelaCadastroEscolas-campo" style={{flex: this.props.flex}}>
            <div style={{display: "flex", flexDirection: "row"}}>
                <p className="TelaCadastroEscolas-nomeCampo">{campo.nome}</p>
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
            <p className="TelaCadastroEscolas-erroCampo">{campo.erro}</p>
        </label>;
    }
}


class TelaCadastroEscola extends React.Component<{}, Estado> {
    state: Estado

    constructor(props: {}) {
        super(props);

        this.state = {
            form: new Forms.Formulario({
                nome: new Forms.CampoSimples({
                    nome: "Nome da instituição",
                    texto: "",
                    validador: new Validador().use(Validadores.required()),
                }),
                sigla: new Forms.CampoSimples({
                    nome: "Sigla",
                    texto: "",
                    validador: new Validador().use(Validadores.required()),
                }),
                cnpj: new Forms.CampoSimples({
                    nome: "CNPJ",
                    texto: "",
                    validador: new Validador().use(Validadores.required()).use(Validadores.cnpj()),
                    mask: "99.999.999/9999-99",
                }),
                dataCriacao: new Forms.CampoSimples({
                    nome: "Data de fundação",
                    texto: "",
                    validador: new Validador().use(Validadores.required()).use(Validadores.date()),
                    mask: "99/99/9999",
                }),
                codigoInep: new Forms.CampoSimples({
                    nome: "Código INEP",
                    texto: "",
                    validador: new Validador().use(Validadores.required()).use((texto) => !texto.match(/^\d{8}$/) ? "O código INEP deve estar no formato XXXXXXXX." : undefined),
                    mask: "99999999",
                }),
                nomeEntidadeMantenedora: new Forms.CampoSimples({
                    nome: "Nome da entidade mantenedora",
                    texto: "",
                    validador: new Validador().use(Validadores.required()),
                }),
                cnpjConselho: new Forms.CampoSimples({
                    nome: "CNPF/Conselho",
                    texto: "",
                    validador: new Validador().use(Validadores.required()).use(Validadores.cnpj()),
                    mask: "99.999.999/9999-99",
                }),
                vigenciaConselho: new Forms.CampoSimples({
                    nome: "Vigência/Conselho",
                    texto: "",
                    validador: new Validador().use(Validadores.required()),
                }),
                distrito: new Forms.CampoSimples({
                    nome: "Distrito",
                    texto: "",
                    validador: new Validador().use(Validadores.required()).use((texto) => {
                        const valores = Object.keys(DistritoAdministrativo).filter(v => {
                            // noinspection SuspiciousTypeOfGuard
                            return typeof v === "string";
                        });
                        if (!valores.includes(texto))
                            return `Apenas os seguintes valores são permitidos: ${valores.join(", ")}`;
                    }),
                }),
                cidade: new Forms.CampoSimples({
                    nome: "Cidade",
                    texto: "",
                    validador: new Validador().use(Validadores.required()),
                }),
                uf: new Forms.CampoSimples({
                    nome: "UF",
                    texto: "",
                    validador: new Validador().use(Validadores.required()),
                }),
                bairro: new Forms.CampoSimples({
                    nome: "Bairro",
                    texto: "",
                    validador: new Validador().use(Validadores.required()),
                }),
                cep: new Forms.CampoSimples({
                    nome: "CEP",
                    mask: "999.99-999",
                    texto: "",
                    validador: new Validador().use(Validadores.required()).use(Validadores.cep()),
                }),
                endereco: new Forms.CampoSimples({
                    nome: "Endereço",
                    texto: "",
                    validador: new Validador().use(Validadores.required()),
                }),
                // TODO inserir validador de e-mail
                email: new Forms.CampoSimples({
                    nome: "E-mail institucional",
                    texto: "",
                    validador: new Validador().use(Validadores.required()),
                }),
                telefone: new Forms.CampoSimples({
                    nome: "Telefone",
                    mask: "(99) 99999-9999",
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
                    nome: json.get("nome"),
                    cnpj: json.get("cnpj"),
                    sigla: json.get("sigla"),
                    dataCriacao: parseDate(json.get("dataCriacao"))!,
                    codigoInep: json.get("codigoInep"),
                    nomeEntidadeMantenedora: json.get("nomeEntidadeMantenedora"),
                    cnpjConselho: json.get("cnpjConselho"),
                    vigenciaConselho: json.get("vigenciaConselho"),
                    distrito: DistritoAdministrativo[json.get("distrito") as keyof typeof DistritoAdministrativo],
                    cidade: json.get("cidade"),
                    uf: json.get("uf"),
                    bairro: json.get("bairro"),
                    cep: json.get("cep"),
                    endereco: json.get("endereco"),
                    email: json.get("email"),
                    telefone: json.get("telefone"),
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
                            <p>Dados</p>
                            <div className="TelaCadastroEscolas-linhaFormulario">
                                <CampoCadastroEscola flex={6}
                                                     campo={form.campo("nome")}
                                                     onChange={() => this.updateSelf()}/>
                                <CampoCadastroEscola flex={3}
                                                     campo={form.campo("sigla")}
                                                     onChange={() => this.updateSelf()}/>
                                <CampoCadastroEscola flex={3}
                                                     campo={form.campo("cnpj")}
                                                     onChange={() => this.updateSelf()}/>
                            </div>
                            <div className="TelaCadastroEscolas-linhaFormulario">
                                <CampoCadastroEscola flex={3}
                                                     campo={form.campo("dataCriacao")}
                                                     onChange={() => this.updateSelf()}/>
                                <CampoCadastroEscola flex={3}
                                                     campo={form.campo("codigoInep")}
                                                     onChange={() => this.updateSelf()}/>
                                <CampoCadastroEscola flex={6}
                                                     campo={form.campo("nomeEntidadeMantenedora")}
                                                     onChange={() => this.updateSelf()}/>
                            </div>
                            <div className="TelaCadastroEscolas-linhaFormulario">
                                <CampoCadastroEscola flex={6}
                                                     campo={form.campo("cnpjConselho")}
                                                     onChange={() => this.updateSelf()}/>
                                <CampoCadastroEscola flex={6}
                                                     campo={form.campo("vigenciaConselho")}
                                                     onChange={() => this.updateSelf()}/>
                            </div>
                            <p>Localização</p>
                            <div className="TelaCadastroEscolas-linhaFormulario">
                                <CampoCadastroEscola flex={2}
                                                     campo={form.campo("distrito")}
                                                     onChange={() => this.updateSelf()}/>
                                <CampoCadastroEscola flex={3}
                                                     campo={form.campo("cidade")}
                                                     onChange={() => this.updateSelf()}/>
                                <CampoCadastroEscola flex={1}
                                                     campo={form.campo("uf")}
                                                     onChange={() => this.updateSelf()}/>
                                <CampoCadastroEscola flex={4}
                                                     campo={form.campo("bairro")}
                                                     onChange={() => this.updateSelf()}/>
                                <CampoCadastroEscola flex={2}
                                                     campo={form.campo("cep")}
                                                     onChange={() => this.updateSelf()}/>
                            </div>
                            <p>Contato</p>
                            <div className="TelaCadastroEscolas-linhaFormulario">
                                <CampoCadastroEscola flex={12}
                                                     campo={form.campo("endereco")}
                                                     onChange={() => this.updateSelf()}/>
                            </div>
                            <div className="TelaCadastroEscolas-linhaFormulario">
                                <CampoCadastroEscola flex={6}
                                                     campo={form.campo("email")}
                                                     onChange={() => this.updateSelf()}/>
                                <CampoCadastroEscola flex={6}
                                                     campo={form.campo("telefone")}
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
                            form.campo("cnpj").texto = `${Math.floor(Math.random() * 100)}.${Math.floor(Math.random() * 1000)}.${Math.floor(Math.random() * 1000)}/${Math.floor(Math.random() * 9000) + 1000}-${Math.floor(Math.random() * 100)}`
                            form.campo("cnpjConselho").texto = `${Math.floor(Math.random() * 100)}.${Math.floor(Math.random() * 1000)}.${Math.floor(Math.random() * 1000)}/${Math.floor(Math.random() * 9000) + 1000}-${Math.floor(Math.random() * 100)}`
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