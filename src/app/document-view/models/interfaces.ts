import { Observable } from 'rxjs';
import { ScreenLogic } from '../../screen-desingner-core/models/screen-desingner-request';

export interface DocumentLink {
  url: string;
  hashKey: string;
  accessToken?: string; // depreicate
  accessTokenTTL?: string; // deprecated
}

export interface DiaryEntryFileInfo {
  diaryId: number;
  fileName?: string; // deprecated
  password?: string; // deprecated
}

export interface TempaltePathInfo {
  appId: number;
  fileName: string;
  response?: any;
  templateType?: ScreenLogic;
  isCommon?: boolean;
}

export interface DiaryEntryPathInfo {
  fileName: string;
  branchId: number;
  appId: number;
  fileId: number;
}

export interface IDocumentCheckin {
  fileManagerType: FileManagerType;
  url: string;
  hashKey: string;
  name: string;
  path: string;
}

export interface WindowSpec {
  height: number;
  width: number;
  left?: number;
  top?: number;
  menubar?: boolean;
  toolbar?: boolean;
  status?: boolean;
  location?: boolean;
  directories?: boolean;
  scrollbars?: boolean;
}

export interface DocumentViewPopupInput {
  signandSendToken: string;
  fileItem: any;
  title?: string;
  icon?: string;
  noSandBox?: boolean;
}

export interface GetPDFURL {
  branchId: number;
  appId: number;
  fileId: number;
  letterName: string;
  downloadable: boolean;
}

export interface MsgReplyResponse {
  from: string;
  displayTo: string;
  sent: string;
  toRecipients: { emailAddress: string, name: string }[];
  subject: string;
  ccRecipients: { emailAddress: string, name: string }[];
  itemId: { ewsId: string, id: string };
}

export enum FileManagerType {
  FileWithDiaryEntryManager = 'FileWithDiaryEntryManager',
  FileWithOutDiaryEntryManager = 'FileWithOutDiaryEntryManager',
  TemplateManager = 'TemplateManager',
  AttachmentOfMSGFileManager = 'AttachmentOfMSGFileManager',
  CommonTemplateManager = 'CommonTemplateManager',
  TeamTalkTemplateManager = 'TeamTalkTemplateManager'
}

export enum FileOpenType {
  View = 'View',
  Edit = 'Edit'
}
