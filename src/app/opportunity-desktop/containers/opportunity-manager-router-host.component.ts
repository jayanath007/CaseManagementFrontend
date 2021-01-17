import { Component, OnInit } from '@angular/core';
import { SystemJsPopupLoaderService } from './../../shell-desktop/services/system-js-popup-loader.service';
import { OpportunityGridDataViewModel, OpportunitySaveViewModel } from './../../opportunity-core/models/interfaces';
import { DatePipe } from '@angular/common';
import { dpsNewDate } from '../../utils/javascriptDate';
const datePipe = new DatePipe('en-US');

@Component({
  selector: 'dps-opportunity-manager-router-host.component',
  template: `<dps-opportunity-manager #manager [opportunityToken]="'dpsOpportunityToken'">
                  <dps-opportunity-layout
                      (openOpprtunity)="onOpenOpprtunity($event)"
                      [user]="manager.user$ | async"
                      [columnDef]="manager.gridColoum$ | async"
                      [loadSaveOpportunityData]= "manager.loadOpportunityGridData$ | async"
                      [isLoading]="manager.isLoading$ | async"
                      [departmentList]="manager.departmentList$ | async"
                      [feeEarnerList]="manager.feeEarnerList$ | async"
                      [introducerList]="manager.introducerList$ | async"
                      [statusList]="manager.statusList$ | async"
                      [clientDataModel]="manager.clientDataModel$ | async"
                      [selectedTabIndex]="manager.selectedTabIndex$ | async"
                      [paginetorDef]="manager.paginetorDef$|async"
                      [stats]="manager.stats$|async"
                      [emailTemplete]="manager.emailTemplete$ | async"
                      [previousEmailTemplete]="manager.previousEmailTemplete$|async"
                      [defuiltNote]="manager.defuiltNote$|async"
                      [settingIsLoading]="manager.settingIsLoading$ | async"
                      [salTitle]="manager.salTitle$|async"
                      (departmetChangeItem)="manager.onChangeDepartment($event)"
                      (feeEarnerChangeItem)="manager.onChangeFeeEarner($event)"
                      (introducerChangeItem)="manager.onChangeIntroducer($event)"
                      (workTypeChangeItem)="manager.onChangeWorkType($event)"
                      (statusChangeItem)="manager.onChangeStatusList($event)"
                      (refreshData)="manager.onRefreshData()"
                      (inputChangeData)="manager.onInputChangeData($event)"
                      (updateSelectedClientData)="manager.onClientSearch($event)"
                      (changeSelectedTab)="manager.onChangeSelectedTab($event)"
                      (clearOpportunityData)="manager.onClearInputData()"
                      (sendAndSaveData)="manager.onSendAndSaveData()"
                      (sendAndQuote)="manager.onSendAndQuote()"
                      (changePage)="manager.onChangePage($event)"
                      (columsSortApply)="manager.onToggleSorting($event)"
                      (selectedRowItem)="manager.onRowSelect($event)"
                      (saveScreenList)="manager.onSaveScreenList()"
                      (uploadEmailTemplete)="manager.onUploadEmailTemplete($event)"
                      (openSettingPanel)="manager.onOpenSettingPanel()"
                      (sendNotification)="manager.onSendNotification($event)"
                      (changeColumFilteration)="manager.onChangeColumFilteration($event)"
                      >
                  </dps-opportunity-layout>
            </dps-opportunity-manager>`
})
export class OpportunityManagerRouterHostComponent implements OnInit {

  constructor(private popupService: SystemJsPopupLoaderService) { }

  ngOnInit() {
  }
  onOpenOpprtunity({ item, dateTimeOffset }: { item: OpportunityGridDataViewModel, dateTimeOffset: number }) {
    // const saveView: OpportunitySaveViewModel = {
    //   clientRef: item.clientRef,
    //   lastName: item.lastName,
    //   firstName: item.firstName,
    //   companyName: item.companyName,
    //   houseNumber: '',
    //   address1: item.address1,
    //   address2: item.address2,
    //   town: item.town,
    //   country: item.country,
    //   postCode: item.postCode,
    //   email1: item.email1,
    //   email2: item.email2,
    //   introducer: item.introducer,
    //   departmentId: item.departmentId,
    //   workTypeId: item.workTypeId,
    //   feeEarner: item.feeEarner,
    //   note: item.notes,
    //   enquiryId: item.enquiryId,
    //   clientName: item.clientName,
    //   workType: item.workType,
    //   matterRef: item.matterRef,
    //   introducerDescription: '',
    //   enquiryDateOn: item.enquiryDateOn ? datePipe.transform(item.enquiryDateOn, 'dd/MM/yyyy') :
    //     datePipe.transform(dpsNewDate(dateTimeOffset), 'dd/MM/yyyy'),
    //   conflictCount: item.conflictCount,
    //   quoteCount: item.quoteCount,
    //   appCode: item.appCode,
    //   enquiryInfo: item.enquiryInfo
    // };
    this.popupService.opportunityViewPopup('opportunityViewPopup', { oppertunityId: item.enquiryId }).subscribe((data) => {

    });

  }

}
