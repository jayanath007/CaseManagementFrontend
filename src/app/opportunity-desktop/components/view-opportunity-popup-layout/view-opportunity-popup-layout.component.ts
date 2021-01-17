import {
  DropdownList, FeeEarnerList, OpportunitySaveViewModel,
  Introducer, StatusList, OppertunityHistory, OpportunityLoadingType, ClientSearchResultViewModel
} from './../../../opportunity-core/models/interfaces';
import { Component, Input, EventEmitter, Output, OnChanges, SimpleChanges } from '@angular/core';
import { ColumnDef } from '../../../core/lib/grid-model';
import { ClientPopupType } from './../../../client-search-core/models/enums';
import { SystemJsPopupLoaderService } from '../../../shell-desktop';
import { MatDialog } from '@angular/material';
import { InforDialogData, InforDialogComponent } from '../../../shared';
import { InputNameList } from './../../../opportunity-core/models/enums';
import { SettingKey } from '../../../core/lib/app-settings';
import { AccessControlService } from '../../../auth/services/access-control.service';
import { MasterDataViewModel, DropdownListItem, MatterCategoryWithhAppInfo } from '../../../shared-data/model/interface';
import { ShareDataService } from '../../../shared-data/services/share-data.service';
import { LookupList } from '../../../core';

@Component({
  selector: 'dps-view-opportunity-popup-layout',
  templateUrl: './view-opportunity-popup-layout.component.html',
  styleUrls: ['./view-opportunity-popup-layout.component.scss']
})
export class ViewOpportunityPopupLayoutComponent implements OnChanges {

  constructor(public popupService: SystemJsPopupLoaderService, private dialog: MatDialog, private access: AccessControlService) { }

  @Input() isLoading: OpportunityLoadingType;
  @Input() departmentList: MasterDataViewModel<DropdownListItem[]>;
  @Input() feeEarnerList: FeeEarnerList[];
  @Input() workTypeList: DropdownList[];
  @Input() introducerList: Introducer[];
  @Input() gridItem: OpportunitySaveViewModel;
  @Input() statusList: StatusList[];
  @Input() closePopup: number;
  @Input() historyColumDef: ColumnDef[];
  @Input() historyData: { isLoading: boolean, data: OppertunityHistory[] };
  @Input() salTitle: LookupList[];

  @Output() popupClosed = new EventEmitter<string>();
  @Output() conflictRun = new EventEmitter<OpportunitySaveViewModel>();
  @Output() qouteRun = new EventEmitter<{ data: OpportunitySaveViewModel, isEdit: boolean }>();
  @Output() createCaseFile = new EventEmitter<OpportunitySaveViewModel>();
  @Output() closeOpportunitty = new EventEmitter<OpportunitySaveViewModel>();
  @Output() openLogFile = new EventEmitter<OppertunityHistory>();
  @Output() openClientSearch = new EventEmitter();
  @Output() openMatter = new EventEmitter<OpportunitySaveViewModel>();
  @Output() saveEditOpertunity = new EventEmitter<OpportunitySaveViewModel>();
  // @Output() changeDepartment = new EventEmitter<number>();
  editItem: OpportunitySaveViewModel;
  settingKey = SettingKey;
  enableSaveBtn = false;

  get selectedStatus() {
    if (this.statusList) {
      return this.statusList.find((status) => status.isSelected);
    }
    return this.statusList[0];
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes.closePopup && !changes.closePopup.isFirstChange() && changes.closePopup.currentValue > 0) {
      setTimeout(() => {
        this.popupClosed.emit('close');
      }, 100);
    }
  }
  onClose() {
    this.popupClosed.emit('close');
  }
  onCloseOpportunitty(item: OpportunitySaveViewModel) {
    this.closeOpportunitty.emit(item);
  }
  onConflictRun(item: OpportunitySaveViewModel) {
    this.conflictRun.emit(item);
  }
  onQouteRun(info: { data: OpportunitySaveViewModel, isEdit: boolean }) {
    if (info.data && !info.data.appCode && !info.data.departmentId) {
      this.showMessage('Quote Run', 'Please enter department');
    } else if (info.data && !info.data.appCode && !info.data.workTypeId) {
      this.showMessage('Quote Run', 'Please enter work type');
    } else {
      this.qouteRun.emit(info);
    }

  }
  onCreateCaseFile(item: OpportunitySaveViewModel) {
    this.createCaseFile.emit(item);
  }
  onOpenLogFile(data: OppertunityHistory) {
    this.openLogFile.emit(data);
  }
  onOpenMatter() {
    this.openMatter.emit(this.gridItem);
  }
  onClientSearch(event: { lName: string, fName: string, company: string }) {
    let clientSearchData;

    clientSearchData = {
      popupType: ClientPopupType.OpportunityClientSearch,
      popupPara: {
        lastName: event.lName,
        firstName: event.fName,
        companyName: event.company,
        isOpportunityEdit: true
      }
    };

    if (clientSearchData.popupPara.lastName || clientSearchData.popupPara.firstName || clientSearchData.popupPara.companyName) {
      this.popupService.openClientSearchPopup('clientCreationOpportunity', clientSearchData).
        subscribe((result: ClientSearchResultViewModel) => {
          if (result) {
            this.enableSaveBtn = true;
            this.editItem = !!this.editItem ? this.editItem : this.gridItem;
            this.editItem = {
              ...this.editItem,
              clientRef: result ? result.salesAccountRef : '',
              lastName: result ? result.lastName : '',
              firstName: result ? result.firstName : '',
              companyName: result ? result.companyName : '',
              houseNumber: result.houseNo ? result.houseNo : '',
              address1: result ? result.address1 : '',
              address2: result ? result.address2 : '',
              town: result ? result.town : '',
              country: result ? result.country : '',
              postCode: result ? result.postCode : '',
              email1: result ? result.email1 : '',
              email2: result.email2 ? result.email2 : '',
              introducer: result ? result.salesIntroductionId : '',
              contactId: result ? result.salesContactId : null,
              title: result ? result.title : null,
            };
          }
        });
    } else {
      this.showMessage('Search Client', 'You must enter client First Name or Last Name or Company Name');
    }
  }
  showMessage(msgHeading, msgText) {
    const dialogData: InforDialogData = {
      content: {
        title: msgHeading,
        message: msgText
      },
      data: { messageType: 'alert' }
    };
    this.dialog.open(InforDialogComponent, {
      data: dialogData,
      width: '400px',
      disableClose: true,
      hasBackdrop: true,
      panelClass: 'dps-notification'
    });
  }

  onSaveEditOpertunity() {
    if (this.editItem) {
      this.enableSaveBtn = false;
      if (!this.editItem.departmentId) {
        this.showMessage('Opportunity', 'Please enter department.');
      } else if (!this.editItem.workTypeId) {
        this.showMessage('Opportunity', 'Please enter work type.');
      } else {
        this.saveEditOpertunity.emit(this.editItem);
      }

    }
  }

  onChangeDepartment(id: number) {
    this.enableSaveBtn = true;
    this.editItem = !!this.editItem ? this.editItem : this.gridItem;
    this.editItem = {
      ...this.editItem,
      departmentId: id
    };
    // this.changeDepartment.emit(department.key);
  }

  changeWorkType(type: MatterCategoryWithhAppInfo) {
    this.enableSaveBtn = true;
    this.editItem = !!this.editItem ? this.editItem : this.gridItem;
    this.editItem = {
      ...this.editItem,
      workTypeId: type.matCategoryId,
      workType: type.matCategoryDescription
    };
  }

  changeFeeEarner(feeEarner: DropdownList) {
    this.enableSaveBtn = true;
    this.editItem = !!this.editItem ? this.editItem : this.gridItem;
    this.editItem = {
      ...this.editItem,
      feeEarner: feeEarner.key.toString()
    };
  }

  onIntroducerChange(item: Introducer) {
    if (item) {
      this.enableSaveBtn = true;
      this.editItem = !!this.editItem ? this.editItem : this.gridItem;
      this.editItem = {
        ...this.editItem,
        introducer: item.luP_ID,
        introducerDescription: item.luP_Description
      };
    }

  }

  onChangeInput(event: { kind: InputNameList, value: any }) {
    switch (event.kind) {
      case InputNameList.FirstName:
        {
          this.enableSaveBtn = true;
          this.editItem = !!this.editItem ? this.editItem : this.gridItem;
          this.editItem = {
            ...this.editItem,
            firstName: event.value
          };
          break;
        }
      case InputNameList.LastName:
        {
          this.enableSaveBtn = true;
          this.editItem = !!this.editItem ? this.editItem : this.gridItem;
          this.editItem = {
            ...this.editItem,
            lastName: event.value
          };
          break;
        }
      case InputNameList.MatterDetails1:
        {
          this.enableSaveBtn = true;
          this.editItem = !!this.editItem ? this.editItem : this.gridItem;
          this.editItem = {
            ...this.editItem,
            matterDetails1: event.value
          };
          break;
        }
      case InputNameList.MatterDetails2:
        {
          this.enableSaveBtn = true;
          this.editItem = !!this.editItem ? this.editItem : this.gridItem;
          this.editItem = {
            ...this.editItem,
            matterDetails2: event.value
          };
          break;
        }
      case InputNameList.Note:
        {
          this.enableSaveBtn = true;
          this.editItem = !!this.editItem ? this.editItem : this.gridItem;
          this.editItem = {
            ...this.editItem,
            note: event.value
          };
          break;
        }
      case InputNameList.HouseNo:
        {
          this.enableSaveBtn = true;
          this.editItem = !!this.editItem ? this.editItem : this.gridItem;
          this.editItem = {
            ...this.editItem,
            houseNumber: event.value
          };
          break;
        }
      case InputNameList.Address1:
        {
          this.enableSaveBtn = true;
          this.editItem = !!this.editItem ? this.editItem : this.gridItem;
          this.editItem = {
            ...this.editItem,
            address1: event.value
          };
          break;
        }
      case InputNameList.Address2:
        {
          this.enableSaveBtn = true;
          this.editItem = !!this.editItem ? this.editItem : this.gridItem;
          this.editItem = {
            ...this.editItem,
            address2: event.value
          };
          break;
        }
      case InputNameList.Town:
        {
          this.enableSaveBtn = true;
          this.editItem = !!this.editItem ? this.editItem : this.gridItem;
          this.editItem = {
            ...this.editItem,
            town: event.value
          };
          break;
        }
      case InputNameList.County:
        {
          this.enableSaveBtn = true;
          this.editItem = !!this.editItem ? this.editItem : this.gridItem;
          this.editItem = {
            ...this.editItem,
            country: event.value
          };
          break;
        }
      case InputNameList.PostCode:
        {
          this.enableSaveBtn = true;
          this.editItem = !!this.editItem ? this.editItem : this.gridItem;
          this.editItem = {
            ...this.editItem,
            postCode: event.value
          };
          break;
        }
      case InputNameList.Title:
        {
          this.enableSaveBtn = true;
          this.editItem = !!this.editItem ? this.editItem : this.gridItem;
          this.editItem = {
            ...this.editItem,
            title: event.value
          };
          break;
        }


      case InputNameList.Mobileno:
        {
          this.enableSaveBtn = true;
          this.editItem = !!this.editItem ? this.editItem : this.gridItem;
          this.editItem = {
            ...this.editItem,
            mobileNo: event.value
          };
          break;
        }
      case InputNameList.WorkTelNo:
        {
          this.enableSaveBtn = true;
          this.editItem = !!this.editItem ? this.editItem : this.gridItem;
          this.editItem = {
            ...this.editItem,
            workTelNo: event.value
          };
          break;
        }
      case InputNameList.Email1:
        {
          this.enableSaveBtn = true;
          this.editItem = !!this.editItem ? this.editItem : this.gridItem;
          this.editItem = {
            ...this.editItem,
            email1: event.value
          };
          break;
        }
      case InputNameList.Email2:
        {
          this.enableSaveBtn = true;
          this.editItem = !!this.editItem ? this.editItem : this.gridItem;
          this.editItem = {
            ...this.editItem,
            email2: event.value
          };
          break;
        }
      default:
        break;
    }
  }


  getSettingValue(key: SettingKey) {
    return this.access.getSettingValue(key);
  }

  get filterDepartmentList(): MasterDataViewModel<DropdownListItem[]> {
    if (!!this.departmentList && this.departmentList.data.length > 0 && !!this.gridItem && this.gridItem.appCode) {
      const tempList = this.departmentList.data.filter(i => i.description1 === this.gridItem.appCode);
      if (tempList && tempList.length > 0) {
        return { isLoading: this.departmentList.isLoading, data: tempList };
      }
    }

    return this.departmentList;
  }

}
