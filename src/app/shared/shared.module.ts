import { TimeInputComponent } from './components/time-input/time-input.component';
import { EditableDropdownComponent } from './components/editable-dropdown/editable-dropdown.component';
import { FailDialogComponent } from './components/fail-dialog/fail-dialog.component';
import { WorkflowMenuFilterPipe } from './pipes/workFlow-menu-filter.pipe';
import { WorkflowMenuIconPipe } from './pipes/workflow-menu-icon.pipe';
import { DpsLoginUserImagePipe } from './pipes/dps-login-user-image.pipe';
import { IsMobileDirective } from './directives/is-mobile.directive';
import { NgModule } from '@angular/core';
import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DpsDatePipe } from './pipes/dps-date.pipe';
import { DroppableDirective } from './directives/droppable.directive';
import { DraggableDirective } from './directives/draggable.directive';
import { TeamMemberListComponent } from '../team-member-desktop/team-member-list/team-member-list.component';
import { TeamMemberManagerComponent } from '../team-member-desktop/containers/team-member-manager.component';
import { CurrencySymbolsPipe } from './pipes/currency-symbols.pipe';
import { RecipientColorCodePipe } from './pipes/recipient-color-code.pipe';
import { LookupsComponent } from './components/lookups/lookups.component';
import { NumbersOnlyWithDecimalsDirective } from './directives/numbers-only-with-decimals.directive';
import { NumberOnlyDirective } from './directives/number-only.directive';

import {
  MatDialogModule,
  MatButtonModule,
  MatMenuModule,
  MatSelectModule,
  MatOptionModule,
  MatIconModule,
  MatCardModule,
  MatInputModule,
  MatListModule,
  MatProgressBarModule,
  MatExpansionModule,
  MatTooltipModule,
  MAT_DATE_LOCALE,
  MatProgressSpinnerModule,
  MatToolbarModule,
  MatAutocompleteModule,
  MatRippleModule,
  MatSliderModule,
  MatCheckboxModule,
} from '@angular/material';

import { NameInitialsPipe } from './pipes/name-initials.pipe';
import { AttachmentsSizePipe } from './pipes/attachments-size.pipe';
import { AttachmentIconPipe } from './pipes/attachment-icon.pipe';
import { OverlayRouterOutletComponent } from './components/overlay-router-outlet/overlay-router-outlet.component';
import { DummyRouterOutletComponent } from './components/dummy-router-outlet.component';
import { StrTemplatePipe } from './pipes/str-template.pipe';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { StrDefaultPipe } from './pipes/str-default.pipe';
import { OverlayContainerComponent } from './components/overlay-container/overlay-container.component';
import { ValidateEmailPipe } from './pipes/validate-email.pipe';
import { InforDialogComponent } from './components/infor-dialog/infor-dialog.component';
import { UserProfileDetailComponent } from './components/user-profile-detail/user-profile-detail.component';
import { FileUploaderComponent } from './components/file-uploader.component';
import { SearchTextHighlighPipe } from './pipes/search-text-highligh.pipe';
import { MessageDialogComponent } from './components/msg-dialog/msg-dialog.component';
import { TimezonePipe } from './pipes/timezone.pipe';
import { TeamMemberMinListComponent } from '../team-member-desktop/team-member-min-list/team-member-min-list.component';
import { DpsUserImagePipe } from './pipes/dps-user-image.pipe';
import { TeamMemberItemComponent } from '../team-member-desktop/team-member-item/team-member-item.component';
import { SafeHtmlPipe } from './pipes/safe-html.pipe';
import { KeyValuesPipe } from './pipes/key-values.pipe';
import { FileDroppableDirective } from './directives/fileDroppable.directive';
import { ConfirmDialogComponentWithCancel } from './components/confirm-dialog-with-cancel/confirm-dialog-with-cancel.component';
import { VirtualScrollComponent } from './components/virtual-scroll.component';
import { GridFontControllerComponent } from './components/grid-font-controller/grid-font-controller.component';
import { PasswordInsertComponent } from './components/password-insert-dialog/password-insert.component';
import { OptionDialogComponent } from './components/option-dialog/option-dialog.component';
import { PasswordConfirmDialoagComponent } from './components/password-confirm-dialog/password-confirm-dialog.component';
import { WorkflowShortCutKeyPipe } from './pipes/workflow-shortcut-key.pipe';
import { TimeOnlyDirective } from './directives/time-only.directive';
import { BarChartComponent } from './components/bar-chart/bar-chart.component';
import { ChartsModule } from 'ng2-charts';
import { PieChartComponent } from './components/pie-chart/pie-chart.component';
import { DpsClickDirective } from './directives/dpsClick.directive';
import { OverlayModule } from '@angular/cdk/overlay';
import { PortalModule } from '@angular/cdk/portal';
import { MatFormFieldModule } from '@angular/material/form-field';
import { TextInsertDialogComponent } from './components/text-insert-dialog/text-insert-dialog.component';
import { IsDpsMailPipe } from './pipes/is-dps-mail.pipe';
import { QaAtmDirective } from './directives/qa-atm.directive';
import { AddressFinderComponent } from './components/address-finder/address-finder.component';
import { AgmCoreModule } from '@agm/core';
import { GroupIconByModePipe } from './pipes/group-icon-by-mode.pipe';
import { PermissionLevelPipe } from './pipes/permission-level.pipe';
import { AddressFinderDirective } from './directives/address-finder.directive';
import { AttachmentUploadMenuComponent } from './components/attachment-upload-menu/attachment-upload-menu.component';
import { EpmtyWidgetItemComponent } from './components/epmty-widget-item/epmty-widget-item.component';
import { ModuleLayoutComponent } from './components/module-layout/module-layout.component';
import { CommonOverlayLayoutComponent } from './components/common-overlay-layout/common-overlay-layout.component';
import { CommonOverlayTriggerForDirective } from './directives/common-overlay-trigger-for.directive';
import { CommonPopupHeaderComponent } from './components/common-popup-header/common-popup-header.component';
import { CommonGridTableComponent } from './components/common-grid-table/common-grid-table.component';
import { SelectInputWithTableComponent } from './components/select-input-with-table/select-input-with-table.component';
import { PlainTexttoHTML } from './pipes/plainTexttoHTML.pipe';
import { LimitBarComponent } from './components/limit-bar/limit-bar.component';
import { MovementTypeIconPipe } from './pipes/movement-type-icon.pipe';
import { DpsMovementTheamPipe } from './pipes/dps-movement-theam.pipe';
import { FilterPipe } from './pipes/filter.pipe';
import { ThousandSeperatorPipe } from './pipes/thousand-seperator.pipe';
import { ThousandSeperatorDirective } from './directives/thousand-seperator.directive';
import { ViewApplyGridFiltersComponent } from './components/view-apply-grid-filters/view-apply-grid-filters.component';
import { AudioPlayerComponent } from './components/audio-player/audio-player.component';
import { SecondsToMinutesPipe } from './pipes/seconds-to-minutes.pipe';
import { PropertyLengthPipe } from './pipes/property-length.pipe';
import { TotalDescriptionComponent } from './components/crime/total-description/total-description.component';
import { TimeRateCalculationComponent } from './components/time-rate-calculation/time-rate-calculation.component';
import { FolderTreeMenuComponent } from './components/folder-tree-menu/folder-tree-menu.component';
import { FormsLibraryFilterPipe } from './pipes/forms-library-filter.pipe';

@NgModule({
  imports: [
    AgmCoreModule.forRoot({
      libraries: ['places'],
      apiKey: 'AIzaSyAnapZ0A9uXJlcDd1mXnesn2-lxpTWH1zI'
    }),
    CommonModule,
    RouterModule.forChild([]),
    FlexLayoutModule,
    MatDialogModule,
    MatButtonModule,
    MatMenuModule,
    MatSelectModule,
    MatOptionModule,
    MatIconModule,
    MatCardModule,
    MatListModule,
    FormsModule,
    MatInputModule,
    MatProgressBarModule,
    ReactiveFormsModule,
    MatExpansionModule,
    MatTooltipModule,
    MatToolbarModule,
    ChartsModule,
    MatProgressSpinnerModule,
    OverlayModule,
    PortalModule,
    MatFormFieldModule,
    MatAutocompleteModule,
    MatRippleModule,
    MatSliderModule,
    MatCheckboxModule,
  ],
  declarations: [
    // components
    DummyRouterOutletComponent,
    OverlayRouterOutletComponent,
    ConfirmDialogComponent,
    InforDialogComponent,
    OverlayContainerComponent,
    FileUploaderComponent,
    TeamMemberManagerComponent,
    TeamMemberListComponent,
    TeamMemberItemComponent,
    TeamMemberMinListComponent,
    MessageDialogComponent,
    ConfirmDialogComponentWithCancel,
    GridFontControllerComponent,
    PasswordInsertComponent,
    OptionDialogComponent,
    PasswordConfirmDialoagComponent,
    FailDialogComponent,
    BarChartComponent,
    PieChartComponent,
    TextInsertDialogComponent,
    AddressFinderComponent,
    AttachmentUploadMenuComponent,
    EpmtyWidgetItemComponent,
    LookupsComponent,
    ModuleLayoutComponent,
    CommonOverlayLayoutComponent,
    CommonPopupHeaderComponent,
    CommonGridTableComponent,
    SelectInputWithTableComponent,
    LimitBarComponent,
    ViewApplyGridFiltersComponent,
    AudioPlayerComponent,
    TotalDescriptionComponent,
    TimeRateCalculationComponent,
    FolderTreeMenuComponent,
    // pipes
    StrTemplatePipe,
    StrDefaultPipe,
    AttachmentsSizePipe,
    AttachmentIconPipe,
    RecipientColorCodePipe,
    NameInitialsPipe,
    ValidateEmailPipe,
    CurrencySymbolsPipe,
    UserProfileDetailComponent,
    SearchTextHighlighPipe,
    TimezonePipe,
    DpsDatePipe,
    DpsUserImagePipe,
    DpsLoginUserImagePipe,
    SafeHtmlPipe,
    KeyValuesPipe,
    WorkflowMenuIconPipe,
    WorkflowMenuFilterPipe,
    FormsLibraryFilterPipe,
    WorkflowShortCutKeyPipe,
    IsDpsMailPipe,
    GroupIconByModePipe,
    PermissionLevelPipe,
    MovementTypeIconPipe,
    DpsMovementTheamPipe,
    FilterPipe,
    ThousandSeperatorPipe,
    SecondsToMinutesPipe,
    PropertyLengthPipe,
    // Directive
    DraggableDirective,
    DroppableDirective,
    FileDroppableDirective,
    NumberOnlyDirective,
    IsMobileDirective,
    VirtualScrollComponent,
    TimeOnlyDirective,
    DpsClickDirective,
    QaAtmDirective,
    AddressFinderDirective,
    NumbersOnlyWithDecimalsDirective,
    TimeInputComponent,
    EditableDropdownComponent,
    CommonOverlayTriggerForDirective,
    PlainTexttoHTML,
    ThousandSeperatorDirective
    // ExceptionIndicatorComponent
  ],
  exports: [
    // modules
    FlexLayoutModule,
    MatMenuModule,
    MatDialogModule,
    MatButtonModule,
    MatSelectModule,
    MatOptionModule,
    MatCardModule,
    MatIconModule,
    FormsModule,
    MatInputModule,
    MatAutocompleteModule,
    // components
    TeamMemberManagerComponent,
    TeamMemberListComponent,
    TeamMemberMinListComponent,
    DummyRouterOutletComponent,
    OverlayRouterOutletComponent,
    UserProfileDetailComponent,
    FileUploaderComponent,
    ConfirmDialogComponentWithCancel,
    VirtualScrollComponent,
    GridFontControllerComponent,
    PasswordInsertComponent,
    PasswordConfirmDialoagComponent,
    BarChartComponent,
    PieChartComponent,
    FailDialogComponent,
    TextInsertDialogComponent,
    AddressFinderComponent,
    TimeInputComponent,
    AttachmentUploadMenuComponent,
    EditableDropdownComponent,
    EpmtyWidgetItemComponent,
    LookupsComponent,
    ModuleLayoutComponent,
    CommonOverlayLayoutComponent,
    CommonPopupHeaderComponent,
    CommonGridTableComponent,
    SelectInputWithTableComponent,
    LimitBarComponent,
    ViewApplyGridFiltersComponent,
    AudioPlayerComponent,
    TimeRateCalculationComponent,
    FolderTreeMenuComponent,
    // ExceptionIndicatorComponent,

    // pipes
    NameInitialsPipe,
    AttachmentsSizePipe,
    AttachmentIconPipe,
    RecipientColorCodePipe,
    ValidateEmailPipe,
    CurrencySymbolsPipe,
    SearchTextHighlighPipe,
    DpsLoginUserImagePipe,
    TimezonePipe,
    DpsDatePipe,
    DpsUserImagePipe,
    SafeHtmlPipe,
    KeyValuesPipe,
    WorkflowMenuIconPipe,
    WorkflowMenuFilterPipe,
    FormsLibraryFilterPipe,
    WorkflowShortCutKeyPipe,
    IsDpsMailPipe,
    GroupIconByModePipe,
    PermissionLevelPipe,
    PlainTexttoHTML,
    MovementTypeIconPipe,
    DpsMovementTheamPipe,
    FilterPipe,
    ThousandSeperatorPipe,
    SecondsToMinutesPipe,
    PropertyLengthPipe,
    TotalDescriptionComponent,
    // Directive
    IsMobileDirective,
    DraggableDirective,
    DroppableDirective,
    FileDroppableDirective,
    NumberOnlyDirective,
    TimeOnlyDirective,
    DpsClickDirective,
    QaAtmDirective,
    AddressFinderDirective,
    CommonOverlayTriggerForDirective,
    NumbersOnlyWithDecimalsDirective,
    ThousandSeperatorDirective,
  ],
  providers: [
    ValidateEmailPipe,
    TimezonePipe,
    AttachmentIconPipe,
    DatePipe,
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
    CurrencySymbolsPipe, DecimalPipe
  ],
  entryComponents: [ConfirmDialogComponent, InforDialogComponent, CommonOverlayLayoutComponent,
    MessageDialogComponent, ConfirmDialogComponentWithCancel, FailDialogComponent,
    PasswordInsertComponent, OptionDialogComponent, PasswordConfirmDialoagComponent, TextInsertDialogComponent, LookupsComponent]
})
export class SharedModule { }
