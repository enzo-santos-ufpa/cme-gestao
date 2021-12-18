import {networkInterfaces} from "os";

class Logger {
    prefix: string;

    constructor(prefix: string) {
        this.prefix = prefix;
    }

    at(location: string) {
        const prefix = this.prefix;
        return {
            log(message: any) {
                console.log(`[${prefix}] ${location}: ${message}`)
            }
        };
    }
}

export namespace rede {
    export type URLParams = { esquema?: string | null, porta?: string | number | null, caminho?: string | null }

    export function urlAtual(params: URLParams): string {
        const dominio = Object.values(networkInterfaces())
            .flatMap(child => child)
            .find(network => network != null && (network.family === "IPv4" && !network.internal))
            ?.address || "localhost";

        let result = "";
        if (params.esquema != null) result += `${params.esquema}://`
        result += `${dominio}`;
        if (params.porta != null) result += `:${params.porta}`;
        if (params.caminho != null) result += `/${params.caminho}`;
        return result;
    }
}

export namespace random {
    export function range(from: number, to: number): number {
        const min = Math.ceil(from);
        const max = Math.floor(to);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    export function choice<T>(value: Readonly<T[]>): T {
        return value[range(0, value.length - 1)];
    }

    export function stringchoice(params: { alphabet: string, size: number }): string {
        return new Array(params.size)
            .fill(undefined)
            .map((_) => range(0, params.alphabet.length - 1))
            .map((i) => params.alphabet[i])
            .join("");
    }

    export function word(params: { size: number, case?: "lower" | "upper" | "both" }): string {
        const chars = (() => {
            const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
            switch (params?.case ?? "both") {
                case "lower":
                    return alphabet.toLowerCase();
                case "upper":
                    return alphabet;
                case "both":
                    return alphabet + alphabet.toLowerCase();
            }
        })();
        return stringchoice({alphabet: chars, size: params.size});
    }

    export function decimal(params: { size: number }): string {
        return stringchoice({alphabet: "0123456789", size: params.size});
    }
}

export namespace strings {
    export function insert(value: string, at: number, what: string): string {
        return value.slice(0, at) + what + value.slice(at);
    }
}

export namespace chaining {
    class Chain<T> {
        private readonly value: T;

        constructor(value: T) {
            this.value = value;
        }

        then<R>(action: (value: T) => R): Chain<R> {
            return new Chain(action(this.value));
        }

        get(): T {
            return this.value;
        }
    }

    export function chain<T>(value: T): Chain<T> {
        return new Chain(value);
    }
}

export function parseDate(value: string): Date | null {
    const tokens = value.split("/");
    if (tokens.length !== 3) return null;
    const date = new Date(
        parseInt(tokens[2], 10),
        parseInt(tokens[1], 10) - 1,
        parseInt(tokens[0], 10),
    );
    return isNaN(date.getTime()) ? null : date;
}

export const logger = {
    server: new Logger("backend"),
    client: new Logger("frontend"),
}