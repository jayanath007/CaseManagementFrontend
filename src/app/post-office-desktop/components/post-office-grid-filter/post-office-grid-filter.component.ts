// import { GridFilterKind } from './../../../post-office-core/models/enumeration';
// import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
// import { Group, SelectedInfo } from '../../../post-office-core/models/interfce';


// @Component({
//   selector: 'dps-post-office-grid-filter',
//   templateUrl: './post-office-grid-filter.component.html',
//   styleUrls: ['./post-office-grid-filter.component.scss']
// })
// export class PostOfficeGridFilterComponent implements OnInit {

//   constructor() { }

//   @Input() groupList: Group[];
//   @Input() typeList: any[];
//   @Input() selectedInfo: SelectedInfo;
//   @Output() updateSelectedInfo = new EventEmitter<any>();

//   get selectedGroup() {
//     if (this.groupList && this.selectedInfo) {
//       return this.groupList.find((group) => group.groupId === this.selectedInfo.groupId);
//     }
//     return null;
//   }


//   onChangeGroup(event) {
//     let newValue = { kind: GridFilterKind.group, value: null };
//     if (event.value) {
//       newValue = { kind: GridFilterKind.group, value: event.value.groupId };
//     }
//     this.updateSelectedInfo.emit(newValue);
//   }

//   removeSelectedUser() {
//     const newValue = { kind: GridFilterKind.group, value: this.selectedInfo.groupId };
//     this.updateSelectedInfo.emit(newValue);
//   }

//   ngOnInit() {
//   }

// }
