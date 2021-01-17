import { MenuGroups, RouterOutlets } from './enums';
import { Module } from '../../core/lib/app-settings';

export interface MainMenuItem<Data> {
    id: string;
    label: string;
    icon: string;
    group: MenuGroups;
    outlet: RouterOutlets;
    dispatch?: boolean;
    routerLink?: any;
    data?: Data;
    token?: string;
    hidden?: boolean;
    isSelected?: boolean;
    moduleId: Module;
    canAccess: boolean;
}

export interface DPSFileCredentialViewModel {
    DiaryId: number;
    Password: string;
}

export interface DPSFilesToMailAttachmentRequestViewModel {
    dpsFileCredentials: DPSFileCredentialViewModel[];
    htmlBody: string;
    matterRef: string;
    asPDF?: boolean;
    toRecipients?: Array<string>;
    ccRecipients?: Array<string>;
    appID: number;
    fileID: number;
    branchID: number;
}
