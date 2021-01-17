
import {map} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { GetLogFileSuccess, GET_LOG_FILE_SUCCESS } from '../../bundle-monitor-core/actions/core';
import { UrlPopupService } from '../../shell-desktop/services/url-popup.service';

@Injectable()
export class BundleMonitorEffect {
    constructor(private action$: Actions, private urlPopupService: UrlPopupService) { }

    @Effect({ dispatch: false })
    viewLogFile$ = this.action$.pipe(ofType<GetLogFileSuccess>(GET_LOG_FILE_SUCCESS),
        map((action) => {
            this.urlPopupService.openWithUrlPoup(action.url, 'bundleLogViewer', true, false, 'Log file View', true);
        }));
}
