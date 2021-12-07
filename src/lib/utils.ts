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


export const logger = {
    server: new Logger("backend"),
    client: new Logger("frontend"),
}