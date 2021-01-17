import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { MlsService } from '../services/mls-service';
import * as Core from '../actions/core';
import { map, catchError, switchMap, filter, take, mergeMap } from 'rxjs/operators';
import { getMatterDetails, getSelectedUserByToken, getMessageListByToken } from '../reducers';
import { of, combineLatest, from } from 'rxjs';
import { SendMessageRequest } from '../models/request';
import { Request } from '../models/enum';
import { RefreshMLSWidget } from '../../mls-widget';
import { MLSUser } from '../../core/lib/mls';
import { getUser } from '../../auth';

@Injectable()
export class MlsEffects {

    constructor(private actions$: Actions, private store: Store<any>, private service: MlsService) { }

    @Effect()
    initMLS$ = this.actions$.pipe(ofType<Core.InitMls>(Core.INIT_MLS),
        map(action => new Core.RequestCaseUsersByMatter(action.token))
    );

    @Effect()
    requestCaseUsersByMatter$ = this.actions$.pipe(ofType<Core.RequestCaseUsersByMatter>(Core.REQUEST_CASE_USERS_BY_MATTER),
        switchMap(action =>
            combineLatest(
                this.store.select(getMatterDetails(action.token)),
                this.store.select(getSelectedUserByToken(action.token)),
                ((matterInfo, selectUser) =>
                    ({ matterInfo, selectUser, token: action.token }))
            ).pipe(take(1))
        ),
        // filter(info => !info.selectUser),
        map(info => new Core.GetCaseUsersByMatter(info.token,
            {
                appID: info.matterInfo.AppId, fileID: info.matterInfo.FileId, branchID: info.matterInfo.BranchId,
                selectedUser: info.selectUser
            }))
    );

    @Effect()
    loadCaseUsersByMatter$ = this.actions$.pipe(ofType<Core.GetCaseUsersByMatter>(Core.GET_CASE_USERS_BY_MATTER),
        switchMap(action =>
            this.service.getCaseUsersByMatter(action.payload.appID, action.payload.fileID, action.payload.branchID).pipe(
                map(responce => new Core.GetCaseUsersByMatterSuccess(action.token, {
                    users: responce,
                    selectedUser: action.payload.selectedUser
                })),
                catchError(() => of(new Core.GetCaseUsersByMatterFail(action.token)))
            )
        ));

    @Effect()
    selectUser$ = this.actions$.pipe(ofType<Core.GetCaseUsersByMatterSuccess>(Core.GET_CASE_USERS_BY_MATTER_SUCESS),
        filter(action => action.payload.users && action.payload.users.length > 0),
        map(action => new Core.ChangeUser(action.token, {
            user: action.payload.selectedUser ?
                (action.payload.users
                    .find(val => val.emailAddress.toLowerCase() === action.payload.selectedUser.emailAddress.toLowerCase())) :
                action.payload.users[0]
        }))
    );

    @Effect()
    changeUser$ = this.actions$.pipe(ofType<Core.ChangeUser>(Core.CHANGE_USER),
        map(action => new Core.GetCaseMessages(action.token, { userEmail: action.payload.user.emailAddress }))
    );

    @Effect()
    getChatMessage$ = this.actions$.pipe(ofType<Core.GetCaseMessages>(Core.GET_CASE_MESSAGES),
        switchMap(action =>
            combineLatest(
                this.store.select(getMatterDetails(action.token)).pipe(take(1)),
                this.store.select(getMessageListByToken(action.token)).pipe(take(1)),
                ((matterDetails, messageList) =>
                    ({
                        matterDetails, messageList, userEmail: action.payload.userEmail,
                        token: action.token, isLoadMore: action.payload.loadMore
                    }))
            ).pipe(take(1))
        ), switchMap(info =>
            this.service.getChatMessgeByUserEmail(
                info.matterDetails.AppId,
                info.matterDetails.FileId,
                info.matterDetails.BranchId,
                info.userEmail,
                info.isLoadMore ? info.messageList.length / Request.pageSize + 1 : 1,
                Request.pageSize
            ).pipe(
                map(responce => new Core.GetCaseMessagesSuccess(info.token, { responce: responce, loadMore: info.isLoadMore }),
                    catchError(() => of(new Core.GetCaseMessagesFail(info.token))))
            ))
    );

    @Effect()
    sendMessage$ = this.actions$.pipe(ofType<Core.SendMessage>(Core.SEND_MESSAGE),
        switchMap(action =>
            combineLatest(
                this.store.select(getMatterDetails(action.token)),
                this.store.select(getSelectedUserByToken(action.token)),
                this.store.select(getUser),
                ((matterInfo, selectUser, user) =>
                    ({ matterInfo, selectUser, user, msg: action.payload.msg, token: action.token }))
            ).pipe(take(1))
        ), map(info => {
            const request = new SendMessageRequest(
                info.msg,
                info.user.general.userEmail,
                info.selectUser.emailAddress,
                info.matterInfo.AppId,
                info.matterInfo.BranchId,
                info.matterInfo.FileId
            );
            return { request: request, token: info.token };
        }), switchMap(requestData =>
            this.service.sendMessage(requestData.request).pipe(
                map(respone => new Core.SendMessageSuccess(requestData.token, { toEmailAddress: requestData.request.toUserEmail })),
                catchError(() => of(new Core.SendMessageFail(requestData.token))))
        )
    );

    @Effect()
    sendMessageSuccess$ = this.actions$.pipe(ofType<Core.SendMessageSuccess>(Core.SEND_MESSAGE_SUCCESS),
        map(action => new Core.GetCaseMessages(action.token, { userEmail: action.payload.toEmailAddress }))
    );

    @Effect()
    loadMore$ = this.actions$.pipe(ofType<Core.LoadMore>(Core.LOAD_MORE),
        switchMap(action =>
            this.store.select(getSelectedUserByToken(action.token)).pipe(
                map(user => ({ token: action.token, user: user })))
                .pipe(
                    map(info => new Core.GetCaseMessages(action.token, { userEmail: info.user.emailAddress, loadMore: true }))
                )
        ));

    @Effect()
    refresh$ = this.actions$.pipe(ofType<Core.MLSRefresh>(Core.MLS_REFRESH),
        switchMap(action =>
            this.store.select(getSelectedUserByToken(action.token)).pipe(
                map(user => ({ token: action.token, user: user })))
                .pipe(
                    filter(info => !!info.user),
                    map(info => new Core.GetCaseMessages(action.token, { userEmail: info.user.emailAddress }))
                )
        ));

    @Effect()
    refeshMLSWidged$ = this.actions$.pipe(ofType<Core.MLSRefresh>(Core.MLS_REFRESH),
        map(action => new RefreshMLSWidget)
    );

    @Effect()
    caseUsers$ = this.actions$.pipe(ofType<Core.MLSRefresh>(Core.MLS_REFRESH),
        map(action => new Core.RequestCaseUsersByMatter(action.token))
    );

    @Effect()
    refeshMLSWidgedSendMsg$ = this.actions$.pipe(ofType<Core.SendMessageSuccess>(Core.SEND_MESSAGE_SUCCESS),
        map(action => new RefreshMLSWidget)
    );

    @Effect()
    ChangeCanViewMilestone$ = this.actions$.pipe(ofType<Core.ChangeCanViewMilestone>(Core.CHANGE_CAN_VIEW_MILESTONE),
        switchMap(action =>
            combineLatest(
                this.store.select(getMatterDetails(action.token)),
                this.store.select(getSelectedUserByToken(action.token)),
                ((matterInfo, selectUser) =>
                    ({ matterInfo, selectUser, token: action.token }))
            ).pipe(take(1),
                filter(info => !!info.selectUser),
                switchMap(info => this.service.ChangeCanViewMilestone(info.matterInfo, info.selectUser.id,
                    !info.selectUser.canViewMilestones).pipe(
                        map(() => new Core.ChangeCanViewMilestoneSuccess(info.token)),
                        catchError(() => of(new Core.ChangeCanViewMilestoneFail(info.token)))))
            )
        ));

    @Effect()
    addUser$ = this.actions$.pipe(ofType<Core.AddUser>(Core.ADD_USER),
        switchMap(action => this.store.select(getMatterDetails(action.token)).pipe(take(1), map(matter => ({ matter, action })))),
        switchMap(({ matter, action }) =>
            this.service.addUser(matter.MatterReferenceNo, action.payload.message, action.payload.emailAddresses).pipe(
                mergeMap(responce => from([
                    new Core.SendMessageSuccess(action.token, { toEmailAddress: action.payload.emailAddresses }),
                    new Core.GetCaseUsersByMatter(action.token, {
                        appID: matter.AppId,
                        branchID: matter.BranchId,
                        fileID: matter.FileId,
                        selectedUser: <MLSUser>{ emailAddress: action.payload.emailAddresses }
                    })
                ])
                ),
                catchError(() => of(new Core.SendMessageFail(action.token)))
            )
        ));

}

