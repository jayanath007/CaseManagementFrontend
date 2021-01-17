import { Injectable } from '@angular/core';
import { FileItemWrapper } from '../models/interface';
import { Observable } from 'rxjs';

@Injectable()
export abstract class FileHistoryUiService {
    constructor() {
    }

    abstract showArchiveXDraftConfirm(item: FileItemWrapper): Observable<{ xNote: string, item: FileItemWrapper }>;
}


