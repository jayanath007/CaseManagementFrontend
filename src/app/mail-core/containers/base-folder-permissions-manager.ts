import { Store } from '@ngrx/store';
import { MailFolder, User } from '../../core/lib/microsoft-graph';
import {
    GetFolderPermissionSet, SelectUserPermission, RemoveSelectedPermission,
    AddFolderPermission, ChangeFolderPermissionLevel, ChangeFolderPermissionValueByKey, SaveFolderPermissionSet
} from '../actions/folders';
import { getFolderPermissions } from '../reducers';
import { FolderPermissionUserId, FolderPermissions } from '../models/interfaces';
import { PermissionLevel } from '../models/enums';

export class BaseFolderPermissionsManager {
    folderPermissions$;
    constructor(protected store: Store<any>) {
    }
    initSelectors(selectedFolder: MailFolder) {
        this.folderPermissions$ = this.store.select(getFolderPermissions);
        this.store.dispatch(new GetFolderPermissionSet({ folderId: selectedFolder.id }));
    }
    onSelectUserPermission(userId: FolderPermissionUserId) {
        this.store.dispatch(new SelectUserPermission(userId));
    }
    onRemoveSelectedPermission() {
        this.store.dispatch(new RemoveSelectedPermission());
    }
    onAddPermission(user: User) {
        this.store.dispatch(new AddFolderPermission(user));
    }
    onPermissionLevelChange(level: PermissionLevel) {
        this.store.dispatch(new ChangeFolderPermissionLevel(level));
    }
    onValueChange(event) {
        this.store.dispatch(new ChangeFolderPermissionValueByKey(event));
    }
    onSaveFolderPermissions(pernisions: FolderPermissions) {
        this.store.dispatch(new SaveFolderPermissionSet(pernisions));
    }
}
