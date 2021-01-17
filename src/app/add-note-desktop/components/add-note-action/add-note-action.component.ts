import { Observable } from 'rxjs';
import { ActionType } from '../../../add-note-core/models/interfaces';
import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'dps-add-note-action',
  templateUrl: './add-note-action.component.html',
  styleUrls: ['./add-note-action.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddNoteActionComponent {
  @Input() actionTypeList: ActionType[];
  @Output() updateSelectedAction = new EventEmitter<ActionType>();
  constructor() { }

  get selectedAction() {
    if (this.actionTypeList) {
      return this.actionTypeList.find((action) => action.selected);
    }
    return this.actionTypeList;
  }

  onActionChange(event) {
    this.updateSelectedAction.emit(event.value);
  }
}
