import { ILogger } from "../interfaces";

export class ConsoleLogger implements ILogger {
    info(message: string, meta?: any) {
        this.log('info', message, meta);
    }
    warn(message: string, meta?: any) {
        this.log('warn', message, meta);
    }
    error(message: string, meta?: any) {
        this.log('error', message, meta);
    }

    private log(type: 'info' | 'warn' | 'error', message: string, meta: any) {
        const stringifiedMeta = JSON.stringify(meta || {});
        console[type](`${message} - ${stringifiedMeta}`)
    }
}