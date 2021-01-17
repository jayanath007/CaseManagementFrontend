import { getFileHistoryPageEventByToken } from '../reducers/file-history';
import {
    FileHistoryViewChange, ViewChangeKind, InitFileHistory, FileHistoryGridRowChange, RowItemChangeKind,
    FileHistoryRefresh,
    GetSignatureToken,
    CloseDocumentViewPopup,
} from '../actions/core';
import {
    getFileHistoryGridDataByToken, getFileHistoryColumnDefByToken, getDocumentViewOpenedByToken,
    getSignandSendIsLoadingByToken, getSignTokenByToken, getDocumentViewPopupOpenedByToken,
    getXdraftViewSuccessByToken,
    getGroupModeByToken, getFolderListByToken, getSelectedAttachmentsByToken
} from '../reducers';
import { Store } from '@ngrx/store';
import { getFileHistorySearchTextByToken } from '..';
import { FileItemWrapper } from '../models/interface';
import { getUser } from '../../auth';

export class BaseFileHistoryManager {

    constructor(protected store: Store<any>) {
    }
    refresh(token) {
        this.store.dispatch(new FileHistoryRefresh(token));
    }
    onChange(token, payload) {
        this.store.dispatch(new InitFileHistory(token, payload));
    }
    onRowChange(token, item: { kind: RowItemChangeKind, row: FileItemWrapper, value: any }) {
        this.store.dispatch(new FileHistoryGridRowChange(token, item));
    }
    onViewChange(token: string, kind: ViewChangeKind, value: any) {
        this.store.dispatch(new FileHistoryViewChange(token, { kind, value }));
    }
    onCloseDocumentViewPopup(token) {
        this.store.dispatch(new CloseDocumentViewPopup(token));
    }
    getColumnDef(token) {
        return this.store.select(getFileHistoryColumnDefByToken(token));
    }
    getCurrentGridData(token) {
        return this.store.select(getFileHistoryGridDataByToken(token));
    }
    getCheckedItems(token) {
        return this.store.select(getSelectedAttachmentsByToken(token));
    }
    getDocumentViewOpened(token) {
        return this.store.select(getDocumentViewOpenedByToken(token));
    }
    getDocumentViewPopupOpened(token) {
        return this.store.select(getDocumentViewPopupOpenedByToken(token));
    }
    getSearchText(token) {
        return this.store.select(getFileHistorySearchTextByToken(token));
    }

    getPageEventByToken(token) {
        return this.store.select(getFileHistoryPageEventByToken(token));
    }
    getGroupModeByToken(token) {
        return this.store.select(getGroupModeByToken(token));
    }

    getFolderListByToken(token) {
        return this.store.select(getFolderListByToken(token));
    }
    agetUser() {
        return this.store.select(getUser);
    }
    requestSignToken(token: string, row: FileItemWrapper, data: { password: string;  needPasswordHash?: boolean; passwordHash?: string }) {
        this.store.dispatch(new GetSignatureToken(token, { row: row, password: data.password, needPasswordHash: data.needPasswordHash, passwordHash: data.passwordHash }));
    }
    getSignAndSendIsLoading(token) {
        return this.store.select(getSignandSendIsLoadingByToken(token));
    }
    getSignandSendToken(token) {
        return this.store.select(getSignTokenByToken(token));
    }
    getXdraftViewSuccess(token) {
        return this.store.select(getXdraftViewSuccessByToken(token));
    }
}
