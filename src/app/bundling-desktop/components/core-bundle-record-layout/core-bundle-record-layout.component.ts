import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ColumnDef } from '../../../core/lib/grid-model';
import { BundleTreeItem } from '../../../bundling-core/models/interface';
import { PDFBundleHeaderViewModel } from '../../../core/lib/bundle';

@Component({
  selector: 'dps-core-bundle-record-layout',
  templateUrl: './core-bundle-record-layout.component.html',
  styleUrls: ['./core-bundle-record-layout.component.scss']
})
export class CoreBundleRecordLayoutComponent {

  constructor() { }

  @Input() columnDef: ColumnDef[];
  @Input() isTreeDirty: boolean;
  @Input() bundleHeaderView: PDFBundleHeaderViewModel;
  @Input() coreBundleHeader: PDFBundleHeaderViewModel;

  @Input() rowData: BundleTreeItem[];
  @Output() changedCoreBundleId = new EventEmitter<{ ids: string[], rootElementId: string, bundleName: string }>();
  @Output() close = new EventEmitter();

  changedItemId: string[] = [];

  onClose() {
    this.close.emit();
  }
  get headeName(): string {
    return `${this.bundleHeaderView.pbH_IsCoreBundle ? 'Edit' : 'Create'}: ${
      this.coreBundleHeader ? this.coreBundleHeader.pbH_Name : ''}`;
  }
  onChangeItem(row: BundleTreeItem) {
    if (this.changedItemId.find(i => i === row.id)) {
      this.changedItemId = this.changedItemId.filter(i => i !== row.id);
    } else {
      this.changedItemId = this.changedItemId.concat(row.id);
    }
  }
  onSubmit() {
    const rootElemnt = this.rowData.find(r => r.isRoot);
    this.changedCoreBundleId.emit({ ids: this.changedItemId, rootElementId: rootElemnt.id, bundleName: this.coreBundleHeader.pbH_Name });
    this.close.emit();
  }

}
