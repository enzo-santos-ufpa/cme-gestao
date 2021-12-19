import React, {FormEvent} from "react";
import './TelaCadastroEscolas.css';
import '../common/Tela.css';
import Forms from "../../models/form";
import {escolas} from "../../lib/api";
import {constantes, encoding, EscolaBase} from "../../models/Escola";
import Validador, {Validadores} from "../../models/Validador";
import {random} from "../../lib/utils";
import {Flatten} from "../../models/tipos";
import {CampoUnicaEscolha, CampoTexto, PropsCampoTexto} from "../common/forms/Campo";
import Aba from "../common/Aba";

type FormularioCadastro = Forms.Formulario<keyof Flatten<EscolaBase>>;

const nomeAbas = ["Identificação", "Ficha técnica", "Filiais", "Documentos"] as const;
type NomeAba = typeof nomeAbas[number];

type Estado = { form: FormularioCadastro, abaAtual: NomeAba };

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
                    nome: "CNPJ/Conselho",
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
                        if (!constantes.isDistrito(texto))
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
                "diretor.nome": new Forms.Campo({
                    nome: "Nome/Diretor",
                    texto: "",
                    validador: new Validador().use(Validadores.required()),
                }),
                "diretor.email": new Forms.Campo({
                    nome: "E-mail institucional",
                    texto: "",
                    validador: new Validador().use(Validadores.required()),
                }),
                "diretor.telefone": new Forms.Campo({
                    nome: "Telefone",
                    texto: "",
                    validador: new Validador().use(Validadores.required()),
                }),
                "secretario.nome": new Forms.Campo({
                    nome: "Nome/Secretário",
                    texto: "",
                    validador: new Validador().use(Validadores.required()),
                }),
                "secretario.email": new Forms.Campo({
                    nome: "E-mail institucional",
                    texto: "",
                    validador: new Validador().use(Validadores.required()),
                }),
                "secretario.telefone": new Forms.Campo({
                    nome: "Telefone",
                    texto: "",
                    validador: new Validador().use(Validadores.required()),
                }),
                "coordenador.nome": new Forms.Campo({
                    nome: "Nome/Coordenador",
                    texto: "",
                    validador: new Validador().use(Validadores.required()),
                }),
                "coordenador.email": new Forms.Campo({
                    nome: "E-mail institucional",
                    texto: "",
                    validador: new Validador().use(Validadores.required()),
                }),
                "coordenador.telefone": new Forms.Campo({
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
                    nome: "Sigla",
                    texto: "",
                    validador: new Validador().use(Validadores.required()),
                }),
                "convenioSemec.vigencia": new Forms.Campo({
                    nome: "Vigência",
                    texto: "",
                    validador: new Validador(),
                }),
                "convenioSemec.objeto": new Forms.Campo({
                    nome: "Objeto",
                    texto: "",
                    validador: new Validador(),
                }),
                "convenioSemec.numConvenio": new Forms.Campo({
                    nome: "Nº convênio",
                    texto: "",
                    validador: new Validador(),
                }),
                // TODO support array
                "modalidadesEnsino": new Forms.Campo(),
            }),
            abaAtual: "Ficha técnica",
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

    private renderAbaFichaTecnica() {
        const form = this.state.form;
        return <div className="TelaCadastroEscolas-formulario">
            <div className="TelaCadastroEscolas-linhaFormulario">
                <p className="TelaCadastroEscolas-nomeCampo">Tipo</p>
                <CampoUnicaEscolha campo={form.campo("tipo.setor")}
                                   onChanged={() => {
                                       const setor = form.campo("tipo.setor").texto;
                                       if (setor) form.campo("tipo.sigla").texto = "";
                                       this.updateSelf();
                                   }}
                                   estilo={{
                                       campo: {className: "TelaCadastroEscolas-nomeCampo"},
                                       erro: {className: "TelaCadastroEscolas-erroCampo"}
                                   }}
                                   nome="setor"
                                   opcoes={constantes.tiposEscola.map(tipo => tipo.setor)}/>
                <CampoUnicaEscolha campo={form.campo("tipo.sigla")}
                                   onChanged={() => {
                                       const sigla = form.campo("tipo.sigla").texto;
                                       if (sigla) {
                                           form.campo("tipo.setor").texto = constantes.tiposEscola
                                               .find(tipo => tipo.siglas.includes(sigla))!.setor;
                                       }
                                       this.updateSelf();
                                   }}
                                   estilo={{
                                       campo: {className: "TelaCadastroEscolas-nomeCampo"},
                                       erro: {className: "TelaCadastroEscolas-erroCampo"}
                                   }}
                                   nome="sigla"
                                   opcoes={constantes.tiposEscola.flatMap(tipo => {
                                       const setor = form.campo("tipo.setor").texto;
                                       if (!setor) return tipo.siglas;
                                       if (setor === tipo.setor) return tipo.siglas;
                                       return [];
                                   })}/>
            </div>
            <p>Convênio com a SEMEC</p>
            <div className="TelaCadastroEscolas-linhaFormulario">
                <p>Possui?</p>
                <label className="row">
                    <input type="radio" name="convenioSemec" value="yes"/>
                    <p>Sim</p>
                </label>
                <label className="row">
                    <input type="radio" name="convenioSemec" value="no"/>
                    <p>Não</p>
                </label>
            </div>
            <div className="TelaCadastroEscolas-linhaFormulario">
                <CampoTextoCadastro flex={4}
                                    campo={form.campo("convenioSemec.numConvenio")}
                                    onChanged={() => this.updateSelf()}/>
                <CampoTextoCadastro flex={4}
                                    campo={form.campo("convenioSemec.objeto")}
                                    onChanged={() => this.updateSelf()}/>
                <CampoTextoCadastro flex={4}
                                    campo={form.campo("convenioSemec.vigencia")}
                                    onChanged={() => this.updateSelf()}/>

            </div>
            <p>Etapas/modalidades da educação básica ofertada</p>
            <div className="TelaCadastroEscolas-linhaFormulario">
                <div>
                    {constantes.modalidadesEnsino.map(item => {
                        return <div>
                            <p>{item.titulo}</p>
                            <p>{item.subtitulo}</p>
                            <div className="row">
                                {item.modalidades.map(nome => {
                                    return <label className="row">
                                        <input type="checkbox"/>
                                        <p>{nome}</p>
                                    </label>
                                })}
                            </div>
                        </div>;
                    })}
                </div>
            </div>
        </div>
    }

    private renderAbaIdentificacao() {
        const form = this.state.form;
        return <form onSubmit={this.onSubmit}>
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
                                        campo={form.campo("diretor.nome")}
                                        onChanged={() => this.updateSelf()}/>
                </div>
                <div className="TelaCadastroEscolas-linhaFormulario">
                    <CampoTextoCadastro flex={6}
                                        campo={form.campo("diretor.email")}
                                        onChanged={() => this.updateSelf()}/>
                    <CampoTextoCadastro flex={6}
                                        mask={"(99) 99999-9999"}
                                        campo={form.campo("diretor.telefone")}
                                        onChanged={() => this.updateSelf()}/>
                </div>
                <div className="TelaCadastroEscolas-linhaFormulario">
                    <CampoTextoCadastro flex={12}
                                        campo={form.campo("secretario.nome")}
                                        onChanged={() => this.updateSelf()}/>
                </div>
                <div className="TelaCadastroEscolas-linhaFormulario">
                    <CampoTextoCadastro flex={6}
                                        campo={form.campo("secretario.email")}
                                        onChanged={() => this.updateSelf()}/>
                    <CampoTextoCadastro flex={6}
                                        mask={"(99) 99999-9999"}
                                        campo={form.campo("secretario.telefone")}
                                        onChanged={() => this.updateSelf()}/>
                </div>
                <div className="TelaCadastroEscolas-linhaFormulario">
                    <CampoTextoCadastro flex={12}
                                        campo={form.campo("coordenador.nome")}
                                        onChanged={() => this.updateSelf()}/>
                </div>
                <div className="TelaCadastroEscolas-linhaFormulario">
                    <CampoTextoCadastro flex={6}
                                        campo={form.campo("coordenador.email")}
                                        onChanged={() => this.updateSelf()}/>
                    <CampoTextoCadastro flex={6}
                                        mask={"(99) 99999-9999"}
                                        campo={form.campo("coordenador.telefone")}
                                        onChanged={() => this.updateSelf()}/>
                </div>
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
                form.campo("diretor.telefone").texto = dsrandomf("(91) 98###-####");
                form.campo("secretario.telefone").texto = dsrandomf("(91) 98###-####");
                form.campo("coordenador.telefone").texto = dsrandomf("(91) 98###-####");
                form.campo("diretor.nome").texto = wsrandomf("##########");
                form.campo("secretario.nome").texto = wsrandomf("##########");
                form.campo("coordenador.nome").texto = wsrandomf("##########");
                form.campo("diretor.email").texto = wsrandomf("######@gmail.com");
                form.campo("secretario.email").texto = wsrandomf("######@gmail.com");
                form.campo("coordenador.email").texto = wsrandomf("######@gmail.com");
                const tipo = random.choice(constantes.tiposEscola);
                form.campo("tipo.setor").texto = tipo.setor;
                form.campo("tipo.sigla").texto = random.choice(tipo.siglas);
                this.updateSelf();
            }}>
                Preencher formulário (será removido)
            </button>
        </form>;
    }

    private renderAba(): JSX.Element | undefined {
        switch (this.state.abaAtual) {
            case "Identificação":
                return this.renderAbaIdentificacao();
            case "Ficha técnica":
                return this.renderAbaFichaTecnica();
        }
    }

    render() {
        return <div className="TelaCadastroEscolas">
            <p className="Tela-titulo">Cadastrar escola</p>
            <div className="row" style={{gap: "10px"}}>
                {nomeAbas.map(nome => <Aba onChanged={() => this.setState({...this.state, abaAtual: nome})}
                                           text={nome.toUpperCase()}
                                           isSelected={nome === this.state.abaAtual}/>)}
            </div>
            {this.renderAba()}
        </div>;
    }
}

export default TelaCadastroEscola;