
import { map, switchMap, catchError } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Person, Contact } from '../../core/lib/microsoft-graph';

import { Observable, from as fromPromise, combineLatest, of } from 'rxjs';

import { AuthInfoStateService } from '../../auth';
import { MsgraphClientBase, ApiClientWrapper } from '../../core';
import { ServiceEndpointConfig } from '../../core/configs/service-configs';
import { SemaphoresService } from '../../shared';

declare var gapi;
@Injectable()
export class ContactsAndPeopleService {
    private msGraphClient: MsgraphClientBase = null;
    constructor(private authInfo: AuthInfoStateService, private semaphoresService: SemaphoresService,
        private httpClient: HttpClient, private configs: ServiceEndpointConfig) {
        if (this.authInfo.isGoogle()) {
            gapi.client.load('https://people.googleapis.com/$discovery/rest', 'v3');
        }
    }

    public getAuthClient<T>(): Observable<ApiClientWrapper<T>> {
        if (!this.msGraphClient) {
            this.msGraphClient = new MsgraphClientBase(this.authInfo, this.httpClient, this.configs.getGraphApiConfig());
        }
        return this.msGraphClient.getBetaApiClient(this.semaphoresService.getMsgraphBetaSemaphore());
    }

    public searchUsers(searchText: string): Observable<any> {
        return this.getAuthClient().pipe(switchMap(client =>
            client.api(`/users`)
                .filter(`startswith(displayName,'${searchText}') or startswith(mail,'${searchText}')`)
                .select('id,displayName,mail')
                .top(5)
                .get().pipe(map(result => result['value']))
        ));
    }

    public getUserPhoto(user: string): Observable<any> {
        return this.getAuthClient().pipe(switchMap(client =>
            client.api(`/users/${user}/photo/$value`)
                .get().pipe(map(result => result))
        ));
    }
    public getContacts(): Observable<any> {
        return this.getAuthClient().pipe(switchMap(client =>
            client.api(`/me/contacts`)
                .top(1000)
                .select('id,displayName,emailAddresses')
                .get().pipe(map(result => result['value']))
        ));
    }
    public getPeoples(domain: string): Observable<any> {
        if (this.authInfo.isGoogle()) {

            return combineLatest(fromPromise(this.listPeople()), fromPromise(this.listDomainUsers(domain)), this.listContacts(),
                (connections, users, contacts) => {
                    const peoples: Person[] = [];
                    connections.concat(users).concat(contacts).forEach(val => {
                        if (!peoples.find(p => p.emailAddresses[0].address === val.emailAddresses[0].address)) {
                            peoples.push(val);
                        }
                    });
                    return peoples;
                }
            );
            // return fromPromise(this.listConnectionNames()).pipe(map((res: any) => res));
        }
        return this.getAuthClient().pipe(switchMap(client =>
            client.api(`/me/people`)
                .top(1000)
                .select('id,displayName,emailAddresses')
                .get().pipe(map(result => result['value']))
        ));
    }
    public listPeople(): Promise<Person[]> {
        return new Promise((resolve, reject) => {

            const request = gapi.client.people.people.connections.list({
                'resourceName': 'people/me',
                'requestMask.includeField': ['person.emailAddresses', 'person.photos', 'person.names'],
                'sortOrder': 'FIRST_NAME_ASCENDING',
                'pageSize': 500,
            });

            return request.execute(resp => {
                if (resp && resp.connections && resp.connections.length > 0) {
                    resolve(resp.connections
                        .filter(person => (person.emailAddresses && person.emailAddresses.length > 0))
                        .map(person => ({
                            displayName: person.names && person.names.length > 0 ? person.names[0].displayName :
                                person.emailAddresses[0].value,
                            emailAddresses: person.emailAddresses
                                .map(address => ({ address: address.value.toLowerCase().trim(), rank: 0 })),
                            id: person.emailAddresses[0].metadata.source.id,
                            givenName: person.names && person.names.length > 0 ? person.names[0].givenName : ''
                        })));

                } else {
                    resolve([]);
                }
            });

        });
    }
    public listDomainUsers(domain: string): Promise<Person[]> {
        return new Promise((resolve, reject) => {
            const request = gapi.client.directory.users.list({
                'domain': domain,
                'fields': 'users(emails,id,name)',
                'sortOrder': 'ASCENDING',
                'pageSize': 500,
                'viewType': 'domain_public'
            });

            return request.execute(resp => {
                if (resp && resp.users && resp.users.length > 0) {
                    const persons: Person[] = [];
                    resp.users.forEach(user => {
                        if (user.emails && (user.name.fullName || user.name.givenName || user.name.familyName)) {
                            user.emails.forEach(email => {
                                if (email.primary || email.type || email.customType) {
                                    persons.push({
                                        displayName: (user.name.fullName || user.name.givenName + ' ' + user.name.familyName),
                                        emailAddresses: [{ address: email.address.toLowerCase().trim(), rank: 0 }],
                                        id: user.id,
                                        givenName: user.name.givenName,
                                        surname: user.name.familyName,
                                        emailAddressesType: email.type || email.customType
                                    });
                                }
                            });
                        }
                    });

                    resolve(persons);

                } else {
                    resolve([]);
                }
            });

        });
    }
    public listContacts() {
        return this.httpClient
            .get(`https://www.google.com/m8/feeds/contacts/default/thin?start-index=1&max-results=2500&alt=json&access_token=${
                gapi.auth.getToken().access_token}&v=3.0`)
            .pipe(map((resp: any) => {
                const persons: Person[] = [];
                if (resp && resp.feed && resp.feed.entry) {
                    (<any[]>resp.feed.entry).forEach(val => {
                        (<any[]>val.gd$email).forEach(e => {
                            persons.push(
                                {
                                    displayName: val.title.$t || e.address,
                                    emailAddresses: [{ address: e.address.toLowerCase().trim(), rank: 0 }],
                                    id: val.id.$t,
                                }
                            );
                        });
                    });
                }
                return persons;
            }), catchError(err => of([])));
    }
    public createPeople(people: Person): Observable<boolean> {
        return this.getAuthClient().pipe(switchMap(client =>
            client.api(`/me/people`)
                .post(people).pipe(map(result => true))
        ));
    }
    public createContact(contact: Contact): Observable<boolean> {
        return this.getAuthClient().pipe(switchMap(client =>
            client.api(`/me/contacts`)
                .post(contact).pipe(map(result => true))
        ));
    }
}
