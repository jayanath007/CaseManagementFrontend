import { Store } from '@ngrx/store';
import {
    InitTimeInformation, TimeInformationModelChange, RateCalculationUpdate,
    SelectGridItem, NewForm, SaveTimeRecords, DeleteTimeRecords,
    ClosePopup, PrintDoc, TimeInformationParentModelChange, AttTypeListChange, OpenExideLimitPopup,
    GetAttendeesAndWorkLookupData,
    SelectLookupData,
    ClassChange, FeeEarnerChange
} from './../actions/core';
import { TimeInformationInputData } from '../../core/lib/crime-managment';
import {
    getIsTimeInformationLoadingByToken,
    getFeeEarnerList,
    getFormViewModelByToken,
    getModelByToken,
    getAttTypeList,
    getGradeList,
    getGridColumnDef,
    getTimeRecordGridItems,
    getIsUpdateRateFiles,
    getIsEditModeByToken,
    getSettings,
    getIsloadingTimeRecords,
    getClassList,
    getMatter
} from '../reducers';
import { ColumnDef } from '../../core/lib/grid-model';
import { createDefultColumnDef } from '../../core/lib/grid-helpers';
import { FieldType } from '../../odata';
import { Output, EventEmitter } from '@angular/core';
import { ButtonAction } from '../models/enum';
import { TimeInformationModel } from './../models/interfaces';
import { LookupType } from '../../shared';
import { Observable } from 'rxjs';
import { getUser, User } from '../../auth';
import { take } from 'rxjs/operators';
import { getCrimeLookupList } from '../../shared-data';
import { FeeEarner } from './../../core/lib/crime-managment';

export class BaseTimeInformationManager {

    @Output() closePopup = new EventEmitter();

    myToken: string;
    isLoading$: any;
    isloadingTimeRecords$: any;
    feeEarnerList$: any;
    formViewModel$: any;
    model$: any;
    attTypesList$: any;
    gradeList$: any;
    gridColumnDef$: any;
    timeRecordsGridData$: any;
    isUpdateRateFiles$: any;
    isEditMode$: any;
    settings$: any;
    user$: Observable<User>;
    classList$: any;
    matter$: any;
    policeSLookupList$: any;
    constructor(protected store: Store<any>) {
    }

    columnDef: ColumnDef[] =
        // , filterHidden: true, disableShort: true
        [
            createDefultColumnDef('Date', { label: 'Date', fxFlex: '80px', filterAnchor: 'start', filterHidden: true, disableShort: true },
                FieldType.Date),
            createDefultColumnDef('FeeEarner',
                { label: 'Fee Earner', fxFlex: '64px', filterAnchor: 'start', filterHidden: true, disableShort: true }),
            createDefultColumnDef('AttendanceType',
                { label: 'Attendance Type', fxFlex: '180px', filterAnchor: 'start', filterHidden: true, disableShort: true }),

            createDefultColumnDef('Travelling ',
                { label: 'Travelling  ', fxFlex: '100px', filterAnchor: 'start', filterHidden: true, disableShort: true }),

            createDefultColumnDef('Waiting  ',
                { label: 'Waiting  ', fxFlex: '100px', filterAnchor: 'start', filterHidden: true, disableShort: true }),

            createDefultColumnDef('AdviAssi',
                { label: 'Adv/Ass ', fxFlex: '110px', filterAnchor: 'start', filterHidden: true, disableShort: true }),

            createDefultColumnDef('AttCls',
                { label: 'Att/Csl ', fxFlex: '108px', filterAnchor: 'start', filterHidden: true, disableShort: true }),

            createDefultColumnDef('Prep',
                { label: 'Prep/Att ', fxFlex: '108px', filterAnchor: 'start', filterHidden: true, disableShort: true }),

            createDefultColumnDef('Advocacy ',
                { label: 'Advocacy ', fxFlex: '90px', filterAnchor: 'start', filterHidden: true, disableShort: true }),

            createDefultColumnDef('Disbursement ',
                {
                    label: 'Disbursement ', fxFlex: '90px', filterAnchor: 'start', filterHidden: true,
                    disableShort: true
                }),
        ];

    protected initSelectors(myToken: string, inputData: TimeInformationInputData) {
        this.myToken = myToken;
        this.user$ = this.store.select(getUser);
        this.user$.pipe(take(1)).subscribe(user => {
            this.store.dispatch(new InitTimeInformation(myToken,
                {
                    inputData: inputData,
                    columnDef: this.columnDef,
                    timeOffset: user.general.dateTimeOffset
                }));
        }).unsubscribe();

        this.isLoading$ = this.store.select(getIsTimeInformationLoadingByToken(myToken));
        this.isloadingTimeRecords$ = this.store.select(getIsloadingTimeRecords(myToken));
        this.feeEarnerList$ = this.store.select(getFeeEarnerList(myToken));
        this.formViewModel$ = this.store.select(getFormViewModelByToken(myToken));
        this.model$ = this.store.select(getModelByToken(myToken));
        this.attTypesList$ = this.store.select(getAttTypeList(myToken));
        this.gradeList$ = this.store.select(getGradeList(myToken));
        this.gridColumnDef$ = this.store.select(getGridColumnDef(myToken));
        this.timeRecordsGridData$ = this.store.select(getTimeRecordGridItems(myToken));
        this.isUpdateRateFiles$ = this.store.select(getIsUpdateRateFiles(myToken));
        this.isEditMode$ = this.store.select(getIsEditModeByToken(myToken));
        this.settings$ = this.store.select(getSettings(myToken));
        this.classList$ = this.store.select(getClassList(myToken));
        this.matter$ = this.store.select(getMatter(myToken));
        this.policeSLookupList$ = this.store.select(getCrimeLookupList(LookupType.POLICE_ST_CODES));
    }

    onParentModelChange(model) {
        this.store.dispatch(new TimeInformationParentModelChange(this.myToken, { model: model }));
    }

    onModelChange(model) {
        this.store.dispatch(new TimeInformationModelChange(this.myToken, { model: model }));
    }
    onAttTypeListChange(attTypeId: number) {
        this.user$.pipe(take(1)).subscribe(user => {
            this.store.dispatch(new AttTypeListChange(this.myToken, { attTypeId: attTypeId, timeOffset: user.general.dateTimeOffset }));
        }).unsubscribe();
    }
    // onChangePoliceStation(policeStation: string) {
    //     this.store.dispatch(new ChangePoliceStation(this.myToken, { nameAndID: policeStation }));
    // }

    onRateCalculation(event: {
        controlerName: string,
        model: TimeInformationModel,
        value: any
    }) {
        this.user$.pipe(take(1)).subscribe(user => {
            this.store.dispatch(new RateCalculationUpdate(this.myToken, { ...event, timeOffset: user.general.dateTimeOffset }));
        }).unsubscribe();

    }

    onSelectGridItem(item: TimeInformationModel) {
        this.store.dispatch(new SelectGridItem(this.myToken, { item: item }));
    }

    close() {
        this.store.dispatch(new ClosePopup(this.myToken));
        this.closePopup.emit();
    }

    onClickAction(action: ButtonAction) {
        switch (action) {
            case ButtonAction.New:
                this.user$.pipe(take(1)).subscribe(user => {
                    this.store.dispatch(new NewForm(this.myToken, { timeOffset: user.general.dateTimeOffset }));
                }).unsubscribe();

                break;
            case ButtonAction.Delete:
                this.store.dispatch(new DeleteTimeRecords(this.myToken));
                break;
            case ButtonAction.Save:
                this.store.dispatch(new SaveTimeRecords(this.myToken));
                break;
            case ButtonAction.Print:
                this.store.dispatch(new PrintDoc(this.myToken));
                break;
            default:
                break;
        }
    }

    exideLimit(token: string) {
        this.store.dispatch(new OpenExideLimitPopup(token));
    }

    onOpenLookup(token: string, lookupType: LookupType, property: string) {
        this.store.dispatch(new GetAttendeesAndWorkLookupData(token, lookupType, property));
    }

    removeAttendee(token: string, lookupType: LookupType, property: string) {
        this.store.dispatch(new SelectLookupData(token, lookupType, property, { name: '', code: '' }));
    }

    classChange(token: string, classId: number) {
        this.store.dispatch(new ClassChange(token, classId, this.columnDef));
    }

    changeFeeEarner(token: string, feeEaener: FeeEarner) {
        this.store.dispatch(new FeeEarnerChange(token, feeEaener));
    }

}
