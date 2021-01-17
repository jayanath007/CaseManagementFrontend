import { ChangeType, NotificationGroups } from './enums';

export interface ResourceData {
    '@odata.type': string;
    Id: string;
}

export interface OutlookNotification<T extends ResourceData> {
    '@odata.type': string;
    ChangeType: ChangeType;
    Id: string;
    Resource: string;
    ResourceData: T;
    SequenceNumber: number;
    SubscriptionExpirationDateTime: string;
    SubscriptionId: string;
    Group: NotificationGroups;
}

export interface MessageNotification extends ResourceData {
    IsDraft?: boolean;
    IsRead?: boolean;
    ParentFolderId?: string;
    Flag?: { FlagStatus: string };
}

export interface InboxMessageNotification extends MessageNotification {
    From: any;
    Subject: string;
    ReceivedDateTime: string;
    LastModifiedDateTime: string;
    BodyPreview: string;

}

export type GenericNotification = OutlookNotification<MessageNotification | InboxMessageNotification>;
