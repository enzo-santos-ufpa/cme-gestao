import {ChangeEvent} from "react";


namespace Forms {
    type EventoCampo = ChangeEvent<HTMLInputElement>;

    export type Campo = { texto: string, erro?: string };

    export type Formulario<T extends string> = Record<T, Campo>;

    type _Formulario = Formulario<string>;

    export function json(form: _Formulario): { [k: string]: string } {
        const chaves: (keyof _Formulario)[] = Object.keys(form);
        return Object.fromEntries(chaves.map(chave => [chave, form[chave].texto]));
    }

    export function atualizaCampo<T extends _Formulario>(form: T, nomeCampo: keyof T, callback?: (novoForm: T) => void) {
        return (e: EventoCampo) => {
            const novoForm = {...form};
            novoForm[nomeCampo] = {...novoForm[nomeCampo], texto: e.target.value};
            if (callback != null) callback(novoForm);
        };
    }

    export function defineErro(campo: Campo, erro: string, esperado: (texto: string) => boolean) {
        if (esperado(campo.texto)) {
            campo.erro = undefined;
        } else if (campo.erro === undefined) {
            campo.erro = erro;
        }
    }

    export function possuiErro(form: _Formulario): boolean {
        const campos: Campo[] = Object.values(form);
        return campos.some(campo => campo.erro !== undefined);
    }
}

export default Forms;