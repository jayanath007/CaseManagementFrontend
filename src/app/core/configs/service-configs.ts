import { Injectable } from '@angular/core';
// export const serviceBase = new InjectionToken<string>('serviceBase');
// export const WOPI_BASE = new InjectionToken<string>('WOPI_BASE');
// export const outlookApiBase = new InjectionToken<string>('OutlookApiBase');
// export const graphApiBase = new InjectionToken<string>('GraphApiBase');
// export const pdfviwer = new InjectionToken<string>('pdfviwer');
import { GraphClientConfig } from '../lib/graph-client-interfaces';
import { AppConfig } from './app-config';

@Injectable()
export class ServiceEndpointConfig {

    constructor(private appConfig: AppConfig) { }

    getGraphApiConfig(version = 'v1.0'): GraphClientConfig {
        return { baseUrl: this.appConfig.graphApiBase, defaultVersion: version };
    }

    getOutlookApiConfig(): GraphClientConfig {
        return { baseUrl: this.appConfig.outlookApiBase, defaultVersion: 'beta' };
    }

}
