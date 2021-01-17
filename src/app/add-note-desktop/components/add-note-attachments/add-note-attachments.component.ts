
import { of as observableOf, Observable } from 'rxjs';
import {
  Attachments, Folder, FolderOnAttachment, NoteOnAttachment,
  ConditiOnAttachment,
  ViewingInlineAttachement
} from '../../../add-note-core/models/interfaces';
import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, OnChanges, SimpleChanges } from '@angular/core';
import { DataSource } from '@angular/cdk/collections';
import * as _ from 'lodash';
import { CheckedType } from '../../../add-note-core/models/enumeration';

export class AttachmentsDataSource extends DataSource<any> {
  data: Attachments[];
  constructor(data: Attachments[]) {
    super();
    this.data = data;
  }
  connect(): Observable<Attachments[]> {
    return observableOf(this.data);
  }
  disconnect() { }
}
@Component({
  selector: 'dps-add-note-attachments',
  templateUrl: './add-note-attachments.component.html',
  styleUrls: ['./add-note-attachments.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class AddNoteAttachmentsComponent implements OnChanges {

  @Input() attachments: Attachments[];
  @Input() folderList: Folder[];
  @Input() timeZone: string;
  @Input() companyCode: any;
  @Input() viewingInlineAttachement: ViewingInlineAttachement;

  @Output() updateFolderOnAttachment = new EventEmitter<FolderOnAttachment>();
  @Output() updateNoteOnAttachment = new EventEmitter<NoteOnAttachment>();
  @Output() updateIsAttcheOnAttachment = new EventEmitter<ConditiOnAttachment>();
  @Output() updateIsUnchargeOnAttachment = new EventEmitter<ConditiOnAttachment>();
  @Output() openAttacment = new EventEmitter<{ reference: string, parentItemIndex: number }>();
  @Output() openEmailAttachment = new EventEmitter<{ parentItemIndex: number, attachment: Attachments }>();
  @Output() downlodeEmailAttachment = new EventEmitter<{ parentItemIndex: number, attachment: Attachments }>();

  displayedColumns = ['attach', 'type', 'folder', 'fileNote', 'UC', 'View'];
  dataSource;
  CheckedType = CheckedType;

  constructor() { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.attachments) {
      return this.dataSource = new AttachmentsDataSource(this.attachments);
    }
  }
  selectedFolder(folderId) {
    if (this.folderList) {
      if (folderId) {
        return this.folderList.find((folder) => folder.folderId === folderId);
      }
      return this.folderList[0];
    }
  }
  OnFolderChanged(selectfolder, reference) {
    const info: FolderOnAttachment = { folder: selectfolder, reference, parentItemIndex: 0 };
    this.updateFolderOnAttachment.emit(info);
  }
  OnAttachmentFileNoteChange(changedNote, reference) {
    const info: NoteOnAttachment = { note: changedNote, reference, parentItemIndex: 0 };
    this.updateNoteOnAttachment.emit(info);
  }
  OnChangeIsAttach(changeIsAttche, reference, checkedType) {
    const info: ConditiOnAttachment = { condition: changeIsAttche, reference, parentItemIndex: 0, checkedType: checkedType };
    this.updateIsAttcheOnAttachment.emit(info);
  }
  OnChangeIsUncharge(changeIsUncharge, reference, checkedType) {
    const info: ConditiOnAttachment = { condition: changeIsUncharge, reference, parentItemIndex: 0, checkedType: checkedType };
    this.updateIsUnchargeOnAttachment.emit(info);
  }
  onOpenAttachment(reference) {
    setTimeout(() => {
      document.getElementById('docoment-view').scrollIntoView();
    }, 1000);
    this.openAttacment.emit({ reference, parentItemIndex: 0 });
  }
  onOpenEmailAttachement(attachment: Attachments) {
    this.openEmailAttachment.emit({ parentItemIndex: 0, attachment: attachment });
  }
  onDownloardFileAttachment(data: { itemId: number, attachment: Attachments }) {
    this.downlodeEmailAttachment.emit({ parentItemIndex: 0, attachment: data.attachment });
  }
  get checkUncheckAllAttach() {
    if (this.attachments.length > 0 && this.attachments.filter(val => val.isSelected === true).length === this.attachments.length) {
      return true;
    } else {
      return false;
    }
  }
  get checkUncheckAllUN() {
    if (this.attachments.length > 0 && this.attachments.filter(val => val.isUncharge === true).length === this.attachments.length) {
      return true;
    } else {
      return false;
    }
  }
}

