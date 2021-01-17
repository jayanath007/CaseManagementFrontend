
import { take } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { AddComposeMail, SaveAndClearComposeMail } from '../actions/compose';
import { Message } from '../../core/lib/microsoft-graph';
import { getUser, User, ReadingPaneMode } from '../../auth';
import { getDefaultMessageFormat } from '../../utils/organizer';

export class BaseComposeMailStoreManager {

    // subscription: any;
    user: User;

    constructor(protected store: Store<any>) {
        const subscription = this.store.select(getUser).pipe(
            take(1))
            .subscribe((user) => {
                this.user = user;
            });
    }



    public setComposeItem(item: Message, emailReadingPaneMode: ReadingPaneMode) {
        let compseItem: Message;
        if (item) {
            compseItem = <Message>JSON.parse(JSON.stringify(item));
        } else {
            const messageFormat = getDefaultMessageFormat(this.user.messageFormat);
            compseItem = {
                id: '',
                subject: '',
                attachments: [],
                toRecipients: [],
                ccRecipients: [],
                bccRecipients: [],
                flag: { flagStatus: 'notFlagged' },
                importance: 'normal',
                body: {
                    content: (this.user && this.user.isSignaturAutoAdd) ?
                        `${messageFormat} <div class="signature">` + this.user.signature + '</div>' : messageFormat, contentType: 'html'
                },
                isDraft: true,
            };
        }
        return this.store.dispatch(new AddComposeMail(compseItem.id ? (emailReadingPaneMode === 'hide' ? 'draftMail' : compseItem.id)
            : 'newMail', { composeMail: compseItem }));
    }

    public saveAndClearComposeMail(id: string) {
        this.store.dispatch(new SaveAndClearComposeMail(id, { itemId: id }));
    }

}
