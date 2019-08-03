export class ExtendedError extends Error {
    constructor(message?: string,
                private meta: object = {}) {
        super(message);
    }
}