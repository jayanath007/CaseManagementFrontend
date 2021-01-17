import { MatDialog } from '@angular/material';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { PropertyQuReportview, CostDiscount, Cost, propertyQuoteItemDisplayName } from './../../../opportunity-core/models/interfaces';
import { PropertyReportItemEditComponent } from '../property-report-item-edit/property-report-item-edit.component';

@Component({
  selector: 'dps-property-quote-report-items',
  templateUrl: './property-quote-report-items.component.html',
  styleUrls: ['./property-quote-report-items.component.scss']
})
export class PropertyQuoteReportItemsComponent implements OnInit {

  constructor(public dialog: MatDialog) { }
  @Input() data: PropertyQuReportview;
  @Input() currency: string;
  @Input() type: string;
  @Input() reportType: string;
  @Input() valueHeader: string;
  @Input() profCostDiscount: CostDiscount;

  @Output() changeProfCostDiscount = new EventEmitter<CostDiscount>();
  @Output() changeReportData = new EventEmitter<PropertyQuReportview>();

  ngOnInit() {
  }

  // onOpenDiscountPopup() {
  //   this.dialog.open(ProfessionalCostDiscountComponent, {
  //     data: { currency: this.currency, profCost: this.data.profCosts, discountInfo: this.profCostDiscount },
  //     disableClose: true,
  //     width: '350px',
  //     panelClass: 'dps-notification'
  //   }).afterClosed().subscribe((discountInfo: CostDiscount) => {
  //     if (!!discountInfo) {
  //       this.changeProfCostDiscount.emit(discountInfo);
  //     }
  //   });
  // }

  onOpenReportEditPopup(costType: string) {
    this.dialog.open(PropertyReportItemEditComponent, {
      data: { currency: this.currency, report: this.data, costType: costType, discountInfo: this.profCostDiscount },
      disableClose: true,
      width: '350px',
      height: '500px',
      panelClass: 'dps-notification'
    }).afterClosed().subscribe((data: { newReport: PropertyQuReportview, discountInfo: CostDiscount }) => {
      if (!!data.newReport) {
        this.changeReportData.emit(data.newReport);
      }
      if (!!data.discountInfo) {
        this.changeProfCostDiscount.emit(data.discountInfo);
      }
    });
  }

  get vatReduction(): number {
    if (!!this.profCostDiscount && this.profCostDiscount.discountAmount > 0) {
      // return (this.profCostDiscount.discountAmount * this.data.vat) / this.data.profCosts;
      return (this.profCostDiscount.discountAmount * Number(this.data.vatPercentage));
    } else {
      return 0;
    }
  }

  get ourTotal(): number {
    if (!this.profCostDiscount) {
      return this.data.ourtot;
    } else if (!!this.profCostDiscount && !!this.data) {
      return this.data.ourtot - this.profCostDiscount.discountAmount - this.vatReduction;
    } else {
      return this.data.ourtot;
    }
  }

  itemDesplayName(item: Cost): string {
    return propertyQuoteItemDisplayName(item);
  }
  filterCostItem(items: Cost[]): Cost[] {
    if (!!items && items.length > 0) {
      return items.filter(i => i.price > 0);
    }
    return [];
  }

}
