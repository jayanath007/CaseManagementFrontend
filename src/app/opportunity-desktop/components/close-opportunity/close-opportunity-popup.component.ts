import { Component, OnInit, EventEmitter, Output, Input, SimpleChanges, OnChanges } from '@angular/core';
import { MatDialog } from '@angular/material';
import {
  FeeEarnerList, OpportunitySaveViewModel,
  DropdownList, OpportunityClosedViewModel, OpportunityLoadingType
} from './../../../opportunity-core/models/interfaces';
import { showConfirmDialog } from '../../../core/utility/DpsUtility';
import { ConfirmDialogResultKind } from './../../../shared/models/dialog';
import { dpsNewDate } from '../../../utils/javascriptDate';
import { MasterDataViewModel, DropdownListItem } from '../../../shared-data/model/interface';

@Component({
  selector: 'dps-close-opportunity-popup',
  templateUrl: './close-opportunity-popup.component.html',
  styleUrls: ['./close-opportunity-popup.component.scss']
})
export class CloseOpportunityPopupComponent implements OnInit, OnChanges {

  @Input() feeEarnerList: FeeEarnerList[];
  @Input() opportunity: OpportunitySaveViewModel;
  @Input() departmentList: MasterDataViewModel<DropdownListItem[]>;
  @Input() closeOpportunityPopupClose: number;
  @Input() isLoading: OpportunityLoadingType;
  @Input() timeOffset: number;

  @Output() acceptedProcess = new EventEmitter<{ closeModel: OpportunityClosedViewModel, item: OpportunitySaveViewModel }>();
  @Output() rejectedProcess = new EventEmitter<OpportunityClosedViewModel>();
  @Output() popupClose = new EventEmitter<any>();

  model: OpportunityClosedViewModel;
  tempOpportunity: OpportunitySaveViewModel;

  constructor(private dialog: MatDialog) { }

  ngOnInit() {
    this.tempOpportunity = JSON.parse(JSON.stringify(this.opportunity));
    this.model = {
      opportunityId: this.tempOpportunity.enquiryId,
      closeDate: dpsNewDate(this.timeOffset).toString(),
      clientName: this.tempOpportunity.clientName,
      department: this.tempOpportunity.departmentId,
      workType: this.tempOpportunity.workTypeId,
      feeEarner: this.tempOpportunity.feeEarner,
      note: ''
    };
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes.closeOpportunityPopupClose && !changes.closeOpportunityPopupClose.isFirstChange() &&
      changes.closeOpportunityPopupClose.currentValue > 0) {
      setTimeout(() => {
        this.popupClose.emit('success');
      }, 100);
    }
  }
  onClose() {
    this.popupClose.emit();
  }
  get departmentName() {
    const selectedDep = this.departmentList && this.departmentList.data ?
      this.departmentList.data.find(d => d.key === this.tempOpportunity.departmentId) : null;
    return selectedDep ? selectedDep.value : '';
  }
  get feeErnerName() {
    const selectedFe = this.feeEarnerList ? this.feeEarnerList.find(f => f.key === this.tempOpportunity.feeEarner) : null;
    return selectedFe ? `${selectedFe.value}(${selectedFe.key}) ` : '';
  }
  onChangeDate(date: string) {
    this.model.closeDate = date;
  }
  onChangeNote(newNote) {
    this.model.note = newNote;
  }

  onConfirmAction(type: string) {
    showConfirmDialog(type, `Confirm ${type}`, this.dialog)
      .afterClosed().subscribe((result => {
        if (result.kind === ConfirmDialogResultKind.Confirmed) {
          if (type === 'Accepted') {
            this.acceptedProcess.emit({ closeModel: this.model, item: this.tempOpportunity });
          } else if (type === 'Rejected') {
            this.rejectedProcess.emit(this.model);
          }
        }
      }));
  }
}
