import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { AppView, Template, TemplateFilterByCheckoutType, AppInfo, } from '../../../safe-box-explorer-core';
import { FileManagerType } from '../../../document-view';
import { TemplateClipboard } from '../../../safe-box-explorer-core';
import {
  InforDialogData, InforDialogComponent, AttachmentIconPipe,
  TextInsertDialogInput, TextInsertDialogComponent, ConfirmDialogData, ConfirmDialogComponent, ConfirmDialogResultKind
} from '../../../shared';
import { MatDialog } from '@angular/material';
import { checkUploadFileIsBlacklisted, showInforDialog, InfoDialogType } from '../../../core/utility/DpsUtility';
import { ItemClipboard } from '../../../drive-core';
import { DriveItem } from '../../../core/lib/microsoft-graph';
import { SafeBoxType } from '../../../core';

@Component({
  selector: 'dps-template-list-view',
  templateUrl: './template-list-view.component.html',
  styleUrls: ['./template-list-view.component.scss']
})
export class TemplateListViewComponent implements OnInit, OnChanges {

  @Input() appView: AppView;
  @Input() sort: string;
  @Input() filter: TemplateFilterByCheckoutType;
  @Input() searchText: string;
  @Input() showCommonTemplates: boolean;
  @Input() clipboard: TemplateClipboard;
  @Input() copyFrom: SafeBoxType;
  @Input() diveClipboard: ItemClipboard;

  @Output() editeOrView = new EventEmitter<{ template: Template, appId: number, isCommon: boolean }>();
  @Output() checkIn = new EventEmitter<{ template: Template, appId: number, fileManagerType: FileManagerType }>();
  @Output() abort = new EventEmitter<{ template: Template, appId: number, fileManagerType: FileManagerType }>();
  @Output() selectTemplate = new EventEmitter<{ template: Template, appId: number, isMulti: boolean, path: string }>();
  @Output() copyOrCutTemplate = new EventEmitter<TemplateClipboard>();
  @Output() pasteItems = new EventEmitter<{
    clipboard: TemplateClipboard, appId: number,
    path: string, copyFrom: SafeBoxType, diveClipboard: ItemClipboard
  }>();
  @Output() downloadFile = new EventEmitter<{ appId: number, name: string, isCommon: boolean }>();
  @Output() refresh = new EventEmitter<AppInfo>();
  @Output() deleteItems = new EventEmitter<{ templates: Template[], appId: number, path: string }>();
  @Output() renameItem = new EventEmitter<{
    template: Template, newName: string, extension: string,
    appId: number, path: string, appPath: string
  }>();
  @Output() addNewItem = new EventEmitter<{ type: string, appId: number, isCommon: boolean, name: string }>();
  @Output() uploadFiles = new EventEmitter<{ files: File[], path: string }>();

  viewPortItems = [];
  templateList: Template[] = [];

  get selectedTemplates(): Template[] {
    return this.templateList.filter(val => val.selected);
  }

  constructor(protected dialog: MatDialog, protected attachmentIcon: AttachmentIconPipe) { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    this.templateList = this.getTemplateList();
  }

  onEditeOrView(template: Template, event: MouseEvent, onlyView?: boolean) {
    event.preventDefault();
    event.stopPropagation();
    if (template.canView || template.canEdit) {
      this.editeOrView.emit({
        template: onlyView ? { ...template, canEdit: false } : template,
        appId: this.appView.app.appId,
        isCommon: !this.appView.isLocationMatch && this.showCommonTemplates
      });
    }

    this.onSelectTemplate(template, event, false);
  }
  onCheckIn(template: Template, event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.checkIn.emit({
      template, appId: this.appView.app.appId,
      fileManagerType: !this.appView.isLocationMatch && this.showCommonTemplates ?
        FileManagerType.CommonTemplateManager : FileManagerType.TemplateManager
    });
    this.onSelectTemplate(template, event, false);
  }
  onAbort(template: Template, event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.abort.emit({
      template, appId: this.appView.app.appId,
      fileManagerType: !this.appView.isLocationMatch && this.showCommonTemplates ?
        FileManagerType.CommonTemplateManager : FileManagerType.TemplateManager
    });
    this.onSelectTemplate(template, event, false);
  }
  onSelectTemplate(template: Template, event: MouseEvent, isMulti = event.ctrlKey) {
    this.selectTemplate.emit({
      template, appId: this.appView.app.appId, isMulti,
      path: !this.appView.isLocationMatch && this.showCommonTemplates ?
        this.appView.appCommonPathTemplates.path : this.appView.appPathTemplate.path
    });
  }

  onListChange(event) {

  }
  contextMenuOpen(event: MouseEvent, safeboxContextMenue, template: Template) {
    if (!(this.selectedTemplates && this.selectedTemplates.find(val => val.name === template.name))) {
      this.selectTemplate.emit({
        template, appId: this.appView.app.appId, isMulti: false,
        path: !this.appView.isLocationMatch && this.showCommonTemplates ?
          this.appView.appCommonPathTemplates.path : this.appView.appPathTemplate.path
      });
    }
    event.preventDefault();
    event.stopPropagation();
    document.getElementById('templateContextMenue').style.top = event.pageY + 'px';
    document.getElementById('templateContextMenue').style.left = event.pageX + 'px';
    setTimeout(() => {
      safeboxContextMenue.contextMenu.openMenu();
    }, 10);
  }
  contextMenu2Open(event: MouseEvent, safeboxContextMenue) {
    event.preventDefault();
    event.stopPropagation();
    document.getElementById('templateContextMenue2').style.top = event.pageY + 'px';
    document.getElementById('templateContextMenue2').style.left = event.pageX + 'px';
    setTimeout(() => {
      safeboxContextMenue.contextMenu.openMenu();
    }, 10);
  }
  onDownloadFile() {
    if (this.selectedTemplates && this.selectedTemplates.length === 1) {
      this.downloadFile.emit({ appId: this.appView.app.appId, name: this.selectedTemplates[0].name, isCommon: this.showCommonTemplates });
    }
  }
  onDeleteFile() {
    if (this.selectedTemplates && this.selectedTemplates.length > 0) {
      if (this.validateItems(this.selectedTemplates, 'Delete')) {
        this.deleteItems.emit({
          templates: this.selectedTemplates, appId: this.appView.app.appId,
          path: this.showCommonTemplates ? this.appView.appCommonPathTemplates.filePath : this.appView.appPathTemplate.filePath
        });
      }
    }
  }

  onRenameFile() {
    if (this.selectedTemplates && this.selectedTemplates.length === 1) {
      if (this.validateItems(this.selectedTemplates, 'Rename')) {

        const template = this.selectedTemplates[0];
        const extension = '.' + this.attachmentIcon.transform(template.name, 'type');
        const name = template.name.replace(new RegExp(extension + '$'), '');
        const textInsertDialogData: TextInsertDialogInput = {
          content: {
            title: 'Rename',
            details: '',
            message: 'Enter a new name for ' + template.name,
            placeholder: ''
          },
          allowEmpty: false,
          text: name,
          showCancelBtn: true,
          extension: extension
        };
        const dialogRef = this.dialog.open(TextInsertDialogComponent, {
          data: textInsertDialogData,
          width: '350px',
          disableClose: true,
          panelClass: 'dps-notification'
        });
        dialogRef.afterClosed().subscribe(result => {
          if (result && result !== name) {
            const newName = this.checkFileExist(result, extension, null, true, template.name);
            if (newName) {
              const dialogData: ConfirmDialogData = {
                content: {
                  title: 'Rename',
                  message: `
                    <h3>There is already a file with the same name in this loction.</h3>
                    Do you want to rename "<%= name %>" to "<%= newName %>"?
                  `,
                  acceptLabel: 'Yes',
                  rejectLabel: 'No'
                },
                contentParams: { newName: newName + extension, name: template.name },
                data: null
              };
              const confirmDialogRef = this.dialog.open(ConfirmDialogComponent, {
                data: dialogData,
                width: '350px',
                disableClose: true,
                panelClass: 'dps-notification',
                hasBackdrop: true,
              });

              confirmDialogRef.afterClosed().subscribe(dialogResult => {
                if (dialogResult.kind === ConfirmDialogResultKind.Confirmed) {
                  this.renameItem.emit({
                    template: this.selectedTemplates[0], newName, extension, appId: this.appView.app.appId,
                    path: this.showCommonTemplates ? this.appView.appCommonPathTemplates.filePath : this.appView.appPathTemplate.filePath,
                    appPath: this.showCommonTemplates ? 'appCommonPathTemplates' : 'appPathTemplate'
                  });
                }
              });

            } else {
              this.renameItem.emit({
                template: this.selectedTemplates[0], newName: result, extension, appId: this.appView.app.appId,
                path: this.showCommonTemplates ? this.appView.appCommonPathTemplates.filePath : this.appView.appPathTemplate.filePath,
                appPath: this.showCommonTemplates ? 'appCommonPathTemplates' : 'appPathTemplate'
              });
            }
          }
        });
      }
    }
  }
  onCut() {
    if (this.selectedTemplates && this.selectedTemplates.length > 0) {
      if (this.validateItems(this.selectedTemplates, 'Cut')) {
        this.copyOrCutTemplate.emit({
          templates: this.selectedTemplates, type: 'cut',
          filePath: this.showCommonTemplates ? this.appView.appCommonPathTemplates.filePath : this.appView.appPathTemplate.filePath,
          appId: this.appView.app.appId
        });
      }
    }
  }

  onCopy() {
    if (this.selectedTemplates && this.selectedTemplates.length > 0) {
      this.copyOrCutTemplate.emit({
        templates: this.selectedTemplates, type: 'copy',
        filePath: this.showCommonTemplates ? this.appView.appCommonPathTemplates.filePath : this.appView.appPathTemplate.filePath,
        appId: this.appView.app.appId
      });
    }
  }

  onPaste() {
    if (this.copyFrom === SafeBoxType.Template && this.clipboard.appId === this.appView.app.appId && this.clipboard.type === 'copy') {
      this.pasteItems.emit({
        clipboard: this.clipboard, appId: this.appView.app.appId,
        path: this.showCommonTemplates ? this.appView.appCommonPathTemplates.filePath : this.appView.appPathTemplate.filePath,
        copyFrom: this.copyFrom,
        diveClipboard: null
      });
    } else if (this.copyFrom === SafeBoxType.Template && this.clipboard.appId === this.appView.app.appId) {

    } else {
      if (this.copyFrom === SafeBoxType.Template) {
        const callback = (templates: Template[]) => {
          this.pasteItems.emit({
            clipboard: { ...this.clipboard, templates }, appId: this.appView.app.appId,
            path: this.showCommonTemplates ? this.appView.appCommonPathTemplates.filePath : this.appView.appPathTemplate.filePath,
            copyFrom: this.copyFrom,
            diveClipboard: null
          });
        };
        this.addFilesAndShowExist(this.clipboard.templates, 'Paste', callback);
      } else if (this.copyFrom === SafeBoxType.Drive) {
        const callback = (items: DriveItem[]) => {
          this.pasteItems.emit({
            clipboard: null, appId: this.appView.app.appId,
            path: this.showCommonTemplates ? this.appView.appCommonPathTemplates.filePath : this.appView.appPathTemplate.filePath,
            copyFrom: this.copyFrom,
            diveClipboard: { ...this.diveClipboard, items }
          });
        };
        this.addFilesAndShowExist(this.diveClipboard.items, 'Paste', callback);
      }
    }

  }
  onRefresh() {
    this.refresh.emit(this.appView.app);
  }

  onAddNewItem(type) {
    const dialogData: TextInsertDialogInput = {
      content: {
        title: 'New Document',
        details: '',
        message: 'Enter a name',
        placeholder: ''
      },
      allowEmpty: false,
      text: '',
      showCancelBtn: true,
      extension: type
    };
    const dialogRef = this.dialog.open(TextInsertDialogComponent, {
      data: dialogData,
      width: '350px',
      disableClose: true,
      panelClass: 'dps-notification'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const newName = this.checkFileExist(result, type, null, true);
        if (newName) {
          const confirmDialogData: ConfirmDialogData = {
            content: {
              title: 'Create',
              message: `
                    <h3>There is already a file with the same name in this loction.</h3>
                    Do you want to rename "<%= name %>" to "<%= newName %>"?
                  `,
              acceptLabel: 'Yes',
              rejectLabel: 'No'
            },
            contentParams: { newName: newName + type, name: result + type },
            data: null
          };
          const confirmDialogRef = this.dialog.open(ConfirmDialogComponent, {
            data: confirmDialogData,
            width: '350px',
            disableClose: true,
            panelClass: 'dps-notification',
            hasBackdrop: true,
          });

          confirmDialogRef.afterClosed().subscribe(dialogResult => {
            if (dialogResult.kind === ConfirmDialogResultKind.Confirmed) {
              this.addNewItem.emit({
                name: result, type,
                appId: this.appView.app.appId, isCommon: this.showCommonTemplates
              });
            }
          });

        } else {
          this.addNewItem.emit({
            name: result, type,
            appId: this.appView.app.appId, isCommon: this.showCommonTemplates
          });
        }
      }
    });
  }

  onDrop({ event, dragData, dragDataType }) {
    event.preventDefault();
    event.stopPropagation();
    if (dragDataType === 'Files') {
      this.onUploadFiles(dragData);
    }
  }

  onUploadFiles(fileList: FileList) {
    if (this.checkUploadedFile(fileList)) {
      const callback = (files: File[]) => {
        this.uploadFiles.emit({
          files,
          path: this.showCommonTemplates ? this.appView.appCommonPathTemplates.filePath : this.appView.appPathTemplate.filePath
        });
      };
      this.addFilesAndShowExist(fileList, 'Upload', callback);
    }
  }

  getTemplateList(): Template[] {
    let templateList: Template[] = [];
    if (this.appView && !this.appView.isLocationMatch && this.showCommonTemplates && this.appView.appCommonPathTemplates) {
      templateList = this.appView.appCommonPathTemplates.templateList;
    } else if (this.appView && this.appView.appPathTemplate) {
      templateList = this.appView.appPathTemplate.templateList;
    }
    return templateList.filter(val => {
      if (val.name.toLowerCase().includes(this.searchText.toLowerCase())) {
        switch (this.filter) {
          case TemplateFilterByCheckoutType.You:
            return !!val.checkedOutHashKey;

          case TemplateFilterByCheckoutType.OtherUsers:
            return !val.checkedOutHashKey && !!val.checkedOutByUser;

          case TemplateFilterByCheckoutType.NoOne:
            return !val.checkedOutHashKey && !val.checkedOutByUser && val.canEdit;

          case TemplateFilterByCheckoutType.All:
            return true;

          default:
            return false;
        }
      }
      return false;
    }).sort((a, b) => a.name.toLowerCase() > b.name.toLowerCase() ?
      (this.sort === 'asc' ? 1 : -1) : (a.name.toLowerCase() < a.name.toLowerCase() ? ((this.sort === 'asc' ? -1 : 1)) : 0));
  }

  addFilesAndShowExist(fileList, title: string, callback: (list) => void, i = 0, files = []) {
    const file = fileList[i];
    const extension = '.' + this.attachmentIcon.transform(file.name, 'type');
    const name = file.name.replace(new RegExp(extension + '$'), '');
    if (this.checkFileExist(name, extension, null, false)) {
      const confirmDialogData: ConfirmDialogData = {
        content: {
          title,
          message: `The destination already has a file named "<%= name %>"`,
          acceptLabel: 'Replace',
          rejectLabel: 'Skip'
        },
        contentParams: { name: file.name },
        data: null
      };
      const confirmDialogRef = this.dialog.open(ConfirmDialogComponent, {
        data: confirmDialogData,
        width: '350px',
        disableClose: true,
        panelClass: 'dps-notification',
        hasBackdrop: true,
      });

      confirmDialogRef.afterClosed().subscribe(dialogResult => {
        if (dialogResult.kind === ConfirmDialogResultKind.Confirmed) {
          files.push(file);
        }
        if (fileList.length > i + 1) {
          this.addFilesAndShowExist(fileList, title, callback, i + 1, files);
        } else if (files.length > 0) {
          callback(files);
        }
      });
    } else {
      files.push(file);
      if (fileList.length > i + 1) {
        this.addFilesAndShowExist(fileList, title, callback, i + 1, files);
      } else if (files.length > 0) {
        callback(files);
      }
    }
  }

  isCutItem(template: Template) {
    return this.clipboard && this.clipboard.appId === this.appView.app.appId && this.clipboard.type === 'cut' &&
      this.clipboard.templates.find(val => val.name === template.name);
  }

  validateItems(templates: Template[], action: string) {
    if (templates.find(val => !!(val.checkedOutHashKey || val.checkedOutByUser))) {
      const dialogInfoData: InforDialogData = {
        content: {
          title: action,
          message: `<p>Check out file(s) have been selected. Cannot do this action.</p>`
        },
        contentParams: {},
        data: { messageType: 'warning' }
      };
      const dialogInfoRef = this.dialog.open(InforDialogComponent, {
        data: dialogInfoData,
        width: '350px',
        panelClass: 'dps-notification'
      });
      return false;
    }
    return true;
  }

  checkFileExist(newName: string, extension: string, templateList: Template[], suggestName: boolean, name?: string) {
    if (!templateList) {
      if (!this.appView.isLocationMatch && this.showCommonTemplates && this.appView && this.appView.appCommonPathTemplates) {
        templateList = this.appView.appCommonPathTemplates.templateList;
      } else if (this.appView && this.appView.appPathTemplate) {
        templateList = this.appView.appPathTemplate.templateList;
      }
    }
    const template = templateList.find(val => val.name !== name && val.name.toLowerCase() === (newName + extension).toLowerCase());
    if (template) {
      return suggestName ? this.findNewName(newName, extension, templateList) : true;
    }
    return false;
  }

  findNewName(name: string, extension: string, templateList: Template[], number = 2) {
    if (!templateList) {
      if (!this.appView.isLocationMatch && this.showCommonTemplates && this.appView && this.appView.appCommonPathTemplates) {
        templateList = this.appView.appCommonPathTemplates.templateList;
      } else if (this.appView && this.appView.appPathTemplate) {
        templateList = this.appView.appPathTemplate.templateList;
      }
    }
    if (this.checkFileExist(name + ` (${number})`, extension, templateList, false)) {
      return this.findNewName(name, extension, templateList, number + 1);
    }
    return name + ` (${number})`;
  }
  checkUploadedFile(files: FileList): boolean {
    let valid = true;
    let notValidList = '';
    for (let i = 0; i < files.length; i++) {
      if (checkUploadFileIsBlacklisted(files[i].name)) {
        notValidList = `${notValidList} <br> ${files[i].name}`;
        valid = false;
      }
    }
    if (notValidList) {
      showInforDialog('Harmful file detection',
        `You are try to upload harmful file type, please contact admin.
       <br> ${notValidList}`, InfoDialogType.warning, this.dialog);
      valid = false;
    }
    return valid;
  }

}
