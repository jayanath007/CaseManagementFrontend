import { take, filter } from 'rxjs/operators';
import { MatterTypeEnum } from '../models/enums';
import { combineLatest } from 'rxjs';
import { Store } from '@ngrx/store';
import {
    getTeamEfficiencyTimeRecordedDataByToken,
    getTeamEfficiencyMonthListByToken, getTeamEfficiencyTimeRecordOptionByToken,
    getTimeRecordDataIsLoadedByToken, getTimeRecordDepartmentListByToken,
    getTeamEfficiencySelectedMonthByToken, getTeamEfficiencySelectedDepartmentByToken,
    getTimeRecordLoadingByToken, getTimeRecordChartFullTitleByToken, getEventYearSummeryByToken
} from '../reducers';
import { getHomeCurrency } from '../../setting-core';
import { TimeRecordedOption } from '../models/enums';
import {
    ChangeTETimeRecordedOption, ChangeTEDepartment, ChangeTEMonth,
    ChangeTEUser, ChangeTEMatterType, InitTeamEfficiency
} from '../actions/core';
import { Department, Month } from '../models/interfaces';
import { getSelectedTeamMemberByToken, getTeamMemberCountByToken } from '../../team-member-core/reducers';
import { TeamMember } from '../../core/lib/team-members';
import {
    getTeamEffAdgedDebDataByToken, getTeamEffBilledTimesByToken,
    getTeamEffCashReceived, getTeamEffMatterData
} from '../reducers';
import { getMenuItemDisplayName } from './../../layout-desktop/reducers/index';
import { getUserActivityLoadingByToken, getActivityTitleByToken } from './../reducers/index';
import { getUser, User } from '../../auth';

export class BaseTeamEfficiencyManager {
    myToken: string;

    public timeRecodedData$: any;
    public monthList$: any;
    public timeRecordOption$: any;
    public isTimeRecordDataLoading$: any;
    public departmentList$: any;
    public selectedMonth$: any;
    public selectedDepartment$: any;
    public selectedTeamMember$: any;
    public teamMemberCount$: any;
    public isPageLoading$: any;
    public timeRecordChartTitle$: any;
    public adgedDebData$: any;
    public billeTimesData$: any;
    public cashReceivedData$: any;
    public matterData$: any;
    public homeCurrency$: any;
    public eventYearSummery$: any;
    public userActivityLoading$: any;
    public activityTitle$: any;

    constructor(protected store: Store<any>) {

    }

    protected initSelectors(token: string) {
        this.myToken = token;
        const user$ = this.store.select(getUser);
        const matterLabel$ = this.store.select(getMenuItemDisplayName('matter_search'));
        combineLatest(user$, matterLabel$, (user: User, matterLabel: string) => ({
            logedUser: user,
            matterLabel: matterLabel
        })).pipe(filter((info) => !!(info.logedUser && info.logedUser.general)),
            take(1))
            .subscribe((info) => {
                this.store.dispatch(new InitTeamEfficiency(token, { user: info.logedUser.general, matterLabel: info.matterLabel }));
            }).unsubscribe();

        console.log('BaseTeamEfficiencyManager-token', token);

        this.timeRecodedData$ = this.store.select(getTeamEfficiencyTimeRecordedDataByToken(token));
        this.monthList$ = this.store.select(getTeamEfficiencyMonthListByToken(token));
        this.timeRecordOption$ = this.store.select(getTeamEfficiencyTimeRecordOptionByToken(token));
        this.isTimeRecordDataLoading$ = this.store.select(getTimeRecordDataIsLoadedByToken(token));
        this.departmentList$ = this.store.select(getTimeRecordDepartmentListByToken(token));
        this.selectedMonth$ = this.store.select(getTeamEfficiencySelectedMonthByToken(token));
        this.selectedDepartment$ = this.store.select(getTeamEfficiencySelectedDepartmentByToken(token));
        this.selectedTeamMember$ = this.store.select(getSelectedTeamMemberByToken('TEAM_MEMBER_DATA_TEAM_EFFICIENCY'));
        this.teamMemberCount$ = this.store.select(getTeamMemberCountByToken('TEAM_MEMBER_DATA_TEAM_EFFICIENCY'));
        this.isPageLoading$ = this.store.select(getTimeRecordLoadingByToken(token));
        this.timeRecordChartTitle$ = this.store.select(getTimeRecordChartFullTitleByToken(token));
        this.adgedDebData$ = this.store.select(getTeamEffAdgedDebDataByToken(token));
        this.billeTimesData$ = this.store.select(getTeamEffBilledTimesByToken(token));
        this.cashReceivedData$ = this.store.select(getTeamEffCashReceived(token));
        this.matterData$ = this.store.select(getTeamEffMatterData(token));
        this.homeCurrency$ = this.store.select(getHomeCurrency());
        this.eventYearSummery$ = this.store.select(getEventYearSummeryByToken(token));
        this.userActivityLoading$ = this.store.select(getUserActivityLoadingByToken(token));
        this.activityTitle$ = this.store.select(getActivityTitleByToken(token));



    }

    updateTimeRecordOption(value: TimeRecordedOption) {
        this.store.dispatch(new ChangeTETimeRecordedOption(this.myToken, { option: value }));
    }

    updateDepartment(value: Department) {
        this.store.dispatch(new ChangeTEDepartment(this.myToken, { selectedDepartment: value }));
    }

    updateMonth(value: Month) {
        this.store.dispatch(new ChangeTEMonth(this.myToken, { selectedMonth: value }));
    }

    updateUser(value: TeamMember) {
        this.store.dispatch(new ChangeTEUser(this.myToken, { user: value }));
    }

    onUpdateMatterType(value: MatterTypeEnum) {
        this.store.dispatch(new ChangeTEMatterType(this.myToken, { type: value }));
    }
}
