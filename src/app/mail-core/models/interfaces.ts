
import { MailFolder, User, GroupAccessType, ConversationThread, Post, Message, Attachment } from '../../core/lib/microsoft-graph';
import { SerchDateTypes, PermissionLevel, ReadItems, EditDeleteItems } from './enums';
import { FolderEditMode } from '../../core/organizer/enums';

export interface MailBox extends User {
    init: boolean;
    expanded: boolean;
    loading: boolean;
}
export interface FolderListItem<APIObject> {
    data: APIObject;
    loading: boolean;
    selected: boolean;
    visible: boolean;
    expanded: boolean;
    hierarchy: string;
    editMode?: FolderEditMode;
    editLabel?: string;
    owner: string;
}

export interface SearchOptions {
    readonly folderId: string;
    readonly searchText: string;
    readonly isAllFolders: boolean;
    readonly hasAttachment: boolean;
    readonly from: string;
    readonly dateType: SerchDateTypes;
    readonly dateFrom: string;
    readonly dateTo: string;
}

export interface FolderPermissions {
    readonly folderId: { id: string, changeKey: string };
    readonly permissionSet: FolderPermission[];
}
export interface FolderPermission {
    userId: FolderPermissionUserId;
    permissionLevel: PermissionLevel;
    editItems: EditDeleteItems;
    deleteItems: EditDeleteItems;
    readItems: ReadItems;
    canCreateItems: boolean;
    canCreateSubFolders: boolean;
    isFolderOwner: boolean;
    isFolderVisible: boolean;
    isFolderContact: boolean;
    isSelected: boolean;
}
export interface FolderPermissionUserId {
    userId: string;
    userDisplayName: string;
}
export interface GroupItem {
    readonly id: string;
    readonly accessType: GroupAccessType;
    readonly isFavorite: boolean;
    readonly displayName: string;
    readonly EmailAddress: string;
    readonly LastVisitedDateTime: string;
}
export interface GroupListItem {

    readonly selected: boolean;
    readonly data: GroupItem;
    readonly members: User[];
    readonly owners: User[];
}
export interface ConversationListItem {

    readonly selected: boolean;
    readonly data: ConversationThread;
    readonly posts?: Post[];
}
// export interface PostReplyAll {

//     readonly postId: string;
//     readonly data: Message;
//     readonly body: string;
//     readonly attachment: Attachment[];
// }

export type FolderItemWrapper = FolderListItem<Readonly<MailFolder>>;

