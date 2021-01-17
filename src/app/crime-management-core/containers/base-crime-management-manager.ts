import { Store } from '@ngrx/store';
import { CrimeManagementInitials, CrimeManagementInput } from '../../core/lib/crime-managment';
import {
    InitCrimeManagement, UpdateAddClassModelData,
    AddNewClass, ClearCrimeRateFiles, DeleteClass, OpenClassInfoPopup, GetClassTotal, RunScreenOption
} from '../actions/core';
import {
    getClassListByToken, getRateFileloadingByToken, getIsLoadingByToken,
    getClassTypeByToken, getAddClassModelByToken
} from '../reducers';
import { UpdateModelType } from '../models/enum';
import { ClassObj } from './../models/interfaces';
import { Observable } from 'rxjs';
import { User, getUser } from '../../auth';
import { take } from 'rxjs/operators';

export class BaseCrimeManagementManager {

    constructor(protected store: Store<any>) { }

    token: string;
    isLoading$: any;
    classList$: any;
    classType$: any;
    addClassModel$: any;
    rateFileloading$: any;
    user$: Observable<User>;

    OnInit(token, payload: CrimeManagementInitials) {
        // this.store.dispatch(new InitScreenView(token, payload));
    }

    protected initSelectors(token: string, isPopup: boolean, inputData: CrimeManagementInput) {
        this.token = token;
        this.user$ = this.store.select(getUser);
        this.user$.pipe(take(1)).subscribe(user => {
            this.store.dispatch(new InitCrimeManagement(token,
                {
                    inputData: inputData,
                    isPopup: isPopup,
                    timeOffset: user.general.dateTimeOffset
                }));
        }).unsubscribe();


        this.isLoading$ = this.store.select(getIsLoadingByToken(token));
        this.classList$ = this.store.select(getClassListByToken(token));
        this.classType$ = this.store.select(getClassTypeByToken(token));
        this.addClassModel$ = this.store.select(getAddClassModelByToken(token));
        this.rateFileloading$ = this.store.select(getRateFileloadingByToken(token));
    }

    updateAddClassModel(token: string, data: { kind: UpdateModelType, value: string | number }) {
        this.store.dispatch(new UpdateAddClassModelData(token, { changes: data }));
    }

    onRateFileUpdate(token: string) {
        this.store.dispatch(new ClearCrimeRateFiles(token));
    }

    addClass(token: string, classInfo?: ClassObj) {
        this.store.dispatch(new AddNewClass(token));
    }

    deleteClass(token: string, classInfo?: ClassObj) {
        this.store.dispatch(new DeleteClass(token, classInfo));
    }

    onOpenClassInfo(token: string, classObj: ClassObj) {
        this.store.dispatch(new OpenClassInfoPopup(token, classObj));
    }

    getClassTotal(token: string, classObj: ClassObj) {
        if (classObj.rectype === 4) { /// need remove after complete backend
            this.store.dispatch(new GetClassTotal(token, classObj));
        }
    }

    runScreenOption(token: string, classObj: ClassObj, screenOption: string) {
        this.store.dispatch(new RunScreenOption(token, classObj, screenOption));
    }


}
