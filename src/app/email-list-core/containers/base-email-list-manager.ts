import { ChangeMessage, ChangeSilent } from './../actions/core';
import { Store } from '@ngrx/store';
import { GetEmailList, ChangeShare, ChangeToCc, ShareAttachment, ChangeReviewNote, ChangeReviewDate, AddRecipient } from '../actions/core';
import { getEmailList, getLoading, getShare, getReviewDate, getReviewNote, getClosePopup, getMessage, getIsSilent } from '../reducers';
import { InputData } from '../models/interface';
import { Observable, of } from 'rxjs';
import { User, getUser } from '../../auth';

export class BaseEmailListManager {
    public emailList$;
    public loading$;
    public share$;
    public reviewDate$;
    public reviewNote$;
    public closePopup$;
    public message$;
    public isSilent$;
    public user$: Observable<User> = of(null);
    constructor(protected store: Store<any>) {
        this.emailList$ = this.store.select(getEmailList);
        this.loading$ = this.store.select(getLoading);
        this.share$ = this.store.select(getShare);
        this.reviewDate$ = this.store.select(getReviewDate);
        this.reviewNote$ = this.store.select(getReviewNote);
        this.message$ = this.store.select(getMessage);
        this.closePopup$ = this.store.select(getClosePopup);
        this.isSilent$ = this.store.select(getIsSilent);
        this.user$ = this.store.select(getUser);
        // eBilling Comment
        // this.eBillingType$ = this.store.select(getEBillingType);
        // this.workTypeListData$ = this.store.select(getLoadWorkTypeList);
        // this.phaseListData$ = this.store.select(getPhaseList);
        // this.activitiListData$ = this.store.select(getActivitiList);
        // this.taskListData$ = this.store.select(getTaskList);

    }
    getEmailList(branchId: number, appId: number, fileId: number, reviewNote: string, message: string) {
        this.store.dispatch(new GetEmailList({ branchId, appId, fileId, reviewNote, message }));
    }
    onShareChange(event) {
        this.store.dispatch(new ChangeShare(event));
    }
    onToCcChange(event) {
        this.store.dispatch(new ChangeToCc(event));
    }
    onShareAttachment(input: InputData, event) {
        this.store.dispatch(new ShareAttachment({
            fileCredentials: input.fileCredentials,
            subjectNote: input.subjectNote,
            signTokens: input.signTokens,
            safeBoxFileList: input.safeBoxFileList,
            submitType: input.submitType,
            matterData: input.matterData,
            toRecipients: event.toRecipients,
            ccRecipients: event.ccRecipients,
            reviewDate: event.reviewDate,
            reviewNote: event.reviewNote,
            isEditable: event.isEditable,
            message: event.message,
            share: event.share
        }));
    }
    onReviewDateChange(event) {
        this.store.dispatch(new ChangeReviewDate(event));
    }
    onReviewNoteChange(event) {
        this.store.dispatch(new ChangeReviewNote(event));
    }
    onChangeMessageChange(event) {
        this.store.dispatch(new ChangeMessage(event));
    }
    onAddRecipient(event) {
        this.store.dispatch(new AddRecipient(event));
    }
    onChangeSilent(isSilent: boolean) {
        this.store.dispatch(new ChangeSilent(isSilent));
    }

}
