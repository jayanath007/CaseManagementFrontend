import { Store } from '@ngrx/store';
import { createDefultColumnDef } from '../../core/lib/grid-helpers';
import { BundleMonitorInput } from '../models/interfaces';
import * as Core from '../actions/core';
import {
    getStateIsLoadingByToken, getColoumnByToken, getItemsForList,
    getSelecteditem, getGridItems, getSearchBundleId
} from '../reducers';
import { Observable } from 'rxjs';
import { User, getUser, LoadOrganizerSettings } from '../../auth';
import { InitSettingCore } from '../../setting-core';
import { filter, take } from 'rxjs/operators';

export class BaseBundleMonitorManager {

    constructor(protected store: Store<any>) {
    }

    isLoading$: any;
    columnDef$: any;
    itemsForList$: any;
    selectedItem$: any;
    searchBundleId$: any;
    gridItems$: any;
    user$: Observable<User>;

    columnDef = [

        createDefultColumnDef('delete',
            { label: '', fxFlex: '35px', filterAnchor: 'end', filterHidden: true }),
        createDefultColumnDef('id', { label: 'ID', fxFlex: '80px', filterAnchor: 'start', filterHidden: true }),
        createDefultColumnDef('reference', { label: 'Reference', fxFlex: '125px', filterAnchor: 'start', filterHidden: true }),
        createDefultColumnDef('name', { label: 'Name', fxFlex: '250px', filterAnchor: 'start', filterHidden: true }),
        createDefultColumnDef('ver', { label: 'Ver', fxFlex: '80px', filterAnchor: 'start', filterHidden: true }),
        createDefultColumnDef('status', { label: 'Status', fxFlex: '80px', filterAnchor: 'start', filterHidden: true }),
        createDefultColumnDef('offiles', { label: '# of Files', fxFlex: '80px', filterAnchor: 'start', filterHidden: true }),
        createDefultColumnDef('submited', { label: 'Submited', fxFlex: '130px', filterAnchor: 'start', filterHidden: true }),
        createDefultColumnDef('byuser', { label: 'By user', fxFlex: '100px', filterAnchor: 'start', filterHidden: true }),
        createDefultColumnDef('queue', { label: 'Queue', fxFlex: '80px', filterAnchor: 'start', filterHidden: true }),
        createDefultColumnDef('started', { label: 'Started', fxFlex: '', filterAnchor: 'start', filterHidden: true }),
        createDefultColumnDef('ended', { label: 'Ended', fxFlex: '', filterAnchor: 'start', filterHidden: true }),
        createDefultColumnDef('completed', { label: '% Completed', fxFlex: '150px', filterAnchor: 'end', filterHidden: true }),
        createDefultColumnDef('Progress', { label: 'Progress', fxFlex: '100px', filterAnchor: 'end', filterHidden: true }),
        createDefultColumnDef('log', { label: 'Log', fxFlex: '100px', filterAnchor: 'end', filterHidden: true })
    ];

    protected initSelectors(token, input: BundleMonitorInput) {
        this.user$ = this.store.select(getUser);
        this.store.dispatch(new InitSettingCore());
        this.store.dispatch(new LoadOrganizerSettings());
        const _user$ = this.user$.pipe(filter(user => !!user.general), take(1)).subscribe(user => {
            this.store.dispatch(new Core.InitBundleMonitor(token, input));
        });
        this.isLoading$ = this.store.select(getStateIsLoadingByToken(token));
        this.columnDef$ = this.store.select(getColoumnByToken(token));
        this.itemsForList$ = this.store.select(getItemsForList(token));
        this.selectedItem$ = this.store.select(getSelecteditem(token));
        this.gridItems$ = this.store.select(getGridItems(token));
        this.searchBundleId$ = this.store.select(getSearchBundleId(token));
    }
    onChangeSelectedItem(itemValue: string, token) {
        this.store.dispatch(new Core.SelectItem(token, itemValue));
    }
    onRefresh(token) {
        this.store.dispatch(new Core.Refresh(token));
    }
    onChangeSearchBundleId(id: number, token: string) {
        this.store.dispatch(new Core.ChangeSearchBundleId(token, id));
    }
    onOpenLog(bundleId: number, token: string) {
        this.store.dispatch(new Core.GetLogFile(token, bundleId));
    }
    onSelectRow(event, token: string) {
        this.store.dispatch(new Core.SelectRow(token, event));
    }
    onDeleteRows(token) {
        this.store.dispatch(new Core.DeleteRows(token));
    }
}
