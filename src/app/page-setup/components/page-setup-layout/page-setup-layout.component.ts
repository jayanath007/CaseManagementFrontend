import { PageSetupResponce } from './../../models/interfce';
import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { PageSetupChangeKind } from '../../models/enum';
import { MatDialog } from '@angular/material';
import { InforDialogData, InforDialogComponent } from '../../../shared';
@Component({
  selector: 'dps-page-setup-layout',
  templateUrl: './page-setup-layout.component.html',
  styleUrls: ['./page-setup-layout.component.scss']
})
export class PageSetupLayoutComponent implements OnInit, OnChanges {
  @Input() isLoading: boolean;
  @Input() setupData: PageSetupResponce;
  @Input() popupClose: boolean;
  @Input() differentPage: boolean;
  @Input() isDifferentPageHeaderFooter: boolean;

  @Output() changePageSetupValue = new EventEmitter<{ page: string, kind: PageSetupChangeKind, value: number }>();
  @Output() close = new EventEmitter();
  @Output() saveChanges = new EventEmitter();
  @Output() differentFirstPage = new EventEmitter();
  @Output() differentPageHeaderFooter = new EventEmitter();

  constructor(private dialog: MatDialog) { }
  activeIndex = 0;
  ngOnInit() {
  }
  ngOnChanges(changes: SimpleChanges) {

    if (this.setupData && this.setupData.usingDefaults === true && changes.setupData && !changes.setupData.isFirstChange()) {
      const msg = 'Spitfire is currently using default settings for documents. Please setup appropriate figures.';
      this.openMSGPopup(msg, 'alert', false);
    }


    if (changes.popupClose && !changes.popupClose.isFirstChange() && changes.popupClose.currentValue === true) {

      this.onClose();
    }
  }


  onClose() {
    this.close.emit();
  }
  onChangeTop(page, value) {
    this.changePageSetupValue.emit({ page: page, kind: PageSetupChangeKind.Top, value: value });
  }

  onChangeBottom(page, value) {
    this.changePageSetupValue.emit({ page: page, kind: PageSetupChangeKind.Bottom, value: value });
  }

  onChangeLeft(page, value) {
    this.changePageSetupValue.emit({ page: page, kind: PageSetupChangeKind.Left, value: value });
  }

  onChangeRight(page, value) {
    this.changePageSetupValue.emit({ page: page, kind: PageSetupChangeKind.Right, value: value });
  }

  onChangeGutter(page, value) {
    this.changePageSetupValue.emit({ page: page, kind: PageSetupChangeKind.Gutter, value: value });
  }

  onChangeWidth(page, value) {
    this.changePageSetupValue.emit({ page: page, kind: PageSetupChangeKind.Width, value: value });
  }

  onChangeHight(page, value) {
    this.changePageSetupValue.emit({ page: page, kind: PageSetupChangeKind.Hight, value: value });
  }

  onChangeHeader(page, value) {
    this.changePageSetupValue.emit({ page: page, kind: PageSetupChangeKind.Header, value: value });
  }

  onChangeFooter(page, value) {
    this.changePageSetupValue.emit({ page: page, kind: PageSetupChangeKind.Footer, value: value });
  }
  onSaveChanges() {
    this.saveChanges.emit();
  }
  isFirstPage() {
  }
  onDifferentFirstPage(event) {
    this.differentFirstPage.emit(event.checked);
  }
  onDifferentPageHeaderFooter(event) {
    this.differentPageHeaderFooter.emit(event.checked);
  }
  openMSGPopup(msg, type, isClose) {
    const dialogData: InforDialogData = {
      content: {
        title: 'Alert',
        message: msg
      },
      data: { messageType: type }
    };
    const dialogRef = this.dialog.open(InforDialogComponent, {
      data: dialogData,
      width: '400px',
      disableClose: true,
      hasBackdrop: true,
      panelClass: 'dps-notification'
    });
    dialogRef.afterClosed().subscribe(() => {
      //    this.onClose();

    });
  }
}
