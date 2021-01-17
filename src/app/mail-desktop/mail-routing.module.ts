import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { MailManagerComponent } from './containers/mail-manager.component';
import { MailItemManagerComponent } from './containers/mail-item-manager.component';
import { ItemViewManagerComponent } from './containers/item-view-manager.component';
import { ComposeViewManagerComponent } from './containers/compose-view-manager.component';
import { RouterOutlets } from './models/enums';
import { GroupConversationsManagerComponent } from './containers/group-conversations-manager.component';
import { PostsViewManagerComponent } from './containers/posts-view-manager.component';

const myRoutes: Routes = [
  {
    path: 'index', component: MailManagerComponent,
    children:
      [
        {
          path: 'item-viwer', component: ItemViewManagerComponent, outlet: RouterOutlets.MessageItemCommon
        },
        {
          path: 'compose/:composeToken', component: ComposeViewManagerComponent, outlet: RouterOutlets.MessageItemCommon
        },
        {
          path: 'inbox', component: MailItemManagerComponent, outlet: RouterOutlets.Inbox,
          data: { mailFolderId: 'inbox' },
          children: [
            {
              path: 'item-viwer', component: ItemViewManagerComponent, outlet: RouterOutlets.MessageItemCommon
            },
            {
              path: 'compose/:composeToken', component: ComposeViewManagerComponent, outlet: RouterOutlets.MessageItemCommon
            }
          ]
        },
        {
          path: 'drafts', component: MailItemManagerComponent, outlet: RouterOutlets.Drafts,
          data: { mailFolderId: 'drafts' },
          children: [
            {
              path: 'item-viwer', component: ItemViewManagerComponent, outlet: RouterOutlets.MessageItemCommon
            },
            {
              path: 'compose/:composeToken', component: ComposeViewManagerComponent, outlet: RouterOutlets.MessageItemCommon
            }
          ]
        },
        {
          path: ':mailFolderId', component: MailItemManagerComponent, outlet: RouterOutlets.MessagesCommon,
          children: [
            {
              path: 'item-viwer', component: ItemViewManagerComponent, outlet: RouterOutlets.MessageItemCommon
            },
            {
              path: 'compose/:composeToken', component: ComposeViewManagerComponent, outlet: RouterOutlets.MessageItemCommon
            }
          ]
        },
        {
          path: ':groupId', component: GroupConversationsManagerComponent, outlet: RouterOutlets.Groups,
          children: [
            {
              path: 'posts-viwer', component: PostsViewManagerComponent, outlet: RouterOutlets.MessageItemCommon
            },
            {
              path: 'compose/:composeToken', component: ComposeViewManagerComponent, outlet: RouterOutlets.MessageItemCommon
            }
          ]
        }
      ]
  },
];
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(myRoutes)
  ],
  declarations: [],
  exports: [RouterModule]
})
export class MailRoutingModule { }


