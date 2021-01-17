import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { PropertyQuReport, PropertyQuoteType, PropertyQuoteRequest, PropertyQuReportview } from './../../../opportunity-core/models/interfaces';
import { LeaseHold, PropertyQuoteRequestKey } from './../../../opportunity-core/models/enums';

@Component({
  selector: 'dps-property-quote-report',
  templateUrl: './property-quote-report.component.html',
  styleUrls: ['./property-quote-report.component.scss']
})
export class PropertyQuoteReportComponent implements OnInit {

  @Input() propertyQuReport: PropertyQuReport;
  @Input() currency: string;
  @Input() selectedQuoteType: PropertyQuoteType;
  @Input() propertyQuRequest: PropertyQuoteRequest;
  @Input() isLoading: boolean;

  @Output() sendQuote = new EventEmitter<string>();
  @Output() chnageProQuoteRequest = new EventEmitter<{ key: PropertyQuoteRequestKey, value: any }>();
  @Output() changeReportData = new EventEmitter<{ newReport: PropertyQuReportview, type: string }>();

  leaseHold = LeaseHold;
  key = PropertyQuoteRequestKey;

  constructor() { }

  ngOnInit() {

  }
  onSendQuote() {
    let reportContent = document.getElementById('reportDiv').innerHTML;
    reportContent = reportContent.replace(/local_offer/g, '').replace(/(edited)/g, '');
    this.sendQuote.emit(reportContent);
  }
  onChnageProQuoteRequest(key: PropertyQuoteRequestKey, value: any) {
    this.chnageProQuoteRequest.emit({ key: key, value: value });
  }
  onChangeReport(newReport: PropertyQuReportview, type: string) {
    this.changeReportData.emit({newReport: newReport, type: type});
  }

}
