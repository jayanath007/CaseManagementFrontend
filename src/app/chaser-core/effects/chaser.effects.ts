import { PlotMatterDiaryRecordsInfoViewModel } from './../../matter-linked-core/models/request';

import { filter, take, catchError, map, switchMap, mergeMap } from 'rxjs/operators';
import { of, from, combineLatest } from 'rxjs';

import {
    getChaserAppIdByToken, getChaserMatterInfoByToken, getChaserOutDataByToken,
    getChaserRecepintListByToken, getUnLinkedEmailByToken, getCrimeClassIdentityViewModel, getCivilClassList,
    getSubjectPrefixByToken, getMailSubjectToken, getSentItemIdsByToken
} from '../reducers';
import { ChaserService } from '../services/chaser.service';
import { Store } from '@ngrx/store';
import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import * as Chaser from '../actions/core';
import { MatterInfo, ContactMapResponce } from '../models/interfaces';
import { AddTimeType } from '../../core/lib/timeRecord';
import { getPlotRangeTokenByToken } from '../../matter-linked-core/reducers/index';
import { AccessControlService } from '../../auth/services/access-control.service';
import { checkTimeRecordType, getUser } from '../../auth';
import {
    getComposeItemByToken, getInlineAttachmentsByToken,
    getIsMailSavingByToken, getListAttachmentsByToken
} from '../../compose-mail-core';
import { HttpErrorResponse } from '@angular/common/http';
import { V3Error } from '../../shared';

@Injectable()
export class ChaserEffects {

    constructor(
        private actions$: Actions,
        private store: Store<any>, private service: ChaserService,
        private access: AccessControlService
    ) { }

    @Effect()
    initView$ = this.actions$.pipe(ofType<Chaser.InitChaser>(Chaser.INIT_CHASER),
        filter(action => !!action.payload.inputData),
        mergeMap((action) => {
            if (action.payload.inputData.dpsSubject) {
                return from([new Chaser.LoadMaterDataFromMailSubject(action.token, { dpsSubject: action.payload.inputData.dpsSubject }),
                // new Chaser.LoadMatterList(action.token, { recipientList: action.payload.inputData.toRecipients }),
                new Chaser.LoadFeeEarnerList(action.token),
                new Chaser.FeeEarnerRateValueDisable(action.token)]);
            } else {
                return from([new Chaser.LoadFeeEarnerList(action.token),
                // new Chaser.LoadMatterList(action.token, { recipientList: action.payload.inputData.toRecipients }),
                new Chaser.FeeEarnerRateValueDisable(action.token)]);
            }
        }));

    @Effect()
    loadMaterFromMailSubject$ = this.actions$.pipe(ofType<Chaser.LoadMaterDataFromMailSubject>(Chaser.LOAD_MATTER_DATA_FROM_SUBJECT),
        switchMap((action) =>
            this.service.getMaterDataFromMailSubject(action.payload.dpsSubject).pipe(
                map((result) => new Chaser.ChangeOpenFile(action.token, { selectedMatterInfo: result })),
                // .do(value => console.log('Feearner result:', value))
                catchError((error) => of(new Chaser.LoadMaterDataFromMailSubjectFail(action.token, error))))
        ));
    @Effect()
    loadOpenMatterList$ = this.actions$.pipe(ofType<Chaser.LoadMatterList>(Chaser.LOAD_MATTER_LIST_BY_EMAIL),
        switchMap((action) =>
            this.service.getMatterListByMail(action.payload.recipientList).pipe(
                map((result) => new Chaser.LoadMatterListSuccess(action.token, { emailMatterList: result })),
                // .do(value => console.log('Feearner result:', value))
                catchError((error) => of(new Chaser.LoadMatterListFail(action.token, error))))
        ));

    @Effect()
    feeEarnerRatesValueDisable$ = this.actions$.pipe(ofType<Chaser.FeeEarnerRateValueDisable>(Chaser.FEE_EARNER_RATE_VALUE_DISABLE),
        switchMap((action) =>
            this.service.getTimeUseFeeEarnerRatesValueDisable().pipe(
                map((result) => new Chaser.FeeEarnerRateValueDisableSuccess(action.token, { isTypeDisable: result })),
                catchError((error) => of(new Chaser.FeeEarnerRateValueDisableFail(action.token, error))))
        ));

    @Effect()
    sendChaserEmail$ = this.actions$.pipe(ofType<Chaser.SendChaserEmail>(Chaser.SEND_CHASER_EMAIL),
        switchMap(action => this.store.select(getIsMailSavingByToken(action.payload.composeToken)).pipe(
            filter(saving => saving !== true),
            take(1),
            switchMap(saving =>
                combineLatest(
                    this.store.select(getComposeItemByToken(action.payload.composeToken)),
                    this.store.select(getInlineAttachmentsByToken(action.payload.composeToken)),
                    this.store.select(getListAttachmentsByToken(action.payload.composeToken)),
                    ((composeItem, inlineAttachments, attachments) =>
                        ({ composeItem, action, attachments: attachments.concat(inlineAttachments) })
                    )
                ).pipe(take(1))
            ),
        )),
        switchMap(({ composeItem, action, attachments }) =>
            combineLatest(
                this.store.select(getSubjectPrefixByToken(action.token)),
                this.store.select(getChaserOutDataByToken(action.token)),
                this.store.select(getSentItemIdsByToken(action.token)),
                this.store.select(getUser),
                (newSubject, chaserRequest, sentItemIds, user) => ({
                    newSubject,
                    chaserRequest,
                    token: action.token,
                    linkMattes: action.payload.linkMattes,
                    composeItem,
                    attachments,
                    sentItemIds,
                    user
                })
            ).pipe(take(1))
        ),
        switchMap((info) => {
            if (info.sentItemIds) {
                return this.saveDiary(info, info.sentItemIds);
            }
            return this.service.sendChaserEmail(info.composeItem, info.attachments, info.chaserRequest.from, info.newSubject).pipe(
                switchMap(data => this.saveDiary(info, data)),
                catchError((error) => of(new Chaser.SendChaserEmailFail(info.token,
                    {
                        chaserModel: info.chaserRequest.chaserModel,
                        emailModel: {
                            id: (info.composeItem && info.composeItem.id) ? info.composeItem.id : '',
                            changeKey: (info.composeItem && info.composeItem.changeKey) ? info.composeItem.changeKey : ''
                        }
                    },
                    error
                )))
            );
        }
        ));

    @Effect()
    changeOpenFile$ = this.actions$.pipe(ofType<Chaser.ChangeOpenFile>(Chaser.CHANGE_OPEN_FILE),
        switchMap((action) =>
            this.store.select(getChaserMatterInfoByToken(action.token)).pipe(
                map((matterInfo: MatterInfo) => ({ matterInfo, token: action.token })),
                take(1))),
        switchMap((info) =>
            this.service.isTimeRecordingEnabled(info.matterInfo.MatterReferenceNo).pipe(
                map((isEnable) => ({ isEnable, info })),
                take(1))),
        switchMap((allInfo) =>
            this.store.select(checkTimeRecordType(allInfo.info.matterInfo.AppCode, allInfo.info.matterInfo.eBilling,
                allInfo.info.matterInfo.isLegalAid)).pipe(
                    map((timeType: AddTimeType) => ({ ...allInfo, timeType })),
                    take(1))),
        mergeMap((allInfo) => {
            if (allInfo.isEnable || allInfo.timeType !== AddTimeType.NotSupport) {
                if (allInfo && allInfo.info && allInfo.info.matterInfo && allInfo.info.matterInfo.eBilling) {
                    if (allInfo.timeType === AddTimeType.PrecedentH) {
                        return from([
                            new Chaser.LoadFolderList(allInfo.info.token),
                            new Chaser.LoadFileNo(allInfo.info.token),
                            new Chaser.LoadTimeTypeList(allInfo.info.token),
                            new Chaser.LoadDefaultFolder(allInfo.info.token),
                            new Chaser.CheckEmailMailAddressIsMap(allInfo.info.token),
                            new Chaser.LoadWorkTypeList(allInfo.info.token),
                            new Chaser.GetMailSubjectPrefix(allInfo.info.token, {
                                branchId: allInfo.info.matterInfo.BranchID,
                                appId: allInfo.info.matterInfo.AppID,
                                fileId: allInfo.info.matterInfo.FileID
                            })
                        ]);
                    } else if (allInfo.timeType === AddTimeType.PrecedentS) {
                        return from([
                            new Chaser.LoadFolderList(allInfo.info.token),
                            new Chaser.LoadFileNo(allInfo.info.token),
                            new Chaser.LoadTimeTypeList(allInfo.info.token),
                            new Chaser.LoadDefaultFolder(allInfo.info.token),
                            new Chaser.CheckEmailMailAddressIsMap(allInfo.info.token),
                            new Chaser.LoadPhaseList(allInfo.info.token),
                            new Chaser.LoadActivitiList(allInfo.info.token),
                            new Chaser.LoadTaskList(allInfo.info.token),
                            new Chaser.GetMailSubjectPrefix(allInfo.info.token, {
                                branchId: allInfo.info.matterInfo.BranchID,
                                appId: allInfo.info.matterInfo.AppID,
                                fileId: allInfo.info.matterInfo.FileID
                            })]);
                    } else if (allInfo.timeType === AddTimeType.CrimeTime) {
                        return from([
                            new Chaser.LoadFolderList(allInfo.info.token),
                            new Chaser.LoadFileNo(allInfo.info.token),
                            new Chaser.LoadTimeTypeList(allInfo.info.token),
                            new Chaser.LoadDefaultFolder(allInfo.info.token),
                            new Chaser.CheckEmailMailAddressIsMap(allInfo.info.token),
                            new Chaser.GetClassType(allInfo.info.token, {
                                branchId: allInfo.info.matterInfo.BranchID,
                                appId: allInfo.info.matterInfo.AppID,
                                fileId: allInfo.info.matterInfo.FileID
                            }),
                            new Chaser.GetMailSubjectPrefix(allInfo.info.token, {
                                branchId: allInfo.info.matterInfo.BranchID,
                                appId: allInfo.info.matterInfo.AppID,
                                fileId: allInfo.info.matterInfo.FileID
                            })
                        ]);
                    } else if (allInfo.timeType === AddTimeType.CivilTime) {
                        return from([
                            new Chaser.LoadFolderList(allInfo.info.token),
                            new Chaser.LoadFileNo(allInfo.info.token),
                            new Chaser.LoadTimeTypeList(allInfo.info.token),
                            new Chaser.LoadDefaultFolder(allInfo.info.token),
                            new Chaser.CheckEmailMailAddressIsMap(allInfo.info.token),
                            new Chaser.GetCivilClass(allInfo.info.token, {
                                branchId: allInfo.info.matterInfo.BranchID,
                                appId: allInfo.info.matterInfo.AppID,
                                fileId: allInfo.info.matterInfo.FileID
                            }),
                            new Chaser.GetMailSubjectPrefix(allInfo.info.token, {
                                branchId: allInfo.info.matterInfo.BranchID,
                                appId: allInfo.info.matterInfo.AppID,
                                fileId: allInfo.info.matterInfo.FileID
                            })
                        ]);
                    } else {
                        return from([
                            new Chaser.LoadFolderList(allInfo.info.token),
                            new Chaser.LoadFileNo(allInfo.info.token),
                            new Chaser.LoadTimeTypeList(allInfo.info.token),
                            new Chaser.LoadDefaultFolder(allInfo.info.token),
                            new Chaser.CheckEmailMailAddressIsMap(allInfo.info.token),
                            new Chaser.GetMailSubjectPrefix(allInfo.info.token, {
                                branchId: allInfo.info.matterInfo.BranchID,
                                appId: allInfo.info.matterInfo.AppID,
                                fileId: allInfo.info.matterInfo.FileID
                            })
                        ]);
                    }
                } else if (allInfo && allInfo.info && allInfo.info.matterInfo) {
                    return from([
                        new Chaser.LoadFolderList(allInfo.info.token),
                        new Chaser.LoadFileNo(allInfo.info.token),
                        new Chaser.LoadTimeTypeList(allInfo.info.token),
                        new Chaser.LoadDefaultFolder(allInfo.info.token),
                        new Chaser.CheckEmailMailAddressIsMap(allInfo.info.token),
                        new Chaser.GetMailSubjectPrefix(allInfo.info.token, {
                            branchId: allInfo.info.matterInfo.BranchID,
                            appId: allInfo.info.matterInfo.AppID,
                            fileId: allInfo.info.matterInfo.FileID
                        })
                    ]);
                }
                return from([]);
            } else {
                return of(new Chaser.ShowError(allInfo.info.token, {
                    error: { isError: true, msg: 'Current Spitfire version doesn\'t support for Legal Aid or Precedent H Matter(s).' }
                }
                ));
            }

        }));

    @Effect()
    getMailSubjectPrefix$ = this.actions$.pipe(ofType<Chaser.GetMailSubjectPrefix>(Chaser.GET_MAIL_SUBJECT_PREFIX),
        switchMap(action => this.store.select(getMailSubjectToken(action.token)).pipe(take(1), map(subject => ({ subject, action })))),
        switchMap(({ subject, action }) =>
            this.service.getMailSubjectPrefix(action.payload.branchId, action.payload.appId, action.payload.fileId, subject).pipe(
                map(responce => new Chaser.GetMailSubjectPrefixSuccess(action.token, {
                    prefix: responce, branchId: action.payload.branchId,
                    appId: action.payload.appId,
                    fileId: action.payload.fileId
                })),
                catchError(e => of(new Chaser.GetMailSubjectPrefixFail(action.token, e, {
                    branchId: action.payload.branchId,
                    appId: action.payload.appId,
                    fileId: action.payload.fileId
                })))
            )
        )
    );

    @Effect()
    getClassType$ = this.actions$.pipe(ofType<Chaser.GetClassType>(Chaser.GET_CLASS_TYPE),
        switchMap(action =>
            this.service.getClassType(action.payload).pipe(
                map(responce => new Chaser.GetClassTypeSuccess(action.token, { list: responce })),
                catchError(e => of(new Chaser.GetClassTypeFail(action.token)))
            )
        )
    );

    @Effect()
    getClassTypeSuccess$ = this.actions$.pipe(ofType<Chaser.GetClassTypeSuccess>(Chaser.GET_CLASS_TYPE_SUCCESS),
        map(action => new Chaser.LoadAttTypeList(action.token)));

    @Effect()
    changeClassType$ = this.actions$.pipe(ofType<Chaser.ChangeClassType>(Chaser.CHANGE_CLASS_TYPE),
        filter(action => action.payload.selectedClass.rectype > 0),
        map(action => new Chaser.LoadAttTypeList(action.token)));


    @Effect()
    loadAttTypeListData$ = this.actions$.pipe(ofType<Chaser.LoadAttTypeList>(Chaser.LOAD_ATT_TYPE_LIST),
        switchMap((action: Chaser.LoadAttTypeList) =>
            this.store.select(getCrimeClassIdentityViewModel(action.token)).pipe(
                map(model => ({ model: model, token: action.token })),
                take(1))),
        switchMap((info) =>
            this.service.getCrimeWorkTypes(info.model).pipe(map((response) =>
                new Chaser.LoadAttTypeListSuccess(info.token, { attTypes: response })),
                catchError(error => of(new Chaser.LoadAttTypeListFail(info.token))))
        ));


    @Effect()
    loadFeeEarner$ = this.actions$.pipe(ofType<Chaser.LoadFeeEarnerList>(Chaser.LOAD_FE_LIST),
        switchMap((action) =>
            this.service.getFeeEarners().pipe(
                map((result) => new Chaser.LoadFeeEarnerListSuccess(action.token, { feeEarnerList: result })),
                // .do(value => console.log('Feearner result:', value))
                catchError((error) => of(new Chaser.LoadFeeEarnerListFail(action.token, error))))
        ));

    @Effect()
    loadFolders$ = this.actions$.pipe(ofType<Chaser.LoadFolderList>(Chaser.LOAD_FOLDER_LIST),
        switchMap((action) =>
            this.store.select(getChaserAppIdByToken(action.token)).pipe(
                map((appId) => ({ appId, token: action.token })),
                take(1))),
        switchMap((info) =>
            this.service.getFolders(info.appId).pipe(
                map((result) => new Chaser.LoadFolderListSuccess(info.token, { folderList: result })),
                // .do(value => console.log('Feearner result:', value))
                catchError((error) => of(new Chaser.LoadFolderListFail(info.token, error))))
        ));

    @Effect()
    loadTimeType$ = this.actions$.pipe(ofType<Chaser.LoadTimeTypeList>(Chaser.LOAD_TIME_TYPE_LIST),
        switchMap((action) =>
            this.store.select(getChaserAppIdByToken(action.token)).pipe(
                map((appId) => ({ appId, token: action.token })),
                take(1))),
        switchMap((info) =>
            this.service.getTimeTypes(info.appId).pipe(
                map((result) => new Chaser.LoadTimeTypeListSuccess(info.token, { timeTypeList: result })),
                // .do(value => console.log('Feearner result:', value))
                catchError((error) => of(new Chaser.LoadTimeTypeListFail(info.token, error))))
        ));

    @Effect()
    loadDefaultFolder$ = this.actions$.pipe(ofType<Chaser.LoadDefaultFolder>(Chaser.LOAD_DEFAULT_FOLDER),
        switchMap((action) =>
            this.store.select(getChaserAppIdByToken(action.token)).pipe(
                map((appId) => ({ appId, token: action.token })),
                take(1))),
        switchMap((info) =>
            this.service.getDefaultFolder(info.appId).pipe(
                map((result) => new Chaser.LoadDefaultFolderSuccess(info.token, { defaultFolder: result })),
                // .do(value => console.log('Feearner result:', value))
                catchError((error) => of(new Chaser.LoadDefaultFolderFail(info.token, error))))
        ));


    @Effect()
    loadFileNo$ = this.actions$.pipe(ofType<Chaser.LoadFileNo>(Chaser.LOAD_FILE_NO),
        switchMap((action) =>
            this.store.select(getChaserMatterInfoByToken(action.token)).pipe(
                map((matterInfo: MatterInfo) => ({ matterInfo, token: action.token })),
                take(1))),
        switchMap((info) =>
            this.service.getFileNo(info.matterInfo).pipe(
                map((result) => new Chaser.LoadFileNoSuccess(info.token, { fileNo: result })),
                // .do(value => console.log('LoadFileNo result:', value))
                catchError((error) => of(new Chaser.LoadFileNoFail(info.token, error))))
        ));

    // LAKMAL - LS
    @Effect()
    checkContactsIsMap$ = this.actions$.pipe(ofType<Chaser.CheckEmailMailAddressIsMap>(Chaser.CHECK_IS_EMAIL_ADDRESS_MAP),
        switchMap((action) =>
            combineLatest(
                this.store.select(getChaserMatterInfoByToken(action.token)),
                this.store.select(getChaserRecepintListByToken(action.token)),
                ((matterInfo, toRecepient) => ({ matterInfo, toRecepient, token: action.token }))
            ).pipe(take(1))

        ), switchMap((info) =>
            this.service.getUnmapEmialAddress(info.matterInfo, info.toRecepient).pipe(
                map((result: ContactMapResponce) => new Chaser.CheckEmailMailAddressIsMapSuccess(info.token,
                    { contactMapResponce: result })),
                catchError((error) => of(new Chaser.CheckEmailMailAddressIsMapFail(info.token))))
        ));

    @Effect()
    loadContactRolls$ = this.actions$.pipe(ofType<Chaser.LoadContacRole>(Chaser.LOAD_CONTACT_ROLE),
        switchMap((action) =>
            combineLatest(
                this.store.select(getChaserAppIdByToken(action.token)),
                this.store.select(getUnLinkedEmailByToken(action.token)),
                ((appId, unlinkContact) =>
                    ({ appId, unlinkContact, token: action.token }))
            ).pipe(take(1))),
        switchMap((info) =>
            this.service.getContactRole(info.appId).pipe(
                map((result) => new Chaser.LoadContacRoleSuccess(info.token,
                    { unlinkContact: info.unlinkContact.contactEmailsViewModel, role: result })),
                catchError((error) => of(new Chaser.LoadContacRoleFail(info.token))))
        ));

    @Effect()
    linkContact$ = this.actions$.pipe(ofType<Chaser.LinkContactWithMatter>(Chaser.LINK_CONTACT_WITH_MATTER),
        switchMap((action) =>
            combineLatest(
                this.store.select(getChaserMatterInfoByToken(action.token)),
                ((matterInfo) =>
                    ({ matterInfo, emailList: action.payload.contactEmailsViewModel, token: action.token }))
            ).pipe(take(1))),
        switchMap((info) =>
            this.service.linkContactWithMattar(info).pipe(
                map((result) => new Chaser.LinkContactWithMatterSuccess(info.token, { result: result, sentEmailList: info.emailList })),
                catchError((error) => of(new Chaser.LinkContactWithMatterFail(info.token))))
        ));

    // eBilling Comment
    @Effect()
    loadWorkTypeListData$ = this.actions$.pipe(ofType<Chaser.LoadWorkTypeList>(Chaser.LOAD_CHASER_WORK_TYPE_LIST),
        switchMap((action: Chaser.LoadWorkTypeList) =>
            this.service.getWorkTypeList().pipe(map((response) =>
                new Chaser.LoadWorkTypeListSuccess(action.token, { workTypeList: response })),
                catchError(error => of(new Chaser.LoadWorkTypeListFail(action.token, error))))
        ));
    @Effect()
    loadPhaseListData$ = this.actions$.pipe(ofType<Chaser.LoadPhaseList>(Chaser.LOAD_CHASER_PHASE_LIST),
        switchMap((action: Chaser.LoadPhaseList) =>
            this.service.getPhaseList().pipe(map((response) =>
                new Chaser.LoadPhaseListSuccess(action.token, { phaseList: response })),
                catchError(error => of(new Chaser.LoadPhaseListFail(action.token, error))))
        ));
    @Effect()
    loadActivitiListData$ = this.actions$.pipe(ofType<Chaser.LoadActivitiList>(Chaser.LOAD_CHASER_ACTIVITI_LIST),
        switchMap((action: Chaser.LoadActivitiList) =>
            this.service.getActivitiList().pipe(map((response) =>
                new Chaser.LoadActivitiListSuccess(action.token, { activitiList: response })),
                catchError(error => of(new Chaser.LoadActivitiListFail(action.token, error))))
        ));
    @Effect()
    loadTaskListData$ = this.actions$.pipe(ofType<Chaser.LoadTaskList>(Chaser.LOAD_CHASER_TASK_LIST),
        switchMap((action: Chaser.LoadTaskList) =>
            this.service.getTaskList().pipe(map((response) =>
                new Chaser.LoadTaskListSuccess(action.token, { taskList: response })),
                catchError(error => of(new Chaser.LoadTaskListFail(action.token, error))))
        ));

    // @Effect()
    // loadLinkedMatter$ = this.actions$.pipe(ofType<Chaser.SendChaserEmailSuccess>(Chaser.SEND_CHASER_EMAIL_SUCCESS),
    //     filter(action => action.payload.chaserOutPut.classId > 0),
    //     map(action => new Chaser.LoadLinkedMatterPopup(action.token,{selectedMatterInfo:})));

    @Effect()
    addDiaryRecord$ = this.actions$.pipe(ofType<Chaser.AddDiaryRecordsForPlotMattters>(Chaser.ADD_DIARY_RECORD_FOR_PLOT_MATTER),
        mergeMap((action) =>
            this.service.addDiaryRecordsForPlot(action.request).pipe(
                map((result) => new Chaser.AddDiaryRecordsForPlotMatttersSuccess(action.token, result)),
                catchError((error) => of(new Chaser.AddDiaryRecordsForPlotMattterstFail(action.token, { error: error }))))
        ));



    @Effect()
    loadLinkedMatter$ = this.actions$.pipe(ofType<Chaser.SendChaserEmailSuccess>(Chaser.SEND_CHASER_EMAIL_SUCCESS),
        switchMap((action) =>
            // return this.store.select(getChaserMatterInfoByToken(action.token)).pipe(
            combineLatest(
                this.store.select(getChaserMatterInfoByToken(action.token)),
                this.store.select(getPlotRangeTokenByToken('ChaserLinkedMatter')),
                ((cheserInfo, plotRange) =>
                    ({ cheserInfo, plotRange, action: action }))
            ).pipe(
                take(1),
                filter((info) => {
                    return (info && info.cheserInfo.isPlotMasterMatter
                        && info.action.payload.linkMattes && (info.action.payload.linkMattes.length > 0 || info.plotRange !== null));
                }),
                map((info) => new Chaser.AddDiaryRecordsForPlotMattters(info.action.token,
                    new PlotMatterDiaryRecordsInfoViewModel(
                        info.action.payload.linkMattes,
                        info.action.payload.diaryIds,
                        info.cheserInfo.MatterReferenceNo,
                        info.plotRange,
                        {
                            branchId: info.cheserInfo.BranchID,
                            appId: info.cheserInfo.AppID,
                            fileId: info.cheserInfo.FileID,

                        })
                ))
            )
        )
    );

    saveDiary(info, data) {
        return this.service.saveDiary(info.chaserRequest, data, info.newSubject, info.user.general.dateTimeOffset).pipe(
            map((result: any) => {
                return new Chaser.SendChaserEmailSuccess(info.token, {
                    chaserOutPut: null,
                    diaryIds: result.data, chaserSendSuccess: result.status,
                    linkMattes: info.linkMattes

                });
            }),
            catchError((res) => {
                const error: V3Error = res.error;
                let validationMSG = 'Unknown';
                if (error) {
                    validationMSG = error.message;
                    if (error && Array.isArray(error.errorDetail) && error.errorDetail.length > 0) {
                        validationMSG = error.errorDetail[0].Value || error.errorDetail[0].value;
                    }
                } else if (res.output && res.output.items) {
                    validationMSG = res.output.items[0].errorMessage;
                } else {
                    console.error(res);
                }
                return of(new Chaser.LoadChaserTypeValidation(info.token, {
                    emailmodelData: data,
                    errorMsg: validationMSG
                }));
            })
        );
    }

    // Civil
    @Effect()
    getCivilClass$ = this.actions$.pipe(ofType<Chaser.GetCivilClass>(Chaser.GET_CIVIL_CLASS),
        switchMap(action =>
            this.service.getCivilClassList(action.payload).pipe(
                map(responce => new Chaser.GetCivilClassSuccess(action.token, { list: responce })),
                catchError(e => of(new Chaser.GetCivilClassFail(action.token))))));

    @Effect()
    getCivilClassSuccess$ = this.actions$.pipe(ofType<Chaser.GetCivilClassSuccess>(Chaser.GET_CIVIL_CLASS_SUCCESS),
        map(action => new Chaser.LoadCivilLevelList(action.token)));

    @Effect()
    loadCivilLevelList$ = this.actions$.pipe(ofType<Chaser.LoadCivilLevelList>(Chaser.GET_CIVIL_LEVELS),
        switchMap((action: Chaser.LoadCivilLevelList) =>
            this.store.select(getCivilClassList(action.token)).pipe(
                map(classList => ({ selectClass: classList.find(i => i.selected), token: action.token })),
                take(1))),
        switchMap((info) =>
            this.service.getCivilClassLevels(info.selectClass).pipe(map((response) =>
                new Chaser.LoadCivilLevelListSuccess(info.token, { list: response })),
                catchError(error => of(new Chaser.LoadCivilLevelListFail(info.token))))
        ));

    @Effect()
    changeCivilClass$ = this.actions$.pipe(ofType<Chaser.ChangeCivilClass>(Chaser.CHANGE_CIVIL_CLASS),
        map(action => new Chaser.LoadCivilLevelList(action.token)));

}
