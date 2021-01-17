import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { SystemJsPopupLoaderService } from '../../../shell-desktop';
import { Mode } from '../../../core';
import { Module, SettingKey } from '../../../core/lib/app-settings';
import { AccessControlService } from './../../../auth/services/access-control.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'dps-matter-creation-header',
  templateUrl: './matter-creation-header.component.html',
  styleUrls: ['./matter-creation-header.component.scss']
})



export class MatterCreationHeaderComponent implements OnInit {

  @Input() mode: Mode;
  @Input() isModelDirty: boolean;
  @Input() title: string;

  @Output() popupClosed = new EventEmitter<string>();
  @Output() openMatterSearch = new EventEmitter<any>();
  @Output() openLedgerCard = new EventEmitter<any>();
  @Output() add = new EventEmitter<any>();
  @Output() save = new EventEmitter<any>();
  @Output() clear = new EventEmitter<any>();
  @Output() delete = new EventEmitter<any>();
  @Output() ok = new EventEmitter<any>();

  Mode = Mode;
  module = Module;
  amendScreensWorkflow$ = new Observable<any>();

  constructor(public popupService: SystemJsPopupLoaderService, private access: AccessControlService) { }

  ngOnInit() {
    this.amendScreensWorkflow$ = this.access.getSettingValue(SettingKey.AmendScreensWorkflow);
  }
  onScreenEdit() {
    this.popupService.openScreenEditPopup('matter_creation', { type: 'Matter' }).subscribe((data) => {
    });
  }
  onOpenMatterSearch() {
    this.openMatterSearch.emit();
  }
  onClose() {
    this.popupClosed.emit('close');
  }
  onAdd() {
    this.add.emit();
  }
  onSave() {
    this.save.emit();
  }
  onClear() {
    this.clear.emit();
  }
  onDelete() {
    this.delete.emit();
  }
  onLedger() {
    this.openLedgerCard.emit();
  }
  onOk() {
    this.ok.emit();
  }
  moduleIsActive(module: Module) {
    return this.access.checkModuleIsActive(module);
  }
}
