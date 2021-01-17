import { getChangePageSetupValuesByToken } from './../reducers/index';
import { GetPageSetupDataFail } from './../actions/core';

import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { DatePipe } from '@angular/common';

import * as PageSetup from '../actions/core';
import { switchMap, tap, catchError, map, mergeMap, take } from 'rxjs/operators';
import { of, from } from 'rxjs';
import { PageSetupService } from '../services/page-setup.service';

@Injectable()
export class PageSetupEffects {

  constructor(private datePipe: DatePipe, private actions$: Actions, private store: Store<any>,
    private pageSetupService: PageSetupService) { }
  @Effect()
  initPostingPeriod$ = this.actions$.pipe(ofType<PageSetup.InitPageSetup>(PageSetup.INIT_PAGE_SETUP),
    mergeMap(action => from([
      new PageSetup.GetPageSetupData(action.token),
    ])));
  @Effect()
  getPageSetupData$ = this.actions$.pipe(ofType<PageSetup.GetPageSetupData>(PageSetup.GET_PAGE_SETUP_DATA),
    switchMap(action =>
      this.pageSetupService.getPageSetupService().pipe(map((result) =>
        new PageSetup.GetPageSetupDataSuccess(action.token, { pageSetupData: result })),
        catchError(error => of(new PageSetup.GetPageSetupDataFail(action.token, error)))
      )
    ));
  @Effect()
  savePageSetting$ = this.actions$.pipe(ofType<PageSetup.SaveSetupChanges>(PageSetup.SAVE_PALGE_SETUP_CHANGES),
    switchMap((action) =>
      this.store.select(getChangePageSetupValuesByToken(action.token)).pipe(
        take(1),
        switchMap((info) =>
          this.pageSetupService.SaveSetupChanges(info).pipe(map((result) =>
            new PageSetup.SaveSetupChangesSuccess(action.token, result)),
            catchError(error => of(new PageSetup.SaveSetupChangesFail(action.token, error))))
        ))));
}
