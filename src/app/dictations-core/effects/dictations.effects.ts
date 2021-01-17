import { SubmitAddEditTaskFail } from './../../task-add-edit-core/actions/core';


import {
    getUserTypeByToken, getDictationGridFilterByToken,
    getStatusValueByToken, getCompleteRowItemByToken, getGridPaginationDef
} from './../reducers/index';

import { tap, take, catchError, map, switchMap, mergeMap, filter } from 'rxjs/operators';
import { of, from, combineLatest } from 'rxjs';
import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import * as Dictations from '../actions/core';

import { DictationService } from '../services/dictations.service';
import { UserType, JobFolderType } from '../models/enum';
import { OfficeUriSchemes } from '../../core/lib/office-uri-schemes';
import { LocalStorageKey, AppConfig } from '../../core';
import * as WindowPopup from '../../document-view/actions/window-popups';
import { WindowPopupsManagerService } from '../../document-view/services/window-popups-manager.service';
import { fitWindow } from '../../utils/bounds';
import { FileManagerType } from '../../document-view';
import { MainMenuService } from '../../layout-desktop/services/main-menu.service';



@Injectable()
export class DictationsEffects {
    constructor(private actions$: Actions, private store: Store<any>, private service: DictationService,
        private popupService: WindowPopupsManagerService, private appConfig: AppConfig, private mainMenuService: MainMenuService,) { }


    @Effect()
    initewView$ = this.actions$.pipe(ofType<Dictations.InitDictations>(Dictations.INIT_DICTATIONS),
        mergeMap(action => from([
            new Dictations.GetTeamTalkUser(action.token, action.payload),
            // new GlobalSearch.GetGlobalDocAppCodeList(action.token),
        ])
        ));


    @Effect()
    GetTeamTalkUser$ = this.actions$.pipe(ofType<Dictations.GetTeamTalkUser>
        (Dictations.GET_TEAM_TALKS_USER),
        // switchMap((action) =>
        //     this.store.select(getDefaultEmployeUserData()).pipe(
        //         filter(userInfo => !!userInfo),
        //         map(userInfo => ({ token: action.token, user: userInfo, })
        //         ), take(1)
        //     )),
        switchMap((action) =>
            this.service.getTeamTalkUser().pipe(                    // action.user.user
                map((result) => new Dictations.GetTeamTalkUserSuccess(action.token, result)),
                catchError((error) => of(new Dictations.GetTeamTalkUserFail(action.token,
                    { teamTalkUserSuccessInfo: error.error }))))

        ));



    @Effect()
    RefreshGridData$ = this.actions$.pipe(ofType<Dictations.GetTeamTalkUserSuccess>(Dictations.GET_TEAM_TALKS_USER_SUCCESS),
        map((action) => {

            return new Dictations.GetTeamTalkGridData(action.token);

        }));

    @Effect()
    RefreshDataChangeStage$ = this.actions$.pipe(ofType<Dictations.ChangeJobStage>(Dictations.CHANGE_JOB_STAGE),
        map((action) => {

            return new Dictations.GetTeamTalkGridData(action.token);

        }));

    @Effect()
    RefreshChangeJobFor$ = this.actions$.pipe(ofType<Dictations.ChangeJobFor>(Dictations.CHANGE_JOB_FOR),
        map((action) => {

            return new Dictations.GetTeamTalkGridData(action.token);

        }));

    @Effect()
    RefreshChangeAuthor$ = this.actions$.pipe(ofType<Dictations.ChangeAuthor>(Dictations.CHANGE_AUTHOR),
        map((action) => {

            return new Dictations.GetTeamTalkGridData(action.token);

        }));

    @Effect()
    loadTeamTalkGridData$ = this.actions$.pipe(ofType<Dictations.GetTeamTalkGridData>(Dictations.GET_TEAM_TALKS_GRID_DATA),
        switchMap(action =>
            combineLatest(
                this.store.select(getDictationGridFilterByToken(action.token)),
                this.store.select(getUserTypeByToken(action.token)),
                this.store.select(getGridPaginationDef(action.token)),
                //  this.store.select(getDictationsColumnDefByToken(action.token)),
                (filterViewModel, userType, pageDef) =>
                    ({ filterViewModel, userType, pageDef, token: action.token })).pipe(
                        take(1),
                        filter(info => info.userType && !!info.userType.id),
                        switchMap((info) => {
                            if (info.userType && info.userType.level === UserType.typist) {   // check is typist

                                // if (info.filterViewModel.jobFor.id === -1) {
                                return this.service.getTeamTalkGridDataBySecretaryNew(info.filterViewModel, info.userType, info.pageDef).
                                    pipe(
                                        map((result) => new Dictations.GetTeamTalkGridDataSuccess(action.token, { data: result })),
                                        catchError((error) => of(new Dictations.GetTeamTalkGridDataFail(action.token, error))));

                                // } else {

                                //     return this.service.getTeamTalkGridDataBySecretaryGroup(info.filterViewModel, info.userType.id).pipe(
                                //       map((result) => new Dictations.GetTeamTalkGridDataSuccess(action.token, { data: result.jobInfo })),
                                //         catchError((error) => of(new Dictations.GetTeamTalkGridDataFail(action.token, error))));
                                // }

                            } else {// if (info.userType && info.userType.level === UserType.manager) {


                                // if (info.filterViewModel.jobFor.id === -1) {
                                // const userId = info.userType && info.userType.level === UserType.manager
                                //     ? info.filterViewModel.jobFor.id : info.userType.id;
                                // return this.service.getTeamTalkGridDataByAuthor(info.filterViewModel, userId).pipe(
                                //     map((result) => new Dictations.GetTeamTalkGridDataSuccess(action.token, { data: result.jobInfo })),
                                //     catchError((error) => of(new Dictations.GetTeamTalkGridDataFail(action.token, error))));


                                // } else {
                                return this.service.getTeamTalkGridDataByAuthorNew(info.filterViewModel, info.userType, info.pageDef).pipe(
                                    map((result) => new Dictations.GetTeamTalkGridDataSuccess(action.token, { data: result })),
                                    catchError((error) => of(new Dictations.GetTeamTalkGridDataFail(action.token, error))));

                            }
                        }))));


    @Effect()
    finishJob$ = this.actions$.pipe(ofType<Dictations.DictationFinishJobFunctions>(Dictations.DICTATION_FINISH_JOB_FUNCTIONS),
        switchMap((action) =>
            this.service.dictationFinishJobFunctions(action.payload.itemRow.id, action.payload.statusValue).pipe(
                map((result) => new Dictations.DictationFinishJobFunctionsSuccess(action.token, { data: result })),
                catchError((error) => of(new Dictations.DictationFinishJobFunctionsFail(action.token, error))))
        ));



    @Effect()
    RefreshGridDataByUpdate$ = this.actions$.pipe(ofType<Dictations.DictationFinishJobFunctionsSuccess>
        (Dictations.DICTATION_FINISH_JOB_FUNCTIONS_SUCCESS),
        map((action) => {
            return new Dictations.GetTeamTalkGridData(action.token);

        }));

    @Effect()
    checkInTemplate$ = this.actions$.pipe(ofType<Dictations.DictationFinishJobFunctionsSuccess>
        (Dictations.DICTATION_FINISH_JOB_FUNCTIONS_SUCCESS),
        map((action) => {
            return new Dictations.CheckInTeamTalkTemplate(action.token);

        }));




    @Effect()
    validateTeamTalkDocPath$ = this.actions$.pipe(ofType<Dictations.ValidateTeamTalkDocPath>(Dictations.VALIDATE_TEAM_TALK_DOC_PATH),
        switchMap(action =>
            this.store.select(getUserTypeByToken(action.token)).pipe(
                map(types => ({ types: types, itemRow: action.payload, token: action.token })),
                take(1),
                switchMap((info) =>
                    this.service.validateTeamTalkDocPath(info.itemRow, info.types).pipe(
                        map((result) => new Dictations.ValidateTeamTalkDocPathSuccess(action.token, { data: result })),
                        catchError((error) => of(new Dictations.ValidateTeamTalkDocPathFail(action.token, error))))
                ))));

    @Effect()
    checkoutTemplate$ = this.actions$.pipe(ofType<Dictations.ValidateTeamTalkDocPathSuccess>
        (Dictations.VALIDATE_TEAM_TALK_DOC_PATH_SUCCESS),
        map((action) => {
            return new Dictations.CheckOutTeamTalkTemplate(action.token, action.payload.data);

        }));

    @Effect()
    checkoutTeamTalkTemplete$ = this.actions$.pipe(ofType<Dictations.CheckOutTeamTalkTemplate>
        (Dictations.CHECK_OUT_TEAM_TALK_TEMPLATE),
        switchMap((action) =>
            this.service.teamTalkCheckoutTemplate(action.payload).pipe(
                map((result) => new Dictations.CheckOutTeamTalkTemplateSuccess(action.token,
                    { data: result, request: action.payload })),
                catchError((error) => of(new Dictations.CheckOutTeamTalkTemplateFail(action.token, error))))
        ));




    @Effect({ dispatch: false })
    openDriveEditDoc$ = this.actions$.pipe(ofType<Dictations.CheckOutTeamTalkTemplateSuccess>
        (Dictations.CHECK_OUT_TEAM_TALK_TEMPLATE_SUCCESS),
        filter(action => action.payload.data && !!action.payload.data.url),
        tap(action => {
            const schemes = new OfficeUriSchemes(
                action.payload.data.url ? action.payload.data.url : null,
                action.payload.data.fileName,
                action.payload.data.parentReferencePath);
            if (localStorage.getItem(LocalStorageKey.DocumentOpenType) === 'Descktop Office' && schemes.getSchemeName()) {
                this.store.dispatch(new WindowPopup.OpenByOfficeUriSchemes(schemes, true));
            } else {

                const fileDetail = {
                    fileManagerType: FileManagerType.TeamTalkTemplateManager,
                    url: action.payload.data.url ? action.payload.data.url : null,
                    hashKey: action.payload.data.hashKey,
                    name: action.payload.data.fileName,
                    path: action.payload.data.parentReferencePath
                };

                this.popupService.openCheckinWindow(fileDetail,
                    {
                        ...fitWindow(),
                        toolbar: false,
                        location: false,
                        directories: false,
                        status: false,
                        menubar: false,
                        scrollbars: false
                    });
            }
        }));


    @Effect()
    checkInTeamTalkTemplete$ = this.actions$.pipe(ofType<Dictations.CheckInTeamTalkTemplate>
        (Dictations.CHECK_IN_TEAM_TALK_TEMPLATE),
        switchMap(action =>
            this.store.select(getCompleteRowItemByToken(action.token)).pipe(
                map(rowData => ({
                    hashKey: rowData.checkoutDocDetails ? rowData.checkoutDocDetails.hashKey : null,
                    jobId: rowData.id, token: action.token
                })),
                take(1),
                switchMap((info) =>
                    this.service.teamTalkCheckInFile(info.hashKey, info.jobId).pipe(
                        map((result) => new Dictations.CheckInTeamTalkTemplateSuccess(action.token, result)),
                        catchError((error) => of(new Dictations.CheckInTeamTalkTemplateFail(action.token, error))))
                ))));



    @Effect()
    RefreshDictationGrid$ = this.actions$.pipe(ofType<Dictations.DictationGridRefresh>(Dictations.DICTATION_GRID_REFRESH),
        switchMap((action) => {
            return from([new Dictations.GetTeamTalkGridData(action.token)]);
        }));


    @Effect()
    completeJob$ = this.actions$.pipe(ofType<Dictations.DictationComplete>(Dictations.DICTATION_COMPLETE),
        switchMap((action) =>
            this.service.dictationFinishJobFunctions(action.payload.itemRow.id, action.payload.statusValue).pipe(
                map((result) => new Dictations.DictationCompleteSuccess(action.token,
                    { data: result, itemRow: action.payload.itemRow })),
                catchError((error) => of(new Dictations.DictationCompleteFail(action.token, error))))
        ));
    @Effect()
    chekinTemplateAfterComplete$ = this.actions$.pipe(ofType<Dictations.DictationCompleteSuccess>
        (Dictations.DICTATION_COMPLETE_SUCCESS),
        switchMap((action) => {
            return from([new Dictations.CheckInTeamTalkTemplate(action.token)]);
        }));

    @Effect()
    addDiaryRecord$ = this.actions$.pipe(ofType<Dictations.CheckInTeamTalkTemplateSuccess>(Dictations.CHECK_IN_TEAM_TALK_TEMPLATE_SUCCESS),
        switchMap(action =>
            combineLatest(
                this.store.select(getStatusValueByToken(action.token)),
                this.store.select(getCompleteRowItemByToken(action.token)),
                (statusValue, rowItem) => ({ statusValue, rowItem, token: action.token })
            ).pipe(
                take(1),
                filter(a => a.statusValue === JobFolderType.Completed),
                switchMap((info) => from([new Dictations.AddTeamTalkDiaryRecord(action.token, info.rowItem)]))
            )
        )
    );


    @Effect()
    addTeamTalkDiary$ = this.actions$.pipe(ofType<Dictations.AddTeamTalkDiaryRecord>(Dictations.ADD_TEAM_TALK_DIARY_RECORD),
        switchMap(action =>
            this.store.select(getUserTypeByToken(action.token)).pipe(
                map(user => ({ user: user, token: action.token })),
                take(1),
                switchMap((info) =>
                    this.service.addTeamTalkDiaryRecord(action.payload, info.user.id).pipe(
                        map((result) => new Dictations.AddTeamTalkDiaryRecordSuccess(action.token, { data: result })),
                        catchError((error) => of(new Dictations.AddTeamTalkDiaryRecordFail(action.token, error))))
                ))));

    @Effect()
    RefreshGridDataByAddDiary$ = this.actions$.pipe(ofType<Dictations.AddTeamTalkDiaryRecordSuccess>
        (Dictations.ADD_TEAM_TALK_DIARY_RECORD_SUCCESS),
        map((action) => {
            return new Dictations.GetTeamTalkGridData(action.token);

        }));


    @Effect()
    getDictationPDF$ = this.actions$.pipe(ofType<Dictations.OpenDictationPDF>(Dictations.GET_DICTATION_PDF),
        switchMap((action) =>
            this.service.getDictationPDF(action.payload.id).pipe(
                map((result) => new Dictations.GetDictationPdfSuccess(action.token, { data: result })),
                catchError((error) => of(new Dictations.GetDictationPdfFail(action.token, error))))
        ));


    @Effect({ dispatch: false })
    openDictationPlayer$ = this.actions$.pipe(ofType<Dictations.OpenDictationPlayer>(Dictations.OPEN_DICTATION_PLAYER),
        tap(action => {
            // if (localStorage.getItem(LocalStorageKey.DocumentOpenType) === 'Descktop Office') {
            //  this.store.dispatch(new Dictations.GetDictationUrl(action.token, {jobId: action.payload.id}));

            //  } else {

            window.open(`/dictation_audio_player/${action.payload.id}`,
                'dps-dictation-audio-player',
                `toolbar=no, location=no, directories=no, status=no, menubar=no,
       scrollbars=no, resizable=no, copyhistory=no, height=220, width=500,
       left=0, top=0
      `
            );

            //       }
        }));


    @Effect({ dispatch: false })
    openWindowsMediaPlayer$ = this.actions$.pipe(
        ofType<Dictations.GetDictationUrlSuccess>(Dictations.GET_DICTATION_URL_SUCCESS),
        tap((data) => {
            console.log(data);

            const url = `${this.appConfig.apiv3StorageProxy}/Download/${data.payload.data.fileName}?id=${data.payload.data.token}`;
            //  /storage-proxy/v1/

            window.open(`mms:/${url}`, '_self');
            // const row = { ...data.payload.row, emailItem: data.payload.emailItem };
            // this.popupService.openMsgFilePopup('MSG_FILE_POPUP', row);
        }));

    @Effect()
    getAudioUrl$ = this.actions$.pipe(ofType<Dictations.GetDictationUrl>(Dictations.GET_DICTATION_URL),
        switchMap((action) =>
            this.service.getDicatationFileDownloadTransferToken(action.payload.jobId).pipe(
                map((result) => new Dictations.GetDictationUrlSuccess(action.token, { data: result })),
                catchError((error) => of(new Dictations.GetDictationUrlFail(action.token, error))))
        ));


    @Effect()
    changePage$ = this.actions$.pipe(ofType<Dictations.ChangePage>(Dictations.CHANGE_PAGE),
        map(action => new Dictations.GetTeamTalkGridData(action.token)));


    @Effect()
    expandMatter$ = this.actions$.pipe(ofType<Dictations.RowExpand>(Dictations.ROW_EXPAND),
        filter(action => !action.payload.expanded && action.payload.dpsFileID != null),
        map(action => new Dictations.GetMatterRef(action.token, action.payload)));



    @Effect()
    getMatterRef$ = this.actions$.pipe(ofType<Dictations.GetMatterRef>(Dictations.GET_MATTER_REF),
        //  filter(action => action.payload.gridRowData && !action.payload.gridRowData.expanded &&
        // action.payload.gridRowData.dpsFileID != null),
        switchMap((action) =>
            this.service.getMatterRef(action.payload).pipe(
                map((result) => new Dictations.GetMatterRefSuccess(action.token, { data: result, gridRowData: action.payload })),
                catchError((error) => of(new Dictations.GetMatterRefFail(action.token, error))))
        ));



    @Effect()
    getUplodFileJobId$ = this.actions$.pipe(ofType<Dictations.UploadDictationFile>(Dictations.UPLOAD_DICTATION_FILE),
        switchMap(action =>
            this.store.select(getUserTypeByToken(action.token)).pipe(
                map(user => ({ user: user, token: action.token, payload: action.payload })),
                take(1),
                switchMap((info) =>
                    this.service.getUploadJobId(info.user).pipe(
                        map((result) => new Dictations.GetJobIdForUploadFileSuccess(info.token,
                            { data: result, uploadFile: info.payload })),
                        catchError((error) => of(new Dictations.GetJobIdForUploadFileFail(action.token, error))))
                ))));

    @Effect()
    callUpload$ = this.actions$.pipe(ofType<Dictations.GetJobIdForUploadFileSuccess>(Dictations.GET_JOB_ID_FOR_UPLOAD_FILE_SUCCESS),
        map(action => new Dictations.UploadFile(action.token, { jobId: action.payload.data.jobId, file: action.payload.uploadFile })));


    @Effect()
    uploadFile$ = this.actions$.pipe(ofType<Dictations.UploadFile>(Dictations.UPLOAD_FILE),
        switchMap((action) =>
            this.service.uploadFile(action.payload.jobId, action.payload.file).pipe(
                map((result) => new Dictations.UploadFileSuccess(action.token, result, action.payload.jobId)),
                catchError((error) => of(new Dictations.UploadFileFail(action.token, error))))
        ));

    @Effect()
    uploadFileSuccess$ = this.actions$.pipe(ofType<Dictations.UploadFileSuccess>(Dictations.UPLOAD_FILE_SUCCESS),
        switchMap((action) =>
            this.service.dictationFileConvertion(action.jobId, action.payload.fileName.split('.').pop()).pipe(
                map((result) => new Dictations.DictationGridRefresh(action.token)),
                catchError((error) => of(new Dictations.UploadFileFail(action.token, error))))
        ));



    @Effect()
    jobCreateRefresh$ = this.actions$.pipe(ofType<Dictations.GetJobIdForUploadFileSuccess>(Dictations.GET_JOB_ID_FOR_UPLOAD_FILE_SUCCESS),
        map(action => new Dictations.DictationGridRefresh(action.token)));
    // @Effect()
    // convertFile$ = this.actions$.pipe(ofType<Dictations.DictationFileConvertion>(Dictations.UPLOAD_FILE),
    //     switchMap((action) =>
    //         this.service.dictationFileConvertion(action.payload.jobId, action.payload.file).pipe(
    //             map((result) => new Dictations.DictationFileConvertionSuccess(action.token, result)),
    //             catchError((error) => of(new Dictations.DictationFileConvertionFail(action.token, error))))
    //     ));



    @Effect()
    initProfiling$ = this.actions$.pipe(ofType<Dictations.InitDictationProfiling>(Dictations.INIT_DICTATION_PROFILING),
        mergeMap((action) => {
            return from([
                new Dictations.GetSecretary(action.token, action.payload),
                new Dictations.GetGroups(action.token, action.payload),
                new Dictations.GetJobDescription(action.token, action.payload),

            ]);
        }));


    @Effect()
    getSec$ = this.actions$.pipe(ofType<Dictations.GetSecretary>(Dictations.GET_SECRETARY),
        switchMap((action) =>
            this.service.getSecretaryByGroup(action.category).pipe(
                map((responce) => new Dictations.GetSecretarySuccess(action.token, responce)),
                catchError((error) => of(new Dictations.GetSecretaryFail(action.token, error))))
        ));


    @Effect()
    submitprofiling$ = this.actions$.pipe(ofType<Dictations.SubmitProfiling>(Dictations.SUBMIT_PROFILING),
        switchMap((action) =>
            this.service.submitProfile(action.payload).pipe(
                map((responce) => new Dictations.SubmitProfilingSuccess(action.token, responce)),
                catchError((error) => of(new Dictations.SubmitProfilingFail(action.token, error))))
        ));
    @Effect()
    ProfilingRefreshGri$ = this.actions$.pipe(ofType<Dictations.SubmitProfilingSuccess>(Dictations.SUBMIT_PROFILING_SUCCESS),
        map((action) => {

            return new Dictations.GetTeamTalkGridData(action.token);

        }));

    @Effect()
    getGroup$ = this.actions$.pipe(ofType<Dictations.GetGroups>(Dictations.GET_GROUPS),
        switchMap(info =>
            this.store.select(getUserTypeByToken(info.token)).pipe(
                map(user => ({ user: user, token: info.token })),
                take(1),
                switchMap((action) =>
                    this.service.getGroupListById(action.user.id).pipe(
                        map((responce) => new Dictations.GetGroupsSuccess(action.token, responce)),
                        catchError((error) => of(new Dictations.GetGroupsFail(action.token, error))))
                ))));

    @Effect()
    getJobDescription$ = this.actions$.pipe(ofType<Dictations.GetJobDescription>(Dictations.GET_JOB_DESCRIPTION),
        switchMap((action) =>
            this.service.JobdescriptionList(action.category).pipe(
                map((responce) => new Dictations.GetJobDescriptionSuccess(action.token, responce)),
                catchError((error) => of(new Dictations.GetJobDescriptionFail(action.token, error))))
        ));

    @Effect()
    dictationMenuOpenCaseData$ = this.actions$.pipe(ofType<Dictations.GetDictationOpenCaseData>
        (Dictations.GET_DICTATION_OPEN_CASE_DATA),
        filter((action: Dictations.GetDictationOpenCaseData) => !!action.payload.matterRef),
        switchMap((action: Dictations.GetDictationOpenCaseData) => {
            return this.service.getOpenCaseMaterDataFromMatterRef(action.payload.matterRef.toString()).pipe(
                map((result) => {
                    this.mainMenuService.gotoOpenCase(result);
                    return new Dictations.GetDictationOpenCaseDataSuccess(action.token, { inputData: result });
                }),
                catchError(error => of(new Dictations.GetDictationOpenCaseDataFail(action.token, error))));

        }));

}






