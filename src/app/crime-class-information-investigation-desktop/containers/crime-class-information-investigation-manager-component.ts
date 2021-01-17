import { Component, Input, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import {
    BaseCcInformationInvestigationManager
} from '../../crime-class-information-investigation-core/containers/base-cc-information-investigation-manager';
import { CCInvestigationInfoInput } from '../../core/lib/crime-managment';
import { ModelProperty } from './../../crime-class-information-investigation-core/models/enum';

@Component({
    selector: 'dps-crime-information-investigation-manager',
    template: `<ng-content></ng-content>`,
})

export class CrimeClassInvestigationManagerComponent extends BaseCcInformationInvestigationManager implements OnInit {
    constructor(store: Store<any>) {
        super(store);
    }

    @Input() token: string;
    @Input() input: CCInvestigationInfoInput;

    ngOnInit() {
        super.init(this.token, this.input);
    }
    onChangeUserInput(event: { key: ModelProperty, value: any }) {
        this.changeUserInput(this.token, event);
    }
    // onOpenPoliceStationSearch(searchText: string) {
    //     this.openPoliceStationSearch(this.token, searchText);
    // }
    onSave() {
        this.saveModel(this.token);
    }
    onCloseReopenClass(closeDate: string) {
        this.closeReopenClass(this.token, closeDate);
    }
    onBtnAdvoAssiClick() {
        this.btnAdvoAssiClick(this.token);
    }
    

}
