import { takeUntil, debounceTime, pairwise } from 'rxjs/operators';
import { ButtonAction } from './../../../time-information-core/models/enum';
import { Component, OnInit, Input, SimpleChanges, OnChanges, EventEmitter, Output, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, ValidatorFn, AbstractControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { TimeInformationModel } from '../../../time-information-core/models/interfaces';
import { InvestigationClass } from '../../../time-information-core/class/InvestigationClass';
import { MatTabChangeEvent, MatDialog } from '@angular/material';
import { CrimeLookUpFiled, CRIME_LOOKUP_FILEDS } from '../../../core/lib/crime-managment';
import { LookupType, LookupsDialogInput, LoockupItem } from '../../../shared';
import { LookupsComponent } from '../../../shared/components/lookups/lookups.component';


@Component({
  selector: 'dps-investigation-ic2',
  templateUrl: './investigation-ic2.component.html',
  styleUrls: ['./investigation-ic2.component.scss']
})
export class InvestigationIc2Component implements OnInit, OnChanges, OnDestroy {

  @Input() model: TimeInformationModel;
  @Input() mpu: number;
  @Input() resetCount: number;
  @Input() policeSLookupList: LoockupItem[];
  @Output() modelChange = new EventEmitter<TimeInformationModel>();
  // @Output() openPoliceStationSearch = new EventEmitter<string>();
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

  constructor(private formBuilder: FormBuilder, private dialog: MatDialog) {
    this.buildForm();
  }

  ngOnInit() {

  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.model && changes.model.currentValue) {
      this.formGroup.patchValue(this.model);
      this.userControlText = this.model.userControlText;
    }
  }

  private buildForm() {

    this.formGroup = this.formBuilder.group({
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
      travel: [''],
      travelFromRate: [''],
      travelToRate: [''],
      travelTo: [''],
      prep: [''],
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
      prepVal: [''],
      prepRate: [''],
      advVal: [''],
      advRate: [''],
      advValue: [''],
      waitRate: [''],
      travelVal: [''],
      travRate: [''],
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
      waitValPS: [''],
      totalValueLA: [''],
      disbursements: [''],
      letter: [''],
      feeErnHrsMin: new FormControl({ value: '', disabled: true }),
      adviAssi: new FormControl({ value: '', disabled: true }),
      waitPS: new FormControl(null, [waitingTimeValidator()]),
      arrTime: new FormControl(null, [arrTimeValidator()]),
      depTime: new FormControl(null, [depTimeValidator()]),
    });


    this.formGroup.get('nextAppDate').disable();

    function waitingTimeValidator(): ValidatorFn {
      return (control: AbstractControl): { [key: string]: boolean } | null => {


        if (control.value && control.parent && control.touched) {
          const investigation = new InvestigationClass();

          const model: TimeInformationModel = control.parent.root.value;
          const timeDTO = investigation.calculateAdviAssiHrsMin(model.arrTime, model.depTime, control.value);



          if (timeDTO.getErrorCode() === -1) {

            const waitPS = control.parent.root.get('waitPS');
            const arrTime = control.parent.root.get('arrTime');

            if (!waitPS.valid) {
              waitPS.setValue(null);
            }
            if (!arrTime.valid) {
              arrTime.setValue(null);
            }


            return { 'waitingTime': true };
          }
        }
        return null;
      };
    }


    function arrTimeValidator(): ValidatorFn {
      return (control: AbstractControl): { [key: string]: boolean } | null => {

        if (control.value && control.parent && control.touched) {
          const investigation = new InvestigationClass();

          const model: TimeInformationModel = control.parent.root.value;
          const timeDTO = investigation.calculateAdviAssiHrsMin(control.value, model.depTime, model.waitPS);


          if (timeDTO.getErrorCode() === -1) {

            const waitPS = control.parent.root.get('waitPS');
            const depTime = control.parent.root.get('depTime');

            if (!waitPS.valid) {
              waitPS.setValue(null);
            }
            if (!depTime.valid) {
              depTime.setValue(null);
            }

            return { 'arrTime': true };
          }
        }
        return null;
      };
    }

    function depTimeValidator(): ValidatorFn {
      return (control: AbstractControl): { [key: string]: boolean } | null => {

        if (control.value && control.parent && control.touched) {
          const investigation = new InvestigationClass();

          const model: TimeInformationModel = control.parent.root.value;
          const timeDTO = investigation.calculateAdviAssiHrsMin(model.arrTime, control.value, model.waitPS);


          if (timeDTO.getErrorCode() === -1) {

            const waitPS = control.parent.root.get('waitPS');
            const arrTime = control.parent.root.get('arrTime');

            if (!waitPS.valid) {
              waitPS.setValue(null);
            }
            if (!arrTime.valid) {
              arrTime.setValue(null);
            }

            return { 'depTime': true };
          }
        }
        return null;
      };
    }


    this.formGroup.valueChanges.pipe(takeUntil(this.unsubscribe)).pipe(debounceTime(500), pairwise())
      .subscribe((values) => {

        if (values[0] && JSON.stringify(values[0]) !== JSON.stringify(values[1])) {

          const waitPS = this.formGroup.get('waitPS');
          const arrTime = this.formGroup.get('arrTime');
          const depTime = this.formGroup.get('depTime');

          const previesValue = values[0];
          const curentValues = this.formGroup.getRawValue();

          if (!waitPS.valid && previesValue.waitPS !== curentValues.waitPS) {
            return;
          }
          if (!arrTime.valid && previesValue.arrTime !== curentValues.arrTime) {
            return;
          }
          if (!depTime.valid && previesValue.depTime !== curentValues.depTime) {
            return;
          }

          if (!waitPS.valid) {
            curentValues.waitPS = null;
          }
          if (!arrTime.valid) {
            curentValues.arrTime = null;
          }
          if (!depTime.valid) {
            curentValues.depTime = null;
          }
          this.formGroup.getRawValue();


          if ((previesValue.travelTo !== curentValues.travelTo ||
            previesValue.travelFrom !== curentValues.travelFrom ||
            previesValue.arrTime !== curentValues.arrTime ||
            previesValue.depTime !== curentValues.depTime ||
            previesValue.waitPS !== curentValues.waitPS ||
            previesValue.adv !== curentValues.adv ||
            previesValue.dutySol !== curentValues.dutySol ||
            previesValue.londonRate !== curentValues.londonRate ||
            previesValue.mileage !== curentValues.mileage ||
            previesValue.weekEndWork !== curentValues.weekEndWork ||
            previesValue.isInitDutyPeriod !== curentValues.isInitDutyPeriod ||
            previesValue.initDuty !== curentValues.initDuty)) {

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

  onSearchPoliceStation(searchText: string) {
    if (searchText === ' - ') {
      searchText = null;
    } else if (searchText && searchText.includes('-')) {
      const policeStationCode = searchText.split('-')[0];
      searchText = policeStationCode ? policeStationCode.trim() : searchText;
    }
    // this.openPoliceStationSearch.emit(text);
    const fileds: CrimeLookUpFiled = CRIME_LOOKUP_FILEDS[LookupType.POLICE_ST_CODES];
    const loockupInput: LookupsDialogInput = {
      title: fileds.title,
      secondTitle: fileds.secondTitle,
      items: this.policeSLookupList,
      keyColumsEnable: false,
      editable: false,
      showCode: true,
      enableSearch: true,
      searchText: searchText
    };
    const dialogRef = this.dialog.open(LookupsComponent, {
      width: '450px',
      height: '500px',
      data: loockupInput,
      hasBackdrop: true,
      disableClose: true,
      panelClass: 'dps-notification'
    });
    dialogRef.afterClosed().subscribe(
      ((item: LoockupItem) => {
        if (item) {
          this.formGroup.get('policeSt').setValue(`${item.code} - ${item.name}`);
        }

      })
    );
  }

  onChangeTap(tab: MatTabChangeEvent) {
    this.changeTab.emit(tab.index);
  }

  enableNextAppDate(isEnable: boolean) {
    if (isEnable) {
      this.formGroup.get('nextAppDate').enable();
    } else {
      this.formGroup.get('nextAppDate').disable();
    }
  }

}
