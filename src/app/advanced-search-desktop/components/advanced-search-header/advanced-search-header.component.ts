import { InfoDialogType, showInforDialog } from './../../../core/utility/DpsUtility';
import { Branch } from './../../../e-chit-core/models/interfaces';
import { ViewChangeKind, SearchColumnOption } from './../../../advanced-search-core/models/enums';
import { ControllerType } from './../../../editable-control-base/models/enums';
import { SystemJsPopupLoaderService } from './../../../shell-desktop/services/system-js-popup-loader.service';
import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { AdvancedSearchViewModel } from './../../../advanced-search-core/models/requests';
import { MatDialog } from '@angular/material';





@Component({
  selector: 'dps-advanced-search-header',
  templateUrl: './advanced-search-header.component.html',
  styleUrls: ['./advanced-search-header.component.scss']
})
export class AdvancedSearchHeaderComponent implements OnInit {

  @Input() metaData: any;
  @Input() appCodeList: any;
  @Input() advancedSearchViewMode: AdvancedSearchViewModel;
  @Input() isLoading: boolean;
  @Input() matterDisplyName: string;
  @Input() clientDisplyName: string;

  @Input() clientList: string[];
  @Input() branchList: Branch[];
  @Output() valueChangedData = new EventEmitter<any>();
  @Output() changeAppCode = new EventEmitter<any>();
  @Output() upateSelectedDetails = new EventEmitter<string>();
  @Output() viewChange = new EventEmitter<{ kind: ViewChangeKind, value: any }>();
  @Output() advancedSearchClick = new EventEmitter<any>();

  constructor(private dialog: MatDialog, public popupService: SystemJsPopupLoaderService) { }
  advanced = false;
  ControllerType = ControllerType;


  ngOnInit() {
  }

  onAdvancedSearchClick() {
    this.advancedSearchClick.emit();
  }
  advancedClick(event) {
    if (event === true) {
      this.advanced = false;

    } else {

      this.advanced = true;
    }

  }

  onAdvancedSearchHelp() {
    const message = document.getElementById('AdvancedSearchHelpText').innerHTML;
    const dialog = showInforDialog('DPS Help', message,
      InfoDialogType.general, this.dialog);
    dialog.afterClosed().subscribe(() => {

    });
  }

  onAdvancedSearchTypeHelp() {
    const message = document.getElementById('AdvancedSearchTypeHelp').innerHTML;
    const dialog = showInforDialog('DPS Help', message,
      InfoDialogType.general, this.dialog);
    dialog.afterClosed().subscribe(() => {

    });

  }


  // onValueChanged(type: ControllerType, value, modelName) {
  //   this.valueChangedData.emit({ controllerType: type, value: value, model: modelName });
  // }

  // metaDataLinker(id) {
  //   if (this.metaData) {
  //     return this.findController(this.metaData[0],
  //       function (item: ScreenEditComponentTreeData) { return item.scL_Name === id; });
  //   }
  // }

  // public findController(item: ScreenEditComponentTreeData, predicate): ScreenEditComponentTreeData {
  //   if (predicate(item)) {
  //     return item;
  //   } else if (item.children != null && item.children.length > 0) {
  //     for (let i = 0; i < item.children.length; i++) {
  //       const found = this.findController(item.children[i], predicate);
  //       if (found !== null) {
  //         return found;
  //       }
  //     }
  //   }
  //   return null;
  // }

  // onClientSearchClick(value) {
  //   const clientSearchData: ClientSearchPopupData = { clientRef: value, searchText: null, branchId: null, clientName: null };
  //   this.popupService.openClientSearchPopup('clientSearchPopup', clientSearchData).subscribe((result: any) => {
  //     if (result) {
  //       this.onValueChanged(ControllerType.input, result.clientReference, 'clientRef');
  //       // this.onValueChanged(ControllerType.input, result.clientName, 'clientName');
  //       // this.onValueChanged(ControllerType.cmb, result.branchID, 'branchID');
  //       // this.onFeeEarnerValueChanged(ControllerType.cmb, result.feeEarner, 'matterFeeEarner');
  //       return '';
  //     }
  //   });
  // }

  onChangeDetails(value) {
    this.upateSelectedDetails.emit(value);
  }


  onChangeAppCode(event) {

    this.changeAppCode.emit(event.value);

  }

  findAllClick() {

    this.viewChange.emit({ kind: ViewChangeKind.FindAllClick, value: null });

  }

  speedSearchCLick() {

    this.viewChange.emit({ kind: ViewChangeKind.SpeedSearchClick, value: null });
  }

  onChangeClient(value) {
    if (this.advancedSearchViewMode && value !== this.advancedSearchViewMode.searchClients) {
      this.viewChange.emit({ kind: ViewChangeKind.SearchClient, value: value });
    }
  }

  onChangeMatter(event) {



    this.viewChange.emit({ kind: ViewChangeKind.SearchMatter, value: event.value });

  }

  onIsMatterClosed(event) {

    this.viewChange.emit({ kind: ViewChangeKind.IsMatterClosed, value: event.checked });

  }

  onChangeBranch(event) {

    this.viewChange.emit({ kind: ViewChangeKind.ChangeBranch, value: event.value });

  }

}
