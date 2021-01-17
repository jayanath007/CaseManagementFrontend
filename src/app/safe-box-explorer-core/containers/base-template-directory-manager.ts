import { AppView, Template, TemplateClipboard, AppInfo } from './../models/interfaces';
import { Store } from '@ngrx/store';
import { of, Observable } from 'rxjs';

import {
    InitTemplateDirectory, SelectApp, ToggleAppListExpand, ViewTemplate,
    SelectTemplate, ChangeSort, ChangeFilter, ChangeSearchText, GetTemplateList,
    ChangeShowCommonTemplates, CutOrCopyTemplates, PasteItems, DeleteItems, RenameItem, UploadFiles, AddNewItem
} from '../actions/template-directory';
import {
    getIsLoading, getAppList, getSelectedApp, getIsAppListExpand,
    getSelectedAppView, getSearchText, getFilter, getSort, getShowCommonTemplates, getTemplateClipboard, getCopyFrom
} from '../reducers';
import { CheckinFile, DiscardCheckout, CheckoutTempalteFiles, FileManagerType, DownloadTemplateData } from '../../document-view';
import { TemplateFilterByCheckoutType } from '../models/enum';
import { ItemClipboard, SAFE_BOX_DRIVE_TOKEN, getItemClipboard } from '../../drive-core';
import { SafeBoxType } from '../../core';

export class BaseTemplateDirectoryManager {

    isLoading$: Observable<boolean> = of(false);
    appList$: Observable<AppInfo[]> = of([]);
    selectedApp$: Observable<AppInfo> = of(null);
    isAppListExpand$: Observable<boolean> = of(false);
    selectedAppView$: Observable<AppView> = of(null);
    sort$: Observable<string> = of('');
    filter$: Observable<TemplateFilterByCheckoutType> = of(null);
    searchText$: Observable<string> = of('');
    showCommonTemplates$: Observable<boolean> = of(false);
    clipboard$: Observable<TemplateClipboard> = of(null);
    copyFrom$: Observable<SafeBoxType> = of(null);
    driveClipboard$: Observable<ItemClipboard> = of(null);

    constructor(protected store: Store<any>) {
    }

    protected onInit(isGoogle: string) {
        this.store.dispatch(new InitTemplateDirectory());
        this.isLoading$ = this.store.select(getIsLoading);
        this.appList$ = this.store.select(getAppList);
        this.selectedApp$ = this.store.select(getSelectedApp);
        this.isAppListExpand$ = this.store.select(getIsAppListExpand);
        this.selectedAppView$ = this.store.select(getSelectedAppView);
        this.sort$ = this.store.select(getSort);
        this.filter$ = this.store.select(getFilter);
        this.searchText$ = this.store.select(getSearchText);
        this.showCommonTemplates$ = this.store.select(getShowCommonTemplates);
        this.clipboard$ = this.store.select(getTemplateClipboard);
        this.copyFrom$ = this.store.select(getCopyFrom);
        if (!isGoogle) {
            this.driveClipboard$ = this.store.select(getItemClipboard(SAFE_BOX_DRIVE_TOKEN));
        }
    }

    public selectApp(app: AppInfo) {
        this.store.dispatch(new SelectApp(app));
    }
    public toggleAppListExpand() {
        this.store.dispatch(new ToggleAppListExpand());
    }
    onEditeOrView({ template, appId, isCommon }: { template: Template, appId: number, isCommon: boolean }) {

        if ((template.checkedOutByUser && !template.checkedOutHashKey) || !template.canEdit) {
            this.store.dispatch(new ViewTemplate({ appId, fileName: template.name, isCommon }));
        } else {
            this.store.dispatch(new CheckoutTempalteFiles({ appId, fileName: template.name, isCommon }));
        }
    }
    onCheckIn({ template, appId, fileManagerType }: { template: Template, appId: number, fileManagerType: FileManagerType }) {
        const checkin = {
            hashKey: template.checkedOutHashKey,
            url: null,
            name: null,
            path: null,
            fileManagerType
        };
        this.store.dispatch(new CheckinFile(checkin));
    }
    onAbort({ template, appId, fileManagerType }: { template: Template, appId: number, fileManagerType: FileManagerType }) {
        const checkout = {
            hashKey: template.checkedOutHashKey,
            url: null,
            name: null,
            path: null,
            fileManagerType
        };
        this.store.dispatch(new DiscardCheckout(checkout));
    }
    onSelectTemplate({ template, appId, isMulti, path }: { template: Template, appId: number, isMulti: boolean, path: string }) {
        this.store.dispatch(new SelectTemplate({ template, appId, isMulti, path }));
    }

    onChangeSort(value: string) {
        this.store.dispatch(new ChangeSort(value));
    }

    onChangeFilter(value: TemplateFilterByCheckoutType) {
        this.store.dispatch(new ChangeFilter(value));
    }

    onChangeSearchText(value: string) {
        this.store.dispatch(new ChangeSearchText(value));
    }

    onRefresh(app: AppInfo) {
        this.store.dispatch(new GetTemplateList(app));
    }

    onChangeShowCommonTemplates(value: boolean) {
        this.store.dispatch(new ChangeShowCommonTemplates(value));
    }

    onCopyOrCutTemplate(clipboard: TemplateClipboard) {
        this.store.dispatch(new CutOrCopyTemplates(clipboard));
    }
    onPaste(event) {
        this.store.dispatch(new PasteItems(event));
    }
    onDeleteItems(event) {
        this.store.dispatch(new DeleteItems(event));
    }
    onRenameItem(event) {
        this.store.dispatch(new RenameItem(event));
    }
    onDownloadFile(event) {
        this.store.dispatch(new DownloadTemplateData(event));
    }
    onUploadFiles(event) {
        this.store.dispatch(new UploadFiles(event));
    }
    onAddNewItem(event) {
        this.store.dispatch(new AddNewItem(event));
    }
}
