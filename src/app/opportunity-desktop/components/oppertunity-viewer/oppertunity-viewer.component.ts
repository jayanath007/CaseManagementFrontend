import { InputNameList, SaveButtonType, OpportunityType } from './../../../opportunity-core/models/enums';
import { Address } from './../../../shared/models/interface';
import {
  DropdownList, FeeEarnerList, Introducer, OpportunitySaveViewModel,
  StatusList, OpportunityLoadingType,
} from './../../../opportunity-core/models/interfaces';
import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { MasterDataViewModel, DropdownListItem, DepartmentWithMatterAndAppCode, MatterCategoryWithhAppInfo } from '../../../shared-data/model/interface';
import { LookupList } from '../../../core';
import { of } from 'rxjs';

@Component({
  selector: 'dps-oppertunity-viewer',
  templateUrl: './oppertunity-viewer.component.html',
  styleUrls: ['./oppertunity-viewer.component.scss']
})
export class OppertunityViewerComponent implements OnChanges {

  constructor() { }

  @Input() isNew: boolean;
  @Input() isLoading: OpportunityLoadingType;
  @Input() disbleBTN?: boolean;
  @Input() departmentList: MasterDataViewModel<DepartmentWithMatterAndAppCode[]>;
  @Input() feeEarnerList: FeeEarnerList[];
  // @Input() workTypeList: MasterDataViewModel<DropdownListItem[]>;
  @Input() introducerList: Introducer[];
  @Input() clientDataModel: OpportunitySaveViewModel;
  @Input() selectedStatus: StatusList;
  @Input() defuiltNote?: string;
  @Input() salTitle: LookupList[];
  // @Input() screenList: ScreenItem[];

  @Output() departmetChangeItem = new EventEmitter<number>();
  @Output() feeEarnerChangeItem = new EventEmitter<any>();
  @Output() introducerChangeItem = new EventEmitter<any>();
  @Output() workTypeChangeItem = new EventEmitter<MatterCategoryWithhAppInfo>();
  @Output() selectedClientSearchData = new EventEmitter<{ lName: string, fName: string, company: string }>();
  @Output() inputChangeData = new EventEmitter<any>();
  @Output() clearOpportunityData = new EventEmitter<any>();
  @Output() sendAndSaveData = new EventEmitter<any>();
  @Output() sendAndQuote = new EventEmitter<any>();
  @Output() conflictRun = new EventEmitter<OpportunitySaveViewModel>();
  @Output() qouteRun = new EventEmitter<{ data: OpportunitySaveViewModel, isEdit?: boolean }>();
  @Output() closeOpportunitty = new EventEmitter<OpportunitySaveViewModel>();
  @Output() createCaseFile = new EventEmitter<OpportunitySaveViewModel>();
  options: string[];
  InputNameList = InputNameList;
  saveButtonType = SaveButtonType;
  screenFilterText = '';
  // enableWorkTypeDropDownInEdit = false;
  oType = OpportunityType;

  ngOnChanges(changes: SimpleChanges) {
    if (changes.introducerList && changes.introducerList.currentValue && changes.introducerList.currentValue.length > 0) {
      this.options = [];
      this.introducerList.forEach(i => {
        if (i.luP_Code) {
          this.options.push(i.luP_Code);
        }
      });
    }
  }

  get filterDepartmentList(): DepartmentWithMatterAndAppCode[] {
    if (this && this.departmentList && this.departmentList.data && this.departmentList.data.length > 0) {
      const depListWithAppIds = this.departmentList.data.filter(i => i.deptAppId);
      let depList = depListWithAppIds;
      if (this.clientDataModel && this.clientDataModel.appCode && !this.isNew) {
        depList = depList.filter(i => {
          if (i && i.matCategoryWithAppInfo
            && i.matCategoryWithAppInfo.find(item => item.matCategoryAppCode === this.clientDataModel.appCode)) {
            return true;
          } else {
            return false;
          }
        });
      }
      return depList && depList.length > 0 ? depList : depListWithAppIds;
    }
    return [];
  }

  get selectedDepartment(): DepartmentWithMatterAndAppCode {
    if (this.filterDepartmentList && this.filterDepartmentList && this.filterDepartmentList.length > 0) {
      return this.filterDepartmentList.find((department) => department.departmentId === this.clientDataModel.departmentId);
    }
    return null;
  }
  get selectedWorkType(): MatterCategoryWithhAppInfo {
    if (this.selectedDepartment && this.selectedDepartment.matCategoryWithAppInfo
      && this.selectedDepartment.matCategoryWithAppInfo.length > 0) {
      return this.selectedDepartment.matCategoryWithAppInfo.find((worktype) => worktype.matCategoryId === this.clientDataModel.workTypeId);
    }
    return null;
  }

  get selectedIntroducer() {
    if (this.introducerList) {
      if (this.clientDataModel.introducer === -1) {
        return { luP_ID: -1, luP_Description: this.clientDataModel.introducerDescription, luP_Code: this.clientDataModel.introducerDescription };
      }
      return this.introducerList.find((introducer) => introducer.luP_ID === this.clientDataModel.introducer);
    }
    return null;
  }
  get selectedFeeEarner() {
    if (this.feeEarnerList) {
      return this.feeEarnerList.find((introducer) => introducer.key === this.clientDataModel.feeEarner);
    }
    return this.feeEarnerList;
  }
  onChangeFeeEarner(item) {
    this.feeEarnerChangeItem.emit(item.value ? item.value : null);
  }
  onChangeIntroducer(value) {
    const item = this.introducerList && this.introducerList.length ? this.introducerList.find(i => i.luP_Code === value) : null;
    if (item) {
      this.introducerChangeItem.emit(item);
    } else {
      this.introducerChangeItem.emit({ luP_ID: -1, luP_Description: value, luP_Code: value });
    }
  }
  onChangeDepartmen(item: DepartmentWithMatterAndAppCode) {
    this.departmetChangeItem.emit(item.departmentId);
  }
  onChangeWorkType(item: MatterCategoryWithhAppInfo) {
    this.workTypeChangeItem.emit(item);
  }
  setStep() { }

  onInputChangeData(inputName, value) {
    if (this.isNew && inputName === InputNameList.Note && value === this.defuiltNote) {
      return;
    }
    this.inputChangeData.emit({ kind: inputName, value: value });
  }
  autofillAddress(newAddress: Address) {
    setTimeout(() => {
      this.inputChangeData.emit({ kind: InputNameList.Address1, value: newAddress.address1 });
      this.inputChangeData.emit({ kind: InputNameList.Address2, value: newAddress.address2 });
      this.inputChangeData.emit({ kind: InputNameList.Town, value: newAddress.town });
      this.inputChangeData.emit({ kind: InputNameList.County, value: newAddress.country });
      this.inputChangeData.emit({ kind: InputNameList.PostCode, value: newAddress.postCode });
    }, 100);
  }
  onClientSearch(lastName, firstName, companyName) {
    this.selectedClientSearchData.emit({ lName: lastName, fName: firstName, company: companyName });
  }
  onClearInputData() {
    this.clearOpportunityData.emit();
  }
  onSaveAndSend() {
    this.sendAndSaveData.emit();
  }
  onSaveAndQuote() {
    this.sendAndQuote.emit();
  }
  onRunQuote() {
    const info = { data: this.clientDataModel, isEdit: false };
    if (this.clientDataModel && this.clientDataModel.quoteCount > 0 || !!this.clientDataModel.propertyQuoteData) {
      info.isEdit = true;
    }
    this.qouteRun.emit(info);
  }
  onRunConflict() {
    this.conflictRun.emit(this.clientDataModel);
  }
  onCloseOpertunity() {
    this.closeOpportunitty.emit(this.clientDataModel);
  }
  onCreateCaseFile() {
    this.createCaseFile.emit(this.clientDataModel);
  }
  get getMatterCategory(): MatterCategoryWithhAppInfo[] {
    if (this.clientDataModel && this.clientDataModel.appCode && !this.isNew && this.filterDepartmentList && !this.selectedDepartment) {
      const tempList: MatterCategoryWithhAppInfo[] = [];
      this.filterDepartmentList.forEach(i => {
        if (i.matCategoryWithAppInfo) {
          i.matCategoryWithAppInfo.forEach(item => {
            if (item.matCategoryAppCode === this.clientDataModel.appCode) {
              tempList.push(item);
            }
          });
        }
      });
      return tempList;
    }
    return this.selectedDepartment ? this.selectedDepartment.matCategoryWithAppInfo : [];
  }
}
