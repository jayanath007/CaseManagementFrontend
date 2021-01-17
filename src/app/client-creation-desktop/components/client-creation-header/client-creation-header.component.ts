import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { AccessControlService } from '../../../auth/services/access-control.service';
import { Mode } from '../../../client-creation-core/models/enums';
import { Module, SettingKey } from '../../../core/lib/app-settings';
import { UserPermission } from './../../../auth/models/auth';

@Component({
  selector: 'dps-client-creation-header',
  templateUrl: './client-creation-header.component.html',
  styleUrls: ['./client-creation-header.component.scss']
})
export class ClientCreationHeaderComponent implements OnInit {

  @Input() mode: Mode;
  @Input() isModelDirty: boolean;
  @Input() clientTitle: string;
  @Input() permission: UserPermission;
  @Input() matterDisplyName: string;
  @Input() isPlotUser = false;

  @Output() popupClosed = new EventEmitter<string>();
  @Output() popupCancel = new EventEmitter<string>();
  @Output() clientSearch = new EventEmitter<any>();
  @Output() screenEdit = new EventEmitter<any>();
  @Output() clientClear = new EventEmitter<any>();
  @Output() clientDelete = new EventEmitter<any>();
  @Output() clientAdd = new EventEmitter<any>();
  @Output() clientSave = new EventEmitter<any>();
  @Output() clientOk = new EventEmitter<any>();
  @Output() clientOpenMatter = new EventEmitter<any>();


  Mode = Mode;
  module = Module;
  amendScreensWorkflow$ = new Observable<any>();

  constructor(private access: AccessControlService) { }

  ngOnInit() {
    this.amendScreensWorkflow$ = this.access.getSettingValue(SettingKey.AmendScreensWorkflow);
  }
  onScreenEdit() {
    this.screenEdit.emit();
  }
  onClientSearch() {
    this.clientSearch.emit();
  }
  onClose() {
    this.popupClosed.emit('close');
  }
  onCancel() {
    this.popupCancel.emit('close');
  }
  onClientClear() {
    this.clientClear.emit();
  }
  onClientDelete() {
    this.clientDelete.emit();
  }
  onClientAdd() {
    this.clientAdd.emit();
  }
  onClientSave() {
    this.clientSave.emit();
  }
  onClientPrint() {
  }

  onClientOpenMatter() {

    this.clientOpenMatter.emit();
  }
  onClientOk() {
    this.clientOk.emit();
  }
}
