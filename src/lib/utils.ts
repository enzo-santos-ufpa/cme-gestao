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

export const logger = {
    server: new Logger("backend"),
    client: new Logger("frontend"),
}