import { OnInit, Output, EventEmitter } from '@angular/core';
import { Store } from '@ngrx/store';

import { ColumnDef } from '../../core/lib/grid-model';
import { createDefultColumnDef } from '../../core/lib/grid-helpers';
import {
    getMatterViewIsLoadingByToken, getMatterViewGridColoumnByToken,
    getMatterViewGridDataByToken, getMatterViewTotalItemByToken, getMatterViewPeginatorDefByToken
} from '../reducers';
import { InitMatterView, GridViewChange, ExitPopup } from '../actions/core';
import { ViewChangeKind } from '../models/enumeration';
import { GridData } from '../models/interface';
import { getGeneralMenueItems } from './../../layout-desktop/reducers/index';

export class BaseMatterViewByClientManager {

    @Output() closePopup = new EventEmitter<{
        matterRef: string, details: string, feeEarner: string, accountName: string,
        appCode: string;
        matterEBilling: string;
        matterIsLegalAid: boolean;
        branchId: number;
        appId: number;
        fileId: number;
    }>();


    public isLoading$: any;
    public gridColoumn$: any;
    public paginatorDef$: any;
    public gridData$: any;
    public totalItem$: any;
    public matterLabel: string;

    constructor(protected store: Store<any>) {
    }

    gridColumn: ColumnDef[] = [];
    paginatorDef = { currentPage: 0, itemPerPage: 50 };

    protected initSelectors(myToken: string, inputData) {
        this.store.select(getGeneralMenueItems).subscribe(menuItem => {
            this.matterLabel = menuItem.find(i => i.id === 'matter_search').label;
            const clientLabel = menuItem.find(i => i.id === 'client_search').label;
            if (myToken === 'E-Chit-Matter-Search') {
                this.gridColumn = [
                    createDefultColumnDef('MatterReferenceNo', {
                        label: `${this.matterLabel} Ref`, fxFlex: '125px', filterAnchor: 'end',
                        filterHidden: true, disableShort: true
                    }),
                    createDefultColumnDef('MatterDetails', {
                        label: `${this.matterLabel} Details`, fxFlex: '', filterAnchor: 'end',
                        filterHidden: true, disableShort: true
                    }),
                    createDefultColumnDef('Client', {
                        label: `${clientLabel} Name`, fxFlex: '200px', filterAnchor: 'end',
                        filterHidden: true, disableShort: true
                    }),
                    createDefultColumnDef('Closed', {
                        label: 'Closed', fxFlex: '125px', filterAnchor: 'end',
                        filterHidden: true, disableShort: true
                    }),
                ];
            } else {
                this.gridColumn = [
                    createDefultColumnDef('MatterReferenceNo', {
                        label: `${this.matterLabel} Ref`, fxFlex: '125px', filterAnchor: 'end',
                        filterHidden: false, disableShort: false
                    }),
                    createDefultColumnDef('MatterDetails', {
                        label: `${this.matterLabel} Ref Details`, fxFlex: '', filterAnchor: 'end',
                        filterHidden: false, disableShort: false
                    }),
                    createDefultColumnDef('Client', {
                        label: `${clientLabel} Name`, fxFlex: '200px', filterAnchor: 'end',
                        filterHiden: false, disableShort: false
                    }),
                    createDefultColumnDef('Closed', {
                        label: 'Closed', fxFlex: '125px', filterAnchor: 'end',
                        filterHidden: false, disableShort: false
                    }),
                ];
            }
            this.store.dispatch(new InitMatterView(myToken,
                {
                    clientRef: inputData.clientRef,
                    gridColoumn: this.gridColumn,
                    paginatorDef: this.paginatorDef
                }));
            this.isLoading$ = this.store.select(getMatterViewIsLoadingByToken(myToken));
            this.gridColoumn$ = this.store.select(getMatterViewGridColoumnByToken(myToken));
            this.paginatorDef$ = this.store.select(getMatterViewPeginatorDefByToken(myToken));
            this.gridData$ = this.store.select(getMatterViewGridDataByToken(myToken));
            this.totalItem$ = this.store.select(getMatterViewTotalItemByToken(myToken));
        });

    }

    onClose() {
        // this.closePopup.emit();
    }

    viewChange(token: string, { kind, value }: { kind: ViewChangeKind, value: any }) {
        // 'E-Chit-Matter-Search'
        this.store.dispatch(new GridViewChange(token, { kind, value }));
    }

    selectRow(token: string, dataRow: GridData): void {
        if (dataRow) {
            this.closePopup.emit({
                matterRef: dataRow.matterReferenceNo,
                details: dataRow.matterDetails,
                feeEarner: dataRow.feeEarner,
                accountName: dataRow.clientName,
                appCode: dataRow.app_Code,
                matterEBilling: dataRow.eBilling,
                matterIsLegalAid: dataRow.isLegalAid,
                branchId: dataRow.branchID,
                appId: dataRow.appID,
                fileId: dataRow.fileID
            });
        } else {
            this.closePopup.emit();
        }
        this.store.dispatch(new ExitPopup(token));
    }
}
