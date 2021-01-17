
import {
    getGlobalSearchColumnDefByToken, getFilterViewModelByToken,
    getLoadingByToken, getFeeEarnerListByToken, getAppCodeListByToken, getGridDataByToken,
    getDocumentViewOpenedByToken, getTotalItemByToken, getFilterExpandedToken, getPaginatorDefToken
} from './../reducers/index';
import { Store } from '@ngrx/store';
import { createDefultColumnDef } from '../../core/lib/grid-helpers';
import { ColumnDef, PaginatorDef } from '../../core/lib/grid-model';
import {
    InitGlobalDocumentSearch, GetGlobalDocURL, LoadDocumentData, AddDocumentFilterRow,
    FilterItemChange, GlobalSearchChangeSearchText, CloseDocumentViewer, RemoveFilterRow,
    GridViewChange, GlobalSearchDocumentClear, GlobalSearchDocumentRefresh,
    GetGlobalSearchDocumentPopupUrl, GetGlobalDocumentMenuOpenCaseData, GetGlobalDocumentShareData,
} from '../actions/core';
import { Operator } from '../models/enum';
import { FieldType } from '../../odata';
import { getMenuItemDisplayName } from '../../layout-desktop/reducers';
import { GridDocumentData } from '../../core/lib/matter';

export class BaseGlobalDocumentSearchManager {


    isLoading$: any;
    gridColoum$: any;
    filterViewModel$: any;
    period$: any;

    selectedTeamMember$: any;
    teamMemberCount$: any;
    gridData$: any;
    passWordRequestRow$: any;
    totalItem$: any;
    summery$: any;
    expandedRow$: any;
    selectedInfo$: any;
    showmsg$: any;
    paginatorDef$: any;
    memListPanelMode$: any;
    groupMode$: any;
    groupData$: any;
    selectGroupHash$: any;
    feeEarnerList$: any;
    appCodeList$: any;
    DocumentViewOpened$: any;
    filterExpanded$: any;



    constructor(protected store: Store<any>) {
    }


    columnDef: ColumnDef[] = [];

    paginatorDef = { currentPage: 0, itemPerPage: 50 };

    protected initSelectors(token: string, columnDef: any, paginDef: PaginatorDef) {
        const filterOperate = {
            textOperators: [{ id: Operator.EqualTo, label: 'Equal to' },
            { id: Operator.NotEqualTo, label: 'Not equal to' }],
            dateOperators: [
                { id: Operator.GreaterThan, label: 'After' },
                { id: Operator.LessThan, label: 'Before' }
            ]
        };

        this.store.select(getMenuItemDisplayName('matter_search')).subscribe(name => {
            this.columnDef = [
                createDefultColumnDef('Toggle', { label: '', fxFlex: '32px', filterAnchor: 'start', filterHidden: true, disableShort: true }),
                createDefultColumnDef('DocumentType', { label: 'Type', fxFlex: '108px', filterAnchor: 'end' }, FieldType.DropValue),
                createDefultColumnDef('DPSLastModified', { label: 'Date Modified', fxFlex: '125px', filterAnchor: 'start' },
                    FieldType.TextAfterBefore),
                createDefultColumnDef('ColumnFolderName', { label: 'Folder', fxFlex: '108px', filterAnchor: 'end', filterHidden: true }),
                createDefultColumnDef('MatterCode', { label: 'Work Type', fxFlex: '100px', filterAnchor: 'end' }, FieldType.TextEqulOrNot),
                createDefultColumnDef('FeeEarner', { label: 'Fee Earner', fxFlex: '100px', filterAnchor: 'end' }, FieldType.TextEqulOrNot),
                createDefultColumnDef('note', { label: 'Notes', fxFlex: '300px', filterAnchor: 'end', filterHidden: true }),
                createDefultColumnDef('MatterReferenceNo', { label: name + ' Ref/Details', fxFlex: '', filterAnchor: 'end', filterHidden: true }),


            ];
            this.init(token, { columnDef: this.columnDef, paginatorDef: paginDef, filterOperate: filterOperate });
            this.isLoading$ = this.store.select(getLoadingByToken(token));
            this.gridColoum$ = this.store.select(getGlobalSearchColumnDefByToken(token));
            this.filterViewModel$ = this.store.select(getFilterViewModelByToken(token));
            this.feeEarnerList$ = this.store.select(getFeeEarnerListByToken(token));
            this.appCodeList$ = this.store.select(getAppCodeListByToken(token));
            this.gridData$ = this.store.select(getGridDataByToken(token));
            this.DocumentViewOpened$ = this.store.select(getDocumentViewOpenedByToken(token));
            this.totalItem$ = this.store.select(getTotalItemByToken(token));
            this.filterExpanded$ = this.store.select(getFilterExpandedToken(token));
            this.paginatorDef$ = this.store.select(getPaginatorDefToken(token));
        });




    }

    init(token, payload) {
        this.store.dispatch(new InitGlobalDocumentSearch(token, payload));
    }

    viewDocument(token: string, value: GridDocumentData) {
        this.store.dispatch(new GetGlobalDocURL(token, { gridRowUrlRequest: value }));
    }


    documentSearch(token: string, event) {

        this.store.dispatch(new LoadDocumentData(token, { searchButton: true }));

    }

    addDocumentFilterRow(token: string) {

        this.store.dispatch(new AddDocumentFilterRow(token));
    }

    filterItemChange(token: string, event) {

        this.store.dispatch(new FilterItemChange(token, {
            rowId: event.filterId,
            changeValue: event.changeValue, changeCol: event.changeCol
        }));
    }
    changeSearchTextValue(token: string, event) {
        this.store.dispatch(new GlobalSearchChangeSearchText(token, {
            searchText: event
        }));
    }
    closeDocumentViewer(token: string) {
        this.store.dispatch(new CloseDocumentViewer(token));

    }

    removeFilterRow(token: string, value) {
        this.store.dispatch(new RemoveFilterRow(token, value));
    }

    globalSearchviewChange(token: string, value) {

        this.store.dispatch(new GridViewChange(token, value));



    }

    globalSearchDocumentClear(token: string) {

        this.store.dispatch(new GlobalSearchDocumentClear(token));
    }

    onRefreshGrid(token: string) {
        this.store.dispatch(new GlobalSearchDocumentRefresh(token));
    }

    openInPopup(token: string) {
        this.store.dispatch(new GetGlobalSearchDocumentPopupUrl(token));
    }

    openCaseClick(token: string, rowData: GridDocumentData) {

        this.store.dispatch(new GetGlobalDocumentMenuOpenCaseData(token, { openCaseRequestData: rowData }));

    }

    share(token: string, rowData: GridDocumentData) {

        this.store.dispatch(new GetGlobalDocumentShareData(token, { shareRequestData: rowData }));

    }

}
