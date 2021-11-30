namespace Formulario {
    type Estado = { [k: string]: EstadoCampo };

    export type EstadoCampo = { texto: string, erro?: string };

    export type Tipo<T extends string> = Record<T, EstadoCampo>;

    export function json(estado: Estado): { [k: keyof Estado]: string } {
        const chaves: (keyof Estado)[] = Object.keys(estado);
        return Object.fromEntries(chaves.map(chave => [chave, estado[chave].texto]));
    }

    export function defineErro(campo: EstadoCampo, erro: string, esperado: (texto: string) => boolean) {
        if (esperado(campo.texto)) {
            campo.erro = undefined;
        } else if (campo.erro === undefined) {
            campo.erro = erro;
        }
    }

    export function possuiErro(estado: Estado): boolean {
        const itens: EstadoCampo[] = Object.values(estado);
        return itens.some(item => item.erro !== undefined);
    }
}

export default Formulario;