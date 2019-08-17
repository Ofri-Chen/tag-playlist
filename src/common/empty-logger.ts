import { ILogger } from "../interfaces";

export class EmptyLogger implements ILogger {
    info() { }
    warn() { }
    error() { }
}