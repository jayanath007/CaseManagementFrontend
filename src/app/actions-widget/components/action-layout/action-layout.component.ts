import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { ActionWidgetItem } from '../../models/enum';

@Component({
  selector: 'dps-action-layout',
  templateUrl: './action-layout.component.html',
  styleUrls: ['./action-layout.component.scss']
})
export class ActionLayoutComponent implements OnInit {

  @Input() isBMDataLoading: boolean;
  @Output() remove = new EventEmitter();
  @Output() clickItem = new EventEmitter<ActionWidgetItem>();

  actionWidgetItem = ActionWidgetItem;

  constructor() { }

  tiles = [
    { id: ActionWidgetItem.BundelMonitor, cols: 3, rows: 1, color: 'lightblue' },
    // {id: 'Two', cols: 1, rows: 2, color: 'lightgreen'},
    // {id: 'Three', cols: 1, rows: 1, color: 'lightpink'},
    // {id: 'Four', cols: 2, rows: 1, color: '#DDBDF1'},
  ];


  ngOnInit() {
  }

  onRemove() {
    this.remove.emit();
  }

  onClickAction(id: ActionWidgetItem) {
    this.clickItem.emit(id);
  }


}
