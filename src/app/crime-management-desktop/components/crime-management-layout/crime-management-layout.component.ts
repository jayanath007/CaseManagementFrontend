import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { MenuButtonClickType } from '../../../open-case-core/models/enums';

@Component({
  selector: 'dps-crime-management-layout',
  templateUrl: './crime-management-layout.component.html',
  styleUrls: ['./crime-management-layout.component.scss']
})
export class CrimeManagementLayoutComponent implements OnInit {

  @Output() menuButtonClick = new EventEmitter<string>();

  constructor() { }

  ngOnInit() {
  }
  fileHistoryClick() {
    this.menuButtonClick.emit(MenuButtonClickType.ViewFileHistoy);
  }
  viewWorkflowClick() {
    this.menuButtonClick.emit(MenuButtonClickType.WorkflowMenuView);
  }
}
