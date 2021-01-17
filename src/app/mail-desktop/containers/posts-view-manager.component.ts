
import { map, reduce, mergeAll, mergeMap } from 'rxjs/operators';
import { OnInit, Component } from '@angular/core';
import { BasePostsManager } from '../../mail-core';
import { Store } from '@ngrx/store';
import { MainMenuService } from '../../layout-desktop';
import { of, from } from 'rxjs';
import { ViewManagerService } from '../services/view-manager.service';
import { CidToAttachemntUrlPipe } from '../../organizer-desktop-shared';

@Component({
    selector: 'dps-posts-view-manager.',
    template: `
    <dps-post-items-viwer
    [selectedConversation]="conversation$|async"
    [selectedGroup]="selectedGroup$|async"
    [timeZone]="(user$|async)?.userTimeZone?.info.alias"
    [companyCode]="(user$|async)?.general?.companyCode"
    (openUrlPoup)="onOpenUrlPoup($event)"
    (viewDpsFile)="onViewDpsFile($event)"
    (openAttachement)="openAttachemnt($event)"
    (downloardFileAttachment)="onDownloardFileAttachment($event)"
    (forward)="onForward($event)"
    (deleteReply)="onDeleteReply($event)"
    (replyForward)="onReplyForward($event)"
    ></dps-post-items-viwer>`,
    styles: []
})
export class PostsViewManagerComponent extends BasePostsManager implements OnInit {
    conversation$;
    constructor(store: Store<any>, private cidPipe: CidToAttachemntUrlPipe,
        private layoutMenu: MainMenuService, private viewManager: ViewManagerService) {
        super(store);
    }
    ngOnInit() {
        this.conversation$ = this.selectedConversation$.pipe(
            mergeMap((conversation: any) => {
                if (conversation && conversation.posts) {
                    return from(conversation.posts.map(post => this.cidPipe.transform('me', post.body.content, post, 'messages'))).pipe(
                        mergeAll(3),
                        reduce((responses: any, current) => responses.concat(current), []),
                        map((responses) => ({
                            ...conversation,
                            posts: conversation.posts.map((post, index) => ({ ...post, body: { ...post.body, content: responses[index] } }))
                        })));
                }
                return from(of(conversation));
            }));
    }
    onViewDpsFile(subject: string) {
        this.layoutMenu.goToOpenCaseByMailSubjectOrDiaryId({ subject, diaryId: null });
    }
    onReplyForward({ post, type }) {
        this.viewManager.showReplayForward({ data: post }, type);
    }

}
