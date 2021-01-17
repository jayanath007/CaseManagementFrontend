import { getLogingUserByToken } from './../reducers/index';

import {
    getLoadingByToken,
    getDepartmentListByToken, getUsersLoadingByToken, getUsersListByToken, getSelectedViewTypeByToken,
    getSelectedYearAndMonthByToken, getSelectedUserByToken, getMonthActivityListByToken,
    getActivityListByDayByToken, getActivityListByYearByToken
} from '../reducers/index';
import { Store } from '@ngrx/store';
import { createDefultColumnDef } from '../../core/lib/grid-helpers';
import { ColumnDef, PaginatorDef } from '../../core/lib/grid-model';
import {
    InitTeam, UpdateUserSearchText, ChangeDepartmentOrTeamType, ChangeUserViewType, SelectYearAndMonthValue,
    TeamUserChange, RequestActivityByMonth, GetActivityDataByDay, RequestActivityByYearSummery, ClearActivityDataByDay,
} from '../actions/core';
import { UserViewType } from '../models/enum';


export class BaseTeamManager {

    isLoading$: any;
    departmentList$: any;
    teamUsersLoading$: any;
    teamUsersList$: any;
    selectedViewType$: any;
    selectedYearAndMonth$: any;
    selectedTeamUser$: any;
    monthActivityList$: any;
    activityListByDay$: any;
    eventYearSummery$: any;
    logingUser$: any;



    constructor(protected store: Store<any>) {
    }

    columnDef: ColumnDef[] = [
        createDefultColumnDef('Status', { label: 'Status', fxFlex: '100px', filterAnchor: 'end', filterHidden: true }),
        createDefultColumnDef('Jan', { label: 'Jan', fxFlex: '100px', filterAnchor: 'end', filterHidden: true }),
        createDefultColumnDef('Feb', { label: 'Feb', fxFlex: '100px', filterAnchor: 'end', filterHidden: true }),
        createDefultColumnDef('Mar', { label: 'Mar', fxFlex: '100px', filterAnchor: 'end', filterHidden: true }),
        createDefultColumnDef('Apr', { label: 'Apr', fxFlex: '100px', filterAnchor: 'end', filterHidden: true }),
        createDefultColumnDef('May', { label: 'May', fxFlex: '100px', filterAnchor: 'end', filterHidden: true }),
        createDefultColumnDef('Jun', { label: 'Jun', fxFlex: '100px', filterAnchor: 'end', filterHidden: true }),
        createDefultColumnDef('Jul', { label: 'Jul', fxFlex: '100px', filterAnchor: 'end', filterHidden: true }),
        createDefultColumnDef('Aug', { label: 'Aug', fxFlex: '100px', filterAnchor: 'end', filterHidden: true }),
        createDefultColumnDef('Sep', { label: 'Sep', fxFlex: '100px', filterAnchor: 'end', filterHidden: true }),
        createDefultColumnDef('Oct', { label: 'Oct', fxFlex: '100px', filterAnchor: 'end', filterHidden: true }),
        createDefultColumnDef('Nov', { label: 'Nov', fxFlex: '100px', filterAnchor: 'end', filterHidden: true }),
        createDefultColumnDef('Dec', { label: 'Dec', fxFlex: '100px', filterAnchor: 'end', filterHidden: true }),
    ];



    paginatorDef = { currentPage: 0, itemPerPage: 50 };

    protected initSelectors(token: string, columnDef: any, paginDef: PaginatorDef) {

        this.init(token, { columnDef: columnDef, paginatorDef: paginDef, filterOperate: null });
        this.isLoading$ = this.store.select(getLoadingByToken(token));
        this.selectedViewType$ = this.store.select(getSelectedViewTypeByToken(token));
        this.departmentList$ = this.store.select(getDepartmentListByToken(token));
        this.teamUsersLoading$ = this.store.select(getUsersLoadingByToken(token));
        this.teamUsersList$ = this.store.select(getUsersListByToken(token));
        this.selectedYearAndMonth$ = this.store.select(getSelectedYearAndMonthByToken(token));
        this.selectedTeamUser$ = this.store.select(getSelectedUserByToken(token));
        this.monthActivityList$ = this.store.select(getMonthActivityListByToken(token));
        this.activityListByDay$ = this.store.select(getActivityListByDayByToken(token));
        this.eventYearSummery$ = this.store.select(getActivityListByYearByToken(token));
        this.logingUser$ = this.store.select(getLogingUserByToken(token));





    }

    init(token, payload) {
        this.store.dispatch(new InitTeam(token, payload));
    }

    onUserSearchTextcahange(token: string, searchText) {
        this.store.dispatch(new UpdateUserSearchText(token, searchText));

    }

    onChangeDepartmentValue(token: string, Ddata) {
        this.store.dispatch(new ChangeDepartmentOrTeamType(token, { departmentData: Ddata }));

    }

    onChangeViewTypeValue(token: string, value) {
        this.store.dispatch(new ChangeUserViewType(token, { viewType: value }));
        if (value === UserViewType.MonthView) {
            this.store.dispatch(new RequestActivityByMonth(token));
        } else {
            this.store.dispatch(new RequestActivityByYearSummery(token));
        }


    }

    onSelectYearAndMonthValue(token: string, value) {
        this.store.dispatch(new SelectYearAndMonthValue(token, { selectdate: value.selectdate, kind: value.kind }));
        if (value.kind === UserViewType.MonthView) {
            this.store.dispatch(new RequestActivityByMonth(token));
        } else {
            this.store.dispatch(new RequestActivityByYearSummery(token));
        }

    }

    teamUserChange(token: string, value) {
        this.store.dispatch(new TeamUserChange(token, { user: value }));
    }

    selectDayForDetails(token: string, ids) {
        if (ids && ids.length > 0) {
            this.store.dispatch(new GetActivityDataByDay(token, { movementIds: ids }));
        } else {
            this.store.dispatch(new ClearActivityDataByDay(token));
        }
    }

}
