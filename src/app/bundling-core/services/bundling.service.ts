import { Injectable, Inject } from '@angular/core';
import { AppConfig } from '../../core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { GridRequest, BundleValidatorViewModel } from '../models/bundling-request';
import {
    GridDataObjectResponse,
    BundlingSaveDataModel,
    BundleOption,
    BundlingValidationResponce,
    FromToDateObject
} from '../models/interface';
import { MessageItemWrapper } from '../../mail-item-core';
import { DocumentLink } from '../../document-view/models/interfaces';
import { MatterSearchGridData } from '../../core/lib/matter';
import { PDFBundleHeaderViewModel } from '../../core/lib/bundle';
import { map } from 'rxjs/operators';
import { IS_GOOGLE } from '../../shared';
import { dpsNewDate } from '../../utils/javascriptDate';


@Injectable()
export class BundlingService {

    constructor(private http: HttpClient,
        private httpClient: HttpClient, private appConfig: AppConfig,
        @Inject(IS_GOOGLE) public isGoogle: boolean) { }

    public getGridData(request: GridRequest) {
        return this.http.post<GridDataObjectResponse>(this.appConfig.serviceBase +
            '/PDFBundle/GetBundleDocumentsForSpecificMatter', request.GridRequestToPost()).pipe(
                map((response) => response.data));
    }

    // Bundling data saveF
    public saveBundleData(bundlingSaveModel: BundlingSaveDataModel, matterInfo: MatterSearchGridData,
        optionPopupData: BundleOption, bundleNameText: string, fromToDateObject: FromToDateObject, IsSendToBundle: boolean,
        timeOffset: number
    ) {
        let bundleId = bundlingSaveModel.PDFBundleHeaderViewModel.pbH_BundleID;
        const headerItem: PDFBundleHeaderViewModel = bundlingSaveModel ? bundlingSaveModel.PDFBundleHeaderViewModel : null;
        let newBundleNameText = '';
        if (bundleNameText !== headerItem.pbH_Name) {
            bundleId = 0;
        }
        if (bundleNameText) {
            newBundleNameText = bundleNameText;
        } else {
            newBundleNameText = optionPopupData ? optionPopupData.name : '';
        }


        const pDFBundleHeader: PDFBundleHeaderViewModel = {
            pbH_BundleID: bundleId ? bundleId : 0,
            pbH_MatterRef: matterInfo.matterReferenceNo,
            pbH_CreatedDate: headerItem.pbH_CreatedDate,
            pbH_TotalDocuments: bundlingSaveModel ? bundlingSaveModel.PDFBundleTreeItemViewModel.length : 0,
            pbH_QueuePosition: headerItem.pbH_QueuePosition,
            pbH_Name: newBundleNameText,
            pbH_DateFrom: fromToDateObject ? fromToDateObject.fromDate : dpsNewDate(timeOffset).toString(),
            pbH_DateTo: fromToDateObject ? fromToDateObject.toDate : dpsNewDate(timeOffset).toString(),
            pbH_BranchID: matterInfo.branchID,
            pbH_AppID: matterInfo.appID,
            pbH_FileID: matterInfo.fileID,
            pbH_CreateUser: headerItem.pbH_CreateUser,
            pbH_Version: headerItem.pbH_Version,
            pbH_LastSubmitUser: headerItem.pbH_LastSubmitUser,
            pbH_LastSubmitDate: headerItem.pbH_LastSubmitDate,
            pbH_LastModifiedDate: headerItem.pbH_LastModifiedDate,
            pbH_OwnerEmail: headerItem.pbH_OwnerEmail,
            pbH_Status: headerItem.pbH_Status,
            pbH_ProgressComplete: headerItem.pbH_ProgressComplete,
            pbH_ProgressText: headerItem.pbH_ProgressText,
            pbH_ProcessStartDate: headerItem.pbH_ProcessStartDate,
            pbH_ProcessEndDate: headerItem.pbH_ProcessEndDate,
            pbH_LogPath: headerItem.pbH_LogPath,

            pbH_OptionsStopOnError: optionPopupData.stopMergeIfError,
            pbH_OptionsIncludeTitlePage: optionPopupData.includeTitlePage,

            pbH_OptionIndexWithPageNum: optionPopupData.createIndexPage, // optionIndexWithPageNum,
            pbH_OptionsPrefixIndexWithDate: headerItem.pbH_OptionsPrefixIndexWithDate, // OptionsPrefixIndexWithDate,
            pbH_OptionsKeepTitleOnFirstPage: headerItem.pbH_OptionsKeepTitleOnFirstPage,
            pbH_OptionsIncludeEmailAttachments: optionPopupData.separateEmail,
            pbH_OptionsDocumentPageNumType: headerItem.pbH_OptionsDocumentPageNumType,
            pbH_OptionsFrontPageFilePath: headerItem.pbH_OptionsFrontPageFilePath,
            pbH_OptionsDocumentPageNumFormat: headerItem.pbH_OptionsDocumentPageNumFormat,

            pbH_BundleHost: headerItem.pbH_BundleHost,
            pbH_OptionsPreservePagination: optionPopupData.preserveExitPage,
            pbH_IsCoreBundle: headerItem.pbH_IsCoreBundle,
            pbH_ParentBundleID: headerItem.pbH_ParentBundleID,
            pbH_IndexFormattingProfile: headerItem.pbH_IndexFormattingProfile,

            OptionsShowIndexWithDate: optionPopupData.showDocDate,
            OptionsDocumentPageNumLocation: optionPopupData.pageNumberLocation,
            OptionsPreservePagination: optionPopupData.preserveExitPage,

            ChkRestartPageNumberAtSection: optionPopupData.restartPageNoAtSection
        };

        return this.http.post<any>(this.appConfig.serviceBase + '/PDFBundle/SaveBundleData',
            {
                PDFBundleHeader: pDFBundleHeader,
                PDFBundleItem: bundlingSaveModel ? bundlingSaveModel.PDFBundleTreeItemViewModel : null,
                IsSendToBundle: IsSendToBundle
            }).pipe(
                map(response => response.data));
    }

    public uploadCoverPage(data) {
        return this.http.post<any>(this.appConfig.serviceBase + '/PDFBundle/SaveCoverPageAttachment', data).pipe(
            map(response => response.data));
    }
    public getSaveBundleList(bundleID) {
        return this.http.get<any>(this.appConfig.serviceBase + '/PDFBundle/GetBundleItems?bundleID=' + bundleID).pipe(
            map(response => response.data));
    }
    public validateItems(request: BundleValidatorViewModel) {
        return this.http.post<BundlingValidationResponce>
            (`${this.appConfig.serviceBase}/PDFBundle/ValidatePdfBundleItem`,
                request.GridToPost()).pipe(
                    map(responce => responce));
    }
}

