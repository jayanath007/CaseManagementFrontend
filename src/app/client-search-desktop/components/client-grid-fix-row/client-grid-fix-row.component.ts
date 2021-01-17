import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';
import { ColumnDef } from '../../../core/lib/grid-model';
import { SystemJsPopupLoaderService } from '../../../shell-desktop';
import { uuid } from '../../../utils/uuid';


@Component({
  selector: 'dps-client-grid-fix-row',
  templateUrl: './client-grid-fix-row.component.html',
  styleUrls: ['./client-grid-fix-row.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ClientGridFixRowComponent implements OnInit {
  @Input() ClientRowData: any;
  @Input() columnDef: ColumnDef[];
  @Input() searchText: string;
  @Input() activeView;
  @Input() isPopup: boolean;
  @Input() isPlotUser: boolean;
  constructor(private popupService: SystemJsPopupLoaderService) { }

  ngOnInit() {
  }

  getFxFlexProperty(index) {
    if (!this.columnDef) { return ''; }
    return this.columnDef[index] && this.columnDef[index].extras ? this.columnDef[index].extras.fxFlex : '';
  }

  get isHighlighToggle(): boolean {
    let isHighligh = true;
    if (this.searchText && !!this.ClientRowData && this.ClientRowData.data) {
      const searchTList = this.searchText.trim().split(',').map(val => val.trim());
      searchTList.forEach(val => {
        if (isHighligh) {
          const text = Object.keys(this.ClientRowData.data).map(key => `${this.ClientRowData.data[key]}`).join(' ');
          const x = text.match(new RegExp('(' + val + ')', 'gi'));
          if (x && x.length > 0) {
            isHighligh = false;
          }
        }
      });
    } return isHighligh;
  }
  onOpenClientCreationPopup(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.popupService.openClientCreationPopup(uuid(), {
      clientId: this.ClientRowData.data.clientId, clientSeatchList: [], clientIndex: 0
    });
  }

}
