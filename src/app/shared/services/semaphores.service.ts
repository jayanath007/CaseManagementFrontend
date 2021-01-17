import { Injectable } from '@angular/core';
import { Semaphore } from '../../core/lib/semaphore';
import { ErrorDataUploadService } from './error-data-upload.service';

@Injectable({ providedIn: 'root' })
export class SemaphoresService {
    private outlookSemaphore: Semaphore;
    // private msgraphSemaphore = new Semaphore(4, 'msgraphSemaphore');
    // private msgraphBetaSemaphore = new Semaphore(4, 'msgraphBetaSemaphore');

    constructor(private errorDataUploadService: ErrorDataUploadService) {
        this.outlookSemaphore = new Semaphore(4, 'outlookSemaphore', errorDataUploadService);
    }

    public getOutlookSemaphore() {
        return this.outlookSemaphore;
    }
    public getMsgraphSemaphoree() {
        return this.outlookSemaphore;
    }
    public getMsgraphBetaSemaphore() {
        return this.outlookSemaphore;
    }
}
