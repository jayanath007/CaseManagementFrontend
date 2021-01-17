
import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { AppConfig } from '../../core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { FilterViewModel, FilterItem, DropdownListData } from '../models/interface';
import { SearchDocumentViewModel } from '../models/global-search-request';
import { Observable } from 'rxjs';
import { PaginatorDef } from '../../core/lib/grid-model';
import { FilterType } from '../models/enum';
import { MessageItemWrapper } from '../../mail-item-core';
import { GridRowItemWrapper, GridDocumentData } from '../../core/lib/matter';
import { InputData } from '../../email-list-core';
import { SubmitType } from '../../add-note-core/models/enumeration';
import { toODataFilter } from '../../core/lib/grid-helpers';
import { DatePipe } from '@angular/common';
import { FieldType } from '../../odata';



@Injectable()
export class GlobalDocumentSearchService {

    constructor(private http: HttpClient, private appConfig: AppConfig, private datePipe: DatePipe) { }


    public getFeeEarnerList(): Observable<DropdownListData[]> {
        return this.http.get<any>(this.appConfig.serviceBase + '/EChit/GetFeeEarner').pipe(
            map(response => response.data));
    }



    public getGlobalDocumentData(filterViewModel: FilterViewModel, paginatorDef: PaginatorDef, columnDef) {
        const columDefData = toODataFilter(columnDef);
        let filter = '';
        if (columDefData != null) {
            filter = filterViewModel.filterList[0].filterValue !== '' ? this.setFilterString(filterViewModel.filterList) : null;
            const x = columDefData.filters;
            // x.forEach(i => i.)

            columDefData.filters.forEach(f => {
                const condition1 = f.filters[0];
                const condition2 = f.filters[1];
                const logic = f.logic;

                // const filterval = condition1.fieldType === FilterType.ToDate ? row.filterValue : '\'' + row.filterValue + '\'';

                // const filtervalue = condition1.fieldType === FieldType.TextAfterBefore ?
                //     this.datePipe.transform(condition1.value, 'yyyy-MM-ddT00:00:00').toString() + 'Z'
                //      : '\'' + condition1.value.toString().toUpperCase() + '\'';
                const filtervalue = this.setfilterValue(condition1.fieldType, condition1.value);
                const condition1Filter = condition1.field +
                    ' ' + condition1.operator + ' ' + filtervalue;
                filter = filter ? filter + ' ' + logic + ' ' + condition1Filter : condition1Filter;

                if (condition2 != null) {
                    // const filtervalue1 = condition2.fieldType === FieldType.TextAfterBefore  ?
                    // this.datePipe.transform(condition2.value, 'yyyy-MM-ddT00:00:00').toString() + 'Z'
                    // : '\'' + condition2.value.toString().toUpperCase()  + '\'';
                    const filtervalue1 = this.setfilterValue(condition2.fieldType, condition2.value);
                    filter = filter + ' ' + logic + ' ' + condition2.field + ' ' + condition2.operator + ' ' + filtervalue1;



                }

            });


        } else {
            filter = filterViewModel.filterList[0].filterValue !== '' ? this.setFilterString(filterViewModel.filterList) : null;

        }
        const filterOptions: SearchDocumentViewModel = {
            Filter: filter,
            OrderBy: null,
            Skip: paginatorDef.itemPerPage * paginatorDef.currentPage,
            Top: paginatorDef.itemPerPage,
            searchText: filterViewModel.searchText ? filterViewModel.searchText : null,


        };

        return this.http.post<any>(this.appConfig.serviceBase + '/File/GlobalDocumentSearch', filterOptions).pipe(
            map((response) => response.data));
    }




    setFilterString(filterList: FilterItem[]) {
        if (filterList && filterList.length > 0) {

            let qurystring = '';
            filterList.forEach(row => {

                const filterval = row.filterType === FilterType.ToDate ? row.filterValue : '\'' + row.filterValue + '\'';
                qurystring = qurystring + ' ' + row.filterType + ' ' + row.operator + ' ' + filterval + ' ' + row.fieldOperator;

            });


            return qurystring;

        }

    }

    setfilterValue(fieldType, filtValue) {
        switch (fieldType) {
            case FieldType.TextAfterBefore:
                return this.datePipe.transform(filtValue, 'yyyy-MM-ddT00:00:00').toString() + 'Z';
            case FieldType.DropValue:
                return '\'' + filtValue + '\'';
            default:
                return '\'' + filtValue.toString().toUpperCase() + '\'';

        }


    }

    public getAppCodeList(): Observable<DropdownListData[]> {
        return this.http.get<any>(this.appConfig.serviceBase + '/Matters/GetAppCodeIDAndNameList').pipe(
            map(response => response.data));
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

    public getShareDataFromMatterRef(matterRef: string, diaryId: number, letterName: string, subjectNote: string) {
        return this.http.get<any>(this.appConfig.serviceBase
            + '/Matters/GetMatterBranchFileAppId?matterRef=' + matterRef).pipe(map(result => {
                const inputData: InputData = {
                    signTokens: null,
                    safeBoxFileList: null,
                    fileCredentials: [{ diaryId: diaryId, password: null, letterName }],
                    subjectNote,
                    submitType: SubmitType.Share,
                    url: null,
                    matterData: {
                        MatterReferenceNo: result.data.maT_Ref,
                        FileID: result.data.maT_FileID,
                        AppCode: result.data.maT_APCode,
                        AppID: result.data.maT_AppID,
                        BranchID: result.data.maT_BranchID,
                        ClientName: result.data.maT_Client_Name,
                        RateCategory: null,
                        FeeEarner: null,
                        eBilling: result.data.eBilling,
                        isPlotMasterMatter: result.data.isPlotMasterMatter,
                        isProspectMatter: result.data.isProspectMatter,
                        isLegalAid: result.data.isLegalAid
                    }
                };

                return inputData;

            }

            ));
    }

}
