import React from "react";
import '../common/Tela.css';
import './TelaEscola.css';
import {EscolaBase, RespostaCadastro} from "../../models/Escola";
import {escolas} from "../../lib/api";
import {ModeloBD} from "../../models/tipos";
import {useSearchParams} from "react-router-dom";
import PlanoFundo, {bg} from "../common/PlanoFundo";
import {FcCancel, FcOk} from "react-icons/fc";
import LinhaChaveValor from "../common/LinhaChaveValor";

type Props = { id: number };

type Estado<T extends EscolaBase> = EstadoCarregando | EstadoCarregado<T>;
type EstadoCarregando = { escola?: undefined };
type EstadoCarregado<T extends EscolaBase> = { escola: ModeloBD<T> };

function isCarregando<T extends EscolaBase>(estado: Estado<T>): estado is EstadoCarregando {
    return estado.escola == null;
}

abstract class _TelaEscola<T extends EscolaBase> extends React.Component<Props, Estado<EscolaBase>> {
    state: EstadoCarregando = {};

    componentDidMount() {
        this.encontraEscola(this.props.id).then(escola => {
            const estado: EstadoCarregado<T> = {escola};
            this.setState(estado);
        })
    }

    protected abstract renderizaCorpo(escola: T): JSX.Element;

    protected abstract encontraEscola(id: number): Promise<ModeloBD<T>>;

    render() {
        const estado = this.state as Estado<T>;
        if (isCarregando(estado)) {
            return <p>Carregando...</p>;
        }
        const escola = estado.escola;
        return (
            <PlanoFundo bg={bg.tela}>
                <div style={{padding: "20px"}}>
                    <p className="Tela-titulo">Triagem de instituição</p>
                    <div className="row">
                        <div style={{flex: 1}}>
                            <p className="TelaEscola-subtitulo">Dados</p>
                            <div className="row">
                                <LinhaChaveValor flex={4} chave="Nome" valor={escola.nome}/>
                                <LinhaChaveValor flex={2} chave="Sigla" valor={escola.sigla}/>
                                <LinhaChaveValor flex={6} chave="CNPJ" valor={escola.cnpj}/>
                            </div>
                            <div className="row">
                                <LinhaChaveValor flex={6} chave="Data de criação"
                                                 valor={escola.dataCriacao.toLocaleDateString()}/>
                                <LinhaChaveValor flex={6} chave="Código INEP" valor={escola.codigoInep}/>
                            </div>
                            <div className="row">
                                <LinhaChaveValor flex={12} chave="Entidade mantenedora"
                                                 valor={escola.nomeEntidadeMantenedora}/>
                            </div>
                            <div className="row">
                                <LinhaChaveValor flex={6} chave="CNPJ/Conselho" valor={escola.cnpjConselho}/>
                                <LinhaChaveValor flex={6} chave="Vigência/Conselho" valor={escola.vigenciaConselho}/>
                            </div>
                            <p className="TelaEscola-subtitulo">Localização</p>
                            <div className="row">
                                <LinhaChaveValor flex={4} chave="Distrito"
                                                 valor={escola.distrito}/>
                                <LinhaChaveValor flex={4} chave="Cidade" valor={escola.cidade}/>
                                <LinhaChaveValor flex={4} chave="UF" valor={escola.uf}/>
                            </div>
                            <div className="row">
                                <LinhaChaveValor flex={8} chave="Bairro" valor={escola.bairro}/>
                                <LinhaChaveValor flex={4} chave="CEP" valor={escola.cep}/>
                            </div>
                            <div className="row">
                                <LinhaChaveValor flex={12} chave="Endereço" valor={escola.endereco}/>
                            </div>
                            <p className="TelaEscola-subtitulo">Contato</p>
                            <div className="row">
                                <LinhaChaveValor flex={6} chave="E-mail" valor={escola.email}/>
                                <LinhaChaveValor flex={6} chave="Telefone" valor={escola.telefone}/>
                            </div>
                            <p className="TelaEscola-subtitulo">Servidores</p>
                            <div className="row">
                                <LinhaChaveValor flex={12} chave="Nome/Diretor" valor={escola.diretor.nome}/>
                            </div>
                            <div className="row">
                                <LinhaChaveValor flex={6} chave="E-mail" valor={escola.diretor.email}/>
                                <LinhaChaveValor flex={6} chave="Telefone" valor={escola.diretor.telefone}/>
                            </div>
                            <div className="row">
                                <LinhaChaveValor flex={12} chave="Nome/Coordenador"
                                                 valor={escola.coordenador.nome}/>
                            </div>
                            <div className="row">
                                <LinhaChaveValor flex={6} chave="E-mail" valor={escola.coordenador.email}/>
                                <LinhaChaveValor flex={6} chave="Telefone"
                                                 valor={escola.coordenador.telefone}/>
                            </div>
                            <div className="row">
                                <LinhaChaveValor flex={12} chave="Nome/Secretário"
                                                 valor={escola.secretario.nome}/>
                            </div>
                            <div className="row">
                                <LinhaChaveValor flex={6} chave="E-mail" valor={escola.secretario.email}/>
                                <LinhaChaveValor flex={6} chave="Telefone"
                                                 valor={escola.secretario.telefone}/>
                            </div>

                        </div>
                        <div style={{flex: 1}}>
                            {this.renderizaCorpo(escola)}

                        </div>
                    </div>
                </div>
            </PlanoFundo>
        );
    }
}

class TelaTriagemEscola extends _TelaEscola<EscolaBase> {
    private async responderTriagem(resposta: RespostaCadastro) {
        const estado = this.state as Estado<EscolaBase>;
        if (isCarregando(estado)) return;
        try {
            await escolas.answer(estado.escola, resposta);
        } catch (e) {
            return alert("Ocorreu um erro. Tente novamente mais tarde.");
        }
        switch (resposta) {
            case "accept": {
                alert(`Escola autorizada com sucesso.`);
                break;
            }
            case "refuse": {
                alert(`A escola foi recusada com sucesso.`);
                break;
            }
        }
        window.history.back();
    }

    protected encontraEscola(id: number): Promise<ModeloBD<EscolaBase>> {
        return escolas.consulta(id);
    }

    protected renderizaCorpo(escola: EscolaBase): JSX.Element {
        return <div>
            <FcCancel className="LinhaAutorizacaoCadastro-BotaoResposta"
                      size="40px"
                      onClick={(_) => this.responderTriagem("refuse")}/>
            <FcOk className="LinhaAutorizacaoCadastro-BotaoResposta"
                  size="40px"
                  onClick={(_) => this.responderTriagem("accept")}/>
        </div>;
    }
}

const TelaEscola = () => {
    const params = useSearchParams()[0];
    const id = parseInt(params.get("id") ?? "");
    const action = params.get("action") as "answer";
    switch (action) {
        case "answer": {
            return <TelaTriagemEscola id={id}/>;
        }
    }
}

export default TelaEscola;