import { FileUrlResolverService } from './../../document-view/services/file-url-resolver.service';

import { filter, map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { AppConfig } from '../../core';
import { HttpClient } from '@angular/common/http';
import {
    LoginUser, GridRowData, GridResponceBody, GridDataFilter, GroupResponceBody,
    AddTeamTalkDiaryViewModel, DocPathValidateViewModel, TeamTalkTemplateUrlViewModel,
    TeamTalkCheckInViewModel, DictationJobModel, ProfilingRequestModel
} from '../models/interface';
import { Observable } from 'rxjs';
import { DatePipe } from '@angular/common';
import { JobFolderType, UserType } from '../models/enum';
import { centerToWindow } from '../../utils/bounds';
import { uuid } from '../../utils/uuid';
import { WindowPopupsManagerService } from '../../document-view/services/window-popups-manager.service';
import { PaginatorDef } from '../../core/lib/grid-model';
import { getPaginatorSkip } from '../../core/lib/grid-helpers';
import { AzureStorageService } from '../../azure-storage';
import { GridRowItemWrapper } from '../../core/lib/matter';



@Injectable()
export class DictationService {

    constructor(private http: HttpClient, private appConfig: AppConfig, private datePipe: DatePipe,
        private fileUrlResolverService: FileUrlResolverService, private windowPopupsManagerService: WindowPopupsManagerService,
        private azureStorageService: AzureStorageService) { }



    public getTeamTalkUser() {
        // const request = {
        //     dpsUserLogin: user     // user,
        // };
        return this.http.get<{ body: LoginUser }>(`${this.appConfig.apiv3TeamTalkApi}/TeamTalk/GetTeamTalkUser`,
        ).pipe(map(responce => responce.body));
        // return this.http.post<{ body: LoginUser }>(`${this.appConfig.apiv3TeamTalkApi}/TeamTalk/GetTeamTalkUser/`,
        //     { body: request }).pipe(map(responce => responce.body));
    }

    public getTeamTalkGridDataBySecretaryGroup(gridFilters: GridDataFilter, groupId: number) {
        const request = {
            groupId: gridFilters.jobFor.id,
            jobStatus: gridFilters.jobStage.key,
            upToDate: '2018-08-09T17:24:25.737'
        };
        return this.http.post<{ body: GridResponceBody }>(`${this.appConfig.apiv3TeamTalkApi}/TeamTalk/GetSecretaryGroupJobs/`,
            { body: request }).pipe(map(responce => responce.body));
    }
    // cod reviw old
    public getTeamTalkGridDataBySecretary(gridFilters: GridDataFilter, userId: number) {
        const request = {
            userId: userId,
            jobStatus: gridFilters.jobStage.key,
            upToDate: '2018-08-09T17:24:25.737'
        };
        return this.http.post<{ body: GridResponceBody }>(`${this.appConfig.apiv3TeamTalkApi}/TeamTalk/GetSecretaryJobs`,
            { body: request }).pipe(map(responce => responce.body));
    }

    public getTeamTalkGridDataBySecretaryNew(gridFilters: GridDataFilter, userType: LoginUser, paginatorDef: PaginatorDef) {

        const fields = 'jobs,statistics';
        return this.http.get<{ body: any }>
            (`${this.appConfig.apiv3TeamTalkApi}/TeamTalk/GetSecretaryJobs?fields=${fields}
        &userId=${userType.id}&jobStatus=${gridFilters.jobStage.key}
        &groupId=${gridFilters.jobFor.id}&level=${userType.level}&take=${paginatorDef.itemPerPage}&skip=${getPaginatorSkip(paginatorDef)}`)
            .pipe(map(responce => responce.body));
    }

    public getTeamTalkGridDataByAuthorNew(gridFilters: GridDataFilter, userType: LoginUser, paginatorDef: PaginatorDef) {
        const userId = userType && userType.level === UserType.manager
            ? gridFilters.jobFor.id : userType.id;
        const fields = 'jobs,statistics';
        return this.http.get<{ body: any }>
            (`${this.appConfig.apiv3TeamTalkApi}/TeamTalk/GetAuthorJobs?fields=${fields}
        &userId=${userId}&jobStatus=${gridFilters.jobStage.key}
    &groupId=${0}&isGetOtherJobs=${true}&level=${userType.level}&take=${paginatorDef.itemPerPage}&skip=${getPaginatorSkip(paginatorDef)}`)
            .pipe(map(responce => responce.body));
    }

    public getDicatationFileDownloadTransferToken(jobId) {

        return this.http.get<{ body: any }>
            (`${this.appConfig.apiv3TeamTalkApi}/TeamTalkTransferToken/GetDicatationFileDownloadTransferToken?jobId=${jobId}`)
            .pipe(map(responce => responce.body));
    }


    public getTeamTalkGridDataByAuthor(gridFilters: GridDataFilter, userId: number) {
        const request = {
            userId: userId,
            jobStatus: gridFilters.jobStage.key,
            upToDate: '2018-08-09T17:24:25.737'
        };
        return this.http.post<{ body: GridResponceBody }>(`${this.appConfig.apiv3TeamTalkApi}/TeamTalk/GetAuthorJobs/`,
            { body: request }).pipe(map(responce => responce.body));
    }



    public getTeamTalkGroups(id: number) {
        const request = {
            userId: id
        };
        return this.http.post<{ body: GroupResponceBody }>(`${this.appConfig.apiv3TeamTalkApi}/TeamTalk/GetGroupListByUserId/`,
            { body: request }).pipe(map(responce => responce.body));
    }
    public getTeamTalkAuthors() {

        return this.http.post<{ body: any }>(`${this.appConfig.apiv3TeamTalkApi}/TeamTalk/GetTeamTalkAuthors/`, { body: null })
            .pipe(map(responce => responce.body));
    }


    public dictationFinishJobFunctions(jobId: number, status: JobFolderType) {
        const request = {
            jobId: jobId,
            status: status
        };
        return this.http.post<{ body: any }>(`${this.appConfig.apiv3TeamTalkApi}/TeamTalk/UpdateJobStatus/`,
            { body: request }).pipe(map(responce => responce.body));
    }

    public dictationJobStatusCounts(userId: number, level: number) {
        const request = {
            userId: userId,
            level: level,
            upToDate: '2018-08-09T17:24:25.737'
        };
        return this.http.post<{ body: any }>(`${this.appConfig.apiv3TeamTalkApi}/TeamTalk/GetJobStatusCountByUser/`,
            { body: request }).pipe(map(responce => responce.body));
    }


    public dictationJobStatusCountsByGroup(groupId: number) {
        const request = {
            groupId: groupId,
            upToDate: '2018-08-09T17:24:25.737'
        };
        return this.http.post<{ body: any }>(`${this.appConfig.apiv3TeamTalkApi}/TeamTalk/GetJobStatusCountByGroup/`,
            { body: request }).pipe(map(responce => responce.body));
    }


    public addTeamTalkDiaryRecord(itemRow: GridRowData, userId: number) {
        const request: AddTeamTalkDiaryViewModel = {
            jobId: itemRow.id,
            userId: userId,
            length: itemRow.length,
            urgentValue: itemRow.urgentValue,
            fileName: itemRow.fileName,
            jobDescription: itemRow.comment,
            jobName: itemRow.matterRef,
            secFor: itemRow.secFor,
            groupForString: null,
            privateJob: false,
            privatePassword: null,
            matterRef: itemRow.matterRef,
            isDPSTask: false,
            noteForTask: null,
            feeEarner: itemRow.feeEarner,
            dueDate: itemRow.dueDate,
            dPSDueDate: itemRow.dueDate,
            sentTime: itemRow.sentTime,
            jobSource: 1,
            appId: itemRow.appId ? itemRow.appId : 0,
            fileId: itemRow.dpsFileID,
            branchId: itemRow.dpsBranchId,
            dPSBranchId: itemRow.dpsBranchId,
            dPSFileID: itemRow.dpsFileID,
            dPSAppPrefix: itemRow.dpsAppPrefix,

        };

        return this.http.post<any>(this.appConfig.serviceBase + '/dictation/AddTeamTalkDiaryRecord', request).pipe(
            map(response => response.data));
    }


    // public teamTalkCheckInFile(checkoutData: TeamTalkCheckOutDocResponce) {

    //     const request: CheckInFileBaseViewModel = {
    //         hashKey: checkoutData.hashKey ? checkoutData.hashKey : null,
    //         fileManagerType: FileManagerType.TeamTalkTemplateManager,

    //     };
    //     return this.http.post<any>(this.appConfig.serviceBase + '/Drive/CheckInFile', request).pipe(
    //         map(response => response.data));
    // }


    public teamTalkCheckInFile(hashKey: string, jobId: number) {

        const request: TeamTalkCheckInViewModel = {
            hashKey: hashKey,
            jobId: jobId,

        };
        return this.http.post<any>(this.appConfig.serviceBase + '/Drive/CheckInTeamTalkFile', request).pipe(
            map(response => response.data));
    }


    public validateTeamTalkDocPath(itemRow: GridRowData, userType: LoginUser) {

        const request: DocPathValidateViewModel = {
            jobId: itemRow.id,
            userId: userType.id,

        };
        return this.http.post<any>(this.appConfig.serviceBase + '/dictation/ValidateTeamTalkDocPath', request).pipe(
            map(response => response.data));
    }


    public teamTalkCheckoutTemplate(request: TeamTalkTemplateUrlViewModel) {

        return this.http.post<any>(this.appConfig.serviceBase + '/drive/CheckOutTeamTalkTemplate ', request).pipe(
            map(response => response.data));
    }

    public getMatterRef(data: GridRowData) {


        return this.http.get<{ data: any }>
            (`${this.appConfig.serviceBase}/Matters/GetMatterByFileInformation?AppCode=${data.dpsAppPrefix
                }&BranchId=${data.dpsBranchId}&FileId=${data.dpsFileID}`)
            .pipe(map(responce => responce.data));


    }




    public getDictationAudioUrl(jobId: number): Observable<string> {
        return this.http.post<any>(this.appConfig.serviceBase + '/dictation/GetDicatationUrlsAsync', { jobId }).pipe(
            map(response => response.data));
    }

    // public getDictationPDF(jobId: number) {
    //     return this.http.get<any>
    //         (`${this.appConfig.serviceBase}/dictation/GetTeamTalkFile?jobId=${jobId}`).pipe(
    //             map(responce => responce.data)
    //         );


    //  }

    // public getDictationPDF(jobId: number) {
    //     return this.http.get<{ data: any }>
    //         (`${this.appConfig.serviceBase}/dictation/GetTeamTalkFile/${jobId}`).pipe(
    //             map(responce => responce.data)
    //         );
    // }

    public getDictationPDF(jobId: number) {
        return this.fileUrlResolverService.getTeamTalkPDFUrl(jobId).pipe(map((data) => {

            console.log(data);
            const spec = {
                ...centerToWindow(800, 600),
                toolbar: false,
                location: false,
                directories: false,
                status: false,
                menubar: false,
                scrollbars: false,
            };
            this.windowPopupsManagerService.openWindow(uuid(), data, spec, 'pdf');

            return true;
        }));
    }


    public getUploadJobId(user: LoginUser) {
        const jobRecordRequest: DictationJobModel = {
            userId: user.id,
            fileName: null,
            jobName: 'Imported by USER',
            jobDescription: 'Imported',
            sentTime: this.datePipe.transform(new Date(), 'dd/MM/yyyy HH:mm:ss'),
            dueDate: this.datePipe.transform(new Date(), 'dd/MM/yyyy HH:mm:ss'), // need date
            secFor: 0,
            urgentValue: 1,

        };

        return this.http.post<any>(this.appConfig.serviceBase + '/dictation/SaveJob', jobRecordRequest).pipe(
            map(response => response.data));
    }

    // public getJobStage(): Observable<DropdownListData[]> {
    //     return this.http.get<any>(this.appConfig.serviceBase + '/EChit/GetFeeEarner').pipe(
    //         map(response => response.data));


    // }


    public uploadFile(jobId: number, file: File) {
        const url = `${this.appConfig.apiv3TeamTalkApi}/Dictation/${jobId}/UploadToken?fileFormat=${file.name.split('.').pop()}`;
        return this.azureStorageService.requestSasTokenWithStorage(url, 'get')
            .uploadLocalFile(file).pipe(
                filter(itemUpload => itemUpload.progress >= 100),
                map(itemUpload => itemUpload)
            );
    }

    public dictationFileConvertion(jobId: number, sourceFileFormat: string) {
        return this.http.get(
            `${this.appConfig.serviceBase}/dictation/ConvertAudioFile?jobId=${jobId}&sourceFileFormat=${sourceFileFormat}`)
            .pipe(map(responce => responce));
    }


    public getSecretaryByGroup(userCategory) {

        return this.http.get
            (`${this.appConfig.serviceBase}/dictation/getSecretaryBySelectedGroup?userCategory=${userCategory}`)
            .pipe(map(responce => responce));
    }

    public getGroupListById(userId) {

        return this.http.get
            (`${this.appConfig.serviceBase}/dictation/getGroupListByUserId?userId=${userId}`)
            .pipe(map(responce => responce));
    }



    public submitProfile(itemRow: ProfilingRequestModel) {
        const jobRecordRequest: any = {
            jobId: itemRow.jobInfo.id,
            jobName: itemRow.jobName,
            jobDescription: itemRow.jobDescription,
            dueDate: itemRow.dueDate ? this.datePipe.transform(itemRow.dueDate, 'dd/MM/yyyy HH:mm:ss') : itemRow.jobInfo.dueDate,
            urgentValue: itemRow.urgency ? itemRow.urgency : itemRow.jobInfo.urgentValue,
            secFor: itemRow.secFor ? itemRow.secFor : itemRow.jobInfo.secFor,
            groupFor: itemRow.groupFor ? itemRow.groupFor : 0,
            privateJob: itemRow.privateJob ? itemRow.privateJob : false,
            secretary: 0,
            privatePassword: itemRow.password ? itemRow.password : null,
            isDPSVarsAvailable: itemRow.matterDetails ? true : false,
            dPSBranchId: itemRow.matterDetails ? itemRow.matterDetails.branchId : null,
            dPSFileID: itemRow.matterDetails ? itemRow.matterDetails.fileId : null,
            dPSAppPrefix: itemRow.matterDetails ? itemRow.matterDetails.appCode : null,
        };

        return this.http.post<any>(this.appConfig.serviceBase + '/dictation/UpdateJob', jobRecordRequest).pipe(
            map(response => response.data));

    }



    public JobdescriptionList(userId) {

        return this.http.get
            (`${this.appConfig.serviceBase}/dictation/getJobdescriptionList`)
            .pipe(map(responce => responce));
    }

    public getOpenCaseMaterDataFromMatterRef(matterRef: string) {
        return this.http.get<any>(this.appConfig.serviceBase
            + '/Matters/GetMatterBranchFileAppId?matterRef=' + matterRef).pipe(map(result => {
                const materData: GridRowItemWrapper = {
                    data: {
                        appID: result.data.maT_AppID,
                        fileID: result.data.maT_FileID,
                        app_Code: result.data.maT_APCode,
                        branchID: result.data.maT_BranchID,
                        feeEarner: result.data.maT_Fee_Earner,
                        reviewDate: result.data.maT_Start_Date,
                        clientName: result.data.maT_Client_Name,
                        reviewNote: result.data.maT_Details,
                        company_Name: '',
                        matterDetails: result.data.maT_Details,
                        matterReferenceNo: result.data.maT_Ref,
                        matterCounter: result.data.maT_Counter,
                        ufnValue: result.data.maT_UFN,
                        eBilling: result.data.eBilling,
                        isPlotMatter: result.data.isPlotMatter,
                        isPlotMasterMatter: result.data.isPlotMasterMatter,
                        isProspectMatter: result.data.isProspectMatter,
                        isLegalAid: result.data.isLegalAid
                    }
                };
                return materData;
            }

            ));
    }




}

