import {
    InitUserMovement, GetNextAvailableUserMovementType, SelectUserInMovement,
    AddMovementData, RefreshUserMovementList, ChangeUserDepartment, ChangeUserSearchText,
    GetMovementLocation, ChangeLocation, ChangeIsAlldayEvent
} from '../actions/core';
import { Output, EventEmitter } from '@angular/core';
import { Store } from '@ngrx/store';
import { } from '../models/interfaces';
import {
    getDepartmentListByToken, getUserListByToken, getUserLgetCurrentUserMovementsByToken,
    getNextAvailableTypesByToken,
    getSelectedUserByToken,
    getAddNewMovementpopupCloseToken,
    getLoadingByToken,
    getAddPopupLoadingByToken,
    getTimeListByToken,
    getMovementLocationistByToken
} from '../reducers/index';
import { getUser } from '../../auth';



export class BaseUserMovementManager {
    @Output() closePopup = new EventEmitter<any>();

    public myToken: string;
    public userList$: any;
    public departmentList$: any;
    public currentDayMovementsList$: any;

    public nextAvailableTypes$: any;
    public selectedUserInMovement$: any;
    public addNewMovementpopupClose$: any;
    public timeList$: any;
    public user$: any;

    public onlySelectMatter: boolean;
    public isLoading$: any;
    public addPopuploading$: any;
    public gridData$: any;
    public coloumnDef$: any;
    public selectedMatter$: any;
    public multiSelectItem$: any;
    public locationList$: any;






    constructor(protected store: Store<any>) {
    }



    protected initSelectors(myToken: string) {



        // combineLatest(
        //     this.store.select(getUserListByToken(myToken)),
        //     // this.store.select(getDepartment()),
        //     (user) => (
        //         { userList: user })).pipe(
        //             take(1))
        //     .subscribe((info) => {
        //         this.store.dispatch(new InitUserMovement(
        //             myToken
        //         ));
        //     }).unsubscribe();

        //    // this.init(myToken, userList, departmentList);

        this.store.dispatch(new InitUserMovement(myToken));
        this.store.dispatch(new GetMovementLocation(this.myToken));
        this.myToken = myToken;
        this.userList$ = this.store.select(getUserListByToken(myToken));
        this.departmentList$ = this.store.select(getDepartmentListByToken(myToken));
        this.currentDayMovementsList$ = this.store.select(getUserLgetCurrentUserMovementsByToken(myToken));
        this.selectedUserInMovement$ = this.store.select(getSelectedUserByToken(myToken));
        this.isLoading$ = this.store.select(getLoadingByToken(myToken));
        this.user$ = this.store.select(getUser);
        this.locationList$ = this.store.select(getMovementLocationistByToken(this.myToken));


    }


    // init(myToken, userList, departmentList) {
    //     this.store.dispatch(new InitUserMovement(myToken, userList, departmentList));
    // }

    initAddUserMovementPopup(selectedUser: any) {
        // this.myToken = mytoken;
        this.store.dispatch(new GetNextAvailableUserMovementType(this.myToken, selectedUser));
        // this.store.dispatch(new GetMovementLocation(this.myToken));
        this.nextAvailableTypes$ = this.store.select(getNextAvailableTypesByToken(this.myToken));
        this.addNewMovementpopupClose$ = this.store.select(getAddNewMovementpopupCloseToken(this.myToken));
        this.addPopuploading$ = this.store.select(getAddPopupLoadingByToken(this.myToken));
        this.timeList$ = this.store.select(getTimeListByToken(this.myToken));
        this.locationList$ = this.store.select(getMovementLocationistByToken(this.myToken));
        this.user$ = this.store.select(getUser);
    }


    submitUserMovemetDetails(myToken, submitData) {
        this.store.dispatch(new AddMovementData(myToken, { submitData: submitData }));
    }

    selectUserInMovements(myToken, user) {
        this.store.dispatch(new SelectUserInMovement(myToken, user));
    }

    refreshUserMovementList(myToken) {

        this.store.dispatch(new RefreshUserMovementList(myToken));
    }

    changeUserDepartment(myToken, department) {
        this.store.dispatch(new ChangeUserDepartment(myToken, { departmentData: department }));
        this.store.dispatch(new ChangeUserSearchText(myToken, null));
    }

    userSerchtextChange(myToken, searchText) {
        this.store.dispatch(new ChangeUserSearchText(myToken, searchText));

    }

    changeUserLocation(myToken, location) {
        this.store.dispatch(new ChangeLocation(myToken, location));

    }

    changeIsAllDayEvent(myToken, value) {
        this.store.dispatch(new ChangeIsAlldayEvent(myToken, value));

    }


}


