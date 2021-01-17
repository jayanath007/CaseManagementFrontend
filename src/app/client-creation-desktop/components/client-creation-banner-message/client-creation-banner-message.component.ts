
import { Component, Input, OnInit } from '@angular/core';
import { Client, RiskAssessmentData } from '../../../client-creation-core/models/interfaces';

@Component({
  selector: 'dps-client-creation-banner-message',
  templateUrl: './client-creation-banner-message.component.html',
  styleUrls: ['./client-creation-banner-message.component.scss']
})
export class ClientCreationBannerMessageComponent implements OnInit {

  @Input() client: Client;
  @Input() riskAssessmentData: RiskAssessmentData;
  @Input() hiddenIdCheck: boolean;
  @Input() riskAssessmentHidden: boolean;

  showProofAddress = true;
  showProofId = true;
  showNoRiskAssessment = true;
  showNoRiskAssessmentFailed = true;

  constructor() { }

  ngOnInit() {
  }

}
