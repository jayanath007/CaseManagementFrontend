import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ItemUpload } from '../../models/interfaces';
import { SasGeneratorService } from '../../services/sas-generator.service';

@Component({
  selector: 'dps-upload-indictor-item',
  templateUrl: './upload-indictor-item.component.html',
  styleUrls: ['./upload-indictor-item.component.scss']
})
export class UploadIndictorItemComponent implements OnInit {

  @Input() item: ItemUpload;

  @Output() removeItem = new EventEmitter<ItemUpload>();

  constructor(private sasGeneratorService: SasGeneratorService) { }

  ngOnInit() {
  }
  onClose() {
    this.removeItem.emit(this.item);
  }
  onShowError() {
    if (this.item.error) {
      alert(JSON.stringify(this.item.error, null, 4));
    }
  }
}
