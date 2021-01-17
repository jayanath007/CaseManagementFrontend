import { getPostingPeriod } from './../../setting-core/reducers/index';
import { MainMenuItem } from './../../layout-desktop/models/interfaces';
import { LoadPeople } from './../../contacts-and-people-core/actions/people';
import { take, filter } from 'rxjs/operators';
import { combineLatest } from 'rxjs';
import { ChangePanelMode } from '../../team-member-core/actions/team-member';
import {
    getMatterTotalBillsOutstandingByToken, getMatterTotalMatterCountByToken, getMatterActiveViewByToken,
    getMatterSelectedDepartmentByToken
} from '../reducers';
import { Store } from '@ngrx/store';
import {
    getMatterColumnDefByToken, getMatterGridDataByToken, getMatterDepartmentByToken,
    getMatterPaginatorDefByToken, getMatterSearchTextByToken,
    getMatterInactiveFeeEranersFalgByToken,
    getMatterClosedMatterFalgByToken,
    getMatterCurrentItemTotalByToken,
    getMaterDepartmentLoadingStateByToken,
    getMaterGridLoadingStateByToken,
    getIsUserExpandRowByToken,
    getIsMLSEnableMattersByToken
} from '../reducers';
import { GridRowItemWrapper } from '../models/interfaces';
import {
    LoadRowSelectData, LoadRowExpanData, MatterViewChange, InitMatterView, RefreshMatter, ExitMatterSearchPopup,
    InitMatterForMatterCreatePopup, AddUpdateReviewData, GetReviewNotes, GoToOpenCase, GetMatterInfoAndExitMatterSearchPopup

} from '../actions/matters';
import { ViewChangeKind } from '../models/enums';
import { ColumnDef } from '../../core/lib/grid-model';
import { createDefultColumnDef } from '../../core/lib/grid-helpers';
import { FieldType } from '../../odata';
import { getHomeCurrency } from '../../setting-core';
import { OpenMailPopup } from '../../layout-desktop';
import { DPSFilesToMailAttachmentRequestViewModel } from '../../layout-desktop/models/interfaces';
import { getSelectedTeamMemberByToken, getTeamMemberCountByToken, getMemListPanelModeByToken } from '../../team-member-core/reducers';
import { ViewStateObserverService } from '../../shell-desktop';
import { OpenTimeValidation } from './../../core/lib/timeRecord';
import { OpenTimeRecordPopupRequest } from './../../shared-data/actions/time-record';
import { SettingKey } from '../../core/lib/app-settings';
import { getDPSSettingValueByKey, getPoltVarValues } from '../../auth';
import { LocalStorageKey } from '../../core';
import { CaseFileIdentityWithAppIdViewModel } from '../../core/lib/files';
import { getRefferalNotePopupClose, getRefferalNoteLoading, getCurrentReviewNote, getCompletedMatterFalgByToken } from './../reducers';
import { EventEmitter } from '@angular/core';

export class BaseMatterManager {

    public homeCurrancy$: any;
    public postingPeriod$: any;
    public departmentData$: any;
    public columnDef$: any;
    public matterGridData$: any;
    public paginatorDef$: any;
    public searchText$: any;
    public isInactiveFeeEarner$: any;
    public isClosedMatters$: any;
    public isCompletedMatters$: any;
    public totalItems$: any;
    public totalBillsOutstanding$: any;
    public totalMatterCount$: any;
    public activeView$: any;
    public selectedDepartment$: any;
    public departmentLoading$: any;
    public gridLoading$: any;
    public selectedTeamMember$: any;
    public teamMemberCount$: any;
    public isUserExpandRow$: any;
    public initView$: any;
    public memListPanelMode$: any;
    public isMLSEnableMatter$: any;
    public refferalNotePopupClose$: any;
    public refferalNoteLoading$: any;
    public isPlotUser$: any;
    public plotVarValues$: any;
    public currentReviewNote$: any;
    teamMemberToken = 'TEAM_MEMBER_DATA_MATTER_SEARCH';

    isMatterCreate = false;
    basePopupType = null;
    clientLabel = 'Client';
    allColumnsForMatters;
    limitedColumnsForMatters;
    menuItems: MainMenuItem<any>[] = JSON.parse(sessionStorage.getItem(LocalStorageKey.MenuItems));

    constructor(protected store: Store<any>, protected shellStateManage: ViewStateObserverService, protected isGoogle: string) {
    }


    protected initSelectors(token: string, isPopup: boolean, inputData: any) {
        this.clientLabel = !this.menuItems ? '' : this.menuItems.find(i => i.id === 'client_search').label;
        this.isPlotUser$ = this.store.select(getDPSSettingValueByKey(SettingKey.IsPlotUser));
        this.plotVarValues$ = this.store.select(getPoltVarValues);

        combineLatest(this.isPlotUser$, this.plotVarValues$, (isPlotUser: boolean, varValues: string[]) => ({
            isPlotUser: isPlotUser,
            varValues: varValues
        })).subscribe(info => {

            if (info.isPlotUser) { // (info.isPlotUser)
                this.allColumnsForMatters = {
                    columnDef:
                        [
                            createDefultColumnDef('toggle', {
                                label: '', fxFlex: '32px', filterAnchor: 'start',
                                filterHidden: true, disableShort: true
                            }),
                            createDefultColumnDef('MatterReferenceNo', { label: 'Plot Number', fxFlex: '125px', filterAnchor: 'start' },
                                FieldType.Text),
                            createDefultColumnDef('ClientName', { label: 'Development', fxFlex: '12', filterAnchor: 'start' }),
                            createDefultColumnDef('MatterDetails', { label: 'Plot Address', fxFlex: '', filterAnchor: 'start' }),
                        ],
                    paginatorDef: { currentPage: 0, itemPerPage: 50 }
                };

                this.limitedColumnsForMatters = {
                    columnDef:
                        [
                            createDefultColumnDef('toggle', {
                                label: '', fxFlex: '32px', filterAnchor: 'start',
                                filterHidden: true, disableShort: true
                            }),
                            createDefultColumnDef('MatterReferenceNo', { label: 'Plot Number', fxFlex: '125px', filterAnchor: 'start' },
                                FieldType.Text),
                            createDefultColumnDef('ClientName', { label: 'Development', fxFlex: '12', filterAnchor: 'start' }),
                            createDefultColumnDef('MatterDetails', { label: 'Plot Address', fxFlex: '', filterAnchor: 'start' }),
                        ],
                    paginatorDef: { currentPage: 0, itemPerPage: 50 }
                };

                if (info.varValues && info.varValues.length > 0) {
                    const tempCol: ColumnDef[] = [];
                    info.varValues.forEach(i => {
                        tempCol.push(
                            createDefultColumnDef(i, {
                                label: i, fxFlex: '12', filterAnchor: 'end',
                                filterHidden: true, disableShort: true // request by Prabashini
                            })
                        );
                    });

                    this.allColumnsForMatters = {
                        ...this.allColumnsForMatters,
                        columnDef: this.allColumnsForMatters.columnDef.concat(tempCol)
                    };
                    this.limitedColumnsForMatters = {
                        ...this.limitedColumnsForMatters,
                        columnDef: this.limitedColumnsForMatters.columnDef.concat(tempCol)
                    };
                }


            } else {
                this.allColumnsForMatters = {
                    columnDef:
                        [createDefultColumnDef('toggle', {
                            label: '', fxFlex: '32px', filterAnchor: 'start',
                            filterHidden: true, disableShort: true
                        }),
                        createDefultColumnDef('MatterReferenceNo', { label: 'Ref', fxFlex: '125px', filterAnchor: 'start' },
                            FieldType.Text),
                        createDefultColumnDef('app_Code', { label: 'App', fxFlex: '80px', filterAnchor: 'start' },
                            FieldType.Text),
                        createDefultColumnDef('ClientName', { label: this.clientLabel, fxFlex: '12', filterAnchor: 'start' }),
                        createDefultColumnDef('LastUsed', { label: 'Last Used', fxFlex: '115px', filterAnchor: 'start' },
                            FieldType.Date),
                        createDefultColumnDef('ReviewDate', {
                            label: 'Review Date', fxFlex: '115px', filterAnchor: 'start',
                            filterHidden: true, disableShort: true
                        }, FieldType.Date),
                        createDefultColumnDef('MatterDetails', { label: 'Details', fxFlex: '', filterAnchor: 'end' }),
                        createDefultColumnDef('ReviewNote', { label: 'Review Note', fxFlex: '12', filterAnchor: 'end' })

                        ],
                    paginatorDef: { currentPage: 0, itemPerPage: 50 }
                };

                this.limitedColumnsForMatters = {
                    columnDef:
                        [
                            createDefultColumnDef('toggle', {
                                label: '', fxFlex: '32px', filterAnchor: 'start', filterHidden: true
                                , disableShort: true
                            }),
                            createDefultColumnDef('MatterReferenceNo', { label: 'Ref', fxFlex: '125px', filterAnchor: 'start' }),
                            createDefultColumnDef('app_Code', { label: 'App', fxFlex: '80px', filterAnchor: 'start' }),
                            createDefultColumnDef('ClientName', { label: this.clientLabel, fxFlex: '20', filterAnchor: 'start' }),
                            createDefultColumnDef('MatterDetails', { label: 'Details', fxFlex: '', filterAnchor: 'end' })

                        ],
                    paginatorDef: { currentPage: 0, itemPerPage: 50 }
                };
            }


            this.init(token, {
                columnDef: (inputData && inputData.isMatterCreate) ?
                    this.allColumnsForMatters.columnDef : this.limitedColumnsForMatters.columnDef,
                paginatorDef: (inputData && inputData.isMatterCreate) ?
                    this.allColumnsForMatters.paginatorDef : this.limitedColumnsForMatters.paginatorDef,
                isPopup: isPopup,
                searchText: (inputData) ? (inputData.searchText) ? inputData.searchText : null : null,
                isMatterCreate: (inputData) ? (inputData.isMatterCreate) ? inputData.isMatterCreate : null : null,
                inputData: {
                    BranchId: (inputData) ? (inputData.BranchId) ? inputData.BranchId : null : null,
                    ClientName: (inputData) ? (inputData.ClientName) ? inputData.ClientName : null : null,
                    ClientReference: (inputData) ? (inputData.ClientReference) ? inputData.ClientReference : null : null,
                    MatterDetails: (inputData) ? (inputData.MatterDetails) ? inputData.MatterDetails : null : null,
                    MatterReference: (inputData) ? (inputData.MatterReference) ? inputData.MatterReference : null : null,
                    searchText: (inputData) ? (inputData.searchText) ? inputData.searchText : null : null,
                    basePopupType: (inputData) ? (inputData.basePopupType) ? inputData.basePopupType : null : null,
                    emailList: (inputData) ? (inputData.emailList) ? inputData.emailList : null : null,
                },
                allColumnsForMatters: this.allColumnsForMatters.columnDef
            });
            this.homeCurrancy$ = this.store.select(getHomeCurrency());
            this.postingPeriod$ = this.store.select(getPostingPeriod());
            this.departmentData$ = this.store.select(getMatterDepartmentByToken(token));
            this.matterGridData$ = this.store.select(getMatterGridDataByToken(token));
            this.paginatorDef$ = this.store.select(getMatterPaginatorDefByToken(token));
            this.columnDef$ = this.store.select(getMatterColumnDefByToken(token));
            this.searchText$ = this.store.select(getMatterSearchTextByToken(token));
            this.isInactiveFeeEarner$ = this.store.select(getMatterInactiveFeeEranersFalgByToken(token));
            this.isClosedMatters$ = this.store.select(getMatterClosedMatterFalgByToken(token));
            this.isCompletedMatters$ = this.store.select(getCompletedMatterFalgByToken(token));
            this.totalItems$ = this.store.select(getMatterCurrentItemTotalByToken(token));
            this.totalBillsOutstanding$ = this.store.select(getMatterTotalBillsOutstandingByToken(token));
            this.totalMatterCount$ = this.store.select(getMatterTotalMatterCountByToken(token));
            this.activeView$ = this.store.select(getMatterActiveViewByToken(token));
            this.selectedDepartment$ = this.store.select(getMatterSelectedDepartmentByToken(token));
            this.departmentLoading$ = this.store.select(getMaterDepartmentLoadingStateByToken(token));
            this.gridLoading$ = this.store.select(getMaterGridLoadingStateByToken(token));
            this.selectedTeamMember$ = this.store.select(getSelectedTeamMemberByToken(this.teamMemberToken));
            this.teamMemberCount$ = this.store.select(getTeamMemberCountByToken(this.teamMemberToken));
            this.memListPanelMode$ = this.store.select(getMemListPanelModeByToken(this.teamMemberToken));
            this.isUserExpandRow$ = this.store.select(getIsUserExpandRowByToken(token));
            this.initView$ = this.shellStateManage.getMainVisibility().pipe(filter((init) => init), take(1));
            this.isMLSEnableMatter$ = this.store.select(getIsMLSEnableMattersByToken(token));
        });



    }

    initAddReferralNotePopup(token: string, info: CaseFileIdentityWithAppIdViewModel) {
        this.refferalNotePopupClose$ = this.store.select(getRefferalNotePopupClose(token));
        this.refferalNoteLoading$ = this.store.select(getRefferalNoteLoading(token));
        this.currentReviewNote$ = this.store.select(getCurrentReviewNote(token));

        this.store.dispatch(new GetReviewNotes(token, info));
    }

    init(token, payload) {
        this.isMatterCreate = payload && payload.isMatterCreate;
        if (payload && payload.inputData && payload.inputData.basePopupType) {
            this.basePopupType = payload.inputData.basePopupType;
        }
        if (this.isMatterCreate) {
            this.store.dispatch(new InitMatterForMatterCreatePopup(token, payload));
        } else {
            this.store.dispatch(new InitMatterView(token, payload));
        }
        if (this.isGoogle) {
            this.store.dispatch(new LoadPeople());
        }

    }

    selectRow(token: string, value: GridRowItemWrapper) {
        this.store.dispatch(new LoadRowSelectData(token, { selectedRowItem: value }));
    }

    toggleExpandRow(token: string, value: GridRowItemWrapper) {
        this.store.dispatch(new LoadRowExpanData(token, { selectedRowItem: value }));
    }
    onMatterRefresh(token) {
        this.store.dispatch(new RefreshMatter(token));
    }
    viewChange(token: string, kind: ViewChangeKind, value: any, columnSet: ColumnDef[], allColumnDef?: ColumnDef[]) {
        // if (this.isMatterCreate) {
        //     this.store.dispatch(new LoadMatterCreateDataWithCurrentState(token, { inputData: action.payload.inputData }));
        // } else {
        this.store.dispatch(new MatterViewChange(token,
            { kind, value, columnSet, isMatterCreate: this.isMatterCreate, allColumnDef: allColumnDef }));
        // }

    }
    closeAndDiscastMatterPopup(token) {
        // this.closePopup.emit();
        this.store.dispatch(new ExitMatterSearchPopup(token));
    }
    changeTeamMemberPanelMode(viewMode) {
        this.store.dispatch(new ChangePanelMode(this.teamMemberToken, { mode: viewMode }));
    }

    newMailOpen(token: string, value: GridRowItemWrapper, request: DPSFilesToMailAttachmentRequestViewModel) {
        // const subscription = this.store.select(getUser)
        //     .take(1)
        //     .subscribe((user) => {
        //         this.user = user;
        //     });

        // const request: DPSFilesToMailAttachmentRequestViewModel = {
        //     dpsFileCredentials: [],
        //     htmlBody: (this.user && this.user.isSignaturAutoAdd) ?
        //         '<p></p> <div class="signature">' + this.user.signature + '</div>' : '<P></P>',
        //     matterRef: value.data.matterReferenceNo,
        //     appID: Number.parseInt(value.data.appID),
        //     branchID: Number.parseInt(value.data.branchID),
        //     fileID: Number.parseInt(value.data.fileID)
        // };

        this.store.dispatch(new OpenMailPopup(token, { draftIdRequest: request }));


    }

    onPopupRowSelect(token: string, matter?: GridRowItemWrapper, closePopup?: EventEmitter<any>) {
        if (matter && closePopup) {
            this.store.dispatch(new GetMatterInfoAndExitMatterSearchPopup(token, matter, closePopup));
        } else {
            this.store.dispatch(new ExitMatterSearchPopup(token));
        }
    }

    requestToOpenTimeRecord(token: string, data: OpenTimeValidation) {
        this.store.dispatch(new OpenTimeRecordPopupRequest(token, data));
    }


    addReferralNote(data, event) {

        this.store.dispatch(new AddUpdateReviewData(data.myToken, { data: data, event: event }));
    }

    goToOpenCase(matter: GridRowItemWrapper) {
        this.store.dispatch(new GoToOpenCase(matter));
    }
}
