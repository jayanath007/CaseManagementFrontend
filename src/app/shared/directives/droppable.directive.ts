import { Directive, Input, HostListener, Output, EventEmitter, Renderer2, ElementRef } from '@angular/core';

@Directive({
  selector: '[dpsDroppable]'
})
export class DroppableDirective {
  @Input() dropZone: string;
  @Input() dropClass: string;

  @Output() onDragEnter = new EventEmitter<DragEvent>();
  @Output() onDragLeave = new EventEmitter<DragEvent>();
  @Output() onDragOver = new EventEmitter<DragEvent>();
  @Output() onDrop = new EventEmitter<{ event: DragEvent, dragData: any, dragDataType: string }>();

  constructor(public renderer: Renderer2, public hostElement: ElementRef) { }

  @HostListener('dragenter', ['$event'])
  dragenter(event: DragEvent) {
    const dropZones: string[] = JSON.parse(localStorage.getItem('dpsDropZones'));
    if (dropZones && dropZones.includes(this.dropZone)) {
      this.renderer.addClass(this.hostElement.nativeElement, this.dropClass || 'dps-dragover');
      this.onDragEnter.emit(event);
      event.preventDefault();
    }
  }

  @HostListener('dragleave', ['$event'])
  dragleave(event: DragEvent) {
    this.renderer.removeClass(this.hostElement.nativeElement, this.dropClass || 'dps-dragover');
    this.onDragLeave.emit(event);
  }

  @HostListener('dragover', ['$event'])
  dragover(event: DragEvent) {
    const dropZones: string[] = JSON.parse(localStorage.getItem('dpsDropZones'));
    if (dropZones && dropZones.includes(this.dropZone)) {
      this.renderer.addClass(this.hostElement.nativeElement, this.dropClass || 'dps-dragover');
      this.onDragOver.emit(event);
      event.preventDefault();
    }
  }

  @HostListener('drop', ['$event'])
  drop(event: DragEvent) {
    this.renderer.removeClass(this.hostElement.nativeElement, this.dropClass || 'dps-dragover');
    const parts = event.dataTransfer.getData('text').split(/;jsonString,(.+)/);
    const jsonString = parts[1];
    if (jsonString) {
      this.onDrop.emit({ event: event, dragData: JSON.parse(jsonString), dragDataType: parts[0].split('text/')[1] });
    }

  }
}
