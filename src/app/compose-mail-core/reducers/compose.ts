
import { DatePipe } from '@angular/common';
import { createSelector, Action } from '@ngrx/store';
import * as Actions from '../actions/compose';
import { Attachment, Message, FollowupFlag, Importance, Recipient, ItemAttachment } from '../../core/lib/microsoft-graph';
import { AttachmentWrapper } from '../models/interface';

export interface ComposeState {
    readonly composeItem: Message;
    readonly refItem: Message;
    readonly attachments: AttachmentWrapper[];
    readonly lastInlineAttachment: AttachmentWrapper;
    readonly followUpText: string;
    readonly isComposeCloseItem: boolean;
    readonly isMailSending: boolean;
    readonly isMailSaveing: boolean;
    readonly isMailDeleteing: boolean;
    readonly isSendFail: boolean;
    readonly isDirty: boolean;
}
export interface State {
    readonly [token: string]: ComposeState;
}
const initialState: State = {};
export function reducer(state = initialState, action: Actions.Any): State {
    const temp: any = {};

    switch (action.type) {
        case Actions.ADD_COMPOSE_MAIL:
            return {
                ...state,
                ...{
                    [action.token]: setComposeItemViewData(
                        state[action.token], action.payload.composeMail, action.payload.refMail, action.token)
                }
            };
        case Actions.CLEAR_COMPOSE_MAIL:
            return { ...state, ...{ [action.token]: null } };
        case Actions.FLAG_FOLLOW_UP:
            temp[action.token] = state[action.token] ?
                { ...setFlagFollowUp(state[action.token], action.payload.type), isDirty: true } : null;
            return { ...state, ...temp };
        case Actions.SET_IMPORTANCE:
            temp[action.token] = state[action.token] ?
                { ...setImportance(state[action.token], action.payload.importance), isDirty: true } : null;
            return { ...state, ...temp };
        case Actions.SET_SUBJECT:
            temp[action.token] = state[action.token] ? { ...setSubject(state[action.token], action.payload.subject), isDirty: true } : null;
            return { ...state, ...temp };
        case Actions.SET_BODY:
            temp[action.token] = state[action.token] ? { ...setBody(state[action.token], action.payload.body), isDirty: true } : null;
            return { ...state, ...temp };
        case Actions.ADD_TO_RECIPIENT:
            temp[action.token] = state[action.token] ?
                { ...addToRecipient(state[action.token], action.payload.recipient), isDirty: true } : null;
            return { ...state, ...temp };
        case Actions.ADD_CC_RECIPIENT:
            temp[action.token] = state[action.token] ?
                { ...addCcRecipient(state[action.token], action.payload.recipient), isDirty: true } : null;
            return { ...state, ...temp };
        case Actions.ADD_BCC_RECIPIENT:
            temp[action.token] = state[action.token] ?
                { ...addBccRecipient(state[action.token], action.payload.recipient), isDirty: true } : null;
            return { ...state, ...temp };
        case Actions.REMOVE_TO_RECIPIENT:
            temp[action.token] = state[action.token] ?
                { ...removeToRecipient(state[action.token], action.payload.recipient), isDirty: true } : null;
            return { ...state, ...temp };
        case Actions.REMOVE_CC_RECIPIENT:
            temp[action.token] = state[action.token] ?
                { ...removeCcRecipient(state[action.token], action.payload.recipient), isDirty: true } : null;
            return { ...state, ...temp };
        case Actions.REMOVE_BCC_RECIPIENT:
            temp[action.token] = state[action.token] ?
                { ...removeBccRecipient(state[action.token], action.payload.recipient), isDirty: true } : null;
            return { ...state, ...temp };
        case Actions.SEND_ITEM:
            temp[action.token] = state[action.token] ? Object.freeze({
                ...state[action.token], isMailSending: true, isSendFail: false
            }) : null;
            return { ...state, ...temp };
        case Actions.SEND_ITEM_SUCCESS:
            temp[action.token] = state[action.token] ? Object.freeze({ ...state[action.token], isMailSending: false }) : null;
            return { ...state, ...temp };
        case Actions.SEND_ITEM_FAIL:
            temp[action.token] = state[action.token] ? Object.freeze({
                ...state[action.token], isMailSending: false, isSendFail: true
            }) : null;
            return { ...state, ...temp };
        case Actions.SEND_ITEM_STOPPED:
            temp[action.token] = state[action.token] ? Object.freeze({ ...state[action.token], isMailSending: false }) : null;
            return { ...state, ...temp };
        case Actions.ITEM_SAVEING:
            temp[action.token] = state[action.token] ? Object.freeze({ ...state[action.token], isMailSaveing: true }) : null;
            return { ...state, ...temp };
        case Actions.DRAFT_ITEM_SUCCESS:
            temp[action.token] = state[action.token] ? Object.freeze({
                ...state[action.token], isMailSaveing: false,
                composeItem: Object.freeze({
                    ...state[action.token].composeItem,
                    id: action.payload.newItem.id, changeKey: action.payload.newItem.changeKey,
                    from: action.payload.newItem.from, sender: action.payload.newItem.sender
                })
            }) : null;
            return { ...state, ...temp };
        case Actions.DRAFT_ITEM_FAIL:
            temp[action.token] = state[action.token] ? Object.freeze({ ...state[action.token], isMailSaveing: false }) : null;
            return { ...state, ...temp };
        case Actions.DRAFT_ITEM_STOPPED:
            temp[action.token] = state[action.token] ? Object.freeze({ ...state[action.token], isMailSaveing: false }) : null;
            return { ...state, ...temp };
        case Actions.DISCARD_ITEM:
            temp[action.token] = state[action.token] ? Object.freeze({
                ...state[action.token], isMailDeleteing: true, isSendFail: false
            }) : null;
            return { ...state, ...temp };
        case Actions.DISCARD_ITEM_SUCCESS:
            temp[action.token] = state[action.token] ? Object.freeze({ ...state[action.token], isMailDeleteing: false }) : null;
            return { ...state, ...temp };
        case Actions.DISCARD_ITEM_FAIL:
            temp[action.token] = state[action.token] ? Object.freeze({ ...state[action.token], isMailDeleteing: false }) : null;
            return { ...state, ...temp };
        case Actions.DISCARD_ITEM_STOPPED:
            temp[action.token] = state[action.token] ? Object.freeze({ ...state[action.token], isMailDeleteing: false }) : null;
            return { ...state, ...temp };
        case Actions.CLOSE_COMPOSE_MAIL_ITEM:
            temp[action.token] = state[action.token] ? Object.freeze({
                ...state[action.token], isComposeCloseItem: true, isSendFail: false
            }) : null;
            return { ...state, ...temp };



        case Actions.ADD_ATTACHMENT:
            temp[action.token] = state[action.token] ? Object.freeze({
                ...state[action.token],
                attachments: setUplodingAttachment(state[action.token].attachments, action.payload.uid, action.payload.attachment)
            }) : null;
            return { ...state, ...temp };
        case Actions.ADD_ATTACHMENT_SUCCESS:
            temp[action.token] = state[action.token] ? Object.freeze({
                ...state[action.token],
                attachments: addAttachment(state[action.token].attachments, action.payload.uid, action.payload.attachment),
                lastInlineAttachment: action.payload.attachment.isInline ?
                    { uid: action.payload.uid, attachment: action.payload.attachment } : state[action.token].lastInlineAttachment
            }) : null;
            return { ...state, ...temp };
        case Actions.ADD_ATTACHMENT_FAIL:
            temp[action.token] = state[action.token] ? Object.freeze({
                ...state[action.token],
                attachments: removeUplodingAttachment(state[action.token].attachments, action.payload.uid),
            }) : null;
            return { ...state, ...temp };

        case Actions.ADD_INIT_ATTACHMENTS_SUCCESS:
            temp[action.token] = state[action.token] ? Object.freeze({
                ...state[action.token],
                attachments: addInitAttachment(state[action.token].attachments, action.payload.attachments)
            }) : null;
            return { ...state, ...temp };
        // ------------------------------------------------------
        case Actions.ADD_NEW_MAIL_ITEM_ATTACHMENTS:
            temp[action.token] = state[action.token] ? Object.freeze({
                ...state[action.token],
                attachments: setUplodingInitAttachment(state[action.token].attachments, action.payload.attachments)
            }) : null;
            return { ...state, ...temp };
        case Actions.ADD_INIT_ATTACHMENTS_FAIL:
            temp[action.token] = state[action.token] ? Object.freeze({
                ...state[action.token],
                attachments: removeUplodingInitAttachment(state[action.token].attachments, action.payload.attachments)
            }) : null;
            return { ...state, ...temp };
        // ------------------------------------------------------

        case Actions.DELETE_ATTACHMENT:
            temp[action.token] = state[action.token] ? Object.freeze({
                ...state[action.token],
                attachments: setDeletingAttachment(state[action.token].attachments, action.payload.attachmentId)
            }) : null;
            return { ...state, ...temp };
        case Actions.DELETE_ATTACHMENT_SUCCESS:
            temp[action.token] = state[action.token] ? Object.freeze({
                ...state[action.token],
                attachments: deleteAttachment(state[action.token].attachments, action.payload.attachmentId)
            }) : null;
            return { ...state, ...temp };
        case Actions.DELETE_ATTACHMENT_FAIL:
            temp[action.token] = state[action.token] ? Object.freeze({
                ...state[action.token],
                attachments: removeDeletingAttachment(state[action.token].attachments, action.payload.attachmentId),
            }) : null;
            return { ...state, ...temp };
        default:
            {
                return state;
            }
    }
}
function addToRecipient(state: ComposeState, recipient: Recipient) {

    return Object.freeze({
        ...state,
        composeItem: Object.freeze({ ...state.composeItem, toRecipients: addRecipient(state.composeItem.toRecipients, recipient) })
    });
}
function addCcRecipient(state: ComposeState, recipient: Recipient) {
    return Object.freeze({
        ...state,
        composeItem: Object.freeze({ ...state.composeItem, ccRecipients: addRecipient(state.composeItem.ccRecipients, recipient) }),
    });
}
function addBccRecipient(state: ComposeState, recipient: Recipient) {
    return Object.freeze({
        ...state,
        composeItem: Object.freeze({ ...state.composeItem, bccRecipients: addRecipient(state.composeItem.bccRecipients, recipient) }),
    });
}
function removeToRecipient(state: ComposeState, recipient: Recipient) {
    return Object.freeze({
        ...state,
        composeItem: Object.freeze({ ...state.composeItem, toRecipients: removeRecipient(state.composeItem.toRecipients, recipient) }),
    });
}
function removeCcRecipient(state: ComposeState, recipient: Recipient) {
    return Object.freeze({
        ...state,
        composeItem: Object.freeze({ ...state.composeItem, ccRecipients: removeRecipient(state.composeItem.ccRecipients, recipient) }),
    });
}
function removeBccRecipient(state: ComposeState, recipient: Recipient) {
    return Object.freeze({
        ...state,
        composeItem: Object.freeze({ ...state.composeItem, bccRecipients: removeRecipient(state.composeItem.bccRecipients, recipient) }),
    });
}

function addRecipient(recipients: Recipient[], recipient: Recipient) {
    return recipients.concat([recipient]);
}
function removeRecipient(recipients: Recipient[], recipient: Recipient) {
    return recipients.filter((rec) => rec !== recipient);
}


// function addAttachment(cutentAttachments: Attachment[], attachments: Attachment[]) {
//     return cutentAttachments ? cutentAttachments.concat(attachments) : attachments;
// }
// function removeAttachment(cutentAttachments: Attachment[], id: string) {
//     return cutentAttachments.filter((att) => att.id !== id);
// }
function setDeletingAttachment(attachments: AttachmentWrapper[], id: string) {
    return attachments.map(val => {
        if (val.attachment.id === id) {
            const attachment: AttachmentWrapper = {
                uid: val.uid,
                isUploding: val.isUploding,
                isDeleting: true,
                attachment: val.attachment
            };
            return attachment;
        }
        return val;
    });
}
function deleteAttachment(attachments: AttachmentWrapper[], id: string) {
    return attachments.filter(val => val.attachment.id !== id);
}
function removeDeletingAttachment(attachments: AttachmentWrapper[], id: string) {
    return attachments.map(val => {
        if (val.attachment.id === id) {
            const attachment: AttachmentWrapper = {
                uid: val.uid,
                isUploding: val.isUploding,
                isDeleting: false,
                attachment: val.attachment
            };
            return attachment;
        }
        return val;
    });
}

function addInitAttachment(attachments: AttachmentWrapper[], newAttachments: ItemAttachment[]) {
    const _attachments = [];
    attachments.forEach(val => {
        if (!newAttachments.find(att => att.item.id === val.uid)) {
            _attachments.concat(val);
        }
    });
    return _attachments.concat(newAttachments.map<AttachmentWrapper>(val => {
        const attachment: AttachmentWrapper = {
            uid: val.id,
            isUploding: false,
            isDeleting: false,
            attachment: val
        };
        return attachment;
    }
    ));
}

function setUplodingAttachment(attachments: AttachmentWrapper[], uid: string, uplodingAttachment: Attachment) {
    const attachment: AttachmentWrapper = {
        uid: uid,
        isUploding: true,
        isDeleting: false,
        attachment: uplodingAttachment
    };
    return attachments.concat(attachment);
}
function setUplodingInitAttachment(attachments: AttachmentWrapper[], uplodingAttachments: ItemAttachment[]) {
    return attachments.concat(uplodingAttachments.map(val => {
        return {
            uid: val.item.id,
            isUploding: true,
            isDeleting: false,
            attachment: { ...val, '@odata.type': '#microsoft.graph.itemAttachment' }
        };
    }));
}

function addAttachment(attachments: AttachmentWrapper[], uid: string, uplodingAttachment: Attachment) {
    return attachments.map(val => {
        if (val.uid === uid) {
            const attachment: AttachmentWrapper = {
                uid: val.uid,
                isUploding: false,
                isDeleting: val.isDeleting,
                attachment: uplodingAttachment
            };
            return attachment;
        }
        return val;
    });
}
function removeUplodingAttachment(attachments: AttachmentWrapper[], uid: string) {
    return attachments.filter(val => val.uid !== uid);
}
function removeUplodingInitAttachment(attachments: AttachmentWrapper[], uplodingAttachments: ItemAttachment[]) {
    return attachments.filter(val => {
        if (uplodingAttachments.find(att => att.item.id === val.uid)) {
            return false;
        }
        return true;
    });
}
function setImportance(state: ComposeState, importance: Importance) {
    return Object.freeze({
        ...state,
        composeItem: Object.freeze({ ...state.composeItem, importance: importance }),
    });
}
function setSubject(state: ComposeState, subject: string) {
    return Object.freeze({
        ...state,
        composeItem: Object.freeze({ ...state.composeItem, subject: subject }),
    });
}
function setBody(state: ComposeState, body: string) {
    return Object.freeze({
        ...state,
        composeItem: Object.freeze({ ...state.composeItem, body: { ...state.composeItem.body, content: body } }),
    });
}
function setComposeItemViewData(state: ComposeState, composeItem: Message, refItem: Message, token: string): ComposeState {
    let followUpText = '';
    composeItem.body.content = composeItem.body.content ? composeItem.body.content : '<p></p>';
    if (composeItem.flag && composeItem.flag.flagStatus === 'flagged') {
        if (composeItem.flag.dueDateTime.dateTime && composeItem.flag.startDateTime.dateTime) {
            followUpText = getFollowUpText(composeItem.flag);
        } else {
            followUpText = 'After this message is sent, it will be flagged for you with the following information: Follow up.';
        }

    }
    if (token === 'replyForward') {
        // composeItem.body.content = '<p></p> <div id ="divRplyFwdMsg"></div>' + composeItem.body.content;
        if (!composeItem.attachments) {
            composeItem.attachments = [];
        }
    }
    return Object.freeze({
        ...state,
        composeItem: composeItem,
        attachments: composeItem.attachments ?
            composeItem.attachments.map(val => {
                const attachment: AttachmentWrapper = {
                    uid: val.id,
                    isDeleting: false,
                    isUploding: false,
                    attachment: val
                };
                return attachment;
            }) : [],
        followUpText: followUpText,
        lastInlineAttachment: null,
        isMailSending: false,
        isMailSaveing: false,
        isMailDeleteing: false,
        isComposeCloseItem: false,
        refItem: refItem,
        isDirty: false
    });
}



function setFlagFollowUp(state: ComposeState, type: string) {
    switch (type) {
        case 'today':
            return today(state);
        case 'tomorrow':
            return tomorrow(state);
        case 'thisWeek':
            return thisWeek(state);
        case 'nextWeek':
            return nextWeek(state);
        case 'noDate':
            return noDate(state);
        case 'clearflag':
            return clearflag(state);
        default:
            return clearflag(state);
    }
}
function getFollowUpText(flag: FollowupFlag) {
    const datePipe = new DatePipe('en-US');
    return 'After this message is sent, it will be flagged for you with the following information: Follow up. Start by ' +
        datePipe.transform(new Date(flag.startDateTime.dateTime), 'EEE, MMM d, y') + '. Due by ' +
        datePipe.transform(new Date(flag.dueDateTime.dateTime), 'EEE, MMM d, y') + '.';
}
function today(state: ComposeState) {
    const flag: FollowupFlag = {
        flagStatus: 'flagged',
        startDateTime: { dateTime: new Date().toISOString(), timeZone: 'UTC' },
        dueDateTime: { dateTime: new Date().toISOString(), timeZone: 'UTC' }
    };
    return Object.freeze({
        ...state,
        followUpText: getFollowUpText(flag),
        composeItem: Object.freeze({ ...state.composeItem, flag: flag })
    });
}
function tomorrow(state: ComposeState) {
    const tomorrowDate = new Date();
    tomorrowDate.setDate(tomorrowDate.getDate() + 1);
    const flag: FollowupFlag = {
        flagStatus: 'flagged',
        startDateTime: { dateTime: tomorrowDate.toISOString(), timeZone: 'UTC' },
        dueDateTime: { dateTime: tomorrowDate.toISOString(), timeZone: 'UTC' }
    };
    return Object.freeze({
        ...state,
        followUpText: getFollowUpText(flag),
        composeItem: Object.freeze({ ...state.composeItem, flag: flag })
    });
}
function thisWeek(state: ComposeState) {
    const tomorrowDate = new Date();
    const datePipe = new DatePipe('en-US');
    tomorrowDate.setDate(tomorrowDate.getDate() + 1);
    const date = new Date();
    const Today = datePipe.transform(new Date(), 'fullDate');
    const LastDate = datePipe.transform(date.getThisWeekFriday(), 'fullDate');
    const flag: FollowupFlag = {
        flagStatus: 'flagged',
        startDateTime: {
            dateTime: Today ===
                LastDate ? date.getThisWeekFriday().toISOString() : tomorrowDate.toISOString(), timeZone: 'UTC'
        },
        dueDateTime: { dateTime: date.getThisWeekFriday().toISOString(), timeZone: 'UTC' }
    };
    return Object.freeze({
        ...state,
        followUpText: getFollowUpText(flag),
        composeItem: Object.freeze({ ...state.composeItem, flag: flag })
    });
}
function nextWeek(state: ComposeState) {
    const date = new Date();
    const flag: FollowupFlag = {
        flagStatus: 'flagged',
        startDateTime: { dateTime: date.getNextWeekMonday().toISOString(), timeZone: 'UTC' },
        dueDateTime: { dateTime: date.getNextWeekFriday().toISOString(), timeZone: 'UTC' }
    };
    return Object.freeze({
        ...state,
        followUpText: getFollowUpText(flag),
        composeItem: Object.freeze({ ...state.composeItem, flag: flag })
    });
}
function noDate(state: ComposeState) {
    const flag: FollowupFlag = {
        flagStatus: 'flagged'
    };
    return Object.freeze({
        ...state,
        followUpText: 'After this message is sent, it will be flagged for you with the following information: Follow up.',
        composeItem: Object.freeze({ ...state.composeItem, flag: flag })
    });
}
function clearflag(state: ComposeState) {
    const flag: FollowupFlag = {
        flagStatus: 'notFlagged'
    };
    return Object.freeze({
        ...state,
        followUpText: '',
        composeItem: Object.freeze({ ...state.composeItem, flag: flag })
    });
}
export const getView = (state: State) => state;
export const getComposeItemViewByToken = (token) => createSelector(getView, (views) => views[token]);
export const getComposeItemByToken = (token) => createSelector(getComposeItemViewByToken(token), (view) => view ? view.composeItem : null);
export const getRefItemByToken = (token) => createSelector(getComposeItemViewByToken(token), (view) => view ? view.refItem : null);
export const getFollowUpTextByToken = (token) =>
    createSelector(getComposeItemViewByToken(token), (view) => (view && view.followUpText) ? view.followUpText : '');
export const getIsMailSendingByToken = (token) =>
    createSelector(getComposeItemViewByToken(token), (view) => view ? view.isMailSending : null);
export const getIsSendFailByToken = (token) =>
    createSelector(getComposeItemViewByToken(token), (view) => view ? view.isSendFail : null);
export const getIsMailSavingByToken = (token) =>
    createSelector(getComposeItemViewByToken(token), (view) => view ? view.isMailSaveing : null);
export const getIsMailDeleteingByToken = (token) =>
    createSelector(getComposeItemViewByToken(token), (view) => view ? view.isMailDeleteing : null);
export const getIsAttachmentsUplodingByToken = (token) =>
    createSelector(getComposeItemViewByToken(token), (view) => view ? view.attachments.filter(val => val.isUploding).length > 0 : false);
export const getIsAttachmentsDeletingByToken = (token) =>
    createSelector(getComposeItemViewByToken(token), (view) => view ? view.attachments.filter(val => val.isDeleting).length > 0 : false);
export const getIsComposeCloseItemByToken = (token) =>
    createSelector(getComposeItemViewByToken(token), (view) => view ? view.isComposeCloseItem : null);

export const getInlineAttachmentsByToken = (token) =>
    createSelector(getComposeItemViewByToken(token), (view) => view ? view.attachments.filter(val => val.attachment.isInline) : []);
export const getListAttachmentsByToken = (token) =>
    createSelector(getComposeItemViewByToken(token), (view) => view ? view.attachments.filter(val =>
        !val.attachment.isInline && !val.isDeleting) : []);
export const getLastInlineAttachmentByToken = (token) =>
    createSelector(getComposeItemViewByToken(token), (view) => view ? view.lastInlineAttachment : null);
export const getIsDirtyByToken = (token) =>
    createSelector(getComposeItemViewByToken(token), (view) => view ? view.isDirty : null);


