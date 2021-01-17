import { Store } from '@ngrx/store';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { BasePrecedentHManager } from '../../precedentH-core/containers/base-precedentH-manager';
import { TableRow, TableColumn } from '../../shared/models/interface';

@Component({
    selector: 'dps-precedenth-content-manager',
    template: '<ng-content></ng-content>'
})

export class PrecedentHContentManagerComponent extends BasePrecedentHManager implements OnInit {
    @Input() inputData: any;
    @Input() precedentHToken: string;

    @Output() closePopup = new EventEmitter<any>();

    constructor(protected store: Store<any>) {
        super(store);
    }
    ngOnInit() {
        super.initSelectors(this.precedentHToken, this.inputData);
    }
    onExportXMLOut() {
        super.onExportXMLOutData(this.precedentHToken);
    }
    onRowClick(event) {
        super.onRowItemClick(this.precedentHToken, event);
    }
    inputDatavalueChange({ phaseID, value }: { phaseID: number, value: number }) {
        super.inputDataChange(this.precedentHToken, phaseID, +value);
    }
    onSavePrecedentH() {
        super.onSavePrecedentH(this.precedentHToken);
    }
    close(info: any) {
        this.closePopup.emit(info);
        super.onClose(this.precedentHToken, info);
    }

    onChangeValue(changeValue) {
        super.changeValue(this.precedentHToken, changeValue);
    }

    onChangeWorkType(changeValue) {
        super.changeWorkType(this.precedentHToken, changeValue);
    }

    onRowInputChange(event: { value: number, row: TableRow<any>, columns: TableColumn }) {
        super.rowInputChange(this.precedentHToken, event);
    }

    onSavePrecedentHRates() {
        super.savePrecedentHRates(this.precedentHToken);
    }
    onRowCheckBoxChange(event: { value: boolean, row: TableRow<any>, columns: TableColumn }) {
        super.rowCheckBoxChange(this.precedentHToken, event);
    }
    onCheckAllClick(value) {
        super.checkAllClick(this.precedentHToken, value);
    }



}
