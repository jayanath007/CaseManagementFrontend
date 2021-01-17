
import { debounceTime } from 'rxjs/operators';
import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { MatterData } from '../../../ledger-card-core/models/interfce';
import { FormControl } from '@angular/forms';
import { MainMenuItemResolverService } from '../../../layout-desktop';


@Component({
  selector: 'dps-ledger-card-header',
  templateUrl: './ledger-card-header.component.html',
  styleUrls: ['./ledger-card-header.component.scss']
})
export class LedgerCardHeaderComponent implements OnInit {

  @Input() matterData: MatterData;
  @Input() allMatterCount: number;
  @Output() openMatterSearch = new EventEmitter<string>();
  @Output() openAllMattersPopup = new EventEmitter();
  @Output() openMatter = new EventEmitter<MatterData>();
  @Output() resetData = new EventEmitter();

  inputCtrl = new FormControl();

  constructor(private menu: MainMenuItemResolverService) { }

  ngOnInit() {
    this.inputCtrl.valueChanges.pipe(
      debounceTime(500))
      .subscribe((value: string) => {
        if (value.length <= 0) {
          this.resetData.emit();
        }
      });
  }

  onOpenMatterSearch(value) {
    if (!(this.matterData && this.matterData.matterReferenceNo === value)) {
      this.openMatterSearch.emit(value);
    }
  }

  getSearchMatterDetails(e, value) {
    if (e.keyCode === 13) {
      this.onOpenMatterSearch(value);
    }
  }

  onOpenAllMattersPopup() {
    this.openAllMattersPopup.emit();
  }

  onOpenMatter() {
    this.openMatter.emit(this.matterData);
  }

  resoleModuleName(menuId) {
    return this.menu.getModuleDisplayName(menuId);
  }

}
