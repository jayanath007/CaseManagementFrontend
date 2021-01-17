import { AppConfig } from '../../core/configs/app-config';
import { AuthInfoStateService } from '../../auth/services/auth-info-state.service';
import { interval, Observable } from 'rxjs';
import { ConsoleError, ExceptiontTypes } from '../models/consol-error';
import { SeverityLevel, AppInsightsService } from 'ng2-appinsights';
import { AngularIndexedDB } from './angular2-indexeddb';
import { Injectable, Inject } from '@angular/core';


@Injectable()
export class ErrorDataUploadService {

    database;
    uploadInterval = 6000;

    constructor(public appInsightsService: AppInsightsService, private appConfig: AppConfig, private authHelper: AuthInfoStateService) {

    }

    createErrorLogTable() {
        this.database = new AngularIndexedDB('errorDb', this.appConfig.indexeddbVersion);
        this.database.openDatabase(1, (evt) => {
            const objectStore = evt.currentTarget.result.createObjectStore(
                'errorLog', { keyPath: 'id', autoIncrement: true });
            objectStore.createIndex('errorInfo', 'errorInfo', { unique: false });
            objectStore.createIndex('exceptiontTypes', 'exceptiontTypes', { unique: false });
        });
    }

    addErrorInfor(errorInfo: any, exceptiontTypes: ExceptiontTypes) {
        let errorMessage = '';
        if (errorInfo.exception) {
            errorMessage = errorInfo.exception.message ? errorInfo.exception.message : errorInfo.exception.toString();
        }
        errorInfo.properties['errorMessage'] = errorMessage;
        errorInfo.properties['date'] = new Date();
        errorInfo.properties['userAgent'] = navigator.userAgent;
        errorInfo.properties['curentLocationUrl'] = window.location.href;
        if (window.opener) {
            errorInfo.properties['appInstanceId'] = window.opener['appInstanceId'];
            errorInfo.properties['appName'] = window.name;
        } else {
            errorInfo.properties['appInstanceId'] = window['appInstanceId'];
            errorInfo.properties['appName'] = window['appInstanceId'] === window.name ? 'main' : window.name;
        }
        errorInfo.properties['errorMessage'] = errorMessage;
        this.authHelper.getUser()
            .subscribe((user) => {

                if (user && user.profile && user.profile.name) {
                    errorInfo.properties['username'] = user.profile.name;
                    errorInfo.properties['companyCode'] = user.general.companyCode;
                }
                errorInfo.properties['emailAddress'] = (user) ? user.userName : '';

                this.addErrorInfortoDb(errorInfo, exceptiontTypes);
            }, () => {
                this.addErrorInfortoDb(errorInfo, exceptiontTypes);
            });
    }

    addErrorInfortoDb(errorInfo: ConsoleError, exceptiontTypes: ExceptiontTypes) {

        this.database.getAll('errorLog').then((errorLogList: Array<{
            errorInfo: any,
            exceptiontTypes: ExceptiontTypes
        }>) => {

            if (this.validateRecursiveErrors(errorLogList, errorInfo)) {

                this.database.add('errorLog', {
                    errorInfo: JSON.stringify(errorInfo),
                    exceptiontTypes: exceptiontTypes
                }).then(() => {
                }, (error) => {

                });
            }

        }, (error) => {
            console.log(error);
        });
    }

    validateRecursiveErrors(errorLogList: Array<{ errorInfo: any, exceptiontTypes: ExceptiontTypes }>,
        trackException: ConsoleError): boolean {

        const sameErrors = errorLogList.map((item) => {
            return { errorInfo: JSON.parse(item.errorInfo), exceptiontTypes: item.exceptiontTypes };
        }).filter(item => item.errorInfo.properties.errorMessage === trackException.properties.errorMessage);
        const sameErrorsCount = sameErrors.length;
        if (sameErrorsCount > 3) {

            let n3Date;
            const error1 = sameErrors[sameErrorsCount - 1];
            if (error1 && error1.errorInfo) {
                n3Date = new Date(error1.errorInfo.properties.date);
            }

            let n2Date;
            const error2 = sameErrors[sameErrorsCount - 2];
            if (error2 && error2.errorInfo) {
                n2Date = new Date(error2.errorInfo.properties.date);
            }

            let n1Date;
            const error3 = sameErrors[sameErrorsCount - 3];
            if (error3 && error3.errorInfo) {
                n1Date = new Date(error3.errorInfo.properties.date);
            }

            // const n2Date = new Date(sameErrors[errorLogList.length - 2].errorInfo.properties.date);
            // const n1Date = new Date(sameErrors[errorLogList.length - 3].errorInfo.properties.date);

            // check time difference in last three errors
            const seconds = ((trackException.properties.date.getTime() - n3Date.getTime())
                + (n3Date.getTime() - n2Date.getTime()) + (n2Date.getTime() - n1Date.getTime())) / 1000;
            if (seconds < 5) {
                return false;
            }
        }
        return true;
    }


    logData() {
        return interval(this.uploadInterval).subscribe(x => {
            this.uploadData();
        });
    }

    uploadData() {
        if (navigator && navigator.onLine) {
            this.database.getAll('errorLog').then((errorLog: any[]) => {
                if (errorLog && errorLog.length > 0) {
                    errorLog.forEach(item => {
                        const errorInfoData = JSON.parse(item.errorInfo);
                        if (item.exceptiontTypes === ExceptiontTypes.console) {

                            const error = new Error(errorInfoData.exception.message);
                            error.stack = errorInfoData.exception.stack;
                            delete errorInfoData.properties.errorMessage;

                            this.appInsightsService.trackException(error, errorInfoData.handledAt,
                                errorInfoData.properties, errorInfoData.measurements, errorInfoData.severityLevel);

                        } else if (item.exceptiontTypes === ExceptiontTypes.graphAPI) {
                            this.appInsightsService.trackTrace(
                                errorInfoData.exception,
                                errorInfoData.properties,
                                errorInfoData.measurements
                            );
                        } else {
                            this.appInsightsService.trackTrace('network errors', errorInfoData.properties, errorInfoData.measurements);
                        }
                    });
                    this.clearData();
                }
            }, (error) => {
                console.log(error);
            });
        }
    }

    clearData() {
        this.database.clear('errorLog').then(() => {
        }, (error) => {
            console.log(error);
        });
    }

}
