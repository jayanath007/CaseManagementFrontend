

import { MatterInputData } from '../../../core/lib/matter';
import {
  Component, OnInit, Input, Output, EventEmitter, ChangeDetectionStrategy, OnChanges, SimpleChanges
} from '@angular/core';
import { FeeEarner, Folder, ActionType, MatterResponce } from '../../../task-add-edit-core/models/interface';
import { SystemJsPopupLoaderService } from '../../../shell-desktop';
import { MainMenuItem } from '../../../layout-desktop';
import { LocalStorageKey } from '../../../core';

@Component({
  selector: 'dps-task-add-edit-container',
  templateUrl: './task-add-edit-container.component.html',
  styleUrls: ['./task-add-edit-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaskAddEditContainerComponent implements OnInit, OnChanges {

  @Input() addEditTaskLoading: boolean;
  @Input() feeEarnerList: FeeEarner[];
  @Input() folderList: Folder[];
  @Input() actionTypeList: ActionType[];
  @Input() fileUploadDisable: boolean;
  @Input() password: string;
  @Input() fileData: any;
  @Input() loginUser: string;
  @Input() matterInfo: any;
  @Input() taskDate: string;
  @Input() taskNote: string;
  @Input() taskHeaderName: string;
  @Input() hasPassword: boolean;

  @Output() selectedFeeEarnerChanged = new EventEmitter<FeeEarner>();
  @Output() selectedFolderChanged = new EventEmitter<Folder>();
  @Output() selectedActionChanged = new EventEmitter<ActionType>();
  @Output() selectedMatterObj = new EventEmitter<MatterResponce>();
  @Output() upateSelectedDate = new EventEmitter<string>();
  @Output() updateNote = new EventEmitter<string>();
  @Output() uploadedFile = new EventEmitter<any>();
  @Output() updatePassword = new EventEmitter<string>();
  @Output() unLockPassword = new EventEmitter<string>();
  matterLabel: string;

  constructor(private popupService: SystemJsPopupLoaderService) { }

  ngOnInit() {
    const menuItem: MainMenuItem<any>[] = JSON.parse(sessionStorage.getItem(LocalStorageKey.MenuItems));
    this.matterLabel = menuItem.find(i => i.id === 'matter_search').label;
  }
  ngOnChanges(change: SimpleChanges) {
    // if (change.fileNo && change.fileNo.currentValue) {
    //   this.hasMatter = true;
    // }
  }
  get selectedFeeEarner() {
    if (this.feeEarnerList) {
      return this.feeEarnerList.find((feeEarner) => feeEarner.selected);
    }
    return null;
  }
  get selectedFolder() {
    if (this.folderList) {
      return this.folderList.find((folder) => folder.selected);
    }
    return null;
  }
  get selectedAction() {
    if (this.actionTypeList) {
      return this.actionTypeList.find((actionType) => actionType.selected);
    }
    return null;
  }

  onMatterSearch() {
    const matterInputData: MatterInputData = { isMatterSearch: false };
    this.popupService.openMatterSearchPopup('taskMatterSearchPopup', matterInputData).subscribe((result: MatterResponce) => {
      if (!result) {
        return '';
      }
      this.selectedMatterObj.emit(result);
    });
  }
  onFeeEarnerChanged(value: FeeEarner) {
    this.selectedFeeEarnerChanged.emit(value);
  }
  onFolderChanged(value: Folder) {
    this.selectedFolderChanged.emit(value);
  }
  onActionTypeChanged(value: ActionType) {
    this.selectedActionChanged.emit(value);
  }
  onDateChange(event) {
    this.upateSelectedDate.emit(event.value);
  }
  onNoteChange(event) {
    this.updateNote.emit(this.taskNote);
  }
  onUploadeFile(uploadedFile) {
    this.uploadedFile.emit(uploadedFile);
  }
  onUpdatePassword(password) {
    this.updatePassword.emit(password);
  }
  onUnLockPassword(password: string): void {
    this.unLockPassword.emit(password);
  }
}
