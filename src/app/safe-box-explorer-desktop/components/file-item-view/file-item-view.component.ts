import { Component, OnInit, Input } from '@angular/core';
import { Blob, TreeNodeItem } from '../../../safe-box-explorer-core/models/interfaces';

@Component({
  selector: 'dps-file-item-view',
  templateUrl: './file-item-view.component.html',
  styleUrls: ['./file-item-view.component.scss']
})
export class FileItemViewComponent implements OnInit {

  constructor() { }

  @Input() selectedBlobData: Blob[];
  @Input() treeNodeItem: TreeNodeItem;

  get itemCount() {
    if (this.treeNodeItem && this.treeNodeItem.data && this.treeNodeItem.data.Blobs) {
      return (this.treeNodeItem.data.Blobs.Blob ? this.treeNodeItem.data.Blobs.Blob.length : 0) +
        (this.treeNodeItem.data.Blobs.BlobPrefix ? this.treeNodeItem.data.Blobs.BlobPrefix.length : 0);
    }
    return 0;
  }
  get totleSize() {
    if (this.selectedBlobData) {
      let size = 0;
      this.selectedBlobData.forEach(val => {
        if (val.Properties['Content-Length']) {
          size = size + parseInt(val.Properties['Content-Length'], 10);
        }
      });
      return size.toString();
    }
    return 0;
  }
  ngOnInit() {
  }

}
