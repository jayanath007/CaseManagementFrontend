import { AddRootFolder, SaveTreeFolder, AddNewRootFolder } from './../actions/core';
import { Store } from '@ngrx/store';
import {
    InitDiaryFolder, AddFolder, DeleteFolder, CancelDeletedFolder,
    ChangeIsDefault, SaveFolders, ChangeFolderName, ChangeRootFolder
} from '../actions/core';
import {
    getIsLoadingByToken, getFoldersByToken, getIsSavingByToken, getIsSavedByToken,
    getfolderDataSourceToken, getfolderFlatData, getIsDurty
} from '../reducers';
import { Observable } from 'rxjs';

export class BaseDiaryFolderManager {

    token: string;
    isLoading$: any;
    folders$: any;
    isSaving$: any;
    isSaved$: Observable<boolean>;
    folderDataSource$: any;
    folderFlatData$: any;
    isDurty$: any;

    constructor(protected store: Store<any>) { }

    protected initSelectors(token: string, inputData: number) {
        this.token = token;
        this.store.dispatch(new InitDiaryFolder(token, { appId: inputData }));

        this.isLoading$ = this.store.select(getIsLoadingByToken(token));
        this.folders$ = this.store.select(getFoldersByToken(token));
        this.isSaving$ = this.store.select(getIsSavingByToken(token));
        this.isSaved$ = this.store.select(getIsSavedByToken(token));
        this.folderDataSource$ = this.store.select(getfolderDataSourceToken(token));
        this.folderFlatData$ = this.store.select(getfolderFlatData(token));
        this.isDurty$ = this.store.select(getIsDurty(token));

    }
    onAddFolder(event) {
        this.store.dispatch(new AddFolder(this.token, event));
    }
    onDeleteFolder(event) {
        this.store.dispatch(new DeleteFolder(this.token, event));
    }
    onCancelDeletedFolder(event) {
        this.store.dispatch(new CancelDeletedFolder(this.token, event));
    }
    onChangeIsDefault(event) {
        this.store.dispatch(new ChangeIsDefault(this.token, event));
    }
    onSaveFolders(type) {
        this.store.dispatch(new SaveTreeFolder(this.token, type));
    }
    onChangeFolderName(event) {
        this.store.dispatch(new ChangeFolderName(this.token, event));
    }

    onChangeRootFolder(event) {
        this.store.dispatch(new ChangeRootFolder(this.token, event));
    }

    onAddRootFolder(event) {
        this.store.dispatch(new AddRootFolder(this.token, event));
    }

    onAddNewRootFolder(value) {
        this.store.dispatch(new AddNewRootFolder(this.token, value));
    }


}
