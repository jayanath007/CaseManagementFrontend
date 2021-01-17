import { Store } from '@ngrx/store';
import { createDefultColumnDef } from '../../core/lib/grid-helpers';
import { FieldType } from '../../odata';
import { Output, EventEmitter } from '@angular/core';
import { ClearData } from '../../workflow-menu-popup-core/actions/core';
import {
    InitGeneralPopup, GeneralSearchTextChange, ChangePage,
    ToggleSorting
} from '../actions/core';
import {
    getGeneralDataListByToken, getGeneralTotalItemCounntByToken,
    getGeneralSearchTextByToken, getIsLoadingByToken, getclientPaginatorDefByToken,
    getGeneralSitePathByToken, getGeneralColumnDefByToken, getIsFrontEndFilterByToken
} from '../reducers/index';
import { PaginatorDef, ColumnDef } from './../../core/lib/grid-model';
import { PDFBundleCaseFileIdentityWithAppIdRequestViewModel } from '../../bundling-desktop/containers/bundling-existing-manager.component.component';

export class BaseGeneralPopupManager {

    @Output() closePopup = new EventEmitter();

    myToken: string;
    generalPopupDataList$: any;
    isLoading$: any;
    totalItems$: any;
    searchText$: any;
    paginatorDef$: any;
    sitePath$: any;
    popupTitle$: any;
    columnDef$: any;
    isFrontEndFilter$: any;

    constructor(protected store: Store<any>) {
    }

    protected initSelectors(myToken: string, searchText: string, sitePath: string, popupTitle: string, isFrontEndFilter: boolean,
        colDef: ColumnDef[], request: PDFBundleCaseFileIdentityWithAppIdRequestViewModel) {

        this.myToken = myToken;
        this.popupTitle$ = popupTitle;
        this.init(myToken, {
            generalPopupColumn: colDef,
            generalPaginatorDef: { currentPage: 0, itemPerPage: 50 },
            searchText: searchText,
            sitePath: sitePath,
            isFrontEndFilter: isFrontEndFilter,
            request: request
        });

        this.isLoading$ = this.store.select(getIsLoadingByToken(myToken));
        this.generalPopupDataList$ = this.store.select(getGeneralDataListByToken(myToken));
        this.totalItems$ = this.store.select(getGeneralTotalItemCounntByToken(myToken));
        this.searchText$ = this.store.select(getGeneralSearchTextByToken(myToken));
        this.paginatorDef$ = this.store.select(getclientPaginatorDefByToken(myToken));
        this.sitePath$ = this.store.select(getGeneralSitePathByToken(myToken));
        this.columnDef$ = this.store.select(getGeneralColumnDefByToken(myToken));
        this.isFrontEndFilter$ = this.store.select(getIsFrontEndFilterByToken(myToken));

    }

    selectedRow(row) {
        this.closePopup.emit(row);
    }

    init(token, payload) {
        this.store.dispatch(new InitGeneralPopup(token, payload));
    }

    onUpdateSearchText(value) {
        this.store.dispatch(new GeneralSearchTextChange(this.myToken, { searchText: value }));
    }

    onChangePage(event: { pageDef: PaginatorDef, searchText: string }) {
        this.store.dispatch(new ChangePage(this.myToken, { pageDef: event.pageDef }));
    }

    onToggleSorting(colDef: ColumnDef) {
        this.store.dispatch(new ToggleSorting(this.myToken, { colDef: colDef }));
    }


}
