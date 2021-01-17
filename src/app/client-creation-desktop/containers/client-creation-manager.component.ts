import { BaseClientCreationManager } from '../../client-creation-core/containers/base-client-creation-manager';
import { Store } from '@ngrx/store';
import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: 'dps-client-creation-manager',
    template: '<ng-content></ng-content>'
})

export class ClientCreationManagerComponent extends BaseClientCreationManager implements OnInit {
    @Input() inputData: any;
    @Input() clientCreationToken: string;
    @Input() meta: any;
    @Input() commonDropdownDataModel: any;

    //  @Output() onDeleteClient = new EventEmitter<any>();

    constructor(protected store: Store<any>) {
        super(store);
    }
    ngOnInit() {
        super.initSelectors(this.clientCreationToken, this.inputData);
    }
    onValueChanged(event) {
        super.onValueChanged(this.clientCreationToken, event);
    }
    onClientAdd() {
        super.onClientAdd(this.clientCreationToken);
    }
    onClientSave(event) {
        super.onClientSave(this.clientCreationToken, event);
    }
    onClientOk(event) {
        super.onClientOk(this.clientCreationToken);
    }
    lookupUpdateData(lookupType) {
        super.onLookupUpdateData(this.clientCreationToken, lookupType);
    }

    onGridRowClick(gridObj) {
        // super.onGridRowClick(this.clientCreationToken, gridObj);
    }
    // onDeleteClient(event) {
    //     super.onDeleteClient(event);
    // }
    onLastNameChange() {
        super.onLastNameChange(this.clientCreationToken);
    }
    onCopyFromCorrespondence() {
        super.onCopyFromCorrespondence(this.clientCreationToken);
    }
    onPrivateIndividualValueChanged(event) {
        super.onPrivateIndividualValueChanged(this.clientCreationToken, event);
    }
    onUpdateSelectedlientData(event) {
        super.onUpdateSelectedlientData(this.clientCreationToken, event);
    }
    onClientTypeChange(value) {
        super.onClientTypeChange(this.clientCreationToken, value);
    }
    onAMLSaveData(event) {
        super.onAMLSaveData(this.clientCreationToken, event);
    }
}
