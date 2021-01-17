import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import * as MasterData from '../actions/master-data';
import { switchMap, map, take, filter, catchError } from 'rxjs/operators';
import { getDepartmentList, getLookupListByType, getCrimeLookupList, getFeeEarnerList, getBranchList } from '../reducers';
import { MasterDataServices } from '../services/master-data.service';

@Injectable()
export class MasterDataEffects {
    constructor(private actions$: Actions, private store: Store<any>, private service: MasterDataServices) { }


    @Effect()
    getDepartmentList$ = this.actions$.pipe(ofType<MasterData.GetDepartment>(MasterData.GET_DEPARTMENT_LIST),
        switchMap((action) =>
            this.store.select(getDepartmentList).pipe(
                map((departments) => ({ departments: departments, action: action })),
                take(1))),
        filter(info => info.departments.data.length < 1),
        switchMap((info) =>
            this.service.getDepartmentList().pipe(
                map((result) => new MasterData.GetDepartmentSuccess({ departmentList: result })),
                catchError((error) => of(new MasterData.GetDepartmentFail())))
        ));

    @Effect()
    getWorkTypeList$ = this.actions$.pipe(ofType<MasterData.GetWorkTypeList>(MasterData.GET_WORK_TYPE_LIST),
        switchMap((action) => {
            return this.service.getWorkTypeList().pipe(
                map((result) => new MasterData.GetWorkTypeListSuccess({ workTypeList: result })),
                catchError((error) => of(new MasterData.GetWorkTypeListFail())));
        }));

    @Effect()
    getLoockupDataList$ = this.actions$.pipe(ofType<MasterData.GetLookupList>(MasterData.GET_LOOCKUP_LIST),
        switchMap((action) =>
            this.store.select(getLookupListByType(action.lookupType)).pipe(
                map((list) => ({ list: list, action: action })),
                take(1))),
        filter(info => !info.list || info.list.length < 1),
        switchMap((info) =>
            this.service.getLookupType(info.action.lookupType).pipe(
                map((result) => new MasterData.GetLookupListSuccess({ data: result })),
                catchError((error) => of(new MasterData.GetLookupListFail())))
        ));

    @Effect()
    loadAttendeesAndWorkLookupData$ = this.actions$.pipe(ofType<MasterData.GetCrimeLookupList>(MasterData.GET_CRIME_LOOCKUP_LIST),
        switchMap(action =>
            this.store.select(getCrimeLookupList(action.lookupType)).pipe(
                map(lookupData => ({
                    lookupData,
                    lookupType: action.lookupType
                })), take(1))
        ), filter(info => !info.lookupData || info.lookupData.length === 0)
        , switchMap(info => {
            return this.service.GetCrimeLookupData(info.lookupType).pipe(
                map(result => new MasterData.GetCrimeLookupListSuccess({ lookupType: info.lookupType, data: result })),
                catchError(() => of(new MasterData.GetCrimeLookupListFail())));
        }));

    @Effect()
    getFeeEarnerList$ = this.actions$.pipe(ofType<MasterData.GetFeeEarnerList>(MasterData.GET_FEE_EARNER_LIST),
        switchMap(action =>
            this.store.select(getFeeEarnerList(action.isActive)).pipe(
                map((list) => ({ list: list, isActive: action.isActive })),
                take(1))),
        filter(({ list, isActive }) => !list || list.length === 0),
        switchMap(({ list, isActive }) =>
            this.service.getFeeEarnerList(true).pipe(
                map((result) => new MasterData.GetFeeEarnerListSuccess(isActive, result)),
                catchError((error) => of(new MasterData.GetFeeEarnerListFail())
                ))));

    @Effect()
    getBranchList$ = this.actions$.pipe(ofType<MasterData.GetBranchList>(MasterData.GET_BRANCH_LIST),
        switchMap(action =>
            this.store.select(getBranchList).pipe(
                take(1))),
        filter(branchList => !branchList || branchList.length === 0),
        switchMap(list =>
            this.service.getBranchList().pipe(
                map((result) => new MasterData.GetBranchListSuccess(result)),
                catchError((error) => of(new MasterData.GetBranchListFail())))),
    );
}


