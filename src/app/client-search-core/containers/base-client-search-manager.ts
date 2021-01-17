import { PaginatorDef } from './../../core/lib/grid-model';
import { take, tap } from 'rxjs/operators';
import { combineLatest, Observable } from 'rxjs';
import { Output, EventEmitter } from '@angular/core';
import { Store } from '@ngrx/store';
import { createDefultColumnDef } from '../../core/lib/grid-helpers';
import { FieldType } from '../../odata';
// import { MatterInfo } from '../../chaser-core/models/interfaces';
import { OpenMailPopup, MainMenuService, getGeneralAllMenueItems } from '../../layout-desktop';
import { getUser, getDPSSettingValueByKey, User } from '../../auth';
import { AuthInfoStateService } from '../../auth';
import {
    getClientSearchClientColumnDefByToken, getClientSearchTextByToken, InitClientSearch,
    ClientSearchTextChange,
    getClientSearchGridDataByToken, ExpandMatterRow,
    ExpandClientRow, getClientSearchGridDataLoadingStateByToken, getClientSearchMatterColumnDefByToken,
    ClientSearchSubmit, getClientSearchTotalClientsByToken, getClientSearchClientPaginatorDefByToken,
    getClientPopupInutDataByToken, ChangeMatterPage
} from '..';
import { ClientGridRowRapper, MatterGridRowRapper, MatterExpandData, ClientSearchPopupData } from '../models/interfaces';
import { DPSFilesToMailAttachmentRequestViewModel, MainMenuItem } from '../../layout-desktop/models/interfaces';
import { SystemJsPopupLoaderService } from '../../shell-desktop';
import { GridRowItemWrapper } from '../../core/lib/matter';
import { ClientSearchKind } from '../models/enums';
import { GridRefresh, ExitClientSearchPopup } from '../actions/core';
import { getClientSearchShowSearchHintStateByToken } from '../reducers';
import { OpenTimeValidation } from './../../core/lib/timeRecord';
import { EChitPopupInput } from './../../e-chit-core/models/interfaces';
import { ClientPopupType, ClientMenu } from './../models/enums';
import { OpenTimeRecordPopupRequest } from './../../shared-data/actions/time-record';
import { getDefaultMessageFormat } from '../../utils/organizer';
import { SettingKey } from '../../core/lib/app-settings';

export class BaseClientSearchManager {

    public homeCurrancy$: any;
    public clientColumnDef$: any;
    public matterColumnDef$: any;
    public clientSearchGridData$: any;
    public clientPaginatorDef$: any;
    public searchText$: any;
    public totalItems$: any;
    public gridLoading$: any;
    public showSearchHint$: any;
    public user$: Observable<User>;
    public popupInutData$: any;
    public menuItem$: any;

    columnsForClients;
    columnsForMatters;
    columnsForClientsSearch;
    columnsForOpportunityClientsSearch;

    clientLabel: string;
    matterLabel: string;
    isPlotUser: boolean;

    myToken: string;

    @Output() closePopup = new EventEmitter();

    constructor(protected store: Store<any>, private pageService: MainMenuService,
        public popupService: SystemJsPopupLoaderService, public authService: AuthInfoStateService) {
    }


    protected initSelectors(token: string, isPopup: boolean, clientSearchData: ClientSearchPopupData) {
        this.menuItem$ = this.store.select(getGeneralAllMenueItems);
        const isPlotUser$ = this.store.select(getDPSSettingValueByKey(SettingKey.IsPlotUser));
        this.myToken = token;
        combineLatest(isPlotUser$, this.menuItem$, (isPlotUser: boolean, menuItem: MainMenuItem<any>[]) => ({
            isPlotUser: isPlotUser,
            menuItem: menuItem
        })).pipe(take(1)).subscribe(info => {

            this.clientLabel = info.menuItem.find(i => i.id === 'client_search').label;
            this.matterLabel = info.menuItem.find(i => i.id === 'matter_search').label;
            this.isPlotUser = info.isPlotUser;
            if (info.isPlotUser) {
                this.columnsForClients = {
                    columnDef:
                        [
                            createDefultColumnDef('Toggle', {
                                label: '', fxFlex: '32px', filterAnchor: 'start', filterHidden: true, disableShort: true
                            }),
                            createDefultColumnDef('ClientBranch', { label: 'Branch', fxFlex: '95px', filterAnchor: 'start' },
                                FieldType.Text),
                            createDefultColumnDef('ClientRef', { label: `Job Number`, fxFlex: '120px', filterAnchor: 'start' }),
                            createDefultColumnDef('ClientName', { label: `Development`, fxFlex: '10', filterAnchor: 'start' },
                                FieldType.Text),
                            createDefultColumnDef('ClientCompanyName', { label: 'Legal Entity+', fxFlex: '10', filterAnchor: 'start' }),
                            createDefultColumnDef('MatterCount',
                                { label: 'Live Plots', fxFlex: '80px', filterAnchor: 'end', filterHidden: true }),
                            createDefultColumnDef('FeeEarner', { label: 'FE', fxFlex: '80px', filterAnchor: 'start' }),
                            createDefultColumnDef('FullAddress', { label: 'Address', fxFlex: '', filterAnchor: 'end' }),


                        ],
                    paginatorDef: { currentPage: 0, itemPerPage: 50 }
                };

                this.columnsForMatters = {
                    columnDef:
                        [
                            createDefultColumnDef('Toggle', { label: '', fxFlex: '2', filterAnchor: 'end', filterHidden: true }),
                            createDefultColumnDef('MatterReferenceNo', {
                                label: 'Plot Ref', fxFlex: '108px', filterAnchor: 'start',
                                filterHidden: true
                            }),
                            createDefultColumnDef('MatterDetails',
                                { label: 'Details', fxFlex: '', filterAnchor: 'start', filterHidden: true },
                                FieldType.Text),
                            createDefultColumnDef('FeeEarner', { label: 'FE', fxFlex: '150px', filterAnchor: 'end', filterHidden: true }),

                        ],
                    paginatorDef: { currentPage: 0, itemPerPage: 50 }
                };
            } else {
                this.columnsForClients = {
                    columnDef:
                        [
                            createDefultColumnDef('Toggle', {
                                label: '', fxFlex: '32px', filterAnchor: 'start', filterHidden: true
                                , disableShort: true
                            }),
                            createDefultColumnDef('ClientBranch', { label: 'Branch', fxFlex: '95px', filterAnchor: 'start' },
                                FieldType.Text),
                            createDefultColumnDef('ClientRef',
                                { label: `${this.clientLabel} Ref`, fxFlex: '120px', filterAnchor: 'start' }),
                            createDefultColumnDef('ClientName', { label: `${this.clientLabel} Name`, fxFlex: '10', filterAnchor: 'start' },
                                FieldType.Text),
                            createDefultColumnDef('ClientCompanyName', { label: 'Company', fxFlex: '10', filterAnchor: 'start' }),
                            createDefultColumnDef('FirstName', { label: 'Forename', fxFlex: '10', filterAnchor: 'start' }),
                            createDefultColumnDef('LastName', { label: 'Surname', fxFlex: '10', filterAnchor: 'start' }),
                            createDefultColumnDef('DateOfBirth', { label: 'DOB', fxFlex: '90px', filterAnchor: 'start' }, FieldType.Date),
                            createDefultColumnDef('FeeEarner', { label: 'FE', fxFlex: '80px', filterAnchor: 'start' }),
                            createDefultColumnDef('FullAddress', { label: 'Address', fxFlex: '15', filterAnchor: 'start' }),
                            createDefultColumnDef('PostCode', { label: 'Postcode', fxFlex: '100px', filterAnchor: 'start' }),
                            createDefultColumnDef('MatterCount',
                                { label: `Live ${this.matterLabel}`, fxFlex: '80px', filterAnchor: 'end', filterHidden: true }),
                            createDefultColumnDef('Telephone', { label: 'Tel. No', fxFlex: '8', filterAnchor: 'end' }),
                            createDefultColumnDef('Email', { label: 'Email', fxFlex: '13', filterAnchor: 'end' })

                        ],
                    paginatorDef: { currentPage: 0, itemPerPage: 50 }
                };

                this.columnsForMatters = {
                    columnDef:
                        [
                            createDefultColumnDef('Toggle',
                                { label: '', fxFlex: '2', filterAnchor: 'end', filterHidden: true }),
                            createDefultColumnDef('BranchName',
                                { label: 'Branch', fxFlex: '12', filterAnchor: 'start', filterHidden: true },
                                FieldType.Text),
                            createDefultColumnDef('MatterReferenceNo', {
                                label: `${this.matterLabel} Ref`, fxFlex: '108px', filterAnchor: 'start',
                                filterHidden: true
                            }),
                            createDefultColumnDef('MatterDetails',
                                { label: `${this.matterLabel} Details`, fxFlex: '', filterAnchor: 'start', filterHidden: true },
                                FieldType.Text),
                            createDefultColumnDef('StartDateString',
                                { label: 'Start Date', fxFlex: '8', filterAnchor: 'start', filterHidden: true }),
                            createDefultColumnDef('FeeEarner', { label: 'FE', fxFlex: '50px', filterAnchor: 'end', filterHidden: true }),
                            createDefultColumnDef('App_Code', { label: 'App Code', fxFlex: '12', filterAnchor: 'end', filterHidden: true })

                        ],
                    paginatorDef: { currentPage: 0, itemPerPage: 50 }
                };
            }



            this.columnsForClientsSearch = {
                columnDef:
                    [
                        createDefultColumnDef('SAL_Account_Ref',
                            { label: `${this.clientLabel} Ref`, fxFlex: '130px', filterAnchor: 'start' }),
                        createDefultColumnDef('SAL_Account_Name',
                            { label: `${this.clientLabel} Name`, fxFlex: '12', filterAnchor: 'start' },
                            FieldType.Text),
                        createDefultColumnDef('SAL_Account_Name', { label: 'Tel. No', fxFlex: '8', filterAnchor: 'end' }),
                        createDefultColumnDef('SAL_Inv_PostCode', { label: 'Postcode', fxFlex: '100px', filterAnchor: 'start' }),
                        createDefultColumnDef('SAL_Inv_Contact', { label: 'Contact', fxFlex: '10', filterAnchor: 'start' },
                            FieldType.Text),
                        createDefultColumnDef('SAL_Inv_Email', { label: 'Email', fxFlex: '13', filterAnchor: 'end' }),
                        createDefultColumnDef('SAL_Stat_Address1', { label: 'Address', fxFlex: '', filterAnchor: 'end' })

                    ],
                paginatorDef: { currentPage: 0, itemPerPage: 50 }
            };
            this.columnsForOpportunityClientsSearch = {
                columnDef:
                    [
                        createDefultColumnDef('SalesAccountRef', { label: 'Client Ref', fxFlex: '107px', filterAnchor: 'start' }),
                        createDefultColumnDef('Type', { label: 'Type', fxFlex: '10', filterAnchor: 'start' },
                            FieldType.Text),
                        createDefultColumnDef('LastName', { label: 'Last Name', fxFlex: '8', filterAnchor: 'end' }),
                        createDefultColumnDef('FirstName', { label: 'First Name', fxFlex: '100px', filterAnchor: 'start' }),
                        createDefultColumnDef('AccountName', { label: 'Name', fxFlex: '10', filterAnchor: 'start' },
                            FieldType.Text),
                        createDefultColumnDef('CompanyName', { label: 'Company', fxFlex: '10', filterAnchor: 'start' },
                            FieldType.Text),
                        createDefultColumnDef('Email1', { label: 'Email', fxFlex: '13', filterAnchor: 'end' }),
                        createDefultColumnDef('PostCode', { label: 'Address', fxFlex: '', filterAnchor: 'end' })

                    ],
                paginatorDef: { currentPage: 0, itemPerPage: 50 }
            };

            this.init(token, {
                clientColumnDef: this.columnsForClients.columnDef, clientPaginatorDef: this.columnsForClients.paginatorDef
                , isPopup: isPopup, matterColumnDef: this.columnsForMatters.columnDef,
                clientSearchpopupColumn: (clientSearchData && clientSearchData.popupType &&
                    clientSearchData.popupType === ClientPopupType.OpportunityClientSearch) ?
                    this.columnsForOpportunityClientsSearch.columnDef :
                    this.columnsForClientsSearch.columnDef, clientSearchData: clientSearchData
            });
            this.clientSearchGridData$ = this.store.select(getClientSearchGridDataByToken(token));
            this.clientColumnDef$ = this.store.select(getClientSearchClientColumnDefByToken(token));
            this.matterColumnDef$ = this.store.select(getClientSearchMatterColumnDefByToken(token));
            this.searchText$ = this.store.select(getClientSearchTextByToken(token));
            this.user$ = this.authService.getUser();
            this.totalItems$ = this.store.select(getClientSearchTotalClientsByToken(token));
            this.gridLoading$ = this.store.select(getClientSearchGridDataLoadingStateByToken(token));
            this.showSearchHint$ = this.store.select(getClientSearchShowSearchHintStateByToken(token));
            this.clientPaginatorDef$ = this.store.select(getClientSearchClientPaginatorDefByToken(token));
            this.popupInutData$ = this.store.select(getClientPopupInutDataByToken(token));
        });

        this.myToken = token;


    }

    init(token, payload) {
        this.store.dispatch(new InitClientSearch(token, payload));
    }

    toggleClientExpand(value: ClientGridRowRapper) {
        this.store.dispatch(new ExpandClientRow(this.myToken, { client: value }));
    }

    toggleMatterExpand(value: MatterExpandData) {
        this.store.dispatch(new ExpandMatterRow(this.myToken, { row: value }));
    }

    onClientSearchTextChange(searchText) {
        this.store.dispatch(new ClientSearchTextChange(this.myToken, { searchText: searchText }));
    }

    onClientSearchTextClick(searchText) {
        // this.store.dispatch(new ClientSearchSubmit(this.myToken, { kind: ClientSearchKind.SearchText, value: searchText }));
        this.store.dispatch(new ClientSearchSubmit(this.myToken, searchText));
    }

    onClientSearchTextClear(searchText) {
        this.store.dispatch(new ClientSearchSubmit(this.myToken, { kind: ClientSearchKind.SearchTextClear, value: searchText }));
    }

    clickNewMail(item) {

        this.newMailOpen(this.myToken, item);
    }

    // closeAndDiscastMatterPopup(token) {
    //     this.closePopup.emit();
    //     this.store.dispatch(new ExitMatterSearchPopup(token));
    // }

    newMailOpen(token: string, value: MatterGridRowRapper) {

        const subscription = this.store.select(getUser).pipe(
            take(1))
            .subscribe((user) => {
                const messageFormat = getDefaultMessageFormat(user.messageFormat);
                const request: DPSFilesToMailAttachmentRequestViewModel = {
                    dpsFileCredentials: [],
                    htmlBody: (user && user.isSignaturAutoAdd) ?
                        `${messageFormat} <div class="signature">` + user.signature + '</div>' : messageFormat,
                    matterRef: value.data.matterReferenceNo,
                    appID: value.data.appID,
                    branchID: value.data.branchID,
                    fileID: value.data.fileID,
                };

                this.store.dispatch(new OpenMailPopup(token, { draftIdRequest: request }));
            });

    }

    public clickOpenCase(selectedMatter: MatterGridRowRapper) {
        //  if (selectedMatter && selectedMatter.data && selectedMatter.data.app_Code) {
        const matter: GridRowItemWrapper = {
            data: {
                branchID: selectedMatter.data.branchID,
                app_Code: selectedMatter.data.app_Code, fileID: selectedMatter.data.fileID,
                matterReferenceNo: selectedMatter.data.matterReferenceNo,
                appID: selectedMatter.data.appID ? selectedMatter.data.appID : null,
                closed: null,
                lastUsed: null,
                feeEarner: selectedMatter.data.feeEarner,
                reviewDate: null,
                clientName: null,
                reviewNote: null,
                company_Name: null,
                matterDetails: selectedMatter.data.matterDetails,
                matterCounter: selectedMatter.data.matterCounter,
                ufnValue: selectedMatter.data.ufnValue,
                eBilling: selectedMatter.data.eBilling,
                isPlotMatter: selectedMatter.data.isPlotMatter,
                isPlotMasterMatter: selectedMatter.data.isPlotMasterMatter,
                isProspectMatter: selectedMatter.data.isProspectMatter,
                isLegalAid: selectedMatter.data.isLegalAid
            },
            selected: selectedMatter.selected,
            expanded: selectedMatter.expanded,
            financeDetails: null
        };
        this.pageService.gotoOpenCase(matter);
        // }
    }

    clickTimeRecord(selectedMatter: MatterGridRowRapper) {
        this.openTimeRecording(selectedMatter);
    }


    onOpenEchitPopup(data: { matterData: MatterGridRowRapper, clientData: ClientGridRowRapper }) {
        const matterDetailsName = ((data.clientData.data.clientName || '')
            + (data.matterData.data.matterDetails || '')).replace('&', '&&');
        const eChitPopupInput: EChitPopupInput = {
            matterId: data.matterData.data.matterReferenceNo,
            matterDetailsName: matterDetailsName,
            appCode: data.matterData.data.app_Code,
            matterEBilling: data.matterData.data.eBilling,
            matterIsLegalAid: data.matterData.data.isLegalAid,
            branchId: data.matterData.data.branchID,
            appId: data.matterData.data.appID,
            fileId: data.matterData.data.fileID
        };
        this.popupService.openEChitPopup(`echit-${data.matterData.data.matterCounter}`, eChitPopupInput);
    }
    onGridRefresh(token) {
        this.store.dispatch(new GridRefresh(token));
    }

    closeAndDiscastClientPopup(token) {
        this.closePopup.emit();
        this.store.dispatch(new ExitClientSearchPopup(token));
    }
    onPopupRowSelect(token: string) {
        // this.closePopup.emit(event);
        this.store.dispatch(new ExitClientSearchPopup(token));
    }

    openTimeRecording(matterData: MatterGridRowRapper) {
        let data: OpenTimeValidation;
        if (matterData) {
            data = {
                appCode: matterData.data.app_Code,
                appId: matterData.data.appID,
                branchId: matterData.data.branchID,
                fileId: matterData.data.fileID,
                eBilling: matterData.data.eBilling,
                matterRef: matterData.data.matterReferenceNo,
                timeFeeEarner: matterData.data.feeEarner,
                matterDetails: matterData.data.matterDetails,
                clientName: '',
                ufnValue: matterData.data.ufnValue,
                canMinimize: false,
                isProspectMatter: matterData.data.isProspectMatter,
                isLegalAid: matterData.data.isLegalAid
            };
        }
        this.store.dispatch(new OpenTimeRecordPopupRequest(this.myToken, data));
    }
    clickMenuClientMenuItem(type: ClientMenu) {
        switch (type) {
            case ClientMenu.AddClient: {
                this.popupService.openClientCreationPopup('clientCreationMainPopup', null).subscribe((data: any) => { });
                break;
            }
            case ClientMenu.eChit: {
                this.popupService.openEChitPopup('openEChitDesktopModule', {});
                break;
            }
            case ClientMenu.LedgerCard: {
                this.pageService.navigateById('ledger_card');
                break;
            }
        }
    }

    matterGridPageChange(token: string, data: { clientRef: string, pageDef: PaginatorDef }) {
        this.store.dispatch(new ChangeMatterPage(this.myToken, data.clientRef, data.pageDef));
    }

}
