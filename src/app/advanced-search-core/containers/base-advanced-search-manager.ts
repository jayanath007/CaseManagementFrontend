import { getpaginatorDefByToken } from './../reducers/index';
import { ViewChangeKind } from './../models/enums';
import {
    getLoadingByToken, getColumnDefByToken, getClientListByToken,
    getAppCodeListByToken,
    getAdvancedSearchViewModeByToken,
    getSearchGridDataListByToken,
    getColoumnArrayByToken,
    getBranchListByToken,
    getMatterTotalByToken
} from './../../advanced-search-core/reducers/index';
import { PaginatorDef } from './../../core/lib/grid-model';
import { Store } from '@ngrx/store';
import {
    InitAdvancedSearchView, AdvancedSearchViewChange, AdvancedSearchAppCodeChange,
    RequestAdvancedGridData, AdvancedSearchColoumnRightClick, AdvancedSearchOpenCase, CloseAdvancedSearch, AdvancedSearchGridViewChange
} from '../actions/core';
import { MainMenuService } from '../../layout-desktop';



export class BaseAdvancedSearchManager {

    public columnDef$: any;
    public clientList$: any;
    public advancedSearchViewMode$: any;
    public searchColumnOption$: any;
    public appCodeList$: any;
    public gridDataList$: any;
    public coloumnArray$: any;
    public branchList$: any;

    public matterGridData$: any;
    public paginatorDef$: any;
    public searchText$: any;
    public totalItems$: any;
    public totalMatterCount$: any;
    public gridLoading$: any;
    public initView$: any;
    public isLoading$: any;
    public total$: any;


    token: string;

    constructor(protected store: Store<any>, private pageService: MainMenuService) {
    }

    paginatorDef = { currentPage: 0, itemPerPage: 50 };

    protected initSelectors(token: string, paginDef: PaginatorDef) {
        this.init(token, { paginatorDef: paginDef });
        this.isLoading$ = this.store.select(getLoadingByToken(token));
        this.columnDef$ = this.store.select(getColumnDefByToken(token));
        this.clientList$ = this.store.select(getClientListByToken(token));
        this.advancedSearchViewMode$ = this.store.select(getAdvancedSearchViewModeByToken(token));
        this.appCodeList$ = this.store.select(getAppCodeListByToken(token));
        this.gridDataList$ = this.store.select(getSearchGridDataListByToken(token));
        this.coloumnArray$ = this.store.select(getColoumnArrayByToken(token));
        this.total$ = this.store.select(getMatterTotalByToken(token));
        this.branchList$ = this.store.select(getBranchListByToken(token));
        this.paginatorDef$ = this.store.select(getpaginatorDefByToken(token));


    }

    init(token, payload) {

        this.store.dispatch(new InitAdvancedSearchView(token, payload));

    }

    onViewChange(payload) {

        if (payload.kind === ViewChangeKind.PageEvent || payload.kind === ViewChangeKind.ToggleFieldSort) {

     this.store.dispatch(new AdvancedSearchGridViewChange(this.token, { kind: payload.kind, value: payload.value }));

        } else {

    this.store.dispatch(new AdvancedSearchViewChange(this.token, { kind: payload.kind, value: payload.value }));

        }
    }

    onChangeAppCode(value) {

        this.store.dispatch(new AdvancedSearchAppCodeChange(this.token, { value: value }));
    }

    onAdvancedSearchClick() {

        this.store.dispatch(new RequestAdvancedGridData(this.token));

    }

    onColoumnHeaderRightClick(value) {

        this.store.dispatch(new AdvancedSearchColoumnRightClick(this.token, { value: value }));

    }

    onSaveBranch() {
        this.store.dispatch(new CloseAdvancedSearch(this.token));
    }

    onOpenCaseClick(event) {

        this.store.dispatch(new AdvancedSearchOpenCase(this.token, event));

    }

}
