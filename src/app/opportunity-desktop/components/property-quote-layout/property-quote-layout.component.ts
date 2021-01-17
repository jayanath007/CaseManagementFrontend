import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges, OnChanges } from '@angular/core';
import {
  PropertyQuoteType, PropertyQuoteRequest, WebQuoteLocalSearch,
  PropertyQuReport,
  WebQuoteCompnayDetails,
  PropertyQuReportview,
  WebQuoteData,
  OpportunityLoadingType
} from '../../../opportunity-core/models/interfaces';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { PropertyQuoteRequestKey } from '../../../opportunity-core/models/enums';

@Component({
  selector: 'dps-property-quote-layout',
  templateUrl: './property-quote-layout.component.html',
  styleUrls: ['./property-quote-layout.component.scss']
})
export class PropertyQuoteLayoutComponent implements OnInit, OnChanges {

  @Input() isLoading: OpportunityLoadingType;
  @Input() propertyQuoteType: PropertyQuoteType[];
  @Input() propertyQuRequest: PropertyQuoteRequest;
  @Input() currency: string;
  @Input() webQuoteData: WebQuoteData;
  @Input() selectedStep: number;
  @Input() propertyQuReport: PropertyQuReport;
  @Input() closePopup: number;
  @Input() isEditQuote: boolean;
  @Input() webQuoteCompany: WebQuoteCompnayDetails;
  @Output() chnageProQuoteRequest = new EventEmitter<{ key: PropertyQuoteRequestKey, value: any }>();
  @Output() requestReport = new EventEmitter();
  @Output() close = new EventEmitter();
  @Output() chnageSelectedStep = new EventEmitter<number>();
  @Output() sendQuote = new EventEmitter<string>();
  @Output() changeReportData = new EventEmitter<{ newReport: PropertyQuReportview, type: string }>();

  key = PropertyQuoteRequestKey;
  constructor() { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.closePopup && !changes.closePopup.isFirstChange() && changes.closePopup.currentValue > 0) {
      setTimeout(() => {
        this.close.emit();
      }, 100);
    }
  }

  onClose() {
    this.close.emit();
  }
  onChnageProQuoteRequest(event: { key: PropertyQuoteRequestKey, value: any }) {
    if (event.key === PropertyQuoteRequestKey.appId) {
      this.chnageSelectedStep.emit(1);
    }
    this.chnageProQuoteRequest.emit(event);
  }
  changeSelectedStep(event: StepperSelectionEvent) {
    if ((event.selectedIndex === 2 && !this.propertyQuReport) && !!this.propertyQuRequest.appId) {
      this.requestReport.emit();
    }
    this.chnageSelectedStep.emit(event.selectedIndex);
  }
  onRequestReport() {
    this.requestReport.emit();
  }
  get app(): PropertyQuoteType {
    if (this.propertyQuoteType && this.propertyQuRequest) {
      return this.propertyQuoteType.find(i => i.appId === this.propertyQuRequest[PropertyQuoteRequestKey.appId]);
    }
    return null;
  }
  onSendQuote(reportContent) {
    this.sendQuote.emit(reportContent);
  }
  onChangeReport(data: { newReport: PropertyQuReportview, type: string }) {
    this.changeReportData.emit(data);
  }
}
