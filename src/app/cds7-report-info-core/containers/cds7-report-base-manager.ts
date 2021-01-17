import { Store } from '@ngrx/store';
import { ComponentBase } from '../../core';
import { CrimeClassIdentityViewModel } from './../../core/lib/timeRecord';
import { InitCDS7, ChangeModel, Save } from '../actions/core';
import { isLoading, getInformationModel, getCaseTypes } from '../reducers';
import { getCrimeLookupList } from '../../shared-data';
import { LookupType } from '../../shared';
import { MatDialogRef } from '@angular/material';


export class Cds7ReportBaseManager extends ComponentBase {
    constructor(protected store: Store<any>) { super(); }

    isLoading$: any;
    informationModel$: any;
    locationLookupList$: any;
    caseTypes$: any;

    protected initSelectors(token: string, input: CrimeClassIdentityViewModel) {
        this.store.dispatch(new InitCDS7(token, input));
        this.isLoading$ = this.store.select(isLoading(token));
        this.informationModel$ = this.store.select(getInformationModel(token));
        this.caseTypes$ = this.store.select(getCaseTypes(token));
        this.locationLookupList$ = this.store.select(getCrimeLookupList(LookupType.MA_COURT_CODES));
    }

    changeModel(token: string, event: { key: string, value: any }) {
        this.store.dispatch(new ChangeModel(token, event));
    }

    save(token: string, popupDialog: MatDialogRef<any>) {
        this.store.dispatch(new Save(token, popupDialog));
    }
}
