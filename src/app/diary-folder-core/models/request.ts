import { DiaryFolderWrapper, ColumnFolder, FolderFlatNode } from './interfaces';

export class ColumnFolderRequest {
    constructor(private appId: number, private folders: FolderFlatNode[]) { }

    public toPost() {
        return {
            caseFileIdentityWithAppIdViewModels: { appId: this.appId },
            columnFolderViewModels: this.folders.filter(val => val.folderId !== -1 || !val.isDeleted)
                .map<ColumnFolder>(val => ({
                    folderID: val.folderId,
                    appId: this.appId,
                    folderName: val.folderName,
                    isDefault: val.selected ? val.selected : false,
                    isDeleted: val.isDeleted ? val.isDeleted : false,
                    parentId: val.parentId,
                    position: val.position,
                }))
        };
    }

}
