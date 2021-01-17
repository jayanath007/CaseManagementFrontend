
import { map, switchMap, mergeAll, reduce, switchMapTo } from 'rxjs/operators';
import { AuthInfoStateService } from '../../auth';
import { HttpClient } from '@angular/common/http';
import { GraphClientConfig, MgGraphBatchRequest } from './graph-client-interfaces';
import { Observable, from, of, timer } from 'rxjs';
import { OdataServiceBase } from './odata-service-base';
import { MgGraphBatchResponse, MgGraphBatchResponseItem } from './graph-client-interfaces';
import * as _ from 'lodash';
import { Semaphore } from './semaphore';

export class MsgraphClientBase extends OdataServiceBase {

    constructor(protected authInfo: AuthInfoStateService, httpClient: HttpClient, protected config: GraphClientConfig) {
        super(httpClient, config);
    }

    protected getAuthToken(): Observable<string> {
        return this.authInfo.getGraphApiToken();
    }
    public getBetaApiClient<T>(semaphore: Semaphore) {
        return this.getAuthClientWithConfig<T>({ ...this.config, defaultVersion: 'beta' }, semaphore);
    }
    public batchRequest<T>(requests: MgGraphBatchRequest[], semaphore: Semaphore) {
        return this.splitedBatch<T>(requests, semaphore);
    }
    public batchRequestBeta<T>(requests: MgGraphBatchRequest[], semaphore: Semaphore) {
        return this.splitedBatchBeta<T>(requests, semaphore);
    }

    public splitedBatch<T>(requests: MgGraphBatchRequest[], semaphore: Semaphore): Observable<MgGraphBatchResponse<T>> {
        const maxBatchSize = semaphore.getCapacity();
        return from(_.range(0, requests.length, maxBatchSize)).pipe(
            map((start: number) => {
                return this.getAuthClient<MgGraphBatchResponse<T>>(semaphore).pipe(switchMap(client =>
                    client.api(`/$batch`)
                        .post({ requests: requests.slice(start, start + maxBatchSize) }).pipe(map(result => {
                            return result;
                        }))
                ));
            }),
            mergeAll(3),
            reduce((responses: MgGraphBatchResponseItem<T>[], current: any) => responses.concat(current.responses), []),
            map((responses) => ({ responses: responses } as MgGraphBatchResponse<T>)),
            switchMap(({ responses }) => {
                const errors = responses.filter(res => res.status === 429);
                if (errors.length > 0) {
                    const retryAfter = errors.find(val => val.headers && val.headers['Retry-After']);
                    const reRequests = requests.filter(req => errors.find(err => err.id === req.id));
                    if (retryAfter) {
                        return timer(Number(retryAfter.headers['Retry-After']) * 1000).pipe(
                            switchMapTo(
                                this.splitedBatch<T>(reRequests, semaphore).pipe(
                                    map((reRes: MgGraphBatchResponse<T>) => ({
                                        responses: responses.map(
                                            res => res.status === 429 ? (reRes.responses.find(r => r.id === res.id) || res) : res
                                        )
                                    }))
                                )
                            )
                        );
                    }
                    return this.splitedBatch<T>(reRequests, semaphore).pipe(
                        map((reRes: MgGraphBatchResponse<T>) => ({
                            responses: responses.map(res => res.status === 429 ? (reRes.responses.find(r => r.id === res.id) || res) : res)
                        }))
                    );
                }
                return of({ responses });
            })
        );
    }
    public splitedBatchBeta<T>(requests: MgGraphBatchRequest[], semaphore: Semaphore) {
        const maxBatchSize = semaphore.getCapacity();
        return from(_.range(0, requests.length, maxBatchSize)).pipe(
            map((start: number) => {
                return this.getBetaApiClient<MgGraphBatchResponse<T>>(semaphore).pipe(switchMap(client =>
                    client.api(`/$batch`)
                        .post({ requests: requests.slice(start, start + maxBatchSize) }).pipe(map(result => {
                            return result;
                        }))
                ));
            }),
            mergeAll(3),
            reduce((responses: MgGraphBatchResponseItem<T>[], current: any) => responses.concat(current.responses), []),
            map((responses) => ({ responses: responses } as MgGraphBatchResponse<T>)),
            switchMap(({ responses }) => {
                const errors = responses.filter(res => res.status === 429);
                if (errors.length > 0) {
                    const retryAfter = errors.find(val => val.headers && val.headers['Retry-After']);
                    const reRequests = requests.filter(req => errors.find(err => err.id === req.id));
                    if (retryAfter) {
                        return timer(Number(retryAfter.headers['Retry-After']) * 1000).pipe(
                            switchMapTo(
                                this.splitedBatchBeta<T>(reRequests, semaphore).pipe(
                                    map((reRes: MgGraphBatchResponse<T>) => ({
                                        responses: responses.map(
                                            res => res.status === 429 ? (reRes.responses.find(r => r.id === res.id) || res) : res
                                        )
                                    }))
                                )
                            )
                        );
                    }
                    return this.splitedBatch<T>(reRequests, semaphore).pipe(
                        map((reRes: MgGraphBatchResponse<T>) => ({
                            responses: responses.map(res => res.status === 429 ? (reRes.responses.find(r => r.id === res.id) || res) : res)
                        }))
                    );
                }
                return of({ responses });
            })
        );
    }
}
