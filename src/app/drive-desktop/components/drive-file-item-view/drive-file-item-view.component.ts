import { Component, OnInit, Input } from '@angular/core';
import { DriveListItemWrapper, ItemView } from '../../../drive-core';

@Component({
  selector: 'dps-drive-file-item-view',
  templateUrl: './drive-file-item-view.component.html',
  styleUrls: ['./drive-file-item-view.component.scss']
})
export class DriveFileItemViewComponent implements OnInit {
  @Input() items: DriveListItemWrapper[];
  @Input() currentFolder: ItemView;

  constructor() { }

  ngOnInit() {
  }
  get selectedItems(): DriveListItemWrapper[] {
    return this.items ? this.items.filter(item => item.selected) : [];
  }
  get totleSize() {
    if (this.selectedItems) {
      let size = 0;
      this.selectedItems.forEach(val => {
        if (val.data.size) {
          size = size + val.data.size;
        }
      });
      return size;
    }
    return 0;
  }

}
