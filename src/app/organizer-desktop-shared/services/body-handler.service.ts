import { map, mergeMap, reduce, take } from 'rxjs/operators';
import { Injectable, Inject } from '@angular/core';
import { FileAttachment } from '../../core/lib/microsoft-graph';
import { from } from 'rxjs';
import { Base64 } from '../../utils/base64';
import { IS_GOOGLE } from '../../shared';
import { MsgraphClientService } from './msgraph-client.service';
import { Attachments } from '../../add-note-core';
import { WebViewService } from '../../azure-storage';

@Injectable()
export class BodyHandlerService {

  constructor(@Inject(IS_GOOGLE) public isGoogle: string, private graphClient: MsgraphClientService,
    private webViewService: WebViewService) { }

  substituteInlineAttachementPath(owner: string, body: string, attachements: FileAttachment[],
    itemId: string, type: string): Promise<string> {
    return new Promise((resolve, reject) => {
      if (this.isGoogle && !!attachements) {
        const inline = attachements.filter((att) => att.isInline);
        const imgTags = body.match(/<img[^>]+>/g) || [];
        imgTags.forEach(val => {
          const realattid = val.match(/<img.*?src="cid:(.*?)"/);
          if (realattid) {
            const attachement = inline.find(att => att.id === realattid[1]);
            if (attachement) {
              const imgTagNew = val.replace(/src="[^\"]+\"/, 'src="' +
                Base64().createObjectURL(attachement.contentBytes, attachement.contentType) + '"' +
                ' originalsrc="cid:' + realattid[1] + '"');
              body = body.replace(val, imgTagNew);
            }
          }
        });

      } else if (!!attachements) {
        const inline = attachements.filter((att) => att.isInline && !!att.contentId);
        if (inline.length > 0) {
          from(inline).pipe(mergeMap((att) => {
            return this.graphClient.createAttachemntRawContentPath(owner, itemId, att.id, type).pipe(map(path => {
              return { path: path, attachement: att };
            }));
          }), reduce((all, current: any) => all.concat(current), []), take(1))
            .subscribe((all) => {
              const newBody = all.reduce((_newBody, info) => {
                const searchText = `src="cid:${info.attachement.contentId}"`;
                const replace = `originalSrc="cid:${info.attachement.contentId}" src="${info.path}"`;
                return _newBody.replace(new RegExp(searchText, 'g'), replace);
              }, body);
              resolve(newBody);
              // subscription.unsubscribe();
            });
          return;
        }
      }
      resolve(body);
    });
  }

  substituteInlineAttachementPathForDiary(body: string, attachements: Attachments[],
    appCode: string, branchId: number, fileId: number, itemRef: string | number): Promise<string> {
    return new Promise((resolve, reject) => {
      if (attachements) {
        const inline = attachements.filter((att) => att.isInline && att.contentId && att.viewReferance);
        if (inline.length > 0) {
          from(inline).pipe(mergeMap((att) => {
            return this.webViewService.getDiaryWebViewUrlForInlineAttachment(
              appCode, branchId, fileId, itemRef, att.viewReferance, att.name).pipe(map(path => {
                return { path: path, attachement: att };
              }));
          }), reduce((all, current: any) => all.concat(current), []), take(1))
            .subscribe((all) => {
              const newBody = all.reduce((_newBody, info) => {
                const searchText = `src="cid:${info.attachement.contentId}"`;
                const replace = `originalSrc="cid:${info.attachement.contentId}" src="${info.path}"`;
                return _newBody.replace(new RegExp(searchText, 'g'), replace);
              }, body);
              resolve(newBody);
              // subscription.unsubscribe();
            });
          return;
        }
      }
      resolve(body);
    });
  }

  substituteInlineAttachementPathForEmail(body: string, attachements: Attachments[], owner: string,
    itemId: string, attachmentId: string, parentExtention: 'eml' | 'msg'): Promise<string> {
    return new Promise((resolve, reject) => {
      if (attachements) {
        const inline = attachements.filter((att) => att.isInline && att.contentId && att.viewReferance);
        if (inline.length > 0) {
          from(inline).pipe(mergeMap((att) => {
            return this.webViewService.getMailAttachementWebViewUrlForInlineAttachment(owner, itemId,
              attachmentId, parentExtention, att.name, att.viewReferance).pipe(map(path => {
                return { path: path, attachement: att };
              }));
          }), reduce((all, current: any) => all.concat(current), []), take(1))
            .subscribe((all) => {
              const newBody = all.reduce((_newBody, info) => {
                const searchText = `src="cid:${info.attachement.contentId}"`;
                const replace = `originalSrc="cid:${info.attachement.contentId}" src="${info.path}"`;
                return _newBody.replace(new RegExp(searchText, 'g'), replace);
              }, body);
              resolve(newBody);
              // subscription.unsubscribe();
            });
          return;
        }
      }
      resolve(body);
    });
  }

  substituteOriginalCid(body: string) {
    if (this.isGoogle) {
      const imgTags = body.match(/<img[^>]+>/g) || [];
      imgTags.forEach(val => {
        const realattid = val.match(/<img.*?originalsrc="(.*?)"/);
        if (realattid) {
          const imgTagNew = val.replace('originalsrc="' + realattid[1] + '"', '').replace(/src="[^\"]+\"/, 'src="' + realattid[1] + '"');
          body = body.replace(val, imgTagNew);
        }
      });
      return body;
    } else {
      const pattern = /originalSrc="(cid:.*?)"\s+?src=".*?"/ig;
      return body.replace(pattern, 'src="$1"');
    }

  }


}
