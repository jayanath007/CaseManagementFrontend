import { Injectable } from '@angular/core';
import { PreloadingStrategy, Route } from '@angular/router';
import { Observable ,  of } from 'rxjs';
import { AzureAuthService } from '../../auth';

@Injectable()
export class ModulePreloadStrategy implements PreloadingStrategy {

    constructor(private authService: AzureAuthService) {
    }

    preload(route: Route, load: Function): Observable<any> {
        return route.data && route.data.preload ? load() : of(null);
    }
}
