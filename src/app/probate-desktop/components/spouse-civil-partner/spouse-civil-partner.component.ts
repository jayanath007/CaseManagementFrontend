import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { SpouseorCivilPatnerData } from '../../../probate-core/models/interfaces';

@Component({
  selector: 'dps-spouse-civil-partner',
  templateUrl: './spouse-civil-partner.component.html',
  styleUrls: ['./spouse-civil-partner.component.scss']
})
export class SpouseCivilPartnerComponent implements OnInit, OnChanges {
  @Input() token: string;
  @Input() spouseorCivilPatnerData: SpouseorCivilPatnerData;

  @Output() spouseCivilUpdate = new EventEmitter<any>();

  constructor(private datePipe: DatePipe) { }
  assetHeldInTrust = '0.00';
  dateofBirth: string;
  dateofDeath: string;
  giftsWithReservation = '0.00';
  inheritanceTax = 0;
  isUseFullNilRateBand: boolean;
  isUseRemainingNilRateBand: boolean;
  name: string;
  netValue = '0.00';
  nilRateBand = 0;
  nilRateBandAvailableTransfer = 0;
  nilRateBandatDOD = 0;
  percentageByWhich = 0;
  shareofGointly = '0.00';
  totalChargeableAssets = 0;
  totalChargeableValueofGift = '0.00';
  totalLegancies = 0;
  transferableNilRate = 0;
  ngOnInit() {
    this.setInitData();

  }

  ngOnChanges(changes: SimpleChanges) {
    this.setInitData();
  }

  onDateofBirth(value) {
    this.dateofBirth = value;

  }

  onDateofDeath(value) {

    this.dateofDeath = value;
  }



  onChangeIsUseFullNillRate(value) {
    this.isUseFullNilRateBand = value;

  }

  onChangeIsUseRemainNillRate(value) {
    this.isUseRemainingNilRateBand = value;

  }

  onChangeNetValue(value) {
    // A
    this.netValue = value ? value : '0.00';
  }

  onChangetotalChargeable(value) {
    // C
    this.totalChargeableValueofGift = value ? value : '0.00';
    this.nilRateBand = this.inheritanceTax - +this.totalChargeableValueofGift;
    this.nilRateBandAvailableTransfer = this.nilRateBand - this.totalChargeableAssets;
    this.calPercentageByWhich();

  }
  onChangeShareofGointly(value) {
    // F
    this.shareofGointly = value ? value : '0.00';
    this.totalChargeableAssets = this.totalLegancies + +(this.shareofGointly) + +(this.assetHeldInTrust) + +(this.giftsWithReservation);
    this.nilRateBandAvailableTransfer = this.nilRateBand - this.totalChargeableAssets;
    this.calPercentageByWhich();

  }


  onChangeAssetHeldInTrust(value) {
    //G
    this.assetHeldInTrust = value ? value : '0.00';
    this.totalChargeableAssets = this.totalLegancies + +(this.shareofGointly) + +(this.assetHeldInTrust) + +(this.giftsWithReservation);
    this.nilRateBandAvailableTransfer = this.nilRateBand - this.totalChargeableAssets;
    this.calPercentageByWhich();
  }

  onChangeGiftsWithReservation(value) {
    //H
    this.giftsWithReservation = value ? value : '0.00';
    this.totalChargeableAssets = this.totalLegancies + +(this.shareofGointly) + +(this.assetHeldInTrust) + +(this.giftsWithReservation);
    this.nilRateBandAvailableTransfer = this.nilRateBand - this.totalChargeableAssets;
    this.calPercentageByWhich();

  }
  // calTotalChargeble() {
  //   this.totalChargeableAssets = this.totalLegancies + this.shareofGointly + this.assetHeldInTrust + this.giftsWithReservation;
  //   this.nilRateBandatDOD = this.nilRateBandAvailableTransfer - this.totalChargeableAssets;
  //   this.calPercentageByWhich();
  // }

  calPercentageByWhich() {
    // J / B * 100
    const percentageValue = this.divideIfNotZero(this.nilRateBandAvailableTransfer, this.inheritanceTax) * 100;
    // const percentageValue = Math.abs((this.nilRateBandAvailableTransfer / this.inheritanceTax) * 100).toFixed(2);
    this.percentageByWhich = parseFloat(percentageValue.toFixed(2));
    const transableValue = (this.nilRateBandatDOD * this.percentageByWhich) / 100;
    this.transferableNilRate = parseFloat(transableValue.toFixed(2));


  }

  public divideIfNotZero(numerator, denominator) {
    if (denominator === 0 || isNaN(denominator)) {
      return null;
    } else {
      return numerator / denominator;
    }
  }


  private setInitData() {
    // if (this.spouseorCivilPatnerData) {
    this.netValue = this.spouseorCivilPatnerData && this.spouseorCivilPatnerData.netValue ?
      this.spouseorCivilPatnerData.netValue.toFixed(2) : '0.00'; // matterRef
    this.assetHeldInTrust = this.spouseorCivilPatnerData && this.spouseorCivilPatnerData.assetHeldInTrust ?
      this.spouseorCivilPatnerData.assetHeldInTrust.toFixed(2) : '0.00'; // comment
    this.dateofBirth = this.spouseorCivilPatnerData && this.spouseorCivilPatnerData.dateofBirth ?
      this.spouseorCivilPatnerData.dateofBirth : null;
    this.dateofDeath = this.spouseorCivilPatnerData && this.spouseorCivilPatnerData.dateofDeath ?
      this.spouseorCivilPatnerData.dateofDeath : null;
    this.giftsWithReservation = this.spouseorCivilPatnerData && this.spouseorCivilPatnerData.giftsWithReservation ?
      this.spouseorCivilPatnerData.giftsWithReservation.toFixed(2) : '0.00';
    this.inheritanceTax = this.spouseorCivilPatnerData && this.spouseorCivilPatnerData.inheritanceTax ?
      this.spouseorCivilPatnerData.inheritanceTax : 0;
    this.isUseFullNilRateBand = this.spouseorCivilPatnerData && this.spouseorCivilPatnerData.isUseFullNilRateBand
      ? this.spouseorCivilPatnerData.isUseFullNilRateBand : false;
    this.isUseRemainingNilRateBand = this.spouseorCivilPatnerData && this.spouseorCivilPatnerData.isUseRemainingNilRateBand ?
      this.spouseorCivilPatnerData.isUseRemainingNilRateBand : false;
    this.name = this.spouseorCivilPatnerData && this.spouseorCivilPatnerData.name ? this.spouseorCivilPatnerData.name : null;
    this.nilRateBand = this.spouseorCivilPatnerData && this.spouseorCivilPatnerData.nilRateBand ?
      this.spouseorCivilPatnerData.nilRateBand : 0;
    this.nilRateBandAvailableTransfer = this.spouseorCivilPatnerData && this.spouseorCivilPatnerData.nilRateBandAvailableTransfer ?
      this.spouseorCivilPatnerData.nilRateBandAvailableTransfer : 0;
    this.nilRateBandatDOD = this.spouseorCivilPatnerData && this.spouseorCivilPatnerData.nilRateBandatDOD ?
      this.spouseorCivilPatnerData.nilRateBandatDOD : 0;
    this.percentageByWhich = this.spouseorCivilPatnerData && this.spouseorCivilPatnerData.percentageByWhich ?
      this.spouseorCivilPatnerData.percentageByWhich : 0;
    this.shareofGointly = this.spouseorCivilPatnerData && this.spouseorCivilPatnerData.shareofGointly ?
      this.spouseorCivilPatnerData.shareofGointly.toFixed(2) : '0.00';
    this.totalChargeableAssets = this.spouseorCivilPatnerData && this.spouseorCivilPatnerData.totalChargeableAssets
      ? this.spouseorCivilPatnerData.totalChargeableAssets : 0;
    this.totalChargeableValueofGift = this.spouseorCivilPatnerData && this.spouseorCivilPatnerData.totalChargeableValueofGift ?
      this.spouseorCivilPatnerData.totalChargeableValueofGift.toFixed(2) : '0.00';
    this.totalLegancies = this.spouseorCivilPatnerData && this.spouseorCivilPatnerData.totalLegancies ?
      this.spouseorCivilPatnerData.totalLegancies : 0;
    this.transferableNilRate = this.spouseorCivilPatnerData && this.spouseorCivilPatnerData.transferableNilRate ?
      this.spouseorCivilPatnerData.transferableNilRate : 0;


  }

  onUpdateSpouseCivil() {
    const spouseCivilData: SpouseorCivilPatnerData = {

      netValue: +this.netValue,
      assetHeldInTrust: +this.assetHeldInTrust,
      dateofBirth: this.datePipe.transform(this.dateofBirth, 'yyyy-MM-dd'),
      dateofDeath: this.datePipe.transform(this.dateofDeath, 'yyyy-MM-dd'),
      giftsWithReservation: +this.giftsWithReservation,
      inheritanceTax: this.inheritanceTax,
      isUseFullNilRateBand: this.isUseFullNilRateBand,
      isUseRemainingNilRateBand: this.isUseRemainingNilRateBand,
      name: this.name,
      nilRateBand: this.nilRateBand,
      nilRateBandAvailableTransfer: this.nilRateBandAvailableTransfer,
      nilRateBandatDOD: this.nilRateBandatDOD,
      percentageByWhich: this.percentageByWhich,
      shareofGointly: +this.shareofGointly,
      totalChargeableAssets: this.totalChargeableAssets,
      totalChargeableValueofGift: +this.totalChargeableValueofGift,
      totalLegancies: this.totalLegancies,
      transferableNilRate: this.transferableNilRate,


    };
    this.spouseCivilUpdate.emit(spouseCivilData);

  }

}
