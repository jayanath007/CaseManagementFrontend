
import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { DatePipe } from '@angular/common';
import { PostingPeriodService } from '../services/posting-period.service';
import * as PostingPeriod from '../actions/core';
import { switchMap, tap, catchError, map, mergeMap } from 'rxjs/operators';
import { of, from } from 'rxjs';
import { LocalStorageKey } from '../../core';
import { PosingPeriod } from '../../setting-core';


@Injectable()
export class PostingPeriodEffects {

  constructor(private datePipe: DatePipe, private actions$: Actions, private store: Store<any>,
    private postingPeriodService: PostingPeriodService) { }

  @Effect()
  initPostingPeriod$ = this.actions$.pipe(ofType<PostingPeriod.InitPosingPeriod>(PostingPeriod.INIT_POSTING_PERIOD),
    mergeMap(action => from([
      new PostingPeriod.GetPosingPeriod(action.token),
    ])));

  @Effect()
  getPostingPeriod$ = this.actions$.pipe(ofType<PostingPeriod.GetPosingPeriod>(PostingPeriod.GET_POSTING_PERIOD),
    switchMap(action =>
      this.postingPeriodService.getOpenTransactionPeriods().pipe(map((periods) =>
        new PostingPeriod.GetPosingPeriodSuccess(action.token, { posingPeriodList: periods })),
        catchError(error => of(new PostingPeriod.GetPosingPeriodFail(action.token, error)))
      )
    ));

  @Effect({ dispatch: false })
  selectPostingPeriod$ = this.actions$.pipe(ofType<PostingPeriod.SetSelectedPosingPeriod>(PostingPeriod.SET_SELECTED_POSTING_PERIOD),
    tap(action => {
      localStorage.setItem(LocalStorageKey.PostingPeriod,  JSON.stringify(action.payload.selectedPeriod));
    }));

  @Effect()
  setInitPostingPeriod$ = this.actions$.pipe(ofType<PostingPeriod.InitPosingPeriod>(PostingPeriod.INIT_POSTING_PERIOD),
    map(action => {
      const tempValue = localStorage.getItem(LocalStorageKey.PostingPeriod);
      const selectedPeriod: PosingPeriod  = tempValue ? JSON.parse(tempValue) : null;
      return new PostingPeriod.SetSelectedPosingPeriod(action.token, { selectedPeriod: selectedPeriod });
    }));
}
