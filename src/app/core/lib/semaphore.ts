
import { HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Dictionary } from '..';
import { ConsoleError, ExceptiontTypes } from '../../shared/models/consol-error';
import { ErrorDataUploadService } from '../../shared/services/error-data-upload.service';

export class Semaphore {

    private callbacks: { isBatch: boolean, function: () => void }[] = [];
    private ids: string[] = [];
    private batchIds: string[] = [];
    private runningCallCount = 0;
    private retryIdSubject: BehaviorSubject<string>;
    public retryId$: Observable<string>;
    private throttl: Dictionary<Array<HttpErrorResponse>> = {};

    constructor(private capacity: number, private name: string, private errorDataUploadService: ErrorDataUploadService) {
        this.retryIdSubject = new BehaviorSubject<string>('');
        this.retryId$ = this.retryIdSubject.asObservable();
    }

    public getIds() {
        return { ids: this.ids, batchIds: this.batchIds };
    }
    public getCapacity() {
        return this.capacity;
    }
    public getName() {
        return this.name;
    }
    public getCallbacks() {
        return this.callbacks;
    }

    public getRetryId() {
        return this.retryIdSubject.value;
    }

    public setRetryId(id: string) {
        this.retryIdSubject.next(id);
    }
    public setThrottl(id: string, er: HttpErrorResponse) {
        let error = { ...er };
        if (!error.error.error.innerError || !error.error.error.innerError.date) {
            error = {
                ...er, error: {
                    ...er.error, error: {
                        ...er.error.error,
                        innerError: { ...error.error.error.innerError, date: new Date().toDpsString() }
                    }
                }
            };
        }
        if (this.throttl[id]) {
            this.throttl[id].push(error);
        } else {
            this.throttl[id] = [error];
        }
    }

    public waitOne(callback: () => void, id: string, isBatch: boolean) {
        if (isBatch) {
            this.batchIds.push(id);
            if (this.ids.length > 0 || this.batchIds.length > 1) {
                this.callbacks.push({ isBatch, function: callback });
            } else {
                callback();
                this.runningCallCount = this.capacity;
            }

        } else {
            this.ids.push(id);
            if (this.ids.length >= (this.capacity + 1) || this.batchIds.length > 0) {
                this.callbacks.push({ isBatch, function: callback });
            } else {
                callback();
                this.runningCallCount++;
            }
        }

    }

    public release(id: string) {
        if (id === this.retryIdSubject.value) {
            this.retryIdSubject.next('');
        }
        if (this.ids.find(i => i === id)) {
            const index = this.ids.indexOf(id);
            this.ids.splice(index, 1);
            this.runningCallCount--;
            const nextCallback = this.callbacks[this.callbacks.length - 1];
            if (nextCallback && !(nextCallback.isBatch && this.runningCallCount > 0)) {
                const callback = this.callbacks.shift();
                callback.function();
            }

        } else if (this.batchIds.find(i => i === id)) {
            const index = this.batchIds.indexOf(id);
            this.batchIds.splice(index, 1);
            this.runningCallCount = 0;

            while (this.runningCallCount < this.capacity) {
                const nextCallback = this.callbacks[this.callbacks.length - 1];
                if (nextCallback && !(nextCallback.isBatch && this.runningCallCount > 0)) {
                    const callback = this.callbacks.shift();
                    callback.function();
                    this.runningCallCount = nextCallback.isBatch ? this.capacity : (this.runningCallCount + 1);
                } else {
                    break;
                }
            }
        }
        if (this.throttl[id]) {
            const info = this.throttl[id][0];
            const lastError = this.throttl[id][this.throttl[id].length - 1];
            let throttlingTime = '0s';
            if (info.error.error && info.error.error.innerError && lastError.error.error && lastError.error.error.innerError) {
                throttlingTime = ((
                    new Date(lastError.error.error.innerError['date']).valueOf() -
                    new Date(info.error.error.innerError['date']).valueOf()) / 1000) + 's';
            }
            const properties = {
                ...info,
                errorCode: info.error.error ? info.error.error.code : '',
                clientRequestId: (info.error.error && info.error.error.innerError) ?
                    info.error.error.innerError['client-request-id'] : '',
                errorDate: (info.error.error && info.error.error.innerError) ? info.error.error.innerError['date'] : '',
                retryAttempt: this.throttl[id].length,
                throttlingTime
            };
            delete properties['headers'];
            delete properties['error'];

            const trackException: ConsoleError = {
                exception: info.error.error ? info.error.error.message : 'network errors',
                properties: JSON.parse((JSON.stringify(properties))),
                measurements: null
            };
            this.errorDataUploadService.addErrorInfor(trackException, ExceptiontTypes.graphAPI);
            delete this.throttl[id];
        }
    }

}
