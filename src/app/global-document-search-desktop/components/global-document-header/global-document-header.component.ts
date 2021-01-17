import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';


@Component({
  selector: 'dps-global-document-header',
  templateUrl: './global-document-header.component.html',
  styleUrls: ['./global-document-header.component.scss']
})
export class GlobalDocumentHeaderComponent implements OnInit {


  @Output() searchDoc = new EventEmitter<any>();
  @Output() changeSearchText = new EventEmitter<any>();
  @Output() searchClear = new EventEmitter<any>();

  @Input() searchText: string;

  constructor() { }

  ngOnInit() {
  }


  onDocumentSearch() {

    this.searchDoc.emit();


  }

  onChangeSearchText(e, globalSearch) {
    this.changeSearchText.emit(globalSearch.value);
    if (e.keyCode === 13) {
      this.searchDoc.emit();
    }
  }

  onSearchClear() {
    this.searchClear.emit();
  }


}
