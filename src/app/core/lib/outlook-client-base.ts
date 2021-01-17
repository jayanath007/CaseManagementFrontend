import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthInfoStateService } from '../../auth';
import { OdataServiceBase } from './odata-service-base';
import { map } from 'rxjs/operators';





export class OutlookClientBase extends OdataServiceBase {

    constructor(private authInfo: AuthInfoStateService, httpClient: HttpClient, config) {
        super(httpClient, config);
    }

    protected getAuthToken(): Observable<string> {
        return this.authInfo.getOutlookApiToken();
    }
    public createAttachemntRawContentPath(owner: string, itemId: string, attId: string, type = 'messages') {
        return this.getAuthToken().pipe(map((token) => {
            const path = `/api/beta/${owner === 'me' ? owner :
                ('users/' + owner)}/${type}/${itemId}/attachments/${attId}/$value?access_token=${token}`;
            return path;
        }));
    }
}

