
import { distinctUntilChanged, map, takeUntil, mergeMap } from 'rxjs/operators';
import {
  Component, OnInit, Input, Output, EventEmitter,
  ChangeDetectionStrategy,
  ViewChild, ElementRef,
  AfterViewChecked
} from '@angular/core';
import { ESCAPE } from '@angular/cdk/keycodes';
import { ENTER } from '@angular/cdk/keycodes';
import { MatDialog } from '@angular/material';
import { MatMenuTrigger } from '@angular/material';
import { Subject, merge } from 'rxjs';

import { ComponentBase } from '../../../core';
import { FolderItemWrapper } from '../../../mail-core';
import { FolderEditMode, FolderEditKind } from '../../../core/organizer/enums';
import { FolderMenuAction } from '../../../mail-core/containers';
import { MailTranslationsService } from '../../../mail-core';

import { ConfirmDialogComponent, ConfirmDialogData, ConfirmDialogResult, ConfirmDialogResultKind } from '../../../shared';
import { FolderPermissionsPopupComponent } from '../folder-permissions-popup/folder-permissions-popup.component';

function isDeleteInit(action: FolderMenuAction) {
  return action.type === FolderEditMode.Delete &&
    action.payload.kind === FolderEditKind.Init;
}

@Component({
  selector: 'dps-folder-list-item',
  templateUrl: './folder-list-item.component.html',
  styleUrls: ['./folder-list-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FolderListItemComponent extends ComponentBase implements OnInit, AfterViewChecked {

  @Input() item: FolderItemWrapper;
  @Input() deleteItemsFolderId: string;
  @Input() isGroupMode: boolean;

  @Output() itemOperations = new EventEmitter();
  @Output() toggleExpand = new EventEmitter();
  @Output() select = new EventEmitter();
  @Output() editOperations = new EventEmitter();
  @Output() moveItems = new EventEmitter();
  @Output() refresh = new EventEmitter();

  @ViewChild(MatMenuTrigger) contextMenu: MatMenuTrigger;
  @ViewChild('createInput') private createInput: ElementRef;
  @ViewChild('renameInput') private renameInput: ElementRef;

  menuInteractions$ = new Subject<FolderMenuAction>();
  delete$ = new Subject<FolderMenuAction>();
  viewRendered$ = new Subject<void>();

  FolderEditMode = FolderEditMode; // to use in the template
  FolderEditKind = FolderEditKind;

  constructor(private dialog: MatDialog, private translations: MailTranslationsService) { super(); }

  ngOnInit() {
    const deleteConfirm = this.delete$.pipe(mergeMap(() => this.getDeleteConfirm()));
    merge(this.menuInteractions$, deleteConfirm).pipe(
      takeUntil(this.destroy$))
      .subscribe(({ type, payload }) => {
        console.log('menu actions', type, payload);
        this.editOperations.emit({ type, payload: { ...payload, item: this.item } });
      });

    this.viewRendered$.pipe( // view checked steam
      map(() => this.item.editMode),
      distinctUntilChanged(), // until new state change
      takeUntil(this.destroy$)) // auto unsubscribe when the component destroy
      .subscribe((editMode) => {
        this.handleViewChanges(editMode);
      });

  }

  getDeleteConfirm() {
    const dialogData: ConfirmDialogData = {
      content: {
        title: this.translations.folder_delete_confirm_title,
        message: this.item.data.parentFolderId === this.deleteItemsFolderId ?
          this.translations.folder_permanent_delete_confirm_message : this.translations.folder_delete_confirm_message
      },
      contentParams: { displayName: this.item.data.displayName },
      data: this.item
    };

    const deleteDialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: dialogData,
      width: '350px',
      panelClass: 'dps-notification'
    });

    return deleteDialogRef.afterClosed().pipe(map<ConfirmDialogResult, FolderMenuAction>((result: ConfirmDialogResult) => {
      const kind = result ?
        (result.kind === ConfirmDialogResultKind.Confirmed ? FolderEditKind.Confirm : FolderEditKind.Reject) : FolderEditKind.Reject;
      return { type: FolderEditMode.Delete, payload: { kind: kind } };
    }));

  }

  handleViewChanges(editMode: FolderEditMode) {
    if (editMode === FolderEditMode.Rename) {
      this.renameInput.nativeElement.focus();
    }
    if (editMode === FolderEditMode.Create) {
      this.createInput.nativeElement.focus();
    }
  }

  ngAfterViewChecked() {
    this.viewRendered$.next();
  }

  toggle(event) {
    event.preventDefault();
    this.toggleExpand.emit(this.item);
  }

  contextmenuOpen(event) {
    event.preventDefault();
    this.contextMenu.openMenu();
  }

  create() {
    this.menuInteractions$.next({ type: FolderEditMode.Create, payload: { kind: FolderEditKind.Init } });
  }

  rename() {
    this.menuInteractions$.next({ type: FolderEditMode.Rename, payload: { kind: FolderEditKind.Init } });
  }

  delete() {
    this.delete$.next({ type: FolderEditMode.Delete, payload: { kind: FolderEditKind.Init } });
  }

  editingBlur($event: KeyboardEvent, editMode: FolderEditMode, value?: string) {
    const action: FolderMenuAction = { type: editMode, payload: { kind: FolderEditKind.Confirm, value: value } };
    this.menuInteractions$.next(action);
  }

  editingKeyPress($event: KeyboardEvent, editMode: FolderEditMode, value?: string) {
    const keyMap = new Map([[ESCAPE, FolderEditKind.Reject], [ENTER, FolderEditKind.Confirm]]);
    if (keyMap.has($event.keyCode)) {
      $event.preventDefault();
      $event.stopPropagation();
      const action: FolderMenuAction = { type: editMode, payload: { kind: keyMap.get($event.keyCode), value: value } };
      this.menuInteractions$.next(action);
    }
  }

  selectItem(event) {
    this.select.emit(this.item);
  }

  onRefresh() {
    this.refresh.emit(this.item);
  }

  onDragEnter(event: DragEvent) {
    if (this.item.data.childFolderCount > 0 && !this.item.expanded) {
      this.toggleExpand.emit(this.item);
    }
  }
  onDrop({ event, dragData, dragDataType }: { event: DragEvent, dragData, dragDataType }) {
    if (dragDataType === 'mailItem') {
      this.moveItems.emit({ items: dragData, folderId: this.item.data.id, owner: this.item.owner });
      event.preventDefault();
    }
  }
  permissions() {
    const deleteDialogRef = this.dialog.open(FolderPermissionsPopupComponent, {
      data: this.item.data,
      width: '600px',
      height: '100%',
      maxWidth: 'none',
      panelClass: 'dps-folder-permissions-popup'
    });
  }
  get levels(): number {
    return this.item.hierarchy.split(',').length;
  }
}
