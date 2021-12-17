import React from "react";
import {EscolaBase, RespostaCadastro} from "../../models/Escola";
import {escolas} from "../../lib/api";
import {ModeloBD} from "../../models/tipos";
import {useSearchParams} from "react-router-dom";
import PlanoFundo, {bg} from "../common/PlanoFundo";
import {FcCancel, FcOk} from "react-icons/fc";

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
        if (isCarregando(estado)) return <p>Carregando...</p>;

        const escola = estado.escola;
        return (
            <PlanoFundo bg={bg.tela}>
                <div>
                    <p>Nome: {escola.nome}</p>
                </div>
                {this.renderizaCorpo(escola)}
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
                  onClick={(_) => {
                      this.responderTriagem("accept");
                  }}/>
        </div>;
    }

}

const TelaCadastro = () => {
    const params = useSearchParams()[0];
    const id = parseInt(params.get("id") ?? "");
    const action = params.get("action") as "answer";
    switch (action) {
        case "answer": {
            return <TelaTriagemEscola id={id}/>;
        }
    }
    // eslint-disable-next-line react/jsx-pascal-case
}

export default TelaCadastro;