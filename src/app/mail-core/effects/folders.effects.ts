
import { take, switchMap, filter, catchError, map, mergeMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';

import { Effect, Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { MSGraphClientService } from '../services/msgraph-client.service';

import { of, from } from 'rxjs';

import * as Folders from '../actions/folders';
import { getInbox, getDeletedItemsFolder } from '../reducers';
import { FolderEditMode } from '../../core/organizer/enums';
import { getUser, UpdateSharedMailBoxes } from '../../auth';
import { FolderItemWrapper } from '../models/interfaces';

@Injectable()
export class FoldersEffects {
    constructor(private actions$: Actions, private store: Store<any>, private service: MSGraphClientService) { }

    @Effect()
    loadFolders$ = this.actions$.pipe(ofType<Folders.LoadFolderList>(Folders.LOAD_FOLDER_LIST),
        mergeMap((action) =>
            this.service.getAllRootMessageFolders(action.owner).pipe(
                map(data => new Folders.FolderListLoadSuccess({
                    folderList: data, clearCurrent: action.clearCurrent, owner: action.owner, type: action.loadType
                })),
                catchError(error => of(new Folders.FolderListLoadFail(error, { owner: action.owner }))))
        ));
    @Effect()
    toggleMailBox$ = this.actions$.pipe(ofType<Folders.ToggleMailBox>(Folders.TOGGLE_MAILBOX),
        filter(val => val.payload.init),
        switchMap((action) =>
            this.service.getAllRootMessageFolders(action.payload.mail).pipe(
                map(data => new Folders.FolderListLoadSuccess({
                    folderList: data, clearCurrent: false, owner: action.payload.mail
                })),
                catchError(error => of(new Folders.FolderListLoadFail(error, { owner: action.payload.mail }))))
        ));
    @Effect()
    refreshMailBox$ = this.actions$.pipe(ofType<Folders.RefreshMailBox>(Folders.REFRESH_MAILBOX),
        switchMap((action) =>
            this.service.getAllRootMessageFolders(action.payload.mail).pipe(
                map(data => new Folders.FolderListLoadSuccess({
                    folderList: data, clearCurrent: false, owner: action.payload.mail
                })),
                catchError(error => of(new Folders.FolderListLoadFail(error, { owner: action.payload.mail }))))
        ));
    @Effect()
    folderListLoadFail$ = this.actions$.pipe(ofType<Folders.FolderListLoadFail>(Folders.FOLDER_LOAD_FAIL),
        filter(val => val.payload.owner !== 'me' && val.error.status === 404),
        switchMap((action) =>
            this.service.getMailFoldersByIds(['inbox', 'drafts', 'sentitems', 'deleteditems', 'archive', 'junkemail'], action.payload.owner)
                .pipe(
                    map(data => data.filter(val => val.id)),
                    filter(data => data.length > 0),
                    mergeMap(data => {
                        const list: any[] = data.filter(val => val.childFolderCount > 0)
                            .map(val => new Folders.GetChildMailFoldersRecursively({ folderId: val.id, owner: action.payload.owner }));
                        list.push(new Folders.FolderListLoadSuccess({
                            folderList: data.map(val => ({ ...val })),
                            clearCurrent: false, owner: action.payload.owner
                        }));
                        return from(list);
                    }),
                    catchError(error => of(new Folders.FolderListLoadFail(error, { owner: '' }))))
        ));

    @Effect()
    getChildMailFoldersRecursively$ = this.actions$
        .pipe(ofType<Folders.GetChildMailFoldersRecursively>(Folders.GET_CHILD_MAIL_FOLDERS_RECURSIVELY),
            mergeMap((action) =>
                this.service.getChildMailFolder(action.payload.owner, action.payload.folderId).pipe(
                    map(data => data.filter(val => val.id)),
                    filter(data => data.length > 0),
                    mergeMap(data => {
                        const list: any[] = data.filter(val => val.childFolderCount > 0)
                            .map(val => new Folders.GetChildMailFoldersRecursively({ folderId: val.id, owner: action.payload.owner }));
                        list.push(new Folders.FolderListLoadSuccess({
                            folderList: data.map(val => ({ ...val })),
                            clearCurrent: false, owner: action.payload.owner
                        }));
                        return from(list);
                    }),
                    catchError(error => of(new Folders.FolderListLoadFail(error, { owner: '' }))))
            ));

    @Effect()
    getMailBoxesSuccess = this.actions$.pipe(ofType<Folders.GetMailBoxesSuccess>(Folders.GET_MAILBOXES_SUCCESS),
        switchMap(action =>
            this.store.select(getUser).pipe(filter(user => !(user.dpsSharedMailBoxes && user.dpsSharedMailBoxes.length > 0)),
                take(1))),
        switchMap((user) => this.service.getExtensions()));

    @Effect()
    folderEditFinalize$ = this.actions$.pipe(ofType<Folders.FinalizeFolderEditMode>(Folders.FINALIZE_FOLDER_EDIT_MODE),
        filter((action) =>
            !(action.payload.editMode === FolderEditMode.Rename
                && !!action.payload.item.data.wellKnownName) // can't rename well known folder
        ),
        filter((action) => action.payload.confirm && !!action.payload.value),
        map((action) => action.payload.editMode === FolderEditMode.Create ?
            new Folders.CreateNewFolder({
                parentId: action.payload.item.data.id, value: action.payload.value, owner: action.payload.owner
            }) : //  create
            new Folders.RenameFolder({ folder: action.payload.item, value: action.payload.value }) // rename
        ));

    @Effect()
    createRootFolder$ = this.actions$.pipe(ofType<Folders.CreateRootMessageFolder>(Folders.CREATE_MESSAGE_ROOT_FOLDER),
        switchMap((action) =>
            this.store.select(getInbox).pipe(
                take(1),
                filter(inbox => !!inbox),
                map((inbox) => new Folders.CreateNewFolder({ parentId: 'msgfolderroot', value: action.payload.displayName, owner: 'me' })))
        ));

    @Effect()
    createNewFolder$ = this.actions$.pipe(ofType<Folders.CreateNewFolder>(Folders.CREATE_NEW_FOLDER),
        switchMap((action: Folders.CreateNewFolder) =>
            this.service.createMailFolder(action.payload.owner, action.payload.value, action.payload.parentId).pipe(
                map((result) => new Folders.FolderCreateSuccess({ item: result, owner: action.payload.owner })),
                catchError(error => of(new Folders.FolderCreateFail({ error }))))
        ));

    @Effect()
    renameFolder$ = this.actions$.pipe(ofType<Folders.RenameFolder>(Folders.RENAME_FOLDER),
        switchMap((action) =>
            this.service.updateMailFolder(action.payload.folder.owner, action.payload.folder.data.id, action.payload.value).pipe(
                map((result) => new Folders.RenameFolderSuccess({ item: result })),
                catchError(error => of(new Folders.RenameFolderFail({ error, folder: action.payload.folder }))))
        ));

    @Effect()
    deleteFolder$ = this.actions$.pipe(ofType<Folders.DeleteFolder>(Folders.DELETE_FOLDER),
        switchMap((action) => this.store.select(getDeletedItemsFolder).pipe(take(1), map((folder) => ({ folder, action })))),
        switchMap<{ folder: FolderItemWrapper, action: Folders.DeleteFolder }, any>(({ folder, action }) => {
            if (folder.data.id === action.payload.item.data.parentFolderId) {
                return this.service.deleteMailFolder(action.payload.item.owner, action.payload.item.data.id).pipe(
                    map((result) => new Folders.DeleteFolderSuccess(action.payload)),
                    catchError(error => of(new Folders.DeleteFolderFail({ error, item: action.payload.item }))));
            } else {
                return of(new Folders.MoveFolder({
                    item: action.payload.item, destinationId: folder.data.id, owner: action.payload.owner
                }));
            }
        }
        ));
    @Effect()
    moveFolder$ = this.actions$.pipe(ofType<Folders.MoveFolder>(Folders.MOVE_FOLDER),
        switchMap((action) =>
            this.service.moveMailFolder(action.payload.item.owner, action.payload.item.data.id, action.payload.destinationId).pipe(
                map((result) => new Folders.MoveFolderSuccess({ item: action.payload.item, newItem: result, owner: action.payload.owner })),
                catchError(error => of(new Folders.MoveFolderFail({ error, item: action.payload.item }))))
        ));

    @Effect()
    refreshFolderData$ = this.actions$.pipe(ofType<Folders.RefreshFoldersData>(Folders.REFRESH_FOLDER_DATA),
        mergeMap((info) =>
            this.service.getMailFoldersByIds(info.payload.folderIds, info.payload.owner).pipe(
                map(result => new Folders.RefreshFoldersSuccess({ items: result })),
                catchError(error => of(new Folders.RefreshFoldersFail({ error: error, folderIds: info.payload.folderIds }))))
        ));

    @Effect()
    refreshFolderList = this.actions$.pipe(
        ofType<Folders.MoveFolderSuccess | Folders.DeleteFolderSuccess>(Folders.MOVE_FOLDER_SUCCESS, Folders.DELETE_FOLDER_SUCCESS),
        map((action) => new Folders.LoadFolderList(true, action.payload.owner, action.type)));



    @Effect()
    moveFolderSuccess = this.actions$.pipe(ofType<Folders.FolderListLoadSuccess>
        (Folders.FOLDER_LOAD_SUCCESSS),
        filter(action => action.payload.owner !== 'me' && action.payload.type === Folders.MOVE_FOLDER_SUCCESS),
        map((action) => new Folders.LoadFolderList(true, 'me')));

    @Effect()
    removeMailBox$ = this.actions$.pipe(ofType<Folders.RemoveMailBox>(Folders.REMOVE_MAILBOX),
        switchMap((action) => this.store.select(getUser).pipe(take(1), map((user) => ({ user, action })))),
        switchMap(({ user, action }) => {
            return this.service.updateExtensions(user.isChaserEnable,
                user.isSignaturAutoAdd,
                user.dpsSharedMailBoxes.filter(val => val.mail !== action.payload.mail),
                user.reminderSoundEnable, user.newMailSoundEnable, user.messageFormat, user.useGlobalSignature).pipe(
                    mergeMap((result) => from([
                        new Folders.RemoveMailBoxSuccess(action.payload),
                        new UpdateSharedMailBoxes(user.dpsSharedMailBoxes.filter(val => val.mail !== action.payload.mail))
                    ])),
                    catchError(error => of(new Folders.RemoveMailBoxFail({ error, mailBox: action.payload }))));
        }));

    @Effect()
    addMailBox$ = this.actions$.pipe(ofType<Folders.AddMailBox>(Folders.ADD_MAILBOX),
        switchMap((action) => this.store.select(getUser).pipe(take(1), map((user) => ({ user, action })))),
        filter(({ user, action }) => !user.dpsSharedMailBoxes.find(val => val.mail.toLowerCase() === action.payload.mail.toLowerCase())),
        switchMap(({ user, action }) => {
            return this.service.updateExtensions(user.isChaserEnable,
                user.isSignaturAutoAdd,
                user.dpsSharedMailBoxes.concat([action.payload]),
                user.reminderSoundEnable, user.newMailSoundEnable, user.messageFormat, user.useGlobalSignature).pipe(
                    mergeMap((result) => from([
                        new Folders.AddMailBoxSuccess(action.payload),
                        new UpdateSharedMailBoxes(user.dpsSharedMailBoxes.concat([action.payload]))
                    ])),
                    catchError(error => of(new Folders.AddMailBoxFail({ error, mailBox: action.payload }))));
        }));

    @Effect()
    getFolderPermissionSet$ = this.actions$.pipe(ofType<Folders.GetFolderPermissionSet>(Folders.GET_FOLDER_PERMISSION_SET),
        switchMap(action =>
            this.service.getFolderPermissionSet([action.payload.folderId]).pipe(
                map(result => new Folders.GetFolderPermissionSetSuccess(result[0])),
                catchError(error => of(new Folders.GetFolderPermissionSetFail({ error: error }))))
        ));
    @Effect()
    saveFolderPermissionSet$ = this.actions$.pipe(ofType<Folders.SaveFolderPermissionSet>(Folders.SAVE_FOLDER_PERMISSION_SET),
        switchMap(action =>
            this.service.saveFolderPermissionSet(action.payload).pipe(
                map(result => new Folders.SaveFolderPermissionSetSuccess(result)),
                catchError(error => of(new Folders.SaveFolderPermissionSetFail({ error: error }))))
        ));

}
