import { AttType } from './../../core/lib/timeRecord';
import { CivilDropDownData } from './../../civil-time-recording-desktop/model/interfaces';
import { CivilClassObj } from './../../civil-class-management/model/interfaces';
import { GetOutlookJournalStatusSuccess } from './../../mail-item-core/actions/item';
import { delayWhen, catchError, take, switchMap, map, mergeMap, filter, tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Store, Action } from '@ngrx/store';
import { of, from, combineLatest } from 'rxjs';
import { Effect, Actions, ofType } from '@ngrx/effects';
import * as Core from '../actions/core';
import { AddNoteValidationInfo, RequiredField, DiaryInput, FileInfoInput } from '../models/interfaces';
import { AddNoteService } from '../services/add-note.service';
import {
    getAddNoteAppIdByToken, getAddNoteMatterFeeEarnerByToken, getIsFolderLoadedByToken,
    getAddNoteSelectedFeeEarnerByToken, getAddnoteRateCategoryIdByToken,
    getAddNoteExtraRateByToken, getAddNoteExtraUnitByToken, getAddNoteRateByToken, getFileNoteUnitByToken,
    getAddNoteUnchargedStateByToken, getAddNoteSelecteExtraTimeType, getAddNoteMatterDataByToken,
    getAddNoteStateByToken, getAddNoteIsInitLoadingByToken,
    getAddNoteDiaryTypeListByToken, getAddNoteMatterRefByToken,
    getAddNoteIsEditMode, getAddNoteUIdByToken, getCrimeClassIdentityViewModel, getDiaryTypesByAppId, getAddNoteDateDoneByToken, getCivilClassList
} from '../reducers';
import { DiaryRecType, SubmitType } from '../models/enumeration';
import { DatePipe } from '@angular/common';
import { AddNoteState } from '../reducers/add-note';
import { eBillingType, MatterAppCode } from '../../core/lib/matter';
import { checkTimeRecordType, getUser, User } from '../../auth';
import { RequestAddDiaryRecordsForPlotMattters } from '../../matter-linked-core';
import { dpsNewDate } from '../../utils/javascriptDate';
import { AddNoteInPutData, AddNoteItemsType } from '../../core/lib/addNote';
import { AuthInfoStateService } from '../../auth';
import { DriveItem } from '../../core/lib/microsoft-graph';
import { msgExtensions } from '../../core';
import { GetOutlookJournalStatus } from '../../mail-item-core';
import { AddTimeType } from '../../core/lib/timeRecord';
import { ClassObj } from '../../crime-management-core/models/interfaces';

@Injectable()
export class AddNoteEffects {
    constructor(private actions$: Actions, private store: Store<any>,
        private service: AddNoteService, private datePipe: DatePipe,
        private authHelper: AuthInfoStateService) { }

    @Effect()
    initAddNoteData$ = this.actions$.pipe(ofType<Core.InitAddNote>(Core.INIT_ADD_NOTE),
        mergeMap((action) => {
            const actions: Action[] = [
                new Core.LoadFolderList(action.token),
                new Core.LoadUserGradeList(action.token),
                new Core.LoadFeeEarnerList(action.token),
                new Core.LoadDiaryTypeList(action.token),
                new Core.LoadActionList(action.token),
                new Core.CreateAddNoteHeader(action.token),
                new Core.LoadDefultFolder(action.token),
                new Core.LoadExtraTimeTypeTypeList(action.token),
                new Core.LoadMatterDataList(action.token),
                new Core.GetEditViewData(action.token)
            ];
            if (action.payload.inPutData.matterData.AppCode === MatterAppCode.CR) {
                actions.push(new Core.GetClassType(action.token, {
                    branchId: action.payload.inPutData.matterData.BranchID,
                    appId: action.payload.inPutData.matterData.AppID,
                    fileId: action.payload.inPutData.matterData.FileID
                }));
            }

            const matterData = action.payload.inPutData.matterData;
            if (matterData.AppCode === MatterAppCode.MA && matterData.isLegalAid) {
                actions.push(new Core.GetCivilClass(action.token, {
                    branchId: matterData.BranchID,
                    appId: matterData.AppID,
                    fileId: matterData.FileID
                }));
            }

            if (action.payload && action.payload.inPutData && action.payload.inPutData.matterData
                && action.payload.inPutData.matterData.eBilling) {
                if (action.payload.inPutData.matterData.eBilling === eBillingType.PrecedentH) {
                    return from(actions.concat([
                        new Core.LoadWorkTypeList(action.token)
                    ]));
                } else if (action.payload.inPutData.matterData.eBilling === eBillingType.PrecedentS) {
                    return from(actions.concat([
                        new Core.LoadPhaseList(action.token),
                        new Core.LoadActivitiList(action.token),
                        new Core.LoadTaskList(action.token)
                    ]));
                } else {
                    return from(actions);
                }
            } else if (action.payload && action.payload.inPutData && action.payload.inPutData.matterData) {
                return from(actions);
            }
            return from([]);
        }));

    @Effect()
    initUploadItems$ = this.actions$.pipe(ofType<Core.InitAddNote>(Core.INIT_ADD_NOTE),
        filter(action => {
            const items = this.getItems(action.payload.inPutData);
            return !action.payload.inPutData.isEdit && items && items.length > 0;
        }),
        map(action => new Core.UploadItems(action.token, { inPutData: action.payload.inPutData }))
    );

    @Effect()
    uploadItems$ = this.actions$.pipe(ofType<Core.UploadItems>(Core.UPLOAD_ITEMS),
        switchMap(action => this.store.select(getAddNoteDateDoneByToken(action.token)).pipe(
            filter(dateDone => !!dateDone),
            take(1),
            map(dateDone => ({ dateDone, action }))
        )),
        switchMap(({ dateDone, action }) => this.service.uploadItems(action.payload.inPutData, dateDone).pipe(
            map(itemDataList => new Core.UploadItemsSuccess(action.token, { itemDataList })),
            catchError(error => of(new Core.UploadItemsFail(action.token, error)))
        ))
    );

    @Effect()
    uploadItemsSuccess$ = this.actions$.pipe(ofType<Core.UploadItemsSuccess>(Core.UPLOAD_ITEMS_SUCCESS),
        mergeMap(action => from(action.payload.itemDataList
            .filter(item => item.extension.toLowerCase() === 'msg' || item.extension.toLowerCase() === 'eml')
            .map(item => new Core.GetMsgData(action.token, { itemData: item }))
        ))
    );

    @Effect()
    getMsgData$ = this.actions$.pipe(ofType<Core.GetMsgData>(Core.GET_MSG_DATA),
        switchMap(action =>
            combineLatest(
                this.store.select(getUser),
                this.store.select(getAddNoteMatterDataByToken(action.token)),
                ((user, matterData) =>
                ({
                    user, matterData, action
                }))
            ).pipe(take(1))

        ),
        mergeMap(({ action, matterData, user }) =>
            this.service.getMsgData(action.payload.itemData, matterData).pipe(
                map(itemData => new Core.GetMsgDataSuccess(action.token, { itemData, dateTimeOffset: user.general.dateTimeOffset })),
                catchError(error => of(new Core.GetMsgDataFail(action.token, { itemData: action.payload.itemData, error })))
            ))
    );

    @Effect()
    changeClassType$ = this.actions$.pipe(ofType<Core.ChangeClassType>(Core.CHANGE_CLASS_TYPE),
        map(action => new Core.LoadAttTypeList(action.token)));

    @Effect()
    changeAttType$ = this.actions$.pipe(ofType<Core.ChangeAttType>(Core.CHANGE_ATT_TYPE),
        map(action => new Core.RequestItemRate(action.token)));
    @Effect()
    changeIsTelephoneAdv$ = this.actions$.pipe(ofType<Core.ChangeIsTelephoneAdv>(Core.CHANGE_IS_TELEPHONE_ADV),
        map(action => new Core.RequestItemRate(action.token)));

    @Effect()
    loadAttTypeListData$ = this.actions$.pipe(ofType<Core.LoadAttTypeList>(Core.LOAD_ATT_TYPE_LIST),
        switchMap((action: Core.LoadAttTypeList) =>
            this.store.select(getCrimeClassIdentityViewModel(action.token)).pipe(
                map(model => ({ model: model, token: action.token })),
                take(1))),
        switchMap((info) =>
            this.service.getCrimeWorkTypes(info.model).pipe(map((response) =>
                new Core.LoadAttTypeListSuccess(info.token, { attTypes: response })),
                catchError(error => of(new Core.LoadAttTypeListFail(info.token))))
        ));

    @Effect()
    loadAttTypeListSuccess$ = this.actions$.pipe(ofType<Core.LoadAttTypeListSuccess>(Core.LOAD_ATT_TYPE_LIST_SUCCESS),
        map(action => new Core.RequestItemRate(action.token)));

    // Crime
    @Effect()
    getClassType$ = this.actions$.pipe(ofType<Core.GetClassType>(Core.GET_CLASS_TYPE),
        switchMap(action =>
            this.service.getClassType(action.payload).pipe(
                map(responce => new Core.GetClassTypeSuccess(action.token, { list: responce })),
                catchError(e => of(new Core.GetClassTypeFail(action.token))))));

    @Effect()
    getClassTypeSuccess$ = this.actions$.pipe(ofType<Core.GetClassTypeSuccess>(Core.GET_CLASS_TYPE_SUCCESS),
        switchMap(action => this.store.select(getAddNoteIsEditMode(action.token)).pipe(
            take(1), filter(isEdit => !isEdit), map(() => new Core.LoadAttTypeList(action.token))
        ))
    );



    // Civil
    @Effect()
    getCivilClass$ = this.actions$.pipe(ofType<Core.GetCivilClass>(Core.GET_CIVIL_CLASS),
        switchMap(action =>
            this.service.getCivilClassList(action.payload).pipe(
                map(responce => new Core.GetCivilClassSuccess(action.token, { list: responce })),
                catchError(e => of(new Core.GetCivilClassFail(action.token))))));

    @Effect()
    getCivilClassSuccess$ = this.actions$.pipe(ofType<Core.GetCivilClassSuccess>(Core.GET_CIVIL_CLASS_SUCCESS),
        map(action => new Core.LoadCivilLevelList(action.token)
        )
    );

    @Effect()
    loadCivilLevelList$ = this.actions$.pipe(ofType<Core.LoadCivilLevelList>(Core.GET_CIVIL_LEVELS),
        switchMap((action: Core.LoadCivilLevelList) =>
            this.store.select(getCivilClassList(action.token)).pipe(
                map(classList => ({ selectClass: classList.find(i => i.selected), token: action.token })),
                take(1))),
        switchMap((info) =>
            this.service.getCivilClassLevels(info.selectClass).pipe(map((response) =>
                new Core.LoadCivilLevelListSuccess(info.token, { list: response })),
                catchError(error => of(new Core.LoadCivilLevelListFail(info.token))))
        ));

    @Effect()
    changeCivilClass$ = this.actions$.pipe(ofType<Core.ChangeCivilClass>(Core.CHANGE_CIVIL_CLASS),
        map(action => new Core.LoadCivilLevelList(action.token)));

    @Effect()
    changeCivilLevel$ = this.actions$.pipe(ofType<Core.ChangeCivilLevel>(Core.CHANGE_CIVIL_LEVEL),
        map(action => new Core.RequestItemRate(action.token)));

    @Effect()
    changeCivilCourt$ = this.actions$.pipe(ofType<Core.ChangeCivilCourt>(Core.CHANGE_CIVIL_COURT),
        map(action => new Core.RequestItemRate(action.token)));

    @Effect()
    loadCivilLevelListSuccess$ = this.actions$.pipe(ofType<Core.LoadCivilLevelListSuccess>(Core.GET_CIVIL_LEVELS_SUCCESS),
        map(action => new Core.RequestItemRate(action.token)));

    // ---

    @Effect()
    loadMatterRatCat$ = this.actions$.pipe(ofType<Core.LoadMatterDataList>(Core.GET_MATTER_DATA_FROM_MATTER_RAF),
        switchMap((action: Core.LoadMatterDataList) =>
            this.store.select(getAddNoteStateByToken(action.token)).pipe(
                map((state) => ({ state, token: action.token })),
                take(1))
        ),
        switchMap((info) => {
            return this.service.getMatterFromMatRef(info.state.matterData.MatterReferenceNo).pipe(
                map((response) =>
                    new Core.LoadMatterDataSuccess(info.token, { matterRefCat: response })),
                catchError(error => of(new Core.LoadMatterDataFail(info.token, error))));

        }));

    @Effect()
    updateDeletePostEntries$ = this.actions$.pipe(ofType<Core.UpdateDeletePostEntries>(Core.UPDATE_DELETE_POST_ENTRY),
        switchMap((action) => {
            return this.service.updateDeletePostEntries(action.payload.request).pipe(
                map((response) =>
                    new Core.UpdateDeletePostEntriesSuccess(action.token)),
                catchError(error => of(new Core.UpdateDeletePostEntriesFail(action.token))));

        }));

    @Effect()
    checkAllLoad$ = this.actions$.pipe(ofType<Core.InitAddNote>(Core.INIT_ADD_NOTE),
        switchMap((info) =>
            this.store.select(getAddNoteIsInitLoadingByToken(info.token)).pipe(filter((isLoading) => isLoading === false),
                take(1), map(() => new Core.InitAddNoteSuccess(info.token, { isEdit: info.payload.inPutData.isEdit })))
        ));

    @Effect()
    loadInitialRate$ = this.actions$.pipe(ofType<Core.InitAddNoteSuccess>(Core.INIT_ADD_NOTE_SUCCESS),
        switchMap((action) =>
            this.store.select(getAddNoteIsInitLoadingByToken(action.token)).pipe(filter((isLoading) => isLoading === false),
                take(1),
                mergeMap<any, Core.Any>(info => {
                    if (!action.payload.isEdit) {
                        return from([new Core.RequestItemRate(action.token),
                        new Core.RequestExtraRate(action.token)]);
                    } else {
                        return from([new Core.AllDataUpDate(action.token)]);
                    }
                }
                ))));

    @Effect()
    getItemRate$ = this.actions$.pipe(ofType<Core.RequestItemRate>(Core.REQUEST_ITEM_RATE),
        switchMap((action: Core.RequestItemRate) =>
            this.store.select(getAddNoteStateByToken(action.token)).pipe(
                map((store) => ({ store, token: action.token })),
                take(1))
        ), delayWhen((info) => this.store.select(getIsFolderLoadedByToken(info.token)).pipe(filter((success) => success))),
        switchMap((info) => {
            const classId = this.getClassId(info.store.matterData.AppCode, info.store.classType, info.store.civilClassList);
            const subClassId = this.getSubClassId(info.store.matterData.AppCode, info.store.attTypes, info.store.civilLevelList);
            let court = null;
            if (info.store.matterData.AppCode === MatterAppCode.MA) {
                court = info.store.civilCourtList && info.store.civilCourtList.find(cl => cl.selected) ? info.store.civilCourtList.find(cl => cl.selected).id : 0;
            };
            const appId = info.store.matterData.AppID,
                isLegalAid = info.store.matterData.isLegalAid,
                appCode = info.store.matterData.AppCode,
                branchId = info.store.matterData.BranchID,
                fileId = info.store.matterData.FileID,
                weekendWork = false,
                telephoneAdvice = info.store.telephoneAdvice;
            const selectedFeeEarner = info.store.feeEarnerList ?
                info.store.feeEarnerList.find((feeEarner) => feeEarner.selected).groupName : null;
            const rateCategory = info.store.matRatCategory;
            const selectedType = info.store.diaryTypeList && info.store.diaryTypeList.find((diary) => diary.selected) ?
                info.store.diaryTypeList.find((diary) => diary.selected).value : null;
            let gradeValue = null;
            if (info.store.timeUseFeeEarnerRatesValueDisable === false) {
                gradeValue = info.store.userGradeList && info.store.userGradeList.find((diary) => diary.selected) ?
                    info.store.userGradeList.find((diary) => diary.selected).value : null;
            }
            // civil
            let classType = null;
            if (appCode === MatterAppCode.MA) {
                const selectCivlClass = info.store.civilClassList && info.store.civilClassList.find(i => i.selected);
                if (selectCivlClass) {
                    classType = selectCivlClass.classType
                }
            }
            return this.service.getItemRate(appId, selectedFeeEarner, rateCategory, selectedType, gradeValue,
                isLegalAid, appCode, branchId, fileId, classId, subClassId, weekendWork, telephoneAdvice, classType, court).pipe(
                    map((response) =>
                        new Core.GetItemRate(info.token, {
                            rate: response.rate,
                            error: response.error
                        })
                    ), catchError(error => of())); // to do
            // }
        }));

    @Effect()
    getExtraRate$ = this.actions$.pipe(ofType<Core.RequestExtraRate>(Core.REQUEST_EXTRA_RATE),
        switchMap((action: Core.RequestExtraRate) =>
            this.store.select(getAddNoteStateByToken(action.token)).pipe(
                map((store) => ({ store, token: action.token })),
                take(1))
        ), delayWhen((info) => this.store.select(getIsFolderLoadedByToken(info.token)).pipe(filter((success) => success))),
        switchMap((info) => {
            const appId = info.store.matterData.AppID;
            const selectedFeeEarner = info.store.feeEarnerList ?
                info.store.feeEarnerList.find((feeEarner) => feeEarner.selected).groupName : null;
            const rateCategory = info.store.matRatCategory;
            const extraRecTypeValue = info.store.extraTimeType && info.store.extraTimeType.find((type) => type.selected) ?
                (info.store.extraTimeType.find((type) => type.selected).dtL_RecType)
                : null;
            return this.service.getExtraRate(appId, selectedFeeEarner, rateCategory, extraRecTypeValue).pipe(
                map((response) =>
                    new Core.GetExtraRate(info.token, {
                        rate: response
                    })
                ), catchError(error => of())); // to do
            // }
        }));

    @Effect()
    changeFileData$ = this.actions$.pipe(ofType<Core.ChangeFileData>(Core.CHANGE_FILE_DATA),
        filter(action => action.payload.fileDataList && action.payload.fileDataList.length > 0),
        switchMap((action: Core.ChangeFileData) =>
            this.store.select(getAddNoteStateByToken(action.token)).pipe(take(1), map(state => ({ state, action })))
        ),
        mergeMap<{ state: AddNoteState, action: Core.ChangeFileData }, any>(({ state, action }) => {
            const diaryType = state.diaryTypeList ? state.diaryTypeList.find(val => val.selected) : null;
            const fileExtension = action.payload.fileDataList[0].name.split('.').pop().toLowerCase();
            if (diaryType && (diaryType.value === DiaryRecType.EMAIL_IN || diaryType.value === DiaryRecType.EMAIL_OUT) &&
                !msgExtensions.includes(fileExtension)) {
                return from([new Core.EmailInValidation(action.token, {
                    validation: {
                        status: false,
                        msg: `Please select file format(msg or eml) for ${diaryType.text}`
                    },
                    fileData: null
                })]);
            }
            let addNoteItemsType = AddNoteItemsType.FileItems;
            if ((action.payload.fileDataList[0] as DriveItem).file) {
                addNoteItemsType = AddNoteItemsType.DriveItems;
            }
            let diaryRecType = diaryType ? diaryType.value : null;
            if (action.payload.fileDataList.length > 1) {
                if (state.matterData.isProspectMatter) {
                    diaryRecType = DiaryRecType.FILE_NOTE;
                } else {
                    if (fileExtension) {
                        diaryRecType = (fileExtension === 'msg' || fileExtension === 'eml') ? DiaryRecType.EMAIL_IN :
                            DiaryRecType.LETTER_IN;
                    }
                }
            }
            const inPutData: AddNoteInPutData = {
                isEdit: false,
                matterData: state.matterData,
                diaryType: DiaryRecType.LETTER_IN,
                legalAid: state.legalAid,
                addNoteItemsType: addNoteItemsType,
                driveItemList: addNoteItemsType === AddNoteItemsType.DriveItems ? action.payload.fileDataList as DriveItem[] : null,
                fileItemList: addNoteItemsType === AddNoteItemsType.FileItems ? action.payload.fileDataList as File[] : null
            };
            if (diaryRecType && diaryRecType !== diaryType.value) {
                return from([
                    new Core.UploadItems(action.token, { inPutData }),
                    new Core.ChangeDiaryType(action.token, { diaryType: state.diaryTypeList.find(val => val.value === diaryRecType) })
                ]);
            }

            return from([new Core.UploadItems(action.token, { inPutData })]);
        }));


    @Effect()
    getEditViewData$ = this.actions$.pipe(ofType<Core.GetEditViewData>(Core.GET_EDIT_VIEW_DATA),
        switchMap((action: Core.GetEditViewData) =>
            combineLatest(
                this.store.select(getAddNoteIsEditMode(action.token)),
                this.store.select(getAddNoteUIdByToken(action.token)),
                ((isEdit, uid) => ({ isEdit, uid, token: action.token }))
            ).pipe(take(1))
        ), switchMap((info) => {
            if (info.isEdit) {
                return this.service.getDiaryRecordById(info.uid).pipe(
                    switchMap((response) => {
                        return this.store.select(getAddNoteIsInitLoadingByToken(info.token))
                            .pipe(filter((isLoading) => isLoading === false),
                                take(1), map(() => {
                                    return new Core.GetEditViewDataSuccess(info.token, { editViewData: response });
                                }));
                    }),
                    catchError(error => of(new Core.GetEditViewDataFail(info.token, error))
                    ));
            } else {
                return of(new Core.GetEditViewDataSuccess(info.token, { editViewData: null }));
            }
        }));


    @Effect()
    loadRateWhenChangeDiaryType$ = this.actions$.pipe(ofType<Core.ChangeDiaryType>(Core.CHANGE_DIARY_TYPE),
        switchMap((info) =>
            this.store.select(getAddNoteIsInitLoadingByToken(info.token)).pipe(filter((isLoading) => isLoading === false),
                take(1), map(() => {
                    return new Core.RequestItemRate(info.token);
                }
                ))));

    @Effect()
    loadExtraRateWhenChangeExtraDiaryType$ = this.actions$.pipe(ofType<Core.ChangeGrade>(Core.CHANGE_GRADE),
        switchMap((info) =>
            this.store.select(getAddNoteIsInitLoadingByToken(info.token)).pipe(filter((isLoading) => isLoading === false),
                take(1), map(() => {
                    return new Core.RequestItemRate(info.token);
                }
                ))));

    @Effect()
    loadExtraTimeTypeTypeList$ = this.actions$.pipe(ofType<Core.LoadExtraTimeTypeTypeList>(Core.LOAD_TIME_TYPE_LIST),
        switchMap((action: Core.LoadExtraTimeTypeTypeList) =>
            this.store.select(getAddNoteAppIdByToken(action.token)).pipe(
                map((appId) => ({ appId, token: action.token })),
                take(1))
        ),
        switchMap((info) => {
            return this.service.getExtraTimeTypeList(info.appId).pipe(
                map((response) =>
                    new Core.LoadExtraTimeTypeListSuccess(info.token, { extraTimeType: response })),
                catchError(error => of(new Core.LoadExtraTimeTypeListFail(info.token, error))));

        }));

    @Effect()
    loadDefultFolder$ = this.actions$.pipe(ofType<Core.LoadDefultFolder>(Core.LOAD_DEFULT_FOLDER),
        switchMap((action: Core.LoadDefultFolder) =>
            combineLatest(
                this.store.select(getAddNoteStateByToken(action.token)),
                this.store.select(getAddNoteAppIdByToken(action.token)),
                this.store.select(getAddNoteIsEditMode(action.token)),
                ((state, appId, isEdit) => ({ state, appId, isEdit, token: action.token }))
            ).pipe(take(1),
                delayWhen((info) => this.store.select(getIsFolderLoadedByToken(info.token)).pipe(filter((isLoaded) => isLoaded),
                    take(1))))
        ),
        switchMap(({ state, appId, isEdit, token }) => {
            if (state.addNoteItemsType === AddNoteItemsType.LetterEnginItems && state.itemDataList && state.itemDataList.length > 0) {
                return of(new Core.LoadDefultFolderSuccess(token,
                    { defualtFolder: state.columnFolderId }));
            } else {
                return this.service.getDefaultFolder(appId).pipe(
                    map((response) =>
                        new Core.LoadDefultFolderSuccess(token, {
                            defualtFolder: response
                        })

                    ), catchError(error => of(new Core.LoadDefultFolderFail(token, error))));
            }
        }));

    @Effect()
    loadFolderListData$ = this.actions$.pipe(ofType<Core.LoadFolderList>(Core.LOAD_FOLDER_LIST),
        switchMap((action: Core.LoadFolderList) =>
            this.store.select(getAddNoteAppIdByToken(action.token)).pipe(
                map((appId) => ({ appId, token: action.token })),
                take(1))
        ),
        switchMap((info) => {
            return this.service.getFolderList(info.appId).pipe(
                map((response) =>
                    new Core.LoadFolderListSuccess(info.token, {
                        folderList: response
                    })),
                catchError(error => of(new Core.LoadFolderListFail(info.token, error))));
        }));

    @Effect()
    loadDiaryTypeListData$ = this.actions$.pipe(ofType<Core.LoadDiaryTypeList>(Core.LOAD_DIARY_TYPE_LIST),
        switchMap((action) =>
            this.store.select(getAddNoteAppIdByToken(action.token)).pipe(take(1), map(appId => ({ appId, token: action.token })))
        ), switchMap(({ appId, token }) =>
            this.store.select(getDiaryTypesByAppId(appId)).pipe(take(1), map(diaryTypes => ({ appId, diaryTypes, token })))
        ),
        switchMap(({ appId, diaryTypes, token }) => {
            if (diaryTypes && diaryTypes.length > 0) {
                return of(new Core.LoadDiaryTypeListSuccess(token, { diaryTypeList: diaryTypes, appId }));
            }
            return this.service.getDiaryTypeList(appId).pipe(
                map((response) => new Core.LoadDiaryTypeListSuccess(token, { diaryTypeList: response, appId })),
                catchError(error => of(new Core.LoadDiaryTypeListFail(token, error))));
        }));

    @Effect()
    loadActionList$ = this.actions$.pipe(ofType<Core.LoadActionList>(Core.LOAD_ACTION_LIST),
        switchMap((action: Core.LoadActionList) =>
            this.service.getActionList().pipe(map((response) =>
                new Core.LoadActionListSuccess(action.token, { ActionTypeList: response })),
                catchError(error => of(new Core.LoadActionListFail(action.token, error))))
        ));

    @Effect()
    loadUserGradeListData$ = this.actions$.pipe(ofType<Core.LoadUserGradeList>(Core.LOAD_USER_GRADE_LIST),
        switchMap((action: Core.LoadUserGradeList) =>
            combineLatest(
                this.store.select(getAddNoteMatterFeeEarnerByToken(action.token)),
                this.store.select(getAddNoteAppIdByToken(action.token)),
                ((matterFeeEarner, appId) => ({ matterFeeEarner, appId, token: action.token }))
            ).pipe(
                take(1))
        ),
        switchMap((info) =>
            this.service.getUserGradeFullData(info.matterFeeEarner, info.appId).pipe(
                map((response) =>
                    new Core.LoadUserGradeListSuccess(info.token, {
                        userGradeList: response.gradeListResponse,
                        defualtUserGrade: response.defualtGradeResponse
                    })
                ),
                catchError(error => of(new Core.LoadUserGradeListFail(info.token, error))))
        ));

    @Effect()
    loadFeeEarnerListData$ = this.actions$.pipe(ofType<Core.LoadFeeEarnerList>(Core.LOAD_FEE_EARNER_LIST),
        // .do(() => console.log('loadFeeEarnerListData '))
        switchMap((action: Core.LoadFeeEarnerList) =>
            this.service.getFeeEarnerList(getAddNoteAppIdByToken(action.token).toString()).pipe(map((response) =>
                new Core.LoadFeeEarnerListSuccess(action.token, { feeEarnerList: response })),
                catchError(error => of(new Core.LoadFeeEarnerListFail(action.token, error))))
        ));

    @Effect()
    changeRate$ = this.actions$.pipe(ofType<Core.ChangeRate>(Core.CHANGE_RATE),
        switchMap((action: Core.ChangeRate) =>
            this.getParamforCalculateItemValue(action)
        ),
        switchMap((info) => {
            const selectedType = info.diaryType && info.diaryType.find((diary) => diary.selected) ?
                info.diaryType.find((diary) => diary.selected).value : null;
            return this.service.getCalculateItemValue(info.appId, info.matterData.BranchID, info.matterData.FileID,
                info.unit, info.rate, info.uncharged, selectedType, info.matterData.isLegalAid, info.matterData.AppCode).pipe(
                    map((response) =>
                        new Core.ClaculateItemValue(info.token, { fileNoteValue: response })),
                    catchError(error => of(
                        // new Core.AddNoteSaveFail(info.token, { AddNoteSuccessInfo: { isSuccess: true, msg: 'Change rate fail.' } })
                    )));
        }));

    @Effect()
    reCalValueWhileChangeTheRate$ = this.actions$.pipe(ofType<Core.GetItemRate>(Core.GET_ITEM_RATE),
        switchMap(action =>
            this.getParamforCalculateItemValue(action)
        ),
        switchMap<any, any>((info) => {
            if (info.matterData) {
                const selectedType = info.diaryType && info.diaryType.find((diary) => diary.selected) ?
                    info.diaryType.find((diary) => diary.selected).value : null;
                return this.service.getCalculateItemValue(info.appId, info.matterData.BranchID, info.matterData.FileID,
                    info.unit, info.rate, info.uncharged, selectedType, info.matterData.isLegalAid, info.matterData.AppCode).pipe(
                        map((response) =>
                            new Core.ClaculateItemValue(info.token, { fileNoteValue: response })),
                        catchError(error => of(
                            // new Core.AddNoteSaveFail(info.token, { AddNoteSuccessInfo: { isSuccess: true, msg: 'Change rate fail.' } })
                        )));
            } else {
                return of(new Core.AllDataUpDate(info.token));
            }

        }));

    @Effect()
    reCalExtraValueWhileChangeTheRate$ = this.actions$.pipe(ofType<Core.GetExtraRate>(Core.GET_EXTRA_RATE),
        switchMap((action: Core.GetExtraRate) =>
            this.getcalculateExtraItemValue(action)
        ),
        switchMap((info) => {
            return this.service.getcalculateExtraItemValue(info.appId, info.feeEarner,
                info.rateCategory, info.extraUnit, info.extraRate, info.extraType).pipe(
                    map((response) =>
                        new Core.ClaculateExtraItemValue(info.token, { extraValue: response })),
                    catchError(error => of(
                        // new Core.AddNoteSaveFail(info.token, { AddNoteSuccessInfo: { isSuccess: true, msg: 'Change extra unit fail.' } })
                    )));
        }));

    @Effect()
    changeUnit$ = this.actions$.pipe(ofType<Core.ChangeUnit>(Core.CHANGE_UNIT),
        switchMap((action: Core.ChangeUnit) =>
            this.getParamforCalculateItemValue(action)
        ),
        switchMap((info) => {
            const selectedType = info.diaryType && info.diaryType.find((diary) => diary.selected) ?
                info.diaryType.find((diary) => diary.selected).value : null;
            return this.service.getCalculateItemValue(info.appId, info.matterData.BranchID, info.matterData.FileID,
                info.unit, info.rate, info.uncharged, selectedType, info.matterData.isLegalAid, info.matterData.AppCode).pipe(
                    map((response) =>
                        new Core.ClaculateItemValue(info.token, { fileNoteValue: response })),
                    catchError(error => of(
                        // new Core.AddNoteSaveFail(info.token, { AddNoteSuccessInfo: { isSuccess: true, msg: 'Change unit fail.' } })
                    )));
        }));

    @Effect()
    changeUncharged$ = this.actions$.pipe(ofType<Core.ChangeIsUncharge>(Core.CHANGE_UNCHARGE),
        switchMap((action: Core.ChangeIsUncharge) =>
            this.getParamforCalculateItemValue(action)
        ),
        switchMap((info) => {
            if (!info.uncharged) {
                const selectedType = info.diaryType && info.diaryType.find((diary) => diary.selected) ?
                    info.diaryType.find((diary) => diary.selected).value : null;
                return this.service.getCalculateItemValue(info.appId, info.matterData.BranchID, info.matterData.FileID,
                    info.unit, info.rate, info.uncharged, selectedType, info.matterData.isLegalAid, info.matterData.AppCode).pipe(
                        map((response) =>
                            new Core.ClaculateItemValue(info.token, { fileNoteValue: response })),
                        catchError(error => of()));
            } else {
                return of(new Core.ClaculateItemValue(info.token, { fileNoteValue: 0 }));
            }

        }));

    @Effect()
    changeExtraUnit$ = this.actions$.pipe(ofType<Core.ChangeExtraUnit>(Core.CHANGE_EXTRA_UNIT),
        switchMap((action: Core.ChangeExtraUnit) =>
            this.getcalculateExtraItemValue(action)
        ),
        switchMap((info) => {
            return this.service.getcalculateExtraItemValue(info.appId, info.feeEarner,
                info.rateCategory, info.extraUnit, info.extraRate, info.extraType).pipe(
                    map((response) =>
                        new Core.ClaculateExtraItemValue(info.token, { extraValue: response })),
                    catchError(error => of(
                        // new Core.AddNoteSaveFail(info.token, { AddNoteSuccessInfo: { isSuccess: true, msg: 'Change extra unit fail.' } })
                    )));
        }));

    @Effect()
    changeExtraRate$ = this.actions$.pipe(ofType<Core.ChangeExtraRate>(Core.CHANGE_EXTRA_RATE),
        switchMap((action: Core.ChangeExtraRate) =>
            this.getcalculateExtraItemValue(action)
        ),
        switchMap((info) => {
            return this.service.getcalculateExtraItemValue(info.appId, info.feeEarner,
                info.rateCategory, info.extraUnit, info.extraRate, info.extraType).pipe(
                    map((response) =>
                        new Core.ClaculateExtraItemValue(info.token, { extraValue: response })),
                    catchError(error => of(
                        // new Core.AddNoteSaveFail(info.token, { AddNoteSuccessInfo: { isSuccess: true, msg: 'Change extra rate fail.' } })
                    )));
        }));

    // @Effect()
    // changeExtraTimeType$ = this.actions$.pipe(ofType<Core.ChangeExtraTimeType>(Core.CHANGE_EXTRA_TIME_TYPE),
    //     switchMap((action: Core.ChangeExtraTimeType) =>
    //         this.getcalculateExtraItemValue(action)
    //     ),
    //     switchMap((info) => {
    //         return this.service.getcalculateExtraItemValue(info.appId, info.feeEarner,
    //             info.rateCategory, info.extraUnit, info.extraRate, info.extraType).pipe(
    //                 map((response) =>
    //                     new Core.ClaculateExtraItemValue(info.token, { extraValue: response })),
    //                 catchError(error => of(
    //                new Core.AddNoteSaveFail(info.token, { AddNoteSuccessInfo: { isSuccess: true, msg: 'Change extra time fail.' } })
    //                 )));
    //     }));
    @Effect()
    changeExtraTimeType$ = this.actions$.pipe(ofType<Core.ChangeExtraTimeType>(Core.CHANGE_EXTRA_TIME_TYPE),
        map(action => new Core.RequestExtraRate(action.token)));
    @Effect()
    changeFeeEarner$ = this.actions$.pipe(ofType<Core.ChangefeeEarner>(Core.CHANGE_FEE_EARNER),
        switchMap((action: Core.ChangefeeEarner) =>
            this.getcalculateExtraItemValue(action)
        ),
        switchMap((info) => {
            return this.service.getcalculateExtraItemValue(info.appId, info.feeEarner,
                info.rateCategory, info.extraUnit, info.extraRate, info.extraType).pipe(
                    map((response) =>
                        new Core.ClaculateExtraItemValue(info.token, { extraValue: response })),
                    catchError(error => of(
                        // new Core.AddNoteSaveFail(info.token, { AddNoteSuccessInfo: { isSuccess: true, msg: 'Change feeEarner fail.' } })
                    )));
        }));
    @Effect()
    loadRateWhenChangefeeEarner$ = this.actions$.pipe(ofType<Core.ChangefeeEarner>(Core.CHANGE_FEE_EARNER),
        switchMap((info) =>
            this.store.select(getAddNoteIsInitLoadingByToken(info.token)).pipe(filter((isLoading) => isLoading === false),
                take(1), mergeMap(() => {
                    return from([new Core.RequestItemRate(info.token),
                    new Core.RequestExtraRate(info.token)]);
                }
                ))));


    @Effect()
    addNoteSubmit$ = this.actions$.pipe(ofType<Core.AddNoteSubmit>(Core.ADD_NOTE_SUBMIT),
        switchMap(action =>
            this.store.select(getAddNoteStateByToken(action.token)).pipe(
                map((store) => ({
                    store, token: action.token, fileIndex: action.payload.fileIndex,
                    submitType: action.payload.submitType, password: action.payload.password
                })),
                take(1)
            )
        ),
        switchMap((info) => {
            const requiredField: RequiredField = {
                feeEarner: info.store.feeEarnerList.find((feeEarner) => feeEarner.selected) ?
                    info.store.feeEarnerList.find((feeEarner) => feeEarner.selected).groupName[0] : null,
                diaryType: info.store.diaryTypeList.find((diary) => diary.selected) ?
                    info.store.diaryTypeList.find((diary) => diary.selected) : null,
                folder: info.store.folderList.find((folder) => folder.selected) ?
                    info.store.folderList.find((folder) => folder.selected).folderId : null, // value[0]
                dateDone: info.store.dateDone,
                note: info.store.note,
                unit: info.store.unit,
                extraUnit: info.store.extraUnit,
                rate: info.store.rate,
                extraRate: info.store.extraRate,
                eBillingType: info.store.eBillingType,
                workType: info.store.workTypeList ? info.store.workTypeList.find((detail) => detail.selected) : null,
                activiti: info.store.activitiList ? info.store.activitiList.find((detail) => detail.selected) : null,
                phase: info.store.phaseList ? info.store.phaseList.find((detail) => detail.selected) : null,
                phaseWiseTask: info.store.phaseWiseTaskList ? info.store.phaseWiseTaskList.find((detail) => detail.selected) : null,
            };
            const validInformation: AddNoteValidationInfo = this.addNoteValidation(requiredField);
            if (validInformation.status) {
                return of<Action>(new Core.AddNoteSubmitSuccess(info.token, {
                    submitSuccess: true, fileIndex: info.fileIndex, submitType: info.submitType, password: info.password
                }));
            }
            return of<Action>(new Core.AddNoteValidation(info.token, { validation: validInformation }));
        }));

    @Effect()
    addNoteSubmitSuccess$ = this.actions$.pipe(ofType<Core.AddNoteSubmitSuccess>(Core.ADD_NOTE_SUBMIT_SCCEESS),
        switchMap((action: Core.AddNoteSubmitSuccess) =>
            combineLatest(
                this.store.select(getUser),
                this.store.select(getAddNoteStateByToken(action.token)),
                ((user, store) =>
                ({
                    user, store, token: action.token, fileIndex: action.payload.fileIndex,
                    submitType: action.payload.submitType, password: action.payload.password
                }))
            ).pipe(take(1))
        ),
        switchMap((info) => {
            if (info.store.rateError && info.store.rateError.length > 0) {
                return of(new Core.ShowRateError(info.token, info.store.rateError));
            }
            return this.service.saveDiary(this.getDiaryInput(info.user, info.store)).pipe(
                mergeMap<{ diaryId: number, letterName: string }[], any>(data => {
                    if (data.length > 0) {
                        const actions = [];
                        actions.push(new RequestAddDiaryRecordsForPlotMattters(info.token, {
                            diaryIds: data.map(val => val.diaryId),
                            branchId: info.store.matterData.BranchID,
                            appId: info.store.matterData.AppID,
                            fileId: info.store.matterData.FileID
                        }));
                        if (info.store.itemDataList) {
                            const internetMessageIds = info.store.itemDataList.filter(val => val.internetMessageId)
                                .map(val => (val.internetMessageId));
                            if (internetMessageIds && internetMessageIds.length > 0) {
                                actions.push(new GetOutlookJournalStatusSuccess(
                                    internetMessageIds.map((val, i) => ({
                                        diaryId: data[i] ?
                                            data[i].diaryId : data[0].diaryId, emailId: val
                                    }))
                                ));
                                actions.push(new GetOutlookJournalStatus({ internetMessageIds, requiredDelay: true }));
                            }
                        }

                        if (info.store.matterData.isLegalAid && info.store.matterData.AppCode === MatterAppCode.CR) {
                            const recType = info.store.diaryTypeList.find((diary) => diary.selected).value;
                            if (recType !== DiaryRecType.FILE_NOTE) {
                                const classId = (info.store.classType && info.store.classType.find(cl => cl.selected)) ?
                                    info.store.classType.find(cl => cl.selected).rectype : null;
                                actions.push(
                                    new Core.UpdateCrimeClassTotals(info.token,
                                        { branchId: info.store.matterData.BranchID, fileId: info.store.matterData.FileID, classId }
                                    )
                                );
                            }
                        }
                        if (info.submitType === SubmitType.Submit) {
                            actions.push(new Core.AddNoteSaveSuccess(info.token,
                                { AddNoteSuccessInfo: { isSuccess: true, msg: 'Successfully saved.' } }));
                        } else if (info.submitType === SubmitType.SignAndShare) {
                            actions.push(
                                new Core.OpenSignAndShare(info.token, {
                                    password: info.password, fileCredentials: data, isloop: true,
                                    matterData: info.store.matterData, subjectNote: info.store.note
                                }));
                        } else {

                            actions.push(new Core.SignAndShareOrShare(info.token, {
                                fileCredentials: data, signToken: null, submitType: info.submitType,
                                subjectNote: info.store.note,
                                url: null, matterData: info.store.matterData,
                                password: info.password, isloop: true
                            }));
                        }
                        return from(actions);
                    } else {
                        return from([new Core.AddNoteSaveFail(info.token, { AddNoteSuccessInfo: { isSuccess: false, msg: '' } })]);
                    }
                }),
                catchError(error => of(
                    new Core.AddNoteSaveFail(info.token, { AddNoteSuccessInfo: { isSuccess: false, msg: '' } })
                ))
            );
        })
    );

    @Effect()
    checkAddNoteAccess$ = this.actions$.pipe(ofType<Core.CheckAddNoteAccess>(Core.CHECK_ADD_NOTE_ACCESS),
        switchMap((action: Core.CheckAddNoteAccess) =>
            combineLatest(
                this.store.select(getAddNoteMatterRefByToken(action.token)),
                ((matterRef) => ({ matterRef, token: action.token }))
            ).pipe(take(1))
        ), switchMap((info) => {
            return this.service.getIsTimeRecordingEnabled(info.matterRef).pipe(
                map((response) =>
                    new Core.CheckAddNoteAccessSuccess(info.token, { isAccess: response })
                ),
                catchError(
                    error => of(new Core.CheckAddNoteAccessFail(info.token, error))
                ));
        }));
    @Effect()
    getDocumentURL$ = this.actions$.pipe(ofType<Core.OpenAttachment>(Core.OPEN_ATTACHMENT),
        switchMap(action =>
            this.store.select(getAddNoteStateByToken(action.token)).pipe(
                map((state: AddNoteState) => ({ state, action })),
                take(1))
        ),
        map(({ state, action }) => {
            const item = state.itemDataList[action.payload.parentItemIndex];
            const attachment = item.attachments.find(att => att.reference === action.payload.reference);
            const extension = attachment.extension.toLowerCase();
            return { state, action, item, attachment, extension };
        }),
        filter(({ state, action, item, attachment, extension }) => !!attachment.viewReferance),
        switchMap(({ state, action, item, attachment, extension }) => {
            if (extension === 'msg' || extension === 'eml') {
                return this.service.getInlineMsgAttachment(item.letterName, attachment.name,
                    attachment.viewReferance, state.matterData).pipe(
                        map(msg => new Core.GetDocumentURL(action.token,
                            { loading: false, msg, extension: attachment.viewReferance.split('.').pop() }
                        )),
                        catchError(error =>
                            of(new Core.GetDocumentURLFail(action.token, { validation: { status: false, msg: 'Get attachement fail' } }))
                        )
                    );
            } else {
                return this.service.getInlineAttachmentUrl(item.letterName, attachment.name,
                    attachment.viewReferance, state.matterData).pipe(
                        map(url => new Core.GetDocumentURL(action.token,
                            { loading: false, url, extension: attachment.viewReferance.split('.').pop() }
                        )),
                        catchError(error =>
                            of(new Core.GetDocumentURLFail(action.token,
                                {
                                    validation: { status: false, msg: 'Get attachement URL fail' }
                                }
                            ))
                        )
                    );
            }
        })
    );

    @Effect({ dispatch: false })
    downloadMsgInlineAttachement$ = this.actions$.pipe(ofType<Core.DownloadMsgInlineAttachement>(Core.DOWNLOAD_MSG_INLINE_ATTACHEMENT),
        switchMap(action =>
            this.store.select(getAddNoteStateByToken(action.token)).pipe(
                map((state: AddNoteState) => ({ state, action })),
                take(1))
        ),
        switchMap(({ state, action }) => {
            const item = state.itemDataList[action.payload.parentItemIndex];
            return this.service.getInlineAttachmentDownloadUrl(item.letterName, action.payload.attachment.name,
                action.payload.attachment.originalReference, state.matterData).pipe(
                    tap(url => {
                        window.open(url, '_blank');
                    })
                );
        })
    );

    @Effect()
    viewMsgInlineAttachement$ = this.actions$.pipe(ofType<Core.ViewMsgInlineAttachement>(Core.VIEW_MSG_INLINE_ATTACHEMENT),
        filter(action => {
            const extension = action.payload.attachment.name.split('.').pop();
            return !!action.payload.attachment.viewReferance && (extension === 'msg' || extension === 'eml');
        }),
        switchMap(action =>
            this.store.select(getAddNoteStateByToken(action.token)).pipe(
                map((state: AddNoteState) => ({ state, action })),
                take(1))
        ),
        map(({ state, action }) => {
            const item = state.itemDataList[action.payload.parentItemIndex];
            return new Core.OpenMsgViewerPopup(
                state.matterData.AppCode, state.matterData.BranchID, state.matterData.FileID,
                item.letterName, action.payload.attachment.viewReferance, action.payload.attachment.name);
        })
    );

    @Effect({ dispatch: false })
    viewMsgInlineAttachement2$ = this.actions$.pipe(ofType<Core.ViewMsgInlineAttachement>(Core.VIEW_MSG_INLINE_ATTACHEMENT),
        filter(action => {
            const extension = action.payload.attachment.name.split('.').pop();
            return !!action.payload.attachment.viewReferance && !(extension === 'msg' || extension === 'eml');
        }),
        switchMap(action =>
            this.store.select(getAddNoteStateByToken(action.token)).pipe(
                map((state: AddNoteState) => ({ state, action })),
                take(1))
        ),
        switchMap(({ state, action }) => {
            const item = state.itemDataList[action.payload.parentItemIndex];
            return this.service.getInlineAttachmentUrl(item.letterName, action.payload.attachment.name,
                action.payload.attachment.viewReferance, state.matterData).pipe(
                    tap(url => {
                        const id = `${state.matterData.AppCode}-${state.matterData.BranchID}-
                        ${state.matterData.FileID}-${item.letterName}-${action.payload.attachment.viewReferance}`;
                        window.open(url, id, 'width=1000,height=900');
                    })
                );
        })
    );

    @Effect()
    updateCrimeClassTotals$ = this.actions$.pipe(ofType<Core.UpdateCrimeClassTotals>(Core.UPDATE_CRIME_CLASS_TOTALS),
        filter(action => action.payload.classId !== null),
        switchMap((action) =>
            this.service.updateCrimeClassTotals(action.payload.branchId, action.payload.fileId, action.payload.classId).pipe(
                map((response) => new Core.AllDataUpDate(action.token)))
        ));

    @Effect()
    loadWorkTypeListData$ = this.actions$.pipe(ofType<Core.LoadWorkTypeList>(Core.LOAD_ADD_NOTE_WORK_TYPE_LIST),
        switchMap((action: Core.LoadWorkTypeList) =>
            this.service.getWorkTypeList().pipe(map((response) =>
                new Core.LoadWorkTypeListSuccess(action.token, { workTypeList: response })),
                catchError(error => of(new Core.LoadWorkTypeListFail(action.token, error))))
        ));
    @Effect()
    loadPhaseListData$ = this.actions$.pipe(ofType<Core.LoadPhaseList>(Core.LOAD_ADD_NOTE_PHASE_LIST),
        switchMap((action: Core.LoadPhaseList) =>
            this.service.getPhaseList().pipe(map((response) =>
                new Core.LoadPhaseListSuccess(action.token, { phaseList: response })),
                catchError(error => of(new Core.LoadPhaseListFail(action.token, error))))
        ));
    @Effect()
    loadActivitiListData$ = this.actions$.pipe(ofType<Core.LoadActivitiList>(Core.LOAD_ADD_NOTE_ACTIVITI_LIST),
        switchMap((action: Core.LoadActivitiList) =>
            this.service.getActivitiList().pipe(map((response) =>
                new Core.LoadActivitiListSuccess(action.token, { activitiList: response })),
                catchError(error => of(new Core.LoadActivitiListFail(action.token, error))))
        ));
    @Effect()
    loadTaskListData$ = this.actions$.pipe(ofType<Core.LoadTaskList>(Core.LOAD_ADD_NOTE_TASK_LIST),
        switchMap((action: Core.LoadTaskList) =>
            this.service.getTaskList().pipe(map((response) =>
                new Core.LoadTaskListSuccess(action.token, { taskList: response })),
                catchError(error => of(new Core.LoadTaskListFail(action.token, error))))
        ));

    @Effect()
    openSignAndShare$ = this.actions$.pipe(ofType<Core.OpenSignAndShare>(Core.OPEN_SIGN_AND_SHARE),
        switchMap(action =>
            combineLatest(
                this.service.getSingToken(action.payload.password, action.payload.fileCredentials[0].diaryId),
                this.authHelper.getPDFViewerJwtToken(),
                ((singToken, accessToken) => ({ singToken, accessToken }))
            ).pipe(
                take(1),
                map(value => {
                    const signAndSendUrl = this.service.getSignAndSendPDFDocumentUrl(
                        action.payload.fileCredentials[0].diaryId, value.singToken, value.accessToken);
                    return new Core.SignAndShareOrShare(action.token, {
                        fileCredentials: action.payload.fileCredentials,
                        subjectNote: action.payload.subjectNote,
                        signToken: value.singToken,
                        submitType: SubmitType.SignAndShare,
                        url: signAndSendUrl,
                        matterData: action.payload.matterData,
                        password: action.payload.password,
                        isloop: action.payload.isloop
                    });
                }), catchError(() => of(new Core.OpenSignAndShareFail(action.token))))
        )
    );


    @Effect()
    editDataSucess$ = this.actions$.pipe(ofType<Core.GetEditViewDataSuccess>(Core.GET_EDIT_VIEW_DATA_SUCCESS),
        filter(action => !!action.payload.editViewData),
        mergeMap(action => from([new Core.LoadAttTypeList(action.token), new Core.LoadCivilLevelList(action.token)]))
    );


    // this.authHelper.getPDFViewerJwtToken()

    getParamforCalculateItemValue(action) {
        return combineLatest(
            this.store.select(getAddNoteAppIdByToken(action.token)),
            this.store.select(getAddNoteMatterDataByToken(action.token)),
            this.store.select(getAddNoteRateByToken(action.token)),
            this.store.select(getFileNoteUnitByToken(action.token)),
            this.store.select(getAddNoteUnchargedStateByToken(action.token)),
            this.store.select(getAddNoteDiaryTypeListByToken(action.token)).pipe(
                filter(list => !!(list && list.find(val => val.selected)))
            ),
            ((appId, matterData, rate, unit, uncharged, diaryType) =>
                ({ appId, matterData, rate, unit, uncharged, diaryType, token: action.token }))
        ).pipe(
            take(1));
    }

    getcalculateExtraItemValue(action) {
        return combineLatest(
            this.store.select(getAddNoteAppIdByToken(action.token)),
            this.store.select(getAddNoteSelectedFeeEarnerByToken(action.token)),
            this.store.select(getAddnoteRateCategoryIdByToken(action.token)),
            this.store.select(getAddNoteExtraUnitByToken(action.token)),
            this.store.select(getAddNoteExtraRateByToken(action.token)),
            this.store.select(getAddNoteSelecteExtraTimeType(action.token)),
            ((appId, feeEarner, rateCategory, extraUnit, extraRate, extraType) => ({
                appId, feeEarner,
                rateCategory, extraUnit, extraRate, extraType, token: action.token
            }))
        ).pipe(
            take(1));
    }

    getSelectedInfo(action) {
        return combineLatest(
            this.store.select(getAddNoteAppIdByToken(action.token)),
            this.store.select(getAddNoteSelectedFeeEarnerByToken(action.token)),
            this.store.select(getAddNoteRateByToken(action.token)),
            this.store.select(getFileNoteUnitByToken(action.token)),
            this.store.select(getAddnoteRateCategoryIdByToken(action.token)),
            this.store.select(getAddNoteExtraUnitByToken(action.token)),
            this.store.select(getAddNoteExtraRateByToken(action.token)),
            this.store.select(getAddNoteSelecteExtraTimeType(action.token)),
            ((appId, feeEarner, rateCategory, rate, unit, extraUnit, extraRate, extraType) => ({
                appId, feeEarner,
                rateCategory, rate, unit, extraUnit, extraRate, extraType, token: action.token
            }))
        ).pipe(
            take(1));
    }

    addNoteValidation(requiredField: RequiredField) {
        let validInformation: AddNoteValidationInfo;
        validInformation = {
            msg: 'Information is valid',
            status: true
        };

        if (!requiredField.feeEarner) {
            validInformation = {
                msg: 'The For User cannot be zero!',
                status: false
            };
        } else if (!requiredField.diaryType) {
            validInformation = {
                msg: 'The Diary Type cannot be empty!',
                status: false
            };
        } else if (!requiredField.folder) {
            validInformation = {
                msg: 'The Folder cannot be empty!',
                status: false
            };
        } else if (!requiredField.dateDone) {
            validInformation = {
                msg: 'The Done Date cannot be empty!',
                status: false
            };
        } else if (!requiredField.note) {
            validInformation = {
                msg: 'The Note cannot be empty!',
                status: false
            };
        } else if (requiredField.extraUnit % 1 !== 0 || requiredField.unit % 1 !== 0) {
            validInformation = {
                msg: 'Pleace enter a valid value to Units!',
                status: false
            };
        } else if ((requiredField.rate > 99999998) || (requiredField.extraRate > 99999998)) {
            validInformation = {
                msg: 'Pleace enter a valid value to Rate!',
                status: false
            };
        } else if (requiredField.diaryType && requiredField.diaryType.text !== 'File Note' &&
            requiredField.eBillingType === eBillingType.PrecedentH && !requiredField.workType) {
            validInformation = {
                msg: 'The Work Type cannot be empty!',
                status: false
            };
        } else if (requiredField.diaryType && requiredField.diaryType.text !== 'File Note' &&
            requiredField.eBillingType === eBillingType.PrecedentS && !requiredField.phase) {
            validInformation = {
                msg: 'The Phase cannot be empty!',
                status: false
            };
        } else if (requiredField.diaryType && requiredField.diaryType.text !== 'File Note' &&
            requiredField.eBillingType === eBillingType.PrecedentS && !requiredField.phaseWiseTask) {
            validInformation = {
                msg: 'The Task cannot be empty!',
                status: false
            };
        } else if (requiredField.diaryType && requiredField.diaryType.text !== 'File Note' &&
            requiredField.eBillingType === eBillingType.PrecedentS && !requiredField.activiti) {
            validInformation = {
                msg: 'The activity cannot be empty!',
                status: false
            };
        }
        return validInformation;
    }


    getDiaryViewModel(selectInformation, isMgsAttachment) {
        const diaryViewModel = (!isMgsAttachment) ? selectInformation : null;
        if (diaryViewModel && diaryViewModel.inboxId) {
            delete diaryViewModel.inboxId;
        }


        return diaryViewModel;
    }



    getDiaryInput(user: User, store: AddNoteState) {

        const classId = this.getClassId(store.matterData.AppCode, store.classType, store.civilClassList);
        const subClassId = this.getSubClassId(store.matterData.AppCode, store.attTypes, store.civilLevelList);
        let court = null;
        let legalAidCaseInfoId = null;
        let lafundLevel = null;
        if (store.matterData.AppCode === MatterAppCode.MA) {
            court = store.civilCourtList && store.civilCourtList.find(cl => cl.selected) ? store.civilCourtList.find(cl => cl.selected).id : 0;
            legalAidCaseInfoId = classId;
            lafundLevel = subClassId;
        };

        const recType = store.diaryTypeList.find((diary) => diary.selected).value;

        const workTypeID = store.workTypeList ? store.workTypeList.find((detail) => detail.selected) : 0;
        const workType = workTypeID ? workTypeID.key : 0;
        const seletedFolder = store.folderList.find((folder) => folder.selected);
        // const classId = (store.classType && store.classType.find(cl => cl.selected)) ?
        //     store.classType.find(cl => cl.selected).rectype : null;
        const phaseID = (store.phaseList && store.phaseList.length > 0) ? store.phaseList.find((detail) => detail.selected) : 0;
        const activitiID = (store.activitiList && store.activitiList.find((detail) => detail.selected)) ?
            store.activitiList.find((detail) => detail.selected) : 0;
        const taskID = (store.phaseWiseTaskList && store.phaseWiseTaskList.find((detail) => detail.selected)) ?
            store.phaseWiseTaskList.find((detail) => detail.selected) : 0;

        let dateDone = this.datePipe.transform(store.dateDone, 'yyyy-MM-dd') +
            this.datePipe.transform(dpsNewDate(user.general.dateTimeOffset), 'THH:mm');

        if ((store.isEdit && !(store.isDateDoneDirty === true)) ||
            recType === DiaryRecType.EMAIL_IN || recType === DiaryRecType.EMAIL_OUT) {
            dateDone = this.datePipe.transform(store.dateDone, 'yyyy-MM-ddTHH:mm:ss');
        }

        let fileInfo: FileInfoInput[] = [];
        if (store.itemDataList && store.itemDataList.length > 0) {
            fileInfo = store.itemDataList.map((item, i) => ({
                token: item.token, note: item.note, letterName: item.letterName,
                dateDn: msgExtensions.includes(item.letterName.split('.').pop().toLowerCase()) ?
                    this.datePipe.transform(dpsNewDate(user.general.dateTimeOffset, item.dateDn), 'yyyy-MM-ddTHH:mm:ss') :
                    (this.datePipe.transform(item.dateDn, 'yyyy-MM-dd') +
                        this.datePipe.transform(dpsNewDate(user.general.dateTimeOffset), 'THH:mm'))
                ,
                inlineAttachments: (i === 0 && recType !== DiaryRecType.EMAIL_IN && recType !== DiaryRecType.EMAIL_OUT) ? [] :
                    item.attachments.map(att => ({
                        reference: att.reference,
                        name: att.name,
                        isSelected: att.isSelected,
                        diaryFolderId: parseInt(att.diaryFolderId, 10),
                        isUncharge: att.isUncharge,
                        fileNote: att.fileNote
                    }))
            }));
        }

        const diaryInput: DiaryInput = {
            fileInfo: fileInfo,
            recType: recType,
            diaryId: store.uid,
            putOnBy: store.putOnBy,
            branchId: store.matterData.BranchID,
            appId: store.matterData.AppID,
            fileId: store.matterData.FileID,
            taskFor: (store.feeEarnerList && store.feeEarnerList.find((feeEarner) => feeEarner.selected)) ?
                store.feeEarnerList.find((feeEarner) => feeEarner.selected).groupName : '',
            dateDn: dateDone,
            columnFolderId: seletedFolder ? seletedFolder.folderId : null,
            note: store.note,
            appCode: store.matterData.AppCode,
            itemUnits: Number(store.unit),
            itemRate: Number(store.rate),
            itemValue: Number(store.fileNoteValue),
            matterReferenceNo: store.matterData.MatterReferenceNo,
            workflowActions: (store.actionTypeList && store.actionTypeList.find((action) => action.selected)) ?
                store.actionTypeList.find((action) => action.selected).text : null,
            useDefaultNote: false,
            template: store.template,
            anchorType: store.anchorType,
            classId: store.eBillingType === eBillingType.PrecedentH ? workType : classId,
            subClassId: subClassId,
            uncharge: store.uncharged,
            telephoneAdvice: store.telephoneAdvice,
            extraItemUnits: Number(store.extraUnit),
            extraItemRate: Number(store.extraRate),
            extraItemValue: Number(store.extraValue),
            extraRecTypeValue: (store.extraTimeType && store.extraTimeType.find((extraTime) => extraTime.selected)) ?
                store.extraTimeType.find((extraTime) => extraTime.selected).dtL_RecType : null,
            eBillingPhaseId: phaseID ? phaseID.phaseID : 0,
            eBillingActivityId: activitiID ? activitiID.phaseID : 0,
            eBillingTaskId: taskID ? taskID.phaseID : 0,
            legalAidCaseInfoId: legalAidCaseInfoId,
            legalAidCourt: court,
            lafundLevel: lafundLevel
        };

        return diaryInput;
    }

    getItems(inPutData: AddNoteInPutData) {

        switch (inPutData.addNoteItemsType) {
            case AddNoteItemsType.FileItems:
                return inPutData.fileItemList;
            case AddNoteItemsType.MailItems:
                return inPutData.mailItemList;
            case AddNoteItemsType.DriveItems:
                return inPutData.driveItemList;
            case AddNoteItemsType.DiaryItems:
                return inPutData.diaryItemList;
            case AddNoteItemsType.InboxItems:
                return inPutData.inboxItemList;
            case AddNoteItemsType.LetterEnginItems:
                return inPutData.letterEnginItemList;
            default:
                return null;
        }

    }

    getClassId(appCode: string, classType: ClassObj[], civilClassList: CivilClassObj[]): number {
        if (appCode === MatterAppCode.CR) {
            return (classType && classType.find(cl => cl.selected)) ? classType.find(cl => cl.selected).rectype : null;
        } else if (appCode === MatterAppCode.MA) {
            return (civilClassList && civilClassList.find(cl => cl.selected)) ? civilClassList.find(cl => cl.selected).legalAidCaseId : null;
        }
        return null;
    }

    getSubClassId(appCode: string, subClassType: AttType[], civilLevel: CivilDropDownData[]): number {
        if (appCode === MatterAppCode.CR) {
            return (subClassType && subClassType.find(cl => cl.selected)) ? subClassType.find(cl => cl.selected).attId : null;
        } else if (appCode === MatterAppCode.MA) {
            return (civilLevel && civilLevel.find(cl => cl.selected)) ? civilLevel.find(cl => cl.selected).id : null;
        }
        return null;
    }

}


