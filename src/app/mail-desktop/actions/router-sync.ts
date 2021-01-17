import { Action } from '@ngrx/store';
export const MAIL_FOLDER_ROUTE_CHANGE = 'DPS_MAIL_FOLDER_ROUTE_CHANGE';

export class FolderRouteChange implements Action {
    readonly type = MAIL_FOLDER_ROUTE_CHANGE;
    constructor(public folderId: string) {}
}
