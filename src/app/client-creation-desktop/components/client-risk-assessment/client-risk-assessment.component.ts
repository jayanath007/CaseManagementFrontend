
import { Component, Input, OnInit, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { AccessControlService } from '../../../auth/services/access-control.service';
import { Client, ClientRiskAssessmentQuestion, RiskAssessmentData } from '../../../client-creation-core/models/interfaces';
import { UserPermissionKey } from '../../../core/lib/app-settings';
import { createDefultColumnDef } from '../../../core/lib/grid-helpers';
import { ColumnDef } from './../../../core/lib/grid-model';

@Component({
  selector: 'dps-client-risk-assessment',
  templateUrl: './client-risk-assessment.component.html',
  styleUrls: ['./client-risk-assessment.component.scss']
})
export class ClientRiskAssessmentComponent implements OnChanges {

  constructor(public accessControl: AccessControlService) { }

  @Input() client: Client;
  @Input() data: RiskAssessmentData;
  @Output() changeQuation = new EventEmitter<ClientRiskAssessmentQuestion>();
  @Output() submitRiskAsse = new EventEmitter();
  gridColums: ColumnDef[] = [
    createDefultColumnDef('questions ', { label: 'Questions ', fxFlex: '', filterAnchor: 'end', filterHidden: true }),
    createDefultColumnDef('yes', { label: 'Yes', fxFlex: '90px', filterAnchor: 'end', filterHidden: true }),
    createDefultColumnDef('no', { label: 'No', fxFlex: '130px', filterAnchor: 'end', filterHidden: true })
  ];

  overridden = false;
  userPermisionType = UserPermissionKey;
  editMode = false;

  ngOnChanges(changes: SimpleChanges) {
    if (changes.client && changes.client.currentValue && changes.client.previousValue
      && changes.client.currentValue.clientId !== changes.client.previousValue.clientId) {
      this.overridden = false;
      this.editMode = false;
    }
  }


  get disableEditing(): boolean {
    if (this.client && this.client.clientId <= 0) {
      return true;
    } else if (!this.data || !this.data.clientRiskAssessmentQuestions) {
      return true;
    } else if (this.overridden) {
      return false;
    } else if (this.client && this.client.riskAssessmentFailed === null) {
      return false;
    }
    return true;
  }

  onRowClick(item) {

  }
  getFxFlexProperty(index) {
    if (!this.gridColums) { return ''; }
    return this.gridColums[index].extras.fxFlex;
  }

  onChangeQuationAnsState(value: number, item: ClientRiskAssessmentQuestion) {
    if (!this.disableEditing) {
      this.editMode = true;
      this.changeQuation.emit({ ...item, value: value });
    }
  }

  public submit(): void {
    this.submitRiskAsse.emit();
  }

}
