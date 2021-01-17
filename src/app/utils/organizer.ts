import { MessageFormat } from '../auth';
import { Message } from '../core/lib/microsoft-graph';

export function getDefaultMessageFormat(messageFormat: MessageFormat) {
    const p = document.createElement('p');
    if (messageFormat) {
        let elem: HTMLElement = document.createElement('span');
        elem.style.fontSize = messageFormat.fontSize;
        elem.innerHTML = '&#8203;&#8203;&#8203;&#8203;&#8203;&#8203;&#8203;';
        if (messageFormat.fontFamily) {
            const span = document.createElement('span');
            span.style.fontFamily = messageFormat.fontFamily;
            span.appendChild(elem);
            elem = span;
        }
        if (messageFormat.fontColor) {
            const span = document.createElement('span');
            span.style.color = messageFormat.fontColor;
            span.appendChild(elem);
            elem = span;
        }
        if (messageFormat.isBold) {
            const strong = document.createElement('strong');
            strong.appendChild(elem);
            elem = strong;
        }
        if (messageFormat.isItalic) {
            const em = document.createElement('em');
            em.appendChild(elem);
            elem = em;
        }
        if (messageFormat.isUnderline) {
            const u = document.createElement('u');
            u.appendChild(elem);
            elem = u;
        }
        p.appendChild(elem);
    }
    return p.outerHTML;
}

export function getMessageString(email: Message) {
    return `
        MIME-Version: 1.0\r\n
        From: me\r\n
        To:${email.toRecipients && email.toRecipients.length > 0 ?
            email.toRecipients
                .map(val => val.emailAddress.name === val.emailAddress.address ?
                    val.emailAddress.address : val.emailAddress.name + '<' + val.emailAddress.address + '>').join() : ', '}\r\n
        Cc:${email.ccRecipients && email.ccRecipients.length > 0 ?
            email.ccRecipients
                .map(val => val.emailAddress.name === val.emailAddress.address ?
                    val.emailAddress.address : val.emailAddress.name + '<' + val.emailAddress.address + '>').join() : ', '}\r\n
        Bcc:${email.bccRecipients && email.bccRecipients.length > 0 ?
            email.bccRecipients
                .map(val => val.emailAddress.name === val.emailAddress.address ?
                    val.emailAddress.address : val.emailAddress.name + '<' + val.emailAddress.address + '>').join() : ', '}\r\n
        Subject:${email.subject}\r\n\r\n
        Content-Type: multipart/alternative; boundary="000000000000c431fa057f8c0dc7"\r\n
        --000000000000c431fa057f8c0dc7
        Content-Type: text/html; charset=UTF-8\r\n
        ${email.body.content}\r\n
        --000000000000c431fa057f8c0dc7--`;
}
