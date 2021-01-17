import { DiaryType } from '../../../add-note-core';
import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { MatSelectChange } from '@angular/material';

@Component({
  selector: 'dps-add-note-diary-type',
  templateUrl: './add-note-diary-type.component.html',
  styleUrls: ['./add-note-diary-type.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddNoteDiaryTypeComponent {
  @Input() diaryTypes: DiaryType[];
  @Input() isDiaryTypeDisable: boolean;
  @Output() updateSelectedType = new EventEmitter<DiaryType>();


  constructor() { }

  // get diaryTypes(): DiaryType[] {
  //   if (this.diaryType && this.otherInfo && this.otherInfo.addNoteOpenFrom === AddNoteOpenFrom.Organizer) {
  //     return this.diaryType.filter(val => val.text === 'Email In' || val.text === 'Email Out');
  //   } else if (this.diaryType && this.otherInfo && this.otherInfo.addNoteOpenFrom === AddNoteOpenFrom.OpenCaseDragDrop) {
  //     return this.diaryType.filter(val => val.text === 'Letter In' || val.text === 'Document In');
  //   }
  //   return this.diaryType;
  // }

  get selectedType() {
    if (this.diaryTypes) {
      return this.diaryTypes.find((type) => type.selected);
    }
    return null;
  }
  onChangeType(event: MatSelectChange) {
    this.updateSelectedType.emit(event.value);
  }
}
