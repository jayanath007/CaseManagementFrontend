import {
  getDealtBySellText,
  getEstateOverviewContactDetailsByToken,
  getEstateOverviewGridDataModelByToken,
  getEstateOverviewModelByToken,
  getExemptionAssetForDropDown,
  getformControllersArray,
  getformControllersArrayByCategory,
  getFormTypeByToken, getLegacyPercentage, getLiabilityAssetForDropDown, getMatterByToken, getModeByToken,
  getPECategoryListByToken, getPEIsDirtyByToken, getPELoadingByToken, getPESelectedCategoryByToken, getSelectedGridRowByToken
} from './../reducers/index';
import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { Injector } from '@angular/core';
import {
  DeleteProbateAccountItem,
  GridSelectRow,
  InitEstateOverview, InputValueChange, PaymentGridDataUpdate,
  RemoveContact,
  SaveEstateOverviewData,
  SetSelectedCategory, UpdateContact, UpdateMasterValue, UpdateModel
} from '../actions/core';
import { CommonControllerTypes, FormType, ItemChangeProperty, Mode } from '../models/enums';
import { ContactDetails } from '../models/interfce';
import { RefreshProbateData } from '../../probate-core/actions/core';

@Component({
  selector: 'dps-estate-overview-manager',
  template: '<ng-content></ng-content>'
})
export class EstateOverviewManagerComponent implements OnInit {

  @Input() inputData: any;
  @Input() estateOverviewToken: string;

  @Output() closePopup = new EventEmitter<any>();

  public loading$: any;
  public isDirty$: any;
  public matterData$: any;
  public formControllers$: any;
  public formControllersByCategory$: any;
  public formType$: any;
  public mode$: any;
  public dropDownCategory$: any;
  public selectedCategory$: any;
  public dataModel$: any;
  public gridDataModel$: any;
  public contactDetails$: any;
  public getSelectedRowId$: any;
  public liabilityAsset$: any;
  public exemptionAsset$: any;
  public dealtBySellText$: any;
  public legacyPercentage$: any;

  constructor(protected store: Store<any>) {
  }
  ngOnInit() {

    this.store.dispatch(new InitEstateOverview(this.estateOverviewToken, {
      inputData: {
        matterData: {
          branchId: this.inputData.matterData.branchID,
          appId: this.inputData.matterData.appId,
          fileId: this.inputData.matterData.fileID
        },
        formType: this.inputData.type,
        mode: this.inputData.mode,
        editData: this.inputData.editData
      }
    }));
    this.loading$ = this.store.select(getPELoadingByToken(this.estateOverviewToken));
    this.matterData$ = this.store.select(getMatterByToken(this.estateOverviewToken));
    this.formControllers$ = this.store.select(getformControllersArray(this.estateOverviewToken));
    this.formControllersByCategory$ = this.store.select(getformControllersArrayByCategory(this.estateOverviewToken));
    this.formType$ = this.store.select(getFormTypeByToken(this.estateOverviewToken));
    this.mode$ = this.store.select(getModeByToken(this.estateOverviewToken));
    this.dropDownCategory$ = this.store.select(getPECategoryListByToken(this.estateOverviewToken));
    this.selectedCategory$ = this.store.select(getPESelectedCategoryByToken(this.estateOverviewToken));
    this.dataModel$ = this.store.select(getEstateOverviewModelByToken(this.estateOverviewToken));
    this.gridDataModel$ = this.store.select(getEstateOverviewGridDataModelByToken(this.estateOverviewToken));
    this.contactDetails$ = this.store.select(getEstateOverviewContactDetailsByToken(this.estateOverviewToken));
    this.getSelectedRowId$ = this.store.select(getSelectedGridRowByToken(this.estateOverviewToken));
    this.isDirty$ = this.store.select(getPEIsDirtyByToken(this.estateOverviewToken));
    this.liabilityAsset$ = this.store.select(getLiabilityAssetForDropDown(this.estateOverviewToken));
    this.exemptionAsset$ = this.store.select(getExemptionAssetForDropDown(this.estateOverviewToken));
    this.dealtBySellText$ = this.store.select(getDealtBySellText(this.estateOverviewToken));
    this.legacyPercentage$ = this.store.select(getLegacyPercentage(this.estateOverviewToken));
  }
  onValueChanged(event: { controllerType: CommonControllerTypes, value, property: any }) {
    if (Object.values(ItemChangeProperty).includes(event.property)) {
      this.store.dispatch(new InputValueChange(this.estateOverviewToken,
        { type: event.controllerType, property: event.property, value: event.value }));
    } else {
      this.store.dispatch(new UpdateModel(this.estateOverviewToken,
        { type: event.controllerType, property: event.property, value: event.value }));
    }
  }
  onMasterValueChange(event: { controllerType: string, value, property: string }) {
    this.store.dispatch(new UpdateMasterValue(this.estateOverviewToken, { property: event.property, value: event.value }));
  }
  onPaymentGridUpdate(event) {
    this.store.dispatch(new PaymentGridDataUpdate(this.estateOverviewToken, event));
  }
  onSetSelectedCategoty(event) {
    this.store.dispatch(new SetSelectedCategory(this.estateOverviewToken, event));
  }
  onCloseEstateOverview(info) {
    this.closePopup.emit(info.event);
    if (info.isDirty) {
      this.store.dispatch(new RefreshProbateData('Probate'));
    }
  }
  onSaveData(info) {
    this.store.dispatch(new SaveEstateOverviewData(this.estateOverviewToken));
  }
  onUpdatedContact(contactDetails: ContactDetails) {
    this.store.dispatch(new UpdateContact(this.estateOverviewToken, { contactDetails: contactDetails }));
  }
  onRemoveContact(info) {
    this.store.dispatch(new RemoveContact(this.estateOverviewToken));
  }
  onUpdateGridData(info) {
    this.store.dispatch(new PaymentGridDataUpdate(this.estateOverviewToken, { rowData: info }));
  }

  onGridItemSelect(row) {
    this.store.dispatch(new GridSelectRow(this.estateOverviewToken, row));
  }
  onDeleteGridItem() {
    this.store.dispatch(new DeleteProbateAccountItem(this.estateOverviewToken));
  }
}
