import { ErrorHandler, Injectable } from '@angular/core';

@Injectable()
export class GlobalErrorHandlerService implements ErrorHandler {

    constructor() { }

    // Every thrown error ends up here
    // We can extend handling with adding cases end logic of our choices
    handleError(error: any): void {
        console.error(error);
    }
}
