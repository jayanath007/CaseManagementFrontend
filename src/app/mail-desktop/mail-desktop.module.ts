import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MailCoreModule } from '../mail-core/mail-core.module';
import { MailRoutingModule } from './mail-routing.module';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import {
  MatIconModule, MatSidenavModule, MatListModule, MatAutocompleteModule, MatMenuModule, MatTooltipModule,
  MatDatepickerModule, MatInputModule, MatNativeDateModule, MatButtonModule, MatRadioModule,
  MatPaginatorModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatToolbarModule,
  MatCardModule,
  MatCheckboxModule,
  MatButtonToggleModule,
  MAT_DATE_LOCALE
} from '@angular/material';

import { SharedModule } from '../shared/shared.module';
import { MailDesktopSharedModule } from '../mail-desktop-shared/mail-desktop-shared.module';

import { FolderTreeViewComponent } from './components/folder-tree-view/folder-tree-view.component';
import { FolderListItemComponent } from './components/folder-list-item/folder-list-item.component';

import { SearchOptionsViewComponent } from './components/search-options-view/search-options-view.component';
import { MailListViewComponent } from './components/mail-list-view/mail-list-view.component';

import { FolderContentManagerComponent } from './containers/folder-content-manager.component';
import { MailListHeaderComponent } from './components/mail-list-header/mail-list-header.component';
import { MailLayoutComponent } from './components/mail-layout/mail-layout.component';
import { reducers } from './reducers';
import { MailItemManagerComponent } from './containers/mail-item-manager.component';
import { FolderContentLayoutComponent } from './components/folder-content-layout/folder-content-layout.component';
import { MailManagerComponent } from './containers/mail-manager.component';
import { ItemViewManagerComponent } from './containers/item-view-manager.component';
import { RouteSyncEffects } from './effects/route-sync.effects';
import { StickyFolderStateManagerComponent } from './containers/sticky-folder-state-manager.component';
import { stickyFolderStates } from '.';
import { MailItemViwerComponent } from './components/mail-item-viwer/mail-item-viwer.component';
import { ComposeViewManagerComponent } from './containers/compose-view-manager.component';
import { ViewManagerService } from './services/view-manager.service';
import { SearchOptionsViewManagerComponent } from './containers/search-options-view-manager.component';
import { MailSearchInputComponent } from './components/mail-search-input/mail-search-input.component';
import { ComposeMailCoreModule } from '../compose-mail-core/compose-mail-core.module';
import { MailShortListItemComponent } from './components/mail-short-list-item/mail-short-list-item.component';
import { MailShortListViewComponent } from './components/mail-short-list-view/mail-short-list-view.component';
import { FolderContentShortLayoutComponent } from './components/folder-content-short-layout/folder-content-short-layout.component';
import { MailMultiSelectViewComponent } from './components/mail-multi-select-view/mail-multi-select-view.component';
import { FolderMenuItemListComponent } from './components/folder-menu-item-list/folder-menu-item-list.component';
import { HTTP_INTERCEPTORS } from '../../../node_modules/@angular/common/http';
import { ExceptionInterceptor } from '../shared/services/exception-interceptor.service';
import { AuthInterceptorService } from '../auth';
import { MailboxItemComponent } from './components/mailbox-item/mailbox-item.component';
import { FolderPermissionsPopupComponent } from './components/folder-permissions-popup/folder-permissions-popup.component';
import { FolderPermissionsLayoutComponent } from './components/folder-permissions-layout/folder-permissions-layout.component';
import { FolderPermissionsManagerComponent } from './containers/folder-permissions-manager.component';
import { GroupsListComponent } from './components/groups-list/groups-list.component';
import { GroupListItemComponent } from './components/group-list-item/group-list-item.component';
import { GroupContentManagerComponent } from './containers/group-content-manager.component';
import { GroupConversationsManagerComponent } from './containers/group-conversations-manager.component';
import { GroupContentShortLayoutComponent } from './components/group-content-short-layout/group-content-short-layout.component';
import { ConversationShortListViewComponent } from './components/conversation-short-list-view/conversation-short-list-view.component';
import { ConversationShortListItemComponent } from './components/conversation-short-list-item/conversation-short-list-item.component';
import { PostsViewManagerComponent } from './containers/posts-view-manager.component';
import { PostItemsViwerComponent } from './components/post-items-viwer/post-items-viwer.component';
import { PostViewContentComponent } from './components/post-view-content/post-view-content.component';
import { OrganizerDesktopSharedModule } from '../organizer-desktop-shared/organizer-desktop-shared.module';
import { AddEditGroupPopupComponent } from './components/add-edit-group-popup/add-edit-group-popup.component';
import { AddEditGroupContentComponent } from './components/add-edit-group-content/add-edit-group-content.component';
import { AddEditGroupManagerComponent } from './containers/add-edit-group-manager.component';
import { WelknownFolderListViewComponent } from './components/welknown-folder-list-view/welknown-folder-list-view.component';
import { MailListItemComponent } from './components/mail-list-item/mail-list-item.component';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    MailCoreModule,
    ComposeMailCoreModule,
    MailRoutingModule,
    MailDesktopSharedModule,
    MatIconModule,
    MatSidenavModule,
    MatListModule,
    MatAutocompleteModule,
    MatMenuModule,
    MatTooltipModule,
    MatDatepickerModule,
    MatInputModule,
    MatButtonModule,
    MatRadioModule,
    MatPaginatorModule,
    MatNativeDateModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatToolbarModule,
    MatCardModule,
    MatCheckboxModule,
    MatButtonToggleModule,
    StoreModule.forFeature('dpsMailDesktop', reducers),
    EffectsModule.forFeature([RouteSyncEffects]),
    OrganizerDesktopSharedModule,
  ],
  declarations: [
    FolderTreeViewComponent,
    FolderListItemComponent,

    SearchOptionsViewComponent,
    MailListViewComponent,

    FolderContentManagerComponent,
    MailListHeaderComponent,
    MailSearchInputComponent,
    MailLayoutComponent,
    MailItemManagerComponent,
    FolderContentLayoutComponent,
    MailManagerComponent,
    ItemViewManagerComponent,
    StickyFolderStateManagerComponent,
    MailItemViwerComponent,
    ComposeViewManagerComponent,
    SearchOptionsViewManagerComponent,
    MailShortListItemComponent,
    MailShortListViewComponent,
    FolderContentShortLayoutComponent,
    MailMultiSelectViewComponent,
    FolderMenuItemListComponent,
    MailboxItemComponent,
    FolderPermissionsPopupComponent,
    FolderPermissionsLayoutComponent,
    FolderPermissionsManagerComponent,
    GroupsListComponent,
    GroupListItemComponent,
    GroupContentManagerComponent,
    GroupConversationsManagerComponent,
    GroupContentShortLayoutComponent,
    ConversationShortListViewComponent,
    ConversationShortListItemComponent,
    PostsViewManagerComponent,
    PostItemsViwerComponent,
    PostViewContentComponent,
    AddEditGroupPopupComponent,
    AddEditGroupContentComponent,
    AddEditGroupManagerComponent,
    WelknownFolderListViewComponent,
    MailListItemComponent,
  ],

  providers: [
    ViewManagerService,
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ExceptionInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true,
    }
  ],
  entryComponents: [ FolderPermissionsPopupComponent, AddEditGroupPopupComponent]
})
export class MailDesktopModule { }
