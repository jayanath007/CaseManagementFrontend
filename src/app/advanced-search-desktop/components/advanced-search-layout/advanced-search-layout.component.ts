
import { ViewChangeKind } from './../../../advanced-search-core/models/enums';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AdvancedSearchViewModel } from './../../../advanced-search-core/models/requests';
import { Branch } from './../../../advanced-search-core/models/interfaces';
import { MatDialogRef } from '@angular/material';
import { AdvancedSearchDesktopPopupComponent } from '../../containers/advanced-search-desktop-popup.component';
import { MainMenuItemResolverService } from '../../../layout-desktop';

@Component({
  selector: 'dps-advanced-search-layout',
  templateUrl: './advanced-search-layout.component.html',
  styleUrls: ['./advanced-search-layout.component.scss']
})
export class AdvancedSearchLayoutComponent implements OnInit {

  @Input() columnDef;
  @Input() clientList: string[];
  @Input() advancedSearchViewMode: AdvancedSearchViewModel;
  @Input() isLoading: boolean;
  @Input() branchList: Branch[];
  @Input() paginatorDef: any;

  @Input() appCodeList;
  @Input() gridDataList;
  @Input() coloumnArray;
  @Input() total;



  @Output() changeAppCode = new EventEmitter<any>();
  @Output() viewChange = new EventEmitter<{ kind: ViewChangeKind, value: any }>();
  @Output() advancedSearchClick = new EventEmitter<any>();
  @Output() coloumnHeaderRightClick = new EventEmitter<any>();
  @Output() openCaseClick = new EventEmitter<any>();
  @Output() saveBranch = new EventEmitter<any>();



  constructor(public dialogRef: MatDialogRef<AdvancedSearchDesktopPopupComponent>,
    private menu: MainMenuItemResolverService) { }


  ngOnInit() {
  }

  onChangeAppCode(value) {
    this.changeAppCode.emit(value);

  }

  onClose() {
    this.dialogRef.close(event);
    this.saveBranch.emit();


  }


  onViewChange(value) {
    this.viewChange.emit(value);
  }

  onAdvancedSearchClick() {
    this.advancedSearchClick.emit();
  }

  onColoumnHeaderRightClick(event) {

    this.coloumnHeaderRightClick.emit(event);

  }

  onOpenCaseClick(event) {
    this.openCaseClick.emit(event);
    this.dialogRef.close(event);
  }

  resoleModuleName(menuId) {
    return this.menu.getModuleDisplayName(menuId);
  }


}
