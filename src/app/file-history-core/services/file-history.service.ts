import { map } from 'rxjs/operators';
import { FileHistoryRequest, DocumentURLRequest, LoadFileHistoryGridDataByGroupRequest } from '../models/file-history-request';
import {
    FileHistoryResponse, DocumentUrlResponse, GroupMode,
    FolderListResponce,
    FileHistoryGroupDataResponse,
    SignatureTokenResponce,
} from '../models/interface';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { InforDialogData, InforDialogComponent, SemaphoresService } from '../../shared';
import { MatDialog } from '@angular/material';
import { AppConfig, MsgraphClientBase, ApiClientWrapper } from '../../core';
import { ServiceEndpointConfig } from '../../core/configs/service-configs';
import { Observable } from 'rxjs';
import { AuthInfoStateService } from '../../auth';
import { DatePipe } from '@angular/common';
import { GroupFilter, getGridGroupFilters } from '../../core/lib/grid-helpers';
import { FieldType } from '../../odata';
import { dpsNewDate } from '../../utils/javascriptDate';

@Injectable()
export class FileHistoryService {

    private msGraphClient: MsgraphClientBase = null;

    constructor(private httpClient: HttpClient, protected authInfo: AuthInfoStateService, private appConfig: AppConfig,
        private configs: ServiceEndpointConfig, private dialog: MatDialog, private datePipe: DatePipe,
        private semaphoresService: SemaphoresService) {
    }

    public getAuthClient<T>(): Observable<ApiClientWrapper<T>> {
        if (!this.msGraphClient) {
            this.msGraphClient = new MsgraphClientBase(this.authInfo, this.httpClient, this.configs.getGraphApiConfig());
        }
        return this.msGraphClient.getAuthClient(this.semaphoresService.getMsgraphSemaphoree());
    }

    public getFilehistory(request: FileHistoryRequest) {
        return this.httpClient.post<FileHistoryResponse>(this.appConfig.serviceBase + '/File/GetDocumentHistories', request.toPost());
    }


    public getFolders(appId: number) {
        return this.httpClient.get<FolderListResponce>(this.appConfig.serviceBase + '/Diary/GetFoldersAsync?appId=' + appId).pipe(
            map(responce => responce.data));
    }

    public getFileHistoryByGroup(request: LoadFileHistoryGridDataByGroupRequest) {


        const groupFilters: GroupFilter[] = [];

        if (request.row.groupMode === GroupMode.Folder) {
            groupFilters.push({ filterValue: request.row.groupIds.group1, fieldName: 'FolderName', fieldType: FieldType.Text });
        } else if (request.row.groupMode === GroupMode.Date) {
            groupFilters.push({ filterValue: request.row.groupIds.group1, fieldName: 'dateDone', fieldType: FieldType.Date });

        } else if (request.row.groupMode === GroupMode.Note) {
            groupFilters.push({ filterValue: request.row.groupIds.group1, fieldName: 'note', fieldType: FieldType.Date });

        } else if (request.row.groupMode === GroupMode.Type) {
            groupFilters.push({ filterValue: request.row.groupIds.group1, fieldName: 'type', fieldType: FieldType.Date });

        }
        else if (request.row.groupMode === GroupMode.DateFolder) {
            groupFilters.push({ filterValue: request.row.groupIds.group1, fieldName: 'dateDone', fieldType: FieldType.Date });
            groupFilters.push({ filterValue: request.row.groupIds.group2, fieldName: 'FolderName', fieldType: FieldType.Text });

        } else if (request.row.groupMode === GroupMode.FolderDate) {
            groupFilters.push({ filterValue: request.row.groupIds.group1, fieldName: 'FolderName', fieldType: FieldType.Text });
            groupFilters.push({ filterValue: request.row.groupIds.group2, fieldName: 'dateDone', fieldType: FieldType.Date });
        }

        request.dataSourceInfo.filter = getGridGroupFilters(groupFilters);
        // request.dataSourceInfo.take = 0;
        return this.httpClient.post<any>(this.appConfig.serviceBase + '/File/GetDocumentHistories', request.toPost());



    }


    getFilterArrayForDateFields(filtersValue, value): Array<any> {
        const filters = [];
        const filtersValues = filtersValue.split('$');

        if (value === 'Others') {

            filters.push({
                field: 'dateDone',
                operator: 'lte',
                value: filtersValue
            });

        } else {
            filters.push({
                field: 'dateDone',
                operator: 'gte',
                value: filtersValues[0]
            });

            filters.push({
                field: 'dateDone',
                operator: 'lte',
                value: filtersValues[1]
            });
        }

        return filters;

    }

    public getFilehistoryGroup(request: FileHistoryRequest, groupMode: GroupMode) {

        if (groupMode === GroupMode.Folder) {
            request.dataSourceInfo.group = [
                {
                    field: 'FolderName',
                }
            ];
        } else if (groupMode === GroupMode.Date) {
            request.dataSourceInfo.group = [
                {
                    field: 'DateGroup',
                    dir: 'desc'
                }
            ];
        } else if (groupMode === GroupMode.Note) {
            request.dataSourceInfo.group = [
                {
                    field: 'Note',
                    dir: 'desc'
                }
            ];
        } else if (groupMode === GroupMode.Type) {
            request.dataSourceInfo.group = [
                {
                    field: 'Type',
                    dir: 'desc'
                }
            ];
        } else if (groupMode === GroupMode.FolderDate) {
            request.dataSourceInfo.group = [
                {
                    field: 'FolderName',
                }, {
                    field: 'DateGroup',
                    dir: 'desc'
                }
            ];
        } else if (groupMode === GroupMode.DateFolder) {
            request.dataSourceInfo.group = [
                {
                    field: 'DateGroup',
                    dir: 'desc'
                }, {
                    field: 'FolderName',
                }
            ];
        }
        request.dataSourceInfo.take = 0;
        return this.httpClient.post<{ data: { group: FileHistoryGroupDataResponse[] } }>
            (this.appConfig.serviceBase + '/File/GetDocumentHistories', request.toPost()).pipe(
                map(value => value.data.group)
            );
    }

    public getDocumentUrl(request: DocumentURLRequest) {
        return this.httpClient.get<DocumentUrlResponse>('assets/DocumentUrl.json');
    }

    public deleteDiaryRecords(diaryIds: number[]) {
        return this.httpClient.delete(`${this.appConfig.apiv3DiaryApi}/Diary/Delete`,
            { body: { body: { diaryIds } } } as any);
    }

    public getFilehistoryFilter(serchText: string) {

    }

    public checkPassword(diaryUID: string, password: string) {
        const params = new HttpParams({
            fromObject: {
                diaryId: diaryUID,
                password: password,
            }
        });
        return this.httpClient.get<any>(`${this.appConfig.serviceBase}/File/ValidateDiaryPassword`,
            { headers: new HttpHeaders().set('Accept', 'application/json'), params: params, }).pipe(
                map(response => response));
    }




    public passwordInvalid() {
        const dialogData: InforDialogData = {
            content: {
                title: 'Password Validation',
                message: 'Your password is invalid'
            },
            contentParams: {},
            data: { messageType: 'warning' }
        };

        const dialogRef = this.dialog.open(InforDialogComponent, {
            data: dialogData,
            width: '350px',
            panelClass: 'dps-notification'
        });
    }
    public getSingToken(password: string, needPasswordHash: boolean, diaryId: number, passwordHash: string): Observable<SignatureTokenResponce> {
        return this.httpClient.post<{ data: SignatureTokenResponce }>(this.appConfig.serviceBase + '/File/GetSignatureTokenForFileWithDiaryEntry',
            {
                DiaryId: diaryId,
                SignaturePassword: password,
                NeedPasswordHash: needPasswordHash,
                passwordHash: passwordHash
            }).pipe(
                map(res => res.data));
    }
    shareDiaryItemOnSafebox(matterRef: string, diaryCred: { DiaryId: number, Password: string }[]) {
        return this.httpClient.post<any>(`${this.appConfig.serviceBase}/MailBox/ShareDiaryItemsViaSafeBox`,
            { MatterRef: matterRef, DPSFileCredentialList: diaryCred }).pipe(
                map(response => response));
    }
    getEmailLookupList(dataViewModel) {
        return this.httpClient.post<any>(this.appConfig.serviceBase + '/Contacts/GetEmailLookupList', dataViewModel).pipe(
            map(response => response.data));
    }
    public moveSelctedFolder(diaryId: number[], folderId: number) {

        const updateDiaryColumnFolderViewModel = {
            diaryId: diaryId,
            folderId: folderId
        };

        return this.httpClient.post<any>
            (this.appConfig.serviceBase + '/Diary/UpdateDiaryColumnFolder?', updateDiaryColumnFolderViewModel).pipe(
                map((response) => response.data));
    }
    public selectXdraftItem(itemKey: string, diaryId: number) {
        return this.httpClient.get<any>(this.appConfig.serviceBase + '/Diary/SetupXDraft?itemKey=' + itemKey + '&diaryId=' + diaryId).pipe(
            map(res => res.data));
    }
    public getDiaryEditItemType(diaryId: number,
        fileId: number,
        appId: number,
        branchId: number) {
        return this.httpClient.get<any>(this.appConfig.serviceBase + '/Diary/GetDiaryEditItemType?fileId='
            + fileId
            + '&diaryId=' + diaryId
            + '&appId=' + appId
            + '&branchId=' + branchId).pipe(
                map(res => res.data));
    }
    public getFloatingTimeEntryInfo(diaryId: number) {
        return this.httpClient.get<any>(this.appConfig.serviceBase + '/File/GetFloatingTimeEntryInfo?diaryId=' + diaryId).pipe(
            map(res => res.data));
    }
    public XdraftItemSubmit(itemKey: string, diaryId: number, note: string, dateTimeOffset: number) {

        const date = this.datePipe.transform(dpsNewDate(dateTimeOffset), 'yyyy-MM-dd HH:mm');
        return this.httpClient.get<any>(this.appConfig.serviceBase + '/Diary/GetXDraftDocument?itemKey=' + itemKey +
            '&diaryId=' + diaryId + '&note=' + encodeURIComponent(note) + '&date=' + date).pipe(
                map((response) => response.data));
    }

}
