import { Directive, Input, HostListener, Output, EventEmitter, Renderer2, ElementRef } from '@angular/core';
import { checkExceedsMaximumFileSize, getConvertFileToMB } from '../../core/lib/files';
import { MatDialog } from '@angular/material';
import { FailDialogComponent } from '..';
import { getExtention } from '../../utils/file';
import { blacklistExtention } from '../../core';

@Directive({
  selector: '[dpsFileDroppable]'
})
export class FileDroppableDirective {
  @Input() dropZone: string;
  @Input() dropClass: string;
  @Input() maxSize = 30;

  @Output() onDragEnter = new EventEmitter<DragEvent>();
  @Output() onDragLeave = new EventEmitter<DragEvent>();
  @Output() onDragOver = new EventEmitter<DragEvent>();
  @Output() onDrop = new EventEmitter<{ event: DragEvent, dragData: File[], dragDataType: 'Files' }>();

  constructor(public renderer: Renderer2, public hostElement: ElementRef, private dialog: MatDialog) { }

  @HostListener('dragenter', ['$event'])
  dragenter(event: DragEvent) {
    if (event.dataTransfer.types.find(val => val === 'Files')) {
      event.dataTransfer.dropEffect = 'copy';
      this.renderer.addClass(this.hostElement.nativeElement, this.dropClass || 'dps-dragover');
      this.onDragEnter.emit(event);
      event.preventDefault();
    }
  }

  @HostListener('dragleave', ['$event'])
  dragleave(event: DragEvent) {
    event.dataTransfer.dropEffect = 'copy';
    this.renderer.removeClass(this.hostElement.nativeElement, this.dropClass || 'dps-dragover');
    this.onDragLeave.emit(event);
  }

  @HostListener('dragover', ['$event'])
  dragover(event: DragEvent) {
    if (event.dataTransfer.types.find(val => val === 'Files')) {
      event.dataTransfer.dropEffect = 'copy';
      this.renderer.addClass(this.hostElement.nativeElement, this.dropClass || 'dps-dragover');
      this.onDragOver.emit(event);
      event.preventDefault();
    }
  }

  @HostListener('drop', ['$event'])
  drop(event: DragEvent) {

    if (event && event.dataTransfer && event.dataTransfer.files && event.dataTransfer.files.length > 0) {
      const validFiles: File[] = [];
      const failDialogDetails: { title: string, message: string }[] = [];
      for (let i = 0; i < event.dataTransfer.files.length; i++) {
        const f = event.dataTransfer.files[i];
        if (checkExceedsMaximumFileSize(f, this.maxSize)) {
          failDialogDetails.push({ title: f.name, message: `file size -${getConvertFileToMB(f).toFixed(2).toString()} MB` });
        } else if (blacklistExtention.includes(getExtention(f.name).toLowerCase())) {
          failDialogDetails.push({
            title: f.name,
            message: `Harmful file type -${getExtention(f.name)}`
          });
        } else {
          validFiles.push(f);
        }
      }
      if (failDialogDetails && failDialogDetails.length > 0) {
        const dialogRef = this.dialog.open(FailDialogComponent, {
          data: {
            messageHeader: 'Uploading file',
            messageBody: 'The total size of attachment(s) that can be attached is 30MB. Please try to attach less than 30 MB item(s).',
            detailStatus: failDialogDetails
          },
          width: '400px',
          disableClose: true,
          hasBackdrop: true,
          panelClass: 'dps-notification'
        });
        dialogRef.afterClosed().subscribe(() => {
          this.onDrop.emit({ event: event, dragData: validFiles, dragDataType: 'Files' });
        });
      } else {
        this.onDrop.emit({ event: event, dragData: validFiles, dragDataType: 'Files' });
      }

    } this.renderer.removeClass(this.hostElement.nativeElement, this.dropClass || 'dps-dragover');

    event.preventDefault();
  }
}
