
import { takeUntil, map, mergeMap, distinctUntilChanged } from 'rxjs/operators';
import { Data } from '@angular/router/src/config';
import { ComponentBase } from '../../../core/lib/component-base';
import { ConfirmDialogData } from '../../../shared/models/dialog';
import {
  Component, OnInit, ChangeDetectionStrategy, Input, Output, EventEmitter, ViewChild, ElementRef,
  AfterViewChecked
} from '@angular/core';
import { CalendarGroupItemWrapper } from '../../../calendar-core';
import { MatMenuTrigger, MatDialog } from '@angular/material';
import { ESCAPE, ENTER } from '@angular/cdk/keycodes';
import { FolderEditKind, CalendarGroupEditMode } from '../../../core/organizer/enums';
import { Subject, merge } from 'rxjs';
import { CalendarGroupTranslationsService } from '../../../calendar-core/services/calendarGroup-translations.service';
import { ConfirmDialogComponent, ConfirmDialogResult, ConfirmDialogResultKind } from '../../../shared';
import { CalendarGroupMenuAction } from '../../../calendar-core/containers/calendar-base-manager';

@Component({
  selector: 'dps-calendar-group-item',
  templateUrl: './calendar-group-item.component.html',
  styleUrls: ['./calendar-group-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CalendarGroupItemComponent extends ComponentBase implements OnInit, AfterViewChecked {
  @Input() calendarGroup: Readonly<CalendarGroupItemWrapper>;

  @Output() toggledgroup = new EventEmitter<CalendarGroupItemWrapper>();
  @Output() toggleCalendar = new EventEmitter<{ groupId: string, calendarId: string }>();
  @Output() calendarGroupEditOperations = new EventEmitter();
  @Output() calendarEditOperations = new EventEmitter();

  @ViewChild(MatMenuTrigger) contextMenu: MatMenuTrigger;
  @ViewChild('createInput') private createInput: ElementRef;
  @ViewChild('renameInput') private renameInput: ElementRef;
  @ViewChild('createCalendarInput') private createCalendarInput: ElementRef;

  menuInteractions$ = new Subject<CalendarGroupMenuAction>();
  delete$ = new Subject<CalendarGroupMenuAction>();
  viewRendered$ = new Subject<void>();

  CalendarGroupEditMode = CalendarGroupEditMode; // to use in the template
  FolderEditKind = FolderEditKind;

  constructor(private dialog: MatDialog, private translations: CalendarGroupTranslationsService) { super(); }

  ngOnInit() {
    const deleteConfirm = this.delete$.pipe(mergeMap(() => this.getDeleteConfirm()));
    merge(this.menuInteractions$, deleteConfirm).pipe(
      takeUntil(this.destroy$))
      .subscribe(({ type, payload }) => {
        this.calendarGroupEditOperations.emit({ type, payload: { ...payload, item: this.calendarGroup } });
      });

    this.viewRendered$.pipe( // view checked steam
      map(() => this.calendarGroup.editMode),
      distinctUntilChanged(), // until new state change
      takeUntil(this.destroy$)) // auto unsubscribe when the component destroy
      .subscribe((editMode) => {
        this.handleViewChanges(editMode);
      });
  }

  ngAfterViewChecked() {
    this.viewRendered$.next();
  }

  handleViewChanges(editMode: CalendarGroupEditMode) {
    if (editMode === CalendarGroupEditMode.Rename) {
      this.renameInput.nativeElement.focus();
    }
    if (editMode === CalendarGroupEditMode.Create) {
      this.createInput.nativeElement.focus();
    }
    if (editMode === CalendarGroupEditMode.CreateCalendar) {
      this.createCalendarInput.nativeElement.focus();
    }
  }

  getDeleteConfirm() {
    const dialogData: ConfirmDialogData = {
      content: {
        title: this.translations.group_delete_confirm_title,
        message: this.translations.group_delete_confirm_message
      },
      contentParams: { displayName: this.calendarGroup.data.name },
      data: this.calendarGroup
    };

    const deleteDialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: dialogData,
      width: '350px',
      panelClass: 'dps-notification'
    });

    return deleteDialogRef.afterClosed().pipe(map<ConfirmDialogResult, CalendarGroupMenuAction>((result: ConfirmDialogResult) => {
      const kind = result ?
        (result.kind === ConfirmDialogResultKind.Confirmed ? FolderEditKind.Confirm : FolderEditKind.Reject) : FolderEditKind.Reject;
      return { type: CalendarGroupEditMode.Delete, payload: { kind: kind } };
    }));

  }

  contextmenuOpen(event) {
    event.preventDefault();
    this.contextMenu.openMenu();
  }

  onGroupToggle(data) {
    this.toggledgroup.emit(data);
  }

  onToggleCalendar(event) {
    this.toggleCalendar.emit(event);
  }

  onCalendarEditOperations(action) {
    this.calendarEditOperations.next(action);
  }

  createCalendar() {
    this.menuInteractions$.next({ type: CalendarGroupEditMode.CreateCalendar, payload: { kind: FolderEditKind.Init } });
  }

  create() {
    this.menuInteractions$.next({ type: CalendarGroupEditMode.Create, payload: { kind: FolderEditKind.Init } });
  }

  rename() {
    this.menuInteractions$.next({ type: CalendarGroupEditMode.Rename, payload: { kind: FolderEditKind.Init } });
  }

  delete() {
    this.delete$.next({ type: CalendarGroupEditMode.Delete, payload: { kind: FolderEditKind.Init } });
  }

  editingBlur($event: KeyboardEvent, editMode: CalendarGroupEditMode, value?: string) {
    if (editMode !== CalendarGroupEditMode.Rename || this.calendarGroup.data.name !== value) {
      const action: CalendarGroupMenuAction = { type: editMode, payload: { kind: FolderEditKind.Confirm, value: value } };
      this.menuInteractions$.next(action);
    } else {
      const action: CalendarGroupMenuAction = { type: editMode, payload: { kind: FolderEditKind.Reject, value: value } };
      this.menuInteractions$.next(action);

    }
  }

  editingKeyPress($event: KeyboardEvent, editMode: CalendarGroupEditMode, value?: string) {
    const keyMap = new Map([[ESCAPE, FolderEditKind.Reject], [ENTER, FolderEditKind.Confirm]]);
    if (keyMap.has($event.keyCode)) {
      $event.preventDefault();
      $event.stopPropagation();
      if (editMode !== CalendarGroupEditMode.Rename || this.calendarGroup.data.name !== value) {
        const action: CalendarGroupMenuAction = { type: editMode, payload: { kind: keyMap.get($event.keyCode), value: value } };
        this.menuInteractions$.next(action);
      } else {
        const action: CalendarGroupMenuAction = { type: editMode, payload: { kind: FolderEditKind.Reject, value: value } };
        this.menuInteractions$.next(action);
      }
    }
  }

  newCalendarBlur($event: KeyboardEvent, editMode: CalendarGroupEditMode, value?: string) {
    const action: CalendarGroupMenuAction = { type: editMode, payload: { kind: FolderEditKind.Confirm, value: value } };
    this.menuInteractions$.next(action);
  }

  newCalendarKeyPress($event: KeyboardEvent, editMode: CalendarGroupEditMode, value?: string) {
    const keyMap = new Map([[ESCAPE, FolderEditKind.Reject], [ENTER, FolderEditKind.Confirm]]);
    if (keyMap.has($event.keyCode)) {
      $event.preventDefault();
      $event.stopPropagation();
      const action: CalendarGroupMenuAction = { type: editMode, payload: { kind: keyMap.get($event.keyCode), value: value } };
      this.menuInteractions$.next(action);
    }
  }
}
