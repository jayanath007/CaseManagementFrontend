import { Dictionary } from '..';

export interface GraphClientConfig {
    baseUrl: string;
    defaultVersion: string;
}

export interface URLComponents {
    host: string;
    version: string;
    path?: string;
    oDataQueryParams: { [key: string]: string | number };
    otherURLQueryParams: { [key: string]: string | number };
}

export interface MgGraphBatchResponseItem<T> {
    id: string;
    status: number;
    headers?: any;
    body?: T;
}

export interface MgGraphBatchResponse<T> {
    responses: MgGraphBatchResponseItem<T>[];

}

export interface MgGraphBatchRequest {
    id: string;
    method: 'GET' | 'POST' | 'DELETE';
    url: string;
    dependsOn?: string[];
    body?: any;
    headers?: Dictionary<string>;
}

