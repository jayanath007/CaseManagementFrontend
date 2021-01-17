import { MatterInfo, FeeEarner, Folder, DiaryType, ActionType, AddNoteItemData } from '../../../add-note-core';
import { DiaryRecType, LegalAid } from '../../../add-note-core/models/enumeration';
import { Component, OnInit, Input, ChangeDetectionStrategy, EventEmitter, Output } from '@angular/core';
import { MatCheckboxChange } from '@angular/material';
import { AddTimeType } from '../../../core/lib/timeRecord';

@Component({
  selector: 'dps-add-note-main',
  templateUrl: './add-note-main.component.html',
  styleUrls: ['./add-note-main.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class AddNoteMainComponent implements OnInit {
  selectedDate: string;

  @Input() fileUploadDisable: boolean;
  @Input() matterData: MatterInfo;
  @Input() diaryRecType: DiaryRecType;
  @Input() legalAid: LegalAid;
  @Input() feeEarnerList: FeeEarner[];
  @Input() sendForSignatureToList: FeeEarner[];
  @Input() diaryTypes: DiaryType[];
  @Input() actionType: ActionType[];
  @Input() folderList: Folder[];
  @Input() note: string;
  @Input() itemDataList: AddNoteItemData[];
  @Input() password: string;
  @Input() dateDone: string;
  @Input() isDiaryTypeDisable: boolean;
  @Input() isEdit: boolean;
  @Input() sendForSignature: boolean;
  @Input() isShowTimeAndCost: boolean;
  @Input() timeType: AddTimeType;
  @Input() timeRecordType: AddTimeType;
  @Input() treeFolder: Folder[];
  @Input() isLoading: boolean;
  @Input() itemsLoading: boolean;

  @Output() updateSelectedFolder = new EventEmitter<Folder>();
  @Output() updateSelectedAction = new EventEmitter<ActionType>();
  @Output() uploadedFile = new EventEmitter<any>();
  @Output() updateSelectedFeeEarner = new EventEmitter<FeeEarner>();
  @Output() updateSelectedDiaryType = new EventEmitter<DiaryType>();
  @Output() upateSelectedDate = new EventEmitter<any>();
  @Output() updateNote = new EventEmitter<string>();
  @Output() updatePassword = new EventEmitter<string>();
  @Output() sendForSignatureChange = new EventEmitter();
  @Output() sendForSignatureToChange = new EventEmitter();

  addTimeType = AddTimeType;

  constructor() {
  }
  get selectedFolder() {
    if (this.folderList) {
      return this.folderList.find((folder) => folder.selected);
    }
    return null;
  }

  ngOnInit() {
    if (this.folderList) {

      this.treeFolder = this.list_to_tree(JSON.parse(JSON.stringify(this.folderList)));

    }

  }
  onFolderChanged(selectedFolder) {
    this.updateSelectedFolder.emit(selectedFolder);
  }
  onActionChanged(selectedAction) {
    this.updateSelectedAction.emit(selectedAction);
  }
  onUploadeFile(uploadedFile) {
    this.uploadedFile.emit(uploadedFile);
  }

  onFeeEarnerChanged(selectedFeeEarner) {
    this.updateSelectedFeeEarner.emit(selectedFeeEarner);
  }
  onDiaryTypeChanged(selectedDiaryType) {
    this.updateSelectedDiaryType.emit(selectedDiaryType);
  }
  onChangeDateDone(event) {
    this.upateSelectedDate.emit(event.value);
  }
  onNoteChange(event) {
    this.updateNote.emit(this.note);
  }
  onupdatePassword(password) {
    this.updatePassword.emit(password);
  }
  onSendForSignatureChange(event: MatCheckboxChange) {
    this.sendForSignatureChange.emit(event.checked);
  }
  onSendForSignatureToChange(selectedFeeEarner) {
    this.sendForSignatureToChange.emit(selectedFeeEarner);
  }



  list_to_tree(list: Folder[]) {
    const map = {};
    let node: Folder;
    const roots: Folder[] = [];
    let i;
    if (list && list.length > 0) {

      for (i = 0; i < list.length; i += 1) {
        map[list[i].folderId] = i; // initialize the map

        list[i].children = []; // initialize the children
      }

      for (i = 0; i < list.length; i += 1) {
        node = list[i];
        if (node.parentId !== 0) {
          // if you have dangling branches check that map[node.parentId] exists
          if (list[map[node.parentId]] && list[map[node.parentId]].children) {
            list[map[node.parentId]].children.push(node);
          }
        } else {
          roots.push(node);
        }
      }
      return roots;
    } else {

      return roots;
    }
  }

}


