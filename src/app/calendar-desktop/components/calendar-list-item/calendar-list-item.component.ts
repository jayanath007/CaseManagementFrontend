
import { takeUntil, map, mergeMap, distinctUntilChanged } from 'rxjs/operators';
import { ESCAPE, ENTER } from '@angular/cdk/keycodes';
import { merge, Subject } from 'rxjs';
import {
  Component, OnInit, ViewChild, ChangeDetectionStrategy,
  Input, Output, EventEmitter, ElementRef, AfterViewChecked, OnChanges, SimpleChanges
} from '@angular/core';
import { MatMenuTrigger, MatDialog } from '@angular/material';
import { CalendarItem } from '../../../calendar-core';
import { Calendar } from '../../../core/lib/microsoft-graph';
import { CalendarEditMode, FolderEditKind } from '../../../core/organizer/enums';
import { ComponentBase } from '../../../core';
import { CalendarMenuAction } from '../../../calendar-core/containers/calendar-base-manager';
import { CalendarTranslationsService } from '../../../calendar-core/services/calendar-translations.service';
import { ConfirmDialogData, ConfirmDialogComponent, ConfirmDialogResult, ConfirmDialogResultKind } from '../../../shared';

@Component({
  selector: 'dps-calendar-list-item',
  templateUrl: './calendar-list-item.component.html',
  styleUrls: ['./calendar-list-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CalendarListItemComponent extends ComponentBase implements OnInit, AfterViewChecked, OnChanges {
  @Input() calendar: Readonly<CalendarItem<Calendar>>;

  @Output() toggleCalendar = new EventEmitter();
  @Output() calendarEditOperations = new EventEmitter();

  @ViewChild(MatMenuTrigger) contextMenu: MatMenuTrigger;
  @ViewChild('renameInput') private renameInput: ElementRef;

  menuInteractions$ = new Subject<CalendarMenuAction>();
  delete$ = new Subject<CalendarMenuAction>();
  viewRendered$ = new Subject<void>();

  showProfileImg = false;

  CalendarEditMode = CalendarEditMode; // to use in the template
  FolderEditKind = FolderEditKind;

  constructor(private dialog: MatDialog, private translations: CalendarTranslationsService) { super(); }

  ngOnInit() {
    const deleteConfirm = this.delete$.pipe(mergeMap(() => this.getDeleteConfirm()));
    merge(this.menuInteractions$, deleteConfirm).pipe(
      takeUntil(this.destroy$))
      .subscribe(({ type, payload }) => {
        this.calendarEditOperations.emit({ type, payload: { ...payload, item: this.calendar } });
      });

    this.viewRendered$.pipe( // view checked steam
      map(() => this.calendar.editMode),
      distinctUntilChanged(), // until new state change
      takeUntil(this.destroy$)) // auto unsubscribe when the component destroy
      .subscribe((editMode) => {
        this.handleViewChanges(editMode);
      });
  }

  ngAfterViewChecked() {
    this.viewRendered$.next();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.calendar) {
      this.showProfileImg = false;
    }
  }

  handleViewChanges(editMode: CalendarEditMode) {
    if (editMode === CalendarEditMode.Rename) {
      this.renameInput.nativeElement.focus();
    }
  }

  getDeleteConfirm() {
    const dialogData: ConfirmDialogData = {
      content: {
        title: this.translations.group_delete_confirm_title,
        message: this.translations.group_delete_confirm_message
      },
      contentParams: { displayName: this.calendar.data.name },
      data: this.calendar
    };

    const deleteDialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: dialogData,
      width: '350px',
      panelClass: 'dps-notification'
    });

    return deleteDialogRef.afterClosed().pipe(map<ConfirmDialogResult, CalendarMenuAction>((result: ConfirmDialogResult) => {
      const kind = result ?
        (result.kind === ConfirmDialogResultKind.Confirmed ? FolderEditKind.Confirm : FolderEditKind.Reject) : FolderEditKind.Reject;
      return { type: CalendarEditMode.Delete, payload: { kind: kind } };
    }));

  }

  contextmenuOpen(event) {
    event.preventDefault();
    this.contextMenu.openMenu();
  }

  onToggleCalendar() {
    this.toggleCalendar.emit(this.calendar);
  }

  color() {
    this.menuInteractions$.next({ type: CalendarEditMode.Color, payload: { kind: FolderEditKind.Init } });
  }

  newBirthDay() {
    this.menuInteractions$.next({ type: CalendarEditMode.NewBitrhday, payload: { kind: FolderEditKind.Init } });
  }

  rename() {
    this.menuInteractions$.next({ type: CalendarEditMode.Rename, payload: { kind: FolderEditKind.Init } });
  }

  delete() {
    this.delete$.next({ type: CalendarEditMode.Delete, payload: { kind: FolderEditKind.Init } });
  }

  editingBlur($event: KeyboardEvent, editMode: CalendarEditMode, value?: string) {
    if (editMode !== CalendarEditMode.Rename || this.calendar.data.name !== value) {
      const action: CalendarMenuAction = { type: editMode, payload: { kind: FolderEditKind.Confirm, value: value } };
      this.menuInteractions$.next(action);
    } else {
      const action: CalendarMenuAction = { type: editMode, payload: { kind: FolderEditKind.Reject, value: value } };
      this.menuInteractions$.next(action);
    }
  }

  editingKeyPress($event: KeyboardEvent, editMode: CalendarEditMode, value?: string) {
    const keyMap = new Map([[ESCAPE, FolderEditKind.Reject], [ENTER, FolderEditKind.Confirm]]);
    if (keyMap.has($event.keyCode)) {
      $event.preventDefault();
      $event.stopPropagation();
      if (editMode !== CalendarEditMode.Rename || this.calendar.data.name !== value) {
        const action: CalendarMenuAction = { type: editMode, payload: { kind: keyMap.get($event.keyCode), value: value } };
        this.menuInteractions$.next(action);
      } else {
        const action: CalendarMenuAction = { type: editMode, payload: { kind: FolderEditKind.Reject, value: value } };
        this.menuInteractions$.next(action);
      }
    }
  }

  colorSelect(editMode: CalendarEditMode, color: string) {
    const action: CalendarMenuAction = { type: editMode, payload: { kind: FolderEditKind.Confirm, value: color } };
    this.menuInteractions$.next(action);
  }
}
