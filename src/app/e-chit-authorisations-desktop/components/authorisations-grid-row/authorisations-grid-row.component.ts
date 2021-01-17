import { EChitAuthorisationsState } from '../../../e-chit-authorisations-core/reducers/e-chit-authorisations';
import { AuthorisationsGridData } from './../../../e-chit-authorisations-core/models/interfaces';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { SystemJsPopupLoaderService } from '../../../shell-desktop';
import { LedgerCardInput } from '../../../core/lib/ledger-card';
import { ColumnDef } from './../../../core/lib/grid-model';
import { User } from '../../../auth';

@Component({
  selector: 'dps-authorisations-grid-row',
  templateUrl: './authorisations-grid-row.component.html',
  styleUrls: ['./authorisations-grid-row.component.scss']
})
export class AuthorisationsGridRowComponent implements OnInit {
  @Input() columnDef: ColumnDef;
  @Input() gridData: AuthorisationsGridData;
  @Input() viewData: EChitAuthorisationsState;
  @Input() user: User;

  @Output() selectedRowItem = new EventEmitter<any>();
  @Output() checkedChange = new EventEmitter<any>();
  @Output() authorisationViewReport = new EventEmitter<any>();

  constructor(private popupService: SystemJsPopupLoaderService) { }

  ngOnInit() {
  }
  getFxFlexProperty(index) {
    if (!this.columnDef) { return ''; }
    return this.columnDef[index] && this.columnDef[index].extras ? this.columnDef[index].extras.fxFlex : '';
  }
  onRowSelect(row) {
    this.selectedRowItem.emit(row);
  }
  onChanckChanged(rowId, event) {
    this.checkedChange.emit({ rowId: rowId, checkedValue: event.checked });
  }
  // (row?.level===2 && row?.authorisedBy===loginUser?.user) || row?.level===0
  checkVisibility(level, authorisedBy, requestedBy, loginUser) {
    if (requestedBy === loginUser) {
      return true;
    } else if (level === 0) {
      return true;
    } else if (level === 2 && authorisedBy === loginUser) {
      return true;
    } else {
      return false;
    }


  }
  onMatterRefClick(matterRef) {
    if (matterRef !== '(None)' && matterRef) {
      const ledgerCardToken = 'matterCreationLedgerCardPopup(' + matterRef + ')';
      const input: LedgerCardInput = {
        matterRef: matterRef,
      };
      this.popupService.openLedgerCardPopup(ledgerCardToken, input);
    }
  }
  onViewFile(supplierRef, attachmentName) {
    if (attachmentName) {
      this.authorisationViewReport.emit({ supplierRef: supplierRef, fileName: attachmentName });
    }
  }
}
