import { LookupType } from './../../../shared/models/dialog';
import { takeUntil, debounceTime, pairwise } from 'rxjs/operators';
import { Component, OnInit, Input, SimpleChanges, OnChanges, EventEmitter, Output, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { TimeInformationModel } from '../../../time-information-core/models/interfaces';
import { MatTabChangeEvent, MatDialog } from '@angular/material';
import { ButtonAction, CrimeLookupTypeMapFiled } from './../../../time-information-core/models/enum';

@Component({
  selector: 'dps-investigation-ic3',
  templateUrl: './investigation-ic3.component.html',
  styleUrls: ['./investigation-ic3.component.scss']
})
export class InvestigationIc3Component implements OnInit, OnChanges, OnDestroy {

  @Input() model: TimeInformationModel;
  @Input() isEditMode: boolean;
  @Input() mpu: number;
  @Input() resetCount: number;
  @Output() modelChange = new EventEmitter<TimeInformationModel>();
  @Output() changeTab = new EventEmitter<number>();
  @Output() rateCalculation = new EventEmitter<{
    controlerName: string,
    model: TimeInformationModel,
    value: any
  }>();
  @Output() openLookup = new EventEmitter<{ lookupType: LookupType, property: string }>();
  @Output() removeLookupBind = new EventEmitter<{ lookupType: LookupType, property: string }>();

  formGroup: FormGroup;
  private unsubscribe: Subject<void> = new Subject();
  UserAction = ButtonAction;
  selectedTabIndex = 0;
  userControlText: string;
  crimeLookupType = CrimeLookupTypeMapFiled;
  disabaleNextDateCrl = true;

  constructor(private formBuilder: FormBuilder, private dialog: MatDialog) {
    this.buildForm();
  }

  ngOnInit() {

  }


  ngOnChanges(changes: SimpleChanges) {
    if (changes.model && changes.model.currentValue) {
      if (JSON.stringify(changes.model.currentValue) !== JSON.stringify(changes.model.previousValue)) {
        this.formGroup.patchValue(this.model);
        this.disabaleNextDateCrl = ((this.model && this.model.nextAppDateCheck) && this.model.timeId !== 0);
        if (this.disabaleNextDateCrl) {
          this.formGroup.get('noteLn').enable();
          this.formGroup.get('courtName').enable();
        } else {
          this.formGroup.get('noteLn').disable();
          this.formGroup.get('courtName').disable();
        }
      }
    }
  }

  private buildForm() {


    // dtpNextHearingDate.Checked




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
      nextHearingDateCheck: [false],
      nextHearingDate: [''],

      specialPrepRate: [''],
      londonRate: [''],

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
      //  waitValPS: [''],
      totalValueLA: [''],
      disbursements: [''],
      letter: [''],
      feeErnHrsMin: new FormControl({ value: '', disabled: true }),
      adviAssi: new FormControl({ value: '', disabled: true }),
      waitPS: [''],
      arrTime: [''],
      depTime: [''],
      court: [''],
      totalfeeErnTime: [''],

      noteLn: new FormControl({ value: '', disabled: true }),
      courtName: new FormControl({ value: '', disabled: true }),
    });

    this.formGroup.get('nextHearingDate').disable();


    this.formGroup.valueChanges.pipe(takeUntil(this.unsubscribe)).pipe(debounceTime(500), pairwise())
      .subscribe((values) => {

        if (values[0] && JSON.stringify(values[0]) !== JSON.stringify(values[1])) {

          const previesValue = values[0];
          const curentValues = this.formGroup.getRawValue();

          if ((
            previesValue.londonRate !== curentValues.londonRate ||
            previesValue.attCsl !== curentValues.attCsl ||
            previesValue.travel !== curentValues.travel ||
            previesValue.waiting !== curentValues.waiting ||
            previesValue.prep !== curentValues.prep ||
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

  onOpenCourtLookup() {
    this.openLookup.emit({ property: 'court', lookupType: LookupType.COURT });
  }
  onOpenResultLookup() {
    this.openLookup.emit({ property: 'result', lookupType: LookupType.LISTED_AS });
  }
  onOpenResonLookup() {
    this.openLookup.emit({ property: 'reason', lookupType: LookupType.REASON });
  }
  onOpenCourtNameLookup() {
    this.openLookup.emit({ property: 'courtName', lookupType: LookupType.COURT });
  }
  onOpenNoteLookup() {
    this.openLookup.emit({ property: 'noteLn', lookupType: LookupType.NOTE_FIXTURE });
  }





  onOpenHearing(value) {
    if (!!value) {
      this.openLookup.emit({ property: value, lookupType: LookupType.HEARING_TYPES });
    } else if (!this.model.hearingTp1) {
      this.openLookup.emit({ property: 'hearingTp1', lookupType: LookupType.HEARING_TYPES });
    } else if (!this.model.hearingTp2) {
      this.openLookup.emit({ property: 'hearingTp2', lookupType: LookupType.HEARING_TYPES });
    } else {
      this.openLookup.emit({ property: 'hearingTp3', lookupType: LookupType.HEARING_TYPES });
    }
  }
  onRemoveHearing(property) {
    this.removeLookupBind.emit({ lookupType: LookupType.HEARING_TYPES, property: property });
  }


  onOpenAttendee(value) {
    if (!!value) {
      this.openLookup.emit({ property: value, lookupType: LookupType.ATTENDEE_CODES });
    } else if (!this.model.attendees1) {
      this.openLookup.emit({ property: 'attendees1', lookupType: LookupType.ATTENDEE_CODES });
    } else if (!this.model.attendees2) {
      this.openLookup.emit({ property: 'attendees2', lookupType: LookupType.ATTENDEE_CODES });
    } else {
      this.openLookup.emit({ property: 'attendees3', lookupType: LookupType.ATTENDEE_CODES });
    }
  }


  onRemoveAttendee(property) {
    this.removeLookupBind.emit({ lookupType: LookupType.ATTENDEE_CODES, property: property });
  }

  onChangeTap(tab: MatTabChangeEvent) {
    this.changeTab.emit(tab.index);
  }

  enableNextHearingDate(isEnable: boolean) {
    if (isEnable) {
      this.formGroup.get('nextHearingDate').enable();
    } else {
      this.formGroup.get('nextHearingDate').disable();
    }
  }

}
