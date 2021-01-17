import {
    ExpandSafeBoxExplorer, ExpandCollapsedSafeBox, SelectBlobSafeBox,
    ChangeViewTypeSafeBoxSafeBox, UploadFileSafeBoxExplorer, ItemDownload, ItemRename, ItemDelete,
    ItemMove, Navigete, ItemCopy, ItemPaste, SelectFolder, ChangeSafeBoxType, InitSafeBoxExplorer
} from './../actions/core';
import { Output, EventEmitter } from '@angular/core';
import { Store } from '@ngrx/store';
import {
    getTreeDataByToken, getLoadingByToken,
    getSelectedTreeNodeItemByToken,
    getSelectedBlobByToken,
    getSelectedViewTypebByToken,
    getAllBackPathByToken,
    getAllNextPathByToken,
    getCopyItemsByToken,
    getSelectedFolderByToken,
    getSelectedSafeBoxtype,
    getCopyFrom,
} from './../reducers';
import { TreeNodeItem, Blob } from '../models/interfaces';
import { ItemChangeKind } from '../models/enum';

import { ExplorerViewType } from '../models/enum';
import { Observable, of } from 'rxjs';
import { SafeBoxType } from '../../core';





export class BaseSafeBoxExplorerManager {

    @Output() closePopup = new EventEmitter<any>();

    public myToken: string;
    public inputData: any;
    public selectedBlob$: any;
    public loading$: any;
    public treeData$: any;
    public selectedTreeNodeItem$: any;
    public viewType$: any;
    public backpaths$: any;
    public nextpaths$: any;
    public copyItems$: any;
    public selectedFolder$: any;
    selectedSafeBoxType$;
    copyFrom$: Observable<SafeBoxType> = of(null);

    constructor(protected store: Store<any>) {
    }

    protected initSelectors(myToken: string) {
        this.myToken = myToken;
        this.store.dispatch(new InitSafeBoxExplorer(myToken));
        this.treeData$ = this.store.select(getTreeDataByToken(myToken));
        this.loading$ = this.store.select(getLoadingByToken(myToken));
        this.selectedBlob$ = this.store.select(getSelectedBlobByToken(myToken));
        this.selectedTreeNodeItem$ = this.store.select(getSelectedTreeNodeItemByToken(myToken));
        this.viewType$ = this.store.select(getSelectedViewTypebByToken(myToken));
        this.backpaths$ = this.store.select(getAllBackPathByToken(myToken));
        this.nextpaths$ = this.store.select(getAllNextPathByToken(myToken));
        this.copyItems$ = this.store.select(getCopyItemsByToken(myToken));
        this.selectedFolder$ = this.store.select(getSelectedFolderByToken(myToken));
        this.selectedSafeBoxType$ = this.store.select(getSelectedSafeBoxtype);
        this.copyFrom$ = this.store.select(getCopyFrom);
    }


    onExpand(prefix: string) {
        this.store.dispatch(new ExpandSafeBoxExplorer(this.myToken, { prefix: prefix }));
    }

    onExpandCollapsed(event: { item: TreeNodeItem }) {
        this.store.dispatch(new ExpandCollapsedSafeBox(this.myToken, event));
    }

    onSelectedBlob(event: Blob[]) {
        this.store.dispatch(new SelectBlobSafeBox(this.myToken, event));
    }

    onSave(event) {
    }

    onChangeFolderItem(event: { kind: ItemChangeKind, value: { item: any, path: string } }) {
        if (event.kind === ItemChangeKind.Select) {
            this.store.dispatch(new SelectFolder(this.myToken, { folderPrefix: event.value.path }));
        }

    }

    onChangeFileItem(event: { kind: ItemChangeKind, value: any, newName?: string }) {
        switch (event.kind) {
            case ItemChangeKind.Download: {
                this.store.dispatch(new ItemDownload(this.myToken, { path: event.value.Name }));
                break;
            }
            case ItemChangeKind.Share_File: {
                break;
            }
            case ItemChangeKind.Delete: {
                this.store.dispatch(new ItemDelete(this.myToken, { paths: event.value.map(val => val.Name) }));
                break;
            }
            case ItemChangeKind.Rename: {
                this.store.dispatch(new ItemRename(this.myToken, { path: event.value.Name, newName: event.newName }));
                break;
            }
            case ItemChangeKind.View: {
                this.store.dispatch(new ItemDownload(this.myToken, { path: event.value.Name, isView: true }));
                break;
            }
            case ItemChangeKind.Cut: {
                this.store.dispatch(new ItemCopy(this.myToken, { type: 'cut', path: event.value.map(val => val.Name) }));
                break;
            }
            case ItemChangeKind.Copy: {
                this.store.dispatch(new ItemCopy(this.myToken, { type: 'copy', path: event.value.map(val => val.Name) }));
                break;
            }
            case ItemChangeKind.Paste: {
                this.store.dispatch(new ItemPaste
                    (this.myToken, { type: event.value.item.type, newpath: event.value.path, itemPath: event.value.item.path }));
                break;
            }
            default:
                break;
        }
    }

    onMoveItem(event: { item: Blob[], path: string }) {
        this.store.dispatch(new ItemMove(this.myToken, { item: event.item, newPath: event.path }));
    }

    onChangeViewType(event: { viewType: ExplorerViewType }) {
        this.store.dispatch(new ChangeViewTypeSafeBoxSafeBox(this.myToken, event));
    }

    onUploadFile(event: { file: any, path: string }) {
        this.store.dispatch(new UploadFileSafeBoxExplorer(this.myToken, event));
    }
    close() {
        this.closePopup.emit();
    }
    onNavigete(event) {
        this.store.dispatch(new Navigete(this.myToken, { type: event.type, prefix: event.prefix }));
    }
    onChangeSafeBoxType(type: SafeBoxType) {
        this.store.dispatch(new ChangeSafeBoxType(this.myToken, type));
    }
}
