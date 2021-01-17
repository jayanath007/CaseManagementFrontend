import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges, OnChanges } from '@angular/core';
import { GroupListItem } from '../../../mail-core';

@Component({
  selector: 'dps-group-list-item',
  templateUrl: './group-list-item.component.html',
  styleUrls: ['./group-list-item.component.scss']
})
export class GroupListItemComponent implements OnInit, OnChanges {

  @Input() group: GroupListItem;
  @Input() isGroupMode: boolean;

  @Output() selectGroup = new EventEmitter();

  showProfileImg = false;

  constructor() { }

  ngOnInit() {
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes.group) {
      this.showProfileImg = false;
    }
  }
  onSelectGroup(event) {
    this.selectGroup.emit(this.group.data.id);
  }
  contextmenuOpen(event) {

  }
}
