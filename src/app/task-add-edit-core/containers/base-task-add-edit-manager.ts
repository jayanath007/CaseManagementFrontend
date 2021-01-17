import { ComponentBase } from '../../core/lib/component-base';
import { Store } from '@ngrx/store';
import {
    InitAddEditTask, ChangeFeeEarnerList, ChangeFolderList, ChangeActionTypeList, UpdatePassword, UpdateFileData
} from '../actions/core';
import {
    getTaskAddEditFeeEarnerListNoByToken, getTaskAddEditFolderListByToken,
    getTaskAddEditActionTypeListByToken, getTaskAddEditDefaultFolderByToken,
    getTaskAddEditMatterInfoByToken,
    getTaskAddEditSelectedFeeEarnerByToken,
    getTaskAddEditgetLoginUserByToken,
    getTaskAddEditHeaderTextByToken,
    getTaskAddEditDocumentFlowStatusByToken,
    getAddEditTaskLoadingByToken,
    getTaskAddEditIsDirtyByToken,
    getTaskAddEditDateByToken,
    ChangeAddEditTaskDate,
    ChangeNoteInAddEditTask,
    getTaskAddEditNoteByToken,
    getTaskAddEditFileDataInfoByToken,
    getTaskAddEditFilePassWordDataByToken,
    ChangeMatterData,
    SubmitAddEditTask,
    EnterUnLockPassword
} from '..';
import { Output, EventEmitter } from '@angular/core';
import { FeeEarner, ActionType, Folder, MatterResponce } from '../models/interface';
import { getTaskAddEditInfoMsgByToken, getTaskAddEditHasPasswordByToken } from '../reducers';
import { Observable } from 'rxjs';
import { User, getUser } from '../../auth';
import { take, filter } from 'rxjs/operators';

export class BaseTaskAddEditManager extends ComponentBase {

    @Output() closePopup = new EventEmitter<any>();
    public defaultLoginUser: any;

    public feeEarnerList$: any;
    public folderList$: any;
    public actionTypeList$: any;
    public defaultFolderId$: any;
    public matterInfo$: any;
    public selectedFeeEarner$: any;
    public loginUser$: any;
    public headerText$: any;
    public documentFlowStatus$: any;
    public addEditTaskLoading$: any;
    public isDirty$: any;
    public taskDate$: any;
    public taskNote$: any;
    public fileDataInfo$: any;
    public filePassWordInfo$: any;
    public infoMsg$: any;
    public hasPassword$: any;
    user$: Observable<User>;

    constructor(protected store: Store<any>) { super(); }

    protected initSelectors(taskAddEditToken: string, inputData: any) {


        this.user$ = this.store.select(getUser);
        this.user$.pipe(filter(user => !!user.general),
            take(1)).subscribe(user => {
                this.defaultLoginUser = user.general;
                if (inputData && !inputData.loginUser) {
                    inputData.loginUser = user.general.user;
                }
                inputData.putOnBy = user.general.user;
                this.store.dispatch(new InitAddEditTask(taskAddEditToken, {
                    inputData: inputData,
                    timeOffset: user.general.dateTimeOffset
                }));
            }).unsubscribe();


        this.addEditTaskLoading$ = this.store.select(getAddEditTaskLoadingByToken(taskAddEditToken));
        this.feeEarnerList$ = this.store.select(getTaskAddEditFeeEarnerListNoByToken(taskAddEditToken));
        this.folderList$ = this.store.select(getTaskAddEditFolderListByToken(taskAddEditToken));
        this.actionTypeList$ = this.store.select(getTaskAddEditActionTypeListByToken(taskAddEditToken));
        this.defaultFolderId$ = this.store.select(getTaskAddEditDefaultFolderByToken(taskAddEditToken));
        this.matterInfo$ = this.store.select(getTaskAddEditMatterInfoByToken(taskAddEditToken));
        this.selectedFeeEarner$ = this.store.select(getTaskAddEditSelectedFeeEarnerByToken(taskAddEditToken));
        this.loginUser$ = this.store.select(getTaskAddEditgetLoginUserByToken(taskAddEditToken));
        this.headerText$ = this.store.select(getTaskAddEditHeaderTextByToken(taskAddEditToken));
        this.documentFlowStatus$ = this.store.select(getTaskAddEditDocumentFlowStatusByToken(taskAddEditToken));
        this.isDirty$ = this.store.select(getTaskAddEditIsDirtyByToken(taskAddEditToken));
        this.taskDate$ = this.store.select(getTaskAddEditDateByToken(taskAddEditToken));
        this.taskNote$ = this.store.select(getTaskAddEditNoteByToken(taskAddEditToken));
        this.fileDataInfo$ = this.store.select(getTaskAddEditFileDataInfoByToken(taskAddEditToken));
        this.filePassWordInfo$ = this.store.select(getTaskAddEditFilePassWordDataByToken(taskAddEditToken));
        this.infoMsg$ = this.store.select(getTaskAddEditInfoMsgByToken(taskAddEditToken));
        this.hasPassword$ = this.store.select(getTaskAddEditHasPasswordByToken(taskAddEditToken));
    }

    onDateChange(taskAddEditToken, taskDate) {
        this.store.dispatch(new ChangeAddEditTaskDate(taskAddEditToken,
            { taskDate: taskDate }));
    }
    onNoteChange(taskAddEditToken, taskNote) {
        this.store.dispatch(new ChangeNoteInAddEditTask(taskAddEditToken,
            { taskNote: taskNote }));
    }
    onFeeEarnerChanged(taskAddEditToken, feeEarner: FeeEarner) {
        this.store.dispatch(new ChangeFeeEarnerList(taskAddEditToken,
            { selectedFeeEarner: feeEarner }));
    }
    onFolderChanged(taskAddEditToken, folder: Folder) {
        this.store.dispatch(new ChangeFolderList(taskAddEditToken,
            { selectedFolder: folder }));
    }
    onActionTypeChanged(taskAddEditToken, actionType: ActionType) {
        this.store.dispatch(new ChangeActionTypeList(taskAddEditToken,
            { selectedActionType: actionType }));
    }
    onSelectedMatterObj(taskAddEditToken, matterResponce: MatterResponce) {
        this.user$.pipe(take(1)).subscribe(user => {
            this.store.dispatch(new ChangeMatterData(taskAddEditToken,
                { selectedMatterData: matterResponce, timeOffset: user.general.dateTimeOffset }));
        }).unsubscribe();
    }

    uploadedFile(taskAddEditToken, fileData: any) {
        this.store.dispatch(new UpdateFileData(taskAddEditToken,
            { fileData: fileData }));
    }

    updatePassword(taskAddEditToken, password: string) {
        this.store.dispatch(new UpdatePassword(taskAddEditToken,
            { filePassword: password }));
    }
    taskAddEditSave(taskAddEditToken, value) {
        this.store.dispatch(new SubmitAddEditTask(taskAddEditToken));
    }

    enterUnLockPW(taskAddEditToken, value) {
        this.store.dispatch(new EnterUnLockPassword(taskAddEditToken, { password: value }));
    }
}
