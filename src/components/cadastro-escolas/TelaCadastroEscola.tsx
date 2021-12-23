import React, {FormEvent} from "react";
import './TelaCadastroEscolas.css';
import '../common/Tela.css';
import Forms from "../../models/form";
import {escolas} from "../../lib/api";
import {constantes, encoding, EscolaBase, EtapaEnsino, isDistrito, ModalidadeEnsino} from "../../models/Escola";
import Validador, {Validadores} from "../../models/Validador";
import {random} from "../../lib/utils";
import {Flatten} from "../../models/tipos";
import {CampoUnicaEscolha, CampoTexto, PropsCampoTexto} from "../common/forms/Campo";
import Aba from "../common/Aba";

type FormularioCadastro = Forms.Formulario<keyof Flatten<EscolaBase>>;

const nomeAbas = ["Identificação", "Ficha técnica", "Filiais", "Documentos"] as const;
type NomeAba = typeof nomeAbas[number];

type Estado = { form: FormularioCadastro, abaAtual: NomeAba, convenioVisivel: boolean };

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

export default class TelaCadastroEscola extends React.Component<{}, Estado> {
    state: Estado

    constructor(props: {}) {
        super(props);

        this.state = {
            form: new Forms.Formulario({
                "nome": new Forms.CampoTexto({
                    nome: "Nome da instituição",
                    valor: "",
                    validador: Validador.texto().use(Validadores.required()),
                }),
                "sigla": new Forms.CampoTexto({
                    nome: "Sigla",
                    valor: "",
                    validador: Validador.texto().use(Validadores.required()),
                }),
                "cnpj": new Forms.CampoTexto({
                    nome: "CNPJ",
                    valor: "",
                    validador: Validador.texto().use(Validadores.required()).use(Validadores.cnpj()),
                }),
                "dataCriacao": new Forms.CampoTexto({
                    nome: "Data de fundação",
                    valor: "",
                    validador: Validador.texto().use(Validadores.required()).use(Validadores.date()),
                }),
                "codigoInep": new Forms.CampoTexto({
                    nome: "Código INEP",
                    valor: "",
                    validador: Validador.texto().use(Validadores.required()).use((texto) => !texto.match(/^\d{8}$/) ? "O código INEP deve estar no formato XXXXXXXX." : undefined),
                }),
                "nomeEntidadeMantenedora": new Forms.CampoTexto({
                    nome: "Nome da entidade mantenedora",
                    valor: "",
                    validador: Validador.texto().use(Validadores.required()),
                }),
                "cnpjConselho": new Forms.CampoTexto({
                    nome: "CNPJ/Conselho",
                    valor: "",
                    validador: Validador.texto().use(Validadores.required()).use(Validadores.cnpj()),
                }),
                "vigenciaConselho": new Forms.CampoTexto({
                    nome: "Vigência/Conselho",
                    valor: "",
                    validador: Validador.texto().use(Validadores.required()),
                }),
                "distrito": new Forms.CampoTexto({
                    nome: "Distrito",
                    valor: "",
                    validador: Validador.texto().use(Validadores.required()).use((texto) => {
                        if (!isDistrito(texto))
                            return `Apenas os seguintes valores são permitidos: ${constantes.distritos.join(", ")}`;
                    }),
                }),
                "cidade": new Forms.CampoTexto({
                    nome: "Cidade",
                    valor: "",
                    validador: Validador.texto().use(Validadores.required()),
                }),
                "uf": new Forms.CampoTexto({
                    nome: "UF",
                    valor: "",
                    validador: Validador.texto().use(Validadores.required()),
                }),
                "bairro": new Forms.CampoTexto({
                    nome: "Bairro",
                    valor: "",
                    validador: Validador.texto().use(Validadores.required()),
                }),
                "cep": new Forms.CampoTexto({
                    nome: "CEP",
                    valor: "",
                    validador: Validador.texto().use(Validadores.required()).use(Validadores.cep()),
                }),
                "endereco": new Forms.CampoTexto({
                    nome: "Endereço",
                    valor: "",
                    validador: Validador.texto().use(Validadores.required()),
                }),
                "email": new Forms.CampoTexto({
                    nome: "E-mail institucional",
                    valor: "",
                    validador: Validador.texto().use(Validadores.required()),
                }),
                "telefone": new Forms.CampoTexto({
                    nome: "Telefone",
                    valor: "",
                    validador: Validador.texto().use(Validadores.required()),
                }),
                "diretor.nome": new Forms.CampoTexto({
                    nome: "Nome/Diretor",
                    valor: "",
                    validador: Validador.texto().use(Validadores.required()),
                }),
                "diretor.email": new Forms.CampoTexto({
                    nome: "E-mail institucional",
                    valor: "",
                    validador: Validador.texto().use(Validadores.required()),
                }),
                "diretor.telefone": new Forms.CampoTexto({
                    nome: "Telefone",
                    valor: "",
                    validador: Validador.texto().use(Validadores.required()),
                }),
                "secretario.nome": new Forms.CampoTexto({
                    nome: "Nome/Secretário",
                    valor: "",
                    validador: Validador.texto().use(Validadores.required()),
                }),
                "secretario.email": new Forms.CampoTexto({
                    nome: "E-mail institucional",
                    valor: "",
                    validador: Validador.texto().use(Validadores.required()),
                }),
                "secretario.telefone": new Forms.CampoTexto({
                    nome: "Telefone",
                    valor: "",
                    validador: Validador.texto().use(Validadores.required()),
                }),
                "coordenador.nome": new Forms.CampoTexto({
                    nome: "Nome/Coordenador",
                    valor: "",
                    validador: Validador.texto().use(Validadores.required()),
                }),
                "coordenador.email": new Forms.CampoTexto({
                    nome: "E-mail institucional",
                    valor: "",
                    validador: Validador.texto().use(Validadores.required()),
                }),
                "coordenador.telefone": new Forms.CampoTexto({
                    nome: "Telefone",
                    valor: "",
                    validador: Validador.texto().use(Validadores.required()),
                }),
                "tipo.setor": new Forms.CampoTexto({
                    nome: "Setor",
                    valor: "",
                    validador: Validador.texto().use(Validadores.required()),
                }),
                "tipo.sigla": new Forms.CampoTexto({
                    nome: "Sigla",
                    valor: "",
                    validador: Validador.texto().use(Validadores.required()),
                }),
                "convenioSemec.vigencia": new Forms.CampoTexto({
                    nome: "Vigência",
                    valor: "",
                    validador: Validador.texto(),
                }),
                "convenioSemec.objeto": new Forms.CampoTexto({
                    nome: "Objeto",
                    valor: "",
                    validador: Validador.texto(),
                }),
                "convenioSemec.numConvenio": new Forms.CampoTexto({
                    nome: "Nº convênio",
                    valor: "",
                    validador: Validador.texto(),
                }),
                "modalidadesEnsino": new Forms.CampoArray<ModalidadeEnsino>({
                    nome: "Modalidades de ensino",
                    valor: [],
                    validador: new Validador<ModalidadeEnsino[]>().use(Validadores.min1()),
                }),
            }),
            abaAtual: "Ficha técnica",
            convenioVisivel: true,
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

    private renderAbaIdentificacao() {
        const form = this.state.form;
        return <form onSubmit={this.onSubmit}>
            <div className="TelaCadastroEscolas-formulario">
                <p>Dados</p>
                <GrupoCampoTexto
                    form={form}
                    grupos={[
                        {
                            formato: "111111222333",
                            campos: {
                                nome: {},
                                sigla: {},
                                cnpj: {mask: "99.999.999/9999-99"},
                            },
                        },
                        {
                            formato: "111222333333",
                            campos: {
                                dataCriacao: {mask: "99/99/9999"},
                                codigoInep: {mask: "99999999"},
                                nomeEntidadeMantenedora: {},
                            },
                        },
                        {
                            formato: "111111222222",
                            campos: {
                                cnpjConselho: {mask: "99.999.999/9999-99"},
                                vigenciaConselho: {},
                            },
                        },
                    ]}
                    onChanged={() => this.updateSelf()}/>
                <p>Localização</p>
                <GrupoCampoTexto
                    form={form}
                    grupos={[
                        {
                            formato: "112223444455",
                            campos: {
                                distrito: {},
                                cidade: {},
                                uf: {mask: "aa"},
                                bairro: {},
                                cep: {mask: "999.99-999"},
                            },
                        },
                        {
                            formato: "111111111111",
                            campos: {
                                endereco: {},
                            },
                        },
                    ]}
                    onChanged={() => this.updateSelf()}/>
                <p>Contato</p>
                <GrupoCampoTexto
                    form={form}
                    grupos={[
                        {
                            formato: "111111222222",
                            campos: {
                                email: {},
                                telefone: {mask: "(99) 99999-9999"}
                            },
                        },
                    ]}
                    onChanged={() => this.updateSelf()}/>
                <p>Dados (servidores)</p>
                <GrupoCampoTexto
                    form={form}
                    grupos={[
                        {
                            formato: "111111111111",
                            campos: {
                                "diretor.nome": {},
                            },
                        },
                        {
                            formato: "111111222222",
                            campos: {
                                "diretor.email": {},
                                "diretor.telefone": {mask: "(99) 99999-9999"},
                            },
                        },
                        {
                            formato: "111111111111",
                            campos: {
                                "secretario.nome": {},
                            },
                        },
                        {
                            formato: "111111222222",
                            campos: {
                                "secretario.email": {},
                                "secretario.telefone": {mask: "(99) 99999-9999"},
                            },
                        },
                        {
                            formato: "111111111111",
                            campos: {
                                "coordenador.nome": {},
                            },
                        },
                        {
                            formato: "111111222222",
                            campos: {
                                "coordenador.email": {},
                                "coordenador.telefone": {mask: "(99) 99999-9999"},
                            },
                        },
                    ]}
                    onChanged={() => this.updateSelf()}/>
            </div>
            <input className="TelaEscolas-botaoControle" type="submit" value="CADASTRAR"/>
            <button type="button" onClick={(_) => {
                function dsrandomf(format: string): string {
                    return format.split("").map((c) => c === "#" ? random.range(0, 9) : c).join("");
                }

                function wsrandomf(format: string): string {
                    return format.split("").map((c) => c === "#" ? random.word({size: 1}) : c).join("");
                }

                form.campo("nome").valor = wsrandomf("##########");
                form.campo("sigla").valor = wsrandomf("#####");
                form.campo("cnpj").valor = dsrandomf("##.###.###/####-##");
                form.campo("dataCriacao").valor = new Date(random.range(1609459200000, 1640908800000)).toLocaleDateString();
                form.campo("codigoInep").valor = dsrandomf("########");
                form.campo("nomeEntidadeMantenedora").valor = wsrandomf("##########");
                form.campo("cnpjConselho").valor = dsrandomf("##.###.###/####-##");
                form.campo("vigenciaConselho").valor = wsrandomf("##########");
                form.campo("distrito").valor = random.choice(constantes.distritos);
                form.campo("cidade").valor = random.choice(["Belém", "Ananindeua", "Marituba"]);
                form.campo("uf").valor = "PA";
                form.campo("bairro").valor = wsrandomf("##########");
                form.campo("cep").valor = dsrandomf("###.##-###");
                form.campo("endereco").valor = wsrandomf("###################################");
                form.campo("email").valor = wsrandomf("######@gmail.com");
                form.campo("telefone").valor = dsrandomf("(91) 98###-####");
                form.campo("diretor.telefone").valor = dsrandomf("(91) 98###-####");
                form.campo("secretario.telefone").valor = dsrandomf("(91) 98###-####");
                form.campo("coordenador.telefone").valor = dsrandomf("(91) 98###-####");
                form.campo("diretor.nome").valor = wsrandomf("##########");
                form.campo("secretario.nome").valor = wsrandomf("##########");
                form.campo("coordenador.nome").valor = wsrandomf("##########");
                form.campo("diretor.email").valor = wsrandomf("######@gmail.com");
                form.campo("secretario.email").valor = wsrandomf("######@gmail.com");
                form.campo("coordenador.email").valor = wsrandomf("######@gmail.com");
                const tipo = random.choice(constantes.tiposEscola);
                form.campo("tipo.setor").valor = tipo.setor;
                form.campo("tipo.sigla").valor = random.choice(tipo.siglas);

                form.campo("convenioSemec.numConvenio").valor = random.decimal({size: 3});
                form.campo("convenioSemec.objeto").valor = random.word({size: 10});
                form.campo("convenioSemec.vigencia").valor = new Date(random.range(1609459200000, 1640908800000)).toLocaleDateString();

                const etapas: EtapaEnsino[] = random.sample(constantes.etapasEnsino);
                form.campo<ModalidadeEnsino[]>("modalidadesEnsino").valor = constantes.modalidadesEnsino
                    .filter(legenda => etapas.includes(legenda.titulo))
                    .flatMap(legenda => random.sample(legenda.modalidades)
                        .map(nome => ({etapa: legenda.titulo, nome: nome})));

                this.updateSelf();
            }}>
                Preencher formulário (será removido)
            </button>
        </form>;
    }

    private renderAbaFichaTecnica() {
        const form = this.state.form;
        console.log(form.campo("modalidadesEnsino").valor);
        return <div className="TelaCadastroEscolas-formulario">
            <div className="TelaCadastroEscolas-linhaFormulario">
                <p className="TelaCadastroEscolas-nomeCampo">Tipo</p>
                <CampoUnicaEscolha campo={form.campo("tipo.setor")}
                                   onChanged={() => {
                                       const setor = form.campo("tipo.setor").valor;
                                       if (setor) form.campo("tipo.sigla").valor = "";
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
                                       const sigla = form.campo("tipo.sigla").valor;
                                       if (sigla) {
                                           form.campo("tipo.setor").valor = constantes.tiposEscola
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
                                       const setor = form.campo("tipo.setor").valor;
                                       if (!setor) return tipo.siglas;
                                       if (setor === tipo.setor) return tipo.siglas;
                                       return [];
                                   })}/>
            </div>
            <p>Convênio com a SEMEC</p>
            <div className="TelaCadastroEscolas-linhaFormulario">
                <p className="TelaCadastroEscolas-nomeCampo">Possui?</p>
                <label className="row">
                    <input
                        type="radio"
                        name="convenioSemec"
                        checked={this.state.convenioVisivel}
                        onChange={() => this.setState({...this.state, convenioVisivel: true})}/>
                    <p>Sim</p>
                </label>
                <label className="row">
                    <input
                        type="radio"
                        name="convenioSemec"
                        checked={!this.state.convenioVisivel}
                        onChange={() => this.setState({...this.state, convenioVisivel: false})}/>
                    <p>Não</p>
                </label>
            </div>
            {(this.state.convenioVisivel
                ? <div className="TelaCadastroEscolas-linhaFormulario">
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
                : null)}
            <p>Etapas/modalidades ofertadas</p>
            <div className="TelaCadastroEscolas-linhaFormulario">
                <div>
                    {constantes.modalidadesEnsino.map(item => {
                        return <div>
                            <p className="TelaCadastroEscolas-nomeCampo">{item.titulo}</p>
                            <p className="TelaCadastroEscolas-nomeCampo" style={{fontSize: 13}}>{item.subtitulo}</p>
                            <div className="row" style={{paddingTop: 15, paddingBottom: 15}}>
                                {item.modalidades.map(nome => {
                                    const campo = form.campo<ModalidadeEnsino[]>("modalidadesEnsino");
                                    const modalidade: ModalidadeEnsino = {etapa: item.titulo, nome: nome};
                                    const index = campo.valor.findIndex(valor => valor.nome === modalidade.nome && valor.etapa === modalidade.etapa);
                                    const isChecked = index >= 0;
                                    return <label className="row" style={{paddingRight: 15}}>
                                        <input
                                            className="TelaCadastroEscolas-caixaSelecao"
                                            type="checkbox"
                                            checked={isChecked}
                                            onChange={() => {
                                                if (isChecked) {
                                                    campo.valor.splice(index, 1);
                                                } else {
                                                    campo.valor.push(modalidade);
                                                }
                                                this.updateSelf();
                                            }}/>
                                        <p>{nome}</p>
                                    </label>;
                                })}
                            </div>
                        </div>;
                    })}
                </div>
            </div>
        </div>
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

type PropsGrupoCampoTexto<T extends string> = {
    form: Forms.Formulario<T>,
    grupos: { formato: string, campos: Partial<Record<T, { mask?: string }>> }[],
    onChanged: () => void,
};

class GrupoCampoTexto<T extends string> extends React.Component<PropsGrupoCampoTexto<T>, {}> {
    render() {
        const regex = /((.)\2*)/gm;
        return <div>
            {this.props.grupos.map(grupo => {
                const campos = Object.entries(grupo.campos) as [T, { mask?: string }][];
                return <div className="TelaCadastroEscolas-linhaFormulario">
                    {grupo.formato.match(regex)?.map((match, i) => {
                        const flex = match.length;
                        const [chave, valor] = campos[i];
                        return <CampoTextoCadastro flex={flex}
                                                   mask={valor.mask}
                                                   campo={this.props.form.campo(chave)}
                                                   onChanged={() => this.props.onChanged()}/>;
                    })}
                </div>
            })}
        </div>
    }
}