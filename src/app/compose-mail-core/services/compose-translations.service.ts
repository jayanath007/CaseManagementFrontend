import { Injectable } from '@angular/core';

@Injectable()
export class ComposeTranslationsService {
    send_mail_warning_title = 'Send Email';
    send_mail_warning_message = 'Do you want to send this message without a subject?';
    send_mail_warning_accept_label = 'Send Anyway';
    send_mail_warning_reject_label = 'Don\'t Send';

    send_mail_validation_title = 'Required field missing';
    send_mail_recipient_validation_message = 'The message must have at least one recipient.';
    send_mail_valid_recipients_validation_message = 'The message can\'t be sent because at least one recipient isn\'t valid.';
    send_mail_attachments_validation_message = 'This action can\'t be performed while attachments are being added or removed.';

    file_attachment_size_validation_title = `Attachment size get exceeded.`;
    file_attachment_size_validation_message = `Size of document "<%= displayName %>" is <%= displaySize %> MB.
    Please attach a document less than 35MB.`;

    constructor() { }

}
