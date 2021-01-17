
import { LookupType } from './../../../shared/models/dialog';
import { takeUntil, debounceTime, pairwise } from 'rxjs/operators';
import { Component, OnInit, Input, SimpleChanges, OnChanges, EventEmitter, Output, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Subject } from 'rxjs';
import { TimeInformationModel } from '../../../time-information-core/models/interfaces';
import { MatTabChangeEvent } from '@angular/material';
import { ButtonAction, CrimeLookupTypeMapFiled } from './../../../time-information-core/models/enum';

@Component({
  selector: 'dps-lgfs-cc2',
  templateUrl: './lgfs-cc2.component.html',
  styleUrls: ['./lgfs-cc2.component.scss']
})
export class LgfsCc2Component implements OnInit, OnChanges, OnDestroy {

  @Input() model: TimeInformationModel;
  @Input() mpu: number;
  @Input() resetCount: number;
  @Input() gradeList: string[];
  @Output() modelChange = new EventEmitter<TimeInformationModel>();
  @Output() openLookup = new EventEmitter<{ lookupType: LookupType, property: string }>();
  @Output() changeTab = new EventEmitter<number>();
  @Output() rateCalculation = new EventEmitter<{
    controlerName: string,
    model: TimeInformationModel,
    value: any
  }>();


  formGroup: FormGroup;
  private unsubscribe: Subject<void> = new Subject();
  UserAction = ButtonAction;
  selectedTabIndex = 0;
  userControlText: string;
  crimeLookupType = CrimeLookupTypeMapFiled;


  constructor(private formBuilder: FormBuilder) {
    this.buildForm();
  }

  ngOnInit() {

  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.model && changes.model.currentValue) {
      if (JSON.stringify(this.formGroup.value) !== JSON.stringify(changes.model.currentValue)) {
        this.formGroup.patchValue(this.model);
      }
    }
  }

  private buildForm() {

    this.formGroup = this.formBuilder.group({

      travel: [''],
      travRate: [''],
      travelVal: [''],
      adciceAssistanceLimit: [''],
      adciceAssistanceCurrentTotal: [''],

      waiting: [''],
      waitRate: [''],
      waitingVal: [''],

      prep: [''],
      prepRate: [''],
      prepVal: [''],


      timeId: [''],
      fileId: [''],
      branchId: [''],
      appId: [''],
      classId: [''],
      totVal: [''],
      diaryNote: [''],
      attTypeId: [''],
      attTypeText: [''],
      date: [''],
      feeEarner: [''],
      vatFaresVal: [''],
      nonVatFaresVal: [''],
      parkingVal: [''],
      userControlText: [''],
      custTemplates: [''],

      travelFromRate: [''],
      travelToRate: [''],
      travelTo: [''],

      workDoneSep: [''],
      court: [''],
      attCsl: [''],

      attConf: [''],
      result: [''],
      morning: [''],
      morningIn: [''],
      morningOut: [''],
      afternoon: [''],
      aftIn: [''],
      aftOut: [''],
      attendance: [''],
      attendees1: [''],
      attendees2: [''],
      attendees3: [''],
      hearingTp1: [''],
      hearingTp2: [''],
      hearingTp3: [''],
      policeSt: [''],

      workCourt: [''],
      workReasonTrv: [''],
      reason: [''],
      grade: [''],
      sectionRate: [''],
      nextHearingDateCheck: [''],
      nextHearingDate: [''],
      courtName: [''],
      specialPrepRate: [''],
      londonRate: [''],
      attendeesSep1: [''],
      attendeesSep2: [''],
      attendeesSep3: [''],
      noteLn: [''],
      claimCommittal: [''],
      nextAppDateCheck: [false],
      nextAppDate: [''],
      dutySol: [''],
      weekEndWork: [''],
      initDuty: [''],
      attCslVal: [''],
      attCslRate: [''],
      attConfVal: [''],
      attConfRate: [''],

      adv: [''],
      advVal: [''],
      advRate: [''],
      advValue: [''],




      attendanceVal: [''],
      attendanceRate: [''],
      travFromVal: [''],
      travToVal: [''],

      advAssiVal: [''],
      mileageRate: [''],
      mileageVal: [''],
      vatFares: [''],
      nonVatFares: [''],
      parking: [''],

      feeErnRate: [''],
      feeErnVal: [''],
      diaryRef: [''],
      ownSol: [''],

      travelFrom: [''],
      guid: [''],
      isInitDutyPeriod: [''],
      mileage: [''],
      advAssiRate: [''],
      waitRatePS: [''],
      // waitValPS: [''],
      totalValueLA: [''],
      disbursements: [''],
      letter: [''],
      waitPS: [''],
      arrTime: [''],
      depTime: [''],
      listedAs: ['']
    });




    this.formGroup.valueChanges.pipe(takeUntil(this.unsubscribe)).pipe(debounceTime(500), pairwise())
      .subscribe((values) => {


        if (values[0] && JSON.stringify(values[0]) !== JSON.stringify(values[1])) {

          const previesValue = values[0];
          const curentValues = this.formGroup.getRawValue();

          if ((
            previesValue.londonRate !== curentValues.londonRate ||
            previesValue.grade !== curentValues.grade ||
            previesValue.waiting !== curentValues.waiting ||
            previesValue.prep !== curentValues.prep ||
            previesValue.travel !== curentValues.travel ||
            previesValue.adv !== curentValues.adv)) {

            curentValues.ownSol = curentValues.dutySol ? false : true;
            this.rateCalculation.emit({ controlerName: 'travel5', model: curentValues, value: '' });

          } else {

            curentValues.userControlText = this.model.userControlText;
            curentValues.vatFares = this.shrinkToTwoDecimal(curentValues.vatFares);
            curentValues.nonVatFares = this.shrinkToTwoDecimal(curentValues.nonVatFares);
            curentValues.parking = this.shrinkToTwoDecimal(curentValues.parking);
            this.modelChange.emit(curentValues);

          }

        }

      });

  }

  shrinkToTwoDecimal(value: string) {
    if (value) {
      const decimalValue = value.toString().split('.')[1];
      if (decimalValue) {
        return value.toString().split('.')[0] + '.' + decimalValue.slice(0, 2);
      }
    }
    return value;
  }


  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  onOpenListedAsLookup() {
    this.openLookup.emit({ property: 'result', lookupType: LookupType.LISTED_AS });
  }
  onOpenCourtLookup() {
    this.openLookup.emit({ property: 'court', lookupType: LookupType.COURT });
  }


  onChangeTap(tab: MatTabChangeEvent) {
    this.changeTab.emit(tab.index);
  }



}

