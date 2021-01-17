
import { mergeMap, retryWhen, switchMap, filter, take, finalize } from 'rxjs/operators';
import { GraphClientConfig, URLComponents } from './graph-client-interfaces';
import { oDataQueryNames } from './graph-const';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, timer } from 'rxjs';
import { Semaphore } from './semaphore';
import { uuid } from '../../utils/uuid';


export class GraphRequest<T> {
    urlComponents: URLComponents;

    constructor(private config: GraphClientConfig, private path: string, private httpClient: HttpClient,
        private accessToken: string, private semaphore: Semaphore) {
        this.urlComponents = {
            host: this.config.baseUrl,
            version: this.config.defaultVersion,
            oDataQueryParams: {},
            otherURLQueryParams: {}
        };
        this.parsePath(path);
    }

    public parsePath(rawPath: string) {
        // break rawPath into this.urlComponents

        // strip out the base url if they passed it in
        if (rawPath.indexOf('https://') !== -1) {
            rawPath = rawPath.replace('https://', '');

            // find where the host ends
            const endOfHostStrPos = rawPath.indexOf('/');
            this.urlComponents.host = 'https://' + rawPath.substring(0, endOfHostStrPos); // parse out the host
            // strip the host from rawPath
            rawPath = rawPath.substring(endOfHostStrPos + 1, rawPath.length);

            // then remove the following version
            const endOfVersionStrPos = rawPath.indexOf('/');
            // parse out the version
            this.urlComponents.version = rawPath.substring(0, endOfVersionStrPos);
            // strip version from rawPath
            rawPath = rawPath.substring(endOfVersionStrPos + 1, rawPath.length);
        }

        // strip out any leading "/"
        if (rawPath.charAt(0) === '/') {
            rawPath = rawPath.substr(1);
        }

        const queryStrPos = rawPath.indexOf('?');

        if (queryStrPos === -1) {
            // no query string
            this.urlComponents.path = rawPath;
        } else {
            this.urlComponents.path = rawPath.substr(0, queryStrPos);

            // capture query string into
            // this.urlComponents.oDataQueryParams
            // and
            // this.urlComponents.otherURLQueryParams

            const queryParams = rawPath.substring(queryStrPos + 1, rawPath.length).split('&');

            for (const queryParam of queryParams) {

                const pair = queryParam.split('=');

                const key = pair[0];
                const value = pair[1];

                if (oDataQueryNames.indexOf(key)) {
                    this.urlComponents.oDataQueryParams[key] = value;
                } else {
                    this.urlComponents.otherURLQueryParams[key] = value;
                }
            }
        }
    }

    select(properties: string | [string] | string[]): GraphRequest<T> {
        this.addCsvQueryParamater('$select', properties, arguments);
        return this;
    }

    expand(properties: string | [string] | string[]): GraphRequest<T> {
        this.addCsvQueryParamater('$expand', properties, arguments);
        return this;
    }

    orderby(properties: string | [string] | string[]): GraphRequest<T> {
        this.addCsvQueryParamater('$orderby', properties, arguments);
        return this;
    }

    filter(filterStr: string): GraphRequest<T> {
        if (filterStr !== null) {
            this.urlComponents.oDataQueryParams['$filter'] = filterStr;
        }
        return this;
    }

    search(searchStr: string): GraphRequest<T> {
        if (searchStr !== null) {
            this.urlComponents.oDataQueryParams['$search'] = `"${searchStr}"`;
        }
        return this;
    }

    top(n: number): GraphRequest<T> {
        this.urlComponents.oDataQueryParams['$top'] = n;
        return this;
    }

    skip(n: number): GraphRequest<T> {
        this.urlComponents.oDataQueryParams['$skip'] = n;
        return this;
    }

    skipToken(token: string): GraphRequest<T> {
        this.urlComponents.oDataQueryParams['$skipToken'] = token;
        return this;
    }

    count(count: boolean): GraphRequest<T> {
        this.urlComponents.oDataQueryParams['$count'] = count.toString();
        return this;
    }

    private urlJoin(urlSegments: [string] | string[]): String {
        const tr = (s) => s.replace(/\/+$/, '');
        const tl = (s) => s.replace(/^\/+/, '');
        const joiner = (pre, cur) => [tr(pre), tl(cur)].join('/');
        const parts = Array.prototype.slice.call(urlSegments);

        return parts.reduce(joiner);
    }

    public buildFullUrl(): string {
        const url = this.urlJoin([this.urlComponents.host,
        this.urlComponents.version,
        this.urlComponents.path])
            + this.createQueryString();
        return url;
    }

    query(queryDictionaryOrString: string | { [key: string]: string | number; }): GraphRequest<T> {
        if (typeof queryDictionaryOrString === 'string') { // is string
            const queryStr = queryDictionaryOrString;
            // split .query("$select=displayName") into key and balue
            const queryKey = queryStr.split('=')[0];
            const queryValue = queryStr.split('=')[1];

            this.urlComponents.otherURLQueryParams[queryKey] = queryValue;
        } else { // is dictionary
            // tslint:disable-next-line:forin
            for (const key in queryDictionaryOrString) {
                this.urlComponents.otherURLQueryParams[key] = queryDictionaryOrString[key];
            }
        }
        return this;
    }

    // ex: ?$select=displayName&$filter=startsWith(displayName, 'A')
    // does not include starting ?
    private createQueryString(): string {
        // need to combine first this.urlComponents.oDataQueryParams and this.urlComponents.otherURLQueryParams
        const q: string[] = [];

        if (Object.keys(this.urlComponents.oDataQueryParams).length !== 0) {
            // tslint:disable-next-line:forin
            for (const property in this.urlComponents.oDataQueryParams) {
                q.push(property + '=' + this.urlComponents.oDataQueryParams[property]);
            }
        }

        if (Object.keys(this.urlComponents.otherURLQueryParams).length !== 0) {
            // tslint:disable-next-line:forin
            for (const property in this.urlComponents.otherURLQueryParams) {
                q.push(property + '=' + this.urlComponents.otherURLQueryParams[property]);
            }
        }

        if (q.length > 0) {
            return '?' + q.join('&');
        }

        return '';
    }

    private addCsvQueryParamater(propertyName: string, propertyValue: string | [string] | string[], additionalProperties: IArguments) {
        // if there are already $propertyName value there, append a ","
        this.urlComponents.oDataQueryParams[propertyName] = this.urlComponents.oDataQueryParams[propertyName] ?
            this.urlComponents.oDataQueryParams[propertyName] + ',' : '';

        let allValues: string[] = [];

        if (typeof propertyValue === 'string') {
            allValues.push(propertyValue);
        } else { // propertyValue passed in as array
            allValues = allValues.concat(propertyValue);
        }

        // merge in additionalProperties
        if (additionalProperties.length > 1 && typeof propertyValue === 'string') {
            allValues = Array.prototype.slice.call(additionalProperties);
        }

        this.urlComponents.oDataQueryParams[propertyName] += allValues.join(',');
    }

    delete() {
        const url = this.buildFullUrl();
        const id = uuid();
        return this.withSemaphore(this.withRetry(this.httpClient.delete<T>(url, { headers: this.getHeaders(id) }), id), url, id);
    }

    patch(content: any, headers?: { [key: string]: string }) {
        const url = this.buildFullUrl();
        let header = {};
        const id = uuid();
        header['Authorization'] = 'Bearer ' + this.accessToken;
        // header['DPS_SEMAPHORE_ID'] = id;
        header = { ...header, ...headers };
        return this.withSemaphore(this.withRetry(this.httpClient.patch<T>(url, content, { headers: header }), id), url, id);
    }

    post(content: any | null, headers?: { [key: string]: string }, responseType?: string) {
        const url = this.buildFullUrl();
        const id = uuid();
        const defaultHeader = this.getHeaders(id);
        if (headers) {
            Object.keys(headers).forEach((key) => {
                if (defaultHeader.has(key)) {
                    defaultHeader.set(key, headers[key]);
                } else {
                    defaultHeader.append(key, headers[key]);
                }
            });
        }
        return this.withSemaphore(
            this.withRetry(this.httpClient.post<T>(url, content, { headers: defaultHeader, responseType: <'json'>responseType }), id),
            url, id
        );
    }

    put(content: any, headers?: { [key: string]: string }) {
        const url = this.buildFullUrl();
        let defaultHeader = { 'ContentType': 'application/octet-stream' };
        if (headers) {
            defaultHeader = { ...defaultHeader, ...headers };
        }
        const id = uuid();
        const httpHeaders = this.getHeaders(id);
        Object.keys(defaultHeader).forEach((key) => {
            httpHeaders.set(key, defaultHeader[key]);
        });
        return this.withSemaphore(this.withRetry(this.httpClient.put<T>(url, content, { headers: httpHeaders }), id), url, id);
    }

    private getHeaders(id: string) {
        return new HttpHeaders()
            .set('Authorization', 'Bearer ' + this.accessToken);
        // .set('DPS_SEMAPHORE_ID', id);

    }

    // request aliases
    // alias for post
    create(content: any) {
        return this.post(content);
    }

    // alias for patch
    update(content: any) {
        return this.patch(content);
    }

    request(method: string, content?: any) {
        const url = this.buildFullUrl();
        const id = uuid();
        return this.withSemaphore(
            this.withRetry(this.httpClient.request<T>(method, url, { headers: this.getHeaders(id), body: content }), id),
            url, id
        );
    }

    del() {
        return this.delete();
    }

    // get() {
    //     const url = this.buildFullUrl();
    //     return this.httpClient.get<T>(url, { headers: this.getHeaders() });
    // }
    get(headers?: { [key: string]: string }) {
        const url = this.buildFullUrl();
        let header = {};
        const id = uuid();
        header['Authorization'] = 'Bearer ' + this.accessToken;
        // header['DPS_SEMAPHORE_ID'] = id;
        header = { ...header, ...headers };
        return this.withSemaphore(this.withRetry(this.httpClient.get<T>(url, { headers: header }), id), url, id);

    }

    withSemaphore(obs: Observable<any>, url: string, id: string): Observable<T> {
        return new Observable(observer => {
            this.semaphore.waitOne(() => { observer.next(); observer.complete(); }, id, url.includes('/$batch'));
            // setTimeout(() => {
            //     this.semaphore.release(id);
            // }, 20000);
        }).pipe(
            switchMap(() => obs),
            finalize(() => {
                this.semaphore.release(id);
            })
        );
    }

    withRetry(obs: Observable<any>, id: string): Observable<T> {
        return obs.pipe(retryWhen(this.genericRetryStrategy(id)));
    }

    genericRetryStrategy(id: string) {
        return (attempts: Observable<any>) => {
            return attempts.pipe(mergeMap((error: HttpErrorResponse, i) => {
                const retryAttempt = i + 1;
                if (error.status === 429) {
                    this.semaphore.setThrottl(id, error);
                    const retryId = this.semaphore.getRetryId();
                    if (!retryId || retryId === id) {
                        this.semaphore.setRetryId(id);
                        if (error.headers.has('Retry-After')) {
                            return timer(Number(error.headers.get('Retry-After')) * 1000);
                        }
                        return timer(retryAttempt * 1000);
                    } else {
                        return this.semaphore.retryId$.pipe(
                            filter(val => !val),
                            take(1),
                            switchMap(() => timer(Number(error.headers.get('Retry-After')) * 1000))
                        );
                    }
                }
                if (retryAttempt > 3 || [400, 404, 403, 409].includes(error.status) ||
                    ['ErrorCannotDeleteObject', 'ErrorMoveCopyFailed', 'ErrorApplyConversationActionFailed', 'ErrorSendAsDenied']
                        .includes(error.error.error.code)) {
                    return throwError(error);
                } else {
                    console.warn('Graph API request retry ' + retryAttempt, error);
                    return timer(retryAttempt * 1000);
                }
            }));
        };
    }
}
