import { MainMenuItem } from './../../../layout-desktop/models/interfaces';
import { Component, OnInit, Input, Output, ChangeDetectionStrategy, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { MatterGridRowRapper, ClientGridRowRapper } from '../../../client-search-core/models/interfaces';
import { SystemJsPopupLoaderService } from '../../../shell-desktop';
import { User, GeneralData } from '../../../auth';
import { ClientMenu } from './../../../client-search-core/models/enums';
import { uuid } from './../../../utils/uuid';
import { MainMenuItemResolverService } from '../../../layout-desktop';
import { PaginatorDef } from '../../../core/lib/grid-model';

@Component({
  selector: 'dps-client-search-layout',
  templateUrl: './client-search-layout.component.html',
  styleUrls: ['./client-search-layout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ClientSearchLayoutComponent implements OnInit, OnChanges {


  constructor(private popupService: SystemJsPopupLoaderService, private menu: MainMenuItemResolverService) { }

  @Input() clientColumnDef;
  @Input() matterColumnDef;
  @Input() clientSearchGridData;
  @Input() clientPaginatorDef;
  @Input() searchText;
  @Input() totalItems;
  @Input() gridLoading: boolean;
  @Input() user: User;
  @Input() showSearchHint: boolean;
  @Input() menuItem: MainMenuItem<any>[];
  @Input() isPlotUser: boolean;

  @Output() clickClientMenu = new EventEmitter<ClientMenu>();
  @Output() SearchTextChange = new EventEmitter();
  @Output() SearchTextClear = new EventEmitter();
  @Output() SearchTextClick = new EventEmitter();
  // @Output() rowSelect = new EventEmitter();
  @Output() toggleClientSearchExpand = new EventEmitter();
  @Output() toggleMatterExpand = new EventEmitter();
  @Output() onUpdateOpenCaseClick = new EventEmitter<MatterGridRowRapper>();
  @Output() onUpdateTimeRecordingClick = new EventEmitter<MatterGridRowRapper>();
  @Output() onUpdateNewMailClick = new EventEmitter<MatterGridRowRapper>();
  @Output() refresh = new EventEmitter();
  @Output() onUpdateLedgerCardClick = new EventEmitter<MatterGridRowRapper>();
  @Output() openEchitPopup = new EventEmitter<{ matterData: MatterGridRowRapper, clientData: ClientGridRowRapper }>();
  @Output() matterGridPageChange = new EventEmitter<{ clientRef: string, pageDef: PaginatorDef }>();

  public allUserInfo: GeneralData;

  // MatterViews = MatterViews;
  fontSizeClass: string;
  // isMemberNavExpan = false;


  ngOnInit() {

  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.user && changes.user.isFirstChange() && !!this.user) {
      this.allUserInfo = this.user.general;
    }
  }


  ontoggleClientGridExpand(event) {
    this.toggleClientSearchExpand.emit(event);
  }

  ontoggleMatterGridExpand(event) {
    this.toggleMatterExpand.emit(event);
  }

  public onOpenCaseClick(selectedMatter: MatterGridRowRapper) {
    this.onUpdateOpenCaseClick.emit(selectedMatter);
  }
  public onTimeRecordingClick(selectedMatter: MatterGridRowRapper) {
    this.onUpdateTimeRecordingClick.emit(selectedMatter);
  }

  public onNewMailClick(selectedMatter: MatterGridRowRapper) {

    this.onUpdateNewMailClick.emit(selectedMatter);
  }

  public onLedgerCardClick(selectedMatter: MatterGridRowRapper) {
    this.onUpdateLedgerCardClick.emit(selectedMatter);
  }
  onUpdateMatterCreationClick(selectedMatterData: MatterGridRowRapper) {
    this.popupService.openMatterCreationPopup(uuid(), { matterId: selectedMatterData.data.matterCounter });
  }

  onOpenEchitPopup(matterData: { matterData: MatterGridRowRapper, clientData: ClientGridRowRapper }) {
    this.openEchitPopup.emit(matterData);
  }

  onSearchTextChanged(value) {
    this.SearchTextChange.emit(value);
  }

  onSearchTextClick(value) {
    this.SearchTextClick.emit(value);
  }

  onSearchTextClear(value) {
    this.SearchTextClear.emit(value);
  }

  onFontSizeClassChange(value) {
    this.fontSizeClass = value;
  }

  onRefresh() {
    this.refresh.emit();
  }

  onClickClientMenu(kind: ClientMenu) {
    this.clickClientMenu.emit(kind);
  }

  get clientCreationTitle(): string {
    return this.menuItem.find(i => i.id === 'client_creation').label;
  }

  resoleModuleName(menuId) {
    return this.menu.getModuleDisplayName(menuId);
  }

  onMatterGridPageChange(data: { clientRef: string, pageDef: PaginatorDef }) {
    this.matterGridPageChange.emit(data);
  }

}
