import { ConsoleError, ExceptiontTypes } from '../models/consol-error';
import { SeverityLevel } from 'ng2-appinsights';
import { ErrorHandler, Injectable, Injector } from '@angular/core';
import { ErrorDataUploadService } from './error-data-upload.service';


@Injectable()
export class ErrorLoggerService implements ErrorHandler {

    constructor(private injector: Injector) { }

    handleError(error: Error) {
        if (!(error && error.message && error.message.includes('matMenuTriggerFor: must pass in an mat-menu instance.'))) {
            const errorDataUploadService = this.injector.get(ErrorDataUploadService);

            const trackException: ConsoleError = {
                exception: { stack: error.stack, message: error.message },
                handledAt: 'unhandled',
                properties: {},
                measurements: null,
                severityLevel: SeverityLevel.Error,
            };
            errorDataUploadService.addErrorInfor(trackException, ExceptiontTypes.console);
            console.error(error);
        }
    }



}
