import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { WorkflowMenuMetaItem } from '../../../workflow-menu-core';

@Component({
  selector: 'dps-workflow-menu-popup-layout',
  templateUrl: './workflow-menu-popup-layout.component.html',
  styleUrls: ['./workflow-menu-popup-layout.component.scss']
})
export class WorkflowMenuPopupLayoutComponent implements OnInit {

  @Input() list: WorkflowMenuMetaItem[];
  @Input() loading: boolean;
  @Output() selectNood = new EventEmitter<WorkflowMenuMetaItem>();
  @Output() close = new EventEmitter();

  options = {
    idField: 'atN_ID',
    displayField: 'atN_Desc',
    childrenField: 'children'
  };

  constructor() { }

  ngOnInit() {
  }

  onSelectRow(nood: WorkflowMenuMetaItem) {
    this.selectNood.emit(nood);
  }

  onClose() {
    this.close.emit();
  }

}
