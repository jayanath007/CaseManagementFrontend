import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { TableRow, TableColumn } from '../../..';
import { SummeryViewType, CrimeClassTotalsSummaryViewModel } from '../../../../core/lib/crime-managment';

@Component({
  selector: 'dps-total-description',
  templateUrl: './total-description.component.html',
  styleUrls: ['./total-description.component.scss']
})
export class TotalDescriptionComponent implements OnChanges {

  constructor() { }

  @Input() selectType: SummeryViewType;
  @Input() currenySymbol: string;
  @Input() data: CrimeClassTotalsSummaryViewModel;
  @Input() height: number;
  @Output() unpinTotal = new EventEmitter();
  summeryViewType = SummeryViewType;
  gridRows: TableRow<any>[] = [];
  columns: TableColumn[] = [];
  feeErnerColumns: TableColumn[];
  disbursementColumns: TableColumn[];

  ngOnChanges(changes: SimpleChanges): void {
    if ((changes.selectType) || (changes.data && !changes.data.isFirstChange())) {
      if (!this.columns || !this.feeErnerColumns) {
        this.columns = [
          { name: `Description`, propertyName: 'description', width: '25%' },
          { name: `Rate  ${this.currenySymbol}`, propertyName: 'rate', width: '15%', textAlign: 'right', numberFormat: '1.2-2' },
          { name: 'Hrs/Min/Count', propertyName: 'hrsMinCont', width: '15%', textAlign: 'right' },
          { name: `Net Total  ${this.currenySymbol}`, propertyName: 'netTotal', width: '15%', textAlign: 'right', numberFormat: '1.2-2' },
          { name: `VAT ${this.currenySymbol}`, propertyName: 'vat', width: '15%', textAlign: 'right', numberFormat: '1.2-2' },
          { name: `Gross Total  ${this.currenySymbol}`, propertyName: 'grossTotal', width: '15%', textAlign: 'right', numberFormat: '1.2-2' }
        ];

        this.feeErnerColumns = [
          { name: 'Fee Earner', propertyName: 'feeEarner', width: '15%' },
          { name: 'Hrs:Min', propertyName: 'hrsMin', width: '10%', textAlign: 'right' },
          { name: `Hourly Rate  ${this.currenySymbol}`, propertyName: 'hourlyRate', width: '15%', textAlign: 'right' },
          { name: `Ltr/Cals Co`, propertyName: 'ltrCalsCo', width: '15%', textAlign: 'right', numberFormat: '1.2-2' },
          { name: `Ltr/Cals Rate  ${this.currenySymbol}`, propertyName: 'ltrCalsRate', width: '15%', textAlign: 'right', numberFormat: '1.2-2' },
          { name: `Fee Earner Total  ${this.currenySymbol}`, propertyName: 'feeEarnerTotal', width: '15%', textAlign: 'right', numberFormat: '1.2-2' },
          { name: `Legal Aid Total  ${this.currenySymbol}`, propertyName: 'legalAidTotal', width: '15%', textAlign: 'right', numberFormat: '1.2-2' }
        ];

        this.disbursementColumns = [
          { name: `Description`, propertyName: 'description', width: '25%' },
          { name: `Rate  ${this.currenySymbol}`, propertyName: 'rate', width: '15%', textAlign: 'right', numberFormat: '1.2-2', defuiltValue: 'N/A' },
          { name: `Net Total  ${this.currenySymbol}`, propertyName: 'netTotal', width: '20%', textAlign: 'right', numberFormat: '1.2-2' },
          { name: `VAT ${this.currenySymbol}`, propertyName: 'vat', width: '20%', textAlign: 'right', numberFormat: '1.2-2' },
          { name: `Gross Total  ${this.currenySymbol}`, propertyName: 'grossTotal', width: '20%', textAlign: 'right', numberFormat: '1.2-2' }
        ];
      }
      this.setTableRow();
    }
  }

  onUnPinItem() {
    this.unpinTotal.emit();
  }

  setTableRow() {
    const rows: TableRow<any>[] = [];
    let selecedtTypeData: any; // BreakdownsSummaryViewModel | FeeEarnerTotalBreakdownsSummaryViewModel;
    if (!!this.data && !!this.data[this.selectType]) {
      selecedtTypeData = this.data[this.selectType];
      if (!!selecedtTypeData.summaryTotals) {
        if (this.selectType === SummeryViewType.FeeEarnerTotal) {
          selecedtTypeData.summaryTotals.forEach((r, i) => {
            rows.push({
              data: {
                feeEarner: r.feeEarner, hrsMin: r.hrsMin, hourlyRate: r.hrsRate, ltrCalsCo: r.callLetUnits,
                ltrCalsRate: r.callLetUnitRate, feeEarnerTotal: r.feeErnVal, legalAidTotal: r.legalAidVal
              }
            });
          });
          // push Total
          rows.push({
            data: {
              feeEarner: 'Grand Summary', hrsMin: '', hourlyRate: '', ltrCalsCo: '',
              ltrCalsRate: '', feeEarnerTotal: selecedtTypeData.feeEarnerTotal, legalAidTotal: selecedtTypeData.legalAidTotal
            }
          });
        } else if (this.selectType === SummeryViewType.Disbursements) {
          selecedtTypeData.summaryTotals.forEach((r, i) => {
            rows.push({
              data: {
                description: r.description, rate: r.rate, netTotal: r.net, vat: r.vat, grossTotal: r.gross
              }
            });
          });
          // push Total
          rows.push({
            data: {
              description: 'Grand Summary', rate: '', netTotal: selecedtTypeData.netTotal,
              vat: selecedtTypeData.vatTotal, grossTotal: selecedtTypeData.grossTotal
            }
          });

        } else {
          selecedtTypeData.summaryTotals.forEach((r, i) => {
            rows.push({
              data: {
                description: r.description, rate: r.rate, hrsMinCont: r.units, netTotal: r.net, vat: r.vat, grossTotal: r.gross
              }
            });
          });
          // push Total
          rows.push({
            data: {
              description: 'Grand Summary', rate: '', hrsMinCont: '', netTotal: selecedtTypeData.netTotal,
              vat: selecedtTypeData.vatTotal, grossTotal: selecedtTypeData.grossTotal
            }
          });
        }
      }
    }
    this.gridRows = rows;
  }

  get selectedColumsList() {
    if (this.selectType === SummeryViewType.FeeEarnerTotal) {
      return this.feeErnerColumns;
    } else if (this.selectType === SummeryViewType.Disbursements) {
      return this.disbursementColumns;
    }
    return this.columns;
  }

}
