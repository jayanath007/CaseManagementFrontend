
import { scan, map } from 'rxjs/operators';
import { Recipient } from '../core/lib/microsoft-graph';
import { Directive, OnInit, Output, EventEmitter, NgZone, OnDestroy, Input } from '@angular/core';
import { InstanceRef } from './instance-ref';
import * as _ from 'lodash';
import { merge, BehaviorSubject } from 'rxjs';


import { FileAttachment } from '../core/lib/microsoft-graph';
import { uuid } from '../utils/uuid';
import { ConfirmDialogData, ConfirmDialogComponent, ConfirmDialogResultKind } from '../shared';
import { MatDialog } from '@angular/material';
declare var CKEDITOR: any;


@Directive({
  selector: '[dpsCkEditorInlineImageRendere]'
})
export class InlineImageRendereDirective implements OnInit, OnDestroy {
  constructor(private ref: InstanceRef, private zone: NgZone, private dialog: MatDialog) { }

  inlineTypes = ['image/png', 'image/jpe', 'image/jpeg', 'image/gif'];
  editableElement = null;
  dragOverClass = 'dps-file-dragover';
  lastTarget;
  lastRootTarget;

  maxInlineSize = 1024 * 1024 * 2;
  destroyCleaners = [];

  @Output() attachedInline = new EventEmitter();
  @Output() attachedFile = new EventEmitter();
  @Output() attachedItem = new EventEmitter();

  private attachemntChange = new BehaviorSubject<{ uid?: string, downloadUrl?: string, attachment?: FileAttachment }>({});


  ngOnInit(): void {
    const subscription = this.ref.ready().subscribe((editor) => {
      CKEDITOR.addCss('file-drop.css');
      this.handle(editor);
      subscription.unsubscribe();
    });

    // TODO remove subscription
    const subs = merge(
      this.ref.valueWrite().pipe(
        map((value) => ({ action: 'VALUE_CHANGE', payload: { value: value } }))),
      this.attachemntChange.pipe(map((value) => ({ action: 'ATTACHEMENT_CHANGE', payload: { attachementStatus: value } }))),
      this.ref.ready().pipe(map((editor) => ({ action: 'INIT', payload: { editor: editor } })))
    ).pipe(scan((acc, current: any) => ({ ...acc, ...current.payload }), { attachementStatus: {} }))
      .subscribe((state) => {
        if (state.editor && state.attachementStatus) {
          const data = state.attachementStatus;
          if (!data.uid || !data.downloadUrl || !data.attachment) {
            return;
          }
          const img = state.editor.document.getById(data.uid);
          if (img) {
            img.setAttribute('originalSrc', 'cid:' + data.attachment.contentId);
            img.removeAttribute('id', null);
            img.setAttribute('src', data.downloadUrl);
            state.editor.fire('change');
          }
        }
      });

    this.destroyCleaners.push(() => subs.unsubscribe());
  }

  @Input() set attachmentStatus(value: { uid?: string, downloadUrl?: string }) {
    this.attachemntChange.next(value);
  }

  ngOnDestroy(): void {
    this.destroyCleaners.forEach((cleaner) => {
      try {
        cleaner();
      } catch (e) { }
    });
    this.lastRootTarget = null;
    this.lastTarget = null;
  }

  handle(editor) {

    const onPaste = (event) => {
      return this.handlePaste(event, editor);
    };

    const onDragOver = (event) => {
      return this.handleDragOver(event, editor);
    };

    const onDragEnter = (event) => {
      return this.handleDragEnter(event, editor);
    };

    const onDragLeave = (event) => {
      return this.handleDragLeave(event, editor);
    };

    const onDrop = (event) => {
      return this.handleDrop(event, editor);
    };

    const handlerMap = {
      'paste': onPaste,
      'dragover': onDragOver,
      'dragenter': onDragEnter,
      'dragleave': onDragLeave,
      'drop': onDrop
    };

    const attacheEvents = (dom) => {
      Object.keys(handlerMap).forEach((key) => {
        dom.on(key, handlerMap[key], null, { editor: editor });
      });
    };

    const detacheEvents = (dom) => {
      Object.keys(handlerMap).forEach((key) => {
        dom.removeListener(key, handlerMap[key]);
      });
    };

    this.editableElement = editor.document;

    if (this.editableElement) {
      attacheEvents(this.editableElement);
      this.destroyCleaners.push(() => detacheEvents(this.editableElement));
    }

    editor.on('contentDom', () => {
      if (!this.editableElement || (this.editableElement && editor.document !== this.editableElement)) {
        if (this.editableElement) {
          detacheEvents(this.editableElement);
        }
        this.editableElement = editor.document;
        attacheEvents(this.editableElement);
        this.destroyCleaners.push(() => detacheEvents(this.editableElement));
      }
    });

    editor.on('contentDomUnload', () => {
      if (this.editableElement) {
        detacheEvents(this.editableElement);
      }
    });

    // root dom events
    const rootDragEnter = (event) => {
      if (this.hasFiles(event)) {
        editor.document.getBody().addClass(this.dragOverClass);
        this.lastRootTarget = event.target;
      }
    };

    const rootDragLeave = (event) => {
      if (this.hasFiles(event)) {
        if (this.lastRootTarget === event.target) {
          editor.document.getBody().removeClass(this.dragOverClass);
        }
      }
    };

    const rootDrop = (event) => {
      if (this.hasFiles(event)) {
        editor.document.getBody().removeClass(this.dragOverClass);
      }
    };

    document.addEventListener('dragenter', rootDragEnter);
    document.addEventListener('drop', rootDrop);
    document.addEventListener('dragleave', rootDragLeave);

    this.destroyCleaners.push(() => {
      document.removeEventListener('dragenter', rootDragEnter);
      document.removeEventListener('drop', rootDrop);
      document.removeEventListener('dragleave', rootDragLeave);
    });

  }

  hasFiles(event) {
    // in Webkit types is an array, DOMStringList elsewhere
    if (!event.dataTransfer) {
      return false;
    }
    const types = event.dataTransfer.types;
    event.dataTransfer.dropEffect = 'copy';
    return ((types.indexOf && types.indexOf('Files') > -1) ||
      (types.contains && types.contains('Files'))
    );
  }

  handleDragEnter(event, editor) {
    if (this.hasFiles(event.data.$)) {
      event.data.stopPropagation();
      editor.document.getBody().addClass(this.dragOverClass);
      this.lastTarget = event.data.$.target;
    }
  }

  handleDragLeave(event, editor) {
    if (this.hasFiles(event.data.$)) {
      event.data.stopPropagation();
      if (this.lastTarget === event.data.$.target) {
        editor.document.getBody().removeClass(this.dragOverClass);
      }
    }
  }

  handleDragOver(event, editor) {
    if (this.hasFiles(event.data.$)) {
      event.data.$.preventDefault();
    }
  }

  handleDrop(event, editor) {
    const dragEvent: DragEvent = event.data.$;
    editor.document.getBody().removeClass(this.dragOverClass);
    if (dragEvent.dataTransfer.files.length === 0) {
      const dropZones: [string] = JSON.parse(localStorage.getItem('dpsDropZones'));
      if (dragEvent.dataTransfer.types && dragEvent.dataTransfer.types.length > 0 && dragEvent.dataTransfer.getData('text') &&
        dropZones && dropZones.includes('mailCompose')) {
        const parts = dragEvent.dataTransfer.getData('text').split(/;jsonString,(.+)/);
        const jsonString = parts[1];
        const dragDataType = parts[0].split('text/')[1];
        if (dragDataType === 'recipient') {
          const resp: Recipient = JSON.parse(jsonString);
          editor.insertText(` ${resp.emailAddress.name} (${resp.emailAddress.address})`);
          // event.data.dataValue = ` ${resp.emailAddress.name} (${resp.emailAddress.address})`;
          dragEvent.preventDefault();
          dragEvent.stopPropagation();
        } else if (dragEvent.dataTransfer.types.length === 1) {
          this.attachedItem.emit({ jsonString: jsonString, itemType: dragDataType });
          dragEvent.preventDefault();
        }
      }
      return;
    }

    dragEvent.preventDefault();
    const files = _.range(dragEvent.dataTransfer.files.length).map((index) => dragEvent.dataTransfer.files[index]);
    this.attachedFile.emit(files);
    // files.map((file) => {
    //   return this.readAsBase64(file, editor).then((base64) => ({ base64, file }));
    // }).forEach(promise => {
    //   promise.then(({ base64, file }) => {
    //     this.attachedFile.emit({ base64: base64, file: file });
    //     // const isInline = this.inlineTypes.indexOf(file.type) !== -1 && file.size < this.maxInlineSize;
    //     // if (isInline) {
    //     //   const id = this.insertEmptyImage(editor);
    //     //   this.attachedInline.emit({ elementId: id, base64: base64, file: file });
    //     // } else {
    //     // }
    //   });
    // });
  }

  insertEmptyImage(editor) {
    // todo add the guid
    const id = uuid();
    const img = editor.document.createElement('img');
    img.setAttribute('id', id);
    img.setAttribute('originalSrc', 'cid:' + id);
    editor.insertElement(img);
    return id;
  }

  handlePaste(event, editor) {
    const $event = event.data.$;
    const clipboardData = $event.clipboardData;
    const found = false;
    const imageType = /^image/;
    if (!clipboardData) {
      return;
    }

    if (!clipboardData.types.find((type, index) => type.match('html'))) {
      clipboardData.types
        .map((type, index) => ({ index, type }))
        .filter(({ index, type }) => type.match(imageType) || clipboardData.items[index].type.match(imageType))
        .map(({ index }) => clipboardData.items[index])
        .forEach((item) => {
          if (!item || typeof item.getAsFile !== 'function') {
            return;
          }
          const file = item.getAsFile();
          this.readAsBase64(file, editor).then((base64Image) => {
            if (file.size < this.maxInlineSize) {
              const id = this.insertEmptyImage(editor);
              const img = editor.document.getById(id);
              img.setAttribute('src', '/assets/img-loading.gif');

              this.attachedInline.emit({ base64: base64Image, file: file, elementId: id, contentId: id });
            } else {

              const dialogData: ConfirmDialogData = {
                content: {
                  title: 'Inline image',
                  message: 'The size of the inline image get exceed the 2 MB limit. Do you want to attach it as the file attachment?',
                  acceptLabel: 'Yes',
                  rejectLabel: 'No'
                },
                contentParams: {},
                data: null
              };
              const dialogRef = this.dialog.open(ConfirmDialogComponent, {
                data: dialogData,
                width: '350px',
                disableClose: true,
                panelClass: 'dps-notification',
                hasBackdrop: true,
              });
              dialogRef.afterClosed().subscribe(dialogResult => {
                if (dialogResult.kind === ConfirmDialogResultKind.Confirmed) {
                  this.attachedFile.emit([file]);
                }
              });
              // this.attachedInline.emit({ base64: base64Image, file: file });
            }

          });
        });
    }

  }

  readAsBase64(file, editor) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onerror = () => {
        reject();
      };

      reader.onload = (evt: any) => {
        resolve(evt.target.result);
      };

      reader.readAsDataURL(file);
    });
  }

}

