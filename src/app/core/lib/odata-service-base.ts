
import { map, filter, switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { GraphRequest } from './graph-request';
import { GraphClientConfig } from './graph-client-interfaces';
import { Semaphore } from './semaphore';



export class ApiClientWrapper<T> {
    constructor(private config: GraphClientConfig, private httpClient: HttpClient,
        private accessToken: string, private semaphore: Semaphore) {
    }

    api(path: string) {
        return new GraphRequest<T>(this.config, path, this.httpClient, this.accessToken, this.semaphore);
    }
}


export class OdataServiceBase {

    constructor(protected httpClient: HttpClient,
        protected config: GraphClientConfig) {
    }

    public getAuthClient<T>(semaphore: Semaphore): Observable<ApiClientWrapper<T>> {
        return this.getAuthClientWithConfig(this.config, semaphore);
    }

    public getAuthClientWithConfig<T>(config: GraphClientConfig, semaphore: Semaphore): Observable<ApiClientWrapper<T>> {
        return this.getAuthToken().pipe(
            filter(token => !!token && token !== ''),
            map((token) => new ApiClientWrapper<T>(config, this.httpClient, token, semaphore))
        );
    }

    protected getAuthToken(): Observable<string> { throw new Error('Not implemented'); }

}



