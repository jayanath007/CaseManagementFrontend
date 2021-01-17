import { Component, EventEmitter, Input, OnInit, Output, OnChanges, SimpleChanges } from '@angular/core';
import { ResidenceNilRateBandData } from '../../../probate-core/models/interfaces';

@Component({
  selector: 'dps-residence-nil-rate-band',
  templateUrl: './residence-nil-rate-band.component.html',
  styleUrls: ['./residence-nil-rate-band.component.scss']
})
export class ResidenceNilRateBandComponent implements OnInit, OnChanges {
  @Input() residenceNilRateBandData: ResidenceNilRateBandData;

  @Output() rnrbDataUpdate = new EventEmitter<any>();
  constructor() { }
  noOfPreDeceasedSpouses = 0;
  previouslyUsedTRNRB = 0;
  remainingTRNRB = 0;
  rnrbInForceDOD = 0;
  trnrbInForceDOD = 0;
  ngOnInit() {
    this.setInitData();

  }
  ngOnChanges(changes: SimpleChanges) {
    this.setInitData();
  }

  updateRnrb() {
    const rnrbUpdateData: ResidenceNilRateBandData = {

      noOfPreDeceasedSpouses: this.noOfPreDeceasedSpouses,
      previouslyUsedTRNRB: this.previouslyUsedTRNRB,
      remainingTRNRB: this.remainingTRNRB,
      rnrbInForceDOD: this.rnrbInForceDOD,
      trnrbInForceDOD: this.trnrbInForceDOD


    };
    this.rnrbDataUpdate.emit(rnrbUpdateData);

  }

  changeRnrbInForceDOD(value) {
    this.rnrbInForceDOD = parseInt(value, 10);

  }
  changeTrnrbInForceDOD(value) {
    this.trnrbInForceDOD = parseInt(value, 10);

  }

  changeNoOfPreDeceased(value) {
    this.noOfPreDeceasedSpouses = parseInt(value, 10);
  }

  changeUsedTRNRB(value) {
    this.previouslyUsedTRNRB = parseInt(value, 10);

  }

  changeRemainingTRNRB(value) {
    this.remainingTRNRB = parseInt(value, 10);
  }

  private setInitData() {
    // if (this.residenceNilRateBandData) {
    this.noOfPreDeceasedSpouses = this.residenceNilRateBandData && this.residenceNilRateBandData.noOfPreDeceasedSpouses ?
      this.residenceNilRateBandData.noOfPreDeceasedSpouses : 0; // matterRef
    this.previouslyUsedTRNRB = this.residenceNilRateBandData && this.residenceNilRateBandData.previouslyUsedTRNRB ?
      this.residenceNilRateBandData.previouslyUsedTRNRB : 0; // comment
    this.remainingTRNRB = this.residenceNilRateBandData && this.residenceNilRateBandData.remainingTRNRB ?
      this.residenceNilRateBandData.remainingTRNRB : null;
    this.rnrbInForceDOD = this.residenceNilRateBandData && this.residenceNilRateBandData.rnrbInForceDOD ?
      this.residenceNilRateBandData.rnrbInForceDOD : null;
    this.trnrbInForceDOD = this.residenceNilRateBandData && this.residenceNilRateBandData.trnrbInForceDOD ?
      this.residenceNilRateBandData.trnrbInForceDOD : null;

    //  }

  }


}
