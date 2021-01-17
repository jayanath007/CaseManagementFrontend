import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Cost, PropertyQuReportview, propertyQuoteItemDisplayName } from '../../../opportunity-core/models/interfaces';
import { CostDiscount } from './../../../opportunity-core/models/interfaces';

@Component({
  selector: 'dps-property-report-item-edit',
  templateUrl: './property-report-item-edit.component.html',
  styleUrls: ['./property-report-item-edit.component.scss']
})
export class PropertyReportItemEditComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA)
  public data: { currency: string, report: PropertyQuReportview, costType: string, discountInfo: CostDiscount },
    public dialogRef: MatDialogRef<PropertyReportItemEditComponent>) { }

  costList: Cost[] = [];
  report: PropertyQuReportview;
  newItem: Cost;

  tempDiscountInfo: CostDiscount = {
    discountPer: 0,
    discountAmount: 0,
    allowanceText: null
  };

  ngOnInit() {
    this.report = JSON.parse(JSON.stringify(this.data.report));
    // newItemInitialData()
    this.newItem = {
      costId: 0,
      itemName: null,
      description: null,
      price: 0.00,
      vatable: false,
      optional: false,
      disable: false,
      tenure: null,
      appId: '',
      varMappingId: null,
      isFee: false
    };

    if (this.data.costType === 'repVatItem') {
      this.costList = this.report.repVatItem;
      this.newItem.vatable = true;
    } else if (this.data.costType === 'repNonVatItem') {
      this.costList = this.report.repNonVatItem;
    } else if (this.data.costType === 'feeCostItems') {
      this.costList = this.report.feeCostItems;
      this.newItem.isFee = true;
    } else if (this.data.costType === 'extraCostItems') {
      this.costList = this.report.extraCostItems;
    }

    if (!!this.data.discountInfo) {
      this.tempDiscountInfo = {
        discountPer: this.data.discountInfo.discountPer,
        discountAmount: this.data.discountInfo.discountAmount,
        allowanceText: this.data.discountInfo.allowanceText,
      };
    }

  }

  onclaculateReport() {
    this.report[this.data.costType] = this.costList;
    this.report.repVatItemTotal = this.costItemTotal(this.report.repVatItem);
    this.report.repNonVatItemTotal = this.costItemTotal(this.report.repNonVatItem);
    this.report.feeCostItemsTotal = this.costItemTotal(this.report.feeCostItems);
    this.report.extraCostItemsTotal = this.costItemTotal(this.report.extraCostItems);
    this.report.vat = this.calulateVat();
    this.report.total = this.calulateTotal();
    this.report.ourtot = this.getSum([this.report.vat, this.report.profCosts, this.report.extraCostItemsTotal]);
    if (!!this.tempDiscountInfo && !this.tempDiscountInfo.allowanceText) {
      this.tempDiscountInfo.allowanceText = 'Less allowance';
    }
    this.onCloseDialog({ newReport: this.report, discountInfo: this.tempDiscountInfo });
  }

  onCloseDialog(data: { newReport: PropertyQuReportview, discountInfo: CostDiscount } = null) {

    this.dialogRef.close(data);
  }

  changeCostItem(index: number, value) {
    if (!value) {
      value = 0;
    }
    value = Number(value);
    this.costList = this.costList.map((i, idx) => {
      if (idx === index) {
        return { ...i, price: value };
      } else {
        return i;
      }
    });
  }

  costItemTotal(cost: Cost[]): number {
    let total = 0;
    cost.forEach(i => total += i.price);
    return total;
  }

  calulateVat(): number {
    // tslint:disable-next-line: max-line-length
    return (this.getSum([this.report.profCosts, this.report.repVatItemTotal, this.report.extraCostItemsTotal, this.report.feeCostItemsTotal]) * Number(this.report.vatPercentage));
  }

  calulateTotal(): number {
    // tslint:disable-next-line: max-line-length
    return (this.getSum([this.report.repVatItemTotal, this.report.repNonVatItemTotal, this.report.feeCostItemsTotal, this.report.stampDuty, this.report.landRegFee, this.report.lasRate]));
  }

  getSum(values: any[]): number {
    let total = 0;
    values.forEach(i => total += Number(i));
    return total;

  }

  changeFixCost(value, type: string) {
    if (!value) {
      value = 0;
    }
    value = Number(value);
    this.report[type] = value;
    if (type === 'profCosts' && this.tempDiscountInfo.discountPer > 0) {
      this.tempDiscountInfo.discountAmount = this.report.profCosts * (this.tempDiscountInfo.discountPer / 100);
    }
  }

  changeDiscountPer(value: number) {
    if (!value || value === 0) {
      value = 0;
    }
    this.tempDiscountInfo.discountPer = value;
    this.tempDiscountInfo.discountAmount = this.report.profCosts * (value / 100);
  }

  changeDiscountAmt(value: number) {
    if (!value) {
      value = 0;
    }
    if (value < this.report.profCosts) {
      this.tempDiscountInfo.discountAmount = value;
      this.tempDiscountInfo.discountPer = 0;
    }
  }

  addNewItem(name, price: number) {
    if (!!name) {
      if (!price) {
        price = 0.00;
      }
      this.newItem.price = Number(price);
      this.newItem.itemName = name;
      this.newItem.description = name;
      const tempNewItem = JSON.parse(JSON.stringify(this.newItem));
      if (this.costList && this.costList.length > 0) {
        this.costList.push(tempNewItem);
      } else {
        this.costList = [tempNewItem];
      }
      const newNameInput = <HTMLInputElement>document.getElementById('newItemNameInput');
      newNameInput.value = null;
      const newPriceInput = <HTMLInputElement>document.getElementById('newItemPriceInput');
      newPriceInput.value = '0';
    }
  }

  // keyDownOnNewPrice(event, name, price: number) {
  //   if (event.code === 'Enter') {
  //     this.addNewItem(name, price);
  //   }
  // }

  removeItem(index: number) {
    this.costList.splice(index, 1);
  }
  itemDesplayName(item: Cost): string {
    return propertyQuoteItemDisplayName(item);
  }

}
