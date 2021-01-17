import {
    TeamTalkOpenDocumentFile, AttachedMatterForJob, DictationFinishJobFunctions,
    ChangeAuthor, ValidateTeamTalkDocPath, DictationComplete, OpenDictationPlayer, OpenDictationPDF, GetTeamTalkGridData, ChangePage, UploadDictationFile, DictationGridRefresh, InitDictationProfiling, SubmitProfiling,
    RowExpand,
    GetDictationOpenCaseData
} from './../actions/core';

import {
    getLoadingByToken, getDictationsColumnDefByToken, getUserTypeByToken, getDictationGridFilterByToken, getMatterRefByToken,
    getDictationGridDataByToken,
    getGroupListByToken,
    getDictationStateCountsByToken,
    getAuthorListByToken,
    getuserValidationMessageByToken,
    getGridPaginationDef, getProfileSecrarary, getprofileGroup, getProfileLoading, getProfileClose, getJobDescription
} from './../reducers/index';
import { Store } from '@ngrx/store';
import { createDefultColumnDef } from '../../core/lib/grid-helpers';
import { ColumnDef, PaginatorDef } from '../../core/lib/grid-model';
import {
    InitDictations, ChangeJobStage, TeamTalkGridRowDoubleClick, ChangeJobFor
} from '../actions/core';
import { GridRowData, TeamTalkAttachMatter } from '../models/interface';
import { UserType, JobFolderType } from '../models/enum';

export class BaseDictationsManager {


    isLoading$: any;
    gridColoum$: any;
    loginUser$: any;
    usetType$: any;
    dictationGridFilters$: any;
    matterRef$: any;
    dictationGridData$: any;
    groupList$: any;
    stateCounts$: any;
    authorList$: any;
    userValidationMsg$: any;
    paginatorDef$: any;
    profileSecrarary$: any;
    profileGroups$: any;
    profileLoading$: any;
    profileClose$: any;
    jobDescription$: any;
    constructor(protected store: Store<any>) {
    }


    // columnDef: ColumnDef[] = [];

    paginatorDef = { currentPage: 0, itemPerPage: 50 };

    userType = UserType.author;

    columnDefSecretary: ColumnDef[] = [
        createDefultColumnDef('toggle', { label: '', fxFlex: '32px', filterAnchor: 'start', filterHidden: true, disableShort: true }),
        createDefultColumnDef('icon', { label: 'Icon', fxFlex: '50px', filterAnchor: 'end', filterHidden: true }),
        createDefultColumnDef('documentRef', { label: 'Sent By', fxFlex: '100px', filterAnchor: 'start', filterHidden: true }),
        createDefultColumnDef('location', { label: 'Submitted', fxFlex: '100px', filterAnchor: 'end', filterHidden: true }),
        createDefultColumnDef('reviewDate', { label: 'Job Name', fxFlex: '', filterAnchor: 'end', filterHidden: true }),
        createDefultColumnDef('destroyDate', { label: 'Job Description', fxFlex: '200px', filterAnchor: 'end', filterHidden: true }),
        createDefultColumnDef('destroyDate', { label: 'Duration', fxFlex: '100px', filterAnchor: 'end', filterHidden: true }),
        createDefultColumnDef('destroyDate', { label: 'Date Due', fxFlex: '200px', filterAnchor: 'end', filterHidden: true }),
        createDefultColumnDef('destroyDate', { label: 'Date Completed', fxFlex: '150px', filterAnchor: 'end', filterHidden: true }),
        createDefultColumnDef('destroyDate', { label: 'Locked By', fxFlex: '100px', filterAnchor: 'end', filterHidden: true }),
        createDefultColumnDef('destroyDate', { label: 'Urgency', fxFlex: '100px', filterAnchor: 'end', filterHidden: true }),
    ];

    columnDefAuthor: ColumnDef[] = [
        createDefultColumnDef('toggle', { label: '', fxFlex: '32px', filterAnchor: 'start', filterHidden: true, disableShort: true }),
        createDefultColumnDef('icon', { label: 'Icon', fxFlex: '50px', filterAnchor: 'end', filterHidden: true }),
        createDefultColumnDef('documentRef', { label: 'Sent To', fxFlex: '100px', filterAnchor: 'start', filterHidden: true }),
        createDefultColumnDef('location', { label: 'Submitted', fxFlex: '100px', filterAnchor: 'end', filterHidden: true }),
        createDefultColumnDef('reviewDate', { label: 'Job Name', fxFlex: '', filterAnchor: 'end', filterHidden: true }),
        createDefultColumnDef('destroyDate', { label: 'Job Description', fxFlex: '200px', filterAnchor: 'end', filterHidden: true }),
        createDefultColumnDef('destroyDate', { label: 'Duration', fxFlex: '100px', filterAnchor: 'end', filterHidden: true }),
        createDefultColumnDef('destroyDate', { label: 'Date Due', fxFlex: '200px', filterAnchor: 'end', filterHidden: true }),
        createDefultColumnDef('destroyDate', { label: 'Date Completed', fxFlex: '150px', filterAnchor: 'end', filterHidden: true }),
        createDefultColumnDef('destroyDate', { label: 'Locked By', fxFlex: '100px', filterAnchor: 'end', filterHidden: true }),
        createDefultColumnDef('destroyDate', { label: 'Urgency', fxFlex: '100px', filterAnchor: 'end', filterHidden: true }),
    ];

    // columnDef = this.userType === UserType.author ? this.columnDefAuthor : this.columnDefSecretary;

    protected initSelectors(token: string, columnDefAuthor: ColumnDef[], columnDefSecretary: ColumnDef[],
        paginDef: PaginatorDef, userType: number) {
        this.init(token, {
            columnDefAuthor: columnDefAuthor, columnDefSecretary: columnDefSecretary,
            paginatorDef: paginDef, filterOperate: '', userType: userType
        });
        this.isLoading$ = this.store.select(getLoadingByToken(token));
        this.gridColoum$ = this.store.select(getDictationsColumnDefByToken(token));
        this.usetType$ = this.store.select(getUserTypeByToken(token));
        this.dictationGridFilters$ = this.store.select(getDictationGridFilterByToken(token));
        this.matterRef$ = this.store.select(getMatterRefByToken(token));
        this.dictationGridData$ = this.store.select(getDictationGridDataByToken(token));
        this.groupList$ = this.store.select(getGroupListByToken(token));
        this.stateCounts$ = this.store.select(getDictationStateCountsByToken(token));
        this.authorList$ = this.store.select(getAuthorListByToken(token));
        this.userValidationMsg$ = this.store.select(getuserValidationMessageByToken(token));
        this.paginatorDef$ = this.store.select(getGridPaginationDef(token));
    }



    initDictationProfilingPopup(token: string, info: any) {
        // this.token = token;
        // this.infoData = info;
        // this.groupList$ = this.store.select(getGroupListByToken(token));
        // this.authorList$ = this.store.select(getAuthorListByToken(token));
        // this.refferalNotePopupClose$ = this.store.select(getRefferalNotePopupClose(token));
        // this.refferalNoteLoading$ = this.store.select(getRefferalNoteLoading(token));

        this.profileLoading$ = this.store.select(getProfileLoading(token));
        this.profileGroups$ = this.store.select(getprofileGroup(token));
        this.profileSecrarary$ = this.store.select(getProfileSecrarary(token));
        this.profileClose$ = this.store.select(getProfileClose(token));
        this.jobDescription$ = this.store.select(getJobDescription(token));

        this.store.dispatch(new InitDictationProfiling(token, info));
    }

    init(token, payload) {
        this.store.dispatch(new InitDictations(token, payload));
    }

    changeJobFor(token, payload) {
        this.store.dispatch(new ChangeJobFor(token, payload));

    }

    changeJobStage(token, payload) {

        this.store.dispatch(new ChangeJobStage(token, payload));
    }

    doubleClickGridRow(token, payload) {
        this.store.dispatch(new TeamTalkGridRowDoubleClick(token, payload));

    }
    gridRowDoubleClick(token, payload) {
        this.store.dispatch(new TeamTalkGridRowDoubleClick(token, payload));

    }

    openDocumentFile(token, payload) {
        this.store.dispatch(new TeamTalkOpenDocumentFile(token, payload));

    }

    attachedMatterForJob(token, event: { attachementData: TeamTalkAttachMatter, gridRowData: GridRowData }) {
        this.store.dispatch(new AttachedMatterForJob(token, event));
    }

    gridrowExpand(token, gridRowData) {

        this.store.dispatch(new RowExpand(token, gridRowData));
    }

    dictationFinishJob(token, saveData: { itemRow: GridRowData, statusValue: JobFolderType }) {

        this.store.dispatch(new DictationFinishJobFunctions(token, saveData));

    }
    competedJobDictations(token, saveData: { itemRow: GridRowData, statusValue: JobFolderType }) {

        this.store.dispatch(new DictationComplete(token, saveData));

    }

    authorChange(token, saveData) {
        this.store.dispatch(new ChangeAuthor(token, saveData));

    }


    openWordFileDictation(token, itemRow: GridRowData) {

        this.store.dispatch(new ValidateTeamTalkDocPath(token, itemRow));

    }

    playDictations(token, itemRow) {
        this.store.dispatch(new OpenDictationPlayer(token, itemRow));

    }

    openDictationPdf(token, itemRow) {

        this.store.dispatch(new OpenDictationPDF(token, itemRow));
    }


    refreshGrid(token) {
        this.store.dispatch(new DictationGridRefresh(token));
    }

    changePage(token: string, paginationDef: PaginatorDef) {
        this.store.dispatch(new ChangePage(token, paginationDef));
    }
    uploadSelectedFile(token: string, uploadFileData: any) {
        this.store.dispatch(new UploadDictationFile(token, uploadFileData));

    }

    profilingSubmit(token: string, profilingData: any) {
        this.store.dispatch(new SubmitProfiling(token, profilingData));
    }
    openCaseFile(token: string, value: string) {
        this.store.dispatch(new GetDictationOpenCaseData(token, { matterRef: value }));
    }


}
