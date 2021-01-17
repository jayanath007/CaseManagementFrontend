import { Directive, HostBinding, Input, EventEmitter, HostListener, Output } from '@angular/core';

@Directive({
  selector: '[dpsDraggable]'
})
export class DraggableDirective {
  @Input() dropZones: string[];
  @Input() dpsDraggable: boolean;
  @Input() dragData: any;
  @Input() dragDataType: string;
  @Input() dragImage: string;
  @Input() dragElement: Element;
  @Input() doNotChangeData = false;

  @Output() onDragStart = new EventEmitter();
  @Output() onDrag = new EventEmitter();
  @Output() onDragEnd = new EventEmitter();

  constructor() { }

  @HostBinding('draggable')
  get draggable() {
    return this.dpsDraggable !== false;
  }

  @HostListener('dragstart', ['$event'])
  dragstart(event: DragEvent) {
    if (!!this.doNotChangeData) {
      event.dataTransfer.setData('text', this.dragData);
    } else {
      event.dataTransfer.setData('text', `text/${this.dragDataType ? this.dragDataType : 'dragItem'};jsonString,` +
        JSON.stringify(this.dragData || '')
      );
    }

    localStorage.setItem('dpsDropZones', JSON.stringify(this.dropZones || ''));
    if (event.dataTransfer.setDragImage && this.dragImage) {
      const img = new Image();
      img.src = this.dragImage;
      event.dataTransfer.setDragImage(img, -10, -10);
    } else if (event.dataTransfer.setDragImage && this.dragElement) {
      event.dataTransfer.setDragImage(this.dragElement, -10, -10);
    }
    this.onDragStart.emit(event);
  }

  @HostListener('drag', ['$event'])
  drag(event: DragEvent) {
    this.onDrag.emit(event);
  }

  @HostListener('dragend', ['$event'])
  dragend(event: DragEvent) {
    localStorage.removeItem('dpsDropZones');
    this.onDragEnd.emit(event);
  }
}
