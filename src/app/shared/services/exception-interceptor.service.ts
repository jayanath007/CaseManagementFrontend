import { IS_GOOGLE } from './../../shared';
import { map, catchError } from 'rxjs/operators';
import { InforDialogComponent } from '../components/infor-dialog/infor-dialog.component';
import { ErrorDataUploadService } from './error-data-upload.service';
import { ConsoleError, ExceptiontTypes } from '../models/consol-error';
import { FailDialogData, InforDialogData } from '../models/dialog';
import { FailDialogComponent } from '../components/fail-dialog/fail-dialog.component';
import { ExceptionNotificationReceived } from '../../exception-desktop/actions/exceptions';
import { Store } from '@ngrx/store';
import { Observable, throwError as _throw } from 'rxjs';
import { Injectable, Inject } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { ExceptionDialogData, ExceptionalertTypes } from '..';
import { MatDialog } from '@angular/material';
import { AuthInfoStateService } from '../../auth';
import { DPSConstants } from './../../core/lib/dpsConstant';
import { getExtention } from '../../utils/file';
import { DurableTaskStatus } from '../../azure-storage';
import { blacklistExtention } from '../../core';
import { V3Error } from '../models/interface';
import { SeverityLevel } from 'ng2-appinsights';
@Injectable()
export class ExceptionInterceptor implements HttpInterceptor {
    [x: string]: any;
    isOffline = false;
    constructor(private dialog: MatDialog, private authHelper: AuthInfoStateService,
        private errorDataUploadService: ErrorDataUploadService,
        private store: Store<any>, @Inject(IS_GOOGLE) public isGoogle: boolean) {
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const ignowError = req.url.search('ignowError=true') > 0;
        // if (ignowError) {
        //     return next.handle(req);
        // }
        const suppressErrors = req.url.search('suppressErrors=true') > 0;
        const suppressFail = req.url.search('suppressFail=true') > 0;
        const hideFailMassge = req.url.search('hideFailMassge=true') > 0;
        if (!navigator.onLine) {
            if (!this.isOffline) {
                this.isOffline = true;
                if (confirm('Browser is offline')) {
                    setTimeout(() => {
                        this.isOffline = false;
                    }, 1000);
                } else {
                    setTimeout(() => {
                        this.isOffline = false;
                    }, 1000);
                }
            }
            return _throw(req);
        } else if (this.checkoBlacklistExtentionFileIncluded(req)) {
            const dialogData: ExceptionDialogData = {
                content: {
                    title: 'Harmful file detection',
                    path: this.authHelper.isGraphApi(req.url) ? '' : req.url.split('Api/')[1],
                    message: 'You are try to upload harmful file type, please contact admin',
                    code: '',
                    dateTime: new Date().toDpsString()
                },
                alertTypes: ExceptionalertTypes.ERROR
            };

            this.openExceptionDialog(dialogData);
            return _throw(req);
        } else if (this.authHelper.isDpsApi(req.url)) {
            if (req.url.search('DoMLSFunction') > 0) {
                return next.handle(req).pipe(
                    map((event: HttpEvent<any>) => {
                        if (event instanceof HttpResponse) {
                            if (event.body && event.body.ErrorDetails) {
                                const dialogData: ExceptionDialogData = {
                                    content: {
                                        title: event.body.ErrorDetails.LogId,
                                        path: event.url.split('Api/')[1],
                                        message: event.body.ErrorDetails.Message,
                                        code: event.body.Code,
                                        dateTime: new Date().toDpsString()
                                    },
                                    alertTypes: ExceptionalertTypes.ERROR
                                };
                                if (!suppressErrors && event.body.ErrorDetails.Message !== DPSConstants.MatterNotRegisterInMLS) {
                                    this.openExceptionDialog(dialogData);
                                }
                                throw _throw(event);
                            } else if (event.body.status === 'Exception') {
                                const dialogData: ExceptionDialogData = {
                                    content: {
                                        title: event.body.detailStatus[0].messageType,
                                        path: event.url.split('Api/')[1],
                                        message: event.body.detailStatus[0].message,
                                        code: event.body.detailStatus[0].code,
                                        dateTime: new Date().toDpsString()
                                    },
                                    alertTypes: event.body.detailStatus[0].messageType
                                };
                                if (!suppressErrors) {
                                    this.openExceptionDialog(dialogData);
                                }
                                throw _throw(event);
                            }

                            if (!event.body) {
                                return event.clone({ body: event });
                            }

                            return event;
                        }

                    }));
            } else if (req.url.search('DoSafeBoxFunction') > 0) {
                return next.handle(req).pipe(
                    map((event: HttpEvent<any>) => {
                        if (event instanceof HttpResponse) {
                            if (event.body && event.body.Code && event.body.Code === 'ContainerNotFound') {
                                return event;
                            } else if (event.body && event.body.Code && event.body.Message) {
                                const dialogData: ExceptionDialogData = {
                                    content: {
                                        title: event.body.Code,
                                        path: event.url.split('Api/')[1],
                                        message: event.body.Message,
                                        code: event.body.Code,
                                        dateTime: new Date().toDpsString()
                                    },
                                    alertTypes: ExceptionalertTypes.ERROR
                                };
                                if (!suppressErrors) {
                                    this.openExceptionDialog(dialogData);
                                }
                                throw _throw(event);
                            }

                            if (!event.body) {
                                return event.clone({ body: event });
                            }

                            return event;
                        }

                    }));
            } else {
                return next.handle(req).pipe(
                    map((event: HttpEvent<any>) => {
                        if (event instanceof HttpResponse) {

                            if (event.body.status === 'Fail' && !suppressFail) {
                                if (!(req.headers.has('X-dps') && req.headers.get('X-dps') === 'suppressErrors')) {
                                    if (!hideFailMassge) {
                                        this.openFailDialog(event.body);
                                    }
                                }
                                throw event;
                            } else if (event.body.status === 'Fail' && event.url.includes('/SendMailViaProfileEmail')) {
                                if (window.opener && window.opener !== window && window.name !== 'mail' &&
                                    event.body.detailStatus && event.body.detailStatus.length > 0) {
                                    const inforDialogData: InforDialogData = {
                                        content: {
                                            title: 'Send Fail',
                                            message: event.body.detailStatus[0].message
                                        },
                                        data: { messageType: 'warning' }
                                    };
                                    const dialogRef = this.dialog.open(InforDialogComponent, {
                                        data: inforDialogData,
                                        width: '400px',
                                        disableClose: true,
                                        hasBackdrop: false,
                                        panelClass: 'dps-notification'
                                    });
                                }
                                throw event;
                            } else if (event.body.status === 'ValidationFail' && !suppressFail) {
                                if (!hideFailMassge) {
                                    this.openFailDialog(event.body);
                                }
                                throw event;

                            } else if (event.body.status === 'Exception') {
                                if (event.body.detailStatus[0].exceptionType !== 'Known') {
                                    const dialogData: ExceptionDialogData = {
                                        content: {
                                            title: event.body.detailStatus[0].messageType,
                                            path: event.url.split('Api/')[1],
                                            message: event.body.detailStatus[0].message,
                                            code: event.body.detailStatus[0].code,
                                            dateTime: new Date().toDpsString()
                                        },
                                        alertTypes: event.body.detailStatus[0].messageType
                                    };
                                    if (!suppressErrors) {
                                        this.openExceptionDialog(dialogData);
                                    }
                                    throw event;
                                } else {
                                    return event;
                                }
                            } else {
                                return event;
                            }
                        }
                    }),
                    catchError((err: any, caught) => {
                        const properties = err;
                        delete properties['headers'];

                        const trackException: ConsoleError = {
                            exception: err.message,
                            handledAt: 'unhandled',
                            properties: JSON.parse((JSON.stringify(properties))),
                            measurements: null,
                        };
                        this.errorDataUploadService.addErrorInfor(trackException, ExceptiontTypes.network);

                        if (err instanceof HttpErrorResponse) {
                            if ((req.headers.has('X-dps') && req.headers.get('X-dps') === 'suppressErrors') || err.status === 404 ||  err.status === 403) {
                                return _throw(err);
                            }
                            const dialogData: ExceptionDialogData = {
                                content: {
                                    title: 'Connection error',
                                    path: err.message,
                                    message: '',
                                    code: '',
                                    dateTime: new Date().toDpsString()
                                },
                                alertTypes: ExceptionalertTypes.ERROR
                            };
                            if (!suppressErrors) {
                                this.openExceptionDialog(dialogData);
                            }
                        }
                        return _throw(err);
                    }));
            }
        } else if (!this.isGoogle && this.authHelper.isGraphApi(req.url)) {
            return next.handle(req).pipe(
                map((event: HttpResponse<any>) => {
                    // if (req.url.includes('$batch') && event['body']
                    //     && event['body'].responses && event['body'].responses.find(val => val.status === 429)) {

                    //     throw _throw(event['body'].responses.find(val => val.status === 429));
                    // }
                    if (req.url.includes('$batch') && event.body
                        && event.body.responses && event.body.responses.find(val => val.status === 403)) {
                        const inforDialogData: InforDialogData = {
                            content: {
                                title: `Access is denied`,
                                message: `You don't have permission to perform this action.`
                            },
                            data: { messageType: 'warning' }
                        };
                        const dialogRef = this.dialog.open(InforDialogComponent, {
                            data: inforDialogData,
                            width: '400px',
                            disableClose: true,
                            hasBackdrop: false,
                            panelClass: 'dps-notification'
                        });
                    }
                    if (req.url.includes('$batch') && event.body && event.body.responses &&
                        event.body.responses
                            .find(val => (val.body && val.body.error && val.body.error.code === 'ErrorMoveCopyFailed'))) {
                        const inforDialogData: InforDialogData = {
                            content: {
                                title: `Error`,
                                message: `You do not have permission to move items in this folder.
                                        To check your permission for the folder,
                                        see the folder owner or your administrator to change your permissions.
                                    `
                            },
                            data: { messageType: 'warning' }
                        };
                        const dialogRef = this.dialog.open(InforDialogComponent, {
                            data: inforDialogData,
                            width: '400px',
                            disableClose: true,
                            hasBackdrop: false,
                            panelClass: 'dps-notification'
                        });
                    }
                    if (req.url.includes('$batch') && event.body && event.body.responses &&
                        event.body.responses
                            .find(val => (val.body && val.body.error && val.body.error.code === 'ErrorCannotDeleteObject'))) {
                        const inforDialogData: InforDialogData = {
                            content: {
                                title: `Error`,
                                message: `You don't have appropriate permission to perform this action.`
                            },
                            data: { messageType: 'warning' }
                        };
                        const dialogRef = this.dialog.open(InforDialogComponent, {
                            data: inforDialogData,
                            width: '400px',
                            disableClose: true,
                            hasBackdrop: false,
                            panelClass: 'dps-notification'
                        });
                    }
                    // if (req.url.includes('$batch') && event['body'] && event['body'].responses &&
                    //     event['body'].responses
                    //         .find(val => (val.body && val.body.error && val.body.error.message ===
                    //             `Requested move requires an async response, add 'Prefer: respond - async' to allow`))) {
                    //     const inforDialogData: InforDialogData = {
                    //         content: {
                    //             title: `Error`,
                    //             message: `You do not have permission to move items in this folder.
                    //                     To check your permission for the folder,
                    //                     see the folder owner or your administrator to change your permissions.
                    //                 `
                    //         },
                    //         data: { messageType: 'warning' }
                    //     };
                    //     const dialogRef = this.dialog.open(InforDialogComponent, {
                    //         data: inforDialogData,
                    //         width: '400px',
                    //         disableClose: true,
                    //         hasBackdrop: false,
                    //         panelClass: 'dps-notification'
                    //     });
                    // }
                    return event;
                }),
                catchError((info: HttpErrorResponse, caught) => {
                    if (info instanceof HttpErrorResponse) {
                        // if (info.status === 429) {
                        //     const properties = {
                        //         ...info,
                        //         errorCode: info.error.error ? info.error.error.code : '',
                        //         clientRequestId: (info.error.error && info.error.error.innerError) ?
                        //             info.error.error.innerError['client-request-id'] : '',
                        //         errorDate: (info.error.error && info.error.error.innerError) ? info.error.error.innerError['date'] : '',
                        //     };
                        //     delete properties['headers'];
                        //     delete properties['error'];

                        //     const trackException: ConsoleError = {
                        //         exception: info.error.error ? info.error.error.message : 'network errors',
                        //         properties: JSON.parse((JSON.stringify(properties))),
                        //         measurements: null
                        //     };
                        //     this.errorDataUploadService.addErrorInfor(trackException, ExceptiontTypes.graphAPI);
                        // }

                        const dialogData: ExceptionDialogData = {
                            content: {
                                title: info.statusText,
                                path: req.method + ' - ' + info.message,
                                message: info.error.error.message,
                                code: info.error.error.code,
                                isGraphApi: true,
                                error: {
                                    date: info.error.error.innerError.date,
                                    requestId: info.error.error.innerError['request-id']
                                },
                                dateTime: new Date().toDpsString()
                            },
                            alertTypes: ExceptionalertTypes.ERROR
                        };
                        if ((req.headers.has('X-dps') && req.headers.get('X-dps') === 'suppressErrors') || info.status === 404) {
                            return _throw(info);
                        }
                        if (info.error.error.code === 'ErrorFolderExists' &&
                            (req.url.includes('/me/calendars/') || req.url.includes('/me/calendarGroups/')) &&
                            info.error.error.message === 'A folder with the specified name already exists.') {
                            const inforDialogData: InforDialogData = {
                                content: {
                                    title: `Couldn't open calendar`,
                                    message: 'A calendar with this name already exist.'
                                },
                                data: { messageType: 'warning' }
                            };
                            const dialogRef = this.dialog.open(InforDialogComponent, {
                                data: inforDialogData,
                                width: '400px',
                                disableClose: true,
                                hasBackdrop: false,
                                panelClass: 'dps-notification'
                            });
                            return _throw(info);
                        }
                        if (info.error.error.code === 'ErrorFolderExists' && req.url.includes('/mailFolders/')) {
                            const inforDialogData: InforDialogData = {
                                content: {
                                    title: `Error`,
                                    message: info.error.error.message
                                },
                                data: { messageType: 'warning' }
                            };
                            const dialogRef = this.dialog.open(InforDialogComponent, {
                                data: inforDialogData,
                                width: '400px',
                                disableClose: true,
                                hasBackdrop: false,
                                panelClass: 'dps-notification'
                            });
                            return _throw(info);
                        }
                        if (info.error.error.code === 'ErrorFolderSavePropertyError' && req.url.includes('/mailFolders/') &&
                            req.body.displayName &&
                            info.error.error.message === 'The folder save operation failed due to invalid property values.') {
                            const inforDialogData: InforDialogData = {
                                content: {
                                    title: `Access is denied`,
                                    message: 'You might not have permission to perform this action.'
                                },
                                data: { messageType: 'warning' }
                            };
                            const dialogRef = this.dialog.open(InforDialogComponent, {
                                data: inforDialogData,
                                width: '400px',
                                disableClose: true,
                                hasBackdrop: false,
                                panelClass: 'dps-notification'
                            });
                            return _throw(info);
                        }
                        if (info.error.error.code === 'ErrorMoveCopyFailed') {
                            const inforDialogData: InforDialogData = {
                                content: {
                                    title: `Error`,
                                    message: `You do not have permission to move items in this folder.
                                        To check your permission for the folder,
                                        see the folder owner or your administrator to change your permissions.
                                    `
                                },
                                data: { messageType: 'warning' }
                            };
                            const dialogRef = this.dialog.open(InforDialogComponent, {
                                data: inforDialogData,
                                width: '400px',
                                disableClose: true,
                                hasBackdrop: false,
                                panelClass: 'dps-notification'
                            });
                            return _throw(info);
                        }
                        if (info.error.error.code === 'ErrorCannotDeleteObject') {
                            const inforDialogData: InforDialogData = {
                                content: {
                                    title: `Error`,
                                    message: `You don't have appropriate permission to perform this action.`
                                },
                                data: { messageType: 'warning' }
                            };
                            const dialogRef = this.dialog.open(InforDialogComponent, {
                                data: inforDialogData,
                                width: '400px',
                                disableClose: true,
                                hasBackdrop: false,
                                panelClass: 'dps-notification'
                            });
                            return _throw(info);
                        }
                        if (info.error.error.code === 'ErrorApplyConversationActionFailed') {
                            const inforDialogData: InforDialogData = {
                                content: {
                                    title: `Error`,
                                    message: `You don't have appropriate permission to perform this action.`
                                },
                                data: { messageType: 'warning' }
                            };
                            const dialogRef = this.dialog.open(InforDialogComponent, {
                                data: inforDialogData,
                                width: '400px',
                                disableClose: true,
                                hasBackdrop: false,
                                panelClass: 'dps-notification'
                            });
                            return _throw(info);
                        }
                        if (info.error.error.message === 'Modified occurrence is crossing or overlapping adjacent occurrence.') {
                            const inforDialogData: InforDialogData = {
                                content: {
                                    title: `Couldn't update the event`,
                                    message: info.error.error.message
                                },
                                data: { messageType: 'warning' }
                            };
                            const dialogRef = this.dialog.open(InforDialogComponent, {
                                data: inforDialogData,
                                width: '400px',
                                disableClose: true,
                                hasBackdrop: false,
                                panelClass: 'dps-notification'
                            });
                            return _throw(info);
                        }
                        if (info.error.error.message === 'The deletion failed.' &&
                            req.url.includes('/me/events/') && req.url.includes('/attachments/')) {
                            const inforDialogData: InforDialogData = {
                                content: {
                                    title: info.error.error.message,
                                    message: `The attachment couldn't be deleted`
                                },
                                data: { messageType: 'warning' }
                            };
                            const dialogRef = this.dialog.open(InforDialogComponent, {
                                data: inforDialogData,
                                width: '400px',
                                disableClose: true,
                                hasBackdrop: false,
                                panelClass: 'dps-notification'
                            });
                            return _throw(info);
                        }
                        if (info.status === 403) {
                            let message = `You don't have permission to perform this action.`;
                            if (info.error.error.code === 'ErrorSendAsDenied') {
                                if (window.opener && window.opener !== window && window.name !== 'mail') {
                                    message = info.error.error.message;
                                } else {
                                    return _throw(info);
                                }
                            }
                            const inforDialogData: InforDialogData = {
                                content: {
                                    title: `Access is denied`,
                                    message: message
                                },
                                data: { messageType: 'warning' }
                            };
                            const dialogRef = this.dialog.open(InforDialogComponent, {
                                data: inforDialogData,
                                width: '400px',
                                disableClose: true,
                                hasBackdrop: false,
                                panelClass: 'dps-notification'
                            });
                            return _throw(info);
                        }

                        if (!req.url.includes('/me/drive/special/Documents:/DPS/DPS_SIGNATURE.html')) {
                            // this.openExceptionDialog(dialogData);
                        }
                        return _throw(info);
                    }
                }));
        } else if (this.authHelper.isV3Api(req.url)) {
            return next.handle(req).pipe(
                map((event: HttpResponse<any>) => {
                    const traceparent = req.headers.get('traceparent');
                    if (event.body && req.url.includes('/DurableTaskStatusProxy/') && traceparent) {
                        const data: DurableTaskStatus = event.body;

                        if (data.runtimeStatus === 'Failed' || data.runtimeStatus === 'Terminated') {

                            const dialogData: ExceptionDialogData = {
                                content: {
                                    title: data.runtimeStatus,
                                    path: '',
                                    message: 'Request Id -',
                                    code: traceparent.split('-')[1] + '<br>Parent Id - ' + traceparent.split('-')[0],
                                    dateTime: new Date().toDpsString()
                                },
                                alertTypes: ExceptionalertTypes.ERROR
                            };
                            if (!suppressErrors) {
                                this.openExceptionDialog(dialogData);
                            }
                        } else if (data.runtimeStatus === 'Completed' && data.output.items) {
                            const item = data.output.items.find(val => !val.success);
                            if (item) {
                                const dialogData: ExceptionDialogData = {
                                    content: {
                                        title: 'Copy Error',
                                        path: item.errorMessage,
                                        message: 'Request Id -',
                                        code: traceparent.split('-')[1] + '<br>Parent Id - ' + traceparent.split('-')[2],
                                        dateTime: new Date().toDpsString()
                                    },
                                    alertTypes: ExceptionalertTypes.ERROR
                                };
                                if (!suppressErrors) {
                                    this.openExceptionDialog(dialogData);
                                }
                            }
                        }

                    }
                    return event;
                }),
                catchError((res: HttpErrorResponse) => {
                    const traceparent = req.headers.get('traceparent');
                    if (traceparent) {

                        let error: V3Error = res.error;

                        // Convert string responce to object
                        if (typeof res.error === 'string') {
                            error = JSON.parse(res.error);
                        }

                        if (res.status === 404 && error.message.includes('The file not available in the storage')) {

                        } else if (error && Array.isArray(error.errorDetail) && error.errorDetail.length > 0) {
                            const failDialogData: FailDialogData = {
                                messageHeader: error.errorCode,
                                messageBody: error.message,
                                status: res.statusText,
                                detailStatus: error.errorDetail.map(err => ({ title: err.key || err.Key, message: err.value || err.Value }))
                            };
                            this.openFailDialog(failDialogData);
                        } else {

                            const dialogData: ExceptionDialogData = {
                                content: {
                                    title: res.statusText,
                                    path: `${res.message} ${(error && error.message) ? ('<br>' + error.message) : ''}`,
                                    message: 'Request Id -',
                                    code: traceparent.split('-')[1] + '<br>Parent Id - ' + traceparent.split('-')[2],
                                    dateTime: new Date().toDpsString()
                                },
                                alertTypes: ExceptionalertTypes.ERROR
                            };
                            if (!suppressErrors) {
                                this.openExceptionDialog(dialogData);
                            }
                        }
                    }

                    return _throw(res);
                }));
        } else {
            return next.handle(req);
        }
    }

    openExceptionDialog(dialogData: ExceptionDialogData) {
        this.store.dispatch(new ExceptionNotificationReceived({ exception: dialogData }));
    }

    openFailDialog(dialogData: FailDialogData) {
        const dialogRef = this.dialog.open(FailDialogComponent, {
            data: dialogData,
            width: '450px',
            panelClass: 'dps-notification'
        });
    }

    checkoBlacklistExtentionFileIncluded(req: HttpRequest<any>): boolean {
        if (req.method !== 'POST' || !req.body || !req.url) {
            return false;
        } else {
            let fileName = '';
            if (this.authHelper.isDpsApi(req.url)) {
                if (req.body.get && req.body.get('files') && req.body.get('files').name) {
                    fileName = req.body.get('files').name;
                } else if (req.body.Attachments
                    && req.body.Attachments[0] && req.body.Attachments[0].FileAttachmentTypeViewModel
                    && req.body.Attachments[0].FileAttachmentTypeViewModel
                    && req.body.Attachments[0].FileAttachmentTypeViewModel.Name) {
                    fileName = req.body.Attachments[0].FileAttachmentTypeViewModel.Name;
                }
            } else if (this.isGoogle) {

            } else if (this.authHelper.isGraphApi(req.url)) {
                fileName = req.body.name || '';
            } else if (req.url.split('.').length > 0) {
                fileName = req.url.split('.')[req.url.split('.').length - 1];
            }
            return blacklistExtention.includes(getExtention(req.body.name).toLowerCase());
        }
    }
}

