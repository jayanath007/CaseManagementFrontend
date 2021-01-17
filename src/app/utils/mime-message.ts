import { Base64 } from './base64';
import { Message, Recipient, Attachment, FileAttachment } from '../core/lib/microsoft-graph';
declare function unescape(s: string): string;
interface Mail {
    html: string;
    text: string;
    attaches: {
        base64: string,
        cid: string,
        name: string,
        type: string,
        visible: boolean
    }[];
    innerMsgs: any[];
    to: string;
    cc: string;
    bcc: string;
    from: string;
    subject: string;
}
export function Mime() {
    const toMimeTxt = function(message: Message, txtOnly?) {
        const mail = {
            subject: message.subject,
            fromName: '',
            from: 'me',
            body: message.body.content,
            to: message.toRecipients && message.toRecipients.length > 0 ?
                message.toRecipients
                    .map(val => val.emailAddress.name === val.emailAddress.address ?
                        val.emailAddress.address : val.emailAddress.name + '<' + val.emailAddress.address + '>').join(', ') : '',
            cc: message.ccRecipients && message.ccRecipients.length > 0 ?
                message.ccRecipients
                    .map(val => val.emailAddress.name === val.emailAddress.address ?
                        val.emailAddress.address : val.emailAddress.name + '<' + val.emailAddress.address + '>').join(', ') : '',
            bcc: message.bccRecipients && message.bccRecipients.length > 0 ?
                message.bccRecipients
                    .map(val => val.emailAddress.name === val.emailAddress.address ?
                        val.emailAddress.address : val.emailAddress.name + '<' + val.emailAddress.address + '>').join(', ') : '',
            // cids: null,
            // attaches: null
            cids: message.attachments.filter(val => val.isInline).map((val: FileAttachment) => ({
                base64: val.contentBytes,
                cid: val.id,
                name: val.name,
                type: val.contentType,
            })),
            attaches: message.attachments.filter(val => !val.isInline).map((val: FileAttachment) => ({
                base64: val.contentBytes,
                cid: val.id,
                name: val.name,
                type: val.contentType,
            })),
        };
        let plain;
        const linkify = function(inputText: string) {
            const replacePattern1 = /(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim;
            let replacedText = inputText.replace(replacePattern1, '<a href="$1" target="_blank">$1</a>');
            const replacePattern2 = /(^|[^\/])(www\.[\S]+(\b|$))/gim;
            replacedText = replacedText.replace(replacePattern2, '$1<a href="http://$2" target="_blank">$2</a>');
            const replacePattern3 = /(([a-zA-Z0-9\-\_\.])+@[a-zA-Z\_]+?(\.[a-zA-Z]{2,6})+)/gim;
            replacedText = replacedText.replace(replacePattern3, '<a href="mailto:$1">$1</a>');
            return replacedText;
        };
        const getBoundary = function() {
            let _random;
            _random = function() {
                return Math.random().toString(36).slice(2);
            };
            return _random() + _random();
        };
        const createPlain = function(textContent: string) {
            if (!textContent) {
                textContent = '';
            }
            return '\nContent-Type: text/plain; charset=UTF-8' + '\n\n' + textContent;
        };
        const createHtml = function(msg) {
            // let htmlContent;
            // htmlContent = msg.body || '';
            // htmlContent = htmlContent.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/, '&gt;').replace(/\n/g, '\n<br/>');
            // htmlContent = linkify(htmlContent);
            // htmlContent = '<div>' + htmlContent + '</div>';
            return '\nContent-Type: text/html; charset=UTF-8' + '\n\n' + msg.body;
            // (Base64().encode(htmlContent, true)).replace(/.{76}/g, '$&\n');
        };
        const createAlternative = function(text, html) {
            let boundary;
            boundary = getBoundary();
            return '\nContent-Type: multipart/alternative; boundary=' + boundary + '\n\n--' + boundary + text + '\n\n--' +
                boundary + html + '\n\n--' + boundary + '--';
        };
        const createCids = function(cids) {
            let base64, cid, cidArr, id, j, len, name, type;
            if (!cids) {
                return;
            }
            cidArr = [];
            for (j = 0, len = cids.length; j < len; j++) {
                cid = cids[j];
                type = cid.type;
                name = cid.name;
                base64 = cid.base64;
                id = cid.cid;
                cidArr.push('\nContent-Type: ' + type + '; name=\"' + name + '\"' + '\nContent-Transfer-Encoding: base64' +
                    '\nContent-ID: <' + id + '>' + '\nX-Attachment-Id: ' + id + '\n\n' + base64);
            }
            return cidArr;
        };
        const createRelated = function(alternative, cids) {
            let boundary, cid, j, len, relatedStr;
            if (cids == null) {
                cids = [];
            }
            boundary = getBoundary();
            relatedStr = '\nContent-Type: multipart/related; boundary=' + boundary + '\n\n--' + boundary + alternative;
            for (j = 0, len = cids.length; j < len; j++) {
                cid = cids[j];
                relatedStr += '\n--' + boundary + cid;
            }
            return relatedStr + '\n--' + boundary + '--';
        };
        const createAttaches = function(attaches) {
            let attach, base64, id, j, len, name, result, type;
            if (!attaches) {
                return [];
            }
            result = [];
            for (j = 0, len = attaches.length; j < len; j++) {
                attach = attaches[j];
                type = attach.type;
                name = attach.name;
                base64 = attach.base64;
                id = attach.cid;
                result.push('\nContent-Type: ' + type + '; name=\"' + name + '\"' + '\nContent-Disposition: attachment; filename=\"' +
                    name + '\"' + '\nContent-Transfer-Encoding: base64' + '\nX-Attachment-Id: ' + id + '\n\n' + base64);
            }
            return result;
        };
        const createMixed = function(related, attaches) {
            let attach, boundary, date, j, len, mailFromName, mimeStr, subject;
            boundary = getBoundary();
            subject = '';
            if (mail.subject) {
                subject = '=?UTF-8?B?' + Base64().encode(mail.subject, true) + '?=';
            }
            mailFromName = '=?UTF-8?B?' + Base64().encode(mail.fromName || '', true) + '?=';
            date = (new Date().toUTCString()).replace(/GMT|UTC/gi, '+0000');
            mimeStr = 'MIME-Version: 1.0' + '\nDate: ' + date + '\nMessage-ID: <' + getBoundary() + '@mail.your-domain.com>' +
                '\nSubject: ' + subject + '\nFrom: ' + mailFromName + ' <' + mail.from + '>' + (mail.to ? '\nTo: ' + mail.to : '') +
                (mail.cc ? '\nCc: ' + mail.cc : '') + '\nContent-Type: multipart/mixed; boundary=' + boundary + '\n\n--' + boundary +
                related;
            for (j = 0, len = attaches.length; j < len; j++) {
                attach = attaches[j];
                mimeStr += '\n--' + boundary + attach;
            }
            return (mimeStr + '\n--' + boundary + '--').replace(/\n/g, '\r\n');
        };
        plain = createPlain(mail.body);
        if (txtOnly) {
            return createMixed(plain, createAttaches(mail.attaches));
        } else {
            return createMixed(createRelated(createAlternative('', createHtml(mail)),
                createCids(mail.cids)), createAttaches(mail.attaches));
        }
    };
    const toMimeObj = function(mimeMsgText): Message {
        const mailObj = buildMimeObj(mailParser(mimeMsgText));
        return {
            id: '',
            isDraft: true,
            subject: mailObj.subject,
            toRecipients: getRecipients(mailObj.to),
            ccRecipients: getRecipients(mailObj.cc),
            bccRecipients: getRecipients(mailObj.bcc),
            body: {
                contentType: 'html',
                content: mailObj.html
            },
            attachments: mailObj.attaches.map<Attachment>(att => ({
                name: att.name,
                contentType: att.type,
                size: att.base64.length,
                isInline: att.visible,
                contentBytes: att.base64,
                id: att.cid,
                '@odata.type': '#microsoft.graph.fileAttachment'
            }))
        };
    };

    function _util() {
        let KOIRDec, QPDec, _decodeMimeWord, decode, decodeMimeWords, toHtmlEntity, trim, win1251Dec;
        trim = function(str) {
            if (str == null) {
                str = '';
            }
            return (typeof str.trim === 'function' ? str.trim() : void 0) || str.replace(/^\s+|\s+$/g, '');
        };
        decode = function(txt, charset) {
            let result;
            if (txt == null) {
                txt = '';
            }
            if (charset == null) {
                charset = '';
            }
            charset = charset.toLowerCase();
            result = (function() {
                switch (false) {
                    case charset.indexOf('koi8-r') === -1:
                        return KOIRDec(txt);
                    case charset.indexOf('utf-8') === -1:
                        return Base64()._utf8_decode(txt);
                    case charset.indexOf('windows-1251') === -1:
                        return win1251Dec(txt);
                    default:
                        return txt;
                }
            })();
            return result;
        };
        QPDec = function(s) {
            return s.replace(/\=[\r\n]+/g, '').replace(/\=[0-9A-F]{2}/gi, function(v) {
                return String.fromCharCode(parseInt(v.substr(1), 16));
            });
        };
        KOIRDec = function(str) {
            let charmap, code2char, i, j, len, res, val;
            charmap = unescape('%u2500%u2502%u250C%u2510%u2514%u2518%u251C%u2524%u252C%u2534%u253C%u2580%u2584%u2588%u258C%u2590' +
                '%u2591%u2592%u2593%u2320%u25A0%u2219%u221A%u2248%u2264%u2265%u00A0%u2321%u00B0%u00B2%u00B7%u00F7' +
                '%u2550%u2551%u2552%u0451%u2553%u2554%u2555%u2556%u2557%u2558%u2559%u255A%u255B%u255C%u255D%u255E' +
                '%u255F%u2560%u2561%u0401%u2562%u2563%u2564%u2565%u2566%u2567%u2568%u2569%u256A%u256B%u256C%u00A9' +
                '%u044E%u0430%u0431%u0446%u0434%u0435%u0444%u0433%u0445%u0438%u0439%u043A%u043B%u043C%u043D%u043E' +
                '%u043F%u044F%u0440%u0441%u0442%u0443%u0436%u0432%u044C%u044B%u0437%u0448%u044D%u0449%u0447%u044A' +
                '%u042E%u0410%u0411%u0426%u0414%u0415%u0424%u0413%u0425%u0418%u0419%u041A%u041B%u041C%u041D%u041E' +
                '%u041F%u042F%u0420%u0421%u0422%u0423%u0416%u0412%u042C%u042B%u0417%u0428%u042D%u0429%u0427%u042A');
            code2char = function(code) {
                if (code >= 0x80 && code <= 0xFF) {
                    return charmap.charAt(code - 0x80);
                }
                return String.fromCharCode(code);
            };
            res = '';
            for (i = j = 0, len = str.length; j < len; i = ++j) {
                val = str[i];
                res = res + code2char(str.charCodeAt(i));
            }
            return res;
        };
        win1251Dec = function(str) {
            let i, iCode, j, len, oCode, result, s;
            if (str == null) {
                str = '';
            }
            result = '';
            for (i = j = 0, len = str.length; j < len; i = ++j) {
                s = str[i];
                iCode = str.charCodeAt(i);
                oCode = (function() {
                    switch (false) {
                        case iCode !== 168:
                            return 1025;
                        case iCode !== 184:
                            return 1105;
                        case !((191 < iCode && iCode < 256)):
                            return iCode + 848;
                        default:
                            return iCode;
                    }
                })();
                result = result + String.fromCharCode(oCode);
            }
            return result;
        };
        _decodeMimeWord = function(str, toCharset) {
            let encoding, fromCharset, match;
            str = _util().trim(str);
            fromCharset = void 0;
            encoding = void 0;
            match = void 0;
            match = str.match(/^\=\?([\w_\-]+)\?([QqBb])\?([^\?]*)\?\=$/i);
            if (!match) {
                return decode(str, toCharset);
            }
            fromCharset = match[1];
            encoding = (match[2] || 'Q').toString().toUpperCase();
            str = (match[3] || '').replace(/_/g, ' ');
            if (encoding === 'B') {
                return Base64().decode(str, toCharset);
            } else if (encoding === 'Q') {
                return QPDec(str);
            } else {
                return str;
            }
        };
        decodeMimeWords = function(str, toCharset) {
            str = (str || '').toString().replace(/(=\?[^?]+\?[QqBb]\?[^?]+\?=)\s+(?==\?[^?]+\?[QqBb]\?[^?]*\?=)/g, '$1')
                .replace(/\=\?([\w_\-]+)\?([QqBb])\?[^\?]*\?\=/g, (function(mimeWord, charset, encoding) {
                    return _decodeMimeWord(mimeWord);
                }).bind(this));
            return decode(str, toCharset);
        };
        toHtmlEntity = function(txt) {
            if (txt == null) {
                txt = '';
            }
            return (txt + '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        };
        return {
            decode: decode,
            KOIRDec: KOIRDec,
            win1251Dec: win1251Dec,
            decodeMimeWords: decodeMimeWords,
            toHtmlEntity: toHtmlEntity,
            trim: trim,
            QPDec: QPDec
        };
    }
    function mailParser(rawMessage) {
        let cc, from, getValidStr, messageParts, rawHeaders, subject, to, bcc;
        const explodeMessage = function(inMessage) {
            let escBoundary, i, inBody, inBodyParts, inBoundary, inContentType, inContentTypeParts, inHeaderPos, inRawBody,
                inRawHeaders, match, mimeType, mimeTypeParts, regContentType, regString, specialChars;
            inHeaderPos = inMessage.indexOf('\r\n\r\n');
            if (inHeaderPos === -1) {
                inMessage = inMessage.replace(/\n/g, '\r\n');
                inHeaderPos = inMessage.indexOf('\r\n\r\n');
                if (inHeaderPos === -1) {
                    inHeaderPos = inMessage.length;
                }
            }
            inRawHeaders = inMessage.slice(0, inHeaderPos).replace(/\r\n\s+/g, ' ') + '\r\n';
            inRawBody = inMessage.slice(inHeaderPos).replace(/(\r\n)+$/, '').replace(/^(\r\n)+/, '');
            inContentType = '';
            regContentType = inRawHeaders.match(/Content-Type: (.*)/i);
            if (regContentType && regContentType.length > 0) {
                inContentType = regContentType[1];
            } else {
                console.log('Warning: MailParser: Content-type doesn\'t exist!');
            }
            inContentTypeParts = inContentType.split(';');
            mimeType = inContentTypeParts[0].replace(/\s/g, '');
            mimeTypeParts = mimeType.split('/');
            if (mimeTypeParts[0].toLowerCase() === 'multipart') {
                inBodyParts = [];
                match = inContentTypeParts[1].match(/boundary="?([^"]*)"?/i);
                if (!match && inContentTypeParts[2]) {
                    match = inContentTypeParts[2].match(/boundary="?([^"]*)"?/i);
                }
                inBoundary = _util().trim(match[1]).replace(/"/g, '');
                escBoundary = inBoundary.replace(/\+/g, '\\+');
                regString = new RegExp('--' + escBoundary, 'g');
                inBodyParts = inRawBody.replace(regString, inBoundary).replace(regString, inBoundary).split(inBoundary);
                inBodyParts.shift();
                inBodyParts.pop();
                i = 0;
                while (i < inBodyParts.length) {
                    inBodyParts[i] = inBodyParts[i].replace(/(\r\n)+$/, '').replace(/^(\r\n)+/, '');
                    inBodyParts[i] = explodeMessage(inBodyParts[i]);
                    i++;
                }
            } else {
                inBody = inRawBody;
                if (mimeTypeParts[0] === 'text') {
                    inBody = inBody.replace(RegExp('=\\r\\n', 'g'), '');
                    specialChars = inBody.match(RegExp('=[A-F0-9][A-F0-9]', 'g'));
                    if (specialChars) {
                        i = 0;
                        while (i < specialChars.length) {
                            inBody = inBody.replace(specialChars[i], String.fromCharCode(parseInt(specialChars[i]
                                .replace(RegExp('='), ''), 16)));
                            i++;
                        }
                    }
                }
            }
            return {
                rawHeaders: inRawHeaders,
                rawBody: inRawBody,
                body: inBody,
                contentType: inContentType,
                contentTypeParts: inContentTypeParts,
                boundary: inBoundary,
                bodyParts: inBodyParts,
                mimeType: mimeType,
                mimeTypeParts: mimeTypeParts
            };
        };
        messageParts = '';
        try {
            messageParts = explodeMessage(rawMessage);
        } catch (_error) { }
        rawHeaders = messageParts.rawHeaders;
        getValidStr = function(arr) {
            if (arr == null) {
                arr = [];
            }
            return arr[1] || '';
        };
        subject = getValidStr(new RegExp(/\r\nSubject: (.*)\r\n/g).exec(rawHeaders));
        to = getValidStr(new RegExp(/\r\nTo: (.*)\r\n/g).exec(rawHeaders));
        cc = getValidStr(new RegExp(/\r\nCc: (.*)\r\n/g).exec(rawHeaders));
        bcc = getValidStr(new RegExp(/\r\nBcc: (.*)\r\n/g).exec(rawHeaders));
        from = getValidStr(new RegExp(/\r\nFrom: (.*)\r\n/g).exec(rawHeaders));
        return { messageParts, subject, to, cc, bcc, from };
    }
    function buildMimeObj(rawMailObj): Mail {
        let body, decodeBody, err, isHtml, isText, mimeType, parseBodyParts, parts, wrapPreTag;
        const readyMail: Mail = {
            html: '',
            text: '',
            attaches: [],
            innerMsgs: [],
            to: _util().decodeMimeWords(rawMailObj.to),
            cc: _util().decodeMimeWords(rawMailObj.cc),
            bcc: _util().decodeMimeWords(rawMailObj.bcc),
            from: _util().decodeMimeWords(rawMailObj.from),
            subject: _util().decodeMimeWords(rawMailObj.subject)
        };
        // tslint:disable-next-line:no-shadowed-variable
        decodeBody = function(body, rawHeaders) {
            let decBody, isBase64, isQP;
            isQP = /Content-Transfer-Encoding: quoted-printable/i.test(rawHeaders);
            isBase64 = /Content-Transfer-Encoding: base64/i.test(rawHeaders);
            if (isBase64) {
                body = body.replace(/\s/g, '');
                decBody = typeof atob === 'function' ? atob(body) : void 0;
                if (decBody == null) {
                    decBody = Base64().decode(body);
                }
                body = decBody;
            } else if (isQP) {
                body = _util().QPDec(body);
            }
            return body;
        };
        parseBodyParts = function(bodyParts) {
            // tslint:disable-next-line:no-shadowed-variable
            let attach, body, innerMsg, isAttach, isAudio, isHtml, isImg, isPlain, isQP, j, k, len, len1, mimeType, name, newMimeMsg,
                part, rawHeaders, ref, ref1, ref2, slashPos, type, typePart;
            if (!bodyParts) {
                return;
            }
            for (j = 0, len = bodyParts.length; j < len; j++) {
                part = bodyParts[j];
                mimeType = ((ref = part.mimeType) != null ? ref : '').toLowerCase();
                if (mimeType.indexOf('multipart') !== -1) {
                    parseBodyParts(part.bodyParts);
                    continue;
                }
                if (mimeType.indexOf('message/rfc822') !== -1) {
                    newMimeMsg = mailParser(part.rawBody);
                    innerMsg = toMimeObj(newMimeMsg);
                    readyMail.innerMsgs.push(innerMsg);
                    continue;
                }
                rawHeaders = part.rawHeaders;
                isAttach = rawHeaders.indexOf('Content-Disposition: attachment') !== -1;
                body = part.rawBody;
                isHtml = /text\/html/.test(mimeType);
                isPlain = /text\/plain/.test(mimeType);
                isImg = /image/.test(mimeType);
                isAudio = /audio/.test(mimeType);
                if (isAttach || isImg || isAudio) {
                    isQP = /Content-Transfer-Encoding: quoted-printable/i.test(rawHeaders);
                    if (isQP) {
                        body = _util().QPDec(body);
                        body = btoa ? btoa(body) : Base64().encode(body);
                    }
                    ref1 = part.contentTypeParts;
                    for (k = 0, len1 = ref1.length; k < len1; k++) {
                        typePart = ref1[k];
                        if (/name=/i.test(typePart)) {
                            name = typePart.replace(/(.*)=/, '').replace(/"|'/g, '');
                            break;
                        }
                    }
                    if (!name) {
                        name = isImg ? 'image' : isAudio ? 'audio' : 'attachment';
                        name += '_' + Math.floor(Math.random() * 100);
                        slashPos = mimeType.indexOf('/');
                        type = mimeType.substring(slashPos + 1);
                        if (type.length < 4) {
                            name += '.' + type;
                        }
                    }
                    attach = {
                        type: mimeType,
                        base64: body,
                        name: name,
                        cid: (ref2 = new RegExp(/(.*)content-id:(.*)<(.*)>/i).exec(rawHeaders)) != null ? ref2[3] : void 0,
                        visible: /png|jpeg|jpg|gif/.test(mimeType)
                    };
                    readyMail.attaches.push(attach);
                } else if (isHtml || isPlain) {
                    body = decodeBody(body, rawHeaders);
                    body = _util().decode(body, part.contentType);
                    if (isHtml) {
                        readyMail.html += body;
                    }
                    if (isPlain) {
                        readyMail.text += body;
                    }
                } else {
                    console.log('Unknown mime type: ' + mimeType);
                }
            }
            return null;
        };
        try {
            parts = rawMailObj.messageParts;
            if (!parts) {
                return readyMail;
            }
            mimeType = (parts.mimeType || '').toLowerCase();
            isText = /text\/plain/.test(mimeType);
            isHtml = /text\/html/.test(mimeType);
            if (mimeType.indexOf('multipart') !== -1) {
                parseBodyParts(parts.bodyParts);
            } else if (isText || isHtml) {
                body = decodeBody(parts.body, parts.rawHeaders);
                body = _util().decode(body, parts.contentType);
                if (isHtml) {
                    readyMail.html = body;
                }
                if (isText) {
                    readyMail.text = body;
                }
            } else {
                console.log('Warning: mime type isn\'t supported! mime=' + mimeType);
            }
        } catch (_error) {
            err = _error;
            throw new Error(err);
        }
        wrapPreTag = function(txt) {
            return '<pre>' + _util().toHtmlEntity(txt) + '</pre>';
        };
        const mergeInnerMsgs = function(mail: Mail) {
            let htm, innerMsg, innerMsgs, j, len, msg, ref, txt;
            innerMsgs = mail.innerMsgs;
            if (innerMsgs != null ? innerMsgs.length : void 0) {
                if (!_util().trim(mail.html) && mail.text) {
                    mail.html += wrapPreTag(mail.text);
                }
                for (j = 0, len = innerMsgs.length; j < len; j++) {
                    innerMsg = innerMsgs[j];
                    msg = mergeInnerMsgs(innerMsg);
                    txt = msg.text;
                    htm = msg.html;
                    if (htm) {
                        mail.html += htm;
                    } else if (txt) {
                        mail.html += wrapPreTag(txt);
                        mail.text += txt;
                    }
                    if (((ref = msg.attaches) != null ? ref.length : void 0) > 0) {
                        mail.attaches = mail.attaches.concat(msg.attaches);
                    }
                }
            }
            return mail;
        };
        return mergeInnerMsgs(readyMail);
    }
    function getRecipients(recipients: string): Recipient[] {
        if (recipients) {
            return recipients.split(',').map<Recipient>(val => {
                const recipient = val.split('<');
                if (recipient.length === 1) {
                    return {
                        emailAddress: {
                            name: recipient[0].trim(),
                            address: recipient[0].trim()
                        }
                    };
                } else if (recipient.length === 2) {
                    return {
                        emailAddress: {
                            name: recipient[0].trim(),
                            address: recipient[1].replace('>', '').trim()
                        }
                    };
                }
                return null;
            }).filter(val => val);
        }
        return [];
    }

    return {
        toMimeTxt: toMimeTxt,
        toMimeObj: toMimeObj
    };
}
