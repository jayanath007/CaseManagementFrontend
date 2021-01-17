import { Mode } from './../models/enums';
import {
  getEstateOverviewModelByToken, getFormTypeByToken,
  getMatterByToken, getPECategoryListByToken, getSelectedGridRowByToken
} from './../reducers/index';
import { Injectable, Injector } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { ProbateEstateOverviewService } from '../services/probate-estate-overview.service';
import * as EstateOverview from '../actions/core';
import { combineLatest, from, of } from 'rxjs';
import { catchError, filter, map, mergeMap, switchMap, take } from 'rxjs/operators';
import { identifierName } from '@angular/compiler';

@Injectable()
export class ProbateEstateOverviewEffects {
  constructor(private actions$: Actions, private store: Store<any>,
    private probateEstateOverviewService: ProbateEstateOverviewService, private injector: Injector) { }

  // @Effect()
  // initEstateOverview$ = this.actions$.pipe(ofType<EstateOverview.InitEstateOverview>(EstateOverview.INIT_PROBATE_ESTATE_OVERVIEW),
  //   mergeMap(action => {
  //     if (action.payload.inputData && action.payload.inputData.mode === Mode.EditMode) {
  //       return from([
  //         new EstateOverview.GetCategoryList(action.token),
  //         new EstateOverview.GetEditData(action.token, action.payload.inputData.editData)
  //       ]);
  //     } else {
  //       return from([new EstateOverview.GetCategoryList(action.token)]);
  //     }
  //   }));
  @Effect()
  initEstateOverviewData$ = this.actions$.pipe(ofType<EstateOverview.InitEstateOverview>(EstateOverview.INIT_PROBATE_ESTATE_OVERVIEW),
    switchMap(action =>
      this.store.select(getPECategoryListByToken(action.token)).pipe(
        map((category) => ({ category, action: action })),
        take(1))),
    mergeMap<any, any>(info => {
      if (info.category && info.action.payload.inputData.mode === Mode.EditMode) {
        return from(
          [
            new EstateOverview.GetEditData(info.action.token, info.action.payload.inputData.editData)
          ]);
      } else if (info.category && info.action.payload.inputData.mode === Mode.AddMode) {
        return from([]);
      } else if (info.action.payload.inputData.mode === Mode.EditMode) {
        return from([
          new EstateOverview.GetCategoryList(info.action.token),
          new EstateOverview.GetEditData(info.action.token, info.action.payload.inputData.editData)
        ]);
      } else {
        return from([new EstateOverview.GetCategoryList(info.action.token)]);
      }

    }));
  @Effect()
  categoryDropdowns$ = this.actions$.pipe(ofType<EstateOverview.GetCategoryList>(EstateOverview.GET_ESTATE_OVERVIEW_CATEGORY_LIST),
    switchMap((action) =>
      this.probateEstateOverviewService.getProbateCategory().pipe(
        map((result) => new EstateOverview.GetCategoryListSuccess(action.token, { categoryList: result })),
        catchError((error) => of(new EstateOverview.GetCategoryListFail(action.token, error))))
    ));
  @Effect()
  editData$ = this.actions$.pipe(ofType<EstateOverview.GetEditData>(EstateOverview.GET_EO_EDIT_DATA),
    switchMap((action) =>
      this.probateEstateOverviewService.getProbateItemById(action.estateOverviewRow.rowId).pipe(
        map((result) => new EstateOverview.GetEditDataSuccess(action.token, { editData: result })),
        catchError((error) => of(new EstateOverview.GetEditDataFail(action.token, error))))
    ));
  @Effect()
  saveData$ = this.actions$.pipe(ofType<EstateOverview.SaveEstateOverviewData>(EstateOverview.ESTATE_OVERVIEW_SAVE),
    switchMap(action => this.store.select(getEstateOverviewModelByToken(action.token)).pipe(
      take(1),
      map(saveModel => ({ saveModel, action }))
    )),
    switchMap(({ saveModel, action }) =>
      this.probateEstateOverviewService.saveProbateEstateItem(saveModel).pipe(map((respond) =>
        new EstateOverview.SaveEstateOverviewDataSuccess(action.token, { probateTransId: respond })),
        catchError(error => of(new EstateOverview.SaveEstateOverviewDataFail(action.token, error)))
      )));

  @Effect()
  deleteProbateAccount$ = this.actions$.
    pipe(ofType<EstateOverview.DeleteProbateAccountItem>(EstateOverview.ESTATE_OVERVIEW_DELETE_ACCOUNT_DATA),
      switchMap(action => this.store.select(getSelectedGridRowByToken(action.token)).pipe(
        take(1),
        map(row => ({ row, action }))
      )),
      switchMap(({ row, action }) =>
        this.probateEstateOverviewService.deleteAccountItem(row.rowId).pipe(
          map((result) => new EstateOverview.DeleteProbateAccountItemSuccess(action.token, row.rowId)),
          catchError((error) => of(new EstateOverview.DeleteProbateAccountItemFail(action.token, error))))
      ));

  @Effect()
  getAssetDropdown$ = this.actions$.
    pipe(ofType<EstateOverview.SetSelectedCategory>(EstateOverview.ESTATE_OVERVIEW_SET_SELECTED_CATEGORY),
      switchMap((action: EstateOverview.SetSelectedCategory) =>
        combineLatest(
          this.store.select(getMatterByToken(action.token)),
          this.store.select(getFormTypeByToken(action.token)),
          ((matterData, formType) => ({ matterData, formType, action: action }))
        ).pipe(take(1))
      ),
      switchMap((info) =>
        this.probateEstateOverviewService.getJointlyOwnedAssetsByMatter(info.matterData, info.formType, info.action.selectedItem).pipe(
          map((result) => new EstateOverview.GetJointlyOwnedAssetsListSuccess(info.action.token, { assetItemForDropDown: result })),
          catchError((error) => of(new EstateOverview.GetJointlyOwnedAssetsListFail(info.action.token, error))))
      ));
  @Effect()
  getAssetDropdownFromEdit$ = this.actions$.
    pipe(ofType<EstateOverview.GetEditDataSuccess>(EstateOverview.GET_EO_EDIT_DATA_SUCCESS),
      switchMap((action: EstateOverview.GetEditDataSuccess) =>
        combineLatest(
          this.store.select(getMatterByToken(action.token)),
          this.store.select(getFormTypeByToken(action.token)),
          ((matterData, formType) => ({ matterData, formType, action: action }))
        ).pipe(take(1))
      ),
      switchMap((info) =>
        this.probateEstateOverviewService.getJointlyOwnedAssetsByMatter(info.matterData, info.formType, {
          id: info.action.payload.editData.category,
          description: ''
        }).pipe(
          map((result) => new EstateOverview.GetJointlyOwnedAssetsListSuccess(info.action.token, { assetItemForDropDown: result })),
          catchError((error) => of(new EstateOverview.GetJointlyOwnedAssetsListFail(info.action.token, error))))
      ));
}
