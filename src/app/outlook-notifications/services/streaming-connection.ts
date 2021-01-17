
import { filter, mergeMap, scan, retryWhen, delay, retry, switchMap, skip, take, tap, mapTo } from 'rxjs/operators';
import { NgZone } from '@angular/core';
import { XhrFactory } from '@angular/common/http';
import { Observable, merge, timer, interval, from, of, throwError as _throw } from 'rxjs';
import * as _ from 'lodash';


const LOCAL_KEEP_ALIVE_EVENT = '#DPS.Spitfire.Streaming.KeepAlive';
const OUTLOOK_NOTIFICATION_EVENT = '#Microsoft.OutlookServices.Notification';
const LOCAL_INIT_EVENT = '#DPS.Spitfire.Streaming.InitConnection';
const LOCAL_CONNECTED = '#DPS.Spitfire.Streaming.Connected';
export const LOCAL_RECONNECTED = '#DPS.Spitfire.Streaming.Reconnected';
const SERVER_KEEP_ALIVE_EVENT = '#Microsoft.OutlookServices.KeepAliveNotification';

export class StreamingConnection {

    unSyncEvents = [SERVER_KEEP_ALIVE_EVENT, LOCAL_KEEP_ALIVE_EVENT, LOCAL_INIT_EVENT, LOCAL_CONNECTED];

    keepAliveInterval = 10;
    retryDelay = 3000;
    private connectionError = false;
    constructor(private endpoint: string,
        private getAuthToken: () => Observable<string>,
        private subscriptionIds: string[],
        private xhrFactory: XhrFactory,
        private zone: NgZone,
        private emitReconnect = false,
        private connectionTimeout: number = 10,
    ) {
    }

    connect(): Observable<any> {
        const timeoutInMillSec = 1000 * 60 * this.connectionTimeout;
        const localTimeoutInMillDiff = 1000 * this.keepAliveInterval * 4;
        const retryCount = Math.floor(((timeoutInMillSec - localTimeoutInMillDiff) / (this.retryDelay)));
        const reconnectTick$ = timer(0, timeoutInMillSec - localTimeoutInMillDiff);

        return reconnectTick$.pipe(
            switchMap((gen) => {
                const nextTick$ = reconnectTick$.pipe(skip(1), take(1),
                    tap(() => {
                        console.log('this is the next tick');
                    }));
                return this.connection2().pipe(
                    retryWhen(errors =>
                        errors.pipe(delay(this.retryDelay),
                            tap(() => this.connectionError = true),
                            tap(error => console.warn('streamming connection error, reconnection atttempt after 3 seconds', error, gen)))
                        // .takeUntil(nextTick$)
                        // .concat(_throw(new Error('streamming connection fails after 10 attempst')))
                    ));
            }));
    }

    private connection2(): Observable<any> {
        return this.zoneAwareConnection().pipe(
            scan((info, event) => {
                if ([SERVER_KEEP_ALIVE_EVENT,
                    OUTLOOK_NOTIFICATION_EVENT,
                    LOCAL_INIT_EVENT,
                    LOCAL_CONNECTED].indexOf(event['@odata.type']) !== -1) {

                    info.lastKeepAlive = new Date();
                }
                info.reconnected = false;
                if (event['@odata.type'] === SERVER_KEEP_ALIVE_EVENT && (this.connectionError || this.emitReconnect)) {
                    this.connectionError = false;
                    this.emitReconnect = false;
                    info.reconnected = true;
                }
                info.event = event;
                return info;
            }, { event: null, lastKeepAlive: new Date(), reconnected: false }),
            mergeMap((info) => {
                const timeDiff = (new Date().getTime() - info.lastKeepAlive.getTime()) / 1000;
                if (timeDiff >= 3 * this.keepAliveInterval) {
                    return _throw('Server did not responded with keepalive notification');
                }
                if (info.reconnected) {
                    return of(info.event, { '@odata.type': LOCAL_RECONNECTED });
                }
                return of(info.event);
            }),
            filter((event) => this.unSyncEvents.indexOf(event['@odata.type']) === -1));
    }

    zoneAwareConnection(): Observable<any> {
        return Observable.create((observer) => {
            this.zone.runOutsideAngular(() => {
                const tick$ = interval(this.keepAliveInterval * 1000).pipe(mapTo({ '@odata.type': LOCAL_KEEP_ALIVE_EVENT }));
                const subsciption = merge(this.createConnection(), tick$).subscribe((event) => {
                    if (this.unSyncEvents.indexOf(event['@odata.type']) === -1) {
                        this.zone.run(() => {
                            observer.next(event);
                        });
                    } else {
                        observer.next(event);
                    }
                }, (error) => {
                    this.zone.run(() => {
                        observer.error(error);
                    });
                }, () => {
                    this.zone.run(() => {
                        observer.complete();
                    });
                });

                return () => {
                    subsciption.unsubscribe();
                };

            });

        });
    }

    createConnection(): Observable<any> {
        return this.getAuthToken().pipe(retry(), take(1), switchMap((authToken) => {
            return Observable.create((observer) => {
                this.zone.runOutsideAngular(() => {
                    const xhr = this.xhrFactory.build();
                    xhr.open('POST', this.endpoint + '/Me/GetNotifications');
                    xhr.setRequestHeader('Accept', 'application/json, text/plain, */*');
                    xhr.setRequestHeader('Content-Type', 'application/json');
                    xhr.setRequestHeader('Authorization', 'Bearer ' + authToken);
                    xhr.responseType = 'text';

                    let isConnected = false;

                    const onError = (error: ErrorEvent) => {
                        const res = {
                            error,
                            status: xhr.status || 0,
                            statusText: xhr.statusText || 'Unknown Error',
                        };
                        observer.error(res);
                        console.error('streaming connection error', error);
                    };

                    const getContent = () => {
                        return (typeof xhr.response === 'undefined') ? xhr.responseText : xhr.response;
                    };

                    const onLoad = () => {
                        const content = getContent();
                        try {
                            const data = JSON.parse(content);
                            observer.next(data);
                        } catch (e) { console.warn('Unexpected json recived for stermming end', content); }
                        observer.complete();
                    };

                    xhr.addEventListener('error', onError);
                    xhr.addEventListener('load', onLoad);

                    xhr.onreadystatechange = (event) => {
                        if (xhr.readyState !== xhr.LOADING) {
                            return;
                        }
                        const content = getContent();
                        if (content !== '') {
                            try {
                                const data = JSON.parse(content + ']}');
                                if (!isConnected) {
                                    isConnected = true;
                                    data.push({ '@odata.type': LOCAL_CONNECTED });
                                }
                                observer.next(data);
                            } catch (e) {
                            }
                        }
                    };

                    const body = {
                        ConnectionTimeoutInMinutes: this.connectionTimeout,
                        KeepAliveNotificationIntervalInSeconds: this.keepAliveInterval,
                        SubscriptionIds: this.subscriptionIds
                    };

                    const initEvent = [{ '@odata.type': LOCAL_INIT_EVENT }];
                    observer.next(initEvent);

                    xhr.send(JSON.stringify(body));
                    // local init notification

                    return () => {
                        xhr.removeEventListener('error', onError);
                        xhr.removeEventListener('load', onLoad);
                        xhr.onreadystatechange = null;
                        xhr.abort();
                        console.log('cleanning connection');
                    };
                });
            }).pipe(
                scan((info: any, data: { value: any[] }) => {
                    if (data.value) {
                        info.items = data.value.slice(info.lastIndex);
                        info.lastIndex = data.value.length;
                    } else if (_.isArray(data)) {
                        info.items = data;
                    }
                    return info;
                }, { lastIndex: 0, items: [] }),
                mergeMap((info: any) => from(info.items)));

        }));
    }

}
