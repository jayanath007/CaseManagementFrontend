import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { ColumnDef } from '../../../core/lib/grid-model';
import { createDefultColumnDef } from '../../../core/lib/grid-helpers';
import { CrimeClassRequestModel, ClassObj } from '../../../crime-management-core/models/interfaces';
import { UpdateModelType, UserAction } from '../../../crime-management-core/models/enum';
import { ClassType } from '../../../core/lib/timeRecord';
import { filterClassType } from '../../../core/lib/crime-managment';

@Component({
  selector: 'dps-crime-management-content',
  templateUrl: './crime-management-content.component.html',
  styleUrls: ['./crime-management-content.component.scss']
})

export class CrimeManagementContentComponent implements OnInit {

  @Input() isLoading: boolean;
  @Input() classList: ClassObj[];
  @Input() classType: ClassType[];
  @Input() addClassModel: CrimeClassRequestModel;
  @Input() rateFileloading: boolean;

  @Output() updateAddClassModel = new EventEmitter<{ kind: UpdateModelType, value: string | number }>();
  @Output() userAction = new EventEmitter<{ kind: UserAction, classInfo?: ClassObj }>();
  @Output() rateFileUpdate = new EventEmitter();
  @Output() expandRow = new EventEmitter<ClassObj>();

  OpenRowIndex = null;


  columnDef: ColumnDef[] =
    [
      createDefultColumnDef('toggle', { label: '', fxFlex: '32px', filterAnchor: 'start', filterHidden: true, disableShort: true }),
      // createDefultColumnDef('ClassNo', { label: 'No', fxFlex: '60px', filterAnchor: 'start', filterHidden: true, disableShort: true }), // Request by osman
      createDefultColumnDef('ClassType', { label: 'Type', fxFlex: '200px', filterAnchor: 'start', filterHidden: true, disableShort: true }),
      createDefultColumnDef('ClassName', { label: 'Name', fxFlex: '', filterAnchor: 'start', filterHidden: true, disableShort: true }),
      createDefultColumnDef('FeeEarner',
        { label: 'Fee Earner', fxFlex: '80px', filterAnchor: 'start', filterHidden: true, disableShort: true }),
      createDefultColumnDef('OpenDate',
        { label: 'Open Date', fxFlex: '100px', filterAnchor: 'start', filterHidden: true, disableShort: true }),
      createDefultColumnDef('ClosedDate',
        { label: 'Closed Date', fxFlex: '100px', filterAnchor: 'end', filterHidden: true, disableShort: true }),
      createDefultColumnDef('BilledDate',
        { label: 'Billed Date', fxFlex: '100px', filterAnchor: 'end', filterHidden: true, disableShort: true }),
      createDefultColumnDef('LinkedClass',
        { label: 'Linked Class', fxFlex: '150px', filterAnchor: 'end', filterHidden: true, disableShort: true }),
      // createDefultColumnDef('Action',
      //   { label: '', fxFlex: '50px', filterAnchor: 'end', filterHidden: true, disableShort: true }),
    ];

  constructor() { }

  ngOnInit() {
  }

  onUpdateAddClassModel(data: { kind: UpdateModelType, value: string | number }) {
    this.updateAddClassModel.emit(data);
  }

  onUserAction(kind: UserAction, classInfo?: ClassObj) {
    this.userAction.emit({ kind: kind, classInfo: classInfo });
  }

  onRateFileUpdate() {
    this.rateFileUpdate.emit();
  }

  OpenRow(index: number, classObj: ClassObj) {
    if (this.OpenRowIndex === index) {
      return;
    }
    this.OpenRowIndex = index;

    if (!classObj.classTotalsViewModel || classObj.classTotalsViewModel.classTotal < 1) {
      this.expandRow.emit(classObj);
    }

  }


  get filterdClassList(): ClassObj[] {
    return filterClassType(this.classList, true);
  }

}
