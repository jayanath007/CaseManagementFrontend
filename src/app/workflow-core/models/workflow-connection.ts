
import { refCount, publishReplay, retry, share, switchMap, observeOn, takeUntil, take } from 'rxjs/operators';
import { NgZone } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { HubConnection, HttpTransportType, HubConnectionBuilder, LogLevel } from '@aspnet/signalr';










import { BaseMessage } from './remote-messages';
import { HttpClient } from '@angular/common/http';
import { AuthHttpClient } from './auth-http-client';
import { async } from 'rxjs/internal/scheduler/async';

export class WorkflowConnection {

    private _connection$: Observable<HubConnection>;
    private _workflowStream$: Observable<any | BaseMessage>;
    private _closeToken = new Subject();
    constructor(private zone: NgZone, private httpClient: HttpClient,
        private getAuthToken: () => Observable<string>, private url: string, public instanceId: string) {
        console.log('%cWorkflowConnection created ' + this.instanceId, 'color: blue;');
    }

    private createHubConnection() {
        console.log('%cCall createHubConnection for ' + this.instanceId, 'color:blue');
        return this.getAuthToken().pipe(
            retry(),
            take(1),
            switchMap<string, HubConnection>((authToken) => {
                return Observable.create((observer) => {

                    const authProvider = () => {
                        return new Promise<string>((resolve, reject) => {
                            resolve(authToken);
                        });
                    };

                    const hubConnection = new HubConnectionBuilder()
                        .withUrl(this.url, {
                            transport: HttpTransportType.WebSockets,
                            accessTokenFactory: authProvider,
                            httpClient: new AuthHttpClient()
                        })
                        .configureLogging(LogLevel.Error)
                        .build();


                    console.log('%c Created SignalR connection for ' + this.instanceId, 'color:blue;');

                    hubConnection.start().then(() => {
                        observer.next(hubConnection);
                        console.log('%c Connected SignalR connection for ' + this.instanceId, 'color:blue;');
                    }, (error) => {
                        observer.error(error);
                    });

                    hubConnection.onclose((error) => {
                        if (error) {
                            observer.error(error);
                        }
                        observer.complete();
                    });

                    return () => {
                        console.log('%cConnection closed ', this.instanceId, 'color:green;');
                        hubConnection.stop();
                    };
                });
            }));
    }

    createZoneAwareConnection() {
        return this.zone.runOutsideAngular(() => {
            return this.createHubConnection();
        });
    }

    get connection$() {
        if (!this._connection$) {
            this._connection$ = this.createZoneAwareConnection().pipe(
                // .retryWhen((errors) => {
                //     return errors.delay(300).take(30).do((error) => console.warn('workflow connection error, retying..', error));
                // })
                publishReplay(1),
                refCount(),
                takeUntil(this._closeToken),
                observeOn(async));
        }
        return this._connection$;
    }

    get workflowStream() {
        if (!this._workflowStream$) {
            this._workflowStream$ = this.createStreamingConnection<any>(this.connection$).pipe(
                share(),
                takeUntil(this._closeToken),
                observeOn(async)); // use when unsubscribe from self subscription function
        }
        return this._workflowStream$;
    }

    public close() {
        this._closeToken.next('connection closed');
    }

    public callServerMethod<T>(methodName: string, args: any[]): Promise<T> {
        console.log('%cCalling server methis ' + methodName + ' ' + this.instanceId, 'color:blue;');
        return new Promise((resolve, reject) => {
            const subscription = this.connection$.subscribe((hub) => {
                const allArgs = [methodName, this.instanceId].concat(args || []);
                hub.invoke.apply(hub, allArgs).then(resolve, reject);
                subscription.unsubscribe();
            });
        });
    }

    private createStreamingConnection<TMessages extends BaseMessage>(hubConnection$: Observable<HubConnection>) {
        return hubConnection$.pipe(switchMap<HubConnection, TMessages>((hubConnection) => {
            return Observable.create((observer) => {
                console.log('%cCreating the low level streaming connection', 'color:blue;');
                hubConnection.stream('ClientPort', this.instanceId).subscribe({
                    closed: false,
                    next: (message) => {
                        observer.next(message);
                    },
                    error: (error) => {
                        observer.error(error);
                    },
                    complete: () => {
                        observer.complete();
                    }
                });
                return () => {

                };
            });
        }));
    }
}
